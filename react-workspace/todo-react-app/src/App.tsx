import './App.scss';

import { useEffect, useState } from 'react';
import { first } from 'rxjs';

import LocalTodoListProvider from './providers/TodoProvider';
import { Tabs, Sorting, TodoList, Paging, TodoActions } from './components';
import { LocalSettingsProvider } from './providers';
import { useTodoList, useTodoListDispatch } from './context';
import { BackgroundColor, BsThemes, IAction, ISort, Themes, TodoActions as TodoStateActions } from './models';
import { Stack } from 'react-bootstrap';
import { useTodoListEffect } from './hooks';

const todoListProvider = new LocalTodoListProvider();
const settingsProvider = new LocalSettingsProvider();

function App() {   
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  useTodoListEffect();

  useEffect(() => {
    settingsProvider.loadSettings().pipe(first()).subscribe((settings) => {
      dispatch({
        type: TodoStateActions.settingsFetched,
        payload: settings
      } as IAction);
    });
    dispatch({
      type: TodoStateActions.fetch,
      payload: {
        sort: {
          column: 'createdAt',
          direction: 'asc'
        } as ISort
      }
    } as IAction);
  }, [dispatch]);

  function shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = R * (100 + percent) / 100;
    G = G * (100 + percent) / 100;
    B = B * (100 + percent) / 100;

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R);
    G = Math.round(G);
    B = Math.round(B);

    const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
  }

  useEffect(() => {
    const root = document.querySelector(':root') as HTMLElement;
    let appTheme: any = {};
    const bsTheme: any = todoList.settings.theme.bsTheme === BsThemes.Dark ? Themes.dark : Themes.light;

    switch(todoList.settings.theme.backgroundColor) {
      case BackgroundColor.DarkGray:
        appTheme = Themes.dark.gray;
      break;
      case BackgroundColor.DarkBlue:
        appTheme = Themes.dark.blue; 
      break;
      case BackgroundColor.DarkRed: 
        appTheme = Themes.dark.red;
      break;
      case BackgroundColor.LightGray:
        appTheme = Themes.light.gray;
      break;
      case BackgroundColor.LightBlue:
        appTheme = Themes.light.blue; 
      break;
      case BackgroundColor.LightRed: 
        appTheme = Themes.light.red;
      break;
    }

    root?.style.setProperty('--text-secondary-color', todoList.settings.theme.primaryColor);
    root?.style.setProperty('--text-secondary-color-light', shadeColor(todoList.settings.theme.primaryColor, 20));

    root?.style.setProperty('--background-primary-color', appTheme.backgroundPrimaryColor);
    root?.style.setProperty('--background-secondary-color', appTheme.backgroundSecondaryColor);
    root?.style.setProperty('--background-secondary-color-1', appTheme.backgroundSecondaryColor1);
    root?.style.setProperty('--background-ternary-color', appTheme.backgroundTernaryColor);
    root?.style.setProperty('--background-ternary-color-1', appTheme.backgroundTernaryColor1);
    root?.style.setProperty('--background-ternary-color-2', appTheme.backgroundTernaryColor2);

    root?.style.setProperty('--text-primary-color', bsTheme.textPrimaryColor);
    root?.style.setProperty('--text-ternary-color', bsTheme.textTernaryColor);
    root?.style.setProperty('--text-ternary-color-2', bsTheme.textTernaryColor2);
  }, [
    todoList.settings.theme.bsTheme,
    todoList.settings.theme.backgroundColor,
    todoList.settings.theme.primaryColor
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
        { todoList.activeTab !== "settings" && <TodoList /> }
        { todoList.activeTab !== "settings" && <Paging /> }
      </section>         
    </main>    
  );
}

export default App;
