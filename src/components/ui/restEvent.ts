// Fired by SessionGuard the moment play time is up. Anything that makes sound
// or fills the screen (the video player) listens and stops, so the rest screen
// is never drawn over a cartoon that is still talking.
export const REST_EVENT = 'kina-wige-rest';
