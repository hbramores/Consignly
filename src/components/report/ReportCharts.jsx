import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import ReportSection from "./ReportSection";

const pieColors = [
  "#2f80ed",
  "#27ae60",
  "#f2994a",
  "#eb5757",
  "#9b51e0",
  "#00a6a6",
];

function ReportCharts({ report }) {
  const topCategories = (report.topCategories || []).map((item) => ({
    ...item,
    value: Number(item.value || 0),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <ReportSection title="Top Selling Categories">
        {topCategories.length === 0 ? (
          <ChartEmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={topCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                label
              >
                {topCategories.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ReportSection>

    </div>
  );
}

function ChartEmptyState() {
  return (
    <div className="text-center text-muted-foreground py-10">
      No chart data found
    </div>
  );
}

export default ReportCharts;