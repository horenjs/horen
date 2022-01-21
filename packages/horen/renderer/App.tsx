/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-21 16:58:11
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\App.tsx
 * @Description  :
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<p>helle world!!!!</p>} />
        </Route>
      </Routes>
    </Router>
  );
}
