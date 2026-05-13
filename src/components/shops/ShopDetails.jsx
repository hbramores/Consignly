function ShopDetails({ selectedShop }) {
  if (!selectedShop) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">
        {selectedShop.shop_name}
      </h2>

      <p>
        <span className="font-semibold">Contact Person:</span>{" "}
        {selectedShop.contact_person}
      </p>

      <p>
        <span className="font-semibold">Phone Number:</span>{" "}
        {selectedShop.phone_number}
      </p>

      <p>
        <span className="font-semibold">Address:</span>{" "}
        {selectedShop.address}
      </p>

      <p>
        <span className="font-semibold">Access Code:</span>{" "}
        {selectedShop.access_code}
      </p>
    </div>
  );
}

export default ShopDetails;