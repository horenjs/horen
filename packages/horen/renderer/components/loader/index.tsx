/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 14:58:13
 * @LastEditTime : 2022-01-22 15:52:11
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\loader\index.tsx
 * @Description  : 
 */
import React from 'react';
import {Pulse} from './pulse';

export interface LoaderProps {
  style: string,
  color?: string,
}

export function Loader(props: LoaderProps) {
  const { style, ...rest } = props;
  if (style === 'pulse') {
    return <Pulse {...rest} />
  } else {
    return <div></div>
  }
}