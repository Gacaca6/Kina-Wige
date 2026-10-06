// Which screens belong to grown-ups.
//
// One list, used by everything that has to know which lane it is in: the play
// timer (only the child's time counts), the parent-gate relock (leaving the
// grown-up area locks it again), and the rest screen (never covers an adult).

const GROWN_UP = ['/parents', '/settings', '/plan', '/welcome'];

export function isGrownUpPath(pathname: string): boolean {
  return GROWN_UP.some((p) => pathname === p || pathname.startsWith(p + '/'));
}
