import React from 'react';

export type PageProps = {
  visible: boolean;
  children?: React.ReactNode;
};

export default function Page({ visible, children }: PageProps) {
  return (
    <div style={{ position: 'relative', zIndex: visible ? 0 : -1 }}>
      {children}
    </div>
  );
}
