# Caro-Kann
Caro-Kann is a TypeScript Library for managing 'global state' in React.js and Next.js.

If you looking for a very simple form of state-management solution, Caro-kann could be an option for you. Caro-Kann is simple to use, but has all the features we needs. You only need to know two hooks: playTartakower and useBoard.

# How to use
## install
`npm i caro-kann`
## import
`import playTartakower from "caro-kann";`
## create a store
playTartakower is a custom hook that creates a store that contains global states.
```ts
type Obj = {
  name : string;
  age : number;
}

const useBoard = playTartakower<Obj>({ name: "Caro-Kann", age: 28 });
```
## use a store
useBoard is a custom hook that return `[board, setBoard]` tuple just like useState in React.js. board contains state, and you can update state use setBoard function.
```ts
const [board, setBoard] = useBoard<Obj>();
```
