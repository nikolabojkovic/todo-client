import { Dropdown, Form, Stack } from "react-bootstrap";

import { useTodoList, useTodoListDispatch } from "../../../context";
import { IAction, TodoActions, IGeneralSettings, ListContainerType } from "../../../models";

export type Props = {
  paginationSwitch: boolean;
  onPaginationSwitch: (enabled: boolean) => void
}

export function GeneralSettings() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  function handleSettingsUpdate(generalSettingsPayload: IGeneralSettings) {
    dispatch({
      type: TodoActions.settingsUpdated,
      payload: {
        ...todoList.settings,
        general: {...generalSettingsPayload}
      }
    } as IAction);
  }
  
  function handleListSizeSelect(otpion: ListContainerType) {
    handleSettingsUpdate({
      ...todoList.settings.general,
      listSizeType: otpion
    });
  }

  return (
    <div className='App__settings__group'>
      <label className='App__settings__group-label'>General</label>
      <div className='App__settings__group__item'>
        <Stack direction="horizontal" gap={2}>
          <label>Comfirm on change/remove</label>
          <Form.Check 
            className='ms-auto'
            type="switch"
            id="comfirm-enabled"
            data-testid="comfirm-enabled"
            checked={todoList.settings.general.isConfirmEnabled}
            onChange={(e) => {
              handleSettingsUpdate({
                ...todoList.settings.general,
                isConfirmEnabled: e.target.checked
              });
            }}
          /> 
        </Stack>
      </div>
      <div className='App__settings__group__item'>
        <Stack direction="horizontal" gap={2}>
          <label>Pagination</label>
          <Form.Check 
            className='ms-auto'
            type="switch"
            id="pagination-enabled"
            data-testid="pagination-enabled"
            checked={todoList.settings.general.isPaginationEnabled}
            onChange={(e) => {
              handleSettingsUpdate({
                ...todoList.settings.general,
                isPaginationEnabled: e.target.checked,
                isInfiniteScrollEnabled: false
              });
            }}
          /> 
        </Stack>
      </div>
      <div className='App__settings__group__item'>
        <Stack direction="horizontal" gap={2}>
          <label>Infinite Scroll</label>
          <Form.Check 
            className='ms-auto'
            type="switch"
            id="infinite-scroll-enabled"
            data-testid="infinite-scroll-enabled"
            checked={todoList.settings.general.isInfiniteScrollEnabled}
            onChange={(e) => {
              handleSettingsUpdate({
                ...todoList.settings.general,
                isPaginationEnabled: false,
                isInfiniteScrollEnabled: e.target.checked
              });
            }}
          /> 
        </Stack>
      </div>
      <div className='App__settings__group__item'>
        <Stack direction="horizontal" gap={2}>
          <label>List container size</label>
          <Dropdown className="ms-auto">
            <Dropdown.Toggle
              data-testid="list-size-dropdown"
              variant="outline-secondary"
              className="action-button ps-2 pe-2"
              id="dropdown-list-size-type"
              disabled={false}
            >
              {' '}{todoList.settings.general.listSizeType}{' '}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item 
                data-testid="list-size-option-fixed" 
                onClick={() => handleListSizeSelect(ListContainerType.Fixed)}
              >
                { ListContainerType.Fixed }
              </Dropdown.Item>
              <Dropdown.Item 
                data-testid="list-size-option-dynamic" 
                onClick={() => handleListSizeSelect(ListContainerType.Dynamic)}
                >
                  { ListContainerType.Dynamic }
                </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Stack>
      </div>
      { todoList.settings.general.listSizeType === ListContainerType.Fixed &&
        <div className='App__settings__group__item ms-5'>
          <Stack direction="horizontal" gap={2}>
            <label>Size (px)</label>
            <Form.Control
              className="ms-auto"
              data-testid="list-size-input"
              type="number" 
              placeholder={'0'} 
              id="fixed-size"
              size="sm" 
              value={todoList.settings.general.fixedListSize}
              onChange={(e) => {
                handleSettingsUpdate({
                  ...todoList.settings.general,
                  fixedListSize: (+e.target.value)
                });
              }}
            />
          </Stack>
        </div>
      }      
    </div>
  );
}