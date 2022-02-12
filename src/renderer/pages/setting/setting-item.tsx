/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-25 11:25:59
 * @LastEditTime : 2022-01-30 00:30:37
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\pages\setting\setting-item.tsx
 * @Description  :
 */
import React from 'react';
import { LANG } from "constant";

interface Props {
  group: string;
  label: string;
  element: React.ReactNode;
}

export default function SettingItem(props: Props) {
  const { group, label, element } = props;
  
  return (
    <div className={`setting-item ${group}-${label}`}>
      <div className={'label'}>{ LANG.setting[`${group}.${label}`] }</div>
      <div className={'value'}>{ element }</div>
    </div>
  )
}
