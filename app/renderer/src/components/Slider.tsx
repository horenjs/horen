import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MovePosition, useMove } from '../hooks/useMove';
import { useDidUpdate } from '../hooks/useDidUpdate';

export interface SliderProps {
  /**
   * 滑动条值改变时的回调函数
   *
   * param: percent 范围为 0.01 ~ 1.00
   *
   * param: value 实际长度或宽度
   */
  onChange?(percent: number, value: number): void;
  /**
   * 滑动条停止滚动时的回调函数
   *
   * @param percent 范围为 0.01 ~ 1.00
   *
   * @param value 实际长度或宽度
   */
  onChangeEnd?(percent: number, value: number): void;
  /**
   * 滑动条的高度或宽度，默认为 8，单位为 px
   */
  size?: number;
  /**
   * 默认高度或宽度百分比，范围为 0.01 ~ 1.00，默认为 0
   */
  defaultValue?: number;
  value?: number;
}

const SLIDER = styled.div`
  position: relative;
  height: 100%;
  .track {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.75;
    height: 50%;
    background-color: #229954;
  }

  .backTrack {
    background-color: #999;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 50%;
    width: 100%;
  }

  .thumb {
    position: absolute;
    border-radius: 50%;
    background-color: #f1f1f1;
  }
`;

export function Slider(props: SliderProps) {
  const {
    onChange,
    onChangeEnd,
    size = 4,
    defaultValue = 0,
    value = 0,
  } = props;

  const [fullWidth, setFullWidth] = useState(0);
  const [innerPercent, setInnerPercent] = useState(value || defaultValue);

  const finalPercent = value === innerPercent ? innerPercent : value;

  const handleChange = (p: MovePosition) => {
    const per = Math.floor(p.x * 100) / 100;
    setInnerPercent(per);
    if (onChange) onChange(per, Math.round(fullWidth * per));
  };

  const { ref, active } = useMove<HTMLDivElement>(handleChange);
  const width = Math.round(finalPercent * fullWidth);

  const handleChangeEnd = () => {
    if (!active && onChangeEnd) {
      onChangeEnd(innerPercent, width);
    }
  };

  useDidUpdate(() => {
    handleChangeEnd();
  }, [active]);

  useEffect(() => {
    if (ref.current) {
      setFullWidth(Number(ref.current?.getBoundingClientRect()?.width));
    }
  }, [ref.current]);

  return (
    <SLIDER
      className="slider"
      style={{
        height: size * 2,
        width: '100%',
      }}
      ref={ref}
    >
      <div
        className="backTrack"
        style={{
          borderRadius: size / 2,
        }}
      />
      <div
        className="track"
        style={{
          borderRadius: size / 2,
          width: width,
        }}
      />
      <div
        className="thumb"
        style={{
          height: size * 2,
          width: size * 2,
          left: width - size / 2,
          top: 0,
        }}
      />
    </SLIDER>
  );
}
