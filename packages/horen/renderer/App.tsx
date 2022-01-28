/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-28 23:48:51
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\App.tsx
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
import { useRecoilState, useSetRecoilState } from 'recoil';
import { settingState, trackListState, tracksInQueueState } from '@/store';
import styled from 'styled-components';
import Library from './pages/library';
import SettingPage from './pages/setting';
import ControlPanel from './components/control-panel';
import { PlayQueue } from './components/play-queue';
import PlayShow from './components/play-show';
import { SettingDC, TrackDC } from './data-center';
import { SettingFile, Track } from 'types';
import { PAGES } from '../constant';
import Player from 'horen-plugin-player';

// 初始化一个播放器
// 这个播放器是全局唯一的播放器
export const player = new Player();

export default function App() {
  const [progress, setProgress] = React.useState(0);
  const [isQueueVisible, setIsQueueVisible] = React.useState(false);
  const [playShow, setPlayShow] = React.useState(false);
  /**
   * 音频加载进度
   */
  const [trackLoadProgress, setTrackLoadProgress] = React.useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  const [trackList, setTrackList] = useRecoilState(trackListState);
  const setSetting = useSetRecoilState(settingState);
  const [tracksInQueue, setTracksInQueue] = useRecoilState(tracksInQueueState);

  const isTrackLoaded =
    trackList.length > 0 ||
    trackLoadProgress === 'done' ||
    trackLoadProgress === '';

  const handleAddTrack = (tracks: Track[]) => {
    const tracksToPlay = tracks.map((track) => {
      return { ...track, playStatus: 'in-queue' };
    }) as Track[];

    setTracksInQueue([...tracksInQueue, ...tracksToPlay]);
  };

  // 监听主进程传递过来的音频文件读取进度信息
  React.useEffect(() => {
    (async () => {
      const msg = await TrackDC.getMsg();
      setTrackLoadProgress(msg);
    })();
  }, [trackLoadProgress, trackList.length]);

  // 音频队列改变时触发
  React.useEffect(() => {
    player.trackList = tracksInQueue;
  }, [tracksInQueue.length]);

  // 每隔一秒刷新播放进度
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((player.seek / player.duration) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [progress]);

  // 组件加载时获取设置并获取所有音频
  React.useEffect(() => {
    (async () => {
      // 获取设置
      const st = (await SettingDC.get()) as SettingFile;
      setSetting(st);
      // 抽取设置项：组件加载时是否刷新
      const rebuild = getSettingItem(
        st,
        'start',
        'rebuildWhenStart'
      ) as boolean;
      // 抽取设置项：曲库目录
      const paths = getSettingItem(st, 'common', 'collectionPaths') as string[];

      if (rebuild) {
        setTrackList(await TrackDC.rebuildCache(paths));
      } else {
        setTrackList(await TrackDC.getListCached());
      }
    })();
  }, []);

  return (
    <MyApp className="app">
      {!isTrackLoaded && (
        <div className="track-load-progress">{trackLoadProgress}</div>
      )}
      <div className="pages">
        <div className="page-header">
          {PAGES.map((p) => {
            const cls =
              location.pathname === p.path ? 'title actived' : 'title';
            return (
              <div
                className={cls}
                key={p.name}
                onClick={() => navigate(p.path)}
              >
                {p.title}
              </div>
            );
          })}
        </div>
        <div className="page-container perfect-scrollbar">
          <Routes>
            <Route path="/">
              <Route index element={<Navigate to="library" />} />
              {/* 歌曲库 */}
              <Route
                path="library"
                element={<Library onAddTo={handleAddTrack} />}
              />
              {/* setting page */}
              <Route path="setting" element={<SettingPage />} />
              <Route path="*" element={<Navigate to="library" />} />
            </Route>
          </Routes>
        </div>
      </div>

      {/* 歌曲控制中心 */}
      <ControlPanel
        track={player.currentTrack}
        playing={player.playing}
        onPrev={() => player.skip('prev')}
        onPlayOrPause={() => player.playOrPause()}
        onNext={() => player.skip('next')}
        onSeek={(per) => (player.seek = per * player.duration)}
        onShow={() => setPlayShow(true)}
        progress={progress}
        plugin={
          <div
            className="control-panel-plugin-queue"
            role="button"
            onClick={() => setIsQueueVisible(true)}
          >
            <div>打开队列</div>
            <span>{player.trackList.length} 首歌曲</span>
          </div>
        }
      />
      {/* 当前播放队列 */}
      <PlayQueue
        tracks={player.trackList}
        track={player.currentTrack}
        visible={isQueueVisible}
        onPlay={(track) => (player.currentTrack = track)}
        onClose={() => setIsQueueVisible(false)}
      />
      <PlayShow
        playingTrack={player.currentTrack}
        visible={playShow}
        onClose={() => {
          setPlayShow(false);
        }}
      />
    </MyApp>
  );
}

/**
 * 从设置中找到曲库目录
 * @param setting SettingFile
 * @returns collection paths
 */
function getSettingItem(
  setting: SettingFile,
  groupName: string,
  itemLabel: string
) {
  const groups = setting.groups;

  if (!groups) return [];

  for (const group of groups) {
    if (group.name === groupName) {
      for (const c of group.children) {
        if (c.label === itemLabel) {
          return c.value;
        }
      }
    }
  }
}

const MyApp = styled.div`
  margin: 0;
  padding: 0;
  .track-load-progress {
    position: fixed;
    min-width: 800px;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #717273;
    padding: 4px 8px;
    font-size: 0.8rem;
    color: #f1f1f1;
    text-align: center;
    border-radius: 4px;
  }
  .pages {
    background-color: #313233;
    user-select: none;
    .page-header {
      margin: 0;
      padding: 40px 0 0 32px;
      display: flex;
      align-items: flex-end;
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
    .page-container {
      padding: 0 44px 32px 44px;
      margin-top: 24px;
      height: calc(100vh - 192px);
      overflow-y: auto;
    }
  }
  .control-panel-plugin-queue {
    cursor: pointer;
    user-select: none;
    text-align: center;
    div {
      font-size: 0.8rem;
    }
    span {
      font-size: 0.6rem;
    }
  }
`;
