import { useEffect, useState } from "react";
import Header from "../components/Header"
import SummaryCard from "../components/SummaryCard"
import QuickActionCard from "../components/QuickActionCard"
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, CirclePlus, Package, Store, TrendingUp } from "lucide-react";
import artisanHero from "../assets/artisan_hero.png";

function getStockAlert(count) {
  if (Number(count || 0) === 0) {
    return {
      className: "border-green-200 bg-green-50 text-green-700",
      message: "All in stock",
    };
  }

  if (Number(count || 0) <= 3) {
    return {
      className: "border-orange-200 bg-orange-50 text-orange-700",
      message: `${count} products need attention`,
    };
  }

  return {
    className: "border-red-200 bg-red-50 text-red-700",
    message: `${count} products have low stock levels`,
  };
}

function Dashboard({user, setCurrentPage, setPageAction}) {

  const [summary, setSummary] = useState({
    products: 0,
    stocks: 0,
    shops: 0,
    sales: 0,
    lowStock: 0,
  });
  const stockAlert = getStockAlert(summary.lowStock);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSummary = async () => {
      try {
        const res = await fetch(`http://localhost:5000/dashboard/summary/${user.id}`);
        const data = await res.json();

        console.log("Dashboard summary:", data);
        setSummary(data);
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
      }
    };

    fetchSummary();
  }, [user]);

  return (
    <div className="min-h-screen">
      <main className="p-4 md:p-6 space-y-6">

        {/* HEADER */}
        <div className="mb-4 md:mb-6">
          <Header 
            title="Dashboard"
            description="Welcome to your consignment management system."
          />
        </div>

        {/* HERO CARD */}
        <Card className="bg-primary text-white relative overflow-visible mt-2 lg:mt-4">
          <CardContent className="p-6 relative overflow-visible">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10 p-10">

              {/* LEFT */}
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">
                  Hi {user?.username}!
                </h1>

                <p className="text-sm text-white/80 mt-1">
                  Let's check how your products are doing today.
                </p>
              </div>

            </div>

            {/* IMAGE (NOT CUT, PROPER OVERLAP) */}
            <div className="hidden lg:block absolute right-6 -bottom-3 pointer-events-none">
              <img 
                src={artisanHero} 
                alt="Artisan illustration" 
                className="w-52 h-52 md:w-64 md:h-64 object-contain drop-shadow-xl"
              />
            </div>

          </CardContent>
        </Card>

        {/* SUMMARY */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <Card className="p-4 rounded-xl border bg-background shadow-sm hover:shadow-md transition">
              <SummaryCard 
                label="Total Sales"
                value={`PHP ${Number(summary.total_sales || 0).toFixed(2)}`}
                icon={<TrendingUp size={22} />}
              />
            </Card>

            <Card className="p-4 rounded-xl border bg-background shadow-sm hover:shadow-md transition">
              <SummaryCard label="Products" value={summary.products} icon={<Package size={22} />} />
            </Card>

            <Card className="p-4 rounded-xl border bg-background shadow-sm hover:shadow-md transition">
              <SummaryCard label="Stocks" value={summary.stocks} icon={<BarChart3 size={22} />} />
            </Card>

            <Card className="p-4 rounded-xl border bg-background shadow-sm hover:shadow-md transition">
              <SummaryCard label="Shops" value={summary.shops} icon={<Store size={22} />} />
            </Card>

          </div>
        </section>

        {/* STOCK ALERT */}
        <Card className={`p-4 mt-5 rounded-xl shadow-sm hover:shadow-md transition ${stockAlert.className}`}>
          <section className="space-y-2">
          <h2 className="text-lg font-semibold">Stock Alert</h2>

          <p className="text-lg font-semibold">
            {stockAlert.message}
          </p>

          <a
            href="#"
            className="text-sm font-medium hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("stocks");
            }}
          >
            View Stock Management
          </a>
        </section>
        </Card>
        

        {/* QUICK ACTIONS */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Quick Action</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <QuickActionCard 
              icon={<CirclePlus size={22} />}
              label="Add Product"
              description="Create a new product entry"
              onClick={() => {
                setCurrentPage("products");
                setPageAction("addProduct");
              }}
            />

            <QuickActionCard 
              icon={<Store size={22} />}
              label="Add Shop"
              description="Register a new consignment shop"
              onClick={() => {
                setCurrentPage("shops");
                setPageAction("addShop");
              }}
            />

            <QuickActionCard 
              icon={<Package size={22} />}
              label="Manage Stock"
              description="Update inventory levels"
              onClick={() => {
                setCurrentPage("stocks");
                setPageAction("addStock");
              }}
            />

          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard
