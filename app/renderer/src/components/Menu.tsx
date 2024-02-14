import React, { useState } from 'react';
import styled from 'styled-components';

const MENU = styled.div`
  width: 100%;
  user-select: none;
  padding: 0 32px;
  height: 2.5rem;
  display: flex;
  align-items: center;
`;

const Item = styled.div`
  color: #bbbbbb;
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
  &.selected {
    font-size: 1.3rem;
    font-weight: 600;
    color: #f1f1f1;
  }
`;

export type MenuProps = {
  onClick?: (value: string) => void;
};

export type MenuItemProps = {
  onClick: (value: string) => void;
  label: string;
  selected: string;
};

export default function Menu(props: MenuProps) {
  const { onClick } = props;
  const [selected, setSelected] = useState('全部');

  const handleClick = (text: string) => {
    setSelected(text);
    if (onClick) onClick(text);
  };

  return (
    <MENU>
      <MenuItem onClick={handleClick} selected={selected} label="全部" />
      <MenuItem onClick={handleClick} selected={selected} label="播放列表" />
      <MenuItem onClick={handleClick} selected={selected} label="专辑" />
      <MenuItem onClick={handleClick} selected={selected} label="艺术家" />
      <MenuItem onClick={handleClick} selected={selected} label="收藏" />
      <MenuItem onClick={handleClick} selected={selected} label="设置" />
    </MENU>
  );
}

export function MenuItem({ label, onClick, selected }: MenuItemProps) {
  const cls = `electron-no-drag ` + (selected === label && 'selected');
  return (
    <Item onClick={() => onClick(label)} className={cls}>
      {label}
    </Item>
  );
}
