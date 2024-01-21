import React from 'react';
import styled from 'styled-components';

const PLAYING = styled.div``;

export type PlayingProps = {
  visible?: boolean;
};

export default function Playing(props: PlayingProps) {
  const { visible } = props;
  return (
    <PLAYING style={{ display: visible ? 'block' : 'none' }}>Playing</PLAYING>
  );
}
