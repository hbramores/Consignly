import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function ReportFilters({ filters, shops, products, onFilterChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

      {/* Date Range */}
      <div className="flex flex-col gap-1">
        <Label>Date Range</Label>

        <Select
          value={filters.date_range}
          onValueChange={(value) => onFilterChange("date_range", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Dates */}
      {filters.date_range === "custom" && (
        <>
          <div className="flex flex-col gap-1">
            <Label>Start Date</Label>
            <Input
              className="w-full"
              type="date"
              value={filters.start_date}
              onChange={(e) => onFilterChange("start_date", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>End Date</Label>
            <Input
              className="w-full"
              type="date"
              value={filters.end_date}
              onChange={(e) => onFilterChange("end_date", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Shop Filter */}
      <div className="flex flex-col gap-1">
        <Label>Shop</Label>

        <Select
          value={filters.shop_id}
          onValueChange={(value) => onFilterChange("shop_id", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Shops" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Shops</SelectItem>
            {shops.map((shop) => (
              <SelectItem key={shop.id} value={String(shop.id)}>
                {shop.shop_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Filter */}
      <div className="flex flex-col gap-1">
        <Label>Product</Label>

        <Select
          value={filters.product_id}
          onValueChange={(value) => onFilterChange("product_id", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Products" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={String(product.id)}>
                {product.product_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}

export default ReportFilters;
