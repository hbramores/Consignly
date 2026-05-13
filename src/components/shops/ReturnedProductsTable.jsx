import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

function ReturnedProductsTable({
  returnedProducts,
  handleConfirmReturn,
  handleRejectReturn,
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Returned Products</h3>

      <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {returnedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No returned products yet
                </TableCell>
              </TableRow>
            ) : (
              returnedProducts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.created_at).toLocaleString()}
                  </TableCell>

                  <TableCell className="font-medium">
                    {item.product_name}
                  </TableCell>

                  <TableCell>{item.quantity}</TableCell>

                  <TableCell className="text-muted-foreground">
                    {item.reason || "-"}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    {item.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConfirmReturn(item.id)}
                        >
                          Confirm
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectReturn(item.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ReturnedProductsTable;