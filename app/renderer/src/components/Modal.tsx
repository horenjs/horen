import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export type ModalProps = {
  children?: React.ReactNode;
};

const MODAL = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Modal({ children }: ModalProps) {
  return ReactDOM.createPortal(
    <MODAL>
      <div className="modal-container">{children}</div>
    </MODAL>,
    document.body
  );
}
