import { useEffect, useMemo, useState } from "react";
import {
  isNonEmpty,
  sanitizeFreeText,
  sanitizeNameText,
  sanitizePercentage,
  sanitizePhone,
} from "../utils/inputValidation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "../components/Header"

function Shops({ user, onManageShop, pageAction, setPageAction }) {
  const [shops, setShops] = useState([]);
  const [archivedShops, setArchivedShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingShop, setEditingShop] = useState(null);
  const [shopName, setShopName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [contractType, setContractType] = useState("percentage");
  const [newAccessCode, setNewAccessCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShops = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) return shops;

    return shops.filter((shop) =>
      [
        shop.shop_name,
        shop.contact_person,
        shop.phone_number,
        shop.address,
        shop.access_code,
        shop.contract_type,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [shops, searchTerm]);

  async function fetchShops() {
    const res = await fetch(`http://localhost:5000/shops/${user.id}`);
    const data = await res.json();
    setShops(data);
  }

  async function fetchArchivedShops() {
    const res = await fetch(`http://localhost:5000/shops/${user.id}/archived`);
    const data = await res.json();
    setArchivedShops(data);
  }

  useEffect(() => {
    fetchShops();
    fetchArchivedShops();
  }, []);

  useEffect(() => {
    if (pageAction !== "addShop") return;

    openCreateForm();
    setPageAction(null);
  }, [pageAction, setPageAction]);

  function resetForm() {
    setShopName("");
    setContactPerson("");
    setPhoneNumber("");
    setAddress("");
    setCommissionRate("");
    setContractType("percentage");
    setEditingShop(null);
    setFormMode("create");
  }

  function openCreateForm() {
    resetForm();
    setNewAccessCode("");
    setShowForm(true);
  }

  const openEditForm = (shop) => {
    setFormMode("edit");
    setEditingShop(shop);
    setNewAccessCode("");
    setShopName(shop.shop_name || "");
    setContactPerson(shop.contact_person || "");
    setPhoneNumber(shop.phone_number || "");
    setAddress(shop.address || "");
    setCommissionRate(shop.commission_rate || "");
    setContractType(shop.contract_type || "percentage");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const shopPayload = {
    shop_name: shopName,
    contact_person: contactPerson,
    phone_number: phoneNumber,
    address,
    commission_rate: contractType === "percentage" ? commissionRate : 0,
    contract_type: formMode === "edit" ? editingShop?.contract_type : contractType,
    user_id: user.id,
  };

  const handleSaveShop = async () => {
    if (!isNonEmpty(shopName) || !isNonEmpty(contactPerson) || !isNonEmpty(phoneNumber) || !isNonEmpty(address)) {
      alert("Please fill in all required shop fields");
      return;
    }

    if (contractType === "percentage" && (!commissionRate || Number(commissionRate) < 0 || Number(commissionRate) > 100)) {
      alert("Commission rate must be between 0 and 100");
      return;
    }

    const isEdit = formMode === "edit";
    const url = isEdit
      ? `http://localhost:5000/shops/${editingShop.id}`
      : "http://localhost:5000/shops/create";

    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shopPayload),
    });

    const data = await res.json();

    if (data.success) {
      if (!isEdit) {
        setNewAccessCode(data.access_code);
      }

      closeForm();
      fetchShops();
      fetchArchivedShops();
    } else {
      alert(data.message || "Failed to save shop");
    }
  };

  const handleArchiveShop = async (shop) => {
    const confirmed = window.confirm("Are you sure you want to archive this shop?");

    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/shops/${shop.id}/archive`, {
      method: "PATCH",
    });

    const data = await res.json();

    if (data.success) {
      fetchShops();
      fetchArchivedShops();
    } else {
      alert(data.message || "Failed to archive shop");
    }
  };

  const handleActivateShop = async (shop) => {
    const res = await fetch(`http://localhost:5000/shops/${shop.id}/activate`, {
      method: "PATCH",
    });

    const data = await res.json();

    if (data.success) {
      fetchShops();
      fetchArchivedShops();
    } else {
      alert(data.message || "Failed to activate shop");
    }
  };

  return (
    <div className="min-h-screen">
      <main className="p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="mb-4 md:mb-6">
          <Header 
            title="Shops"
            description="Manage your shops and consignment contracts"
          />
        </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
        <Input
          type="text"
          placeholder="Search shops"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: "1 1 240px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <Button onClick={openCreateForm}>Add Shop</Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formMode === "edit" ? "Edit Shop" : "Create Shop"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">

            <Input
              type="text"
              placeholder="Shop name"
              value={shopName}
              onChange={(e) => setShopName(sanitizeNameText(e.target.value, 100))}
              maxLength={100}
              required
            />

            <Input
              type="text"
              placeholder="Contact person"
              value={contactPerson}
              onChange={(e) => setContactPerson(sanitizeNameText(e.target.value, 100))}
              maxLength={100}
              required
            />

            <Input
              type="text"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(sanitizePhone(e.target.value))}
              maxLength={20}
              inputMode="tel"
              required
            />

            <Input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(sanitizeFreeText(e.target.value, 180))}
              maxLength={180}
              required
            />

            {contractType === "percentage" && (
              <Input
                type="number"
                placeholder="Commission rate (%)"
                value={commissionRate}
                onChange={(e) => setCommissionRate(sanitizePercentage(e.target.value))}
                min="0"
                max="100"
                step="0.01"
                inputMode="decimal"
                required
              />
            )}

            <Select
              value={contractType}
              onValueChange={setContractType}
              disabled={formMode === "edit"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Contract type" />
              </SelectTrigger>
              <SelectContent className="z-[1000]">
                <SelectItem value="percentage">Percentage Consignment</SelectItem>
                <SelectItem value="manual_pricing">Manual Pricing / Markup</SelectItem>
              </SelectContent>
            </Select>
            {formMode === "edit" && (
              <p className="text-xs text-muted-foreground">
                Contract type cannot be changed after a shop is created.
              </p>
            )}

            <div className="flex gap-2 justify-end">
              <Button onClick={handleSaveShop}>
                {formMode === "edit" ? "Save Changes" : "Create Shop"}
              </Button>

              <Button variant="outline" onClick={closeForm}>Cancel</Button>
            </div>

            {newAccessCode && <p>Access Code: {newAccessCode}</p>}
          </div>
        </DialogContent>
      </Dialog>

      <div className="shops-grid">
        {filteredShops.length === 0 ? (
          <p>No shops found</p>
        ) : (
          filteredShops.map((shop) => (
            <Card
              key={shop.id}
            >
              <CardHeader>
                <CardTitle>{shop.shop_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>Contact: {shop.contact_person}</p>
                <p>Phone: {shop.phone_number}</p>
                <p>Address: {shop.address}</p>
                {shop.contract_type === "percentage" && (
                  <p>Commission: {Number(shop.commission_rate)}%</p>
                )}
                <p>
                  Contract Type:{" "}
                  {shop.contract_type === "percentage" ? "Percentage" : "Manual Pricing"}
                </p>
                <p>Code: {shop.access_code}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={() => onManageShop(shop)}>Manage</Button>
                  <Button size="sm" variant="outline" onClick={() => openEditForm(shop)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleArchiveShop(shop)}>Archive</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {archivedShops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Archived Shops</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {archivedShops.map((shop) => (
              <div
                key={shop.id}
                className="flex flex-col gap-2 rounded-md border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{shop.shop_name}</p>
                  <p className="text-muted-foreground">
                    {shop.contact_person} - {shop.access_code}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleActivateShop(shop)}>
                  Activate
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      </main>
    </div>
  );
}

export default Shops;
