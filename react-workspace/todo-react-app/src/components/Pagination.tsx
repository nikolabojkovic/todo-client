import Pagination from 'react-bootstrap/Pagination';
import { Col } from 'react-bootstrap';
import { useTodoList, useTodoListDispatch } from '../context/TodoListContext';
import { IAction } from '../models/Action';

type Props = {
  inputSelectRef: React.MutableRefObject<HTMLSelectElement | null>,
  rotate: boolean,
  pageCount: number,
  maxVisiblePagesCount: number
}

export function CustomPagination({ inputSelectRef, rotate, pageCount, maxVisiblePagesCount }: Props) {
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

  function handlePaginationUpdate(activePage: number, itemsPerPage: number) {
    dispatch({
      type: 'paging-updated',
      payload: {
        activePage,
        itemsPerPage
      }
    } as IAction);

    if (inputSelectRef && inputSelectRef.current) {
      inputSelectRef.current.focus();
    }
  }


  for (let pageNumber = firstPage; pageNumber <= lastPage; pageNumber++) {
    pages.push(
      <Pagination.Item 
        key={pageNumber} 
        active={pageNumber === todoList.paging.activePage} 
        onClick={() => handlePaginationUpdate(pageNumber, todoList.paging.itemsPerPage)}
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
            onClick={() => handlePaginationUpdate(1, todoList.paging.itemsPerPage)}
          />
          <Pagination.Prev 
            key="prev" 
            disabled={todoList.paging.activePage === 1 }
            onClick={() => handlePaginationUpdate(todoList.paging.activePage - 1 >= 1 ? todoList.paging.activePage - 1 : 1, todoList.paging.itemsPerPage)} 
          />
          {
            (!rotate && (activeGroup > 1)) 
            && <Pagination.Ellipsis 
                  disabled={false} 
                  key="left-pages-link" 
                  onClick={() => handlePaginationUpdate(calculateLastPageOfTheGroup(activeGroup - 1), todoList.paging.itemsPerPage)}
                />
          }
          {pages}
          { 
            (!rotate && (activeGroup < groupsCount)) 
            && <Pagination.Ellipsis 
                  disabled={false} 
                  key="right-pages-link" 
                  onClick={() => handlePaginationUpdate(calculateFirstPageOfTheGroup(activeGroup + 1), todoList.paging.itemsPerPage)}
                />
          }
          <Pagination.Next
            key="next" 
            disabled={todoList.paging.activePage === pageCount}
            onClick={() => handlePaginationUpdate(
              todoList.paging.activePage + 1 <= pageCount ? todoList.paging.activePage + 1 : pageCount,
              todoList.paging.itemsPerPage
            )} 
          />
          <Pagination.Last 
            key="last"
            disabled={todoList.paging.activePage === pageCount}
            onClick={() => handlePaginationUpdate(pageCount, todoList.paging.itemsPerPage)} 
          />
        </Pagination>
      </Col>
    </>
  )
}