/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 00:08:23
 * @LastEditTime : 2022-01-22 01:16:23
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen-util\test\index.test.ts
 * @Description  :
 */
import { randomInt, shift } from '../lib';
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
  })
});
