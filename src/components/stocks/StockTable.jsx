import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// status helper (kept inside file for simplicity)
function getStatus(quantity, minStock) {
  const qty = Number(quantity);
  const min = Number(minStock);

  if (qty <= 0) {
    return { label: "Out of Stock", type: "red" };
  }

  if (qty < min) {
    return { label: "Danger", type: "red" };
  }

  if (qty === min) {
    return { label: "Warning", type: "orange" };
  }

  return { label: "Good", type: "green" };
}

function StockTable({ stocks, onUpdate }) {
  return (
    <section className="space-y-3">
      
      {/* TITLE */}
      <h2 className="text-xl font-semibold">
        Current Stock Levels
      </h2>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {stocks.map((item) => {
            const status = getStatus(
              item.quantity,
              item.minimum_stock
            );

            return (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 transition"
              >
                
                {/* IMAGE */}
                <TableCell>
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.product_name}
                    className="w-10 h-10 object-cover rounded-lg border"
                  />
                </TableCell>

                {/* PRODUCT */}
                <TableCell className="font-medium">
                  {item.product_name}
                </TableCell>

                {/* CODE */}
                <TableCell className="text-gray-600">
                  {item.product_code}
                </TableCell>

                {/* CATEGORY */}
                <TableCell>
                  {item.category}
                </TableCell>

                {/* STOCK */}
                <TableCell className="text-center font-medium">
                  {item.quantity}
                </TableCell>

                {/* STATUS */}
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border
                      ${
                        status.type === "red"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : status.type === "orange"
                          ? "bg-orange-50 text-orange-600 border-orange-200"
                          : "bg-green-50 text-green-600 border-green-200"
                      }
                    `}
                  >
                    {status.label}
                  </span>
                </TableCell>

                {/* ACTION */}
                <TableCell className="text-right">
                  <button
                    onClick={() => onUpdate(item)}
                    className="bg-primary text-white px-3 py-1 rounded-md hover:opacity-90 transition"
                  >
                    Update Stock
                  </button>
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}

export default StockTable;
