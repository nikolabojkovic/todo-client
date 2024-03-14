import BootstrapPagination from 'react-bootstrap/Pagination';
import { Col } from 'react-bootstrap';
import { useTodoList, useTodoListDispatch } from '../../context/TodoListContext';
import { IAction, TodoActions } from '../../models/Action';

type Props = {
  inputSelectRef: React.MutableRefObject<HTMLButtonElement | null>,
  rotate: boolean,
  pageCount: number,
  maxVisiblePagesCount: number
}

export function Pagination({ inputSelectRef, rotate, pageCount, maxVisiblePagesCount }: Props) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const pages = [];
  const activeGroup = Math.ceil(todoList.paging.activePage / maxVisiblePagesCount);
  const groupsCount = Math.ceil(pageCount / maxVisiblePagesCount);
  const firstPage = rotate ? calculateFirstPage() : calculateFirstPageOfTheGroup(activeGroup);
  const lastPage = rotate ? calculateLastPage() : calculateLastPageOfTheGroup(activeGroup);

  function calculateLastPageOfTheGroup(groupIndex: number){
    return groupIndex * maxVisiblePagesCount > pageCount 
      ? pageCount 
      : groupIndex * maxVisiblePagesCount;
  }

  function calculateFirstPageOfTheGroup(groupIndex: number) {
    if (groupIndex === 0) {
      return 0;
    }

    return groupIndex === 1
    ? 1
    : ((groupIndex - 1) * maxVisiblePagesCount) + 1;
  }

  function calculateFirstPage() {
    if (maxVisiblePagesCount === 1) {
      return todoList.paging.activePage;
    }

    // Active page is at the beginning of the paging section
    if (todoList.paging.activePage <= (maxVisiblePagesCount - 1)) {
      return 1;
    }

    // Active page is in the middle of the paging section
    if (todoList.paging.activePage + 1 <= pageCount) {
      return todoList.paging.activePage - (maxVisiblePagesCount - 2);
    }

    // Active page is at the end of the paging section
    if (todoList.paging.activePage === pageCount) {
      return pageCount - (maxVisiblePagesCount - 1);
    }   

    return 1;
  }

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
  }

  function updatePagination(activePage: number, itemsPerPage: number) {
    dispatch({
      type: TodoActions.pagingUpdated,
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
      <BootstrapPagination.Item
        data-testid={ "page-" + pageNumber } 
        key={pageNumber} 
        active={pageNumber === todoList.paging.activePage} 
        onClick={() => updatePagination(pageNumber, todoList.paging.itemsPerPage)}
      >
        {pageNumber}
      </BootstrapPagination.Item>
    );
  }

  return (
    <>
      <Col sm={5} className="p-3 pt-2 pb-2 d-flex justify-content-sm-end justify-content-center">
        <BootstrapPagination size="sm" className='d-flex align-items-center'>
          <BootstrapPagination.First 
            data-testid="first-page"
            key="first" 
            disabled={todoList.paging.activePage <= 1 }
            onClick={() => updatePagination(1, todoList.paging.itemsPerPage)}
          />
          <BootstrapPagination.Prev 
            data-testid="prev-page"
            key="prev" 
            disabled={todoList.paging.activePage <= 1 }
            onClick={() => updatePagination(todoList.paging.activePage -1, todoList.paging.itemsPerPage)} 
          />
          {
            (!rotate && (activeGroup > 1)) 
            && <BootstrapPagination.Ellipsis 
                data-testid="prev-group"
                disabled={false} 
                key="left-pages-link" 
                className='page-ellipsis'
                onClick={() => updatePagination(calculateLastPageOfTheGroup(activeGroup - 1), todoList.paging.itemsPerPage)}
              />
          }
          {pages}
          { 
            (!rotate && (activeGroup < groupsCount)) 
            && <BootstrapPagination.Ellipsis
                data-testid="next-group" 
                disabled={false} 
                key="right-pages-link" 
                className='page-ellipsis'
                onClick={() => updatePagination(calculateFirstPageOfTheGroup(activeGroup + 1), todoList.paging.itemsPerPage)}
              />
          }
          <BootstrapPagination.Next
            data-testid="next-page"
            key="next" 
            disabled={todoList.paging.activePage === pageCount}
            onClick={() => updatePagination(todoList.paging.activePage + 1, todoList.paging.itemsPerPage)} 
          />
          <BootstrapPagination.Last 
            data-testid="last-page"
            key="last"
            disabled={todoList.paging.activePage === pageCount}
            onClick={() => updatePagination(pageCount, todoList.paging.itemsPerPage)} 
          />
        </BootstrapPagination>
      </Col>
    </>
  );
}