declare module 'gsap' {
  export interface ScrollTrigger {
    create(options: any): any;
    refresh(): void;
    kill(): void;
  }

  interface GSAPStatic {
    to(target: any, vars: any): any;
    from(target: any, vars: any): any;
    registerPlugin(...args: any[]): void;
    utils: {
      toArray<T>(target: any): T[];
    };
  }

  const gsap: GSAPStatic;
  export default gsap;
}

declare module 'gsap/ScrollTrigger' {
  const ScrollTrigger: any;
  export { ScrollTrigger };
}
