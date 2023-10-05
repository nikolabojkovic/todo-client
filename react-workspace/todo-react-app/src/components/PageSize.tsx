import { Stack, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useTodoList, useTodoListDispatch } from '../context/TodosContext';
import { IAction } from '../models/Action';

type Props = {
  inputSelectRef: ((instance: HTMLSelectElement | null) => void) | React.RefObject<HTMLSelectElement> | null | undefined,
  pageCount: number
};

export function PageSize({ inputSelectRef, pageCount }: Props) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  
  return (
  <>
    <Col sm={3} className="p-3 pt-2 pb-2 d-flex justify-content-sm-start justify-content-center align-items-center">
      Page {todoList.paging.activePage} of {pageCount}
    </Col>
    <Col sm={4} className="p-3 pt-2 pb-2">
      <Stack direction="horizontal" gap={2} className="justify-content-center">
        <div className='ms-sm-auto'>
          Page size:{' '}
        </div>
        <div className="">
          <Form.Select
              id="page-size"
              name="page-size"
              ref={inputSelectRef}
              aria-label="Page size" 
              size="sm"
              onChange={(e) => {
                dispatch({
                  type: 'paging-updated',
                  payload: {
                    activePage: 1,
                    itemsPerPage: +e.target.value
                  }
                } as IAction);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
          </Form.Select>
        </div>
      </Stack>
    </Col>
  </>)
}