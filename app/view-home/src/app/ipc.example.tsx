import React from 'react';
import { sendMsg, receiveMsg, openNewWindow } from '@api/ipc.api';

export default function IpcExample() {
  const [ipcMsg, setIpcMsg] = React.useState('');

  React.useEffect(() => {
    receiveMsg().then(msg => setIpcMsg(msg)).catch(console.error);
  }, []);

  return (
    <div>
      <h3>send msg via ipc after 2 seconds</h3>
      <button onClick={() => sendMsg('hello, ipc!')}>send</button>
      <p><span>receive msg: </span>{ ipcMsg }</p>
      <h3>Open Setting Page</h3>
      <button onClick={() => openNewWindow('setting')}>open</button>
    </div>
  )
}