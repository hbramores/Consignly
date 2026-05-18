import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CurrentShopInventoryTable({ shopInventory }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Shop Inventory</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Product</th>
                <th className="py-2">Available Stock</th>
                <th className="py-2">Sold</th>
              </tr>
            </thead>

            <tbody>
              {shopInventory
                .filter((item) => Number(item.quantity) > 0)
                .map((item) => (
                  <tr key={item.product_id} className="border-b">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`http://localhost:5000/uploads/${item.image}`}
                          alt={item.product_name}
                          className="w-10 h-10 rounded-md object-cover"
                        />

                        <div>
                          <div className="font-medium">
                            {item.product_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 font-medium">
                      {item.quantity}
                    </td>

                    <td className="py-3">
                      {item.sold_quantity || 0}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default CurrentShopInventoryTable;