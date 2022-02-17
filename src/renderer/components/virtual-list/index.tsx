import React from 'react';
import { VirtualList } from "./virtual-list";

export interface VirtualListProps {
  itemWidth: number;
  itemHeight: number;
  width: number;
  height: number;
  data: any[];
  render(item: any, index: number): React.ReactNode;
}

export default VirtualList;