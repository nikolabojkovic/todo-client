import { Button, Stack } from 'react-bootstrap';
import { useTodoListDispatch } from '../context/TodoListContext';
import { IAction } from '../models/Action';
import { ITodo } from '../models/Todo';

type Props = {
  todo: ITodo;
};

export function TodoItem({ todo }: Props){

  const dispatch = useTodoListDispatch();

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
          { !todo.completed &&
            <Button 
              className="ms-auto confirm-button"
              variant="outline-success" 
              size="sm"
              onClick={() => {
                dispatch({
                  type: 'changed',
                  payload: {
                    todo: {...todo, completed: true}
                  }
                } as IAction);
              }}
            >
              Complete
            </Button>
          }
          <Button 
            className= { todo.completed ? "ms-auto confirm-button" : "confirm-button" } 
            variant="outline-danger" 
            size="sm"
            onClick={() => {
              dispatch({
                type: 'deleted',
                payload: {
                  id: todo.id
                }                
              } as IAction);
            }}
          >
            Delete
          </Button>
        </Stack>
      </div>
  )
}