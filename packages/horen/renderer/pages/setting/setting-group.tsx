/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-25 11:25:59
 * @LastEditTime : 2022-01-25 17:36:11
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
  onSubmit(newGroup: ISettingGroup): void;
}

export default function SettingGroup(props: Props) {
  const { group, onSubmit } = props;

  const [settingGroup, setSettingGroup] = React.useState(group);

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onSubmit(settingGroup);
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
                  console.log(value);
                  console.log(newgroup.children[index]);
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
                onClick={async (e) => {
                  e.preventDefault();
                  const dialog = await DialogDC.open();
                  const filePaths = dialog.filePaths;
                  const newgroup = { ...settingGroup };
                  newgroup.children[index].value = [
                    ...(value as string[]),
                    ...filePaths,
                  ];
                  setSettingGroup({ ...newgroup });
                }}
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
            const newgroup = { ...settingGroup };
            newgroup.children[index].value = on;
            setSettingGroup({ ...newgroup });
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
      <div
        onClick={handleSubmit}
        style={{
          position: 'absolute',
          left: 48,
          bottom: 120,
          backgroundColor: '#f1f1f1',
          color: '#313233',
          padding: '2px 8px',
          borderRadius: 4,
        }}
      >
        Save
      </div>
    </div>
  );
}
