import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import ErrorBoundary from "./components/ErrorBoundary";
import { setupGlobalErrorHandlers } from "./lib/error-handler";
import { Loader2 } from "lucide-react";
import Layout from "./layout/Rehber360Layout";
import Index from "./pages/Index";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";

const CounselingSessions = lazy(() => import("./pages/CounselingSessions"));
const Surveys = lazy(() => import("./pages/Surveys"));
const Reports = lazy(() => import("./pages/Reports"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Placeholder = lazy(() => import("./pages/Placeholder"));
const PublicSurvey = lazy(() => import("./pages/PublicSurvey"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RiskDashboard = lazy(() => import("./pages/RiskDashboard"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const AIInsightsDashboard = lazy(() => import("./pages/AIInsightsDashboard"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    const cleanup = setupGlobalErrorHandlers();
    return cleanup;
  }, []);

  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/ogrenci" element={<Students />} />
                  <Route path="/ogrenci/:id" element={<StudentProfile />} />
                  <Route
                    path="/gorusmeler"
                    element={<Suspense fallback={<LoadingFallback />}><CounselingSessions /></Suspense>}
                  />
                  <Route
                    path="/anketler"
                    element={<Suspense fallback={<LoadingFallback />}><Surveys /></Suspense>}
                  />
                  <Route
                    path="/raporlar"
                    element={<Suspense fallback={<LoadingFallback />}><Reports /></Suspense>}
                  />
                  <Route
                    path="/etkinlikler"
                    element={<Suspense fallback={<LoadingFallback />}><Placeholder title="Etkinlik Yönetimi" /></Suspense>}
                  />
                  <Route path="/ayarlar" element={<Suspense fallback={<LoadingFallback />}><SettingsPage /></Suspense>} />
                  <Route
                    path="/risk"
                    element={<Suspense fallback={<LoadingFallback />}><RiskDashboard /></Suspense>}
                  />
                  <Route
                    path="/istatistik"
                    element={<Suspense fallback={<LoadingFallback />}><Placeholder title="Performans & İstatistik" /></Suspense>}
                  />
                  <Route
                    path="/ai-asistan"
                    element={<Suspense fallback={<LoadingFallback />}><AIAssistant /></Suspense>}
                  />
                  <Route
                    path="/ai-insights"
                    element={<Suspense fallback={<LoadingFallback />}><AIInsightsDashboard /></Suspense>}
                  />
                </Route>
                <Route path="/anket/:publicLink" element={<Suspense fallback={<LoadingFallback />}><PublicSurvey /></Suspense>} />
                <Route path="*" element={<Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
