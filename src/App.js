import React, { useState, useEffect } from "react";
import Dexie from "dexie";
import FileUploader from "./components/FileUploader";
import Playlist from "./components/Playlist";
import AudioPlayer from "./components/AudioPlayer";

const db = new Dexie("AudioDatabase1");
db.version(1).stores({
  audioFiles: "++id, name, data",
  playbackState: "++id, trackIndex, currentTime",
});

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState();
  const [lastId, setLastId] = useState();

  const playNext = () => {
    if (currentTrack) {
      currentTrack.id < lastId
        ? setCurrentTrack(
            playlist[playlist.length - (lastId - currentTrack.id)]
          )
        : setCurrentTrack(playlist[0]);
    } else {
      const songIndex = parseInt(localStorage.getItem("playbackId"));
      songIndex < lastId
        ? setCurrentTrack(playlist[playlist.length - (lastId - songIndex)])
        : setCurrentTrack(playlist[0]);
    }
  };

  return (
    <div className="App">
      <FileUploader setLastId={setLastId} />
      <Playlist
        playlist={playlist}
        setPlaylist={setPlaylist}
        setLastId={setLastId}
        lastId={lastId}
        setCurrentTrack={setCurrentTrack}
      />
      {playlist && playlist.length > 0 && (
        <AudioPlayer currentTrack={currentTrack} playNext={playNext} />
      )}

      <button
        onClick={async () => {
          await db.audioFiles.clear();
          window.location.reload();
        }}
      >
        Clear Playlist
      </button>
    </div>
  );
}

export default App;
