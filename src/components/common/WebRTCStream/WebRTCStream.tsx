import { useRef, useState } from "react";

const WebRTCStreamPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const serverUrl =
    "http://avatars.plavno.app:1990/rtc/v1/whep/?app=live&stream=livestream";

  const startStream = () => {
    if (isPlaying) return;

    const peerConnection = new RTCPeerConnection();

    peerConnection.ontrack = (event) => {
      if (videoRef.current && event.streams.length > 0) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    fetch(serverUrl, { method: "POST" })
      .then((response) => response.json())
      .then(async (offer) => {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        return fetch(serverUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(peerConnection.localDescription),
        });
      })
      .then(() => {
        setIsPlaying(true);
        setPc(peerConnection);
      })
      .catch((err) => {
        console.error("Error fetching WebRTC offer:", err);
      });
  };

  const stopStream = () => {
    if (pc) {
      pc.close();
      setPc(null);
      setIsPlaying(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div>
      <div style={{ color: "#fff", marginBottom: "10px" }}>
        WebRTC Stream Player
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto", backgroundColor: "#000" }}
      />
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={startStream}
          disabled={isPlaying}
          style={{ marginRight: "10px" }}
        >
          Play
        </button>
        <button onClick={stopStream} disabled={!isPlaying}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default WebRTCStreamPlayer;
