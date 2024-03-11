import renderer from 'react-test-renderer';
import { ImportExport } from './ImportExport';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { TodoStateProvider, TodosContext, TodosDispatchContext } from '../../context/TodoListContext';
import * as TodoContextProvider from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import userEvent from '@testing-library/user-event';
import { IAction, TodoActions } from '../../models/Action';
import { Todo } from '../../models/Todo';

describe('ImportExport', () => {
  const context = {
    state: stateTestData,
    dispatch: jest.fn()
  } as any;

  //jest.spyOn(TodosContextAll, 'useTodoList').mockReturnValue(context);
  //jest.spyOn(TodoContextProvider, 'useTodoListDispatch').mockImplementation(context);

  const alert=jest.fn();
  const downloadLink: HTMLAnchorElement = {
    href: '',
    download: '',
    click: jest.fn()
  } as unknown as HTMLAnchorElement;
  const fileReader: FileReader = {
    readAsText: jest.fn()
  } as unknown as FileReader

  const jsxElement = 
    //(<TodoStateProvider initialState={stateTestData}>
    //   <ImportExport downloadLink={downloadLink}/>
    // </TodoStateProvider>);
    (
      <TodosContext.Provider value={context.state}>
        <TodosDispatchContext.Provider value={context.dispatch} >
          <ImportExport downloadLink={downloadLink} fileReader={fileReader} alert={alert}/>
        </TodosDispatchContext.Provider>
      </TodosContext.Provider>
    );

  it('component should match snapshot', () => {;
    const tree = renderer.create(jsxElement).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('choose file', () => {
    it('should choose selected file', async () => {
      render(jsxElement);
      const data = `[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]`;
      let blobJson = new Blob([data], { type: 'application/json' });
      let mockFile = new File([blobJson], 'todo-list.json');

      const chooseFile = screen.getByTestId('choose-file') as any;

      await act(async () => {      
        return await userEvent.upload(chooseFile, [mockFile]);    
      });

      expect(chooseFile.files.length).toBe(1);
    });
  });

  describe('import', () => {
    describe('fail', () => {
      it('should not handle file content when invlid array provided', async () => {
        render(jsxElement);
        const data = `{}`;      
        const progressEvent = { target: { result: data } } as unknown as ProgressEvent<FileReader>
  
        (fileReader as any).onload(progressEvent);
  
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
        const progressEvent = { target: { result: data } } as unknown as ProgressEvent<FileReader>
  
        (fileReader as any).onload(progressEvent);
  
        expect(alert).toBeCalledWith("Invalid JSON file content. Objects in array are not valid Todo objects.");
        expect(context.dispatch).not.toBeCalledWith({
          type: TodoActions.imported,
          payload: {
            list: [] as Todo[],
            activePage: 1
          }
        } as IAction);
      });

      it('should fail when import canceled', async () => {
        render(jsxElement);
        const data = `[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]`;
        let blobJson = new Blob([data], { type: 'application/json' });
        let mockFile = new File([blobJson], 'todo-list.json');
  
        const chooseFile = screen.getByTestId('choose-file') as any;
        fireEvent.change(chooseFile, {target: {files: [mockFile]}});
  
        const importButton = screen.getByTestId('import-button');
        fireEvent.click(importButton);
        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);
        
        expect(chooseFile.files.length).toBe(1);
        expect(fileReader.readAsText).not.toBeCalledWith(mockFile);
        expect(importButton).toBeEnabled();
      });
    });

    describe('success', () => {  
      it('should read content when import confirmed', async () => {
        render(jsxElement);
        const data = `[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]`;      
        const progressEvent = { target: { result: data } } as unknown as ProgressEvent<FileReader>
        let blobJson = new Blob([data], { type: 'application/json' });
        let mockFile = new File([blobJson], 'todo-list.json');
  
        const chooseFile = screen.getByTestId('choose-file') as any;
        fireEvent.change(chooseFile, {target: {files: [mockFile]}});
  
        const importButton = screen.getByTestId('import-button');
        fireEvent.click(importButton);
        const confirmButton = screen.getByTestId('confirm-button');
        fireEvent.click(confirmButton);   
        
        // await waitFor(async () => {
          
        // });
        //await new Promise(resolve => setTimeout(resolve, 3000));
        expect(fileReader.readAsText).toBeCalledWith(mockFile);      
        // expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
        expect(importButton).toBeDisabled();
  
        (fileReader as any).onload(progressEvent);
  
        const expected = JSON.parse(data)[0] as Todo;
        expect(context.dispatch).toBeCalledWith({
          type: TodoActions.imported,
          payload: {
            list: [new Todo(expected.id, expected.title, expected.description, expected.completed, expected.createdAt)] as Todo[],
            activePage: 1
          }
        } as IAction);
      });
  
      it('should handle file content when onload invoked', async () => {
        render(jsxElement);
        const data = `[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]`;      
        const progressEvent = { target: { result: data } } as unknown as ProgressEvent<FileReader>
  
        (fileReader as any).onload(progressEvent);
        const expected = JSON.parse(data)[0] as Todo;
  
        expect(context.dispatch).toBeCalledWith({
          type: TodoActions.imported,
          payload: {
            list: [new Todo(expected.id, expected.title, expected.description, expected.completed, expected.createdAt)] as Todo[],
            activePage: 1
          }
        } as IAction);
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
      }
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