import { useRef } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useEffect } from 'react';
import { filter, first, map } from 'rxjs';

import { useTodoList, useTodoListDispatch } from '../../context';
import { PageSize, Pagination } from '../';
import { PaginationType, IAction, TodoActions, IPaging } from '../../models';
import providers, { pagingLocalStorageKey } from '../../providers';

export function Paging() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch(); 

  const inputSelectRef = useRef<HTMLButtonElement | null>(null);
  const pageCount = Math.ceil(todoList.paging.totalCount / todoList.paging.itemsPerPage);

  useEffect(() => {
    providers.storageProvider.getItem(pagingLocalStorageKey)
      .pipe(
        first(),
        filter((data) => !!data),
        map((pagingData: string | null) => JSON.parse(pagingData!) as IPaging)
      ).subscribe((paging: IPaging) => {
        dispatch({
          type: TodoActions.pagingFatched,
          payload: paging
        } as IAction);
      });
  }, [dispatch]);

  useEffect(() => {
    if (todoList.effectTrigger 
      && (todoList.effectTrigger.type === TodoActions.pagingUpdated
       || todoList.effectTrigger.type === TodoActions.added  
       || todoList.effectTrigger.type === TodoActions.deleted
       || todoList.effectTrigger.type === TodoActions.deletedAll)) {
      providers.storageProvider.setItem(pagingLocalStorageKey, todoList.paging).pipe(first()).subscribe();
    }
  }, [todoList.paging, todoList.effectTrigger]);

  return (
    <>
      { todoList.settings.general.isPaginationEnabled 
     && <section className="paging p-0 mt-2">      
         <Container fluid>
           <Row xs={1} sm={3}>
             <PageSize 
               pageCount={pageCount} 
               inputSelectRef={inputSelectRef}
               pageSize={todoList.paging.itemsPerPage}
               activePage={todoList.paging.activePage}
               totalCount={todoList.paging.totalCount}
             />
             <Pagination 
               pageCount={pageCount} 
               inputSelectRef={inputSelectRef} 
               maxVisiblePagesCount={todoList.settings.pagination.maxVisiblePages} 
               rotate={todoList.settings.pagination.paginationType === PaginationType.Rotate} 
             />
           </Row>
         </Container>
       </section>
      }
    </>
  );
}