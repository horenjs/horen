/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 14:24:49
 * @LastEditTime : 2022-01-30 01:47:25
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\title-panel\title.tsx
 * @Description  :
 */
import React from 'react';

interface TitleProps {
  title?: string;
}

export default function (props: TitleProps) {
  const { title } = props;
  return (
    <div className="title electron-no-drag">
      <div className="text">{title}</div>
    </div>
  );
}
