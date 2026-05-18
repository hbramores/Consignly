// here full ng functions na gagamitin mo

import "./App.css"
import authBg from "./assets/auth_bg.png";


//pages imported
import Products from "./pages/Products"
import Stocks from "./pages/Stocks"
import Shops from "./pages/Shops"
import Reports from "./pages/Reports"
import AdminDashboard from "./pages/AdminDashboard";
import ShopPortal from "./pages/ShopPortal";
import ShopOwnerDashboard from "./pages/ShopOwnerDashboard";
import ManageShop from "./pages/ManageShop";

import Sidebar from "./components/Sidebar"
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard"
import { useEffect, useState } from 'react'
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/toaster";

const AUTH_BACKGROUND_IMAGE = authBg;
const SESSION_KEY = "consignly-session";
const APP_PAGES = new Set(["dashboard", "products", "stocks", "shops", "manageShop", "reports"]);

function getPageFromHash() {
  const page = window.location.hash.replace(/^#\/?/, "");
  return APP_PAGES.has(page) ? page : "dashboard";
}

function getStoredUser() {
  try {
    const storedSession = sessionStorage.getItem(SESSION_KEY);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function App() {
  const [mode, setMode] = useState("signin");
  const [user, setUser] = useState(getStoredUser);
  const [currentPage, setCurrentPage] = useState(getPageFromHash)
  const [pageAction, setPageAction] = useState(null);
  const [shop, setShop] = useState(null);
  const [view, setView] = useState("main");
  const [selectedShop, setSelectedShop] = useState(null);
  const [toast, setToast] = useState(null);

  const isLoggedIn = Boolean(user);

  useEffect(() => {
    function syncPageFromHash() {
      setCurrentPage(getPageFromHash());
    }

    window.addEventListener("popstate", syncPageFromHash);
    return () => window.removeEventListener("popstate", syncPageFromHash);
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function navigateToPage(page) {
    setCurrentPage(page);
  }

  function handleLoginSuccess(userData) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setUser(userData);
    navigateToPage("dashboard");
    window.history.pushState(null, "", "#/dashboard");
    setToast({
      title: "Login successful",
      description: `Welcome back, ${userData.username}.`,
    });
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
    setCurrentPage("dashboard");
    setPageAction(null);
    setSelectedShop(null);
    window.history.pushState(null, "", "#/login");
  }
  
  const handleShopLogin = (shopData) => {
  setShop(shopData);
  };

  const handleShopLogout = () => {
  setShop(null);
  };

  let pageToShow;

  if (user?.role === "admin") {
    pageToShow = (
      <AdminDashboard 
        user={user}
        onLogout={handleLogout}
      />
    );
  } else if (user?.role === "user") {
    if (currentPage === "dashboard") {
      pageToShow = (
        <Dashboard 
          user={user} 
          setCurrentPage={setCurrentPage}
          setPageAction={setPageAction}
        />
      );
    } else if (currentPage === "products") {
      pageToShow = (
        <Products 
          user={user}
          pageAction={pageAction} 
          setPageAction={setPageAction} 
        />
      );
    } else if (currentPage === "stocks") {
      pageToShow = (
        <Stocks 
          user={user}
          pageAction={pageAction} 
          setPageAction={setPageAction} 
        />
      );
    } else if (currentPage === "shops") {
      pageToShow = (
        <Shops 
          user={user}
          pageAction={pageAction} 
          setPageAction={setPageAction}
          onManageShop={(shopData) => {
            setSelectedShop(shopData);
            navigateToPage("manageShop");
          }}
        />
      );
    } else if (currentPage === "manageShop") {
      pageToShow = (
        <ManageShop 
          selectedShop={selectedShop}
          setCurrentPage={setCurrentPage}
        />
      );
    } else if (currentPage === "reports") {
      pageToShow = <Reports user={user} />;
    }
  }

  return (
    <div>
      <Toaster toast={toast} onClose={() => setToast(null)} />

      {shop ? (
        <ShopOwnerDashboard shop={shop} onLogout={handleShopLogout} />
      ) : isLoggedIn ? (

        <div className="flex h-screen overflow-hidden pt-14 md:pt-0">

          {/* SIDEBAR */}
          {user?.role === "user" && (
            <Sidebar
              setCurrentPage={navigateToPage}
              onLogout={handleLogout}
              currentPage={currentPage}
              user={user}
            />
          )}

          {/* MAIN CONTENT */}
          <main className="flex-1 bg-gray-50 p-4 overflow-auto">
            {pageToShow}
          </main>

        </div>

      ) : view === "shop" ? (

        <ShopPortal
          onShopLogin={handleShopLogin}
          onBack={() => setView("main")}
        />

      ) : (

        <div className="grid min-h-screen grid-cols-1 overflow-hidden bg-background lg:grid-cols-[minmax(360px,520px)_minmax(0,1fr)]">
          <section className="flex flex-col items-center justify-center gap-4 p-6 sm:p-10">
            <div className="w-full max-w-sm space-y-4">
              <Button variant="outline" onClick={() => setView("shop")} className="w-full">
                Go to Shop Owner Portal
              </Button>

              {mode === "signin" ? (
                <LoginForm
                  onLoginSuccess={handleLoginSuccess}
                  onSwitchToRegister={() => setMode("signup")}
                />
              ) : (
                <RegisterForm
                  onRegistered={() => setMode("signin")}
                  onSwitchToLogin={() => setMode("signin")}
                />
              )}
            </div>
          </section>

          <section
            className="relative hidden min-h-screen min-w-0 items-center justify-center bg-cover bg-center p-10 lg:flex"
            style={{ backgroundImage: `url(${AUTH_BACKGROUND_IMAGE})` }}
          >
            <div className="absolute inset-0 bg-background/65" />
            <div className="relative max-w-lg min-w-0 space-y-4 text-center">
              <p className="text-5xl font-medium uppercase tracking-wide text-primary xl:text-7xl [text-shadow:0_0_18px_rgba(255,255,255,0.9)]">
                Craft freely,
              </p>

              <blockquote className="text-4xl font-semibold leading-tight text-muted-foreground xl:text-5xl [text-shadow:0_0_18px_rgba(255,255,255,0.9)]">
                Track easily.
              </blockquote>
            </div>
          </section>
        </div>

      )}

    </div>
  );
}

export default App;
