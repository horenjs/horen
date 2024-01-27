import axios from 'axios';

export const fetchAlbumCover = async (
  albumName: string,
  artistName: string = null
) => {
  await sleep(1000);
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
          if (artistName && album?.artist?.name === artistName) {
            return album.picUrl;
          }
        }
        return albums[0].picUrl;
      }
    }
  } catch (err) {
    return null;
  }
};

function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
