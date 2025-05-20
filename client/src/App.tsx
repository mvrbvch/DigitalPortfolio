import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { initSmoothScroll } from "./lib/smoothScroll";
import PreLoader from "@/components/PreLoader";

function Router() {
  useEffect(() => {
    initSmoothScroll();
  }, []);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or loading actual resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {loading ? (
        <PreLoader />
      ) : (
        <>
          <Router />
          <Toaster />
        </>
      )}
    </QueryClientProvider>
  );
}

export default App;
