declare module 'split-type' {
  export default class SplitType {
    constructor(element: HTMLElement | string, options?: { types?: string });
    chars: HTMLElement[];
    words: HTMLElement[];
    lines: HTMLElement[];
    revert(): void;
  }
}
