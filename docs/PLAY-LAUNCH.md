# Kina Wige on Google Play — launch guide

Started 2026-10-06. Personal Play Console account, identity verified.
Tracked as section **L** in `ROADMAP.md`.

The critical path is the **14-day closed test**. Nothing else takes as long, and
the clock only starts once a build is live in a closed-testing track with 12
testers opted in. Every step below is ordered to start that clock as early as
possible.

---

## 1. The sequence

| # | Step | Who | Blocks |
|---|------|-----|--------|
| 1 | Push `main` so Vercel deploys the onboarding / gate / play-time build | Owner approves | Everything — the Android app wraps the live site |
| 2 | Package with PWABuilder (section 2) | Owner | Upload |
| 3 | Create the app in Play Console, complete "Set up your app" (section 4) | Owner | Any release, including closed testing |
| 4 | Upload the `.aab` to **Closed testing**, add testers, roll out | Owner | The 14-day clock |
| 5 | Add both fingerprints to `public/.well-known/assetlinks.json`, deploy (section 3) | Assistant, once owner pastes the SHA-256s | Removing the browser URL bar |
| 6 | Run the 14 days (section 5), keep the evidence log | Whole team | Production access |
| 7 | Apply for production access (section 6) | Owner | Public launch |

Recruit testers **now**, in parallel with steps 1–4. A list of Gmail addresses
ready on the day the build is uploaded saves days.

## 2. Packaging — PWABuilder

1. Open https://www.pwabuilder.com and enter the live URL
   (`https://kina-wige.vercel.app` today — see the domain note below).
2. **Package for stores → Android → Google Play**, then **Options**:

| Field | Value |
|---|---|
| Package ID | `rw.kinawige.app` — **permanent once uploaded** |
| App name / Launcher name | `Kina Wige` |
| Version / version code | `1.0.0` / `1` |
| Host / Start URL | the live host / `/` |
| Theme, background, status bar, nav bar colour | `#17543C` |
| Display mode | Standalone |
| Notification delegation | **Off** — the app sends none |
| Location delegation | **Off** |
| Google Play Billing | **Off** — no payment route exists |
| Signing key | **Create new** |

3. Download the zip. It contains:
   - `*.aab` — the file you upload to Play
   - `signing.keystore` and `signing-key-info.txt` — **the key and its
     passwords. Keep two copies somewhere safe and private. Lose them and the
     app can never be updated.** Never paste them into a chat with anyone,
     including an AI assistant.
   - `assetlinks.json` — hand this to the assistant (it contains no secret).

**Domain note.** The Android app is tied to the host it was packaged with. If
`kinawige.rw` is registered later, moving the app to it is an app update
(re-package with the new host + `assetlinks.json` on the new domain), not a
new app. Packaging on `kina-wige.vercel.app` now is fine.

## 3. Digital Asset Links

Without this file the app opens with a browser address bar across the top and
looks like a web page in a frame.

After the first upload, Play re-signs the app with its own key, so the file
needs **two** fingerprints: the upload key (from PWABuilder's
`assetlinks.json`) and the app-signing key (Play Console → Test and release →
Setup → **App signing** → *App signing key certificate* → SHA-256).

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "rw.kinawige.app",
    "sha256_cert_fingerprints": ["<UPLOAD KEY SHA-256>", "<APP SIGNING KEY SHA-256>"]
  }
}]
```

Goes in `public/.well-known/assetlinks.json`. Check after deploy:
`https://<host>/.well-known/assetlinks.json` must return this JSON with
`Content-Type: application/json`.

## 4. Play Console — "Set up your app"

| Item | Answer |
|---|---|
| App or game / Free or paid | App / Free |
| Default listing language | English (United States). Kinyarwanda is **not** a supported listing language; add French (France). |
| App access | All functionality available without special access. Add instructions for the reviewer: *"The parent area opens by pressing and holding the greeting at the top of the home screen for 3 seconds, then typing the number shown in words."* |
| Ads | No |
| Content rating (IARC) | Category: Reference, News or Educational. No to violence, fear, sexuality, language, drugs, gambling, user interaction, sharing location, purchases. |
| Target audience | **5 and under** and **6–8** — setup offers ages 3 to 6, so a six-year-old is in scope. Appeals to children: Yes. |
| Families policy | Comply. No ads, no analytics, no SDKs, no data sent anywhere. |
| Data safety | Collects **no** data, shares **no** data. The child's nickname and progress stay on the device and are never transmitted — Play counts only data that leaves the device. |
| Privacy policy URL | `https://kina-wige-site.vercel.app/privacy/` (until the domain exists) |
| Government / financial / health / news | No |
| Category / tags | Education · Education, Family |

### Store listing

- **App name (30):** `Kina Wige — Play and Learn`
- **Short description (80):** `Play and learn in Kinyarwanda. Works with no internet, ages 3–6.`
- **Graphics:** `Downloads/KinaWige/Play Store/app-icon-512.png` (512×512, 32-bit
  with alpha) and `feature-graphic-1024x500.png`. Still needed: at least 2
  phone screenshots at 1080×1920, and 4 tablet screenshots.
- **Full description:**

> Kina Wige is a learning app for Rwandan children aged 3 to 6, built in Kinyarwanda first.
>
> **It works with no internet.** After the first install, every video, game and story is on the phone. No data bundle, no buffering.
>
> **Nothing leaves the phone.** No account, no adverts, no tracking. Your child's progress is stored on your own device and is never sent anywhere.
>
> **Your child sees only their own screens.** You set the app up once. After that it opens straight into your child's world, and the grown-up area stays locked behind a question a small child cannot answer.
>
> **It is designed to end.** You choose the play time — 10 to 20 minutes. When it is up, Kina goes to sleep and sends your child off to play. Only you can allow more.
>
> **What is inside:** teaching videos in Kinyarwanda, games that train memory, counting, logic and sorting, and Baza Keza — a question-and-answer friend that works offline and only ever gives answers a parent can read.
>
> **For parents:** a report on your own phone showing what your child can do and which skill each activity trains, and an off-screen idea to try together every day.
>
> Kinyarwanda, English and French — every word in the app exists in all three.
>
> Made in Kigali by Kina Wige LTD.

Every sentence above is true of the current build. Keep it that way: Google
rejects for misleading claims, and so do parents.

## 5. The closed test — 12 testers, 14 days

**Rules that catch people out**

- 12 testers must be opted in **continuously for the same 14 days**. Recruit
  **20**; some will drop.
- Testers must install **from Play through the opt-in link**, signed in with
  the Gmail address you added. Using the website or an APK does not count.
- Google checks that testers actually **used** the app. Installs alone fail.
- The closed track's countries must include **Rwanda**.
- Google's production form asks how you recruited, what feedback you got and
  what you changed. **Collect that evidence from day one** (the log below).

**Where to find 20 testers — different groups, not one circle of friends**

| Pool | Who asks |
|---|---|
| Parents in the founders' families and churches, with Android phones | All four |
| Teachers Eric has worked with | Eric |
| The ECD centres being considered for the pilot | Sharoze, Eric |
| Followers who respond to a Kina Wige post | Queen |
| Other Resolution and HATANA fellows with young children | Sharoze |

**Message 1 — the ask** (WhatsApp)

> *KN —* Muraho [izina]! Twakoze Kina Wige — porogaramu yigisha abana b'imyaka 3 kugeza kuri 6 mu Kinyarwanda, ikora nta murandasi. Mbere y'uko ijya kuri Play Store, Google isaba abantu 12 bayigerageza mu minsi 14. Wadufasha? Ukeneye telefoni ya Android na aderesi ya Gmail. Kwiyandikisha bimara iminota 2; hanyuma uyifungure n'umwana wawe inshuro nke mu byumweru bibiri, utubwire uko ubibona. Nyoherereza aderesi yawe ya Gmail nkoherereze link. Murakoze! 🙏
>
> *EN —* Hi [name]! We've built Kina Wige, a learning app for children aged 3 to 6, in Kinyarwanda, that works without internet. Before it goes on the Play Store, Google needs 12 people to test it for 14 days. Could you help? You need an Android phone and a Gmail address. Joining takes 2 minutes; then just open it with your child a few times over two weeks and tell us what you think. Reply with your Gmail address and I'll send the link. Thank you! 🙏
>
> *FR —* Bonjour [prénom] ! Nous avons créé Kina Wige, une application d'apprentissage pour les enfants de 3 à 6 ans, en kinyarwanda, qui fonctionne sans internet. Avant sa sortie sur le Play Store, Google exige que 12 personnes la testent pendant 14 jours. Pourriez-vous nous aider ? Il vous faut un téléphone Android et une adresse Gmail. L'inscription prend 2 minutes ; ensuite, ouvrez-la avec votre enfant quelques fois sur deux semaines et dites-nous ce que vous en pensez. Répondez avec votre adresse Gmail et je vous envoie le lien. Merci ! 🙏

**Message 2 — how to join** (send once their Gmail is added in Play Console)

> 1. On your Android phone, signed in with that Gmail, open: **[opt-in link]**
> 2. Tap **Become a tester**.
> 3. Tap **Download it on Google Play** and install Kina Wige.
> 4. Do the one-minute setup, then hand the phone to your child.
> 5. Please keep it installed for 14 days and open it every 2–3 days.

**The 14 days** — one short message a day in a testers' WhatsApp group. Every
third day, ask one question and copy the answers into the evidence log.

| Day | Message |
|---|---|
| 1 | Welcome. Install and set up. Did setup make sense? *(question)* |
| 2 | Try the first lesson together — the vowels. |
| 3 | Open the grown-up area: press and hold your child's name for 3 seconds. Could you get in? *(question)* |
| 4 | Today: the counting game. |
| 5 | Ask your child to show you their favourite video. |
| 6 | Did the play-time limit feel too short, too long, or right? *(question)* |
| 7 | Halfway. Check the parent report — what does it say your child can do? |
| 8 | Try today's off-screen idea in the grown-up area. |
| 9 | Was the Kinyarwanda natural for your child? Any word that sounded wrong? *(question)* |
| 10 | Today: ask Baza Keza a question together. |
| 11 | Try it with the internet switched off. |
| 12 | What is one thing you would change? *(question)* |
| 13 | Read a story in Books together. |
| 14 | Thank you. Please keep it installed until we confirm production access. |

**Evidence log** — a shared sheet with these columns:

| Date | Tester (initials) | Phone model | What they said | What we changed | Commit / version |
|---|---|---|---|---|---|

Ship at least one real fix from tester feedback during the 14 days and record
it. "We changed X because a tester said Y" is the single strongest answer on
the production form.

## 6. Applying for production

Ten questions, roughly 300 characters each. Answer with numbers and named
fixes from the evidence log — testers recruited, from which groups, how many
stayed, what they reported, what changed, which version. Do not answer with
generalities; reviewers reject vague answers and ask for more testing.

## 7. Watched competitor — Apples & Bananas (USP Digital)

Researched 2026-10-06 from its store listings and website. 500k+ installs on
Play; English only; ages 0–8; about 497 MB on iOS; USD 9.99/month or
49.99/year with a 7-day trial; kidSAFE and COPPA; parent dashboard, multiple
child profiles, age bands, co-play suggestions, printable worksheets; offline
for *selected* games only. Its App Store privacy label lists identifiers and
usage data **linked to the user** for analytics.

Adopted, in our own way: grown-up setup that personalises by age (L1), a
parent area with a daily co-play idea (L5), printed material alongside the app
(the books). Not adopted: accounts, analytics, trial-then-paywall.

Where Kina Wige is different and should say so: Kinyarwanda first; the whole
app works offline, not selected games; about 4.4 MB to install and about 80 MB
once every video has been watched (each video downloads on first play),
against roughly 497 MB; nothing collected; a session that ends; 2,000 RWF rather than ten dollars.
