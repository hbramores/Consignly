import { Button } from "@/components/ui/button";

const tabs = [
  "Summary",
  "Sales",
  "Inventory",
  "Shops",
  "Earnings",
  "Returns",
  "Payments",
];

function ReportTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "default" : "outline"}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}

export default ReportTabs;
