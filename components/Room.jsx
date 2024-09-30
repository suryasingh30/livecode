import AceEditor from "react-ace";
import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import {generateColor} from 

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-sublime";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

export default function Room({ socket, roomId }){

    const [fetchedCode, setFetchedCode] = useState(()=>""); // lazy loading try kiya hun ekbar
    const [language, setLanguage] = useState(()=>"javascript");
    const [codekeybindinng, setCodeKeybinding] = useState(()=>undefined);

    const languagesAvailable = ["javascrit", "c_cpp"];
    const codekeybindinngsAvaiilavle = ["default", "emacs"];

    function onChange(newValue){
        setFetchedCode(newValue)
        socket.emit("update code", {roomId, code: newValue})
        socket.emit("syncing the language", {roomId: roomId})
    }

    function handleLanguageChange(e){
        setLanguage(e.target.value === "defaul" ? undefined : e.target.value)
    }

    function handleLeave(){
        socket.disconnect()
    }

}



