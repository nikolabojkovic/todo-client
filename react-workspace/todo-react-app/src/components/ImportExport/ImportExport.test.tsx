import renderer from 'react-test-renderer';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IAction, TodoActions, Todo } from '../../models';
import { TodoStateProvider, TodosContext, TodosDispatchContext, stateTestData } from '../../context';
import { ImportExport } from './ImportExport';

// import * as TodoContextProvider from '../../context/TodoListContext';

describe('ImportExport', () => {
  const context = {
    state: stateTestData,
    dispatch: jest.fn()
  };

  //jest.spyOn(TodosContextAll, 'useTodoList').mockReturnValue(context);
  //jest.spyOn(TodoContextProvider, 'useTodoListDispatch').mockImplementation(context);

  const alert=jest.fn();
  const downloadLink: HTMLAnchorElement = {
    href: '',
    download: '',
    click: jest.fn()
  } as unknown as HTMLAnchorElement;
  const fileReader: FileReader = {
    readAsText: jest.fn(),
  } as unknown as FileReader;

  const jsxElement = 
    (
      <TodosContext.Provider value={context.state}>
        <TodosDispatchContext.Provider value={context.dispatch} >
          <ImportExport downloadLink={downloadLink} fileReader={fileReader} alert={alert}/>
        </TodosDispatchContext.Provider>
      </TodosContext.Provider>
    );

  it('component should match snapshot', () => {
    const tree = renderer.create(jsxElement).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('choose file', () => {
    it('should choose selected file', async () => {
      render(jsxElement);
      const data = `[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]`;
      const blobJson = new Blob([data], { type: 'application/json' });
      const mockFile = new File([blobJson], 'todo-list.json');

      const chooseFile = screen.getByTestId('choose-file') as HTMLInputElement;

      await act(async () => {      
        return await userEvent.upload(chooseFile, [mockFile]);    
      });

      expect(chooseFile.files!.length).toBe(1);
    });
  });

  describe('import', () => {
    describe('fail', () => {
      it('should not handle file content when invlid array provided', async () => {
        render(jsxElement);
        const data = `{}`;      
        const progressEvent = { target: { result: data } } as unknown as ProgressEvent<FileReader>;
  
        (fileReader.onload!)(progressEvent);
  
        expect(alert).toBeCalledWith("Invalid JSON file content. Todo list should be an array.");
        expect(context.dispatch).not.toBeCalledWith({
          type: TodoActions.imported,
          payload: {
            list: [] as Todo[],
            activePage: 1
          }
        } as IAction);
      });

      it('should not handle file content when invalid todo object provided', async () => {
        render(jsxElement);
        const data = `[{}]`;      
        const progressEvent = { target: { result: data } } as unknown as ProgressEvent<FileReader>;

        const action = {
          type: TodoActions.imported,
          payload: {
            list: [] as Todo[],
            activePage: 1
          }
        } as IAction;
  
        (fileReader.onload!)(progressEvent);
  
        expect(alert).toBeCalledWith("Invalid JSON file content. Objects in array are not valid Todo objects.");
        expect(context.dispatch).not.toBeCalledWith(action);
      });

      it('should fail when import canceled', async () => {
        render(jsxElement);
        const data = `[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]`;
        const blobJson = new Blob([data], { type: 'application/json' });
        const mockFile = new File([blobJson], 'todo-list.json');
  
        const chooseFile = screen.getByTestId('choose-file') as HTMLInputElement;
        fireEvent.change(chooseFile, {target: {files: [mockFile]}});
  
        const importButton = screen.getByTestId('import-button');
        fireEvent.click(importButton);
        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);
        
        expect(chooseFile.files!.length).toBe(1);
        expect(fileReader.readAsText).not.toBeCalledWith(mockFile);
        expect(importButton).toBeEnabled();
      });
    });

    describe('success', () => {  
      it('should read content when import confirmed', async () => {
        render(jsxElement);
        const data = `[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z", sortId: 1}]`;      
        const progressEvent = { target: { result: data } } as unknown as ProgressEvent<FileReader>;
        const blobJson = new Blob([data], { type: 'application/json' });
        const mockFile = new File([blobJson], 'todo-list.json');        
        const todo = JSON.parse(data)[0] as Todo;

        const action = {
          type: TodoActions.imported,
          payload: {
            list: [new Todo(todo.id, todo.title, todo.description, todo.completed, todo.createdAt, todo.sortId)] as Todo[],
            activePage: 1
          }
        } as IAction;
  
        const chooseFile = screen.getByTestId('choose-file') as HTMLInputElement;
        fireEvent.change(chooseFile, {target: {files: [mockFile]}});
  
        const importButton = screen.getByTestId('import-button');
        fireEvent.click(importButton);
        const confirmButton = screen.getByTestId('confirm-button');
        fireEvent.click(confirmButton);   
        
        expect(fileReader.readAsText).toBeCalledWith(mockFile);      
        expect(importButton).toBeDisabled();
  
        (fileReader.onload!)(progressEvent);
  
        expect(context.dispatch).toBeCalledWith(action);
      });
  
      it('should handle file content when onload invoked', async () => {
        render(jsxElement);
        const data = `[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z", sortId:1}]`;      
        const progressEvent = { target: { result: data } } as unknown as ProgressEvent<FileReader>;        
        const todo = JSON.parse(data)[0] as Todo;

        const action = {
          type: TodoActions.imported,
          payload: {
            list: [new Todo(todo.id, todo.title, todo.description, todo.completed, todo.createdAt, todo.sortId)] as Todo[],
            activePage: 1
          }
        } as IAction;
  
        (fileReader.onload!)(progressEvent);
  
        expect(context.dispatch).toBeCalledWith(action);
      });
    });
  });

  describe('export', () => {
    it('should succeed', () => {
      render(jsxElement);
      const expectedJsonContent = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(stateTestData.originalList)
      )}`;

      const exportButton = screen.getByTestId('export-button');
      fireEvent.click(exportButton);

      expect(downloadLink.click).toBeCalled();
      expect(downloadLink.download.startsWith('todo-list-')).toBeTruthy();
      expect(downloadLink.href).toBe(expectedJsonContent);
    });

    it('should fail', () => {
      const state = {
        ...stateTestData,
        originalList: []
      };
      render(
        (<TodoStateProvider initialState={state}>
          <ImportExport downloadLink={downloadLink} fileReader={fileReader} alert={alert}/>
        </TodoStateProvider>)
      );

      const exportButton = screen.getByTestId('export-button');
      fireEvent.click(exportButton);

      expect(downloadLink.click).not.toBeCalled();
    });
  });
});