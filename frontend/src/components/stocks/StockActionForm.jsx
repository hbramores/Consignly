import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  sanitizeFreeText,
  sanitizeInteger,
} from "../../utils/inputValidation";

function StockActionForm({
  selectedProduct,
  quantity,
  notes,
  setQuantity,
  setNotes,
  onSave,
  onCancel,
}) {
  if (!selectedProduct) return null;

  const qtyNumber = Number(quantity);

  return (
    <Card className="w-full">

      {/* HEADER */}
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Update Stock
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* PRODUCT INFO */}
        <div className="space-y-1 text-sm">
          <p className="font-medium">
            Product: {selectedProduct.product_name}
          </p>
          <p className="text-gray-500">
            Current Stock: {selectedProduct.quantity}
          </p>
        </div>

        {/* QUANTITY */}
        <Input
          type="number"
          placeholder="Enter quantity (use negative to remove)"
          value={quantity}
          onChange={(e) =>
            setQuantity(
              sanitizeInteger(e.target.value, { allowNegative: true })
            )
          }
          step="1"
          inputMode="numeric"
        />

        {/* STATUS MESSAGE */}
        {quantity !== "" && (
          <p
            className={`text-sm font-medium ${
              qtyNumber > 0
                ? "text-green-600"
                : qtyNumber < 0
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {qtyNumber > 0 && "You are adding stock to inventory"}
            {qtyNumber < 0 && "You are removing stock from inventory"}
          </p>
        )}

        {/* NOTES */}
        <Textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) =>
            setNotes(sanitizeFreeText(e.target.value, 255))
          }
          maxLength={255}
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">

          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={onSave}>
            Save
          </Button>

        </div>

      </CardContent>
    </Card>
  );
}

export default StockActionForm;