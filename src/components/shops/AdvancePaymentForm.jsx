import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { sanitizeDecimal, sanitizeFreeText } from "../../utils/inputValidation";

function AdvancePaymentForm({
  advanceAmount,
  setAdvanceAmount,
  advanceNote,
  setAdvanceNote,
  handleRecordAdvance,
  setShowAdvanceForm,
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Record Payment
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* AMOUNT */}
        <Input
          type="number"
          placeholder="Amount (Pesos)"
          value={advanceAmount}
          onChange={(e) =>
            setAdvanceAmount(sanitizeDecimal(e.target.value))
          }
          min="0.01"
          step="0.01"
          inputMode="decimal"
        />

        {/* NOTE */}
        <Input
          type="text"
          placeholder="Note (optional)"
          value={advanceNote}
          onChange={(e) =>
            setAdvanceNote(sanitizeFreeText(e.target.value, 255))
          }
          maxLength={255}
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvanceForm(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleRecordAdvance}>
            Record Payment
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}

export default AdvancePaymentForm;