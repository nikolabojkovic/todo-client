import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { useState } from 'react';
import { useTodoList, useTodoListDispatch } from '../context/TodosContext';
import { ITodo } from '../models/Todo';

export function AddTodo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  const id = todoList.originalList.length >= 1 
    ? todoList.originalList
        .sort((a: ITodo, b: ITodo) => a.id > b.id ? 1 : -1)[todoList.originalList.length - 1].id 
    : 0;

  return (
    <Form className="todo-background p-1">
      <Container fluid>
        <Row xs={1} sm={3}>
          <Col sm={5} className="p-2">
            <Form.Control 
              type="text" 
              placeholder="Enter title" 
              size="sm" 
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
            />
          </Col>
          <Col sm={5} className="p-2">
            <Form.Control 
              type="text" 
              placeholder="Enter description" 
              size="sm" 
              value={description}
              onChange={(e) => setDescription(e.target.value)} 
            />
          </Col>
          <Col sm={2} className="p-2">
            <Button 
              variant="warning"
              style={{ 
                backgroundColor: '#FE9801',
                color: 'white', 
                minWidth: '90px',
                borderRadius: '20px',
                width: '100%'
              }} 
              size="sm"
              disabled={!title || title.trim() === '' || !description || description.trim() === ''}
              onClick={() => {
                dispatch({
                  type: 'added',
                  id: id + 1, 
                  title, 
                  description
                });
                setTitle('');
                setDescription('');
              }}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  )
}