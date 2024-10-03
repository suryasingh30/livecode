import AceEditor from "react-ace";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
// import { useRouter } from 'next/router'; 
import "@/components/roomCSS/Room.css";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-sublime";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

export default function Room({ socket, username, meetingId, useRouter}) {
  const router = useRouter(); // Initialize the router
  const [, setFetchedUsers] = useState([]);
  const [fetchedCode, setFetchedCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [codeKeybinding, setCodeKeybinding] = useState();

  const languagesAvailable = ["javascript", "c_cpp"];
  const codeKeybindingAvailable = ["default", "emacs"];

  function onChange(newValue) {
    setFetchedCode(newValue);
    socket.emit("update code", { roomId: meetingId, code: newValue }); // Use roomId
  }

  function handleLanguageChange(e) {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    socket.emit("update language", { roomId: meetingId, languageUsed: selectedLanguage }); // Use roomId
  }

  function handleCodeKeybindingChange(e) {
    setCodeKeybinding(e.target.value === "default" ? undefined : e.target.value);
  }

  function handleLeave() {
    socket.emit("leave room", { roomId: meetingId }); // Emit leave room with roomId
    socket.disconnect();
    router.push("/", { replace: true });
    toast({
      title: "Leaving Room",
      description: "You have successfully left the room.",
      duration: 3000,
    });
  }

  // useEffect(() => {
  //   if (!meetingId) return;

  //   socket.emit("when a user joins", { roomId: meetingId, username }); // Pass meetingId as roomId

  //   socket.on("updating client list", ({ userslist }) => {
  //     setFetchedUsers(userslist);
  //   });

  //   socket.on("on language change", ({ languageUsed }) => {
  //     setLanguage(languageUsed);
  //   });

  //   socket.on("on code change", ({ code }) => {
  //     setFetchedCode(code);
  //   });

  //   socket.on("new member joined", ({ username }) => {
  //     toast(`${username} joined the room`);
  //   });

  //   socket.on("member left", ({ username }) => {
  //     toast(`${username} left the room`);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket, meetingId, username]); 

  useEffect(() => {
    if (!meetingId || !socket) return; // Ensure meetingId exists before making any socket actions
  
    socket.emit("when a user joins", { roomId: meetingId, username });
  
    socket.on("updating client list", ({ userslist }) => {
      setFetchedUsers(userslist);
    });
  
    socket.on("on language change", ({ languageUsed }) => {
      setLanguage(languageUsed);
    });
  
    socket.on("on code change", ({ code }) => {
      setFetchedCode(code);
    });
  
    socket.on("new member joined", ({ username }) => {
      toast(`${username} joined the room`);
    });
  
    socket.on("member left", ({ username }) => {
      toast(`${username} left the room`);
    });
  
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [socket, meetingId, username]); 
  

  return (
    <div className="room">
      <div className="roomSidebar">
        <div className="roomSidebarUsersWrapper">
          <div className="languageFieldWrapper">
            <select className="languageField" value={language} onChange={handleLanguageChange}>
              {languagesAvailable.map((eachLanguage) => (
                <option key={eachLanguage} value={eachLanguage}>
                  {eachLanguage}
                </option>
              ))}
            </select>
          </div>

          <div className="languageFieldWrapper">
            <select className="languageField" value={codeKeybinding} onChange={handleCodeKeybindingChange}>
              {codeKeybindingAvailable.map((eachKeybinding) => (
                <option key={eachKeybinding} value={eachKeybinding}>
                  {eachKeybinding}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="roomSidebarBtn" onClick={handleLeave}>
          Leave
        </button>
      </div>

      <AceEditor
        placeholder="Write code here"
        className="roomCodeEditor"
        mode={language}
        keyboardHandler={codeKeybinding}
        theme="monokai"
        name="collabEditor"
        width="auto"
        height="auto"
        value={fetchedCode}
        onChange={onChange}
        fontSize={12}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        enableBasicAutocompletion={false}
        enableLiveAutocompletion={true}
        enableSnippets={false}
        wrapEnabled={true}
        tabSize={2}
        editorProps={{
          $blockScrolling: true,
        }}
      />
    </div>
  );
}
