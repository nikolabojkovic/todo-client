import { useRef } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useTodoList } from '../../context/TodoListContext';
import { PageSize } from '../Paging/PageSize';
import { Pagination } from '../Paging/Pagination';

export function Footer() {
  const todoList = useTodoList();

  const inputSelectRef = useRef<HTMLSelectElement | null>(null);
  const pageCount = Math.ceil(todoList.paging.totalCount / todoList.paging.itemsPerPage);
  const rotate = false;
  const maxVisiblePagesCount = 3

  return (
    <section className="footer p-0 mt-2">      
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