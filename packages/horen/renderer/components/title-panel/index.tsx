/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 14:15:30
 * @LastEditTime : 2022-01-29 17:28:30
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\components\title-panel\index.tsx
 * @Description  :
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Operate, { OperateProps } from './operate';
import Title from './title';

export type Props = {
  title?: string;
} & OperateProps;

export default function (props: Props) {
  const { title, ...restProps } = props;

  return ReactDOM.createPortal(
    <MyTitlePanel className="title-panel electron-drag">
      <Title title={title} />
      <Operate {...restProps} />
    </MyTitlePanel>,
    document.getElementById('root') || document.body
  );
}

const MyTitlePanel = styled.div`
  &.title-panel {
    position: fixed;
    left: 44px;
    top: 0;
    width: calc(100% - 44px);
    height: 40px;
    .title {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      text-align: center;
      color: #c1c2c3;
    }
    .operate {
      .minimize,
      .close {
        position: absolute;
        width: 32px;
        height: 32px;
        color: #999;
        line-height: 32px;
        font-size: 1rem;
        cursor: pointer;
        text-align: center;
      }
      .minimize {
        right: 32px;
        font-size: 1.4rem;
        &:hover {
          background-color: #212223;
          color: #ffffff;
        }
      }
      .close {
        right: 0;
        &:hover {
          background-color: #c41313;
          color: #ffffff;
        }
      }
    }
  }
`;
