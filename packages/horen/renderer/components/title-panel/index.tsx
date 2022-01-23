/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 14:15:30
 * @LastEditTime : 2022-01-23 14:43:46
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\title-panel\index.tsx
 * @Description  :
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Operate from './operate';
import Title from './title';
import { OperateItem } from './operate';

export interface OperateProps {
  title: string;
  operates: OperateItem[],
}

export default function (props: OperateProps) {
  const { title, operates } = props;

  return ReactDOM.createPortal(
    <MyTitlePanel className="title-panel">
      <Title title={title} />
      <Operate items={operates} />
    </MyTitlePanel>,
    document.getElementById('root') || document.body
  );
}

const MyTitlePanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  .title-panel-title {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }
  .title-panel-operate {
    display: flex;
    align-items: center;
    .setting,.minimize,.zoom,.close {
      margin: 0 4px;
      color: #f1f1f1;
      cursor: pointer;
    }
  }
`;
