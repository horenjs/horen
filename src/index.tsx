import React from 'react';
import ReactDom from 'react-dom';
import Routes from '@/routes';
import "@/assets/css/normalize.css";
import "@/assets/css/style.css";

ReactDom.render(
  <Routes />,
  document.getElementById('root')
);