import { faFileExport, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useTodoList, useTodoListDispatch } from "../../context/TodoListContext";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { ITodo, Todo } from "../../models/Todo";
import { IAction, TodoActions } from "../../models/Action";

type Props = {
  downloadLink: HTMLAnchorElement,
  fileReader: FileReader,
  alert: (message: string) => void
}

export function ImportExport({ downloadLink, fileReader, alert }: Props) {
  const todoList = useTodoList();  
  const dispatch = useTodoListDispatch();
  
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef(null as HTMLInputElement | null);

  function handleExport() {
    const jsonContent = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(todoList.originalList)
    )}`;
    downloadLink.href = jsonContent;
    downloadLink.download = `todo-list-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.json`;
    downloadLink.click();
  }

  fileReader.onload = handleFileContent;

  function handleFileContent(e: ProgressEvent<FileReader>) {
    const text = e.target?.result;
    const list = JSON.parse(text as string) as Todo[];

    if (!(list instanceof Array)) {
      alert('Invalid JSON file content. Todo list should be an array.');
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
      alert('Invalid JSON file content. Objects in array are not valid Todo objects.');
      return;
    }          
    
    dispatch({
      type: TodoActions.imported,
      payload: {
        list: importedTodoList,
        activePage: 1
      }
    } as IAction);
  }

  return (
    <>
      <Form className="todo-background p-1">
        <Container fluid>
          <Row xs={1} sm={3}>
            <Col sm={8} className="p-2">
              <InputGroup size="sm" className="">
                <Form.Control
                  data-testid="choose-file"
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
                data-testid="import-button"
                variant="outline-secondary"
                className="w-100 action-button"
                size="sm"
                onClick={() => setShowModal(true)}
                disabled={!file}
              >
                Import {' '}
                <FontAwesomeIcon icon={faFileImport} />
              </Button>
            </Col>
            <Col sm={2} className="p-2">
              <Button 
                data-testid="export-button"
                variant="outline-secondary"
                className="w-100 action-button"
                size="sm"
                disabled={!todoList.originalList || todoList.originalList.length === 0}
                onClick={() => handleExport()}
              >
                Export {' '}
                <FontAwesomeIcon icon={faFileExport} />
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
      <ConfirmModal 
        content={'Existing data will be lost. Are you sure?'} 
        show={showModal}
        onConfirm={() => { 
          fileReader.readAsText(file!);          
          setShowModal(false);
          setFile(null);
          fileRef!.current!.value = '';
        }}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}