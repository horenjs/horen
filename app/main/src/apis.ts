import axios from 'axios';

type Params = {
  albumName?: string;
  artistName?: string;
  songName?: string;
  type?: number;
};

export const fetchCover = async ({
  albumName = '',
  artistName = '',
  songName = '',
  type = 10,
}: Params) => {
  await sleep(1000);
  const kws = {
    100: artistName,
    10: albumName + ' ' + artistName,
    1: songName + ' ' + artistName,
  };
  const data = {
    s: kws[type],
    type,
    offset: 0,
    total: true,
    limit: 30,
  };
  const url = 'https://music.163.com/api/search/get/web';
  try {
    const res = await axios.get(url, { params: data });
    if (res.status === 200) {
      if (type === 10) {
        const albums = res.data.result?.albums;
        if (albums.length > 0) {
          for (const album of albums) {
            if (artistName && album?.artist?.name === artistName) {
              return album.picUrl;
            }
          }
          return albums[0]?.picUrl;
        }
      }

      if (type === 100) {
        const artists = res.data.result?.artists;
        if (artists.length > 0) {
          for (const artist of artists) {
            if (artistName && artist?.name === artistName) {
              return artist.picUrl;
            }
          }
          return artists[0]?.picUrl;
        }
      }
    }
  } catch (err) {
    return null;
  }
};

function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
