import { useState, useEffect } from "react";

//imports
import ShopOwnerSummary from "../components/shopOwner/ShopOwnerSummary";
import ShopOwnerInventory from "../components/shopOwner/ShopOwnerInventory";
import ShopOwnerTransactionHistory from "../components/shopOwner/ShopOwnerTransactionHistory";
import RecordTransactionModal from "../components/shopOwner/RecordTransactionModal";
import ShopOwnerReturnsTable from "../components/shopOwner/ShopOwnerReturnsTable";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function ShopOwnerDashboard({ shop, onLogout }) {
  const [summary, setSummary] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleType, setSaleType] = useState("sold");
  const [saleQuantity, setSaleQuantity] = useState("");
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [modalMode, setModalMode] = useState("record_sale");
  const [shopSellingPrice, setShopSellingPrice] = useState("");
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnsLimit, setReturnsLimit] = useState(10);
  const [returnedProducts, setReturnedProducts] = useState([]);
  const [activeSection, setActiveSection] = useState("");

  async function fetchReturnedProducts() {
    const res = await fetch(
      `http://localhost:5000/shops/${shop.id}/returned-products?limit=${returnsLimit}`
    );

    const data = await res.json();
    setReturnedProducts(data);
  }

  async function fetchDashboardData(showLoading = false) {
    if (showLoading) setLoading(true);

    try {
      const [summaryRes, inventoryRes, salesRes] = await Promise.all([
        fetch(`http://localhost:5000/shops/${shop.id}/dashboard-summary?t=${Date.now()}`),
        fetch(`http://localhost:5000/shops/inventory/${shop.id}?t=${Date.now()}`),
        fetch(`http://localhost:5000/shops/${shop.id}/sales-history?t=${Date.now()}`),
      ]);

      const summaryData = await summaryRes.json();
      const inventoryData = await inventoryRes.json();
      const salesData = await salesRes.json();

      setSummary(summaryData);
      setInventory(inventoryData);
      setSalesHistory(salesData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData(true);

    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [shop?.id]);

  useEffect(() => {
    fetchReturnedProducts();
  }, [shop?.id, returnsLimit]);

  const handleSavePrice = async () => {
    if (!selectedProduct || !shopSellingPrice || Number(shopSellingPrice) <= 0) {
      alert("Enter a valid selling price");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/shops/inventory/${shop.id}/${selectedProduct.product_id}/price`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_selling_price: shopSellingPrice,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Selling price saved");
      setShowSaleModal(false);
      setSelectedProduct(null);
      setShopSellingPrice("");
      fetchDashboardData();
    } else {
      alert(data.message || "Failed to save price");
    }
  };

  const handleRecordSale = async () => {
    if (!selectedProduct || !saleQuantity || Number(saleQuantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (Number(saleQuantity) > Number(selectedProduct.quantity)) {
      alert("Cannot record more than available stock");
      return;
    }

    const res = await fetch(`http://localhost:5000/shops/${shop.id}/record-sale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: selectedProduct.product_id,
        type: saleType,
        quantity: Number(saleQuantity),
        user_id: shop.user_id,
        reason: returnReason,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Transaction recorded successfully");
      setShowSaleModal(false);
      setSelectedProduct(null);
      setSaleType("sold");
      setSaleQuantity("");
      setReturnReason("");
      fetchDashboardData();
      fetchReturnedProducts();
    } else {
      alert(data.message || "Failed to record transaction");
    }
  };

  const handleReturnAll = async () => {
    if (!window.confirm("Are you sure you want to return ALL products to the artisan? This will empty the shop inventory.")) {
      return;
    }

    const res = await fetch(`http://localhost:5000/shops/${shop.id}/return-all`, {
      method: "POST",
    });

    const data = await res.json();

    if (res.ok) {
      alert("All products returned to artisan successfully");
      fetchDashboardData();
      fetchReturnedProducts();
    } else {
      alert(data.message || "Failed to return products");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <Button variant="outline" onClick={onLogout}>Logout</Button>
          <p className="mt-4 text-muted-foreground">Loading shop dashboard...</p>
        </div>
      </div>
    );
  }
  
  const closeSaleModal = () => {
    setShowSaleModal(false);
    setSelectedProduct(null);
    setSaleType("sold");
    setSaleQuantity("");
    setReturnReason("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl p-4 md:p-6 lg:px-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <Header
            title="Shop Owner Dashboard"
            description={`Welcome, ${shop.shop_name}`}
          />
          <Button variant="outline" onClick={onLogout}>Logout</Button>
        </div>

        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-sm">
            <div>
              <p className="text-muted-foreground">Access Code</p>
              <p className="font-semibold">{shop.access_code}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Contract Type</p>
              <p className="font-semibold">
                {shop.contract_type === "percentage" ? "Percentage" : "Manual Pricing"}
              </p>
            </div>
            {shop.contract_type === "percentage" && (
              <div>
                <p className="text-muted-foreground">Earnings Split</p>
                <p className="font-semibold">
                  Shop {Number(shop.commission_rate || 0)}% / Artisan {100 - Number(shop.commission_rate || 0)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      <ShopOwnerSummary summary={summary} />

      <ShopOwnerInventory
        inventory={inventory}
        handleReturnAll={handleReturnAll}
        setSelectedProduct={setSelectedProduct}
        setShowSaleModal={setShowSaleModal}
        setModalMode={setModalMode}
      />

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeSection === "transactions" ? "default" : "outline"}
          onClick={() => setActiveSection("transactions")}
        >
          Transaction History
        </Button>

        <Button
          variant={activeSection === "returns" ? "default" : "outline"}
          onClick={() => setActiveSection("returns")}
        >
          Returned Products Status
        </Button>
      </div>

      {activeSection === "transactions" && (
        <ShopOwnerTransactionHistory
          salesHistory={salesHistory}
          showAllTransactions={showAllTransactions}
          setShowAllTransactions={setShowAllTransactions}
        />
      )}

      {showSaleModal && (
        <RecordTransactionModal
          selectedProduct={selectedProduct}
          saleType={saleType}
          setSaleType={setSaleType}
          saleQuantity={saleQuantity}
          setSaleQuantity={setSaleQuantity}
          returnReason={returnReason}
          setReturnReason={setReturnReason}
          handleSavePrice={handleSavePrice}
          handleRecordSale={handleRecordSale}
          closeModal={closeSaleModal}
          modalMode={modalMode}
          shopSellingPrice={shopSellingPrice}
          setShopSellingPrice={setShopSellingPrice}
        />
      )}

      {activeSection === "returns" && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Returned Products Status</h2>
            <ShopOwnerReturnsTable returnedProducts={returnedProducts} />
            {(returnedProducts.length >= returnsLimit || returnsLimit > 10) && (
              <Button
                variant="outline"
                onClick={() =>
                  setReturnsLimit(returnsLimit === 10 ? returnsLimit + 10 : 10)
                }
              >
                {returnsLimit === 10 ? "View More" : "View Less"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      </main>
    </div>
  );
}

export default ShopOwnerDashboard;
