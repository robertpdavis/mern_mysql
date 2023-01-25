import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function BSmodal(props) {

  const modalState = props.modalState;
  const handleModalClick = props.handleModalClick;

  const handleSubmit = async (event) => {
    const data = props.modalState.data;
    handleModalClick({ event, data });
  }

  return (
    <>
      <Modal
        show={modalState.show}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title >{modalState.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body >{modalState.description}</Modal.Body>
        <Modal.Footer >
          {modalState.buttons ? modalState.buttons.map((button, i) => {
            return <Button key={i} variant={button.variant} name={button.name} onClick={handleSubmit}>{button.title}</Button>
          }) : ''}
        </Modal.Footer>
      </Modal>
    </>
  );
}