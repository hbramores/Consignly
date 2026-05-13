import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ReportSection({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default ReportSection;
