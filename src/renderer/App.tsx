/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-02-01 17:34:48
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\App.tsx
 * @Description  :
 */
import React from 'react';
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  settingState,
  tracksInQueueState,
  albumListState,
  currentTrackSeekState,
  currentTrackState,
  currentTrackIsPlayingState,
} from '@/store';
import styled from 'styled-components';
import Library from './pages/library';
import SettingPage from './pages/setting';
import HomePage from './pages/home';
import MiniPlayer from "@/pages/mini";
import ControlPanel from './components/control-panel';
import { PlayQueue } from './components/play-queue';
import PlayShow from './components/play-show';
import TitlePanel from './components/title-panel';
import { notice } from './components/notification';
import { DisplayCate} from "@/components/display-cate";
import {SettingDC, TrackDC, PlayListDC, MainwindowDC} from './data-center';
import {
  Page,
  PlayListItem,
  PlayList,
  Rectangle,
} from 'types';
import { PAGES, MINI_PLAYER_BOUNDS } from 'constant';
import Player from '@/utils/player';
import {Cate} from "@/components/display-cate/cate";

// 初始化一个播放器
// 这个播放器是全局唯一的播放器
export const player = new Player();

export default function App() {
  const albumListLimit = 9999;
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * list display category
   */
  const [displayCate, setDisplayCate] = React.useState<Cate>('album');
  /**
   * main window: is in mini player
   */
  const [isMiniPlayer, setIsMiniPlayer] = React.useState(false);
  /**
   * is play queue visible?
   */
  const [isQueueVisible, setIsQueueVisible] = React.useState(false);
  /**
   * is play show visible?
   */
  const [isPlayShowVisible, setIsPlayShowVisible] = React.useState(false);
  /**
   * is rebuilding the cache?
   */
  const [isRebuilding, setIsRebuilding] = React.useState(false);
  /**
   * mini player bounds
   */
  const [bounds, setBounds] = React.useState<Rectangle>();
  /**
   * loading track progress status
   */
  const [trackLoadProgress, setTrackLoadProgress] = React.useState<string>('');

  const currentTrackSeek = useRecoilValue(currentTrackSeekState);
  const [isCurrentTrackPlaying, setIsCurrentTrackPlaying] = useRecoilState(currentTrackIsPlayingState);
  const [, setCurrentTrack] = useRecoilState(currentTrackState);
  const [, setAlbumList] = useRecoilState(albumListState);
  const [setting, setSetting] = useRecoilState(settingState);
  const [tracksInQueue, setTracksInQueue] = useRecoilState(tracksInQueueState);

  /**
   * 保存当前播放列表到设置项中
   */
  const savePlaylist = async () => {
    let currentIndex = 0;

    const children = [];
    let i = 0;

    for (const t of tracksInQueue) {
      let seek = 0;
      if (t.src === player.currentTrack?.src) {
        seek = player.seek;
        currentIndex = i;
      }
      children.push({src: t.src, status: 'paused', seek} as PlayListItem);
      i += 1;
    }

    const pyl: PlayList = {
      updateAt: new Date().valueOf(),
      title: 'default',
      name: '默认列表',
      currentIndex,
      children,
    }

    await PlayListDC.set(pyl);
  };

  /**
   * rebuild cache
   */
  const handleRebuildCache = () => {
    if (window.confirm('确定要重建缓存数据库吗?')) {
      if (!isRebuilding) {
        (async () => {
          const rebuilt = await TrackDC.rebuildCache(setting['common.collectionPaths']);
          if (rebuilt) {
            const res = await TrackDC.getAlbumList(albumListLimit);
            setIsRebuilding(false);
            if (res.code === 1) setAlbumList(res.data);
          }
          // 重建数据库后清空列表
          setTracksInQueue([]);
        })();
        setIsRebuilding(true);
      } else {
        window.alert('正在重建缓存数据库请勿重复点击');
      }
    }
  }
  /**
   * minimize the player
   */
  const handleSimpPlayer = () => {
    setIsMiniPlayer(!isMiniPlayer);
    setCurrentTrack(player.currentTrack);
    setIsCurrentTrackPlaying(player.playing);
    navigate('/mini-player');
    (async () => {
      const res = await MainwindowDC.getBounds();
      if (res.code === 1) {
        await MainwindowDC.setBounds(MINI_PLAYER_BOUNDS);
        setBounds(res.data);
      }
    })();
  }
  /**
   * 渲染页面的标题
   * @param p 页面
   * @returns 渲染后的页面
   */
  const renderPageHeader = (p: Page) => {
    const cls = location.pathname === p.path ? 'title actived' : 'title';
    return (
      <div
        className={cls + ' electron-no-drag'}
        key={p.name}
        onClick={() => navigate(p.path)}
      >
        {p.title}
      </div>
    );
  };
  /**
   * render the page routes
   */
  const renderPageRoutes = () => (
    <Routes>
      <Route path="/">
        {/* 歌曲库页面 */}
        <Route index element={<Navigate to="library" />} />
        <Route path="library" element={<Library cate={displayCate} />} />
        {/* 设置页面 */}
        <Route path="setting" element={<SettingPage />} />
        <Route path="home" element={<HomePage />} />
        {/* 未匹配到路由时自动跳转到曲库页面 */}
        <Route path="*" element={<Navigate to="library" />} />
      </Route>
    </Routes>
  )
  /**
   * render the mini player
   */
  const renderMiniPlayer = () => (
    <MiniPlayer
      onPrev={() => {
        player.skip('prev');
        setCurrentTrack(player.currentTrack);
      }}
      onPlayOrPause={() => {
        player.playOrPause();
        setIsCurrentTrackPlaying(!isCurrentTrackPlaying);
      }}
      onNext={() => {
        player.skip('next');
        setCurrentTrack(player.currentTrack);
      }}
      onExpand={() => {
        setIsMiniPlayer(false);
        navigate('/');
        if (bounds) {
          (async () => {
            await MainwindowDC.setBounds(bounds);
            setBounds(undefined);
          })();
        }
      }
      }/>
  )
  /**
   * 从设置项中获取上次的播放列表
   * 并加载到状态库中
   * @param pyls
   */
  const initPlaylist = async (pyls: PlayList[]) => {
    const defaultPlaylist = [];

    for (const pyl of pyls) {
      if (pyl.title === 'default') {
        for (const c of pyl.children) {
          const result = await TrackDC.getBySrc(c.src);
          if (result.code === 1) defaultPlaylist.push(result.data);
        }
      }
    }

    setTracksInQueue(defaultPlaylist);
  };

  //
  //
  // 以下在特定状态变更时触发
  //
  //

  // 监听主进程传递过来的音频文件读取进度信息
  React.useEffect(() => {
    (async () => {
      const msg = await TrackDC.getMsg();
      setTrackLoadProgress(msg);
      notice.flash(msg);
      if (msg === 'done') {
        setIsRebuilding(false);
        notice.destory();
      }
    })();
  }, [trackLoadProgress]);

  // 音频队列改变时触发
  React.useEffect(() => {
    player.trackList = tracksInQueue;
    // 队列改变时立即保存当前播放列表
    if (player.trackList.length !== 0) {
      (async () => savePlaylist())();
    }
  }, [tracksInQueue.length]);

  //
  //
  // 以下在组件加载时触发
  //
  //
  React.useEffect(() => {
    (async () => {
      // 获取设置
      const st = await SettingDC.get();
      setSetting(st);

      // 抽取设置项：组件加载时是否刷新
      const rebuild = st['common.rebuildWhenStart'];
      // 抽取设置项：曲库目录
      const paths = st['common.collectionPaths'];
      //
      const autoplay = st['common.autoplayWhenStart'];
      //
      const playerMode = st['track.status.playMode'];

      setIsCurrentTrackPlaying(autoplay);
      player.mode = playerMode;

      if (rebuild) {
        const rebuilt = await TrackDC.rebuildCache(paths);
        const al = await TrackDC.getAlbumList(albumListLimit);
        if (rebuilt && al.code === 1) setAlbumList(al.data);
      } else {
        const al = await TrackDC.getAlbumList(albumListLimit);
        if (al.code === 1) setAlbumList(al.data);
      }

      const pyls = await PlayListDC.getList();  // 获取播放列表（存储为文件的）
      await initPlaylist(pyls);                 // 初始化默认播放队列
    })();
  }, [])

  return (
    <MyApp className="app">
      {
        isMiniPlayer ?
          <Routes>
            <Route path={"/mini-player"}>
              <Route index element={renderMiniPlayer()} />
            </Route>
          </Routes>
          :
          <>
            <div className={'header'}>
              <TitlePanel onSimp={handleSimpPlayer} />
            </div>
            <div className="pages">
              <div className="page-header electron-drag">
                <div className={'page-title'}>
                  { PAGES.map(renderPageHeader) }
                </div>
                {
                  location.pathname === '/library' &&
                  <div className={'page-cate'}>
                    <DisplayCate cate={displayCate} onPick={(cate) => setDisplayCate(cate)}/>
                  </div>
                }
              </div>
              <div className="page-container perfect-scrollbar electron-no-drag">
                { renderPageRoutes() }
              </div>
            </div>
            {/* 歌曲控制中心 */}
            <div className="page-bottom">
              <ControlPanel
                onOpenShow={() => setIsPlayShowVisible(!isPlayShowVisible)}
                onOpenQueue={() => setIsQueueVisible(true)}
                onRebuildCache={handleRebuildCache}
              />
            </div>
            {/* 当前播放队列 */}
            <PlayQueue visible={isQueueVisible} onClose={() => setIsQueueVisible(false)}/>
            {/* 正在播放展示页面 */}
            <PlayShow
              currentTrack={player.currentTrack}
              seek={currentTrackSeek}
              visible={isPlayShowVisible}
              onClose={() => setIsPlayShowVisible(false)}
            />
          </>
      }
    </MyApp>
  );
}

const MyApp = styled.div`
  margin: 0;
  padding: 0;
  .pages {
    background-color: #313233;
    user-select: none;
    padding-top: 40px;
    .page-header {
      margin: 0 32px;
      padding: 0 28px 0 0;
      display: flex;
      align-items: center;
      .page-title {
        display: flex;
        flex-grow: 1;
        .title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #717273;
          margin: 0 16px;
          text-transform: capitalize;
          line-height: 40px;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
          &.actived {
            color: #f1f1f1;
            font-size: 2rem;
          }
        }
      }
      .page-cate {
        position: relative;
        top: 8px;
      }
    }
    .page-container {
      padding: 0 44px 32px 44px;
      margin-top: 24px;
      height: calc(100vh - 192px);
      overflow-y: auto;
    }
  }
  .page-bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 999;
    user-select: none;
  }
`;
