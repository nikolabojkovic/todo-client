import { useState } from "react";
import { Dropdown, Form, Stack } from "react-bootstrap";

export function Settings() {

  const [confirmSwitch, setConfirmSwitch] = useState(true);  
  const [paginationSwitch, setPaginationSwitch] = useState(true);
  const [infiniteScrollSwitch, setInfiniteScrollSwitch] = useState(false);

  const [listSizeSelect, setListSizeSelect] = useState('Fixed');
  const [sizeInput, setSizeInput] = useState('200');

  function handleConfirmSettings(enabled: boolean) {
    console.log(enabled);
  }

  function handlePaginationSettings(enabled: boolean) {
    console.log(enabled);
  }

  function handleInfiniteScrollSettings(enabled: boolean) {
    console.log(enabled);
  }

  function handleListSizeSelect(option: string) {
    setListSizeSelect(option);
    console.log(option);
  }
  
  return (
    <div className='App__settings'>
      <div className='App__settings__group'>
        <label className='App__settings__group-label'>General</label>
        <div className='App__settings__group__item'>
          <Stack direction="horizontal" gap={2}>
            <label>Comfirm on change/remove</label>
            <Form.Check 
              className='ms-auto'
              type="switch"
              id={`comfirm-enabled`}
              checked={confirmSwitch}
              onChange={(e) => {
                setConfirmSwitch(e.target.checked);
                handleConfirmSettings(e.target.checked);
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
              id={`pagination-enabled`}
              checked={paginationSwitch}
              onChange={(e) => {
                setPaginationSwitch(e.target.checked);
                setInfiniteScrollSwitch(false);
                handlePaginationSettings(e.target.checked);
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
              id={`infinite-scroll-enabled`}
              checked={infiniteScrollSwitch}
              onChange={(e) => {
                setInfiniteScrollSwitch(e.target.checked);
                setPaginationSwitch(false);
                handleInfiniteScrollSettings(e.target.checked);
              }}
            /> 
          </Stack>
        </div>
        <div className='App__settings__group__item'>
          <Stack direction="horizontal" gap={2}>
            <label>List container size</label>
            <Dropdown className="ms-auto">
              <Dropdown.Toggle
                data-testid="selected-list-size-option"
                variant="outline-secondary"
                className="action-button ps-2 pe-2"
                id="dropdown-basic"
                disabled={false}
              >
                {' '}{listSizeSelect}{' '}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item data-testid="filter-option-fixed" onClick={() => handleListSizeSelect('Fixed')}>Fixed</Dropdown.Item>
                <Dropdown.Item data-testid="filter-option-dynamic" onClick={() => handleListSizeSelect('Dynamic')}>Dynamic</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Stack>
        </div>
        { listSizeSelect === 'Fixed' &&
          <div className='App__settings__group__item ms-5'>
            <Stack direction="horizontal" gap={2}>
              <label>Size (px)</label>
              <Form.Control
                className="ms-auto"
                data-testid="search-input"
                type="number" 
                placeholder={'0'} 
                size="sm" 
                value={sizeInput}
                onChange={(e) => {
                  setSizeInput(e.target.value);
                }}
              />
            </Stack>
          </div>
        }      
      </div>
    </div>
  );
}