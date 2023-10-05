import Pagination from 'react-bootstrap/Pagination';
import { Col } from 'react-bootstrap';
import { useTodoList, useTodoListDispatch } from '../context/TodosContext';

export function CustomPagination({ inputSelectRef, rotate, pageCount, maxVisiblePagesCount }: any) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  let pages = [];

  const activeGroup = Math.ceil(todoList.paging.activePage / maxVisiblePagesCount);
  const groupsCount = Math.ceil(pageCount / maxVisiblePagesCount);
  const firstPage = rotate ? calculateFirstPage() : calculateFirstPageOfTheGroup(activeGroup);
  const lastPage = rotate ? calculateLastPage() : calculateLastPageOfTheGroup(activeGroup);

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

  function calculateFirstPage() {
    if (maxVisiblePagesCount === 1) {
      return todoList.paging.activePage;
    }

    // Active page is at the beginning of the group
    if (todoList.paging.activePage <= (maxVisiblePagesCount - 1)) {
      return 1;
    }

    // Active page is in the middle of the group
    if (todoList.paging.activePage + 1 <= pageCount) {
      return todoList.paging.activePage - (maxVisiblePagesCount - 2);
    }

    // Active page is at the end of the group
    if (todoList.paging.activePage === pageCount) {
      return pageCount - (maxVisiblePagesCount - 1)
    }   

    return 1;
  };

  function calculateLastPage() {
    if (maxVisiblePagesCount === 1) {
      return todoList.paging.activePage;
    }

    // Active page is at the beginning of the group
    if (todoList.paging.activePage <= (maxVisiblePagesCount - 1)) {
      return pageCount < maxVisiblePagesCount ? pageCount : maxVisiblePagesCount;
    }

    // Active page is in the middle of the group
    if (todoList.paging.activePage + 1 <= pageCount) {
      return todoList.paging.activePage + 1;
    }

    // Active page is at the end of the group
    if (todoList.paging.activePage === pageCount) {
      return pageCount;
    }

    return 1;
  };


  for (let pageNumber = firstPage; pageNumber <= lastPage; pageNumber++) {
    pages.push(
      <Pagination.Item 
        key={pageNumber} 
        active={pageNumber === todoList.paging.activePage} 
        onClick={() => { 
          dispatch({
            type: 'paging-updated',
            activePage: pageNumber,
            itemsPerPage: todoList.paging.itemsPerPage
          });
        }}
      >
        {pageNumber}
      </Pagination.Item>
    );
  }

  return (
    <>
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
            (!rotate && (activeGroup > 1)) 
            && <Pagination.Ellipsis 
                  disabled={false} 
                  key="left-pages-link" 
                  onClick={() => { 
                    dispatch({
                      type: 'paging-updated',
                      activePage: calculateLastPageOfTheGroup(activeGroup - 1),
                      itemsPerPage: todoList.paging.itemsPerPage
                    });
                    inputSelectRef.current.focus();
                  }}
                />
          }
          {pages}
          { 
            (!rotate && (activeGroup < groupsCount)) 
            && <Pagination.Ellipsis 
                  disabled={false} 
                  key="right-pages-link" 
                  onClick={() => { 
                    dispatch({
                      type: 'paging-updated',
                      activePage: calculateFirstPageOfTheGroup(activeGroup + 1),
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
    </>
  )
}