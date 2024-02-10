import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export type ModalProps = {
  children?: React.ReactNode;
  alpha?: number;
};

const MODAL = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Modal({ children, alpha = 1 }: ModalProps) {
  return ReactDOM.createPortal(
    <MODAL style={{ backgroundColor: `rgba(0,0,0,${alpha})` }}>
      <div className="modal-container">{children}</div>
    </MODAL>,
    document.body
  );
}
