/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-27 14:17:03
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\index.tsx
 * @Description  :
 */
import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import { RecoilRoot } from 'recoil';
import './index.css';

ReactDom.render(
  <RecoilRoot>
    <Router>
      <App />
    </Router>
  </RecoilRoot>,
  document.getElementById('root')
);
