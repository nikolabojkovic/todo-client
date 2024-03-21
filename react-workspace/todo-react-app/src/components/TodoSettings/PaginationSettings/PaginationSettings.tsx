import { useState } from "react";
import { Dropdown, Stack } from "react-bootstrap";

type Props = {
  isDisabled: boolean
}

export function PaginationSettings({ isDisabled: ifDisabled }: Props) {

  const [paginationTypeSelect, setPaginationSelect] = useState('Rotate');
  const [visiblePagesSelect, setVisiblePagesSelect] = useState('3');
  
  function handlePaginationTypeSelect(option: string) {
    setPaginationSelect(option);
    console.log(option);
  }

  function handleVisiblePagesSelect(option: string) {
    setVisiblePagesSelect(option);
    console.log(option);
  }

  return (
    <div className={ ifDisabled ? 'App__settings__group App__settings__group--disabled' : 'App__settings__group'}>
      <label className={ ifDisabled ? 'App__settings__group-label App__settings__group-label--disabled' : 'App__settings__group-label' }>Pagination</label>
      <div className={ ifDisabled ? 'App__settings__group__item App__settings__group__item--disabled' : 'App__settings__group__item' }>
        <Stack direction="horizontal" gap={2}>
          <label>Pagination type</label>
          <Dropdown className="ms-auto">
            <Dropdown.Toggle
              data-testid="selected-pagination-type-option"
              variant="outline-secondary"
              className="action-button ps-2 pe-2"
              id="dropdown-basic"
              disabled={ifDisabled}
            >
              {' '}{paginationTypeSelect}{' '}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item data-testid="pagination-type-option-classic" onClick={() => handlePaginationTypeSelect('Classic')}>Classic</Dropdown.Item>
              <Dropdown.Item data-testid="pagination-type-option-rotate" onClick={() => handlePaginationTypeSelect('Rotate')}>Rotate</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Stack>
      </div>
      <div className={ ifDisabled ? 'App__settings__group__item App__settings__group__item--disabled' : 'App__settings__group__item' }>
        <Stack direction="horizontal" gap={2}>
          <label>Visible pages in navigation group</label>
          <Dropdown className="ms-auto">
            <Dropdown.Toggle
              data-testid="selected-visible-pages-option"
              variant="outline-secondary"
              className="action-button ps-2 pe-2"
              id="dropdown-basic"
              disabled={ifDisabled}
            >
              {' '}{visiblePagesSelect}{' '}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item data-testid="visible-pages-option-1" onClick={() => handleVisiblePagesSelect('1')}>1</Dropdown.Item>
              <Dropdown.Item data-testid="visible-pages-option-2" onClick={() => handleVisiblePagesSelect('2')}>2</Dropdown.Item>
              <Dropdown.Item data-testid="visible-pages-option-3" onClick={() => handleVisiblePagesSelect('3')}>3</Dropdown.Item>
              <Dropdown.Item data-testid="visible-pages-option-4" onClick={() => handleVisiblePagesSelect('4')}>4</Dropdown.Item>
              <Dropdown.Item data-testid="visible-pages-option-5" onClick={() => handleVisiblePagesSelect('5')}>5</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Stack>
      </div>
    </div>
  );
}