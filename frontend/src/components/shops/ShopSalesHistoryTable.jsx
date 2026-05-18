function ShopSalesHistoryTable({ salesHistory }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Sales History</h3>

      <table className="w-full text-sm">
        <thead className="border-b text-left text-muted-foreground">
          <tr>
            <th className="py-2">Date</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {salesHistory.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-4 text-center text-muted-foreground"
              >
                No sales history yet
              </td>
            </tr>
          ) : (
            salesHistory.map((sale) => (
              <tr key={sale.id} className="border-b">
                <td className="py-2">
                  {new Date(sale.created_at).toLocaleString()}
                </td>

                <td className="font-medium">{sale.product_name}</td>

                <td>{sale.quantity}</td>

                <td>
                  ₱
                  {Number(
                    sale.price || sale.shop_selling_price || 0
                  ).toFixed(2)}
                </td>

                <td className="font-medium">
                  ₱{Number(sale.total_amount || 0).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShopSalesHistoryTable;