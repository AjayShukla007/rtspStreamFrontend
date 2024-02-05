import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ReactPlayer from "react-player";
import { openDB } from "idb";

import Overlay from "./components/overlay/Overlay.jsx";

const socket = io("http://localhost:5000");
function App() {
  const [streamUrl, setStreamUrl] = useState("");
  const [overlays, setOverlays] = useState([]);
  const [currentOverlay, setCurrentOverlay] = useState({
    position: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
    content: "Your Text Here"
  });

  const openDBPromise = openDB("OverlayDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("overlays")) {
        db.createObjectStore("overlays", { keyPath: "id" });
      }
    }
  });

  const saveOverlaysToIndexedDB = async () => {
    try {
      const db = await openDBPromise;
      const transaction = db.transaction("overlays", "readwrite");
      const store = transaction.objectStore("overlays");

      await store.clear();

      overlays.forEach(async overlay => {
        await store.add(overlay);
      });

      console.log("Overlays saved to IndexedDB:", overlays);
    } catch (error) {
      console.error("Error saving overlays to IndexedDB:", error);
    }
  };

  const loadOverlaysFromIndexedDB = async () => {
    try {
      const db = await openDBPromise;
      const transaction = db.transaction("overlays", "readonly");
      const store = transaction.objectStore("overlays");

      const cursor = await store.openCursor();

      const loadedOverlays = [];
      while (cursor) {
        loadedOverlays.push(cursor.value);
        cursor.continue();
      }

      setOverlays(loadedOverlays);
      console.log("Overlays loaded from IndexedDB:", loadedOverlays);
    } catch (error) {
      console.error("Error loading overlays from IndexedDB:", error);
    }
  };

  useEffect(() => {
    const videoSocket = io("http://localhost:8081");

    videoSocket.on("stream", image => {
      const base64Image = `data:image/jpeg;base64,${image}`;
      setStreamUrl(base64Image);
    });

    return () => {
      videoSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    loadOverlaysFromIndexedDB();
  }, []);

  useEffect(() => {
    saveOverlaysToIndexedDB();
  }, [overlays]);

  const handleOverlaySave = () => {
    const newOverlay = { ...currentOverlay, id: Date.now() };
    setOverlays([...overlays, newOverlay]);
    setCurrentOverlay({
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      content: "Your Text Here"
    });
  };

  const handleOverlayDelete = overlayId => {
    setOverlays(overlays.filter(overlay => overlay.id !== overlayId));
  };

  const handleOverlayEdit = (overlayId, updatedOverlay) => {
    const updatedOverlays = overlays.map(overlay =>
      overlay.id === overlayId ? { ...overlay, ...updatedOverlay } : overlay
    );
    setOverlays(updatedOverlays);
  };

  return (
    <div className="App">
      <h1>RTSP Livestream Viewer</h1>
      <ReactPlayer
        url={streamUrl}
        playing={true}
        controls={true}
        width="640px"
        height="480px"
      />
      <div>
        {overlays.map(overlay => (
          <Overlay
            key={overlay.id}
            overlay={overlay}
            onDelete={handleOverlayDelete}
            onEdit={handleOverlayEdit}
          />
        ))}
      </div>
      <div>
        <button onClick={handleOverlaySave}>Add</button>
      </div>
    </div>
  );
}

export default App;
