const StatsCards = ({ stats }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="w-full bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F1F1F1] p-4"
        >
          <p className="text-[14px] text-[#6B7280] leading-[18px]">
            {item.label}
          </p>

          <p
            className={`text-[28px] font-semibold leading-[26px] mt-2 ${
              item.color === "red"
                ? "text-[#ED4122]"
                : item.color === "blue"
                ? "text-[#032746]"
                : "text-[#032746]"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
