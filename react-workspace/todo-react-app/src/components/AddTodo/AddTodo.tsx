import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useState } from 'react';

import { useTodoListDispatch } from '../../context';
import { IAction, TodoActions } from '../../models';

export function AddTodo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const dispatch = useTodoListDispatch();

  function handleAdd() {
    dispatch({
      type: TodoActions.added,
      payload: {
        title, 
        description,
        createdAt: new Date()
      }
    } as IAction);
    setTitle('');
    setDescription('');
  }
  
  return (
    <Form className="todo-background p-1">
      <Container fluid>
        <Row xs={1} sm={3}>
          <Col sm={5} className="p-2">
            <Form.Control 
              id="title"
              data-testid="title-input"
              name="title"
              type="text" 
              placeholder="Enter title" 
              size="sm" 
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
            />
          </Col>
          <Col sm={5} className="p-2">
            <Form.Control 
              id="description"
              data-testid="description-input"
              name="description"
              type="text" 
              placeholder="Enter description" 
              size="sm" 
              value={description}
              onChange={(e) => setDescription(e.target.value)} 
            />
          </Col>
          <Col sm={2} className="p-2">
            <Button 
              data-testid="add-todo-button"
              variant="outline-secondary"
              className="action-button w-100"
              size="sm"
              disabled={title.trim() === '' || description.trim() === ''}
              onClick={handleAdd}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}