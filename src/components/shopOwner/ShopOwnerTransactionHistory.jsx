import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function money(value) {
  return `PHP ${Number(value || 0).toFixed(2)}`;
}

function ShopOwnerTransactionHistory({
  salesHistory,
  showAllTransactions,
  setShowAllTransactions,
}) {
  const rows = showAllTransactions ? salesHistory : salesHistory.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Artisan Earnings</TableHead>
              <TableHead>Shop Earnings</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {salesHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No transaction history
                </TableCell>
              </TableRow>
            ) : (
              rows.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{new Date(sale.created_at).toLocaleString()}</TableCell>
                  <TableCell>{sale.product_name}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{money(sale.selling_price)}</TableCell>
                  <TableCell>
                    {money(Number(sale.artisan_earnings || 0) * Number(sale.quantity || 0))}
                  </TableCell>
                  <TableCell>
                    {money(Number(sale.commission_amount || 0) * Number(sale.quantity || 0))}
                  </TableCell>
                  <TableCell>{money(sale.total_amount)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {salesHistory.length > 5 && (
          <Button
            variant="outline"
            onClick={() => setShowAllTransactions(!showAllTransactions)}
          >
            {showAllTransactions ? "View Less" : "View More"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default ShopOwnerTransactionHistory;
