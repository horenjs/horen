/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 14:15:38
 * @LastEditTime : 2022-01-30 01:46:59
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\title-panel\operate.tsx
 * @Description  :
 */
import React from 'react';
import { MainwindowDC } from '@/data-center';
import { RiPictureInPicture2Line } from 'react-icons/ri';

export interface OperateProps {
  onMinimize?(e?: React.MouseEvent<HTMLElement>): void;
  onClose?(e?: React.MouseEvent<HTMLElement>): Promise<any>;
  onSimp?(e?: React.MouseEvent<HTMLElement>): void;
}

export default function Operate(props: OperateProps) {
  const { onMinimize, onSimp } = props;

  const handleClose = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await MainwindowDC.close();
  };

  const handleMinimize = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMinimize) onMinimize(e);
    (async () => await MainwindowDC.minimize())();
  };

  const handleSimplized = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (onSimp) onSimp();
  }

  return (
    <div className="operate electron-no-drag">
      <div
        className={"operate-item simplized electron-no-drag"}
        role={'button'}
        onClick={handleSimplized}
        title={'切换迷你播放器'}
      >
        <RiPictureInPicture2Line />
      </div>
      <div
        className="operate-item minimize electron-no-drag"
        role={'button'}
        onClick={handleMinimize}
      >
        ―
      </div>
      <div
        className="operate-item close electron-no-drag"
        role="button"
        onClick={handleClose}
      >
        ✕
      </div>
    </div>
  );
}
