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
import AuthCard from './components/AuthCard.jsx'
import Dashboard from "./pages/Dashboard"
import { useState } from 'react'
import { Button } from "./components/ui/button";

const AUTH_BACKGROUND_IMAGE = authBg;

function App() {
  const [mode, setMode] = useState("signin");
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [user, setUser] = useState(null);
  const [pageAction, setPageAction] = useState(null);
  const [shop, setShop] = useState(null);
  const [view, setView] = useState("main");
  const [selectedShop, setSelectedShop] = useState(null);
  
  const handleShopLogin = (shopData) => {
  setShop(shopData);
  };

  const handleShopLogout = () => {
  setShop(null);
  };

  let title;
  let description;
  let buttonText;
  let subDescription;
  let onSwitch;

  if (mode === "signin") {
    title = "Sign In";
    description = "Please enter your credentials.";
    buttonText = "Sign In";
    subDescription = "Create an account";
    onSwitch = () => setMode("signup");
  } else {
    title = "Sign Up";
    description = "Please fill in the form to create an account.";
    buttonText = "Sign Up";
    subDescription = "Already have an account?";
    onSwitch = () => setMode("signin");
  }

  let pageToShow;

  if (user?.role === "admin") {
    pageToShow = (
      <AdminDashboard 
        user={user}
        onLogout={() => {
          setIsLoggedIn(false);
          setUser(null);
        }}
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
            setCurrentPage("manageShop");
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

      {shop ? (
        <ShopOwnerDashboard shop={shop} onLogout={handleShopLogout} />
      ) : isLoggedIn ? (

        <div className="flex h-screen overflow-hidden pt-14 md:pt-0">

          {/* SIDEBAR */}
          {user?.role === "user" && (
            <Sidebar
              setCurrentPage={setCurrentPage}
              onLogout={() => {
                setIsLoggedIn(false);
                setUser(null);
              }}
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

              <AuthCard
                title={title}
                description={description}
                buttonText={buttonText}
                subDescription={subDescription}
                onSwitch={onSwitch}
                onLoginSuccess={(userData) => {
                  setIsLoggedIn(true);
                  setUser(userData);
                }}
              />
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
