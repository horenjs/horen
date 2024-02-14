import React from 'react';
import styled from 'styled-components';

const PageBody = styled.div`
  height: 100%;
`;

export type PageProps = {
  visible: boolean;
  children?: React.ReactNode;
};

export default function Page({ visible, children }: PageProps) {
  return (
    <PageBody
      style={{ display: visible ? 'block' : 'none' }}
      className="page-body"
    >
      {children}
    </PageBody>
  );
}
