import React from "react";
import Modal from "react-modal";
import { User } from "../../types";
import "./styles.css";

interface Props {
  users: User[];
  isOpen: boolean;
  closeModal: () => void;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "300px",
    transform: "translate(-50%, -50%)",
    border: "none",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

Modal.setAppElement("#root");

const UsersModal: React.FC<Props> = ({ users, isOpen, closeModal }) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="modal-header">
          <h2>Online Users</h2>
          <span className="modal-close" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </span>
        </div>
        <ul>
          {users.map((user) => (
            <li className="user-list-element" key={user.id}>
              {user.name}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default UsersModal;
