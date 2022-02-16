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
import { Rectangle } from 'types';

export interface OperateProps {
  onMinimize?(e?: React.MouseEvent<HTMLElement>): void;
  onClose?(e?: React.MouseEvent<HTMLElement>): Promise<any>;
  onSimp?(e?: React.MouseEvent<HTMLElement>): void;
}

export default function Operate(props: OperateProps) {
  const { onClose, onMinimize, onSimp } = props;

  const simpBounds: Rectangle = {
    x: 100,
    y: 100,
    width: 400,
    height: 200,
  }

  const [bounds, setBounds] = React.useState<Rectangle>();

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

  const handleSimplized = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(bounds);
    if (onSimp) onSimp(e);

    if (!bounds) {
      (async () => {
        const res = await MainwindowDC.getBounds();
        if (res.code === 1) {
          await MainwindowDC.setBounds(simpBounds);
          setBounds(res.data);
        }
      })();
    } else {
      (async () => {
        await MainwindowDC.setBounds(bounds);
        setBounds(undefined);
      })();
    }
  }

  return (
    <div className="operate electron-no-drag">
      <div
        className={"operate-item simplized electron-no-drag"}
        role={'button'}
        onClick={handleSimplized}
        style={{transform: `rotate(${bounds ? -90 : 90}deg)`}}
        title={'切换迷你播放器'}
      >
        ➘
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
