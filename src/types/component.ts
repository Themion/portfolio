import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

// `astro check` types an imported `.astro` component as `(props: Props) => any`, not
// `AstroComponentFactory`'s `(result, props, slots)` — extending it doesn't help either, since TS
// keeps offering its untyped overload. Match the real shape directly instead.
export type AstroComponent<Props = Record<string, unknown>> = (props: Props) => ReturnType<AstroComponentFactory>;
