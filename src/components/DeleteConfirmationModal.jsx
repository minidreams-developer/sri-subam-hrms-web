import styled from "styled-components";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const DeleteConfirmationModal = ({
  isOpen,
  title = "Confirm deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  isDeleting = false,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay onMouseDown={onCancel} role="presentation">
      <Modal
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <CloseButton type="button" onClick={onCancel} disabled={isDeleting} aria-label="Close">
          <FiX size={20} />
        </CloseButton>
        <IconWrapper>
          <FiAlertTriangle size={26} />
        </IconWrapper>
        <Title id="delete-confirmation-title">{title}</Title>
        <Message id="delete-confirmation-message">{message}</Message>
        <Actions>
          <CancelButton type="button" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </CancelButton>
          <DeleteButton type="button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : confirmText}
          </DeleteButton>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default DeleteConfirmationModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.5);
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 28rem;
  padding: 2rem;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.22);
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  padding: 0.35rem;
  border: 0;
  background: transparent;
  color: #64748b;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  border-radius: 50%;
  color: #dc2626;
  background: #fee2e2;
`;

const Title = styled.h2`
  margin: 0 0 0.625rem;
  color: #0f172a;
  font-size: 1.25rem;
`;

const Message = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.75rem;
`;

const ActionButton = styled.button`
  min-width: 6.5rem;
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
  font: 600 0.875rem "Inter", sans-serif;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(ActionButton)`
  border: 1px solid #cbd5e1;
  color: #334155;
  background: #ffffff;
`;

const DeleteButton = styled(ActionButton)`
  border: 1px solid #dc2626;
  color: #ffffff;
  background: #dc2626;
`;
