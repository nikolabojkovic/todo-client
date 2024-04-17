import { useState } from 'react';
import { Stack } from 'react-bootstrap';
import { faTrash, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTodoList, useTodoListDispatch } from '../../context';
import { ITodo, IAction, TodoActions } from '../../models';
import { ConfirmModal } from '../';
import { Draggable } from 'react-beautiful-dnd';

type Props = {
  todo: ITodo;
  index: number
};

export function TodoItem({ todo, index }: Props) {
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

  function handleDelete() {
    dispatch({
      type: TodoActions.deleted,
      payload: {
        id: todo.id
      }
    } as IAction);
  }

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    ...draggableStyle,
    userSelect: "none",
    background: isDragging ? "rgb(79 79 79 / 70%)" : "",
  });

  return (
    <Draggable key={todo.id} draggableId={`item-${todo.id}`} index={index}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="App__todo-list__item"
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
          >
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
            <div className="ms-auto">
              <FontAwesomeIcon 
                data-testid='complete-button'
                icon={faCheckDouble} 
                className={todo.completed ? "action-icon--disabled" : "action-icon"}
                onClick={() => {
                  if (todo.completed)
                    return;

                  if (todoList.settings.general.isConfirmEnabled) {
                    onConfirm(() => handleComplete);
                    setConfirmDialogText('Are you sure you want to complete this item?');
                    setShowModal(true);

                    return;
                  }

                  handleComplete();
                }}
              />
            </div>
            <div>
              <FontAwesomeIcon 
                data-testid="delete-button"
                icon={faTrash} 
                className="action-icon"
                onClick={() => {
                  if (todoList.settings.general.isConfirmEnabled) {
                    onConfirm(() => handleDelete);
                    setConfirmDialogText('Are you sure you want to delete this item?');
                    setShowModal(true);

                    return;
                  }

                  handleDelete();
                }}
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
      )}
    </Draggable> 
  );
}