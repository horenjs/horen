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
      if (type === 1) {
        const result = res.data.result;
        if (result.songCount > 0) {
          return result.songs;
        }
      }

      if (type === 10) {
        const result = res.data.result;
        if (result.albumCount > 0) {
          return result.albums;
        }
      }

      if (type === 100) {
        const result = res.data.result;
        if (result.artistCount > 0) {
          return result.artists;
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
