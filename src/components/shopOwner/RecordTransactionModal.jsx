import { sanitizeDecimal, sanitizeFreeText, sanitizeInteger } from "../../utils/inputValidation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function money(value) {
  return `PHP ${Number(value || 0).toFixed(2)}`;
}

function RecordTransactionModal({
  selectedProduct,
  saleType,
  setSaleType,
  saleQuantity,
  setSaleQuantity,
  returnReason,
  setReturnReason,
  handleRecordSale,
  handleSavePrice,
  closeModal,
  modalMode,
  shopSellingPrice,
  setShopSellingPrice,
}) {
  const isUnprofitable =
    modalMode === "set_price" &&
    selectedProduct &&
    Number(shopSellingPrice || 0) > 0 &&
    Number(shopSellingPrice || 0) < Number(selectedProduct.base_price || 0);

  return (
    <Dialog open onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {modalMode === "set_price" ? "Set Shop Selling Price" : "Record Transaction"}
          </DialogTitle>
          <DialogDescription>
            {selectedProduct?.product_name || "Update shop inventory"}
          </DialogDescription>
        </DialogHeader>

        {selectedProduct && (
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p><span className="font-medium">Available Stock:</span> {selectedProduct.quantity}</p>
            <p><span className="font-medium">Base Price:</span> {money(selectedProduct.base_price)}</p>
          </div>
        )}

        {modalMode === "set_price" && (
          <div className="space-y-2">
            <Label htmlFor="shopSellingPrice">Shop Selling Price</Label>
            <Input
              id="shopSellingPrice"
              type="number"
              value={shopSellingPrice}
              onChange={(e) => setShopSellingPrice(sanitizeDecimal(e.target.value))}
              placeholder="Enter selling price"
              min="0.01"
              step="0.01"
              inputMode="decimal"
            />
            {isUnprofitable && (
              <p className="text-sm font-medium text-destructive">
                Your indicated price would be unprofitable because it is below the base price.
              </p>
            )}
          </div>
        )}

        {modalMode === "record_sale" && (
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select value={saleType} onValueChange={setSaleType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {modalMode === "record_sale" && saleType === "returned" && (
          <div className="space-y-2">
            <Label htmlFor="returnReason">Reason</Label>
            <Input
              id="returnReason"
              type="text"
              placeholder="e.g. damaged, unsold"
              value={returnReason}
              onChange={(e) => setReturnReason(sanitizeFreeText(e.target.value, 255))}
              maxLength={255}
            />
          </div>
        )}

        {modalMode === "record_sale" && (
          <div className="space-y-2">
            <Label htmlFor="saleQuantity">Quantity</Label>
            <Input
              id="saleQuantity"
              type="number"
              value={saleQuantity}
              onChange={(e) => setSaleQuantity(sanitizeInteger(e.target.value))}
              placeholder="Enter quantity"
              min="1"
              step="1"
              inputMode="numeric"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={modalMode === "set_price" ? handleSavePrice : handleRecordSale}
          >
            {modalMode === "set_price" ? "Save Price" : "Record Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecordTransactionModal;
