"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PriceCalculator from "@/components/PriceCalculator/PriceCalculator";

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
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-8">
        <PriceCalculator />
      </main>
    </QueryClientProvider>
  );
}
