import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import logo from "../../assets/logo.png";
import "./styles.css";

interface Props {
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

const Connect: React.FC<Props> = ({ setUserName }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmitName = (e: any) => {
    e.preventDefault();
    setUserName(name);
    navigate("/chatroom");
  };

  return (
    <Container className="text-center">
      <img src={logo} className="img-fluid"></img>
      <Form
        onSubmit={handleSubmitName}
        className="d-flex flex-column align-items-center"
      >
        <Form.Control
          className="connect-input"
          type="text"
          value={name}
          minLength={1}
          maxLength={10}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          ref={inputRef}
        />
        <Button
          className="w-100 mt-3 bg-pink border-0"
          style={{ backgroundColor: "teal" }}
          disabled={!name}
          type="submit"
        >
          Join
        </Button>
      </Form>
    </Container>
  );
};

export default Connect;
