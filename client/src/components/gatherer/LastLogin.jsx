export const LastLoginCard = ({ loginTime }) => {
  return (
    <div className="rounded-[14px] shadow-[0px_4px_50px_0px_#0327461F] border border-[#03274633] overflow-hidden w-full">
      <div className="border-b border-[#CDD4DA] px-8 py-6">
        <h2 className="text-[20px] leading-[28px] font-semibold text-blue-dark font-archivo">
          last Login
        </h2>
      </div>

      <div className="px-8 pt-8 pb-[54px]">
        <p className="text-[#6B7280] text-[16px] leading-5 font-normal font-roboto">
          {loginTime}
        </p>
      </div>
    </div>
  );
};