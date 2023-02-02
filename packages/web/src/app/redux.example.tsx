import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementByAmountAsync,
  selectCount,
} from "@store/slices/couter.slice";
import store, { AppDispatch } from "@store/index";

export default function ReduxExample() {
  const dispatch = useDispatch<AppDispatch>();
  const count = useSelector(selectCount);
  return (
    <div>
      <p>测试 react-redux 的功能</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByAmount(10))}>+10</button>
      <button onClick={() => store.dispatch(incrementByAmountAsync(20))}>
        +20 Async (1000ms later)
      </button>
      <div>
        <div>{count}</div>
      </div>
    </div>
  )
}