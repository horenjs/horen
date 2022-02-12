/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-30 10:24:14
 * @LastEditTime : 2022-01-30 14:02:28
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\src\horen\renderer\components\slider\slider.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';
import { THEME } from 'constant';
import underscore from 'underscore';

export interface SilderProps {
  progress: number | string;
  onChange?(progress: number): void;
  backgroundColor?: string;
  frontColor?: string;
  handleColor?: string;
}

export function Slider(props: SilderProps) {
  const {
    progress = 0,
    onChange,
    backgroundColor,
    frontColor,
    handleColor,
  } = props;

  const frontRef = React.createRef<HTMLDivElement>();
  const backRef = React.createRef<HTMLDivElement>();
  const sliderRef = React.createRef<HTMLDivElement>();

  const [isMouseDown, setIsMouseDown] = React.useState(false);

  const getPer = (e: React.MouseEvent<HTMLDivElement>) => {
    const backToLeft = sliderRef.current?.getBoundingClientRect().left || 0;
    const backWidth = backRef.current?.offsetWidth || 1;
    const mousePosX = e.clientX;

    const left = mousePosX - backToLeft;

    return Number(((left / backWidth) * 100).toFixed(0));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMouseDown(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const per = getPer(e);
    if (isMouseDown && frontRef.current) {
      frontRef.current.style.width = `${per}%`;
      underscore.debounce(() => {
        if (onChange) onChange(per / 100)
      }, 500);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMouseDown(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const per = getPer(e);
    if (frontRef.current) {
      frontRef.current.style.width = `${per}%`;
      if (onChange) onChange(per / 100);
    }
  };

  return (
    <MySlider
      className="component-slider electron-no-drag"
      ref={sliderRef}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="back"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        ref={backRef}
        style={{ backgroundColor: backgroundColor }}
      ></div>
      <div
        className="front"
        style={{ width: `${progress}%`, backgroundColor: frontColor }}
        ref={frontRef}
      >
        <div
          className="slide-handle electron-no-drag"
          style={{ backgroundColor: handleColor }}
        ></div>
      </div>
    </MySlider>
  );
}

const height = 4;

const MySlider = styled.div`
  position: relative;
  height: ${height}px;
  margin: ${height}px 0;
  background-color: ${THEME.color.backgroundColorTint};
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  &:hover {
    height: ${height * 2}px;
    .back {
      height: ${height * 2}px;
    }
    .front {
      height: ${height * 2}px;
      .slide-handle {
        width: ${height * 3}px;
        height: ${height * 3}px;
      }
    }
  }
  .back {
    position: absolute;
    height: ${height}px;
    inset: 0;
    background-color: transparent;
    z-index: 2;
    transition: inherit;
  }
  .front {
    background-color: ${THEME.color.primaryTint};
    height: ${height}px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    transition: inherit;
    .slide-handle {
      position: absolute;
      top: ${-height / 2}px;
      right: -2px;
      width: ${height * 2}px;
      height: ${height * 2}px;
      border-radius: 50%;
      background-color: ${THEME.color.primary};
      z-index: 3;
      transition: inherit;
    }
  }
`;
