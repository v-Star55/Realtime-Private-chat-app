'use client'
import { Suspense, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { client } from "@/lib/client";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";  
import { useRouter, useSearchParams } from "next/navigation";
import { useUsername } from "@/hooks/use-username";



export const Lobby=()=> {
  const [isLoading, setIsLoading] = useState(false);
  const {username}=useUsername();
  const router = useRouter();
  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true"
  const error = searchParams.get("error")

  useEffect(() => {
    if (wasDestroyed || error) {
      const timeout = setTimeout(() => {
        router.replace('/');
      }, 9000); // Clear message after 9 seconds

      return () => clearTimeout(timeout);
    }
  }, [wasDestroyed, error, router]);

  


  const {mutate: createRoom}=useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const response = await client.rooms.create.post();

      if(response.status === 200  ) {
        setIsLoading(false);
        console.log(response.data);
        
        toast('Room Created !!',
          {
            icon: '🤫',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        );
      
        router.push(`/room/${response.data?.roomId}`)
      } else {
        toast.error("Failed to create room");
        setIsLoading(false);
        return null;
      }
    }
  })


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full space-y-4 max-w-md">

      {wasDestroyed && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM DESTROYED</p>
            <p className="text-zinc-500 text-xs mt-1">
              All messages were permanently deleted.
            </p>
          </div>
        )}

        {error === "room-not-found" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM NOT FOUND</p>
            <p className="text-zinc-500 text-xs mt-1">
              This room may have expired or never existed.
            </p>
          </div>
        )}

        {error === "room-full" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM FULL</p>
            <p className="text-zinc-500 text-xs mt-1">
              This room is at maximum capacity.
            </p>
          </div>
        )}
        
        
        <div className="text-center space-y-2">

          <h1 className="text-2xl font-bold tracking-tight text-green-500">{">"}private_chat</h1>
          <p className="text-zinc-500 text-sm">
            A secure self-destructing room to chat with your friends privately.
          </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-zinc-500 gap-3">
                Your Identity
              </label>
              <div className="flex items-center gap-3" >
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                  {username}
                </div>

              </div>
            </div>
          </div>

          <button onClick={()=>createRoom()} className="w-full text-sm font-bold p-3 hover:bg-zinc-50 mt-3 text-black bg-zinc-100 hover:text-black transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                Creating Room <ClipLoader color="black" size={16} />
              </>
            ) : (
              "CREATE SECURE ROOM"
            )}

          </button>

        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  );
}