import './App.scss';
import { TodoList } from './components/TodoList';
import { TodoListProvider } from './context/TodosContext';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Todo List
      </header>
      <TodoListProvider>
        <TodoList/>
      </TodoListProvider>
    </div>
  );
}

export default App;
