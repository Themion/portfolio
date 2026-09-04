import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

// `AstroComponentFactory` is the low-level *runtime* factory shape Astro's compiler output
// actually calls — `(result, props, slots) => ...` — and its `props` is untyped (`any`). But
// that isn't the type `astro check` (the Astro language server) assigns to a `.astro` file's
// default export when it's imported and used elsewhere: verified via `astro check`, a real
// component shows up as a single-argument `(props: Props) => any`, props directly, no `result`/
// `slots`. So a component map that wants real prop-checking (for both our own `.astro` components
// and inline function overrides passed as `components={{ x: (props) => ... }}`) has to match
// *that* shape, not `AstroComponentFactory` — extending/intersecting the latter doesn't help
// either, since TypeScript merges the inherited `(any, any, any)` signature back in as an
// overload and keeps offering it for contextual parameter typing.
export type AstroComponent<Props = Record<string, unknown>> = (props: Props) => ReturnType<AstroComponentFactory>;
