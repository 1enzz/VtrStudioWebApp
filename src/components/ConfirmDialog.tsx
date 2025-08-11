import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Dialog = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 16px rgba(0,0,0,0.3);
  max-width: 420px;
  width: 100%;
  text-align: center;
  font-family: 'Rajdhani', sans-serif;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.05rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
`;

const ActionButton = styled.button<{ bg?: string }>`
  background-color: ${({ bg }) => bg ?? '#444'};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 700;
  font-family: 'Rajdhani', sans-serif;
  cursor: pointer;
  transition: transform .06s ease, opacity .2s ease;

  &:hover { opacity: 0.92; }
  &:active { transform: translateY(1px); }
`;

type ConfirmDialogProps = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = 'Confirmar ação',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  return (
    <Overlay>
      <Dialog>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <Buttons>
          <ActionButton bg="#c00" onClick={onConfirm}>{confirmText}</ActionButton>
          <ActionButton bg="#444" onClick={onCancel}>{cancelText}</ActionButton>
        </Buttons>
      </Dialog>
    </Overlay>
  );
};

export default ConfirmDialog;
