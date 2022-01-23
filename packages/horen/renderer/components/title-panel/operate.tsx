/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 14:15:38
 * @LastEditTime : 2022-01-23 14:42:40
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\title-panel\operate.tsx
 * @Description  :
 */
import React from 'react';

export interface OperateItem {
  name: string;
  desc: string;
  element: React.ReactNode;
  onClick(e: React.MouseEvent<HTMLElement>): void;
}

export default function Operate(props: { items: OperateItem[] }) {
  const { items } = props;

  return (
    <div className="title-panel-operate">
      {items.map((item) => {
        return (
          <div
            className="operate-item"
            key={item.name}
            title={item.desc}
            onClick={item.onClick}
          >
            {item.element}
          </div>
        );
      })}
    </div>
  );
}
