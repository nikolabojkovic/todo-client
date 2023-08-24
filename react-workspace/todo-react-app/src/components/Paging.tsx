import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { useRef } from 'react';
import { Stack, Container, Row, Col } from 'react-bootstrap';
import { useTodoList, useTodoListDispatch } from '../context/TodosContext';

export function Paging({ rotate = true, maxVisiblePagesCount = 3 }) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  let pages = [];
  const inputSelectRef = useRef(null as any);
  const pageCount = Math.ceil(todoList.paging.totalCount / todoList.paging.itemsPerPage);
  const groupIndex = Math.ceil(todoList.paging.activePage / maxVisiblePagesCount);
  const groupsCount = Math.ceil(pageCount / maxVisiblePagesCount);
  const firstPage = getFirstPage();
  const lastPage = getLastPage();

  function calculateLastPageOfTheGroup(groupIndex: number){
    return groupIndex * maxVisiblePagesCount > pageCount 
      ? pageCount 
      : groupIndex * maxVisiblePagesCount
  };

  function calculateFirstPageOfTheGroup(groupIndex: number) {
    return groupIndex === 1
    ? 1
    : ((groupIndex - 1) * maxVisiblePagesCount) + 1
  };

  function getFirstPage() {
    if (rotate) {

      if (maxVisiblePagesCount === 1) {
        return todoList.paging.activePage;
      }

      // At the beginning of the group
      if (todoList.paging.activePage <= (maxVisiblePagesCount - 1)) {
        return 1;
      }

      // In the middle of the group
      if (todoList.paging.activePage + 1 <= pageCount) {
        return todoList.paging.activePage - (maxVisiblePagesCount - 2);
      }

      // At the end of the group
      if (todoList.paging.activePage === pageCount) {
        return pageCount - (maxVisiblePagesCount - 1)
      }   
    }

    return calculateFirstPageOfTheGroup(groupIndex);
  };

  function getLastPage() {
    if (rotate) {

      if (maxVisiblePagesCount === 1) {
        return todoList.paging.activePage;
      }

      // At the beginning of the group
      if (todoList.paging.activePage <= (maxVisiblePagesCount - 1)) {
        return maxVisiblePagesCount;
      }

      // In the middle of the group
      if (todoList.paging.activePage + 1 <= pageCount) {
        return todoList.paging.activePage + 1;
      }

      // At the end of the group
      if (todoList.paging.activePage === pageCount) {
        return pageCount;
      }
    }

    return calculateLastPageOfTheGroup(groupIndex);
  };

  for (let pageNumber = firstPage; pageNumber <= lastPage; pageNumber++) {
    pages.push(
      <Pagination.Item key={pageNumber} active={pageNumber === todoList.paging.activePage} onClick={() => { 
        dispatch({
          type: 'paging-updated',
          activePage: pageNumber,
          itemsPerPage: todoList.paging.itemsPerPage
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
                    id="page-size"
                    name="page-size"
                    ref={inputSelectRef}
                    aria-label="Page size" 
                    size="sm"
                    onChange={(e) => {
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
                    itemsPerPage: todoList.paging.itemsPerPage
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
                    itemsPerPage: todoList.paging.itemsPerPage
                  });
                  inputSelectRef.current.focus();
                }} 
              />
              {
                ((groupIndex === groupsCount || groupIndex > 1) && !rotate) 
                && <Pagination.Ellipsis 
                      disabled={false} 
                      key="left-pages-link" 
                      onClick={() => { 
                        dispatch({
                          type: 'paging-updated',
                          activePage: calculateLastPageOfTheGroup(groupIndex - 1),
                          itemsPerPage: todoList.paging.itemsPerPage
                        });
                        inputSelectRef.current.focus();
                      }}
                    />
              }
              {pages}
              { 
                ((groupsCount === 1 || groupIndex < groupsCount) && !rotate) 
                && <Pagination.Ellipsis 
                      disabled={false} 
                      key="right-pages-link" 
                      onClick={() => { 
                        dispatch({
                          type: 'paging-updated',
                          activePage: calculateFirstPageOfTheGroup(groupIndex + 1),
                          itemsPerPage: todoList.paging.itemsPerPage
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
                    itemsPerPage: todoList.paging.itemsPerPage
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
                    itemsPerPage: todoList.paging.itemsPerPage
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