import React from 'react';
import styled from 'styled-components';

const MENU = styled.div`
  width: 200px;
  background-color: #333;
  height: calc(100vh - 32px);
  user-select: none;
`;

const Item = styled.div`
  color: #fff;
  text-align: center;
  padding: 8px 0;
  margin: 0 auto;
  width: 188px;
  height: 32px;
  border-radius: 5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #3f3f3f;
  }
`;

export type MenuProps = {
  onClick?: (value: string) => void;
};

export default function Menu(props: MenuProps) {
  const { onClick } = props;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (onClick) onClick(target.innerText.toLowerCase());
  };

  return (
    <MENU onClick={handleClick}>
      <Item>playing</Item>
      <Item>setting</Item>
    </MENU>
  );
}
