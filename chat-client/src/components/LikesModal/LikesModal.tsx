import React from "react";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const LikesModal: React.FC<Props> = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">{children}</div>
    </div>
  );
};

export default LikesModal;
