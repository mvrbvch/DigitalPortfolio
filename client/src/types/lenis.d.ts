declare module '@studio-freight/lenis' {
  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    direction?: 'vertical' | 'horizontal';
    smooth?: boolean;
  }

  export default class Lenis {
    constructor(options: LenisOptions);
    raf(time: number): void;
  }
}
