import { useState } from 'react';
import { Stack } from 'react-bootstrap';
import { faTrash, faCheckDouble, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTodoList, useTodoListDispatch } from '../../context';
import { ITodo, IAction, TodoActions } from '../../models';
import { ConfirmModal } from '../';

type Props = {
  todo: ITodo;
};

export function TodoItem({ todo }: Props) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const [showModal, setShowModal] = useState(false);
  const [confirmDialogText, setConfirmDialogText] = useState('');
  const [confirm, onConfirm] = useState<null | (() => void)>(null);

  function handleComplete() {
    dispatch({
      type: TodoActions.changed,
      payload: {
        todo: {...todo, completed: true}
      }
    } as IAction);
  }

  function handleRestore() {
    dispatch({
      type: TodoActions.changed,
      payload: {
        todo: {...todo, completed: false}
      }
    } as IAction);
  }

  function handleDelete() {
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
              { todo.createdAt && 
                <span>
                  {' (' + new Date(todo.createdAt).toDateString() + ')'}
                </span> 
              }
          </div>
        </div>
        <div 
          className="ms-auto App__todo-list__item--action action-icon"     
          onClick={() => {
            if (todoList.settings.general.isConfirmEnabled) {
              onConfirm(() => todo.completed ? handleRestore : handleComplete);
              setConfirmDialogText(todo.completed ? 'Are you sure you want to restore this item?' : 'Are you sure you want to complete this item?');
              setShowModal(true);

              return;
            }

            todo.completed ? handleRestore() : handleComplete();
          }}
        >
          <FontAwesomeIcon 
            data-testid= { todo.completed ? 'restore-button' : 'complete-button' }
            icon={todo.completed ? faRotateLeft : faCheckDouble}
          />
        </div>
        <div 
          className="App__todo-list__item--action action-icon"
          onClick={() => {
            if (todoList.settings.general.isConfirmEnabled) {
              onConfirm(() => handleDelete);
              setConfirmDialogText('Are you sure you want to delete this item?');
              setShowModal(true);

              return;
            }

            handleDelete();
          }}
        >
          <FontAwesomeIcon 
            data-testid="delete-button"
            icon={faTrash}
          />
        </div>          
      </Stack>
      <ConfirmModal
        content={confirmDialogText} 
        show={showModal}
        onConfirm={() => { 
          ((confirm!)());
          setShowModal(false);
        }}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}