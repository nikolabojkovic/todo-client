import './App.scss';
import { Tabs } from './components/Tabs';
import { Sorting } from './components/Sorting';
import { TodoList } from './components/TodoList';
import { TodoListProvider } from './context/TodosContext';
import { todoService } from "./services/TodoService";

function App() {
  let todoList = todoService.getTodoList();

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
