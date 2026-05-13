function QuickActionCard({ icon, label, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-5 rounded-xl border bg-background shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"    >
      <div className="flex items-start gap-3">

        {/* ICON */}
        <div className="text-primary">
          {icon}
        </div>

        {/* TEXT */}
        <div>
          <h3 className="font-semibold text-foreground">
            {label}
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}

export default QuickActionCard;
