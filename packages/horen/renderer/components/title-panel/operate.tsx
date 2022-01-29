/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 14:15:38
 * @LastEditTime : 2022-01-29 16:09:39
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\components\title-panel\operate.tsx
 * @Description  :
 */
import React from 'react';
import { MainwindowDC } from '../../data-center';

export interface OperateProps {
  onMinimize?(e?: React.MouseEvent<HTMLElement>): void;
  onClose?(e?: React.MouseEvent<HTMLElement>): void;
}

export default function Operate(props: OperateProps) {
  const { onClose, onMinimize } = props;

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) onClose(e);
    (async () => await MainwindowDC.close())();
  };

  const handleMinimize = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMinimize) onMinimize(e);
    (async () => await MainwindowDC.minimize())();
  };

  return (
    <div className="operate">
      <div
        className="minimize electron-no-drag"
        role={'button'}
        onClick={handleMinimize}
      >
        ―
      </div>
      <div
        className="close electron-no-drag"
        role="button"
        onClick={handleClose}
      >
        ✕
      </div>
    </div>
  );
}
