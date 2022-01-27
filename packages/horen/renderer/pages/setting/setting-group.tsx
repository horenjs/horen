/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-25 11:25:59
 * @LastEditTime : 2022-01-27 17:56:00
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\pages\setting\setting-group.tsx
 * @Description  :
 */
import React from 'react';
import { SettingGroup as ISettingGroup, SettingItem } from 'types';
import Switch from '../../components/switch';
import { DialogDC } from '../../data-center';

interface Props {
  group: ISettingGroup;
}

export default function Group(props: Props) {
  const { group } = props;

  const [settingGroup, setSettingGroup] = React.useState(group);

  const handleAddCollectionPaths = async (
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    e.preventDefault();
    const filePaths: string[] = (await DialogDC.open()).filePaths;
    const children = [...settingGroup.children];
    const label = children[index].label;
    const value = [...(children[index].value as string[])];
    value.push(...filePaths);
    children[index] = { label, value };
    setSettingGroup({ ...settingGroup, children });
  };

  const renderValue = (child: SettingItem, index: number) => {
    const { value } = child;

    let valueChild;

    if (value instanceof Array) {
      valueChild = (
        <>
          {value.map((v, i) => (
            <div key={v.toString()}>
              <span style={{ fontSize: '0.8rem' }}>{v.toString()}</span>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  const newgroup = { ...settingGroup };
                  value.splice(i, 1);
                  newgroup.children[index].value = value;
                  setSettingGroup(newgroup);
                }}
                style={{
                  color: '#f11111',
                  margin: '0 8px',
                  display: 'inline-block',
                }}
              >
                ✖
              </span>
            </div>
          ))}
          {child.label === 'collectionPaths' && (
            <div style={{ width: '100%' }}>
              <button
                onClick={async (e: React.MouseEvent<HTMLElement>) =>
                  await handleAddCollectionPaths(e, index)
                }
                style={{ margin: '8px 0' }}
              >
                <span style={{ fontSize: 12 }}>添加</span>
              </button>
            </div>
          )}
        </>
      );
    } else if (typeof value === 'string' || typeof value === 'number') {
      valueChild = value;
    } else if (typeof value === 'boolean') {
      valueChild = (
        <Switch
          on={value}
          onChange={(on) => {
            const children = [...settingGroup.children];
            const label = children[index].label;
            children[index] = {label, value: on};
            setSettingGroup({...settingGroup, children});
          }}
        />
      );
    }

    return (
      <>
        <span className="label">{child.label}</span>
        <span className="value">{valueChild}</span>
      </>
    );
  };

  return (
    <div className="setting-group">
      {settingGroup?.children.length > 0 &&
        settingGroup?.children.map((child, index) => {
          return (
            <div className="setting-item" key={child.label}>
              {renderValue(child, index)}
            </div>
          );
        })}
    </div>
  );
}
