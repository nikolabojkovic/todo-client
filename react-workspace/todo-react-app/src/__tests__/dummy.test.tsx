import { todoListTestData } from '../context/testData';

test('dummy test todos array', () => {
  expect(todoListTestData.length).toBe(6);
  expect(todoListTestData[0].id).toBe(1);
});

describe('todo list', () => {
  it('first item has title', () => {
    expect(todoListTestData[0].title).toBe('Task 1');
  })
});