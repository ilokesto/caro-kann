
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/%40ilokesto%2Fcaro-kann?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=@ilokesto%2Fcaro-kann)
[![Version](https://img.shields.io/npm/v/%40ilokesto%2Fcaro-kann?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@ilokesto/caro-kann)
[![Downloads](https://img.shields.io/npm/dt/%40ilokesto%2Fcaro-kann.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@ilokesto/caro-kann)


[Official documents](https://ilokesto.vercel.com/caro-kann)

&nbsp;

Caro-Kann is a global state management tool internally built with the useSyncExternalStore hook. It supports TypeScript and is compatible with both Next.js and React.js. With a syntax similar to useState, Caro-Kann is intuitive for developers familiar with React.js.

&nbsp;

## What's new in caro-kann@4.0.0

*   Thanks to continuous refactoring, the bundle size has been reduced by nearly 30% in the new version, despite the addition of several new features.
*   The Zustand middleware has now been completely removed. Also, the usage of the validate middleware has changed.
*   `useStore.derived` has been renamed to `useStore.readOnly`. Additionally, a `writeOnly` method has been added to `useStore`. This allows for clearer and more efficient state management, even in components that need to change state but do not need to subscribe to the state directly. These changes make the code's intent clearer and contribute to reducing unnecessary re-renders.
*   The provider, which was removed in the previous version, has returned. This allows for the configuration of independent state trees within specific contexts, further enhancing the application's flexibility and reusability.
*   All rules to follow when writing selector functions have been removed. Consequently, developers can define selector functions freely without unnecessary constraints, which contributes to increasing the code's flexibility and expressiveness. Internally, selector processing has been improved, enabling stable state management without performance degradation despite this freedom.
*   `setValue` now always operates consistently, regardless of the presence or absence of a selector function. This change enhances the API's intuitiveness and significantly helps reduce the possibility of bugs caused by exceptional behavior. As a result, developers can update state in a more predictable and stable manner.
*   An `adaptor` utility function has been added for use with `setValue` to easily change complex object states.
*   A `merge` utility function has been added to combine multiple `useStore` instances. This allows developers to flexibly configure state using either a top-down approach with `selector function + adaptor` or a bottom-up approach with `merge`. Each approach can be selectively applied depending on the component structure or data flow, effectively addressing various architectural requirements. Overall, this update is an improvement that considers both consistency and scalability, significantly enhancing productivity and maintainability in actual development environments.

&nbsp;

## install and import

```ts
npm install @ilokesto/caro-kann
pnpm add @ilokesto/caro-kann
yarn add @ilokesto/caro-kann
bun add @ilokesto/caro-kann
```
