function ShopProductSummaryTable({ productSummary }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Product Summary</h3>

      <table className="w-full text-sm">
        <thead className="border-b text-left text-muted-foreground">
          <tr>
            <th className="py-2">Product</th>
            <th>Assigned</th>
            <th>Sold</th>
            <th>Returned</th>
            <th>Remaining</th>
            <th>Total Sales</th>
          </tr>
        </thead>

        <tbody>
          {productSummary.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-muted-foreground">
                No summary data yet
              </td>
            </tr>
          ) : (
            productSummary.map((item) => (
              <tr key={item.product_id} className="border-b">
                <td className="py-2">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.product_name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <span className="font-medium">
                      {item.product_name}
                    </span>
                  </div>
                </td>

                <td>{item.assigned}</td>
                <td>{item.sold}</td>
                <td>{item.returned}</td>
                <td>{item.remaining}</td>
                <td className="font-medium">
                  ₱{Number(item.total_sales || 0).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShopProductSummaryTable;