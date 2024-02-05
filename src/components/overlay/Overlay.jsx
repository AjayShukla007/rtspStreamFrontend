import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ReactPlayer from "react-player";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";

const socket = io("http://localhost:5000");

const Overlay = ({ overlay, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(overlay.content);

  const handleDelete = () => {
    onDelete(overlay.id);
  };

  const handleEdit = () => {
    if (isEditing) {
      onEdit(overlay.id, {
        position: { x: overlay.position.x, y: overlay.position.y },
        size: { width: overlay.size.width, height: overlay.size.height },
        content: editedContent
      });
    }
    setIsEditing(!isEditing);
  };

  const handleContentChange = e => {
    setEditedContent(e.target.value);
  };

  return (
    <Draggable bounds="parent">
      <Resizable
        width={overlay.size.width}
        height={overlay.size.height}
        onResize={(e, data) => console.log(data)}
      >
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: overlay.position.y,
            left: overlay.position.x,
            border: "1px solid #000",
            padding: "5px"
          }}
        >
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleEdit}>{isEditing ? "Done" : "Edit"}</button>
          {isEditing ? (
            <textarea value={editedContent} onChange={handleContentChange} />
          ) : (
            <p>{overlay.content}</p>
          )}
        </div>
      </Resizable>
    </Draggable>
  );
};

export default Overlay;
