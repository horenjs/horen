/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-30 00:04:08
 * @LastEditTime : 2022-01-30 00:56:10
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\mask\index.tsx
 * @Description  :
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface Props {
  backgroundColor?: string;
  opacity?: number;
  onClick?(e: React.MouseEvent<HTMLElement>): void;
}

export default function Mask(props: Props) {
  const { backgroundColor = '#000', opacity = 0.75, ...rest } = props;

  return ReactDOM.createPortal(
    <MyMask
      style={{ backgroundColor, opacity }}
      className="electron-no-drag component-mask"
      {...rest}
    />,
    document.getElementById('root') || document.body
  );
}

const MyMask = styled.div`
  position: fixed;
  inset: 0;
  border-radius: 8px;
`;
