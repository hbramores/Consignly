import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ProductForm({
  isEditing,
  setImage,
  productCode,
  setProductCode,
  category,
  setCategory,
  productName,
  setProductName,
  description,
  setDescription,
  retailPrice,
  setRetailPrice,
  minimumStock,
  setMinimumStock,
  onCancel,
  onSubmit,
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {isEditing ? "Edit Product" : "Add Product"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* IMAGE + CODE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <Input
            placeholder="Product Code"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            maxLength={40}
            required
          />
        </div>

        {/* CATEGORY + NAME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            maxLength={60}
            required
          />

          <Input
            placeholder="Product Name"
            value={productName}
            onChange={(e) =>
              setProductName(e.target.value)
            }
            maxLength={100}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          maxLength={255}
        />

        {/* PRICE + STOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Base / Artisan Price"
            value={retailPrice}
            onChange={(e) =>
              setRetailPrice(e.target.value)
            }
            min="0.01"
            step="0.01"
            inputMode="decimal"
            required
          />

          <Input
            type="number"
            placeholder="Minimum Stock Alert"
            value={minimumStock}
            onChange={(e) =>
              setMinimumStock(e.target.value)
            }
            min="1"
            step="1"
            inputMode="numeric"
            required
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={onSubmit}>
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}

export default ProductForm;
