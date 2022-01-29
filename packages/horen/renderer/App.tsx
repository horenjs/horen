/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-30 00:26:45
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
import { useRecoilState } from 'recoil';
import { settingState, trackListState, tracksInQueueState } from '@/store';
import styled from 'styled-components';
import Library from './pages/library';
import SettingPage from './pages/setting';
import ControlPanel from './components/control-panel';
import { PlayQueue } from './components/play-queue';
import PlayShow from './components/play-show';
import TitlePanel from './components/title-panel';
import { notice } from './components/notification';
import { SettingDC, TrackDC } from './data-center';
import { Page, SettingFile } from 'types';
import { PAGES } from '../constant';
import Player from 'horen-plugin-player';

// 初始化一个播放器
// 这个播放器是全局唯一的播放器
export const player = new Player();

export default function App() {
  const [progress, setProgress] = React.useState(0);
  const [isQueueVisible, setIsQueueVisible] = React.useState(false);
  const [playShow, setPlayShow] = React.useState(false);
  const [isRebuilding, setIsRebuilding] = React.useState(false);
  /**
   * 音频加载进度
   */
  const [trackLoadProgress, setTrackLoadProgress] = React.useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  const [trackList, setTrackList] = useRecoilState(trackListState);
  const [setting, setSetting] = useRecoilState(settingState);
  const [tracksInQueue, setTracksInQueue] = useRecoilState(tracksInQueueState);

  /**
   * 保存当前播放列表到设置项中
   */
  const savePlaylist = async () => {
    return await SettingDC.set({
      ...setting,
      playList: tracksInQueue.map((t) => t.uuid || ''),
    });
  };

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
   * 从设置项中获取上次的播放列表
   * 并加载到状态库中
   * @param st 设置项
   */
  const getAndSetSavedPlaylist = async (st: SettingFile) => {
    const playList = [];
    for (const u of st.playList) {
      if (u !== '') {
        const t = await TrackDC.getByUUID(u);
        if (t) playList.push(t);
      }
    }
    setTracksInQueue(playList);
  };

  /**
   * 从设置项中获取曲库列表和相关信息
   * 并加载到状态库中
   * @param st 设置项
   */
  const getAndSetTrackList = async (st: SettingFile) => {
    // 抽取设置项：组件加载时是否刷新
    const rebuild = getSettingItem(st, 'start', 'rebuildWhenStart') as boolean;
    // 抽取设置项：曲库目录
    const paths = getSettingItem(st, 'common', 'collectionPaths') as string[];

    if (rebuild) setTrackList(await TrackDC.rebuildCache(paths));
    else setTrackList(await TrackDC.getListCached());
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

  //
  //
  // 以下在组件加载时触发
  //
  //
  React.useEffect(() => {
    (async () => {
      // 获取设置
      const st = (await SettingDC.get()) as SettingFile;
      setSetting(st);
      // 获取音频列表
      await getAndSetSavedPlaylist(st);
      // 获取存储的音频播放列表
      await getAndSetTrackList(st);
      //
    })();
  }, []);

  return (
    <MyApp className="app">
      <TitlePanel
        onClose={async () => {
          if (confirm('是否保存当前播放列表?')) return await savePlaylist();
        }}
      />
      <div className="pages">
        <div className="page-header electron-drag">
          {PAGES.map(renderPageHeader)}
        </div>
        <div className="page-container perfect-scrollbar electron-drag">
          <Routes>
            <Route path="/">
              {/* 歌曲库页面 */}
              <Route index element={<Navigate to="library" />} />
              <Route path="library" element={<Library />} />
              {/* 设置页面 */}
              <Route path="setting" element={<SettingPage />} />
              {/* 未匹配到路由时自动跳转到曲库页面 */}
              <Route path="*" element={<Navigate to="library" />} />
            </Route>
          </Routes>
        </div>
      </div>

      {/* 歌曲控制中心 */}
      <ControlPanel
        onSeek={(per) => (player.seek = per * player.duration)}
        onShow={() => setPlayShow(true)}
        progress={progress}
        onOpenQueue={() => setIsQueueVisible(true)}
        onRebuildCache={() => {
          if (window.confirm('确定要重建缓存数据库吗?')) {
            if (!isRebuilding) {
              (async () => {
                // 抽取设置项：曲库目录
                const paths = getSettingItem(
                  setting,
                  'common',
                  'collectionPaths'
                ) as string[];
                const tracks = await TrackDC.rebuildCache(paths);
                setTrackList(tracks);
                setTracksInQueue([]);
              })();
              setIsRebuilding(true);
            } else {
              window.alert('正在重建缓存数据库请勿重复点击');
            }
          }
        }}
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
  .pages {
    background-color: #313233;
    user-select: none;
    .page-header {
      margin: 0 32px;
      padding: 40px 0 0 0;
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
`;
