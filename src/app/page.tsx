"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from "@/components/LandingPage/Landingpage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable data prefetching on server
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="">
        <LandingPage />
      </main>
    </QueryClientProvider>
  );
}
