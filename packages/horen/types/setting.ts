/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 19:59:22
 * @LastEditTime : 2022-01-23 21:21:02
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\types\setting.ts
 * @Description  :
 */
export interface Setting {
  createAt: string | number;
  updateAt: string | number;
  items: {
    category: string;
    children: {
      label: string,
      value: string | boolean | number | string[] | number[],
    }[]
  }[];
}
