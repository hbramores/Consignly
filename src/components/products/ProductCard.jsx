function ProductCard({ item, onEdit, onDelete }) {
  return (
    <div className="p-5 bg-background border rounded-xl shadow-sm hover:shadow-md transition space-y-3">

      {/* IMAGE */}
      {item.image && (
        <div className="w-full h-40 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <img
            src={`http://localhost:5000/uploads/${item.image}`}
            alt="product"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* PRODUCT NAME */}
      <h3 className="text-lg font-semibold text-foreground">
        {item.product_name}
      </h3>

      {/* DETAILS */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p><span className="font-medium text-foreground">Code:</span> {item.product_code}</p>
        <p><span className="font-medium text-foreground">Category:</span> {item.category}</p>
        <p>{item.description}</p>
        <p>
          <span className="font-medium text-foreground">Base Price:</span>{" "}
          ₱{item.retail_price}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="flex-1 px-3 py-2 text-sm rounded-lg border text-red-500 hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>

    </div>
  );
}

export default ProductCard;