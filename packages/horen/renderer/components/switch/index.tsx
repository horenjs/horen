/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-25 14:19:11
 * @LastEditTime : 2022-01-25 14:59:16
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\components\switch\index.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';

interface Props {
  on: boolean;
  onChange(on: boolean): void;
}

export default function (props: Props) {
  const { on, onChange } = props;

  const [isOn, setIsOn] = React.useState(on);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const o = !isOn;
    setIsOn(o);
    onChange(o);
  };

  return (
    <Switch
      className="component-switch"
      style={{ backgroundColor: isOn ? '#fff' : '#555' }}
    >
      <div
        className={`handle pos-${isOn ? 'right' : 'left'}`}
        onClick={handleClick}
      ></div>
    </Switch>
  );
}

const Switch = styled.div`
  width: 34px;
  height: 18px;
  background-color: #fff;
  position: relative;
  border-radius: 9px;
  display: flex;
  align-items: center;
  .handle {
    width: 16px;
    height: 16px;
    background-color: #313233;
    border-radius: 8px;
    cursor: pointer;
    position: absolute;
  }
  .pos {
    &-right {
      left: 17px;
      animation: rightToLeft 0.5s;
      animation-fill-mode: forwards;
    }
    &-left {
      left: 0px;
      animation: leftToRight 0.5s;
      animation-fill-mode: forwards;
    }
  }
  @keyframes leftToRight {
    from {
      left: 17px;
    }
    to {
      left: 1px;
    }
  }
  @keyframes rightToLeft {
    from {
      left: 1px;
    }
    to {
      left: 17px;
    }
  }
`;
