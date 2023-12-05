import React from 'react';
import {Routes, Route, Link} from "react-router-dom";
import HomePage from "@pages/home";
import NotFound from "@pages/not-found";

export default function RouterExample() {
  return (
    <div>
      <h3>Routes</h3>
      <Link to={"/home"}>Home</Link>
      <Link to={"/blog"}>Blog</Link>
      <Link to={"/about"}>About</Link>
      <Routes>
        <Route element={<HomePage />} path={"/home"} />
        <Route element={<NotFound />} path={"*"} />
      </Routes>
    </div>
  )
}