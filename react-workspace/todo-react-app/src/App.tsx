import './App.scss';
import { Tabs } from './components/Tabs';
import { Sorting } from './components/Sorting';
import { TodoList } from './components/TodoList';
import { TodoListProvider } from './context/TodoListContext';
import { todoServiceInstance } from "./services/TodoService";

function App() {
  let todoList = todoServiceInstance.getTodoList();

  return (
    <div className="App">
      <header className="App-header">
        Todo List
      </header>
      <TodoListProvider todoList={todoList}>
        <Tabs/>
        <Sorting/>
        <TodoList/>
      </TodoListProvider>
    </div>
  );
}

export default App;
