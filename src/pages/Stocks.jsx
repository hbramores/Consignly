import { useEffect, useState } from "react";

import StockTable from "../components/stocks/StockTable";
import StockMovementTable from "../components/stocks/StockMovementTable.jsx";
import StockActionForm from "../components/stocks/StockActionForm";
import Header from "../components/Header"


function Stocks({ user, pageAction, setPageAction }) {
  const [stocks, setStocks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [movements, setMovements] = useState([]);

  const fetchMovements = async () => {
    const res = await fetch(
      `http://localhost:5000/stocks/movements?user_id=${user.id}`
    );
    const data = await res.json();
    setMovements(data);
  };

  const fetchStocks = async () => {
    const res = await fetch(`http://localhost:5000/stocks?user_id=${user.id}`);
    const data = await res.json();
    setStocks(data);
  };

  useEffect(() => {
    fetchStocks();
    fetchMovements();
  }, []);

  useEffect(() => {
    if (pageAction !== "addStock") return;

    setPageAction(null);
  }, [pageAction, setPageAction]);

  const getStatus = (currentStock, minimumStock) => {
    if (currentStock <= 0) return "Out of Stock";
    if (currentStock <= minimumStock) return "Low Stock";
    return "In Stock";
  };

  const handleSaveStock = async () => {
    const qty = Number(quantity);

    if (!quantity || qty === 0) {
      alert("Enter a valid quantity");
      return;
    }

    if (selectedProduct.quantity + qty < 0) {
      alert("You cannot remove more than the available stock");
      return;
    }

    const res = await fetch("http://localhost:5000/stocks/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: selectedProduct.id,
        user_id: user.id,
        quantity: qty,
        notes,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to update stock");
      return;
    }

    alert("Stock updated successfully");

    setSelectedProduct(null);
    setQuantity("");
    setNotes("");
    fetchStocks();
    fetchMovements();
  };

  return (
    <div className="min-h-screen">
      <main className="p-4 md:p-6 space-y-6">
        {/* HEADER */}
      <div className="mb-4 md:mb-6">
          <Header 
            title="Stocks"
            description="Manage your stock levels and movements"
          />
      </div>
      <div className="mt-5">
        <StockTable
          stocks={stocks}
          getStatus={getStatus}
          onUpdate={(item) => {
            setSelectedProduct(item);
            setQuantity("");
            setNotes("");
          }}
        />
      </div>
      <div className="mt-5">
       <StockMovementTable movements={movements} />
      </div>
      </main>
    
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-background rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">

            <StockActionForm
              selectedProduct={selectedProduct}
              quantity={quantity}
              notes={notes}
              setQuantity={setQuantity}
              setNotes={setNotes}
              onSave={handleSaveStock}
              onCancel={() => {
                setSelectedProduct(null);
                setQuantity("");
                setNotes("");
              }}
            />

          </div>

        </div>
      )}
      
    </div>
  );
}

export default Stocks;
