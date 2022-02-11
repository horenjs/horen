/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-25 11:25:59
 * @LastEditTime : 2022-01-30 00:30:37
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\pages\setting\setting-group.tsx
 * @Description  :
 */
import React from 'react';
import { SettingGroup as ISettingGroup, SettingItem } from 'types';
import Switch from '@/components/switch';
import { DialogDC } from '@/data-center';

interface Props {
  group: ISettingGroup;
  onChange(group: ISettingGroup): void;
}

export default function Group(props: Props) {
  const { group, onChange } = props;

  const [settingGroup, setSettingGroup] = React.useState<ISettingGroup>();

  React.useEffect(() => {
    // console.log(settingGroup);
    if (settingGroup) onChange(settingGroup);
  }, [settingGroup]);

  /**
   * 处理添加曲库目录点击事件
   * @param e 鼠标事件
   * @param index 设置项索引
   */
  const handleAddCollectionPaths = async (
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    e.preventDefault();
    const filePaths: string[] = (await DialogDC.open()).filePaths;
    const children = [...group.children];
    const value = [...(children[index].value as string[])];
    value.push(...filePaths);
    children[index] = { ...children[index], value: Array.from(new Set(value)) };
    setSettingGroup({ ...group, children });
  };

  /**
   * 处理删除曲库目录点击事件
   * @param e 鼠标事件
   * @param index 设置项索引
   * @param valueIndex 设置项值（为数组）时的索引
   */
  const handleDeleteCollectionPaths = (
    e: React.MouseEvent<HTMLElement>,
    index: number,
    valueIndex: number
  ) => {
    e.preventDefault();
    const children = [...group.children];
    const value = [...(children[index].value as string[])];
    value.splice(valueIndex, 1);
    // delete children[index];
    children[index] = { ...children[index], value };
    setSettingGroup({ ...group, children });
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
                onClick={(e) => handleDeleteCollectionPaths(e, index, i)}
                style={{ color: '#f11', margin: '0 8px', display: 'inline' }}
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
                style={{ margin: '8px 0', fontSize: 12 }}
              >
                添加目录
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
            const children = [...group.children];
            children[index] = { ...children[index], value: on };
            setSettingGroup({ ...group, children });
          }}
        />
      );
    }

    return (
      <>
        <span className="label">{child.title}</span>
        <span className="value">{valueChild}</span>
      </>
    );
  };

  return (
    <div className="setting-group electron-no-drag">
      {group?.children.length > 0 &&
        group?.children.map((child, index) => {
          return (
            <div className="setting-item" key={child.label}>
              {renderValue(child, index)}
            </div>
          );
        })}
    </div>
  );
}
