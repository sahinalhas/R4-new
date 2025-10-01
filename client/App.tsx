import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./layout/Rehber360Layout";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";
import Placeholder from "./pages/Placeholder";
import SettingsPage from "./pages/Settings";
import Reports from "./pages/Reports";
import Surveys from "./pages/Surveys";
import PublicSurvey from "./pages/PublicSurvey";
import { AuthProvider } from "./lib/auth-context";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
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
                element={<Placeholder title="Görüşme & Randevu" />}
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
            {/* Public Routes (outside of auth layout) */}
            <Route path="/anket/:publicLink" element={<PublicSurvey />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
