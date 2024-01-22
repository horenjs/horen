import React from 'react';
import styled from 'styled-components';

const PLAYLIST = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  padding-bottom: 88px;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
`;

const Item = styled.li`
  background-color: #999;
  height: 300px;
  margin: 8px;
  list-style: none;
`;

export type PlayListProps = {
  visible?: boolean;
};

export default function PlayList(props: PlayListProps) {
  const { visible } = props;
  return (
    <PLAYLIST style={{ display: visible ? 'grid' : 'none' }}>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
    </PLAYLIST>
  );
}
