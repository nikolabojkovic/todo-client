import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { useRef, useState } from 'react';
import { Stack, Container, Row, Col } from 'react-bootstrap';
import { useTodoList, useTodoListDispatch } from '../context/TodosContext';

export function Paging({ rotate = true, maxVisiblePagesCount = 3 }) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const [itemsPerPage, setItemsPerPage] = useState(todoList.paging.itemsPerPage); 
  const inputSelectRef = useRef(null as any);
  const pageCount = Math.ceil(todoList.paging.totalCount / itemsPerPage);

  function calculateStartPage(): number {
    if (rotate) {
      if (todoList.paging.activePage < maxVisiblePagesCount) {
        return 1;
      }
    
      if (todoList.paging.activePage === pageCount)
      {
        return pageCount < maxVisiblePagesCount 
          ? todoList.paging.activePage - 1 
          : todoList.paging.activePage - 2;
      }

      return todoList.paging.activePage - 1;      
    }

    return Math.ceil(todoList.paging.activePage / maxVisiblePagesCount) === 1
      ? 1
      : ((Math.ceil(todoList.paging.activePage / maxVisiblePagesCount) - 1) * maxVisiblePagesCount) + 1;
  }

  function calculateEndPage(): number {
    if (rotate) {
      return startPage + (maxVisiblePagesCount - 1) > pageCount 
        ? pageCount 
        : startPage + (maxVisiblePagesCount - 1);
    }

    return Math.ceil(todoList.paging.activePage / maxVisiblePagesCount) * maxVisiblePagesCount > pageCount 
      ? pageCount 
      : Math.ceil(todoList.paging.activePage / maxVisiblePagesCount) * maxVisiblePagesCount;
  }

  let pages = [];
  const startPage = calculateStartPage() ?? 1;
  const endPage = calculateEndPage() ?? 1;

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    pages.push(
      <Pagination.Item key={pageNumber} active={pageNumber === todoList.paging.activePage} onClick={() => { 
        dispatch({
          type: 'paging-updated',
          activePage: pageNumber,
          itemsPerPage: itemsPerPage
        });
      }}>
        {pageNumber}
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
                    ref={inputSelectRef}
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
                  inputSelectRef.current.focus();
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
                  inputSelectRef.current.focus();
                }} 
              />
              {
                (pageCount > 3 && todoList.paging.activePage > maxVisiblePagesCount && !rotate) 
                && <Pagination.Ellipsis 
                      disabled={false} 
                      key="left-pages-link" 
                      onClick={() => { 
                        dispatch({
                          type: 'paging-updated',
                          activePage: todoList.paging.activePage - maxVisiblePagesCount <= pageCount ? todoList.paging.activePage - maxVisiblePagesCount : 1,
                          itemsPerPage: itemsPerPage
                        });
                        inputSelectRef.current.focus();
                      }}
                    />
              }
              {pages}
              { 
                (pageCount > 3 && todoList.paging.activePage < pageCount && !rotate) 
                && <Pagination.Ellipsis 
                      disabled={false} 
                      key="right-pages-link" 
                      onClick={() => { 
                        dispatch({
                          type: 'paging-updated',
                          activePage: todoList.paging.activePage + maxVisiblePagesCount <= pageCount ? todoList.paging.activePage + maxVisiblePagesCount : pageCount,
                          itemsPerPage: itemsPerPage
                        });
                        inputSelectRef.current.focus();
                      }}
                    />
              }
              <Pagination.Next
                key="next" 
                disabled={todoList.paging.activePage === pageCount}
                onClick={() => { 
                  dispatch({
                    type: 'paging-updated',
                    activePage: todoList.paging.activePage + 1 <= pageCount ? todoList.paging.activePage + 1 : pageCount,
                    itemsPerPage: itemsPerPage
                  });
                  inputSelectRef.current.focus();
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
                  inputSelectRef.current.focus();
                }} 
              />
            </Pagination>
          </Col>
        </Row>
      </Container>
    </section>
  )
}