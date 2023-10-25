import { Stack, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTodoList, useTodoListDispatch } from '../context/TodoListContext';
import { IAction } from '../models/Action';
import { useState } from 'react';

type Props = {
  inputSelectRef: any,
  pageCount: number
};

export function PageSize({ inputSelectRef, pageCount }: Props) {

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  function handlePageSizeChange(pageSize: number) {
    dispatch({
      type: 'paging-updated',
      payload: {
        activePage: 1,
        itemsPerPage: pageSize
      }
    } as IAction);
    setItemsPerPage(pageSize);
  }
  
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
          <Dropdown>
            <Dropdown.Toggle
              className="action-button" 
              ref={inputSelectRef} 
              id="dropdown-basic"
            >
              {' '}{itemsPerPage}{' '}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1" onClick={() => handlePageSizeChange(5)}>5</Dropdown.Item>
              <Dropdown.Item href="#/action-2" onClick={() => handlePageSizeChange(10)}>10</Dropdown.Item>
              <Dropdown.Item href="#/action-3" onClick={() => handlePageSizeChange(50)}>50</Dropdown.Item>
              <Dropdown.Item href="#/action-3" onClick={() => handlePageSizeChange(100)}>100</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Stack>
    </Col>
  </>)
}