"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { useState } from 'react';

export default function Page() {
  const [roomName, setRoomName] = useState('japan-room'); // 默认房间号
  const [token, setToken] = useState("");

  async function joinRoom() {
    // 随机生成一个用户名，比如 user-1234
    const username = "user-" + Math.floor(Math.random() * 10000);

    // 请求我们刚才写的 API 获取 Token
    const resp = await fetch(`/api/token?room=${roomName}&username=${username}`);
    const data = await resp.json();
    setToken(data.token);
  }

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
        <h1 className="text-2xl font-bold">1080P 高清专属视频通话</h1>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="text-black px-4 py-2 rounded"
        />
        <button onClick={joinRoom} className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500">
          加入房间
        </button>
      </div>
    );
  }

  // 这里的参数是你想要的高画质核心！
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // 核心：强制拉起 1080P 60帧 的摄像头画面
      options={{
        videoCaptureDefaults: {
          resolution: { width: 1920, height: 1080, frameRate: 60 },
        },
        publishDefaults: {
          // 关闭多分辨率自适应（为了强制高清，禁用联播）
          simulcast: false,
          videoEncoding: {
            maxBitrate: 5_000_000, // 强制 5 Mbps (5000 kbps) 码率
            maxFramerate: 60,
          },
        },
      }}
      data-lk-theme="default"
      style={{ height: '100vh' }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}