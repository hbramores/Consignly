import SummaryCard from "../SummaryCard";
import { Card } from "@/components/ui/card";
import { HandCoins, PackageCheck, Store, TrendingUp } from "lucide-react";
import { currency, number } from "./reportFormatters";

function SummaryCards({ summary = {} }) {
  const cards = [
    { title: "Total Sales", value: currency(summary.totalSales || 0), icon: <TrendingUp size={22} /> },
    { title: "Total Artisan Earnings", value: currency(summary.totalArtisanEarnings || 0), icon: <HandCoins size={22} /> },
    { title: "Total Shop Earnings", value: currency(summary.totalShopEarnings || 0), icon: <Store size={22} /> },
    { title: "Products Sold", value: number(summary.productsSold || 0), icon: <PackageCheck size={22} /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="p-4 rounded-xl border bg-background shadow-sm hover:shadow-md transition">
          <SummaryCard label={card.title} value={card.value} icon={card.icon} />
        </Card>
      ))}
    </div>
  );
}

export default SummaryCards;
