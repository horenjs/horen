/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-27 16:29:24
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\App.tsx
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
import { useSetRecoilState } from 'recoil';
import { settingState, trackListState } from '@/store';
import styled from 'styled-components';
import Player from 'horen-plugin-player';
import Library from './pages/library';
import SettingPage from './pages/setting';
import ControlPanel from './components/control-panel';
import { PlayQueue } from './components/play-queue';
import { SettingDC, TrackDC } from './data-center';
import { SettingFile, SettingGroup, Track } from 'types';

const pages = [
  {
    title: 'Library',
    path: '/library',
  },
  {
    title: 'setting',
    path: '/setting',
  },
];

export default function App() {
  const [player, setPlayer] = React.useState(new Player());
  const [progress, setProgress] = React.useState(0);
  const [isQueue, setIsQueue] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const setTrackList = useSetRecoilState(trackListState);
  const setSetting = useSetRecoilState(settingState);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((player.seek / player.duration) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [progress]);

  React.useEffect(() => {
    (async () => {
      // 获取设置
      const setting = (await SettingDC.get()) as SettingFile;
      // 填入到 setting state 中
      setSetting(setting);
      // 从设置中将曲库位置取出
      // 设置一个空数组用于存储
      const tracks: Track[] = [];
      // 获取设置中的曲库位置列表
      const collectionPaths = getCollectionPaths(setting.groups) || [];
      // 遍历列表获取其中的所有音频列表
      for (const p of collectionPaths) {
        tracks.push(...(await TrackDC.getList(p)));
      }
      // 填入到相应的 state 中
      setTrackList(tracks);
    })();
  }, []);

  return (
    <MyApp className="app">
      {
        // <TitlePanel title="" operates={titlePanelOperates} />
      }
      <div className="pages">
        <div className="page-header">
          {pages.map((p) => {
            const cls =
              location.pathname === p.path ? 'title actived' : 'title';
            return (
              <div
                className={cls}
                key={p.title}
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
                element={
                  <Library
                    tracks={player.trackList}
                    onAddTo={(tracks) => {
                      // console.log(tracks);
                      player.trackList = player.trackList.concat(tracks);
                    }}
                  />
                }
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
        progress={progress}
        plugin={
          <div
            className="control-panel-plugin-queue"
            role="button"
            onClick={() => setIsQueue(true)}
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
        visible={isQueue}
        onPlay={(track) => (player.currentTrack = track)}
        onClose={() => setIsQueue(false)}
      />
    </MyApp>
  );
}

function getCollectionPaths(groups: SettingGroup[]) {
  for (const group of groups) {
    if (group.name === 'common') {
      for (const c of group.children) {
        if (c.label === 'collectionPaths') {
          return c.value as string[];
        }
      }
    }
  }
}

const MyApp = styled.div`
  margin: 0;
  padding: 0;
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
      height: calc(100vh - 168px);
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
