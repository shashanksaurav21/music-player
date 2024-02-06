// src/components/FileUploader.js
import React from "react";
import Dexie from "dexie";

const db = new Dexie("AudioDatabase1");
db.version(1).stores({
  audioFiles: "++id, name, data",
  playbackState: "++id, trackIndex, currentTime",
});

const FileUploader = ({ setLastId }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();

        reader.onload = async () => {
          const audioData = new Uint8Array(reader.result);
          const fileName = file.name;

          // Save to IndexedDB
          const fileId = await db.audioFiles.add({
            name: fileName,
            data: audioData,
          });

          setLastId(fileId);
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  return (
    <div>
      <label htmlFor="fileInput">Upload Audio File:</label>
      <input
        type="file"
        id="fileInput"
        accept=".mp3"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;
