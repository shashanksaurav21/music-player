import React, { useRef, useState, useEffect } from "react";
import Dexie from "dexie";

const db = new Dexie("AudioDatabase1");
db.version(1).stores({
  audioFiles: "++id, name, data",
  playbackState: "++id, trackIndex, currentTime",
});

const AudioPlayer = ({ currentTrack, playNext, reloadApp }) => {
  const [playlistName, setPlaylistName] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentTrack) {
      const file = currentTrack;
      setPlaylistName(currentTrack.name);
      const blob = new Blob([file.data], { type: "audio/mp3" });
      audioRef.current.src = URL.createObjectURL(blob);
      audioRef.current.play();

      localStorage.setItem("playbackId", currentTrack.id);
      const savePlaybackState = () => {
        localStorage.setItem("playbackTime", audioRef.current.currentTime);
      };
      setInterval(savePlaybackState, 1000);
    } else {
      const loadAudio = async () => {
        const songIndex = parseInt(localStorage.getItem("playbackId"));

        const playbackTime = parseInt(localStorage.getItem("playbackTime"));
        const file = await db.audioFiles.where("id").equals(songIndex).first();
        file && setPlaylistName(file.name);
        if (file) {
          const blob = new Blob([file.data], { type: "audio/mp3" });
          audioRef.current.src = URL.createObjectURL(blob);
          audioRef.current.currentTime = playbackTime;
          const savePlaybackState = () => {
            localStorage.setItem("playbackTime", audioRef.current.currentTime);
          };
          setInterval(savePlaybackState, 1000);
          // audioRef.current.play();
        }
      };
      loadAudio();
    }
  }, [currentTrack]);

  return (
    <div>
      AudioPlayer
      <h5>{playlistName && playlistName}</h5>
      <audio ref={audioRef} controls onEnded={playNext} autoPlay={true} />
    </div>
  );
};

export default AudioPlayer;
