'use client';

import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function formatTimeRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (`${mins}:${secs.toString().padStart(2, "0")}`)
}

const room = () => {
  const params = useParams();
  const roomId = params.roomId as string;
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState('COPY');
  const [input, setInput]=useState('');
  const inputRef=useRef<HTMLInputElement>(null);
  const {username}=useUsername();
  const router=useRouter();
  

  const {data:messages,refetch}=useQuery({
    queryKey:["messages",roomId],
    queryFn:async()=>{
      const res=await client.messages.get({
        query:{roomId}
      })
      return res.data
    }
  })


  const {data:ttlData}=useQuery({
    queryKey:["ttl",roomId],
    queryFn:async()=>{
      const res=await client.rooms.ttl.get({
        query:{roomId}
      })  
      return res.data
    }
  })


  useEffect(()=>{
      if(ttlData?.ttl!==undefined){
        setTimeRemaining(ttlData.ttl);
      }
  },[ttlData])


  useEffect(()=>{
    if(timeRemaining===null || timeRemaining<0){
      return 
    }
    if(timeRemaining===0){
      router.push('/?destroyed=true')
    }

    const interval=setInterval(()=>{
      setTimeRemaining((prev)=>{
        if(prev===null || prev <=1){
          clearInterval(interval);
          return 0;
        }
        return prev-1;
      })
    },1000)
    return ()=>clearInterval(interval);
  },[timeRemaining,router])


  const {mutate:sendMessage,isPending}=useMutation({
    mutationFn:async({text}:{text:string})=>{
      await client.messages.post({ sender: username, text}, {query: { roomId }})
      setInput("");
    }
  })


  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch();
      }

      if (event === "chat.destroy") {
        router.push("/?destroyed=true")
      }
    },
  })


  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.rooms.delete(null, { query: { roomId } })
    },
  })

  

  const handleCopy = () => {
    const url = window.location.href;  // to copy url
    navigator.clipboard.writeText(url);
    setCopyStatus("COPIED!!")
    setTimeout(() => setCopyStatus("COPY"), 2000);
  }



  return (
    <main className="flex flex-col overflow-hidden h-screen max-h-screen transition-all">
      <header className="border-b border-zinc-800 px-8 py-4 flex items-center justify-between bg-zinc-900/30">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-zinc-500 uppercase">
              Room ID
            </span>

            <div className="flex items-center gap-2">
              <span className="font-bold text-green-500">{roomId}</span>
              <button onClick={handleCopy} className="text-[10px] bg-zinc-800 rounded hover:bg-zinc-700 px-2 py-0.5 text-zinc-400 transition-all">
                {copyStatus}
              </button>
            </div>
          </div>

          <div className="h-10 w-px bg-zinc-800" />

          <div className="flex flex-col">
            <span className="text-sm text-zinc-500 uppercase">
              self-destruct
            </span>
            <span className={`text-sm font-bold flex items-center gap-2
               ${timeRemaining !== null && timeRemaining < 60 ? "text-red-500" : "text-amber-500"}`}>

              {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}

            </span>
          </div>
        </div>
        <button onClick={() => destroyRoom()} className="flex items-center text-xs bg-zinc-800 px-3 py-1.5 text-zinc-500 hover:text-white font-bold rounded transition-all disabled:opacity-50 hover:bg-red-600 uppercase">
          destroy now
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages?.messages.length===0 && (
          <div className="flex items-center justify-center h-full">
            No messages yet, start the conversation.
          </div>
        )}
        {messages?.messages.map((msg)=>(
          <div key={msg.id} className="flex flex-col items-start">
              <div className="max-w-[80%] group">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className={`text-xs font-bold ${msg.sender===username?"text-green-500":"text-blue-500"}`}>
                    {msg.sender===username?"YOU":msg.sender}
                  </span>
                  <span className="text-[10px] text-zinc-600">{format(msg.timestamp,"HH:mm")}</span>
                </div>
                <div className="flex text-sm break-all leading-relaxed text-zinc-300">
                  {msg.text}
                </div>
              </div>
          </div>
        ))} 
      </div>

      <div className="p-6  border-t border-zinc-800 bg-zinc-900/30">
              <div className="flex gap-4">
                <div className="flex-1 relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">{">"}</span>
                  <input autoFocus 
                  onKeyDown={(e)=>{
                    if(e.key==="Enter" && input.trim()){
                      sendMessage({text:input})
                      inputRef.current?.focus()
                    }
                  }} 


        
                  placeholder="Type message..."
                  value={input} onChange={(e)=>setInput(e.target.value)} type="text" className="w-full bg-black border border-zinc-800 text-sm rounded focus:outline-none focus:border-zinc-700 text-zinc-100 transition-colors pl-8 pr-4 py-4" />
                </div>

                <button onClick={()=>{
                  sendMessage({text:input})
                  inputRef.current?.focus();
                  }}
                  disabled={!input.trim()||isPending}
                  className="uppercase bg-zinc-800 text-sm font-bold hover:text-green-500 text-zinc-400 transition-all hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-6 rounded">send</button>
              </div>
      </div>
      


    </main>
  )
}

export default room