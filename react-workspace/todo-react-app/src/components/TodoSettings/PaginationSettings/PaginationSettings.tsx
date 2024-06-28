import { Dropdown, Stack } from "react-bootstrap";

import { useTodoList, useTodoListDispatch } from "../../../context";
import { PaginationType, IAction, TodoActions } from "../../../models";

export function PaginationSettings() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const ifPaginationDisabled = !todoList.settings.general.isPaginationEnabled;
  
  function handlePaginationTypeSelect(option: PaginationType) {
    dispatch({
      type: TodoActions.settingsUpdated,
      payload: {
        ...todoList.settings,
        pagination: {
          ...todoList.settings.pagination,
          paginationType: option
        }
      }
    } as IAction);
  }

  function handleVisiblePagesSelect(option: number) {
    dispatch({
      type: TodoActions.settingsUpdated,
      payload: {
        ...todoList.settings,
        pagination: {
          ...todoList.settings.pagination,
          maxVisiblePages: option
        }
      }
    } as IAction);
  }

  return (
    <div className={ "App__settings__group" + (ifPaginationDisabled ? " App__settings__group--disabled" : "") }>
      <label className={"App__settings__group-label" + (ifPaginationDisabled ? " App__settings__group-label--disabled" : "") }>
        Pagination
      </label>
      <div className={ "App__settings__group__item" + (ifPaginationDisabled ? " App__settings__group__item--disabled" : "") }>
        <Stack direction="horizontal" gap={2}>
          <label>Pagination type</label>
          <Dropdown className="ms-auto">
            <Dropdown.Toggle
              data-testid="selected-pagination-type-option"
              variant="outline-secondary"
              className="action-button ps-2 pe-2"
              id="dropdown-pagination-type"
              disabled={ifPaginationDisabled}
            >
              {' '}{todoList.settings.pagination.paginationType}{' '}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item 
                data-testid="pagination-type-option-classic" 
                onClick={() => handlePaginationTypeSelect(PaginationType.Classic)}
              >
                { PaginationType.Classic }
              </Dropdown.Item>
              <Dropdown.Item 
                data-testid="pagination-type-option-rotate" 
                onClick={() => handlePaginationTypeSelect(PaginationType.Rotate)}
              >
                { PaginationType.Rotate }
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Stack>
      </div>
      <div className={ "App__settings__group__item" + (ifPaginationDisabled ? " App__settings__group__item--disabled" : "") }>
        <Stack direction="horizontal" gap={2}>
          <label>Visible pages in navigation group</label>
          <Dropdown className="ms-auto">
            <Dropdown.Toggle
              data-testid="selected-visible-pages-option"
              variant="outline-secondary"
              className="action-button ps-2 pe-2"
              id="dropdown-visible-pages-number"
              disabled={ifPaginationDisabled}
            >
              {' '}{todoList.settings.pagination.maxVisiblePages}{' '}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item data-testid="visible-pages-option-1" onClick={() => handleVisiblePagesSelect(1)}>1</Dropdown.Item>
              <Dropdown.Item data-testid="visible-pages-option-2" onClick={() => handleVisiblePagesSelect(2)}>2</Dropdown.Item>
              <Dropdown.Item data-testid="visible-pages-option-3" onClick={() => handleVisiblePagesSelect(3)}>3</Dropdown.Item>
              <Dropdown.Item data-testid="visible-pages-option-4" onClick={() => handleVisiblePagesSelect(4)}>4</Dropdown.Item>
              <Dropdown.Item data-testid="visible-pages-option-5" onClick={() => handleVisiblePagesSelect(5)}>5</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Stack>
      </div>
    </div>
  );
}