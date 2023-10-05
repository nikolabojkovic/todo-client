import { useRef } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useTodoList } from '../context/TodosContext';
import { PageSize } from './PageSize';
import { CustomPagination as Pagination } from './Pagination';

export function Paging({ rotate = true, maxVisiblePagesCount = 3 }) {
  const todoList = useTodoList();

  const inputSelectRef = useRef<HTMLSelectElement | null>(null);
  const pageCount = Math.ceil(todoList.paging.totalCount / todoList.paging.itemsPerPage);

  return (
    <section className="paging-container p-0 mt-2">      
      <Container fluid>
        <Row xs={1} sm={3}>
          <PageSize 
            pageCount={pageCount} 
            inputSelectRef={inputSelectRef}
          />
          <Pagination 
            pageCount={pageCount} 
            inputSelectRef={inputSelectRef} 
            maxVisiblePagesCount={maxVisiblePagesCount} 
            rotate={rotate} 
          />
        </Row>
      </Container>
    </section>
  )
}