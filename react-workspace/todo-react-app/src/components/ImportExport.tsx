import { faFileExport, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useTodoList, useTodoListDispatch } from "../context/TodosContext";
import { IAction } from "../models/Action";
import { ITodo, Todo } from "../models/Todo";

const fileReader = new FileReader();

export function ImportExport() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef(null as HTMLInputElement | null);

  function handleImport() {
    if (!file) 
      return;

    fileReader.readAsText(file);
  };

  function handleExport() {
    const link = document.createElement('a');
    const jsonContent = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(todoList.originalList)
    )}`;
    link.href = jsonContent;
    link.download = `todo-list-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.json`;
    link.click();
  }

  fileReader.onload = (e: ProgressEvent<FileReader>) => {
    const text = e.target?.result;
    const list = JSON.parse(text as string) as Todo[];

    if (!(list instanceof Array)) {
      alert("Invalid JSON file content. Todo list should be an array.");
      return;
    }

    const importedTodoList = list.map((item: ITodo) => new Todo(item.id, 
                                                                item.title, 
                                                                item.description, 
                                                                item.completed, 
                                                                item.createdAt));

    if ((importedTodoList.length > 0 
        && (!(importedTodoList[0] instanceof Todo) 
         || !(Todo.validateFields(importedTodoList[0]))
            )
        )) {
      alert("Invalid JSON file content. Objects in array are not valid Todo objects.");
      return;
    }
          
    setFile(null);
    dispatch({
      type: 'imported',
      payload: {
        originalList: importedTodoList,
        activePage: 1
      }
    } as IAction);
    fileRef!.current!.value = '';
  };

  return (
    <Form className="todo-background p-1">
      <Container fluid>
        <Row xs={1} sm={3}>
          <Col sm={8} className="p-2">
            <InputGroup size="sm" className="">
              <Form.Control
                aria-label="Choose File"
                aria-describedby="inputGroup-sizing-sm"
                type={"file"} 
                accept={".json"} 
                ref={fileRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setFile(((e.target).files![0]));
                }}
                readOnly 
              />
            </InputGroup>
          </Col>
          <Col sm={2} className="p-2">
            <Button 
              className="w-100 confirm-button"
              variant="outline-success" 
              size="sm"
              onClick={handleImport}
              disabled={!file}
            >
              Import {' '}
              <FontAwesomeIcon icon={faFileImport} />
            </Button>
          </Col>
          <Col sm={2} className="p-2">
            <Button 
              className="w-100 confirm-button"
              variant="outline-success" 
              size="sm"
              disabled={!todoList.originalList || todoList.originalList.length === 0}
              onClick={handleExport}
            >
              Export {' '}
              <FontAwesomeIcon icon={faFileExport} />
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  )
}