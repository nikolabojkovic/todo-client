import './App.scss';
import LocalTodoListProvider from './providers/TodoProvider';

import { Tabs } from './components/Tabs/Tabs';
import { Sorting } from './components/Sort/Sorting';
import { TodoList } from './components/TodoList/TodoList';

import { Paging } from './components/Paging/Paging';
import { useEffect } from 'react';
import { LocalSettingsProvider } from './providers/LocalSettingsProvider';
import { first } from 'rxjs';
import { useTodoListDispatch } from './context/TodoListContext';
import { IAction, TodoActions } from './models/Action';

const todoListProvider = new LocalTodoListProvider();
const settingsProvider = new LocalSettingsProvider();

function App() {   
  const dispatch = useTodoListDispatch();

  useEffect(() => {
    settingsProvider.loadSettings().pipe(first()).subscribe((settings) => {
      dispatch({
        type: TodoActions.settingsFetched,
        payload: settings
      } as IAction);
    });
  }, [dispatch]);

  return (
    <div className="App" data-bs-theme="dark">
      <header className="App-header">
        Todo List
      </header>      
      <Tabs/>
      <Sorting/>
      <TodoList {...{todoListProvider}}/>        
      <Paging />      
    </div>
  );
}

export default App;
