import { useState } from 'react';
import { Stack } from 'react-bootstrap';
import { faTrash, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTodoListDispatch } from '../../context/TodoListContext';
import { IAction, TodoActions } from '../../models/Action';
import { ITodo } from '../../models/Todo';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';

type Props = {
  todo: ITodo;
};

export function TodoItem({ todo }: Props){
  const [showModal, setShowModal] = useState(false); 
  const [confirm, onConfirm] = useState(null as any);   
  const [confirmDialogText, setConfirmDialogText] = useState(''); 
  const dispatch = useTodoListDispatch();

  let handleComplete = () => {
    dispatch({
      type: TodoActions.changed,
      payload: {
        todo: {...todo, completed: true}
      }
    } as IAction);
  }

  let handleDelete = () => {
    dispatch({
      type: TodoActions.deleted,
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
          <FontAwesomeIcon 
            icon={faCheckDouble} 
            className={todo.completed ?  "ms-auto action-icon--disabled" : "ms-auto action-icon"}
            onClick={() => {
              if (todo.completed)
                return;

              onConfirm(() => handleComplete);
              setConfirmDialogText('Are you sure you want to complete this item?');
              setShowModal(true);
            }}
          />
          <FontAwesomeIcon 
            icon={faTrash} 
            className="action-icon"
            onClick={() => {
              onConfirm(() => handleDelete);
              setConfirmDialogText('Are you sure you want to delete this item?');
              setShowModal(true);
            }}
          />
        </Stack>
        <ConfirmModal 
          content={confirmDialogText} 
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