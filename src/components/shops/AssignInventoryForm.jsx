import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { sanitizeInteger } from "../../utils/inputValidation";

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function AssignInventoryForm({
  categories,
  selectedCategory,
  setSelectedCategory,
  products,
  setSelectedProducts,
  assignQuantity,
  setAssignQuantity,
  handleAssignInventory,
  setShowAssignForm,
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto">

      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Assign Inventory
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">

        {/* CATEGORY */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background text-sm"
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {normalizeCategory(cat)}
            </option>
          ))}
        </select>

        {/* PRODUCT LIST */}
        <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-3">
          {products
            .filter((p) => normalizeCategory(p.category) === selectedCategory)
            .map((product) => (
              <label
                key={product.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  value={product.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts((prev) =>
                        prev.includes(product.id)
                          ? prev
                          : [...prev, product.id]
                      );
                    } else {
                      setSelectedProducts((prev) =>
                        prev.filter((id) => id !== product.id)
                      );
                    }
                  }}
                />

                <span>
                {product.product_name}
                {" - "}
                PHP {Number(product.retail_price || 0).toLocaleString()}
                {" - "}
                Available: {product.quantity}
              </span>
              </label>
            ))}
        </div>

        {/* QUANTITY */}
        <Input
          type="number"
          placeholder="Quantity"
          value={assignQuantity}
          onChange={(e) =>
            setAssignQuantity(sanitizeInteger(e.target.value))
          }
          min="1"
          step="1"
          inputMode="numeric"
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => setShowAssignForm(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleAssignInventory}>
            Assign Inventory
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}

export default AssignInventoryForm;
