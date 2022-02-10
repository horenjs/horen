/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-02-01 15:55:42
 * @LastEditTime : 2022-02-01 15:55:42
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\utils\shim.ts
 * @Description  :
 */
const MyPromise = {
  any: function (promises: Promise<any>[]) {
    return new Promise((resolve, reject) => {
      const ps = Array.isArray(promises) ? promises : [];
      let len = ps.length;
      const errs = [];

      if (len === 0) {
        return reject(new Error('all promise were rejected'));
      }
      ps.forEach((p) => {
        p.then(
          (value: any) => {
            resolve(value);
          },
          (err: any) => {
            len--;
            errs.push(err);
            if (len === 0) {
              reject(new Error('all promise were rejected'));
            }
          }
        );
      });
    });
  },
};
