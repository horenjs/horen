import React from 'react';
import styled from 'styled-components';
import {
  MdOutlineCheckBoxOutlineBlank,
  MdHorizontalRule,
} from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
import {
  closeMainwindow,
  minimizeMainwindow,
  maximizeMainwindow,
} from '../api';

const TITLE = styled.div`
  height: 28px;
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
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #9e9e9e34;
  }
`;

const Maximize = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #9e9e9e34;
  }
`;
const Close = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #ec1515;
  }
`;

export type TitleBarProps = {
  title?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
};

export default function TitleBar(props: TitleBarProps) {
  const { title, onClose, onMinimize, onMaximize } = props;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    closeMainwindow().then();
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    }
    minimizeMainwindow().then();
  };

  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    }
    maximizeMainwindow().then();
  };

  return (
    <TITLE className="electron-drag">
      <TitleArea>
        <span>{title}</span>
      </TitleArea>
      <CloseArea className="electron-no-drag">
        <Minimize onClick={handleMinimize}>
          <MdHorizontalRule size={20} />
        </Minimize>
        <Maximize onClick={handleMaximize}>
          <MdOutlineCheckBoxOutlineBlank size={16} />
        </Maximize>
        <Close onClick={handleClose}>
          <IoCloseSharp size={20} />
        </Close>
      </CloseArea>
    </TITLE>
  );
}
