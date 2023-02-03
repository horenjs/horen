import React from "react";
import Menu from "@components/menu";
import {HiHome} from "react-icons/hi";
import {MdFavorite} from "react-icons/md";

function App() {
  const items = [
    {
      icon: <HiHome />,
      name: "Home",
    },
    {
      icon: <MdFavorite />,
      name: "Favorite",
    }
  ];

  return (
    <div className="horen-app">
      <div className={"header-container"}></div>
      <div className={"main-container"}>
        <div className={"menu-container"}>
          <Menu items={items} />
        </div>
        <div className={"router-container"}></div>
      </div>
    </div>
  );
}

export default App;
