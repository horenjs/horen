import React, { useState } from 'react';
import defaultCover from '../defaultCover';

export const AlbumCover = (
  props: React.ImgHTMLAttributes<HTMLImageElement>
) => {
  const [isError, setIsError] = useState(true);
  const handleError = (e: React.SyntheticEvent) => {
    if (isError) {
      setIsError(false);
      (e.target as HTMLImageElement).src =
        'data:image/png;base64,' + defaultCover;
    }
  };
  return <img onError={handleError} {...props} />;
};
