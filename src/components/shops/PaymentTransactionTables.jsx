import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PaymentTransactionTables({
  summary,
  outstandingBalance,
  paymentTransactions,
}) {
  const totalSales = Number(summary.total_sales || 0);
  const totalCommission = Number(summary.total_commission || 0);
  const totalAdvance = Number(summary.total_advance || 0);

  return (
    <div className="space-y-6">

      {/* SUMMARY CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Total Sales</th>
                  <th className="py-2">Commission</th>
                  <th className="py-2">Payments</th>
                  <th className="py-2">Outstanding</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="py-3">PHP {totalSales.toFixed(2)}</td>
                  <td className="py-3">PHP {totalCommission.toFixed(2)}</td>
                  <td className="py-3">PHP {totalAdvance.toFixed(2)}</td>
                  <td className="py-3 font-bold">
                    PHP {Number(outstandingBalance || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* HISTORY CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Date</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Note</th>
                </tr>
              </thead>

              <tbody>
                {paymentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-muted-foreground">
                      No payment transactions yet
                    </td>
                  </tr>
                ) : (
                  paymentTransactions.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-3">
                        {new Date(payment.created_at).toLocaleString()}
                      </td>

                      <td className="py-3">Payment</td>

                      <td className="py-3 font-medium">
                        PHP {Number(payment.amount || 0).toFixed(2)}
                      </td>

                      <td className="py-3 text-muted-foreground">
                        {payment.note || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default PaymentTransactionTables;
