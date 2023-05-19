import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { useRef, useState } from 'react';
import { Stack, Container, Row, Col } from 'react-bootstrap';
import { useTodoList, useTodoListDispatch } from '../context/TodosContext';

export function Paging() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const [itemsPerPage, setItemsPerPage] = useState(todoList.paging.itemsPerPage); 
  const inputRef = useRef(null as any);
  const pageCount = Math.ceil(todoList.paging.totalCount / itemsPerPage);

  function calculateStartPage(): number {
    if (todoList.paging.activePage <= 2 )
      return 1;
    
    if (todoList.paging.activePage === pageCount)
      return pageCount < 3 ? todoList.paging.activePage - 1 : todoList.paging.activePage - 2;

    return todoList.paging.activePage - 1;
  }

  let pages = [];

  for (let number = calculateStartPage();
       number <= (calculateStartPage()  + 2 > pageCount ? pageCount : calculateStartPage() + 2); 
       number++) {
    pages.push(
      <Pagination.Item key={number} active={number === todoList.paging.activePage} onClick={() => { 
        dispatch({
          type: 'paging-updated',
          activePage: number,
          itemsPerPage: itemsPerPage
        });
      }}>
        {number}
      </Pagination.Item>
    );
  }

  return (
    <section className="paging-container p-0 mt-2">      
      <Container fluid>
        <Row xs={1} sm={3}>
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
                    ref={inputRef}
                    aria-label="Page size" 
                    size="sm"
                    onChange={(e) => { 
                      setItemsPerPage(+e.target.value);
                      dispatch({
                        type: 'paging-updated',
                        activePage: 1,
                        itemsPerPage: +e.target.value
                      });
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
          <Col sm={5} className="p-3 pt-2 pb-2 d-flex justify-content-sm-end justify-content-center">
            <Pagination size="sm">
              <Pagination.First 
                key="first" 
                disabled={todoList.paging.activePage === 1 }
                onClick={() => { 
                  dispatch({
                    type: 'paging-updated',
                    activePage: 1,
                    itemsPerPage: itemsPerPage
                  });
                  inputRef.current.focus();
                }}
              />
              <Pagination.Prev 
                key="prev" 
                disabled={todoList.paging.activePage === 1 }
                onClick={() => { 
                  dispatch({
                    type: 'paging-updated',
                    activePage: todoList.paging.activePage - 1 >= 1 ? todoList.paging.activePage - 1 : 1,
                    itemsPerPage: itemsPerPage
                  });
                  inputRef.current.focus();
                }} 
              />
              <Pagination.Ellipsis disabled={true} key="left-separator" />
              {pages}
              <Pagination.Ellipsis disabled={true} key="right-separator" />
              <Pagination.Next
                key="next" 
                disabled={todoList.paging.activePage === pageCount}
                onClick={() => { 
                  dispatch({
                    type: 'paging-updated',
                    activePage: todoList.paging.activePage + 1 <= pageCount ? todoList.paging.activePage + 1 : pageCount,
                    itemsPerPage: itemsPerPage
                  });
                  inputRef.current.focus();
                }} 
              />
              <Pagination.Last 
                key="last"
                disabled={todoList.paging.activePage === pageCount}
                onClick={() => { 
                  dispatch({
                    type: 'paging-updated',
                    activePage: pageCount,
                    itemsPerPage: itemsPerPage
                  });
                  inputRef.current.focus();
                }} 
              />
            </Pagination>
          </Col>
        </Row>
      </Container>
    </section>
  )
}