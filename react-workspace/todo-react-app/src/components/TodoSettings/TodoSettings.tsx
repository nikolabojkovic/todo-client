import { useEffect } from "react";
import { GeneralSettings } from "./GeneralSettings/GeneralSettings";
import { PaginationSettings } from "./PaginationSettings/PaginationSettings";
import { SearchSettings } from "./SearchSettings/SearchSettings";
import { ISettingsProvider, LocalSettingsProvider } from "../../providers/LocalSettingsProvider";
import { useTodoList } from "../../context/TodoListContext";
import { TodoActions } from "../../models/Action";
import { first } from "rxjs";

export function Settings() {
  const todoList = useTodoList();
  const settingsProvider: ISettingsProvider = new LocalSettingsProvider();

  useEffect(() => {
    if(todoList.effectTrigger && todoList.effectTrigger.type === TodoActions.settingsUpdated) {
      settingsProvider.saveSettings(todoList.settings).pipe(first()).subscribe();
    }
  }, [todoList.effectTrigger, todoList.settings]);

  return (
    <div className='App__settings'>
      <GeneralSettings></GeneralSettings>
      <SearchSettings></SearchSettings>
      <PaginationSettings></PaginationSettings>
    </div>
  );
}