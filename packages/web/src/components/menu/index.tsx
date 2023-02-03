import React from 'react';
import {Color} from "@config/index";
import "./style.less";

interface MenuItem {
  icon?: React.ReactNode;
  name: string;
  color?: Color;
}
interface MenuProps {
  items: MenuItem[];
  direction?: 'vertical' | 'horizontal';
}
export default function Menu(props: MenuProps) {
  const { items, direction='vertical' } = props;
  const Item = (item: MenuItem) => {
    const {icon, name, color} = item;
    return (
      <div className={"menu-item" + " " + color}>
        {icon && <div>{icon}</div>}
        {name}
      </div>
    )
  };

  return (
    <div className={"horen-menu" + " " + direction}>
      {items.map(Item)}
    </div>
  );
}