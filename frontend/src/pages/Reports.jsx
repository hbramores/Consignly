import { useEffect, useMemo, useState } from "react";
import ReportCharts from "../components/report/ReportCharts";
import ReportFilters from "../components/report/ReportFilters";
import ReportTabs from "../components/report/ReportTabs";
import ReportTables from "../components/report/ReportTables";
import SummaryCards from "../components/report/SummaryCards";
import Header from "../components/Header"
import { Card, CardContent } from "@/components/ui/card";


const API_URL = "http://localhost:5000";

const emptyReport = {
  summary: {
    totalSales: 0,
    totalArtisanEarnings: 0,
    totalShopEarnings: 0,
    productsSold: 0,
    totalReturnsQuantity: 0,
    totalReturnsValue: 0,
    totalAdvancePayments: 0,
  },
  salesOverTime: [],
  earningsComparison: [],
  topCategories: [],
  topProducts: [],
  topShops: [],
  lowStock: [],
  returnsReport: [],
  advancePayments: [],
  inventoryMovement: [],
  profitability: [],
  shopSettlement: [],
};

function Reports({ user }) {
  const [report, setReport] = useState(emptyReport);
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("Summary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    date_range: "month",
    start_date: "",
    end_date: "",
    shop_id: "all",
    product_id: "all",
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      user_id: user?.id || "",
      date_range: filters.date_range,
      shop_id: filters.shop_id,
      product_id: filters.product_id,
    });

    if (filters.date_range === "custom") {
      params.set("start_date", filters.start_date);
      params.set("end_date", filters.end_date);
    }

    return params.toString();
  }, [filters, user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchFilters() {
      const res = await fetch(`${API_URL}/reports/filters?user_id=${user.id}`);
      const data = await res.json();
      setShops(data.shops || []);
      setProducts(data.products || []);
    }

    fetchFilters();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchReports() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_URL}/reports?${queryString}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch reports");
        }

        setReport({
          ...emptyReport,
          ...data,
          summary: {
            ...emptyReport.summary,
            ...data.summary,
          },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [queryString, user?.id]);

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="min-h-screen">
      <main className="p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="mb-4 md:mb-6">
          <Header 
            title="Reports"
            description="View and analyze your business performance"
          />
        </div>

      <Card>
        <CardContent className="p-4">
          <ReportFilters
            filters={filters}
            shops={shops}
            products={products}
            onFilterChange={handleFilterChange}
          />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {loading && (
        <div className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">
          Loading reports...
        </div>
      )}

      <SummaryCards summary={report.summary} />
      <ReportCharts report={report} />
      <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ReportTables activeTab={activeTab} report={report} />
      </main>
    </div>
  );
}

export default Reports;
