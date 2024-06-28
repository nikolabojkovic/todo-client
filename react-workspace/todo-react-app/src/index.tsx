import './index.scss';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import App from './App';
import { State, TodoStateProvider } from './context';
import { ITodo } from './models';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const initialState = new State([] as ITodo[]);

root.render(
  // beautifu dnd does not work when react is in strict mode
  // <React.StrictMode>
  //   <TodoStateProvider {...{initialState}}>
  //     <App />
  //   </TodoStateProvider>
  // </React.StrictMode>
  <TodoStateProvider {...{initialState}}>
    <App />
  </TodoStateProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
//reportWebVitals(console.log);
