import React from 'react';
import './song-list.css';


interface IProps {
  album?: string,
  name?: string,
}

function SongList (props: IProps) :React.ReactElement {
  return (
    <div className="song-list">
      <ol>
        <li>hello</li>
        <li>hello</li>
        <li>hello</li>
        <li>hello</li>
        <li>hello</li>
        <li>hello</li>
      </ol>
    </div>
  );
}

export default SongList;