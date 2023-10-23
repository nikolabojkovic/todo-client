import { useState } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { useTodoListDispatch } from '../context/TodoListContext';
import { IAction } from '../models/Action';
import { ITodo } from '../models/Todo';
import { ConfirmModal } from './ConfirmModal';

type Props = {
  todo: ITodo;
};

export function TodoItem({ todo }: Props){
  const [showModal, setShowModal] = useState(false); 
  const [confirm, setConfirm] = useState(null as any); 
  const dispatch = useTodoListDispatch();

  let handleComplete = () => {
    dispatch({
      type: 'changed',
      payload: {
        todo: {...todo, completed: true}
      }
    } as IAction);
  }

  let handleDelete = () => {
    dispatch({
      type: 'deleted',
      payload: {
        id: todo.id
      }                
    } as IAction);
  }


  return (
      <div className="App__todo-list__item">
        <Stack direction="horizontal" gap={3}>
          <div>
            <div className={ todo.completed 
                ? "App__todo-list__item-title--completed" 
                : "App__todo-list__item-title" 
            }>
              { todo.title }
            </div>
            <div className={
              todo.completed 
                ? "App__todo-list__item-description--compleated" 
                : "App__todo-list__item-description"
              }>
                <span>{todo.description}</span>
                <span>
                  {' ' + new Date(todo.createdAt).toDateString() + ' '}
                </span>
            </div>
          </div>     
          <Button 
            className="ms-auto"
            variant={todo.completed ? "outline-secondary" : "outline-success" } 
            size="sm"
            disabled={todo.completed}
            onClick={() => {
              setConfirm(() => handleComplete);
              setShowModal(true);
            }}
          >
            Complete
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => {
              setConfirm(() => handleDelete);
              setShowModal(true);
            }}
          >
            Delete
          </Button>
        </Stack>
        <ConfirmModal 
          content={'Are you sure?'} 
          show={showModal}
          onConfirm={() => { 
            confirm(); 
            setShowModal(false);
          }}
          onCancel={() => { setShowModal(false) }}
        />
      </div>
  )
}