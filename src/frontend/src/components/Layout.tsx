import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { UserRole } from "../backend";
import { useProfile } from "../context/ProfileContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Layout({ children }: { children: React.ReactNode }) {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clear();
    navigate({ to: "/" });
  };

  const isClient = profile?.role === UserRole.client;
  const isFreelancer = profile?.role === UserRole.freelancer;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.link"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Freelance<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/freelancers" data-ocid="nav.link">
              <Button variant="ghost" size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                Freelancers
              </Button>
            </Link>
            {isClient && (
              <Link to="/client/dashboard" data-ocid="nav.link">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            {isFreelancer && (
              <Link to="/freelancer/dashboard" data-ocid="nav.link">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Briefcase className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {identity ? (
              <div className="hidden md:flex items-center gap-3">
                {profile && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {profile.role}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                  {profile?.name ?? "..."}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  data-ocid="nav.button"
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                data-ocid="nav.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {isLoggingIn ? "Connecting..." : "Sign In"}
              </Button>
            )}
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/95 px-4 py-3 flex flex-col gap-2">
            <Link
              to="/freelancers"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <Users className="w-4 h-4" /> Freelancers
              </Button>
            </Link>
            {isClient && (
              <Link
                to="/client/dashboard"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Button>
              </Link>
            )}
            {isFreelancer && (
              <Link
                to="/freelancer/dashboard"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Briefcase className="w-4 h-4" /> Dashboard
                </Button>
              </Link>
            )}
            {identity && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                data-ocid="nav.button"
                className="w-full justify-start gap-2 text-muted-foreground"
              >
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="font-display font-semibold text-foreground/80">
              FreelanceHub
            </span>
            <span className="ml-1">— Connect. Build. Grow.</span>
          </div>
          <span>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
