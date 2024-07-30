import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AuthModal = () => {
  const [showModal, setShowModal] = useState(true);

  const handleReconnect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('showSessionExpiredModal');

    window.location.href = '/login';
  };

  return (
    <Modal show={showModal} onHide={() => {}} backdrop="static" keyboard={false}>
      <Modal.Header closeButton={false}>
        <Modal.Title>Session Expirée</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Votre session a expiré. Veuillez vous reconnecter.
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn btn-secondaire' onClick={handleReconnect}>
          Se reconnecter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AuthModal;
