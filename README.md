[![Build Size](https://img.shields.io/bundlephobia/minzip/caro-kann?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=caro-kann)
[![Version](https://img.shields.io/npm/v/caro-kann?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/caro-kann)
[![Downloads](https://img.shields.io/npm/dt/caro-kann.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/caro-kann)



[Caro-Kann Korean Docs / 한국어 공식 문서](https://lackluster.tistory.com/151)

&nbsp;

# Caro-Kann

Caro-Kann is a global state management tool internally built with the useSyncExternalStore hook. It supports TypeScript and is compatible with both Next.js and React.js. With a syntax similar to useState, Caro-Kann is intuitive for developers familiar with React.js.

&nbsp;

# what's new in caro-kann@2.2.0
* The new version of Caro-Kann includes a feature commonly referred to as persist, which integrates local storage, session storage, and cookies. This allows the application's state to be continuously saved and easily restored. With persist, the state can be maintained even after a page refresh or session termination.
* It also supports version management for persist, enabling easy conversion or discarding of data from previous versions when the application's state structure changes.

&nbsp;

# install and import
```ts
npm i caro-kann@latest
```
```ts
import { playTartakower } from "caro-kann";
```

&nbsp;
# create a store with playTartakower

In Caro-Kann, a **store** is defined as an external space where the global state is stored. To create such a store, Caro-Kann uses the playTartakower function. This function takes an initial value, stores it in the internal store, and returns an object consisting of `useBoard`, `useDerivedBoard`, and `BoardContext`.

```ts
const {
  useBoard,
  useDerivedBoard,
  BoardContext,
} = playTartakower({ a: 0, b: 0, c: 0 });
```

It is important to remember that the evaluation of the playTartakower function must occur outside of the component. Otherwise, the store may be lost depending on the component's lifecycle.

&nbsp;
# useBoard

useBoard is a custom hook that return `[board, setBoard]` tuple just like useState in React.js.

```tsx
function CompA() {
  const [board, setBoard] = useBoard();
  
  return (
    <button onClick={() => setBoard(prev => ({...prev, a: prev.a + 1}))}>
      Now a is { board.a }. Next, a will be { board.a + 1 } 
    </button>
  )
}
```
When working with nested object states, Caro-Kann offers several ways to update them. The first method is to use the spread operator to copy each level of the object. This allows you to manually merge the new state value into the existing one.
```tsx
const { useBoard } = playTartakower({
  deep: {
    nested: {
      obj: { count: 0 }
    }
  }
})

const [board, setBoard] = useBoard()

setBoard(store => ({
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
 
const [board, setBoard] = useBoard()
 
setBoard(produce(store => { ++store.deep.nested.obj.count }))
```

As we’ll explore in more detail under "selector functions," by using a selector function with useBoard, setBoard can recognize nested properties, allowing you to easily update nested object states.

```tsx
const [count, setCount] = useBoard(store => store.deep.nested.obj.count)
 
setCount(prev => prev + 1)
```



## selecter function

If a component references a global state in the form of an object structure, the component will re-render even if properties that are not being used are changed. To prevent this, useBoard allows retrieving only specific property values from the global state in the form of an object through a selector function. In the example code below, the component will not re-render even when the a property value of the global state is changed. What's more, when a selector function is used, the setter no longer targets the entire set of properties but instead modifies only the specific properties selected by the selector function.
```tsx
function Comp() {
  const [b, setB] = useBoard(store => store.b);
  
  return (
    <button onClick={() => setB(prev => prev + 1}>
      Now b is { b }. Next, b will be { b + 1 } 
    </button>
  )
}
```
However, even if a component only uses the value of a, there may be cases where you need to modify the value of b. To handle this situation, when a selector function is provided, useBoard returns setBoard as the third element of the tuple.
```tsx
function Comp() {
  const [a, setA, setBoard] = useBoard(store => store.a);
  
  return (
    <>
      <button onClick={() => setA(prev => prev + 1}>
        Now a is { a }. Next, a will be { a + 1 } 
      </button>
      <button onClick={() => setBoard(prev => ({...prev, b: prev.b + 1})}>
        change b
      </button>
    </>
  )
}
```
By using selector functions, you can effectively handle nested object states as shown below. To write selector functions, there are a few rules to follow. First, all selector functions must be written as arrow functions. Also, variables cannot be used to select values from the nested object state within the store. Lastly, the five special characters { ? : & } cannot be used in selector functions. If you don't follow these rules while writing selector functions, you will encounter runtime errors. :)

```tsx
const { useBoard } = playTartakower({
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
const [atoZ, setAtoZ] = useBoard(getAtoZ) // ok

// It is fine to mix dot notation and bracket notation
const [e, setE] = useBoard(store => store["b"].d.e) // ok

// Variables cannot be used within bracket notation
const c = "c"
const [c, setC] = useBoard(store => store.b[c]) // Error

// Special characters { ? : & } cannot be used
const [b, setB] = useBoard(store => typeof store.b !== object ? true : false) // Error
const [f, setF] = useBoard({ b: { d: { f }}} => f) // Error
```

&nbsp;

# useDerivedBoard

Just like useBoard accepts a selector function, **useDerivedBoard accepts a derivation function**. However, unlike selector functions, there are no specific restrictions on derivation functions.
Using a derivation function, you can create **derived states** based on existing states, similar to derived atoms in Jotai. This is useful for enhancing the reusability and composability of states, and helps simplify complex state management logic. Like derived atoms, **derived states are recalculated whenever the referenced state changes**.
```tsx
function CompB() {
  const [a, setA] = useBoard(store => store.a)
 
  return (
    <button onClick={() => setA(prev => prev + 1)}>
      Now a is { a }. Next, a will be { a + 1 } 
    </button>
  )
}
 
function CompC() {
  const hasVotingRights = useDerivedBoard(store => store.a >= 18);
 
  return (
    <div>
      {
        hasVotingRights
          ? "You have voting rights."
          : "You do not have voting rights.";
      }
    </div>;
  );
};
```
<img width="1374" alt="스크린샷 2024-08-25 오후 7 58 02" src="https://img1.daumcdn.net/thumb/R1600x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FEeQEP%2FbtsLpa2XhCx%2FbmxMgUChLBdaDIkFU4lqyK%2Fimg.webp">

&nbsp;

# BoardContext

If needed, you can use the BoardContext component to make a specific node in the DOM tree subscribe to a store that is different from the global state. The BoardContext component takes a value prop, which can only accept values that are compatible with the type of the initial value provided to playTartakower.

Looking at the code below, you’ll see that the same CompA component is used twice. However, depending on whether it is inside or outside of the BoardContext, the component will fetch its a value from different stores. The CompA outside of the BoardContext will get its value from the global state, while the CompA inside the BoardContext will get its value from the BoardContext.

```tsx
const {
  useBoard,
  useDerivedBoard,
  BoardContext,
} = playTartakower({ a: 0, b: 0, c: 0 });
 
export default function Page() {
  return (
    <div>
      <CompA />
      <BoardContext value={{ a: 15, b: 0, c: 0 }}>
        <CompA />
        <CompC />
      </BoardContext>
    </div>
  )
}
 
function CompA() {
  const [board, setBoard] = useBoard();
  
  return (
    <button onClick={() => setBoard(prev => ({...prev, a: prev.a + 1}))}>
      Now a is { board.a }. Next, a will be { board.a + 1 } 
    </button>
  )
}
 
function CompC() {
  const hasVotingRights = useDerivedBoard(
    store => store.a >= 18
      ? "You have voting rights."
      : "You do not have voting rights.";
  );
 
  return <div>{hasVotingRights}</div>;
};
```

Looking at the image below, you can see that each component is being handled independently.

<img width="1374" alt="스크린샷 2024-08-25 오후 7 58 02" src="https://img1.daumcdn.net/thumb/R1600x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FoCs3K%2FbtsLmsrboSC%2FKnsN9OfiigvlIeNK4mcHd1%2Fimg.webp">

&nbsp;

# Persist

Caro-Kann allows global state to be stored in local storage, session storage, and cookies. This feature is especially important for improving user experience and is suitable for values that need to persist even after a page refresh or session termination, such as the theme settings of a webpage.

```tsx
type Theme = "light" | "dark";
 
const { useBoard: useThemeBoard } = playTartakower<Theme>(
  "light",
  {
    local: "theme",
 // session: "theme",
 // cookie: "theme",
  }
);
```

| Key   | Value                          |
|-------|--------------------------------|
| theme | {"state":"light","version":0}  |


## migrate

When storing global state in Caro-Kann, the state is stored alongside a version. This allows the application to easily transform or disregard data from previous versions if the state structure changes. For example, if the theme needs to include font size in addition to background color, Caro-Kann handles this using the migrate object.

If the migrate object exists, Caro-Kann automatically checks for version differences when the client connects to the service. If the client’s state is not the latest version, it calls the migrate.strategy function to update the state to the latest version. The strategy method takes the existing state and version from the client as arguments and returns the updated state based on them.

```tsx
type Theme = { color: "light" | "dark", fontSize: number };
 
const { useBoard: useThemeBoard } = playTartakower<Theme>(
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
 
const { useBoard: useThemeBoard } = playTartakower<Theme>(
  { color: "light", ["font-size"]: 16 },
  {
    local: "theme",
    migrate: {
      version: 2,
      strategy,
    },
  }
);
```
| Key   | Value                                                 |
|-------|-------------------------------------------------------|
| theme | {"state":{"color":"dark","font-size":16},"version":2} |


If there are multiple previous versions, it becomes practically impossible to specify the type of prevState. This leads to the use of any, which prevents Caro-Kann from correctly inferring the state. Therefore, if you are using migrate for version management, you must provide a generic type to playTartakower to ensure that Caro-Kann can correctly infer the state type.
