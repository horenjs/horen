import React from 'react';
import styled from 'styled-components';

const TITLE = styled.div`
  height: 32px;
  background-color: #333;
  display: flex;
  align-items: center;
`;

const TitleArea = styled.div`
  flex-grow: 1;
`;

const CloseArea = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  user-select: none;
`;
const Minimize = styled.div`
  font-size: 24px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    position: relative;
    bottom: 3px;
  }
  &:hover {
    background-color: #777;
  }
`;
const Close = styled.div`
  font-size: 24px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    position: relative;
    bottom: 2px;
  }
  &:hover {
    background-color: red;
  }
`;

export type TitleBarProps = {
  title?: string;
  onClose?: () => void;
  onMinimize?: () => void;
};

export default function TitleBar(props: TitleBarProps) {
  const { title, onClose, onMinimize } = props;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    }
  };

  return (
    <TITLE className="">
      <TitleArea>
        <span>{title}</span>
      </TitleArea>
      <CloseArea>
        <Minimize onClick={handleMinimize}>
          <span>□</span>
        </Minimize>
        <Close onClick={handleClose}>
          <span>×</span>
        </Close>
      </CloseArea>
    </TITLE>
  );
}
