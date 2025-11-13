import React from "react";

const cardClasses =
  "flex flex-1 min-w-[220px] max-w-[343px] h-[106px] items-center justify-between rounded-[16px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_6px_40px_rgba(0,0,0,0.05)]";

const iconWrapperClasses =
  "flex h-12 w-12 items-center justify-center rounded-full";

const QuestionBankSummaryCards = ({ stats }) => {
  if (!stats?.length) return null;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((item) => (
        <article key={item.label} className={cardClasses}>
          <div className="space-y-2">
            <p
              className={`text-[16px] font-roboto leading-[20px] ${
                item.labelClassName ?? "text-[#6B7280]"
              }`}
            >
              {item.label}
            </p>
            <p className="text-[30px] font-archivo font-semibold leading-[28px] text-[#032746]">
              {item.value}
            </p>
          </div>
          <div className={iconWrapperClasses} style={{ backgroundColor: item.iconBg }}>
            {item.icon}
          </div>
        </article>
      ))}
    </section>
  );
};

QuestionBankSummaryCards.defaultProps = {
  stats: [],
};

export default QuestionBankSummaryCards;


