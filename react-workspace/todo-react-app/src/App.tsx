import './App.scss';

import { useEffect } from 'react';
import { first } from 'rxjs';

import LocalTodoListProvider from './providers/TodoProvider';
import { Tabs, Sorting, TodoList, Paging } from './components';
import { LocalSettingsProvider } from './providers';
import { useTodoList, useTodoListDispatch } from './context';
import { IAction, TodoActions } from './models';

const todoListProvider = new LocalTodoListProvider();
const settingsProvider = new LocalSettingsProvider();

function App() {   
  const todoList = useTodoList();
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
      { todoList.activeTab !== 'settings' && <Sorting/> }
      { todoList.activeTab !== 'settings' && <TodoList {...{todoListProvider}}/> }       
      { todoList.activeTab !== 'settings' && <Paging /> }
    </div>
  );
}

export default App;
