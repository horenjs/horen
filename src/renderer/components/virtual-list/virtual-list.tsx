import React from 'react';
import styled from 'styled-components';
import { VirtualListProps } from "./index";

export function VirtualList(props: VirtualListProps) {
  const { itemWidth, itemHeight, width, height, data, render } = props;

  const cols = Math.floor(width/itemWidth);
  const rows = Math.ceil(height/itemHeight);
  const counts = cols * rows;

  const [top, setTop] = React.useState(0);
  const [viewData, setViewData] = React.useState<any[]>(data.slice(0, counts + cols));

  const style = {
    width: width,
    height: height,
    transform: `translate3d(0, ${top}px, 0)`,
  }

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    const toTop = (e.target as HTMLDivElement).scrollTop;

    const start = Math.floor(toTop/itemHeight) * cols;
    const end = start + counts + cols;

    const viewData = data.slice(start, end);

    setViewData(viewData);
    setTop(Math.floor(toTop/itemHeight) * itemHeight);
  }

  return (
    <MyList
      className={"component-virtual-list-container no-scrollbar"}
      onScroll={handleScroll}
      style={{width, height}}
    >
      <div className={'to-expand'} style={{height: height}} />
      <div className={'items'} style={style}>
        {
          viewData.map(render)
        }
      </div>
    </MyList>
  )
}

const MyList = styled.div`
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #333;
  .to-expand {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }
  .items {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
`;