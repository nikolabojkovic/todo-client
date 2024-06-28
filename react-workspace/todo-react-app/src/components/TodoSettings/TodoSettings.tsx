import { useEffect } from "react";
import { first } from "rxjs";

import { ISettingsProvider, LocalSettingsProvider } from "../../providers/LocalSettingsProvider";
import { useTodoList } from "../../context/TodoListContext";
import { TodoActions } from "../../models/Action";

import { GeneralSettings } from "./GeneralSettings/GeneralSettings";
import { PaginationSettings } from "./PaginationSettings/PaginationSettings";
import { SearchSettings } from "./SearchSettings/SearchSettings";
import { ThemeSettings } from "./ThemeSettings/ThemeSettings";

const settingsProvider: ISettingsProvider = new LocalSettingsProvider();

export function Settings() {
  const todoList = useTodoList();

  useEffect(() => {
    if(todoList.effectTrigger && todoList.effectTrigger.type === TodoActions.settingsUpdated) {
      settingsProvider.saveSettings(todoList.settings).pipe(first()).subscribe();
    }
  }, [todoList.effectTrigger, todoList.settings]);

  return (
    <div className='App__settings'>
      <GeneralSettings />
      <SearchSettings />
      <PaginationSettings />
      <ThemeSettings />
    </div>
  );
}