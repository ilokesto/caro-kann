![caro 복사본](https://github.com/user-attachments/assets/1fa53294-205c-45a3-b6f8-b1be585ce11e)

[![Build Size](https://img.shields.io/bundlephobia/minzip/caro-kann?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=caro-kann)
[![Version](https://img.shields.io/npm/v/caro-kann?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/caro-kann)
[![Downloads](https://img.shields.io/npm/dt/caro-kann.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/caro-kann)




Caro-Kann is a global state management tool internally built with the useSyncExternalStore hook. It supports TypeScript and is compatible with both Next.js and React.js. With a syntax similar to useState, Caro-Kann is intuitive for developers familiar with React.js.

&nbsp;

official documents : https://caro-kann.vercel.com

&nbsp;

## what's new in caro-kann@3.0.0
* The new version of Caro-Kann has improved its internal code structure and actively implemented techniques such as tree shaking. As a result, the bundle size has been reduced by up to six times compared to version 2.2.0. In this process, StoreContext was removed, and useDerivedStore was integrated into the derived method of useStore.
* Semantics are important. Each feature and API is designed with a clear purpose and intent, enabling developers to write state management-related code in a more intuitive and intentional manner. API names and behaviors have been changed to be as intuitive as possible, minimizing ambiguity that could lead to mistakes. These semantic improvements not only enhance the way the code works but also improve the way it is read and understood, contributing to long-term maintainability and collaboration potential.
* In the previous version, the persist functionality included in create has been separated into a middleware. The middleware-based persist is designed to function independently of global state management, allowing it to be integrated easily without affecting existing state management logic. This separation significantly enhances the application's performance, maintainability, and scalability.
* The middleware includes persist along with reducer, zustand, and devtools functionality, allowing for flexible application of various state management features. Each function can be used independently or in combination, depending on the application's requirements.

&nbsp;

## install and import

```ts
npm i caro-kann@latest
```

```ts
import { create } from "caro-kann";
import { persist, zustand, reducer, devtools } from "caro-kann/middleware"
```

