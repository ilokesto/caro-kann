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
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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

# install and import
```ts
npm i caro-kann
```
```ts
import { playTartakower } from "Sicilian";
```


&nbsp;
# create a store with playTartakower

To create a store that can store external state, you need to execute the playTartakower function. This function takes an initial value, stores it in an internal store, and returns an object consisting of useBoard and BoardContext.

One crucial point to remember is that the evaluation of the playTartakower function must occur outside of a component. This is because Caro-Kann operates based on global state.

```ts
// @/hooks/useBoard/Human.ts
const { useBoard, BoardContext} = playTartakower({ name: "Caro-Kann", age: 28, canStand: true });

export { useBoard, BoardContext }
```

# useBoard

useBoard is a custom hook that return `[board, setBoard]` tuple just like useState in React.js.

```tsx
export default function Comp() {
  const [board, setBoard] = useBoard();

  const handleClick = (n: number) => () => {
    return setBoard((prev) => prev + n)
  }

  return (
    <div>
      <p>{board.name}</p>
      <p>{board.age}</p>

      <button type="button" onClick={handleClick(1)}>
        get old!
      </button>
    </div>
  );
}
```

## useBoard with selecterFn

If a component references a global state in the form of an object, the component will re-render even if a property that the component does not use changes. To prevent this, **useBoard allows you to retrieve only specific property values from the global state object through a selector function**. In the example code below, the component does not re-render when the canStand value in the global state changes.

```tsx
export default function Comp() {
  const [humanName] = useBoard((prev) => prev.name);
  const [humanAge] = useBoard((prev) => prev.age);

  return (
    <div>
      <p>{humanName}</p>
      <p>{humanAge}</p>
    </div>
  );
}
```

### Caution When Using Selector Functions

The selector function must return an existing property from the global state. What happens if, instead of selecting the name and age properties separately, you return a new object that combines these values, as in the example above? In this case, although type inference will work correctly, you will immediately run into an infinite loop that will crash the call stack. This issue is related to the snapshotCache problem in useSyncExternalStore.

```tsx
export default function Comp() {
  // call-stack explosion!!
  const [human] = useBoard((prev) => ({ name: prev.name, age: prev.age}));

  return (
    <div>
      <p>{human.name}</p>
      <p>{human.age}</p>
    </div>
  );
}
```
It's not impossible to work around this issue and use a new object, but doing so makes maintenance more difficult and increases the likelihood of human error during collaboration. Therefore, I won't present any of the workarounds I've discovered here. It's recommended that you avoid returning a new object through the selector function and instead **write your code to return an existing property from the global state**.

The selector function determines which value to set in the 'board' located at the 0th index of the tuple. This means that the presence of a selector function does not affect the behavior of the setBoard function in any way.

```tsx
export default function Comp() {
  const [humanName, setBoard] = useBoard((prev) => prev.name);
  const [humanAge] = useBoard((prev) => prev.age);

  return (
    <div>
      <p>{humanName}</p>
      <p>{humanAge}</p>
    </div>
  );
}
```

## useBoard with calcFn

Earlier, I mentioned that "the selector function determines the board value." By leveraging this characteristic of the selector function, it can be used similarly to derived atoms in Jotai. This characteristic of the selector function can be referred to as a calculation function, and the state derived through the calculation function is called a derived state. Like derived atoms, **derived states are automatically recalculated whenever the existing state changes**.

```tsx
export default function Comp() {
  const [age, setAge] = useBoard();
  const [isOld] = useBoard((prev) => (prev > 30 ? true : false));

  const handleClick = (n: number) => () => {
    return setAge((prev) => prev + n)
  }

  return (
    <>
      <p>{`님 나이 ${isOld ? "벌써" : "아직"} ${age}이에요? ${isOld ? "너무 늙으신 듯" : "아직 응애네"}`}</p>

      <button type="button" onClick={handleClick(1)}>
        get old!
      </button>
    </>
  );
}
```

<img width="1374" alt="스크린샷 2024-08-25 오후 7 58 02" src="https://img1.daumcdn.net/thumb/R1600x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FMvyus%2FbtsHptAkZ7O%2FMyog9aEw7uzmWlXGqFzj1K%2Fimg.webp">

Derived state is confined within the scope of a single component. If you want to use the same derived state across multiple components, separating it into a custom hook can be a viable solution.


```tsx
// @/hooks/useBoard/age.ts
export const useAgeBoard = playTartakower(25);

// @/hooks/useBoard/calcFn/isOld.ts
export const useIsOld = () => {
  const isOldCalcFn = (prev) => prev > 30 ? true : false
  
  const [isOld] = useAgeBoard(isOldCalcFn);
  
  return isOld
}

// @/page/comp.tsx
export default function Comp() {
  const isOld = useIsOld();

  return {...}
}
```

&nbsp;

# BoardContext


If needed, you can use the BoardContext component to make useBoard subscribe to a different value than the global state within a specific component. The BoardContext component accepts a value prop, which must be of a type compatible with the initial value provided to playTartakower.

In the example below, the Comp component uses useBoard. However, the two Comp components will subscribe to different values depending on whether BoardContext is present or not.

```tsx
import { playTartakower } from "caro-kann";

const { useBoard, BoardContext } = playTartakower(3);

export default function Home() {
  return (
    <>
      <BoardContext value={5}>
        <Comp />
      </BoardContext>
      
      <Comp />
    </>
  );
}

const Comp = () => {
  const [state, setState] = useBoard();

  return (
    <>
      <p>{state}</p>
      <button onClick={() => setState((prev) => ++prev)}>+ 1</button>
    </>
  );
};
```

![화면 기록 2024-08-31 오후 3 20 02](https://img1.daumcdn.net/thumb/R1600x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FJ74Ep%2FbtsJlW1PXON%2FeXTlVyFBvrPds1RITYOQW0%2Fimg.webp)


