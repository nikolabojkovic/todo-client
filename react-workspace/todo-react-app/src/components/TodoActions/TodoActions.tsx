import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import { useTodoList, useTodoListDispatch } from "../../context";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { Stack } from "react-bootstrap";
import { IAction, TodoActions as TodoStateActions } from "../../models";

export function TodoActions() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const [showModal, setShowModal] = useState(false);
  const [confirmDialogText, setConfirmDialogText] = useState('');
  const [confirm, onConfirm] = useState<null | (() => void)>(null);

  function handleRestoreAll() {
    dispatch({
      type: TodoStateActions.restoredAll,
    } as IAction);
  }

  function handleDeleteAll() {
    dispatch({
      type: TodoStateActions.deletedAll,
    } as IAction);
  }


  return (
    <div className="ms-auto">
      <Stack direction="horizontal" gap={3} className="mt-2 mb-2">
        <div
          data-testid="restore-all-button"
          className={"action-icon position-relative " + (todoList.isLoading ? "action-icon--disabled" : "")}
          onClick={() => {
            if (todoList.isLoading) {
              return;
            }

            if (todoList.settings.general.isConfirmEnabled) {
              onConfirm(() => handleRestoreAll);
              setConfirmDialogText('Are you sure you want to restore all items?');
              setShowModal(true);

              return;
            }

            handleRestoreAll();
          }} 
        >
          <FontAwesomeIcon 
            icon={faRotateLeft}
            className={"action-icon-front " + (todoList.isLoading ? "action-icon--disabled" : "")}
          />
          <FontAwesomeIcon
            icon={faRotateLeft}
            className={"action-icon-back " + (todoList.isLoading ? "action-icon--disabled" : "")}
          />
        </div>
        <div         
          data-testid="delete-all-button"
          className={"action-icon position-relative " + (todoList.isLoading ? "action-icon--disabled" : "")}
          onClick={() => {
            if (todoList.settings.general.isConfirmEnabled) {
              if (todoList.isLoading) {
                return;
              }

              onConfirm(() => handleDeleteAll);
              setConfirmDialogText('Are you sure you want to delete all items?');
              setShowModal(true);

              return;
            }

            handleDeleteAll();
          }}
        >
          <FontAwesomeIcon
            icon={faTrash} 
            className={"action-icon-front " + (todoList.isLoading ? "action-icon--disabled" : "")}
          />
          <FontAwesomeIcon 
            icon={faTrash} 
            className={"action-icon-back " + (todoList.isLoading ? "action-icon--disabled" : "")}
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