import ReportTable from "./ReportTable";
import { currency, date, number } from "./reportFormatters";

function ReportTables({ activeTab, report }) {
  return (
    <div className="space-y-6">
      {activeTab === "Summary" && (
        <>
          <TopSellingProductsTable rows={report.topProducts} />
          <TopPerformingShopsTable rows={report.topShops} />
        </>
      )}

      {activeTab === "Sales" && <TopSellingProductsTable rows={report.topProducts} />}

      {activeTab === "Inventory" && (
        <>
          <LowStockTable rows={report.lowStock} />
          <InventoryMovementTable rows={report.inventoryMovement} />
        </>
      )}

      {activeTab === "Shops" && (
        <>
          <TopPerformingShopsTable rows={report.topShops} />
          <ShopSettlementTable rows={report.shopSettlement} />
        </>
      )}

      {activeTab === "Earnings" && (
        <>
          <ProfitabilityTable rows={report.profitability} />
          <ShopSettlementTable rows={report.shopSettlement} />
        </>
      )}

      {activeTab === "Returns" && <ReturnsReportTable rows={report.returnsReport} />}

      {activeTab === "Payments" && <PaymentsTable rows={report.advancePayments} />}
    </div>
  );
}

function TopSellingProductsTable({ rows }) {
  return (
    <ReportTable
      title="Top Selling Products Table"
      rows={rows}
      emptyText="No product sales found"
      columns={[
        { key: "product_name", label: "Product Name" },
        { key: "product_code", label: "Product Code" },
        { key: "total_sold", label: "Total Sold", render: (row) => number(row.total_sold) },
        { key: "revenue", label: "Revenue", render: (row) => currency(row.revenue) },
        { key: "artisan_earnings", label: "Artisan Earnings", render: (row) => currency(row.artisan_earnings) },
        { key: "shop_earnings", label: "Shop Earnings", render: (row) => currency(row.shop_earnings) },
      ]}
    />
  );
}

function TopPerformingShopsTable({ rows }) {
  return (
    <ReportTable
      title="Top Performing Shops Table"
      rows={rows}
      emptyText="No shop performance found"
      columns={[
        { key: "shop_name", label: "Shop Name" },
        { key: "total_sales", label: "Total Sales", render: (row) => currency(row.total_sales) },
        { key: "products_sold", label: "Products Sold", render: (row) => number(row.products_sold) },
        { key: "artisan_earnings", label: "Artisan Earnings", render: (row) => currency(row.artisan_earnings) },
        { key: "shop_earnings", label: "Shop Earnings", render: (row) => currency(row.shop_earnings) },
      ]}
    />
  );
}

function LowStockTable({ rows }) {
  return (
    <ReportTable
      title="Low Stock Alert Table"
      rows={rows}
      emptyText="No products found"
      columns={[
        { key: "product_name", label: "Product" },
        { key: "current_stock", label: "Current Stock", render: (row) => number(row.current_stock) },
        { key: "minimum_stock", label: "Minimum Stock", render: (row) => number(row.minimum_stock) },
        { key: "status", label: "Status" },
      ]}
    />
  );
}

function ReturnsReportTable({ rows }) {
  return (
    <ReportTable
      title="Returns Report Table"
      rows={rows}
      emptyText="No returns found"
      columns={[
        { key: "created_at", label: "Date", render: (row) => date(row.created_at) },
        { key: "product_name", label: "Product" },
        { key: "shop_name", label: "Shop" },
        { key: "quantity", label: "Quantity Returned", render: (row) => number(row.quantity) },
        { key: "reason", label: "Reason", render: (row) => row.reason || "-" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}

function PaymentsTable({ rows }) {
  return (
    <ReportTable
      title="Payments Table"
      rows={rows}
      emptyText="No payments found"
      columns={[
        { key: "shop_name", label: "Shop" },
        { key: "amount", label: "Amount", render: (row) => currency(row.amount) },
        { key: "note", label: "Note", render: (row) => row.note || "-" },
        { key: "created_at", label: "Date", render: (row) => date(row.created_at) },
      ]}
    />
  );
}

function InventoryMovementTable({ rows }) {
  return (
    <ReportTable
      title="Inventory Movement Report"
      rows={rows}
      emptyText="No inventory movement found"
      columns={[
        { key: "product_name", label: "Product" },
        { key: "initial_quantity", label: "Initial Quantity", render: (row) => number(row.initial_quantity) },
        { key: "assigned", label: "Assigned", render: (row) => number(row.assigned) },
        { key: "sold", label: "Sold", render: (row) => number(row.sold) },
        { key: "returned", label: "Returned", render: (row) => number(row.returned) },
        { key: "damaged", label: "Damaged", render: (row) => number(row.damaged) },
        { key: "remaining", label: "Remaining", render: (row) => number(row.remaining) },
      ]}
    />
  );
}

function ProfitabilityTable({ rows }) {
  return (
    <ReportTable
      title="Profitability Report"
      rows={rows}
      emptyText="No profitability data found"
      columns={[
        { key: "product_name", label: "Product" },
        { key: "revenue", label: "Revenue", render: (row) => currency(row.revenue) },
        { key: "artisan_profit", label: "Artisan Profit", render: (row) => currency(row.artisan_profit) },
        { key: "shop_profit", label: "Shop Profit", render: (row) => currency(row.shop_profit) },
        { key: "net_earnings", label: "Net Earnings", render: (row) => currency(row.net_earnings) },
      ]}
    />
  );
}

function ShopSettlementTable({ rows }) {
  return (
    <ReportTable
      title="Shop Settlement Report"
      rows={rows}
      emptyText="No settlement data found"
      columns={[
        { key: "shop_name", label: "Shop" },
        { key: "total_sales", label: "Total Sales", render: (row) => currency(row.total_sales) },
        { key: "shop_earnings", label: "Shop Earnings", render: (row) => currency(row.shop_earnings) },
        { key: "advance_payments", label: "Payments", render: (row) => currency(row.advance_payments) },
        { key: "remaining_balance", label: "Remaining Balance", render: (row) => currency(row.remaining_balance) },
      ]}
    />
  );
}

export default ReportTables;
