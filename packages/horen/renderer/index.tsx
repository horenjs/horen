/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-23 15:58:55
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\index.tsx
 * @Description  : 
 */
import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDom.render(
  <Router><App /></Router>,
  document.getElementById('root')
);