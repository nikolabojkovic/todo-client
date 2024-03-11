import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type Props = {
  content: string
  show: boolean,
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ content, show, onConfirm, onCancel }: Props) {

  return (
    <Modal
      data-testid="confirm-modal"
      id="confirm-modal"
      {...{show}}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="todo-background">
        <h5 className='text-center content-text'>
          {content}
        </h5>
      </Modal.Body>
      <Modal.Footer className="todo-background border-0 d-flex justify-content-center">
        <Button 
          data-testid="confirm-button"
          onClick={onConfirm} 
          className="action-button btn-sm"
          variant="default"
        >
          Confirm
        </Button>
        <Button 
          data-testid="cancel-button"
          onClick={onCancel} 
          variant="outline-light btn-sm" 
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}