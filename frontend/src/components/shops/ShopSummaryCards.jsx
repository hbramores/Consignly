import { Card, CardContent } from "@/components/ui/card";

function ShopSummaryCards({ summary }) {
  return (
    <div className="space-y-4">

      <h3 className="text-lg font-semibold">Summary</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

        <Card className="rounded-xl border bg-background shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-xl font-bold">
              PHP {Number(summary.total_sales || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-background shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Sold Items</p>
            <p className="text-xl font-bold">
              {summary.total_sold_items || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-background shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Commission</p>
            <p className="text-xl font-bold">
              PHP {Number(summary.total_commission || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-background shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Payments</p>
            <p className="text-xl font-bold">
              PHP {Number(summary.total_advance || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-background shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Returns</p>
            <p className="text-xl font-bold">
              {summary.pending_returns || 0}
            </p>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}

export default ShopSummaryCards;
