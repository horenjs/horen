import React from 'react';
import styled from 'styled-components';

const SETTING = styled.div``;

export type SettingProps = {
  visible?: boolean;
};

export default function Setting(props: SettingProps) {
  const { visible } = props;
  return (
    <SETTING style={{ display: visible ? 'block' : 'none' }}>setting</SETTING>
  );
}
