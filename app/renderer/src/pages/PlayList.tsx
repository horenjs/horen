import React from 'react';
import styled from 'styled-components';

const PLAYLIST = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  padding-bottom: 88px;
  flex-wrap: wrap;
`;

const Item = styled.li`
  background-color: #999;
  height: 240px;
  width: 180px;
  margin: 8px;
  list-style: none;
`;

export type PlayListProps = {
  visible?: boolean;
};

export default function PlayList(props: PlayListProps) {
  const { visible } = props;
  return (
    <PLAYLIST style={{ display: visible ? 'flex' : 'none' }}>
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
