/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 17:51:28
 * @LastEditTime : 2022-01-23 18:09:15
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\loader\dot.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';

export function Dot(props: { color?: string }) {
  const { color } = props;

  return (
    <Loader className="loader-dot">
      <div className="gooey">
        <span className="dot"></span>
        <div className="dots">
          <span></span>
          <span></span>
        </div>
      </div>
    </Loader>
  );
}

const Loader = styled.div`
  .gooey {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 142px;
    height: 40px;
    margin: -20px 0 0 -71px;
    filter: contrast(20);
  }
  .gooey .dot {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 12px;
    left: 15px;
    filter: blur(1px);
    background: #aaa;
    border-radius: 50%;
    transform: translateX(0);
    animation: dot 1.5s infinite;
  }
  .gooey .dots {
    transform: translateX(0);
    margin-top: 12px;
    margin-left: 31px;
    animation: dots 1.5s infinite;
  }
  .gooey .dots span {
    display: block;
    float: left;
    width: 16px;
    height: 16px;
    margin-left: 16px;
    filter: blur(1px);
    background: #aaa;
    border-radius: 50%;
  }
  @keyframes dot {
    50% {
      transform: translateX(65px);
    }
  }
  @keyframes dots {
    50% {
      transform: translateX(-31px);
    }
  }
`;
