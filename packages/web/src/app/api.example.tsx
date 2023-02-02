import React from "react";
import {fetchUserInfo} from "@api/user";

export default function ApiExample() {
  const [apiData, setApiData] = React.useState(null);

  return (
    <div>
      <button onClick={() => {
        fetchUserInfo().then((res: { code: number; msg: string }) => setApiData(res));
      }}>api: get</button>
      <span>code: { apiData?.code }, msg: { apiData?.msg }</span>
    </div>
  )
}