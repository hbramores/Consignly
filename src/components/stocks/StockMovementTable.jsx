import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function StockMovementTable({ movements }) {
  const [showAll, setShowAll] = useState(false);

  const displayedMovements = showAll
    ? movements
    : movements.slice(0, 5);

  return (
    <section className="space-y-3">
      
      <div>
        <h2 className="text-xl font-semibold">
          Recent Stock Movements
        </h2>
        <p className="text-sm text-gray-500">
          Total movements: {movements.length}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date and Time</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {displayedMovements.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                {new Date(m.created_at).toLocaleString()}
              </TableCell>

              <TableCell className="font-medium">
                {m.product_name}
              </TableCell>

              <TableCell>
                {m.type === "stock_in" ? "Stock In" : "Stock Out"}
              </TableCell>

              <TableCell
                className={
                  m.type === "stock_in"
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {m.type === "stock_in"
                  ? `+${m.quantity}`
                  : `-${m.quantity}`}
              </TableCell>

              <TableCell className="text-gray-600">
                {m.notes}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {movements.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          {showAll ? "Show Less" : "View More"}
        </button>
      )}
    </section>
  );
}

export default StockMovementTable;