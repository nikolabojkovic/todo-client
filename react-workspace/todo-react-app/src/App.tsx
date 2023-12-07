import './App.scss';
import { Tabs } from './components/Tabs';
import { Sorting } from './components/Sorting';
import { TodoList } from './components/TodoList';
import { TodoStateProvider } from './context/TodoListContext';

import { State } from './context/IState';
import { ITodo } from './models/Todo';

function App() {   
  return (
    <div className="App" data-bs-theme="dark">
      <header className="App-header">
        Todo List
      </header>
      <TodoStateProvider todoList={new State([] as ITodo[])}>
        <Tabs/>
        <Sorting/>
        <TodoList/>
      </TodoStateProvider>
    </div>
  );
}

export default App;
