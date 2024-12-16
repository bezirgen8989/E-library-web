import { useRef, useEffect, useState } from "react";
import SimplePeer from "simple-peer";

const WebRTCChat = () => {
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const newPeer = new SimplePeer({
          initiator: window.location.hash === "#init",
          trickle: false,
          stream,
        });

        newPeer.on("signal", (data) => {
          if (connectionRef.current) {
            connectionRef.current.value = JSON.stringify(data);
          }
        });

        newPeer.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        newPeer.on("connect", () => {
          setIsConnected(true);
          console.log("Peer connected!");
        });

        setPeer(newPeer);
      })
      .catch((err) => console.error("Error accessing media devices:", err));
  }, []);

  // Обработчик для подключения по сигналу
  const connectToPeer = () => {
    const signal = connectionRef.current?.value;
    if (signal && peer) {
      peer.signal(JSON.parse(signal));
    }
  };

  return (
    <div>
      <h2>WebRTC Video Chat</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h3>Local Video</h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            style={{ width: "300px", height: "auto" }}
          />
        </div>
        <div>
          <h3>Remote Video</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            style={{ width: "300px", height: "auto" }}
          />
        </div>
      </div>

      <div>
        <h3>Connection</h3>
        <textarea
          ref={connectionRef}
          placeholder="Paste signal data here"
          rows={5}
          cols={50}
        />
        <br />
        <button onClick={connectToPeer} disabled={!peer || isConnected}>
          Connect
        </button>
      </div>
    </div>
  );
};

export default WebRTCChat;
