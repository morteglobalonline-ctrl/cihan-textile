import type Lenis from "lenis";

/**
 * A one-slot holder for the page's Lenis instance.
 *
 * The intro overlay has to stop Lenis while it plays. It consumes the wheel
 * itself, but Lenis listens on the window too and keeps accumulating a virtual
 * scroll target behind the locked body — so the moment the lock lifted, the page
 * jumped thousands of pixels down and the hero was already gone.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}
