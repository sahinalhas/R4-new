import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import ErrorBoundary from "./components/ErrorBoundary";
import { setupGlobalErrorHandlers } from "./lib/error-handler";
import Layout from "./layout/Rehber360Layout";
import Index from "./pages/Index";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";
import CounselingSessions from "./pages/CounselingSessions";
import Surveys from "./pages/Surveys";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import Placeholder from "./pages/Placeholder";
import PublicSurvey from "./pages/PublicSurvey";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
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
                    element={<CounselingSessions />}
                  />
                  <Route
                    path="/anketler"
                    element={<Surveys />}
                  />
                  <Route
                    path="/raporlar"
                    element={<Reports />}
                  />
                  <Route
                    path="/etkinlikler"
                    element={<Placeholder title="Etkinlik Yönetimi" />}
                  />
                  <Route path="/ayarlar" element={<SettingsPage />} />
                  <Route
                    path="/risk"
                    element={<Placeholder title="Risk ve Müdahale Takip" />}
                  />
                  <Route
                    path="/istatistik"
                    element={<Placeholder title="Performans & İstatistik" />}
                  />
                </Route>
                <Route path="/anket/:publicLink" element={<PublicSurvey />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
