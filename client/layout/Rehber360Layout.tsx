import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sun,
  Moon,
  Users2,
  CalendarDays,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  ShieldAlert,
  Search,
  Bot,
  Brain,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { loadSettings, updateSettings, SETTINGS_KEY, AppSettings } from "@/lib/app-settings";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import AIStatusIndicator from "@/components/AIStatusIndicator";

function Brand() {
  const { state } = useSidebar();
  
  return (
    <Link
      to="/"
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-sidebar-accent"
    >
      <div className="size-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-extrabold">
        R
      </div>
      {state === "expanded" && (
        <div className="leading-tight">
          <div className="text-sm font-bold">Rehber360</div>
          <div className="text-[10px] text-muted-foreground">
            Dijital Rehberlik Sistemi
          </div>
        </div>
      )}
    </Link>
  );
}

function useBreadcrumbs() {
  const location = useLocation();
  const crumbs = useMemo(() => {
    const map: Record<string, string> = {
      "": "Ana Sayfa",
      ogrenci: "Öğrenci Yönetimi",
      gorusmeler: "Görüşmeler",
      anketler: "Anket & Test",
      raporlar: "Raporlama",
      ayarlar: "Ayarlar",
      "ai-araclari": "AI Araçları",
      risk: "Risk Takip",
      "ai-asistan": "AI Asistan",
      "ai-insights": "Günlük AI Raporları",
      "gelismis-analiz": "Derinlemesine Analiz",
      "gunluk-plan": "Günlük Plan",
    };
    const parts = location.pathname.split("/").filter(Boolean);
    return parts.map((p, i) => ({
      key: p,
      label: map[p] || p,
      to: "/" + parts.slice(0, i + 1).join("/"),
    }));
  }, [location.pathname]);
  return crumbs;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default function Rehber360Layout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [dark, setDark] = useState(false);
  const [account, setAccount] = useState<AppSettings["account"] | undefined>(undefined);
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const initials = useMemo(() => {
    const n = account?.displayName || "";
    const parts = n.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "K";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [account]);
  
  useEffect(() => {
    loadSettings().then(settings => {
      setDark(settings.theme === "dark");
      setAccount(settings.account);
    });
  }, []);
  
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) {
        try {
          loadSettings().then(next => {
            setDark(next.theme === "dark");
            setAccount(next.account);
          });
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!isDesktop && open !== false) {
      setOpen(false);
    }
  }, [location.pathname, isDesktop, open]);

  const crumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Evrensel arama için API çağrısı
  const { data: searchResults, refetch: refetchSearch } = useQuery<{
    students: any[];
    counselingSessions: any[];
    surveys: any[];
    pages: any[];
  }>({
    queryKey: ['/api/search/global', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        return { students: [], counselingSessions: [], surveys: [], pages: [] };
      }
      const response = await fetch(`/api/search/global?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to fetch search results');
      return response.json();
    },
    enabled: searchQuery.length >= 2,
  });


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
        if (!searchOpen) {
          setTimeout(() => {
            document.getElementById('header-search-input')?.focus();
          }, 100);
        }
      }
      if (e.key === "Escape" && searchOpen) {
        e.preventDefault();
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} defaultOpen={isDesktop}>
      <Sidebar className="border-r" collapsible="icon">
        <SidebarHeader>
          <Brand />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Modüller</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Ana Sayfa">
                    <NavLink to="/" end>
                      <BarChart3 /> <span>Ana Sayfa</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Öğrenci Yönetimi">
                    <NavLink to="/ogrenci">
                      <Users2 /> <span>Öğrenci Yönetimi</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Görüşmeler">
                    <NavLink to="/gorusmeler">
                      <CalendarDays /> <span>Görüşmeler</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Anket & Test">
                    <NavLink to="/anketler">
                      <MessageSquare /> <span>Anket & Test</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Raporlama">
                    <NavLink to="/raporlar">
                      <FileText /> <span>Raporlama</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="AI Araçları">
                    <NavLink to="/ai-araclari">
                      <Sparkles /> <span>AI Araçları</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Ayarlar">
                    <NavLink to="/ayarlar">
                      <Settings /> <span>Ayarlar</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 border-b bg-gradient-to-b from-background/70 to-background/40 supports-[backdrop-filter]:backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-4 md:px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Ana Sayfa</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {crumbs.map((c, i) => (
                  <Fragment key={c.key}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {i === crumbs.length - 1 ? (
                        <BreadcrumbPage>{c.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={c.to}>{c.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2 relative">
              {!searchOpen ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchOpen(true);
                    setTimeout(() => {
                      document.getElementById('header-search-input')?.focus();
                    }, 100);
                  }}
                  aria-label="Ara"
                  title="Ara (⌘K / Ctrl+K)"
                >
                  <Search className="h-5 w-5" />
                </Button>
              ) : (
                <div className="absolute right-0 top-0 z-50 w-full sm:w-[400px] max-w-[calc(100vw-2rem)]">
                  <div className="relative">
                    <Input
                      id="header-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Öğrenci, görüşme, anket veya sayfa ara... (ESC)"
                      className="pr-8"
                      onBlur={() => {
                        setTimeout(() => {
                          if (!document.activeElement?.closest('.search-results')) {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }
                        }, 200);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  {searchQuery && searchQuery.length >= 2 && searchResults && (
                    searchResults.students.length > 0 || 
                    searchResults.counselingSessions.length > 0 || 
                    searchResults.surveys.length > 0 || 
                    searchResults.pages.length > 0
                  ) && (
                    <Card className="search-results absolute top-12 w-full max-h-[400px] overflow-hidden shadow-lg border-primary/20">
                      <ScrollArea className="h-full max-h-[400px]">
                        {searchResults.students.length > 0 && (
                          <div className="p-2">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Öğrenciler</div>
                            {searchResults.students.map((student) => (
                              <button
                                key={student.id}
                                onClick={() => {
                                  navigate(`/ogrenci/${student.id}`);
                                  setSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent text-left transition-colors"
                              >
                                <Users2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                  <div className="font-medium truncate">{student.name}</div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>No: {student.id}</span>
                                    {student.className && (
                                      <>
                                        <span>•</span>
                                        <span>Sınıf: {student.className}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.counselingSessions.length > 0 && (
                          <div className="p-2">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Görüşmeler</div>
                            {searchResults.counselingSessions.map((session) => (
                              <button
                                key={session.id}
                                onClick={() => {
                                  navigate(`/gorusmeler`);
                                  setSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent text-left transition-colors"
                              >
                                <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                  <div className="font-medium truncate">{session.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(session.date).toLocaleDateString('tr-TR')}
                                    {session.studentNames && ` • ${session.studentNames}`}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.surveys.length > 0 && (
                          <div className="p-2">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Anketler</div>
                            {searchResults.surveys.map((survey) => (
                              <button
                                key={survey.id}
                                onClick={() => {
                                  navigate(`/anketler`);
                                  setSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent text-left transition-colors"
                              >
                                <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                  <div className="font-medium truncate">{survey.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {survey.status} • {new Date(survey.createdAt).toLocaleDateString('tr-TR')}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.pages.length > 0 && (
                          <div className="p-2">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Sayfalar</div>
                            {searchResults.pages.map((item) => (
                              <button
                                key={item.path}
                                onClick={() => {
                                  navigate(item.path);
                                  setSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent text-left transition-colors"
                              >
                                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="truncate">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </Card>
                  )}
                  {searchQuery && searchQuery.length >= 2 && searchResults && (
                    searchResults.students.length === 0 && 
                    searchResults.counselingSessions.length === 0 && 
                    searchResults.surveys.length === 0 && 
                    searchResults.pages.length === 0
                  ) && (
                    <Card className="search-results absolute top-12 w-full p-4 text-sm text-muted-foreground text-center">
                      Sonuç bulunamadı
                    </Card>
                  )}
                </div>
              )}
              <AIStatusIndicator />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDark((v) => {
                    const next = !v;
                    updateSettings({ theme: next ? "dark" : "light" });
                    return next;
                  })
                }
                aria-label="Tema Değiştir"
              >
                {dark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                    <Avatar className="size-8">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Hızlı Erişim</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/ayarlar?tab=genel#account">Profil Düzenle</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/ayarlar?tab=bildirim#notifications">
                      Bildirimler
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/ayarlar">Ayarlar</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
