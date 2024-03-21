import { useState } from "react";
import { Form, Stack } from "react-bootstrap";

export function SearchSettings() {

  const [keyPressSwitch, setKeyPressSwitch] = useState(true);
  const [debounceTimeInput, setDebounceTimeInput] = useState('500');

  function handleKeyPressSwitch(enabled: boolean) {
    console.log(enabled);
  }

  return (
    <div className='App__settings__group'>
      <label className='App__settings__group-label'>Search</label>
      <div className='App__settings__group__item'>
        <Stack direction="horizontal" gap={2}>
          <label>Comfirm on change/remove</label>
          <Form.Check 
            className='ms-auto'
            type="switch"
            id={`keyPress-switch`}
            checked={keyPressSwitch}
            onChange={(e) => {
              setKeyPressSwitch(e.target.checked);
              handleKeyPressSwitch(e.target.checked);
            }}
          /> 
        </Stack>
      </div>
      { keyPressSwitch &&
        <div className='App__settings__group__item ms-5'>
          <Stack direction="horizontal" gap={2}>
            <label>Debounce time (ms)</label>
            <Form.Control
              className="ms-auto"
              data-testid="debounce-time-input"
              type="number" 
              placeholder={'0'} 
              size="sm" 
              value={debounceTimeInput}
              onChange={(e) => {
                setDebounceTimeInput(e.target.value);
              }}
            />
          </Stack>
        </div>
      }
    </div>
  );
}