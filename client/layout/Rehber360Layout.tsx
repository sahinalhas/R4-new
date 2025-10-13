import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
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
  FolderKanban,
  Download,
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
      etkinlikler: "Etkinlikler",
      ayarlar: "Ayarlar",
      risk: "Risk Takip",
      "ai-asistan": "AI Asistan",
      "ai-insights": "AI Insights",
      "gelismis-analiz": "Gelişmiş Analiz",
      "gunluk-plan": "Günlük Eylem Planı",
      odevler: "Ödev Yönetimi",
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
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export default function Rehber360Layout() {
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [account, setAccount] = useState<AppSettings["account"] | undefined>(undefined);
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
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
  
  const { data: studentsData = [] } = useQuery<any[]>({
    queryKey: ['/api/students'],
    queryFn: async () => {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return studentsData;
    const query = searchQuery.toLowerCase();
    return studentsData.filter(student => 
      student.name?.toLowerCase().includes(query) ||
      student.ad?.toLowerCase().includes(query) ||
      student.soyad?.toLowerCase().includes(query) ||
      student.id?.toString().toLowerCase().includes(query) ||
      student.className?.toLowerCase().includes(query) ||
      student.sinif?.toLowerCase().includes(query)
    );
  }, [studentsData, searchQuery]);

  const navigationItems = useMemo(() => [
    { label: "Ana Sayfa", path: "/" },
    { label: "Öğrenci Yönetimi", path: "/ogrenci" },
    { label: "Görüşmeler", path: "/gorusmeler" },
    { label: "Anket & Test", path: "/anketler" },
    { label: "Raporlama", path: "/raporlar" },
    { label: "Etkinlikler", path: "/etkinlikler" },
    { label: "Risk Takip", path: "/risk" },
    { label: "AI Asistan", path: "/ai-asistan" },
    { label: "AI Insights", path: "/ai-insights" },
    { label: "Gelişmiş Analiz", path: "/gelismis-analiz" },
    { label: "Günlük Eylem Planı", path: "/gunluk-plan" },
    { label: "Ödev Yönetimi", path: "/odevler" },
    { label: "Ayarlar", path: "/ayarlar" },
  ], []);

  const filteredNavigation = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return navigationItems.filter(item => 
      item.label.toLowerCase().includes(query)
    );
  }, [navigationItems, searchQuery]);

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
                  <SidebarMenuButton asChild tooltip="Etkinlikler">
                    <NavLink to="/etkinlikler">
                      <FolderKanban /> <span>Etkinlikler</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip="AI Araçları">
                        <Sparkles />
                        <span>AI Araçları</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/risk">
                              <ShieldAlert />
                              <span>Risk Takip</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/ai-asistan">
                              <Bot />
                              <span>AI Asistan</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/ai-insights">
                              <Brain />
                              <span>AI Insights</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/gelismis-analiz">
                              <Sparkles />
                              <span>Gelişmiş Analiz</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/gunluk-plan">
                              <CalendarDays />
                              <span>Günlük Plan</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Ödev Yönetimi">
                    <NavLink to="/odevler">
                      <FileText /> <span>Ödev Yönetimi</span>
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
                <div className="absolute right-0 top-0 z-50 w-[400px] max-w-[calc(100vw-2rem)]">
                  <div className="relative">
                    <Input
                      id="header-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Öğrenci adı, numarası veya sayfa ara... (ESC)"
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
                  {searchQuery && (filteredStudents.length > 0 || filteredNavigation.length > 0) && (
                    <Card className="search-results absolute top-12 w-full max-h-[400px] overflow-hidden shadow-lg border-primary/20">
                      <ScrollArea className="h-full max-h-[400px]">
                        {filteredStudents.length > 0 && (
                          <div className="p-2">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Öğrenciler</div>
                            {filteredStudents.map((student) => (
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
                                  <div className="font-medium truncate">
                                    {student.name || `${student.ad || ''} ${student.soyad || ''}`.trim()}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>No: {student.id}</span>
                                    {(student.className || student.sinif) && (
                                      <>
                                        <span>•</span>
                                        <span>Sınıf: {student.className || student.sinif}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {filteredNavigation.length > 0 && (
                          <div className="p-2">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Sayfalar</div>
                            {filteredNavigation.map((item) => (
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
                  {searchQuery && filteredStudents.length === 0 && filteredNavigation.length === 0 && (
                    <Card className="search-results absolute top-12 w-full p-4 text-sm text-muted-foreground text-center">
                      Sonuç bulunamadı
                    </Card>
                  )}
                </div>
              )}
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
