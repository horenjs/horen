import React from "react";

import RouterExample from "./router.example";
// only in electron renderer process
import IpcExample from "./ipc.example";
import ReduxExample from "./redux.example";
import ApiExample from "./api.example";
import HotLoaderExample from "./hot-loader.example";

function App() {
  return (
    <div className="react-typescript-app">
      <HotLoaderExample />
      <hr />
      <ApiExample />
      <hr />
      <ReduxExample />
      <hr />
      <RouterExample />
      <hr />
      {/* only in electron renderer process */}
      { window.ipc && <IpcExample /> }
    </div>
  );
}

export default App;
