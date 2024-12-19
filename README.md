[Caro-Kann Korean Docs / 한국어 공식 문서](https://lackluster.tistory.com/151)


&nbsp;

# Caro-Kann

Caro-Kann is a global state management tool internally built with the useSyncExternalStore hook. It supports TypeScript and is compatible with both Next.js and React.js. With a syntax similar to useState, Caro-Kann is intuitive for developers familiar with React.js.

Like other state management tools, it requires no additional boilerplate to get started and is ready to use out of the box. Below is an example code snippet demonstrating how to use Caro-Kann:
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
        <CompB />
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

&nbsp;


# what's new in caro-kann@2.1.0
* In previous versions of Caro-Kann, using a selector function allowed you to retrieve only specific property values from the global state in object form. Therefore, regardless of the presence of a selector function, the setter always operated on the entire global state. Now, when a selector function is used, the setter can only modify the property value pointed to by the selector function.
* The selector function has been updated to effectively handle nested object states. However, this requires a specific way of writing the selector function. More details will be provided in the useBoard section below.
* With the change in how selector functions influence the behavior of the setter, the handling of derived states has also changed. Derived states are now obtained through useDerivedBoard instead of useBoard. Additionally, while useBoard returns a tuple, useDerivedBoard returns only the derived state without a setter.

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

In Caro-Kann, a **store** is defined as an external space where the global state is stored. To create such a store, Caro-Kann uses the playTartakower function. This function takes an initial value, stores it in the internal store, and returns an object consisting of useBoard, useDerivedBoard, and BoardContext.

It is important to remember that the evaluation of the playTartakower function must occur outside of the component. Otherwise, the store may be lost depending on the component's lifecycle.

```ts
const {
  useBoard,
  useDerivedBoard,
  BoardContext,
} = playTartakower({ a: 0, b: 0, c: 0 });
```

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


If needed, you can use the BoardContext component to make a specific node in the DOM tree subscribe to a store different from the global state. The BoardContext component accepts a value prop, which can only contain values that are compatible with the type of the initial value provided to playTartakower.

Now, let's return to the initial example. Both CompA and CompB are using the value of a from the object state. However, depending on the presence of BoardContext, CompA subscribes to the value of a from the global state, while CompB subscribes to the value of a provided by BoardContext. If you look at the image below, you can see that each component is handled independently.

<img width="1374" alt="스크린샷 2024-08-25 오후 7 58 02" src="https://img1.daumcdn.net/thumb/R1600x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FoCs3K%2FbtsLmsrboSC%2FKnsN9OfiigvlIeNK4mcHd1%2Fimg.webp">


