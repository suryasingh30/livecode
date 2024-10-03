import AceEditor from "react-ace";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Use Next.js router
import { toast } from "@/hooks/use-toast";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-sublime";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

export default function Room({ socket, username, meetingId}) {
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [fetchedCode, setFetchedCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [codeKeybinding, setCodeKeybinding] = useState();
//   const router = useRouter(); // Get the router
  const roomId = meetingId; // Extract roomId from query

  const languagesAvailable = ["javascript", "c_cpp"];
  const codeKeybindingAvailable = ["default", "emacs"];

  function onChange(newValue) {
    setFetchedCode(newValue);
    socket.emit("update code", { roomId, code: newValue });
    socket.emit("syncing the language", { roomId });
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value === "default" ? undefined : e.target.value);
  }

  function handleCodeKeybindingChange(e) {
    setCodeKeybinding(e.target.value === "default" ? undefined : e.target.value);
  }

  function handleLeave() {
    socket.disconnect();
    router.push("/", { replace: true });
    toast({
      title: "Leaving Room",
      description: "You have successfully left the room.",
      duration: 3000,
    });
  }

  useEffect(() => {
    if (!roomId) return; // Wait for roomId to be available

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
      socket.disconnect(); // Cleanup on unmount
    };
  }, [socket, roomId]); // Added roomId to the dependency array

  return (
    <div className="room">
      <div className="roomSidebar">
        <div className="roomSidebarUsersWrapper">
          <div className="languageFieldWrapper">
            <select className="languageField" value={language} onChange={handleLanguageChange}>
              {languagesAvailable.map((eachLangage) => (
                <option key={eachLangage} value={eachLangage}>
                  {eachLangage}
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

          {/* <p>Connected Users:</p>
          <div className="roomSidebarUsers">
            {fetchedUsers.map((each) => (
              <div key={each} className="roomSidebarUsersEach">
                <div className="roomSidebarUsersEachAvatar" style={{ backgroundColor: `${generateColor(each)}` }}>
                  {each.slice(0, 2).toUpperCase()}
                </div>
                <div className="roomSidebarUsersEachName">{each}</div>
              </div>
            ))}
          </div> */}
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
