"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  formatChatMessageLinks,
} from '@livekit/components-react';
import { useState, useEffect } from 'react';

export default function Page() {
  const [roomName, setRoomName] = useState('japan-vip-room');
  const [token, setToken] = useState("");

  async function joinRoom() {
    const username = "user-" + Math.floor(Math.random() * 10000);
    try {
      const resp = await fetch(`/api/token?room=${roomName}&username=${username}`);
      const data = await resp.json();
      setToken(data.token);
    } catch (e) {
      console.error(e);
    }
  }

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
        <h1 className="text-xl font-bold">VIP 专线 (H.264 硬解)</h1>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="text-black px-4 py-2 rounded"
        />
        <button onClick={joinRoom} className="bg-blue-600 px-6 py-2 rounded">
          Start Call
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // 【核心修改 1】连接选项：强制 H.264，关闭自动订阅低画质
      connectOptions={{
        autoSubscribe: true,
      }}
      // 【核心修改 2】发布选项：码率拉满，关闭联播，指定编码器
      options={{
        publishDefaults: {
          simulcast: false, // 关掉联播，只发一路流
          red: false,       // 关闭音频冗余，节省带宽
          videoCodec: 'h264', // 强制使用 H.264 硬件编码！关键！
          videoEncoding: {
            maxBitrate: 8_000_000, // 尝试拉到 8Mbps
            maxFramerate: 60,
          },
        },
        // 【核心修改 3】采集参数：稍微温和一点，防止 Safari 罢工
        videoCaptureDefaults: {
          deviceId: "", // 使用默认摄像头
          resolution: {
            width: 1920,
            height: 1080,
            frameRate: 60
          }
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