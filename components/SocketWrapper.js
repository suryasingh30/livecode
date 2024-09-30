import React, {useEffect} from 'react';
import {toast} from "@radix-ui/react-toast";
import {replace, useLocaion, useNavigate, useParams} from "react-router-dom";
import {io} from "socket.io-client";


function addPropsToReactElement(element, propps){
    if(React.isValidElement(element)){
        return React.cloneElement(element, props)
    }
    return element
}

function addPropsToChildren(children, props){
    if(!Array.isArray(children)){
        return addPropsToReactElement(children, props)
    }
    return children.map(childElement => 
        addPropsToReactElement(childElement, props)
    )
}

export default function SocketWrapper({children}){
    const socket = io.connect(process.env.REACT_APP_WE_SOCKET_URL || "http://localhost:5000")

    const location = useLocaion()
    const navigate = useNavigate()
    const {meetingId} = useParams()

    useEffect(()=>{
        function kickStrangerOut(){
            navigate("/", {replave: true})
            toast.error("No username provided")
        }

        location.state && location.state.username ? socket.emit("whe a user joins", {roomId, username: location.state.username}) : kickStrangerOut()
    }, [socket, location.state, roomId, navigate])

    return location.state && location.state.username ? <div>
        {addPropsToChildren(children, {socket})}
    </div> : (
        <div className='room'>
            <h2>
                No username provided. Please use he form to join a room.
            </h2>
        </div>
    )
}


