function SummaryCard({ label, value, icon }) {
  return (
    <div className="p-4 bg-white rounded-md shadow-sm flex flex-col justify-between gap-4 h-full">
      <div className="flex justify-between items-center">
        <p>{label}</p>
        <span className="text-primary">{icon}</span>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-1">{value}</h2>
    </div>
  )
}

export default SummaryCard
