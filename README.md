[![Build Size](https://img.shields.io/bundlephobia/minzip/caro-kann?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=caro-kann)
[![Version](https://img.shields.io/npm/v/caro-kann?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/caro-kann)
[![Downloads](https://img.shields.io/npm/dt/caro-kann.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/caro-kann)

[Caro-Kann Korean Docs / 한국어 공식 문서](https://lackluster.tistory.com/140)

- [Caro-Kann](#caro-kann)
- [what's new in caro-kann@3.0.0](#what-s-new-in-caro-kann-300)
- [install and import](#install-and-import)
- [create a store](#create-a-store)
  * [nested objects](#nested-objects)
  * [selector function](#selector-function)
  * [derived state](#derived-state)
- [Middleware](#middleware)
  * [persist](#persist)
  * [zustand](#zustand)
  * [reducer](#reducer)
  * [devtools](#devtools)
  * [Middleware Composition](#Middleware-Composition)


&nbsp;

# Caro-Kann

Caro-Kann is a global state management tool internally built with the useSyncExternalStore hook. It supports TypeScript and is compatible with both Next.js and React.js. With a syntax similar to useState, Caro-Kann is intuitive for developers familiar with React.js.

&nbsp;

# what's new in caro-kann@3.0.0
* The new version of Caro-Kann has improved its internal code structure and actively implemented techniques such as tree shaking. As a result, the bundle size has been reduced by up to six times compared to version 2.2.0. In this process, StoreContext was removed, and useDerivedStore was integrated into the derived method of useStore.
* Semantics are important. Each feature and API is designed with a clear purpose and intent, enabling developers to write state management-related code in a more intuitive and intentional manner. API names and behaviors have been changed to be as intuitive as possible, minimizing ambiguity that could lead to mistakes. These semantic improvements not only enhance the way the code works but also improve the way it is read and understood, contributing to long-term maintainability and collaboration potential.
* In the previous version, the persist functionality included in create has been separated into a middleware. The middleware-based persist is designed to function independently of global state management, allowing it to be integrated easily without affecting existing state management logic. This separation significantly enhances the application's performance, maintainability, and scalability.
* The middleware includes persist along with reducer, zustand, and devtools functionality, allowing for flexible application of various state management features. Each function can be used independently or in combination, depending on the application's requirements.

&nbsp;

# install and import

```ts
npm i caro-kann@latest
```

```ts
import { create } from "caro-kann";
import { persist, zustand, reducer, devtools } from "caro-kann/middleware"
```

&nbsp;

# create a store

In Caro-Kann, a **store** is defined as an external space where the global state is stored. To create such a store, Caro-Kann uses the `create` function. This function takes an initial value, stores it in the internal store, and returns `useStore`. It is important to remember that the evaluation of the create function must occur outside of the component. Otherwise, the store may be lost depending on the component's lifecycle.

```ts
const useStore = create({
  name: "Ayden Blair",
  age: 30,
  isMarried: false,
});
```

useStore is a custom hook that return `[store setStore]` tuple just like useState in React.js.

```tsx
function Comp() {
  const [value, setValue] = useStore();
  
  return (
    <button onClick={() => setValue(prev => ({...prev, age: prev.age + 1}))}>
      Now a is { value.age }. Next, a will be { value.age + 1 } 
    </button>
  )
}
```

&nbsp;

## nested objects

When working with nested object states, Caro-Kann offers several ways to update them. The first method is to use the spread operator to copy each level of the object. This allows you to manually merge the new state value into the existing one.

```tsx
const useStore = create({
  deep: {
    nested: {
      obj: { count: 0 }
    }
  }
})
 
const [value, setValue] = useStore()

setValue(store => ({
  deep: {
    ...state.deep,
    nested: {
      ...state.deep.nested,
      obj: {
        ...state.deep.nested.obj,
        count: state.deep.nested.obj.count + 1
      }
    }
  }
})
```

Using the Immer library, which helps with immutable state updates, makes it much simpler to update nested object states. Thanks to Caro-Kann's excellent type design, the produce function automatically infers the type of the store object without needing additional type annotations.

```tsx
// With Immer
import { produce } from 'immer';
 
const [value, setValue] = useStore()
 
setValue(produce(store => { ++store.deep.nested.obj.count }))
```

As we’ll explore in more detail under "selector functions," by using a selector function with useStore, setStore can recognize nested properties, allowing you to easily update nested object states.

```tsx
const [count, setCount] = useStore(store => store.deep.nested.obj.count)
 
setCount(prev => prev + 1)
```

&nbsp;

## selecter function

If a component references a global state in the form of an object structure, the component will re-render even if properties that are not being used are changed. To prevent this, useStore allows retrieving only specific property values from the global state in the form of an object through a selector function. In the example code below, the component will not re-render even when the a property value of the global state is changed. What's more, when a selector function is used, the setter no longer targets the entire set of properties but instead modifies only the specific properties selected by the selector function.

```tsx
function Comp() {
  const [age, setAge] = useStore(store => store.age);
  
  return (
    <button onClick={() => setAge(prev => prev + 1)}>
      Now age is { age }. Next, age will be { age + 1 } 
    </button>
  )
}
```

However, even if a component only uses the value of a, there may be cases where you need to modify the value of b. To handle this situation, when a selector function is provided, useStore returns setValue as the third element of the tuple.

```tsx
function Comp() {
  const [age, setAge, setValue] = useStore(store => store.age);
  
  return (
    <>
      <button onClick={() => setAge(prev => prev + 1)}>
        Now age is { age }. Next, age will be { age + 1 } 
      </button>
      <button onClick={() => setStore(prev => ({ ...prev, isMarried: true })}>
        Get Married
      </button>
    </>
  )
}
```

By using selector functions, you can effectively handle nested object states as shown below. To write selector functions, there are a few rules to follow. First, all selector functions must be written as arrow functions. Also, variables cannot be used to select values from the nested object state within the store. Lastly, the five special characters { ? : & } cannot be used in selector functions. If you don't follow these rules while writing selector functions, you will encounter runtime errors. :)

```tsx
const { useStore } = playTartakower({
  ["a-to-z"]: 0,
  b: {
    c: 0,
    d: {
      e: 0,
      f: 0
    }
  }
})

// Selector functions must only be arrow functions
const getAtoZ = (store) => store["a-to-z"]
const [atoZ, setAtoZ] = useStore(getAtoZ) // ok

// It is fine to mix dot notation and bracket notation
const [e, setE] = useStore(store => store["b"].d.e) // ok

// Variables cannot be used within bracket notation
const c = "c"
const [c, setC] = useStore(store => store.b[c]) // Error

// Special characters { ? : & } cannot be used
const [b, setB] = useStore(store => typeof store.b !== object ? true : false) // Error
const [f, setF] = useStore({ b: { d: { f }}} => f) // Error
```

&nbsp;

## derived state

In JavaScript, functions are first-class objects, meaning they can have properties and methods. useStore is both a function that returns a tuple and an object that has a method called derived. Similar to the selector function discussed earlier, the derived method takes a derived function as an argument. This method allows you to create a derived state based on the existing state. It is useful for improving the reusability and composability of state, simplifying complex state management logic. Derived state is recalculated whenever the referenced state changes.

```tsx
function Comp() {
  const [age, setAge] = useStore(store => store.age)

  return (
    <button onClick={() => setAge(prev => prev + 1)}>
      Now age is { age }. Next, age will be { age + 1 } 
    </button>
  )
}

function VotingRightsIndicator() {
  const hasVotingRights = useStore.derived(
    store => store.age >= 18
      ? "You have voting rights."
      : "You do not have voting rights.";
  );

  return <div>{hasVotingRights}</div>;
};
```

&nbsp;


# Middleware

Currently, Caro-Kann supports four middleware options: persist, zustand, reducer, and devtools. Through these, the create function can efficiently handle global state management, state persistence, state change logic, and debugging features, allowing for flexible application tailored to the application's structure and requirements.

&nbsp;

## persist

Caro-Kann allows global state to be stored in local storage, session storage, and cookies. This feature is especially important for improving user experience and is suitable for values that need to persist even after a page refresh or session termination, such as the theme settings of a webpage.

```tsx
const useStore = create(
  persist(initialState, persistOptions)
)
```

When storing global state in Caro-Kann, the state is stored alongside a version. This allows the application to easily transform or disregard data from previous versions if the state structure changes. For example, if the theme needs to include font size in addition to background color, Caro-Kann handles this using the migrate object.

```tsx
type Theme = "light" | "dark";
 
const useStore = create<Theme>(
  persist(
    "light",
    {
      local: "theme",
   // session: "theme",
   // cookie: "theme",
    }
  )
);
```

| Key   | Value                          |
|-------|--------------------------------|
| theme | {"state":"light","version":0}  |

If the migrate object exists, Caro-Kann automatically checks for version differences when the client connects to the service. If the client’s state is not the latest version, it calls the migrate.strategy function to update the state to the latest version. The strategy method takes the existing state and version from the client as arguments and returns the updated state based on them.

```tsx
type Theme = { color: "light" | "dark", fontSize: number };
 
const useStore = create<Theme>(
  persist(
    { color: "light", fontSize: 16 },
    {
      local: "theme",
      migrate: {
        version: 1,
        strategy: (prevState, prevVersion) => {
          return { color: prevState, fontSize: 16 };
        },
      },
    }
  )
);
```
| Key   | Value                                                |
|-------|------------------------------------------------------|
| theme | {"state":{"color":"dark","fontSize":16},"version":1} |

You successfully updated version 0 to version 1 using migrate. However, a few weeks later, a senior developer comes and asks to change the font state name to font-size. Since migrate only operates when the client connects to the service, clients who haven’t yet connected will still be on version 0. Therefore, you need to handle both version 0 and version 1.

But don't worry! By using a switch statement, you can effectively handle both versions.

```tsx
type Theme = { color: "light" | "dark", ["font-size"]: number };
 
const strategy = (prevState: any, prevVersion: number) => {
  switch (prevVersion) {
    case 0:
      return { color: prevState, ["font-size"]: 16 };
    case 1:
      return { color: prevState.color, ["font-size"]: prevState.fontSize };
    default:
      return prevState;
  }
}

const useStore = create<Theme>(
  persist(
    { color: "light", ["font-size"]: 16 },
    {
      local: "theme",
      migrate: {
        version: 2,
        strategy,
      },
    }
  )
);
```
| Key   | Value                                                 |
|-------|-------------------------------------------------------|
| theme | {"state":{"color":"dark","font-size":16},"version":2} |


If there are multiple previous versions, it becomes practically impossible to specify the type of prevState. This leads to the use of any, which prevents Caro-Kann from correctly inferring the state. Therefore, if you are using migrate for version management, you must provide a generic type to playTartakower to ensure that Caro-Kann can correctly infer the state type.

&nbsp;

## zustand

Caro-Kann's useStore function, by default, returns a tuple [value, setValue] similar to the useState API. This provides a straightforward and intuitive way to read and update state. However, when using the zustand middleware, the useStore function operates in a manner similar to the API provided by zustand. This allows developers to flexibly choose the state management approach as needed, even within the same project.

```tsx
const useStore = create<TStore>(
  zustand((set, get, api) => initialState)
)
```

When the zustand middleware is used, Caro-Kann fails to infer the store's type automatically. Therefore, it is necessary to explicitly define the store's type when calling the create function.

```tsx
type TStore = { count: number, increment: () => void, decrement: () => void }
 
const useStore = create<TStore>(
  zustand((set, get, api) => ({
    count: 0,
    increment: () => set({count: get().count + 1}),
    decrement: () => set(store => ({...store, count: store.count - 1})),
  }))
);
 
export default function Page() {
  const { count, increment, decrement } = useStore()
 
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
```

&nbsp;

## reducer

The reducer middleware in Caro-Kann handles centralized state transformations, making state changes predictable and consistent. This pattern, commonly used in Redux, is designed to update state while maintaining immutability. The reducer middleware primarily changes state through actions, centralizing state update logic.

```tsx
const useStore = create(
  reducer(reduceFn, initialState)
)
```

When the reducer middleware is used, useStore returns a tuple [value, dispatch] instead of [value, setValue]. The dispatch function takes an action object as its argument, triggering the logic defined in the reduceFn to update the state. The reduceFn is responsible for updating the state based on the type of each action, using the type and payload properties of the action object to define the update logic.

```tsx
const useStore = create(
  reducer((store, { type, payload = 1 }: { type: string, payload?: number }) => {
    switch (type) {
      case "INCREMENT":
        return { count: store.count + payload };
      case "DECREMENT":
        return { count: store.count - payload };
      default:
        return store;
    }
  },
  { count: 0 })
);
 
export default function Page() {
  const [count, dispatch] = useStore(store => store.count)
 
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch({ type: "INCREMENT", payload: 2 })}>Increment</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>Decrement</button>
    </div>
  )
}
```

&nbsp;


## devtools

The devtools middleware in Caro-Kann makes state management more intuitive and efficient. This middleware enables real-time tracking of state changes through the Redux DevTools extension. Developers gain clear visibility into how the state evolves, making debugging and optimization easier.

```tsx
const useStore = create(
  devtools(initialState, storeName)
)

```
For example, managing a count state with the devtools middleware allows real-time observation of state changes. Each button click, whether incrementing or decrementing the state, is recorded in Redux DevTools. This simplifies complex state management and debugging, significantly enhancing developer productivity.

```tsx
const useStore = create(
  devtools({ count: 0 }, "devtoolsTestStore")
);
 
export default function Page() {
  const [count, setCount] = useStore(store => store.count)
 
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  )
}
```

  <img width="840" alt="스크린샷 2024-08-25 오후 7 58 02" src="https://img1.daumcdn.net/thumb/R1600x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FW1Bg0%2FbtsLFcnV3hh%2FVsMA9H4B98lPMIWmt4Mqr0%2Fimg.png">

&nbsp;

## Middleware Composition

The various middleware in Caro-Kann can be combined and used based on specific conditions. If a middleware alters the behavior of setValue from the tuple returned by useStore, it cannot be used inside other middleware. Additionally, the middleware to be combined must be called at the initialState position. Therefore, Zustand middleware that does not return a tuple and instead takes initialFn instead of initialState cannot be combined with other middleware.

The reducer middleware takes initialState, but returns a dispatcher instead of setValue. As a result, it cannot be called at the initialState position of other middleware, but it can be combined by calling other middleware at the reducer's initialState position. On the other hand, the persist and devtools middleware have no such restrictions and can be freely combined with other middleware.

```tsx
const useStore = create(
  reducer(
    (store, { type, payload = 1 }: { type: string, payload?: number }) => {
      switch (type) {
        case "INCREMENT":
          return { count: store.count + payload };
        case "DECREMENT":
          return { count: store.count - payload };
        default:
          return store;
      }
    },
    persist(
      devtools(
        { count: 0 },
        "devtoolsTestStore"
      ),
      { local: "count" }
    )
  )
);

export default function Page() {
  const [count, dispatch] = useStore(store => store.count)
 
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch({ type: "INCREMENT", payload: 2 })}>Increment</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>Decrement</button>
    </div>
  )
}
```

&nbsp;




# StoreContext

If needed, you can use the StoreContext component to make a specific node in the DOM tree subscribe to a store that is different from the global state. The StoreContext component takes a value prop, which can only accept values that are compatible with the type of the initial value provided to playTartakower.

Looking at the code below, you’ll see that the same CompA component is used twice. However, depending on whether it is inside or outside of the StoreContext, the component will fetch its a value from different stores. The CompA outside of the StoreContext will get its value from the global state, while the CompA inside the StoreContext will get its value from the StoreContext.

```tsx
const {
  useStore,
  useDerivedStore,
  StoreContext,
} = playTartakower({ a: 0, b: 0, c: 0 });
 
export default function Page() {
  return (
    <div>
      <CompA />
      <StoreContext value={{ a: 15, b: 0, c: 0 }}>
        <CompA />
        <CompC />
      </StoreContext>
    </div>
  )
}
 
function CompA() {
  const [value, setValue] = useStore();
  
  return (
    <button onClick={() => setValue(prev => ({...prev, a: prev.a + 1}))}>
      Now a is { value.a }. Next, a will be { value.a + 1 } 
    </button>
  )
}
 
function CompC() {
  const hasVotingRights = useDerivedStore(
    store => store.a >= 18
      ? "You have voting rights."
      : "You do not have voting rights.";
  );
 
  return <div>{hasVotingRights}</div>;
};
```
