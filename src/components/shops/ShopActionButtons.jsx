import { Button } from "@/components/ui/button";

function ShopActionButtons({ setShowAdvanceForm, setShowAssignForm }) {
  return (
    <div className="flex gap-3 flex-wrap">

      <Button
        onClick={() => {
          setShowAdvanceForm(true);
          setShowAssignForm(false);
        }}
      >
        Record Payment
      </Button>

      <Button
        variant="secondary"
        onClick={() => {
          setShowAssignForm(true);
          setShowAdvanceForm(false);
        }}
      >
        Assign Inventory
      </Button>

    </div>
  );
}

export default ShopActionButtons;