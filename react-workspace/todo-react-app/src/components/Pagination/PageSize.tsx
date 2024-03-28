import { Stack, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTodoListDispatch } from '../../context/TodoListContext';
import { IAction, TodoActions } from '../../models/Action';

type Props = {
  inputSelectRef: ((instance: HTMLButtonElement | null) => void) | React.RefObject<HTMLButtonElement> | null | undefined,
  pageCount: number,  
  activePage: number,
  totalCount: number,
  pageSize?: number | null | undefined
};

export function PageSize({ inputSelectRef, pageCount, activePage, totalCount, pageSize = 5 }: Props) {
  const dispatch = useTodoListDispatch();

  function handlePageSizeChange(pageSize: number) {
    dispatch({
      type: TodoActions.pagingUpdated,
      payload: {
        activePage: 1,
        itemsPerPage: pageSize
      }
    } as IAction);
  }

  return (
  <>
    <Col sm={3} className="p-3 pt-2 pb-2 d-flex justify-content-sm-start justify-content-center align-items-center">
      Page {activePage} of {pageCount}
    </Col>
    <Col sm={4} className="p-3 pt-2 pb-2">
      <Stack direction="horizontal" gap={2} className="justify-content-center">
        <div className='ms-sm-auto'>
          Page size:{' '}
        </div>
        <div className="">
          <Dropdown>
            <Dropdown.Toggle
              data-testid="selected-size-option"
              variant="outline-secondary"
              className="action-button" 
              ref={inputSelectRef} 
              id="dropdown-basic"
              disabled={totalCount === 0}
            >
              {' '}{pageSize}{' '}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item data-testid="size-option-5" href="#/action-1" onClick={() => handlePageSizeChange(5)}>5</Dropdown.Item>
              <Dropdown.Item data-testid="size-option-10" href="#/action-2" onClick={() => handlePageSizeChange(10)}>10</Dropdown.Item>
              <Dropdown.Item data-testid="size-option-50" href="#/action-3" onClick={() => handlePageSizeChange(50)}>50</Dropdown.Item>
              <Dropdown.Item data-testid="size-option-100" href="#/action-3" onClick={() => handlePageSizeChange(100)}>100</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Stack>
    </Col>
  </>);
}