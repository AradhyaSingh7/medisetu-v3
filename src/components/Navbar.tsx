import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Search, Hospital, LayoutDashboard, Package, FileText, AlertCircle } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
            <Heart className="h-6 w-6 text-white" fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">MediSetu</span>
            <span className="text-xs text-muted-foreground">Your Medical Lifeline</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find Resources
            </Link>
          </Button>

          <Button
            variant={isActive("/raise-request") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/raise-request" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Raise Request
            </Link>
          </Button>

          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>

          <Button
            variant={isActive("/hospital-admin") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/hospital-admin" className="flex items-center gap-2">
              <Hospital className="h-4 w-4" />
              Hospital Admin
            </Link>
          </Button>

          <Button
            variant={isActive("/hospital-requests") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/hospital-requests" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Requests
            </Link>
          </Button>

          <Button
            variant={isActive("/audit-logs") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/audit-logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </Link>
          </Button>
        </div>

        <Button 
          asChild
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          <Link to="/raise-request">
            <AlertCircle className="h-4 w-4 mr-2" />
            Emergency
          </Link>
        </Button>
      </div>
    </nav>
  );
};
