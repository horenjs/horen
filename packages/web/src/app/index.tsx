import React from "react";
import Menu from "@components/menu";
import {HiHome} from "react-icons/hi";
import {MdFavorite, MdAlbum} from "react-icons/md";
import {GiMusicalNotes} from "react-icons/gi";
import {RiEqualizerFill} from "react-icons/ri";
import {IoMdSettings} from "react-icons/io";
import "./style.less";

function App() {
  const items = [
    {
      icon: <HiHome size={20} />,
      name: "Home",
      onClick: () => {
        alert("home");
      },
    },
    {
      icon: <MdFavorite size={20} />,
      name: "Favorite",
    },
    {
      icon: <GiMusicalNotes size={20} />,
      name: "Music",
    },
    {
      icon: <MdAlbum size={22} />,
      name: "Album",
    },
    {
      icon: <RiEqualizerFill size={22} />,
      name: "Equalizer",
    },
    {
      icon: <IoMdSettings size={20} />,
      name: "Setting",
    }
  ];

  return (
    <div className="horen-app">
      <div className={"header-container"}></div>
      <div className={"main-container"}>
        <div className={"menu-container"}>
          <Menu items={items} show_text={false} />
        </div>
        <div className={"router-container"}></div>
      </div>
    </div>
  );
}

export default App;
