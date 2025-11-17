
const StatsCards = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="flex-1 min-w-[150px] bg-white shadow-sm border border-[#E5E7EB] rounded-md p-5 space-y-[10px]"
        >
          <p className="text-[16px] leading-[20px] font-normal text-dark-gray">{item.label}</p>
          <p className="text-[30px] leading-[28px] font-semibold text-blue-dark">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;