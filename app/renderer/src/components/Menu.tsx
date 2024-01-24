import React, { useState } from 'react';
import styled from 'styled-components';

const MENU = styled.div`
  background-color: #333;
  width: 100%;
  user-select: none;
  padding: 0 32px;
  height: 2.5rem;
  display: flex;
  align-items: center;
  position: sticky;
  top: 32px;
`;

const Item = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  padding: 0 16px;
  height: 2.2rem;
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
`;

export type MenuProps = {
  onClick?: (value: string) => void;
};

export default function Menu(props: MenuProps) {
  const { onClick } = props;
  const [selected, setSelected] = useState('全部');

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setSelected(target.innerText);
    if (onClick) onClick(target.innerText.toLowerCase());
  };

  return (
    <MENU onClick={handleClick}>
      <Item
        onClick={handleClick}
        style={{
          fontSize: selected === '全部' ? '1.4rem' : '1.2rem',
          fontWeight: selected === '全部' ? 600 : 500,
        }}
        className="electron-no-drag"
      >
        全部
      </Item>
      <Item
        onClick={handleClick}
        style={{
          fontSize: selected === '播放列表' ? '1.4rem' : '1.2rem',
          fontWeight: selected === '播放列表' ? 600 : 500,
        }}
        className="electron-no-drag"
      >
        播放列表
      </Item>
      <Item
        onClick={handleClick}
        style={{
          fontSize: selected === '艺术家' ? '1.4rem' : '1.2rem',
          fontWeight: selected === '艺术家' ? 600 : 500,
        }}
        className="electron-no-drag"
      >
        艺术家
      </Item>
      <Item
        onClick={handleClick}
        style={{
          fontSize: selected === '收藏' ? '1.4rem' : '1.2rem',
          fontWeight: selected === '收藏' ? 600 : 500,
        }}
        className="electron-no-drag"
      >
        收藏
      </Item>
      <Item
        onClick={handleClick}
        style={{
          fontSize: selected === '设置' ? '1.4rem' : '1.2rem',
          fontWeight: selected === '设置' ? 600 : 500,
        }}
        className="electron-no-drag"
      >
        设置
      </Item>
    </MENU>
  );
}
