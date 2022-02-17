import React from 'react';
import styled from 'styled-components';
import { MdAlbum, MdFolder, MdOutlineFormatListBulleted } from 'react-icons/md';

export type Cate =
  | 'album'
  | 'folder'
  | 'track'

interface CateProps {
  cate: Cate;
  onPick?(cate: Cate): void;
}

export default function DisplayCate(props: CateProps) {
  const { cate, onPick } = props;

  const dict = {
    'album': 0,
    'folder': 24,
    'track': 48,
  }

  const [current, setCurrent] = React.useState(cate);

  const handleClick = (e: React.MouseEvent<HTMLElement>, c: Cate) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(c);
    if (onPick) onPick(c);
  }

  return (
    <MyCate className={'component-display-cate electron-no-drag'}>
      <div className={'container'}>
        <div className={'slider cate-item'} style={{transform: `translateX(${dict[current]}px)`}}>

        </div>
        <div className={'album cate-item'} onClick={e => handleClick(e, 'album')}>
          <MdAlbum />
        </div>
        <div className={'folder cate-item'} onClick={e => handleClick(e, 'folder')}>
          <MdFolder />
        </div>
        <div className={'track cate-item'} onClick={e => handleClick(e, 'track')}>
          <MdOutlineFormatListBulleted />
        </div>
      </div>
    </MyCate>
  )
}

const MyCate = styled.div`
  color: #d1d2d3;
  height: 24px;
  background-color: #484749;
  padding: 4px 0;
  border-radius: 3px;
  .container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .cate-item {
      height: 16px;
      display: flex;
      align-items: center;
      padding: 4px;
      cursor: pointer;
    }
    .slider {
      position: absolute;
      left: 0;
      top: -4px;
      height: 24px;
      width: 24px;
      background-color: #111;
      opacity: 0.25;
      border-radius: 3px;
      transition: all .15s ease-in-out;
    }
  }
`;