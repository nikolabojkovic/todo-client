import './App.scss';
import { Tabs } from './components/Tabs';
import { Sorting } from './components/Sorting';
import { TodoList } from './components/TodoList';
import { TodoListProvider } from './context/TodosContext';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Todo List
      </header>
      <TodoListProvider>
        <Tabs/>
        <Sorting/>
        <TodoList/>
      </TodoListProvider>
    </div>
  );
}

export default App;
