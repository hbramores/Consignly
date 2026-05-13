import {
  Boxes,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Store,
  User,
  Menu,
} from "lucide-react";

import "./Sidebar.css";

import { Button } from "@/components/ui/button";
import consignlyLogo from "../assets/consignly_logo.png";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const items = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "stocks", label: "Stocks", icon: Boxes },
  { key: "shops", label: "Shops", icon: Store },
  { key: "reports", label: "Reports", icon: FileText },
];

function SidebarContent({ setCurrentPage, onLogout, currentPage, user }) {
  return (
    <>
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
             <img
              src={consignlyLogo}
              alt="Consignly Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-primary">Consignly</h2>
        </div>
        

        <nav className="space-y-2 mt-4">
          <p className="text-sm font-medium text-muted-foreground">Menu</p>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.key}
                variant={currentPage === item.key ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setCurrentPage(item.key)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-profile mt-auto">
        <div className="profile-top">
          <div className="profile-icon">
            <User size={18} />
          </div>

          <div className="profile-info">
            <p className="profile-name">{user?.username}</p>
            <p className="profile-email">{user?.role}</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="logout-btn w-full justify-start bg-primary text-white"
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
      </div>
    </>
  );
}

function Sidebar({ setCurrentPage, onLogout, currentPage, user }) {
  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center p-3 border-b bg-white">
        <Sheet>

          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu size={18} />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72 flex flex-col z-[60] bg-white" >
            <SidebarContent
              setCurrentPage={setCurrentPage}
              onLogout={onLogout}
              currentPage={currentPage}
              user={user}
            />
          </SheetContent>

        </Sheet>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r p-4 bg-white">
        <SidebarContent
          setCurrentPage={setCurrentPage}
          onLogout={onLogout}
          currentPage={currentPage}
          user={user}
        />
      </aside>
    </>
  );
}

export default Sidebar;
