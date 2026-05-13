import SummaryCard from "../SummaryCard";
import { Card } from "@/components/ui/card";
import { CreditCard, HandCoins, Landmark, TrendingUp } from "lucide-react";

function money(value) {
  return `PHP ${Number(value || 0).toFixed(2)}`;
}

function ShopOwnerSummary({ summary }) {
  const cards = [
    { label: "Total Sales", value: money(summary?.total_sales), icon: <TrendingUp size={22} /> },
    { label: "Total Commission", value: money(summary?.total_commission), icon: <HandCoins size={22} /> },
    { label: "Payments", value: money(summary?.total_advance), icon: <CreditCard size={22} /> },
    { label: "Remaining Balance", value: money(summary?.remaining_balance), icon: <Landmark size={22} /> },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-4 rounded-xl border bg-background shadow-sm hover:shadow-md transition">
            <SummaryCard label={card.label} value={card.value} icon={card.icon} />
          </Card>
        ))}
      </div>
    </section>
  );
}

export default ShopOwnerSummary;
