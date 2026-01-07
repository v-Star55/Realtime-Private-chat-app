'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RealtimeProvider } from "@upstash/realtime/client";
import { useState } from "react"

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient()); // this is a hook to create a new query client

    return (
        <RealtimeProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </RealtimeProvider>
    )
}