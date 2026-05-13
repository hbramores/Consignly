import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ShopOwnerReturnsTable({ returnedProducts }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {returnedProducts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No returned products yet
            </TableCell>
          </TableRow>
        ) : (
          returnedProducts.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
              <TableCell>{item.product_name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.reason || "-"}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default ShopOwnerReturnsTable;
