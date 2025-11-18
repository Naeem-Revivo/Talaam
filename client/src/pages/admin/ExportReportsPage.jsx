import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Dropdown from "../../components/shared/Dropdown";

const ExportReportsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [reportType, setReportType] = useState("User Growth");
  const [format, setFormat] = useState("Excel");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [scheduleRecurring, setScheduleRecurring] = useState(true);
  const [frequency, setFrequency] = useState("Daily");
  const [deliveryMethod, setDeliveryMethod] = useState("Email");
  const [recipients, setRecipients] = useState("");

  const handleCancel = () => {
    navigate("/admin/reports");
  };

  const handleExport = () => {
    // Handle export logic here
    console.log("Exporting report...", {
      reportType,
      format,
      startDate,
      endDate,
      includeCharts,
      scheduleRecurring,
      frequency,
      deliveryMethod,
      recipients,
    });
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-6 xl:px-6 2xl:px-[66px]">
      <div className="flex max-w-full lg:max-w-[1120px] h-auto lg:h-[1187px] flex-col gap-6">
        {/* Header */}

        {/* Form Card */}
        <div className="rounded-[12px] bg-white shadow-dashboard p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="font-archivo text-[20px] lg:text-[20px] font-bold leading-[28px] lg:leading-[40px] text-oxford-blue">
            {t('admin.exportReports.hero.title')}
          </h1>
          <p className="font-roboto text-[14px] lg:text-[14px] font-normal leading-[20px] lg:leading-[24px] text-dark-gray">
            {t('admin.exportReports.hero.subtitle')}
          </p>
        </div>
          {/* Report Configuration Section */}
          <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">

            {/* Select Report Type */}
            <div>
              <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                {t('admin.exportReports.fields.selectReportType')}
              </label>
              <div className="w-full lg:w-[990px]">
                <Dropdown
                  value={reportType}
                  options={[
                    { value: "User Growth", label: t('admin.exportReports.options.reportType.userGrowth') },
                    { value: "Subscription Trends", label: t('admin.exportReports.options.reportType.subscriptionTrends') },
                    { value: "Performance Analytics", label: t('admin.exportReports.options.reportType.performanceAnalytics') },
                  ]}
                  onChange={(value) => setReportType(value)}
                  placeholder={t('admin.exportReports.fields.selectReportType')}
                  showDefaultOnEmpty={false}
                  className="w-full"
                  height="h-[50px] sm:h-[60px]"
                />
              </div>
            </div>

            {/* Select Format */}
            <div>
              <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                {t('admin.exportReports.fields.selectFormat')}
              </label>
              <div className="w-full lg:w-[990px]">
                <Dropdown
                  value={format}
                  options={[
                    { value: "Excel", label: t('admin.exportReports.options.format.excel') },
                    { value: "PDF", label: t('admin.exportReports.options.format.pdf') },
                    { value: "CSV", label: t('admin.exportReports.options.format.csv') },
                  ]}
                  onChange={(value) => setFormat(value)}
                  placeholder={t('admin.exportReports.fields.selectFormat')}
                  showDefaultOnEmpty={false}
                  className="w-full"
                  height="h-[50px] sm:h-[60px]"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                {t('admin.exportReports.fields.dateRange')}
              </label>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full lg:w-[475px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue outline-none cursor-pointer hover:border-[#03274666] transition shadow-input"
                    placeholder="mm/dd/yyyy"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full lg:w-[475px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue outline-none cursor-pointer hover:border-[#03274666] transition shadow-input"
                    placeholder="mm/dd/yyyy"
                  />
                </div>
              </div>
            </div>

            {/* Include Charts Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIncludeCharts(!includeCharts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED4122] focus:ring-offset-2 ${
                  includeCharts ? "bg-[#ED4122]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    includeCharts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <label className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue">
                {t('admin.exportReports.fields.includeCharts')}
              </label>
            </div>
          </div>

          {/* Schedule Recurring Export Section */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#E5E7EB] space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setScheduleRecurring(!scheduleRecurring)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED4122] focus:ring-offset-2 ${
                  scheduleRecurring ? "bg-[#ED4122]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    scheduleRecurring ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <label className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue">
                {t('admin.exportReports.fields.scheduleRecurring')}
              </label>
            </div>

            {scheduleRecurring && (
              <>
                {/* Frequency */}
                <div>
                  <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                    {t('admin.exportReports.fields.frequency')}
                  </label>
                  <div className="w-full lg:w-[990px]">
                    <Dropdown
                      value={frequency}
                      options={[
                        { value: "Daily", label: t('admin.exportReports.options.frequency.daily') },
                        { value: "Weekly", label: t('admin.exportReports.options.frequency.weekly') },
                        { value: "Monthly", label: t('admin.exportReports.options.frequency.monthly') },
                      ]}
                      onChange={(value) => setFrequency(value)}
                      placeholder={t('admin.exportReports.fields.frequency')}
                      showDefaultOnEmpty={false}
                      className="w-full"
                      height="h-[50px] sm:h-[60px]"
                    />
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                    {t('admin.exportReports.fields.deliveryMethod')}
                  </label>
                  <div className="w-full lg:w-[990px]">
                    <Dropdown
                      value={deliveryMethod}
                      options={[
                        { value: "Email", label: t('admin.exportReports.options.deliveryMethod.email') },
                        { value: "Download", label: t('admin.exportReports.options.deliveryMethod.download') },
                      ]}
                      onChange={(value) => setDeliveryMethod(value)}
                      placeholder={t('admin.exportReports.fields.deliveryMethod')}
                      showDefaultOnEmpty={false}
                      className="w-full"
                      height="h-[50px] sm:h-[60px]"
                    />
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                    {t('admin.exportReports.fields.recipients')}
                  </label>
                  <input
                    type="email"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    placeholder={t('admin.exportReports.placeholders.recipients')}
                    className="w-full lg:w-[990px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue outline-none hover:border-[#03274666] transition shadow-input"
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 lg:mr-20">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-4 sm:px-6 py-2.5 sm:py-3 font-roboto text-[14px] sm:text-[16px] font-medium leading-[20px] text-oxford-blue transition hover:bg-[#F9FAFB] w-full sm:w-auto"
            >
              {t('admin.exportReports.buttons.cancel')}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center rounded-[8px] bg-[#ED4122] px-4 sm:px-6 py-2.5 sm:py-3 font-roboto text-[14px] sm:text-[16px] font-semibold leading-[20px] text-white transition hover:bg-[#d43a1f] w-full sm:w-auto"
            >
              {t('admin.exportReports.buttons.exportReport')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReportsPage;

