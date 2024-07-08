import { useEffect } from "react";
import { firstValueFrom } from "rxjs";

import providers from "../../providers";
import { useTodoList } from "../../context/TodoListContext";
import { TodoActions } from "../../models/Action";

import { GeneralSettings } from "./GeneralSettings/GeneralSettings";
import { PaginationSettings } from "./PaginationSettings/PaginationSettings";
import { SearchSettings } from "./SearchSettings/SearchSettings";
import { ThemeSettings } from "./ThemeSettings/ThemeSettings";

export function Settings() {
  const todoList = useTodoList();

  useEffect(() => {
    if(todoList.effectTrigger && todoList.effectTrigger.type === TodoActions.settingsUpdated) {
      firstValueFrom(providers.settingsProvider.saveSettings(todoList.settings));
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