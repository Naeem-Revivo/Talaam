
const StatsCards = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="flex-1 min-w-[150px] bg-white shadow-sm border border-gray-100 rounded-xl p-5 space-y-2"
        >
          <p className="text-sm font-normal text-[#6B7280]">{item.label}</p>
          <p className="text-2xl font-semibold text-blue-dark">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;