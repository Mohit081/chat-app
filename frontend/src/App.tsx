import { useEffect, useRef, useState } from "react";


const App = () => {

  const [messages,setMessages] = useState(["hi there","hello"]);
  const wsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(()=>{
    //connect websocket
     const ws = new WebSocket("http://localhost:8080");

    //  receive message from server
     ws.onmessage = (event) => {
      setMessages(m => [...m,event.data]);
     }
     wsRef.current = ws;

    //  onopen is called once , when connection is successfully established
     ws.onopen = () => {
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }))
     }
     return () => {
      ws.close()
     }
  },[])
  return (
    <div className="h-screen bg-black">
      <div className="h-[85vh] pt-4">
        {
          messages.map(message => <div className="m-8">
            <span className="bg-white text-black rounded p-4">{message}</span>
          </div>)
        }
      </div>
      <div className="w-full bg-white flex">
        <input ref={inputRef} id="message" className="flex-1 p-4"></input>
        <button onClick={()=>{
          const message = inputRef.current?.value;
          wsRef.current?.send(JSON.stringify({
             type:"chat",
        payload:{
         message:message
        }
          }))
        }} className="bg-purple-600 text-white p-4">send message</button>
      </div>
    </div>
  );
};

export default App;
