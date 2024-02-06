import React, { useEffect } from "react";
import Dexie from "dexie";

const db = new Dexie("AudioDatabase1");
db.version(1).stores({
  audioFiles: "++id, name, data",
  playbackState: "++id, trackIndex, currentTime",
});
const Playlist = ({
  playlist,
  setPlaylist,
  setLastId,
  lastId,
  setCurrentTrack,
}) => {
  useEffect(() => {
    const loadPlaylist = async () => {
      const files = await db.audioFiles.toArray();
      setPlaylist(files);
      files.length > 0 && setLastId(files[files.length - 1].id);
    };
    loadPlaylist();
  }, [lastId]);
  return (
    <div>
      <h2>Playlist</h2>
      <ul>
        {playlist &&
          playlist.map((file, index) => (
            <li key={file.id} onClick={() => setCurrentTrack(playlist[index])}>
              {file.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Playlist;
