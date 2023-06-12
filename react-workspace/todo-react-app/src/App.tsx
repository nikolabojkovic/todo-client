import './App.scss';
import { AddTodo } from './components/AddTodo';
import { Search } from './components/Search';
import { Tabs } from './components/Tabs';
import { FilterTodos } from './components/FilterTodos';
import { Sorting } from './components/Sorting';
import { ImportExport } from './components/ImportExport';
import { TodoList } from './components/TodoList';
import { TodoListProvider } from './context/TodosContext';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Todo List
      </header>
      <TodoListProvider>
        <Tabs>
          <AddTodo key="add-todo" />
          <Search 
            key="search-todos" 
            placeholder='Search by title or description' 
          />
          <FilterTodos key="filter-todos" />
          <ImportExport key="import-export" />
        </Tabs>
        <Sorting/>
        <TodoList/>
      </TodoListProvider>
    </div>
  );
}

export default App;
