import React, { useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "@/hooks/use-toast"; // Ensure this import is correct

interface SocketWrapperProps {
  children: ReactNode;
  username: string;
  meetingId: string;
  onError?: (message: string) => void; // Optional error callback
}

function addPropsToReactElement(element: ReactNode, props: object) {
  if (React.isValidElement(element)) {
    return React.cloneElement(element, props);
  }
  return element;
}

function addPropsToChildren(children: ReactNode, props: object) {
  if (!Array.isArray(children)) {
    return addPropsToReactElement(children, props);
  }
  return React.Children.map(children, (childElement) =>
    addPropsToReactElement(childElement, props)
  );
}

export default function SocketWrapper({
  children,
  username,
  meetingId,
  onError,
}: SocketWrapperProps) {
  const socket: Socket = io(process.env.REACT_APP_WE_SOCKET_URL || "http://localhost:5000");

  useEffect(() => {
    if (username && meetingId) {
      socket.emit("user joined", { roomId: meetingId, username });
    } else {
      // Call onError callback if provided
      onError
        ? onError("No username or meeting ID provided")
        : toast({ title: "Error", description: "No username or meeting ID provided" });
    }
  }, [socket, username, meetingId, onError]);

  return username ? (
    <div>{addPropsToChildren(children, { socket, username })}</div>
  ) : (
    <div className="room">
      <h2>No username provided. Please use the form to join the room.</h2>
    </div>
  );
}
