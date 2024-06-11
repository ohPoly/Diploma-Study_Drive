import React, { useState } from "react";
import { Button, Modal, Form, Alert, ProgressBar } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function AddFileButton({ currentFolder }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { currentUser } = useAuth();
  const db = getFirestore();
  const storage = getStorage();

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`;

    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      error => {
        setError("Failed to upload file");
        console.error(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          try {
            await addDoc(collection(db, "files"), {
              url: downloadURL,
              name: file.name,
              folderId: currentFolder.id,
              userId: currentUser.uid,
              createdAt: new Date(),
            });
            setFile(null);
            setUploading(false);
            closeModal();
          } catch {
            setError("Failed to save file information to database");
            setUploading(false);
          }
        });
      }
    );

    setUploading(true);
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-primary" size="sm">
        Add File
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group>
            <Form.Label>File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          {uploading && <ProgressBar animated now={progress} label={`${Math.round(progress)}%`} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
