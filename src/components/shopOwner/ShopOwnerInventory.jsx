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

function ShopOwnerInventory({
  inventory,
  handleReturnAll,
  setSelectedProduct,
  setShowSaleModal,
  setModalMode,
}) {
  const activeInventory = inventory.filter((item) => Number(item.quantity) > 0);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Your Inventory</CardTitle>
        <Button
          variant="outline"
          onClick={handleReturnAll}
          disabled={activeInventory.length === 0}
        >
          Return All to Artisan
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Available Stock</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Shop Selling Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {activeInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No inventory assigned
                </TableCell>
              </TableRow>
            ) : (
              activeInventory.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell>
                    {item.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.product_name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted" />
                    )}
                  </TableCell>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.product_code}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.sold_quantity || 0}</TableCell>
                  <TableCell>{money(item.retail_price)}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <p>
                        {item.contract_type === "percentage"
                          ? money(
                              Number(item.retail_price || 0) *
                                (1 + Number(item.commission_rate || 0) / 100)
                            )
                          : item.shop_selling_price
                          ? money(item.shop_selling_price)
                          : "Not set"}
                      </p>

                      {item.contract_type !== "percentage" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(item);
                            setModalMode("set_price");
                            setShowSaleModal(true);
                          }}
                        >
                          Set Price
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(item);
                        setModalMode("record_sale");
                        setShowSaleModal(true);
                      }}
                    >
                      Record Sale
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShopOwnerInventory;
