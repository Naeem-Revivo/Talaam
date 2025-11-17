import { useLanguage } from '../../context/LanguageContext';

export default function ViewLogDetails() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-8">
      <div className="w-full max-w-[720px] rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] px-[30px] py-6">
          <h2 className="text-[20px] leading-[100%] font-bold text-oxford-blue">{t('admin.viewLogDetails.hero.title')}</h2>
        </div>

        {/* Content */}
        <div className="px-[30px] py-5">
          <div className="space-y-5">
            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[16px] font-normal leading-[100%] text-dark-gray mb-[10px]">Timestamp</p>
                <p className="text-[16px] font-normal leading-[100%] text-oxford-blue">12 Oct 2025, 14:32 PM</p>
              </div>
              <div>
                <p className="text-[16px] font-normal leading-[100%] text-dark-gray mb-[10px]">Performed By</p>
                <p className="text-[16px] font-normal leading-[100%] text-oxford-blue">Sarah Khan (Super Admin)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[16px] font-normal leading-[100%] text-dark-gray mb-[10px]">Action Type</p>
                <p className="text-[16px] font-normal leading-[100%] text-oxford-blue">Deleted Question</p>
              </div>
              <div>
                <p className="text-[16px] font-normal leading-[100%] text-dark-gray mb-[10px]">Module / Area</p>
                <p className="text-[16px] font-normal leading-[100%] text-oxford-blue">Question Bank</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[16px] font-normal leading-[100%] text-dark-gray mb-[10px]">Item Affected</p>
                <p className="text-[16px] font-normal leading-[100%] text-oxford-blue">Question ID #4567</p>
              </div>
              <div>
                <p className="text-[16px] font-normal leading-[100%] text-dark-gray mb-[10px]">IP Address</p>
                <p className="text-[16px] font-normal leading-[100%] text-oxford-blue">192.168.0.45</p>
              </div>
            </div>

            {/* Previous Value */}
            <div>
              <p className="text-[16px] font-normal leading-[100%] text-dark-gray mb-[10px]">Previous Value</p>
              <div className="rounded-md bg-[#E5E7EB] px-4 py-3">
                <p className="text-[16px] font-normal leading-[100%] text-oxford-blue">What is 2+2?</p>
              </div>
            </div>

            {/* New Value */}
            <div>
              <p className="text-[16px] font-normal leading-[100%] text-dark-gray mb-[10px]">New Value</p>
              <div className="rounded-md bg-[#E5E7EB] px-4 py-3">
                <p className="text-[16px] font-normal leading-[100%] text-oxford-blue">(Deleted)</p>
              </div>
            </div>

            {/* Device Info */}
            <div>
              <p className="text-[16px] font-normal leading-[100%] text-dark-gray mb-[10px]">Device Info</p>
              <p className="text-[16px] font-normal leading-[100%] text-oxford-blue">Chrome - Windows 10</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] px-[30px] py-4">
          <button
            className="rounded-md border border-[#E5E7EB] w-[120px] bg-white px-5 py-[5px] text-[14px] font-semibold text-blue-dark shadow-sm transition-all hover:bg-[#F9FAFB] active:scale-95"
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-[#ED4122] w-[120px] px-5 py-[5px] text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#DC2626] active:scale-95"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}