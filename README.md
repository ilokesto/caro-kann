![caro 복사본](https://github.com/user-attachments/assets/1fa53294-205c-45a3-b6f8-b1be585ce11e)

[![Build Size](https://img.shields.io/bundlephobia/minzip/caro-kann?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=caro-kann)
[![Version](https://img.shields.io/npm/v/caro-kann?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/caro-kann)
[![Downloads](https://img.shields.io/npm/dt/caro-kann.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/caro-kann)


[Official documents](https://caro-kann.vercel.com/en)

&nbsp;

Caro-Kann is a global state management tool internally built with the useSyncExternalStore hook. It supports TypeScript and is compatible with both Next.js and React.js. With a syntax similar to useState, Caro-Kann is intuitive for developers familiar with React.js.

&nbsp;

##  what's new in caro-kann@3.1.0

* The new version of Caro-Kann introduces a variety of middleware options. Middleware such as logger, validate, and debounce enable more flexible state management.
* The zustand middleware is now deprecated. It can no longer be used for middleware composition and is no longer maintained. However, backward compatibility is still preserved.
* The migrate logic in the persist middleware has been updated. With the new migrate pipe, versioned persistence can now be handled more reliably and effectively.

&nbsp;

## install and import

```ts
npm i caro-kann@latest
```

```ts
import { create } from "caro-kann";
import { persist, zustand, reducer, devtools } from "caro-kann/middleware"
```

