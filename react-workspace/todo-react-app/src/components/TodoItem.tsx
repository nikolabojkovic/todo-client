import { Button, Stack } from 'react-bootstrap';
import { useTodoListDispatch } from '../context/TodosContext';
import { ITodo } from '../models/Todo';

const buttonStyle : any = { 
  backgroundColor: '#F5F6F7', 
  borderRadius: '20px', 
  minWidth: '90px'
}

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
              className="ms-auto"
              variant="outline-success" 
              size="sm"
              style={ buttonStyle }
              onClick={() => {
                dispatch({
                  type: 'changed',
                  todo: {...todo, completed: true}
                });
              }}
            >
              Complete
            </Button>
          }
          <Button 
            className= { todo.completed ? "ms-auto" : "" } 
            variant="outline-danger" 
            size="sm" 
            style={ buttonStyle }
            onClick={() => {
              dispatch({
                type: 'deleted',
                id: todo.id
              });
            }}
          >
            Delete
          </Button>
        </Stack>
      </div>
  )
}