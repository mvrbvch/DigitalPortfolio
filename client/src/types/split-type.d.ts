declare module 'split-type' {
  export type TypesList = 'lines' | 'words' | 'chars' | string;
  
  export interface SplitTypeOptions {
    types?: TypesList | TypesList[];
    tagName?: string;
    lineClass?: string;
    wordClass?: string;
    charClass?: string;
    splitClass?: string;
    absolute?: boolean;
    [key: string]: any;
  }
  
  export default class SplitType {
    constructor(element: HTMLElement | string, options?: Partial<SplitTypeOptions>);
    chars: HTMLElement[];
    words: HTMLElement[];
    lines: HTMLElement[];
    options: SplitTypeOptions;
    elements: HTMLElement[];
    isSplit: boolean;
    revert(): void;
    split(options?: Partial<SplitTypeOptions>): this;
  }
}
