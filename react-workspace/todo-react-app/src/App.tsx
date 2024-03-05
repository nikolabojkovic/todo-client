import './App.scss';
import { Tabs } from './components/Tabs/Tabs';
import { Sorting } from './components/Sort/Sorting';
import { TodoList } from './components/TodoList/TodoList';
import { TodoStateProvider } from './context/TodoListContext';

import { State } from './context/IState';
import { ITodo } from './models/Todo';
import { Footer } from './components/Footer/Footer';

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
        <Footer />
      </TodoStateProvider>
    </div>
  );
}

export default App;
