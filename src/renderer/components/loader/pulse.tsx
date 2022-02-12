/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 14:59:38
 * @LastEditTime : 2022-01-22 17:01:59
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\loader\pulse.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';

export function Pulse(props: { color?: string }) {
  const { color } = props;

  return (
    <Loader id="loader">
      <ul>
        <li style={{ backgroundColor: color }}></li>
        <li style={{ backgroundColor: color }}></li>
        <li style={{ backgroundColor: color }}></li>
        <li style={{ backgroundColor: color }}></li>
      </ul>
    </Loader>
  );
}

const Loader = styled.div`
  margin: auto;
  left: 0;
  right: 0;
  width: 28px;
  ul {
    margin: 0;
    list-style: none;
    width: 90px;
    position: relative;
    padding: 0;
    height: 20px;
  }
  ul li {
    position: absolute;
    width: 4px;
    height: 0;
    background-color: #f1f1f1;
    bottom: 0;
  }
  @keyframes sequence1 {
    0% {
      height: 8px;
    }
    50% {
      height: 20px;
    }
    100% {
      height: 6px;
    }
  }
  @keyframes sequence2 {
    0% {
      height: 4px;
    }
    50% {
      height: 22px;
    }
    100% {
      height: 8px;
    }
  }
  li:nth-child(1) {
    left: 0;
    animation: sequence1 1s ease infinite 0.1s;
  }
  li:nth-child(2) {
    left: 8px;
    animation: sequence2 1s ease infinite 0.15s;
  }
  li:nth-child(3) {
    left: 16px;
    animation: sequence1 1s ease-in-out infinite 0.2s;
  }
  li:nth-child(4) {
    left: 24px;
    animation: sequence2 1s ease-in infinite 0.25s;
  }
`;
