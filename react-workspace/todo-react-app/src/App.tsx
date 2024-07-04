import './App.scss';

import { useEffect } from 'react';
import { firstValueFrom } from 'rxjs';
import { Stack } from 'react-bootstrap';

import providers from './providers';
import { Tabs, Sorting, TodoList, Paging, TodoActions, Loader } from './components';
import { useTodoList, useTodoListDispatch } from './context';
import { IAction, ISort, TodoActions as TodoStateActions } from './models';
import { useTodoListEffect } from './hooks';
import { applyTheme } from './utils';

function App() {   
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  useTodoListEffect();

  const load = async () => {
    const settings = await firstValueFrom(providers.settingsProvider.loadSettings());
    dispatch({
      type: TodoStateActions.settingsFetched,
      payload: settings
    } as IAction);
    dispatch({
      type: TodoStateActions.fetch,
      payload: {
        sort: {
          column: 'createdAt',
          direction: 'asc'
        } as ISort
      }
    } as IAction);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    applyTheme(todoList.settings.theme);
  }, [
    todoList.settings.theme
  ]);

  return (    
    <main data-bs-theme={todoList.settings.theme.bsTheme} id="app-container" style={{minHeight: window.innerHeight + 'px'}}>
      <section className="App">
        <header className="App-header">
          Todo List
        </header>      
        <Tabs />
        { todoList.activeTab !== "settings" && 
          <section className="App-actions">
             <Stack direction="horizontal" gap={3}>
              <Sorting />
              <TodoActions />
             </Stack>
          </section> }
        { todoList.activeTab !== "settings" && 
          (
            todoList.isLoading 
            ? <Loader height={280} />
            : <>
                <TodoList />
                <Paging />
              </>
          )
        }
      </section>         
    </main>    
  );
}

export default App;
