import './App.scss';
import { TodoStateProvider } from './context/TodoListContext';
import { getList, saveList } from './providers/TodoProvider';

import { Tabs } from './components/Tabs/Tabs';
import { Sorting } from './components/Sort/Sorting';
import { TodoList } from './components/TodoList/TodoList';

import { State } from './context/IState';
import { ITodo } from './models/Todo';
import { Footer } from './components/Footer/Footer';
import { localStorageProvider } from './providers/StorageProvider';

function App() {   
  return (
    <div className="App" data-bs-theme="dark">
      <header className="App-header">
        Todo List
      </header>
      <TodoStateProvider initialState={new State([] as ITodo[])}>
        <Tabs/>
        <Sorting/>
        <TodoList getList={getList} saveList={saveList} localStorageProvider={localStorageProvider}/>        
        <Footer />
      </TodoStateProvider>
    </div>
  );
}

export default App;
