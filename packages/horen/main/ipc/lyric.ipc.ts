/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-30 17:33:36
 * @LastEditTime : 2022-01-30 18:14:11
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\ipc\lyric.ipc.ts
 * @Description  :
 */
import { API_LRC } from '../../constant';
import request from 'request';

async function fetchLrc(id: number) {
  const results = [];
  const payload = {
    id: id,
    lv: -1,
    kv: -1,
    tv: -1,
  };
  for (const url of API_LRC) {
    results.push(myRequest(url, payload));
  }

  return MyPromise.any(results);
}

async function myRequest(url: string, data: any) {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: url,
        form: data,
      },
      (err: any, res: any, body: any) => {
        if (err) {
          reject(err);
        } else {
          if (res.statusCode === 200) resolve(body);
          else reject(res);
        }
      }
    );
  });
}

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

(async () => {
  const res: any = await fetchLrc(1479003964);
  console.log(JSON.parse(res));
})();
