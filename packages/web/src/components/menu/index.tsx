import React from 'react';
import {Color} from "@config/index";
import "./style.less";

interface MenuItem {
  icon?: React.ReactNode;
  name: string;
  color?: Color;
  style?: React.CSSProperties;
  onClick?(): void;
}
interface MenuProps {
  items: MenuItem[];
  direction?: 'vertical' | 'horizontal';
  show_text?: boolean;
}
export default function Menu(props: MenuProps) {
  const { items, direction='vertical', show_text=false } = props;
  const Item = (item: MenuItem) => {
    const {icon, name, color, style, onClick} = item;
    return (
      <div
        className={"menu-item" + " " + color}
        style={style}
        onClick={onClick}
      >
        {icon && <div>{icon}</div>}
        {show_text && name}
      </div>
    )
  };

  return (
    <div className={"horen-menu" + " " + direction}>
      {items.map(Item)}
    </div>
  );
}