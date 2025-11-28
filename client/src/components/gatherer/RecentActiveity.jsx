import { useLanguage } from "../../context/LanguageContext";

const RecentActivity = ({ icon, title, subtitle, timestamp, variant = 'default' }) => {
  const {language} = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  
  return (
    <div className={`bg-[#E5E7EB] rounded-lg py-4 px-7 border border-[#6CA6C1]`} dir={dir}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {/* <Icon className={`w-5 h-5 ${iconColorMap[variant]}`} /> */}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] leading-5 font-normal text-blue-dark font-roboto" dir="ltr">{title}</p>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
          )}
          <p className="text-[12px] leading-5 text-[#6B7280] font-normal font-roboto mt-1" dir="ltr">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;