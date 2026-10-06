// Make the stylesheet work on older Android WebViews.
//
// WHY. Tailwind CSS 4 targets Chrome 111+ (March 2023). The Android 12 emulator
// in CI ships WebView 91, and on it the app rendered with NO styling at all —
// default buttons, no fonts, no layout — because Chrome < 99 does not know
// @layer and silently drops every rule inside it. Real phones whose WebView
// never updated (common on low-cost phones, often because the update itself
// costs data) would show parents exactly that.
//
// WHAT. The source stays as it is. After Tailwind has generated the
// stylesheet, these PostCSS steps add fallbacks so older engines get a working
// page while modern engines keep using the modern CSS:
//
//   • oklch() colours            → an rgb() fallback declared first   (Chrome 111)
//   • color-mix() with fixed colours → a precomputed colour first     (Chrome 111)
//   • 100dvh                      → a 100vh fallback declared first   (Chrome 108)
//   • translate/scale/rotate properties → a `transform` inside
//     @supports not (translate: 0), so only engines lacking them use it (Chrome 104)
//   • @layer                      → flattened, with the cascade order kept by
//     adjusting specificity — done LAST, after the steps above   (Chrome 99)
//
// Checked by the Android 12 (WebView 91) emulator run in CI. Inline styles do
// not pass through here: they use var(--app-height) instead of 100dvh — see
// index.css.

import type { AtRule, Declaration, Plugin, Rule } from 'postcss';
import postcssCascadeLayers from '@csstools/postcss-cascade-layers';
import postcssOklabFunction from '@csstools/postcss-oklab-function';
import postcssColorMixFunction from '@csstools/postcss-color-mix-function';

const DYNAMIC_VH = /(\d)(dvh|svh|lvh)\b/g;

function dvhFallback(): Plugin {
  return {
    postcssPlugin: 'kina-dvh-fallback',
    Declaration(decl: Declaration) {
      DYNAMIC_VH.lastIndex = 0;
      if (!DYNAMIC_VH.test(decl.value)) return;
      const fallback = decl.value.replace(DYNAMIC_VH, '$1vh');
      const prev = decl.prev();
      if (prev && prev.type === 'decl' && prev.prop === decl.prop && prev.value === fallback) return;
      decl.cloneBefore({ value: fallback });
    },
  };
}

/** Split on whitespace that is not inside parentheses. */
function splitTopLevel(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value.trim()) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) {
      if (current) parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function asTransform(prop: string, value: string): string | null {
  const [a, b] = splitTopLevel(value);
  if (!a || a === 'none') return null;
  if (prop === 'translate') return `translate(${a}, ${b ?? '0'})`;
  if (prop === 'scale') return `scale(${a}, ${b ?? a})`;
  if (prop === 'rotate') return b ? null : `rotate(${a})`; // 3-D rotate has no 2-D equivalent
  return null;
}

/**
 * Engines without the individual transform properties get an equivalent
 * `transform`. Only one transform utility is ever combined on an element in
 * this app; two on the same element would override each other here.
 */
function individualTransformFallback(): Plugin {
  return {
    postcssPlugin: 'kina-individual-transform-fallback',
    OnceExit(root, { AtRule }) {
      const pending: { rule: Rule; transform: string }[] = [];
      root.walkDecls(/^(translate|scale|rotate)$/, (decl) => {
        const rule = decl.parent;
        if (!rule || rule.type !== 'rule') return;
        const transform = asTransform(decl.prop, decl.value);
        if (transform) pending.push({ rule: rule as Rule, transform });
      });
      for (const { rule, transform } of pending) {
        const supports: AtRule = new AtRule({ name: 'supports', params: 'not (translate: 0)' });
        supports.append(rule.clone({ nodes: [] }).append({ prop: 'transform', value: transform }));
        rule.after(supports);
      }
    },
  };
}

export function cssCompatPlugins() {
  return [
    postcssOklabFunction({ preserve: true }),
    postcssColorMixFunction({ preserve: true }),
    dvhFallback(),
    individualTransformFallback(),
    // Last: it rewrites selectors, and everything above must already be in place.
    postcssCascadeLayers(),
  ];
}
