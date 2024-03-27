import { Form, Stack } from "react-bootstrap";
import { useTodoList, useTodoListDispatch } from "../../../context/TodoListContext";
import { ISearchSettings } from "../../../models/ISettings";
import { IAction, TodoActions } from "../../../models/Action";

export function SearchSettings() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  function handleSettingsUpdate(settingsPayload: ISearchSettings) {
    dispatch({
      type: TodoActions.settingsUpdated,
      payload: {
        ...todoList.settings,
        search: {...settingsPayload}
      }
    } as IAction);
  }

  return (
    <div className='App__settings__group'>
      <label className='App__settings__group-label'>Search</label>
      <div className='App__settings__group__item'>
        <Stack direction="horizontal" gap={2}>
          <label>Search on key press</label>
          <Form.Check 
            className='ms-auto'
            data-testid="search-on-keypress-switch"
            type="switch"
            id={`keyPress-switch`}
            checked={todoList.settings.search.isSearchOnKeyPressEnabled}
            onChange={(e) => {
              handleSettingsUpdate({
                ...todoList.settings.search,
                isSearchOnKeyPressEnabled: e.target.checked
              });
            }}
          /> 
        </Stack>
      </div>
      { todoList.settings.search.isSearchOnKeyPressEnabled &&
        <div className='App__settings__group__item ms-5'>
          <Stack direction="horizontal" gap={2}>
            <label>Debounce time (ms)</label>
            <Form.Control
              className="ms-auto"
              data-testid="debounce-time-input"
              type="number" 
              placeholder={'0'} 
              size="sm" 
              value={todoList.settings.search.debounceTime}
              onChange={(e) => {
                handleSettingsUpdate({
                  ...todoList.settings.search,
                  debounceTime: +e.target.value
                });
              }}
            />
          </Stack>
        </div>
      }
    </div>
  );
}