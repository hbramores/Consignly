import { useEffect, useState } from "react";

import ProductCard from "../components/products/ProductCard";
import ProductForm from "../components/products/ProductForm";
import { isNonEmpty, isPositiveNumber } from "../utils/inputValidation";
import { Button } from "@/components/ui/button";
import Header from "../components/Header"

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Products({ user, pageAction, setPageAction }) {  
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [retailPrice, setRetailPrice] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [minimumStock, setMinimumStock] = useState("");
  const resetForm = () => {
    setProductCode("");
    setCategory("");
    setProductName("");
    setDescription("");
    setImage(null);
    setRetailPrice("");
    setMinimumStock("");
    setIsEditing(false);
    setEditId(null);
  };

  const fetchProducts = async () => {
    const res = await fetch(`http://localhost:5000/products/${user.id}`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (pageAction !== "addProduct") return;

    resetForm();
    setShowForm(true);
    setPageAction(null);
  }, [pageAction, setPageAction]);

  const categories = [
    "All",
    ...new Set(products.map((item) => normalizeCategory(item.category)).filter(Boolean)),
  ];

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      (item.product_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      normalizeCategory(item.category) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const createProduct = async () => {
    if (
      !isNonEmpty(productCode) ||
      !isNonEmpty(category) ||
      !isNonEmpty(productName) ||
      !isNonEmpty(retailPrice) ||
      !isNonEmpty(minimumStock)
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!isPositiveNumber(retailPrice) || !isPositiveNumber(minimumStock)) {
      alert("Price and minimum stock must be greater than 0");
      return;
    }

    if (!minimumStock || Number(minimumStock) <= 0) {
      alert("Enter a valid minimum stock");
      return;
    }

    const formData = new FormData();

    formData.append("product_code", productCode);
    formData.append("category", normalizeCategory(category));
    formData.append("product_name", productName);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("retail_price", retailPrice);
    formData.append("minimum_stock", minimumStock);
    formData.append("user_id", user.id);

    const res = await fetch("http://localhost:5000/products", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      resetForm();
      setShowForm(false);
      fetchProducts();
    }
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");

    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      fetchProducts();
    }
  };

  const startEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);

    setProductCode(item.product_code);
    setCategory(normalizeCategory(item.category));
    setProductName(item.product_name);
    setDescription(item.description);
    setRetailPrice(item.retail_price);
    setImage(null);
    setMinimumStock(item.minimum_stock);

    setShowForm(true);
  };

  const updateProduct = async () => {
    
    if (
      !isNonEmpty(productCode) ||
      !isNonEmpty(category) ||
      !isNonEmpty(productName) ||
      !isNonEmpty(retailPrice) ||
      !isNonEmpty(minimumStock)
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!isPositiveNumber(retailPrice) || !isPositiveNumber(minimumStock)) {
      alert("Price and minimum stock must be greater than 0");
      return;
    }

    if (!minimumStock || Number(minimumStock) <= 0) {
      alert("Enter a valid minimum stock");
      return;
    }

    console.log("UPDATE CLICKED", editId);
    const formData = new FormData();

    formData.append("product_code", productCode);
    formData.append("category", normalizeCategory(category));
    formData.append("product_name", productName);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    formData.append("retail_price", retailPrice);
    formData.append("minimum_stock", minimumStock);

    const res = await fetch(`http://localhost:5000/products/${editId}`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      resetForm();
      setShowForm(false);
      fetchProducts();
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="mb-4 md:mb-6">
          <Header 
            title="Products"
            description="Manage your product inventory"
          />
        </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search product name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* CATEGORY */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/4 px-3 py-2 rounded-lg border bg-background text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* ADD BUTTON */}
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="md:ml-auto"
        >
          Add Product
        </Button>

      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onEdit={startEdit}
            onDelete={deleteProduct}
          />
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-background rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

            <ProductForm
              isEditing={isEditing}
              productCode={productCode}
              setProductCode={setProductCode}
              category={category}
              setCategory={setCategory}
              productName={productName}
              setProductName={setProductName}
              description={description}
              setDescription={setDescription}
              setImage={setImage}
              retailPrice={retailPrice}
              setRetailPrice={setRetailPrice}
              minimumStock={minimumStock}
              setMinimumStock={setMinimumStock}
              onCancel={() => {
                resetForm();
                setShowForm(false);
              }}
              onSubmit={isEditing ? updateProduct : createProduct}
            />

          </div>

        </div>
      )}

    </div>
  );
}

export default Products;
