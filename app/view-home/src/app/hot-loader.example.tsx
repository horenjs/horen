import React from 'react';

export default function HotLoaderExample() {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <div>
        <button onClick={handleClick}>
          {isVisible ? "hidden" : "show"} banner
        </button>
      </div>
      <div id="banner" style={{ visibility: isVisible ? "visible" : "hidden" }}>
        <p>这个条幅可以在修改时保持状态，你可以尝试修改</p>
      </div>
    </div>
  )
}