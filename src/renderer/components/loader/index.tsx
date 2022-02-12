/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 14:58:13
 * @LastEditTime : 2022-01-23 18:14:28
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\loader\index.tsx
 * @Description  :
 */
import React from 'react';
import { Pulse } from './pulse';
import { Dot } from './dot';
import Square from './square';

export interface LoaderProps {
  style: string;
  color?: string;
}

export function Loader(props: LoaderProps) {
  const { style, ...rest } = props;
  if (style === 'pulse') {
    return <Pulse {...rest} />;
  } else if (style === 'dot') {
    return <Dot {...rest} />;
  } else if (style === 'square') {
    return <Square {...rest} />;
  } else {
    return <div></div>;
  }
}
