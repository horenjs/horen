import axios from 'axios';

export const fetchAlbumCover = async (
  albumName: string,
  artistName: string
) => {
  const data = {
    s: albumName + ' ' + artistName,
    type: 10,
    offset: 0,
    total: true,
    limit: 30,
  };
  const url = 'https://music.163.com/api/search/get/web';
  try {
    const res = await axios.get(url, { params: data });
    if (res.status === 200) {
      const albums = res.data.result?.albums;
      if (albums.length > 0) {
        for (const album of albums) {
          if (album?.artist?.name === artistName) {
            return album.picUrl;
          }
        }
      }
    }
  } catch (err) {
    return null;
  }
};
