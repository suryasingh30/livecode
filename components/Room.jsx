import AceEditor from "react-ace";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import "@/components/roomCSS/Room.css";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-sublime";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

export default function Room({ socket, username, meetingId }) {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [, setFetchedUsers] = useState([]);
  const [fetchedCode, setFetchedCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [codeKeybinding,] = useState();
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const languagesAvailable = ["javascript","cpp","java","python","c",];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer); // Clean up the interval
  }, []);
  // code run api call
  async function runCode() {
    setIsRunning(true); // Set loading state
    const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute"; // Piston API endpoint

    const payload = {
      language,
      version: "*", // Piston supports multiple versions, "*" indicates latest version
      files: [{ content: fetchedCode }]
    };

    try {
      const response = await fetch(PISTON_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setOutput(result.run.stdout || result.run.stderr); // Display output or error
    } catch (error) {
      setOutput("Error executing the code");
    } finally {
      setIsRunning(false); // Reset loading state
    }
  }

  function onChange(newValue) {
    setFetchedCode(newValue);
    socket.emit("update code", { roomId: meetingId, code: newValue }); // Use roomId
  }

  function handleLanguageChange(e) {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    socket.emit("update language", {
      roomId: meetingId,
      languageUsed: selectedLanguage,
    }); // Use roomId
  }

  useEffect(() => {
    if (!meetingId || !socket) return;

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
            <select
              className="languageField"
              value={language}
              onChange={handleLanguageChange}
            >
              {languagesAvailable.map((eachLanguage) => (
                <option key={eachLanguage} value={eachLanguage}>
                  {eachLanguage}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="languageFieldWrapper">
            <select className="languageField" value={codeKeybinding} onChange={handleCodeKeybindingChange}>
              {codeKeybindingAvailable.map((eachKeybinding) => (
                <option key={eachKeybinding} value={eachKeybinding}>
                  {eachKeybinding}
                </option>
              ))}
            </select>
          </div> */}

      
        </div>
        <button onClick={runCode} className="runCodeBtn" disabled={isRunning}>
          {isRunning ? "Running..." : "Run Code"}
        </button>
        <div className="meetingInfo">
          <p><strong>Meeting ID:</strong> {meetingId}</p>
        </div>
         {/* Display Current Time */}
         <div className="meetingTime">
          <p><strong>Current Time:</strong> {currentTime}</p>
        </div>
      </div>
      <div className="editorWrapper">

      <AceEditor
        className="editorContainer"
        style={{
          overflow: "auto",
        }}
        scrollMargin={100}
        placeholder="Write code here"
        mode={language}
        keyboardHandler={codeKeybinding}
        theme="dracula"
        name="collabEditor"
        width="100%"
        value={fetchedCode}
        onChange={onChange}
        fontSize={18}
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
      

        <div className="outputWindow">
          <h3>Output:</h3>
          <pre>{output || "Your output will be displayed here..."}</pre>
        </div>
        </div>
    </div>
  );
}
