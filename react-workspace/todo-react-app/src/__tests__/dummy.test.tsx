import { todos } from '../context/initialData';

test('dummy test todos array', () => {
  expect(todos.length).toBe(6);
  expect(todos[0].id).toBe(1);
});

describe('todo list', () => {
  it('first item has title', () => {
    expect(todos[0].title).toBe('Task 1');
  })
});