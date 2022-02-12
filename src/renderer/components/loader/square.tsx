/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 18:12:18
 * @LastEditTime : 2022-01-23 21:54:46
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\loader\square.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';

export default function (props: { color?: string }) {
  const { color } = props;

  return (
    <Loader className="loader-square">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <polyline
          className="line-cornered stroke-still"
          points="0,0 100,0 100,100"
          strokeWidth="20"
          fill="none"
        ></polyline>
        <polyline
          className="line-cornered stroke-still"
          points="0,0 0,100 100,100"
          strokeWidth="20"
          fill="none"
        ></polyline>
        <polyline
          className="line-cornered stroke-animation"
          points="0,0 100,0 100,100"
          strokeWidth="20"
          fill="none"
        ></polyline>
        <polyline
          className="line-cornered stroke-animation"
          points="0,0 0,100 100,100"
          strokeWidth="20"
          fill="none"
        ></polyline>
      </svg>
    </Loader>
  );
}

const Loader = styled.div`
  body {
    background: #282828;
  }

  svg {
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(1);
    transform: translate(-50%, -50%) rotate(45deg) scale(1);
  }

  .stroke-still {
    stroke: #232323;
  }

  .stroke-animation {
    -webkit-animation: stroke-spacing 1.2s ease-in, stroke-color 4.8s linear;
    animation: stroke-spacing 1.2s ease-in, stroke-color 4.8s linear;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-delay: 0;
    animation-delay: 0;
    -webkit-animation-direction: normal;
    animation-direction: normal;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    -webkit-transform-origin: center center;
    transform-origin: center center;
  }

  @-webkit-keyframes stroke-spacing {
    0% {
      stroke-dasharray: 0 200;
    }
    45% {
      stroke-dashoffset: 0;
      stroke-dasharray: 200 200;
    }
    90% {
      stroke-dashoffset: -200;
      stroke-dasharray: 200 200;
    }
    100% {
      stroke-dashoffset: -200;
      stroke-dasharray: 200 200;
    }
  }

  @keyframes stroke-spacing {
    0% {
      stroke-dasharray: 0 200;
    }
    45% {
      stroke-dashoffset: 0;
      stroke-dasharray: 200 200;
    }
    90% {
      stroke-dashoffset: -200;
      stroke-dasharray: 200 200;
    }
    100% {
      stroke-dashoffset: -200;
      stroke-dasharray: 200 200;
    }
  }

  @-webkit-keyframes stroke-color {
    0% {
      stroke: #3498db;
    }
    24% {
      stroke: #643232;
    }
    25% {
      stroke: #327864;
    }
    49% {
      stroke: #327864;
    }
    50% {
      stroke: #32326e;
    }
    74% {
      stroke: #32326e;
    }
    75% {
      stroke: #78325a;
    }
    99% {
      stroke: #78325a;
    }
  }

  @keyframes stroke-color {
    0% {
      stroke: #3498db;
    }
    24% {
      stroke: #643232;
    }
    25% {
      stroke: #327864;
    }
    49% {
      stroke: #327864;
    }
    50% {
      stroke: #32326e;
    }
    74% {
      stroke: #32326e;
    }
    75% {
      stroke: #78325a;
    }
    99% {
      stroke: #78325a;
    }
  }
`;
