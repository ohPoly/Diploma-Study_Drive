import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Паролі не збігаються");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate("/user");
      })
      .catch(() => {
        setError("Не вдалося оновити обліковий запис");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Оновити профіль</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Електронна пошта</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Залиште порожнім, щоб залишити той самий"
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Підтвердження пароля</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Залиште порожнім, щоб залишити той самий"
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Оновити
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/user">Скасувати</Link>
      </div>
    </CenteredContainer>
  );
}
