import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useState } from 'react';
import { useTodoListDispatch } from '../../context/TodoListContext';
import { IAction } from '../../models/Action';

export function AddTodo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const dispatch = useTodoListDispatch();

  function handleAdd() {
    dispatch({
      type: 'added',
      payload: {
        title, 
        description
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
              variant="outline-secondary"
              className="action-button w-100"
              size="sm"
              disabled={!title || title.trim() === '' || !description || description.trim() === ''}
              onClick={handleAdd}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  )
}