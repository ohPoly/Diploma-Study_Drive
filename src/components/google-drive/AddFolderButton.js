import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AddFolderButton({ currentFolder }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (currentFolder == null) {
      return setError("Folder not found");
    }

    const path = [...currentFolder.path];
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id });
    }

    try {
      const newFolder = await addDoc(collection(db, "folders"), {
        name: name,
        parentId: currentFolder.id,
        userId: currentUser.uid,
        path: path,
        createdAt: new Date(),
      });

      setName("");
      closeModal();
      navigate(`/folder/${newFolder.id}`);
    } catch {
      setError("Failed to create folder");
    }
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm">
        Add Folder
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
