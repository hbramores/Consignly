import { useEffect, useState } from "react";

// components
import ShopDetails from "../components/shops/ShopDetails";
import ShopActionButtons from "../components/shops/ShopActionButtons";
import AdvancePaymentForm from "../components/shops/AdvancePaymentForm";
import AssignInventoryForm from "../components/shops/AssignInventoryForm";
import CurrentShopInventoryTable from "../components/shops/CurrentShopInventoryTable";
import ShopSummaryCards from "../components/shops/ShopSummaryCards";
import ShopProductSummaryTable from "../components/shops/ShopProductSummaryTable";
import ShopSalesHistoryTable from "../components/shops/ShopSalesHistoryTable";
import ReturnedProductsTable from "../components/shops/ReturnedProductsTable";
import PaymentTransactionTables from "../components/shops/PaymentTransactionTables";
import Header from "../components/Header";

// shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function ManageShop({ selectedShop, setCurrentPage }) {
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [advanceNote, setAdvanceNote] = useState("");

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignQuantity, setAssignQuantity] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const categories = [...new Set(products.map((p) => normalizeCategory(p.category)).filter(Boolean))];

  const [shopInventory, setShopInventory] = useState([]);
  const [productSummary, setProductSummary] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [returnedProducts, setReturnedProducts] = useState([]);
  const [paymentTransactions, setPaymentTransactions] = useState([]);

  const [salesLimit] = useState(10);
  const [returnsLimit] = useState(10);
  const [paymentsLimit] = useState(10);

  const [activeSection, setActiveSection] = useState("");

  const [summary, setSummary] = useState({
    total_sales: 0,
    total_commission: 0,
    total_sold_items: 0,
    total_advance: 0,
    pending_returns: 0,
    remaining_balance: 0,
  });

  const outstandingBalance = Number(summary.remaining_balance || 0);

  const sectionButtons = [
    { key: "payments", label: "Payment Transactions" },
    { key: "summary", label: "Summary Table" },
    { key: "sales", label: "Sales History" },
    { key: "returns", label: "Returned Products" },
  ];

  // ---------------- FETCH ----------------

  async function fetchProducts() {
    const res = await fetch(
      `http://localhost:5000/products/${selectedShop.user_id}`
    );

    setProducts(await res.json());
  }

  async function fetchShopInventory() {
    const res = await fetch(
      `http://localhost:5000/shops/inventory/${selectedShop.id}`
    );

    setShopInventory(await res.json());
  }

  async function fetchSummary() {
    const res = await fetch(
      `http://localhost:5000/shops/${selectedShop.id}/dashboard-summary`
    );

    const data = await res.json();

    setSummary({
      total_sales: data.total_sales || 0,
      total_commission: data.total_commission || 0,
      total_sold_items: data.total_sold_items || 0,
      total_advance: data.total_advance || 0,
      pending_returns: data.pending_returns || 0,
      remaining_balance: data.remaining_balance || 0,
    });
  }

  async function fetchSalesHistory() {
    const res = await fetch(
      `http://localhost:5000/shops/${selectedShop.id}/sales-history?limit=${salesLimit}`
    );

    setSalesHistory(await res.json());
  }

  async function fetchReturnedProducts() {
    const res = await fetch(
      `http://localhost:5000/shops/${selectedShop.id}/returned-products?limit=${returnsLimit}`
    );

    setReturnedProducts(await res.json());
  }

  async function fetchPaymentTransactions() {
    const res = await fetch(
      `http://localhost:5000/shops/${selectedShop.id}/advance-payments?limit=${paymentsLimit}`
    );

    setPaymentTransactions(await res.json());
  }

  async function fetchShopProductSummary(shopId) {
    const res = await fetch(
      `http://localhost:5000/shops/${shopId}/product-summary`
    );

    setProductSummary(await res.json());
  }

  // ---------------- EFFECT ----------------

  useEffect(() => {
    if (!selectedShop) return;

    fetchProducts();
    fetchShopInventory();
    fetchSummary();
    fetchShopProductSummary(selectedShop.id);
    fetchSalesHistory();
    fetchPaymentTransactions();
    fetchReturnedProducts();

    const interval = setInterval(() => {
      fetchShopInventory();
      fetchSummary();
      fetchShopProductSummary(selectedShop.id);
      fetchSalesHistory();
      fetchPaymentTransactions();
      fetchReturnedProducts();
    }, 3000);

    return () => clearInterval(interval);
  }, [salesLimit, returnsLimit, paymentsLimit]);

  if (!selectedShop) return null;

  // ---------------- ACTIONS ----------------

  const handleRecordAdvance = async () => {
    const res = await fetch("http://localhost:5000/shops/advance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        shop_id: selectedShop.id,
        amount: advanceAmount,
        note: advanceNote,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setShowAdvanceForm(false);
      setAdvanceAmount("");
      setAdvanceNote("");

      fetchSummary();
      fetchPaymentTransactions();
    }
  };

  const handleAssignInventory = async () => {
    const res = await fetch("http://localhost:5000/shops/assign-inventory", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        shop_id: selectedShop.id,
        product_ids: selectedProducts,
        quantity: assignQuantity,
        user_id: selectedShop.user_id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setShowAssignForm(false);

      setSelectedCategory("");
      setSelectedProducts([]);
      setAssignQuantity("");

      fetchProducts();
      fetchShopInventory();
      fetchSummary();
    }
  };

  const handleConfirmReturn = async (returnId) => {
    const res = await fetch(`http://localhost:5000/shops/returns/${returnId}/confirm`, {
      method: "PATCH",
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to confirm return");
      return;
    }

    fetchReturnedProducts();
    fetchShopInventory();
    fetchSummary();
  };

  const handleRejectReturn = async (returnId) => {
    const res = await fetch(`http://localhost:5000/shops/returns/${returnId}/reject`, {
      method: "PATCH",
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to reject return");
      return;
    }

    fetchReturnedProducts();
    fetchShopInventory();
    fetchSummary();
  };

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen">
      <main className="p-4 md:p-6 space-y-6">

        <div className="flex justify-between">
          <div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage("shops")}
            >
              Back to Shops
            </Button>
          </div>

          <div>
            <ShopActionButtons
              setShowAdvanceForm={setShowAdvanceForm}
              setShowAssignForm={setShowAssignForm}
            />
          </div>
        </div>

        <Header
          title="Manage Shop"
          description="Manage inventory, sales, and payments"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ShopDetails selectedShop={selectedShop} />

          <Card>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm text-muted-foreground">Outstanding Balance</p>
              <p className="text-2xl font-bold">
                PHP {outstandingBalance.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                This is the outstanding balance {selectedShop.shop_name} owes you after sales,
                commission, and payments.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ADVANCE MODAL */}

        <Dialog
          open={showAdvanceForm}
          onOpenChange={setShowAdvanceForm}
        >
          <DialogContent className="sm:max-w-md">

            <AdvancePaymentForm
              advanceAmount={advanceAmount}
              setAdvanceAmount={setAdvanceAmount}
              advanceNote={advanceNote}
              setAdvanceNote={setAdvanceNote}
              handleRecordAdvance={handleRecordAdvance}
              setShowAdvanceForm={setShowAdvanceForm}
            />
          </DialogContent>
        </Dialog>

        {/* ASSIGN MODAL */}

        <Dialog
          open={showAssignForm}
          onOpenChange={setShowAssignForm}
        >
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">

            <AssignInventoryForm
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              products={products}
              setSelectedProducts={setSelectedProducts}
              assignQuantity={assignQuantity}
              setAssignQuantity={setAssignQuantity}
              handleAssignInventory={handleAssignInventory}
              setShowAssignForm={setShowAssignForm}
            />
          </DialogContent>
        </Dialog>

        {/* SUMMARY */}

        <ShopSummaryCards summary={summary} />

        {/* INVENTORY */}

        <CurrentShopInventoryTable
          shopInventory={shopInventory}
        />

        {/* SECTION BUTTONS */}

        <div className="flex gap-2 flex-wrap">
          {sectionButtons.map((s) => (
            <Button
              key={s.key}
              variant={
                activeSection === s.key
                  ? "default"
                  : "outline"
              }
              className={
                s.key === "returns" && Number(summary.pending_returns || 0) > 0
                  ? "border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  : ""
              }
              onClick={() => setActiveSection(s.key)}
            >
              {s.label}
              {s.key === "returns" && Number(summary.pending_returns || 0) > 0
                ? ` (${summary.pending_returns} pending)`
                : ""}
            </Button>
          ))}
        </div>

        {/* SECTIONS */}

        {activeSection === "payments" && (
          <PaymentTransactionTables
            summary={summary}
            outstandingBalance={outstandingBalance}
            paymentTransactions={paymentTransactions}
          />
        )}

        {activeSection === "summary" && (
          <ShopProductSummaryTable
            productSummary={productSummary}
          />
        )}

        {activeSection === "sales" && (
          <ShopSalesHistoryTable
            salesHistory={salesHistory}
          />
        )}

        {activeSection === "returns" && (
          <ReturnedProductsTable
            returnedProducts={returnedProducts}
            handleConfirmReturn={handleConfirmReturn}
            handleRejectReturn={handleRejectReturn}
          />
        )}

      </main>
    </div>
  );
}

export default ManageShop;
