/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 14:15:38
 * @LastEditTime : 2022-01-30 01:46:59
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\title-panel\operate.tsx
 * @Description  :
 */
import React from 'react';
import { MainwindowDC } from '../../data-center';

export interface OperateProps {
  onMinimize?(e?: React.MouseEvent<HTMLElement>): void;
  onClose?(e?: React.MouseEvent<HTMLElement>): Promise<any>;
}

export default function Operate(props: OperateProps) {
  const { onClose, onMinimize } = props;

  const handleClose = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      await onClose();
      await MainwindowDC.close();
    }
  };

  const handleMinimize = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMinimize) onMinimize(e);
    (async () => await MainwindowDC.minimize())();
  };

  return (
    <div className="operate electron-no-drag">
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
