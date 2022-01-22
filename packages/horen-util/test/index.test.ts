/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 00:08:23
 * @LastEditTime : 2022-01-22 13:33:40
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen-util\test\index.test.ts
 * @Description  :
 */
import { randomInt, shift, readDir } from '../lib';
import { expect } from 'chai';

describe('horen util', () => {
  it('#test randomInt()', () => {
    const [min, max] = [0, 10];
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.most(10);
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.most(10);
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.most(10);
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.most(10);
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.most(10);
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.most(10);
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.most(10);
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.most(10);
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.most(10);
    expect(randomInt(min, max)).to.be.least(0);
    expect(randomInt(min, max)).to.be.a('number');
  });

  it('#test shift()', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    expect(shift(arr).length).to.equal(arr.length - 1);
    arr.shift();
    expect(shift(arr)).to.not.equal(arr);
  });

  it('#test readDir()', async () => {
    const p = 'D:\\Music\\周杰伦全集\\01 正式专辑\\01 2000.JAY';
    const files = await readDir(p);
    expect(files.length).to.equal(16);
    expect(files).to.be.a('array');
  });
});
