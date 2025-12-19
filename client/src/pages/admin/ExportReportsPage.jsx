import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Dropdown from "../../components/shared/Dropdown";
import adminAPI from "../../api/admin";
import Loader from "../../components/common/Loader";

const ExportReportsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [reportType, setReportType] = useState("User Growth");
  const [format, setFormat] = useState("CSV");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [scheduleRecurring, setScheduleRecurring] = useState(false);
  const [frequency, setFrequency] = useState("Daily");
  const [deliveryMethod, setDeliveryMethod] = useState("Download");
  const [recipients, setRecipients] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Validation errors state
  const [errors, setErrors] = useState({
    reportType: "",
    format: "",
    startDate: "",
    endDate: "",
    frequency: "",
    deliveryMethod: "",
    recipients: "",
  });

  const handleCancel = () => {
    navigate("/admin/reports");
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDate = (dateString) => {
    if (!dateString) return true; // Optional field
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const validateForm = () => {
    const newErrors = {
      reportType: "",
      format: "",
      startDate: "",
      endDate: "",
      frequency: "",
      deliveryMethod: "",
      recipients: "",
    };

    let isValid = true;

    // Validate Report Type
    if (!reportType || reportType.trim() === "") {
      newErrors.reportType = t("admin.exportReports.validation.reportTypeRequired") || "Report type is required";
      isValid = false;
    }

    // Validate Format
    if (!format || format.trim() === "") {
      newErrors.format = t("admin.exportReports.validation.formatRequired") || "Format is required";
      isValid = false;
    }

    // Validate Start Date
    if (startDate) {
      if (!validateDate(startDate)) {
        newErrors.startDate = t("admin.exportReports.validation.invalidStartDate") || "Invalid start date";
        isValid = false;
      }
      
      // Check if start date is in the future
      const start = new Date(startDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (start > today) {
        newErrors.startDate = t("admin.exportReports.validation.startDateFuture") || "Start date cannot be in the future";
        isValid = false;
      }
    }

    // Validate End Date
    if (endDate) {
      if (!validateDate(endDate)) {
        newErrors.endDate = t("admin.exportReports.validation.invalidEndDate") || "Invalid end date";
        isValid = false;
      }
      
      // Check if end date is in the future
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (end > today) {
        newErrors.endDate = t("admin.exportReports.validation.endDateFuture") || "End date cannot be in the future";
        isValid = false;
      }
    }

    // Validate Date Range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        newErrors.endDate = t("admin.exportReports.validation.invalidDateRange") || "End date must be after start date";
        isValid = false;
      }
      
      // Check if date range is too large (e.g., more than 5 years)
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1825) { // 5 years
        newErrors.endDate = t("admin.exportReports.validation.dateRangeTooLarge") || "Date range cannot exceed 5 years";
        isValid = false;
      }
    }

    // Validate recurring schedule fields if enabled
    if (scheduleRecurring) {
      // Validate Frequency
      if (!frequency || frequency.trim() === "") {
        newErrors.frequency = t("admin.exportReports.validation.frequencyRequired") || "Frequency is required";
        isValid = false;
      }

      // Validate Delivery Method
      if (!deliveryMethod || deliveryMethod.trim() === "") {
        newErrors.deliveryMethod = t("admin.exportReports.validation.deliveryMethodRequired") || "Delivery method is required";
        isValid = false;
      }

      // Validate Recipients if Email is selected
      if (deliveryMethod === "Email") {
        if (!recipients || recipients.trim() === "") {
          newErrors.recipients = t("admin.exportReports.validation.recipientsRequired") || "Email recipients are required";
          isValid = false;
        } else {
          // Validate email format
          const emailList = recipients.split(",").map(email => email.trim()).filter(email => email);
          const invalidEmails = emailList.filter(email => !validateEmail(email));
          if (invalidEmails.length > 0) {
            newErrors.recipients = t("admin.exportReports.validation.invalidEmailFormat") || "Please enter valid email addresses (comma-separated)";
            isValid = false;
          }
        }
      }
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  // Check if form is valid for button enabling/disabling
  const isFormValid = () => {
    // Check required fields
    if (!reportType || !format) {
      return false;
    }

    // Check date range if provided
    if (startDate || endDate) {
      if (!validateDate(startDate) || !validateDate(endDate)) {
        return false;
      }
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (start > today || end > today || start > end) {
          return false;
        }
      }
    }

    // Check recurring schedule fields if enabled
    if (scheduleRecurring) {
      if (!frequency || !deliveryMethod) {
        return false;
      }
      if (deliveryMethod === "Email") {
        if (!recipients || recipients.trim() === "") {
          return false;
        }
        const emailList = recipients.split(",").map(email => email.trim()).filter(email => email);
        const invalidEmails = emailList.filter(email => !validateEmail(email));
        if (invalidEmails.length > 0) {
          return false;
        }
      }
    }

    return true;
  };

  const handleExport = async () => {
    // Validate form before submission
    const validation = validateForm();
    if (!validation.isValid) {
      // Scroll to first error
      const firstErrorField = Object.keys(validation.errors).find(key => validation.errors[key]);
      if (firstErrorField) {
        setTimeout(() => {
          const element = document.querySelector(`[data-field="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const input = element.querySelector('input, select, [role="combobox"]');
            if (input) {
              input.focus();
            }
          }
        }, 100);
      }
      return;
    }

    try {

      setLoading(true);

      // For now, we'll only handle immediate download
      // Scheduled exports can be implemented later
      if (scheduleRecurring && deliveryMethod === "Email") {
        console.info(t("admin.exportReports.info.scheduledExportsComingSoon") || "Scheduled email exports coming soon. Exporting now...");
      }

      // Call the export API
      const result = await adminAPI.exportReport({
        reportType,
        format,
        startDate: startDate || null,
        endDate: endDate || null,
      });

      console.log(t("admin.exportReports.success.exportStarted") || `Report exported successfully! File: ${result.filename}`);
      
      // Reset form if not scheduling
      if (!scheduleRecurring) {
        setStartDate("");
        setEndDate("");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert(error.message || t("admin.exportReports.errors.exportFailed") || "Failed to export report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loader 
        fullScreen={true}
        size="lg" 
        color="oxford-blue" 
        text={t("admin.exportReports.loading.exporting") || "Exporting report..."}
        className="min-h-full bg-[#F5F7FB]"
      />
    );
  }

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-12 sm:px-6 lg:px-6 xl:px-6 2xl:px-[66px]">
      <div className="flex max-w-full lg:max-w-[1120px] mx-auto h-auto lg:h-[1187px] flex-col gap-6">
        {/* Header */}

        {/* Form Card */}
        <div className="rounded-[12px] bg-white shadow-dashboard p-4 sm:p-6 lg:p-8">
          <div>
            <h1 className="font-archivo text-[20px] lg:text-[20px] font-bold leading-[28px] lg:leading-[40px] text-oxford-blue">
              {t("admin.exportReports.hero.title")}
            </h1>
            <p className="font-roboto text-[14px] lg:text-[14px] font-normal leading-[20px] lg:leading-[24px] text-dark-gray">
              {t("admin.exportReports.hero.subtitle")}
            </p>
          </div>
          {/* Report Configuration Section */}
          <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
            {/* Select Report Type */}
            <div>
              <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                {t("admin.exportReports.fields.selectReportType")} <span className="text-[#ED4122]">*</span>
              </label>
              <div className="w-full" data-field="reportType">
                <Dropdown
                  value={reportType}
                  options={[
                    {
                      value: "User Growth",
                      label: t(
                        "admin.exportReports.options.reportType.userGrowth"
                      ),
                    },
                    {
                      value: "Subscription Trends",
                      label: t(
                        "admin.exportReports.options.reportType.subscriptionTrends"
                      ),
                    },
                    {
                      value: "Performance Analytics",
                      label: t(
                        "admin.exportReports.options.reportType.performanceAnalytics"
                      ),
                    },
                  ]}
                  onChange={(value) => {
                    setReportType(value);
                    if (errors.reportType) {
                      setErrors(prev => ({ ...prev, reportType: "" }));
                    }
                  }}
                  placeholder={t("admin.exportReports.fields.selectReportType")}
                  showDefaultOnEmpty={false}
                  className={`w-full lg:w-full ${errors.reportType ? 'border-red-500' : ''}`}
                  height="h-[50px] sm:h-[60px]"
                />
                {errors.reportType && (
                  <p className="mt-1 text-sm text-[#ED4122] font-roboto">{errors.reportType}</p>
                )}
              </div>
            </div>

            {/* Select Format */}
            <div>
              <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                {t("admin.exportReports.fields.selectFormat")} <span className="text-[#ED4122]">*</span>
              </label>
              <div className="w-full" data-field="format">
                <Dropdown
                  value={format}
                  options={[
                    {
                      value: "Excel",
                      label: t("admin.exportReports.options.format.excel"),
                    },
                    {
                      value: "PDF",
                      label: t("admin.exportReports.options.format.pdf"),
                    },
                    {
                      value: "CSV",
                      label: t("admin.exportReports.options.format.csv"),
                    },
                  ]}
                  onChange={(value) => {
                    setFormat(value);
                    if (errors.format) {
                      setErrors(prev => ({ ...prev, format: "" }));
                    }
                  }}
                  placeholder={t("admin.exportReports.fields.selectFormat")}
                  showDefaultOnEmpty={false}
                  className={`w-full lg:w-full ${errors.format ? 'border-red-500' : ''}`}
                  height="h-[50px] sm:h-[60px]"
                />
                {errors.format && (
                  <p className="mt-1 text-sm text-[#ED4122] font-roboto">{errors.format}</p>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                {t("admin.exportReports.fields.dateRange")} <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                <div className="relative w-full" data-field="startDate">
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (errors.startDate) {
                        setErrors(prev => ({ ...prev, startDate: "" }));
                      }
                      // Re-validate end date if it exists
                      if (endDate && e.target.value && new Date(e.target.value) > new Date(endDate)) {
                        setErrors(prev => ({ ...prev, endDate: t("admin.exportReports.validation.invalidDateRange") || "End date must be after start date" }));
                      }
                    }}
                    onBlur={() => validateForm()}
                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                    className={`w-full h-[50px] sm:h-[60px] rounded-[12px] border ${
                      errors.startDate ? 'border-[#ED4122]' : 'border-[rgba(3,39,70,0.2)]'
                    } bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue outline-none cursor-pointer hover:border-[#03274666] transition shadow-input`}
                    placeholder="mm/dd/yyyy"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-[#ED4122] font-roboto">{errors.startDate}</p>
                  )}
                </div>
                <div className="relative w-full" data-field="endDate">
                  <label className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (errors.endDate) {
                        setErrors(prev => ({ ...prev, endDate: "" }));
                      }
                      // Re-validate if start date exists
                      if (startDate && e.target.value && new Date(startDate) > new Date(e.target.value)) {
                        setErrors(prev => ({ ...prev, endDate: t("admin.exportReports.validation.invalidDateRange") || "End date must be after start date" }));
                      }
                    }}
                    onBlur={() => validateForm()}
                    min={startDate || undefined} // Prevent dates before start date
                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                    className={`w-full h-[50px] sm:h-[60px] rounded-[12px] border ${
                      errors.endDate ? 'border-[#ED4122]' : 'border-[rgba(3,39,70,0.2)]'
                    } bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue outline-none cursor-pointer hover:border-[#03274666] transition shadow-input`}
                    placeholder="mm/dd/yyyy"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-[#ED4122] font-roboto">{errors.endDate}</p>
                  )}
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
                {t("admin.exportReports.fields.includeCharts")}
              </label>
            </div>
          </div>

          {/* Schedule Recurring Export Section */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#E5E7EB] space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setScheduleRecurring(!scheduleRecurring);
                  // Clear validation errors for recurring fields when toggled off
                  if (scheduleRecurring) {
                    setErrors(prev => ({
                      ...prev,
                      frequency: "",
                      deliveryMethod: "",
                      recipients: "",
                    }));
                  }
                }}
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
                {t("admin.exportReports.fields.scheduleRecurring")}
              </label>
            </div>

            {scheduleRecurring && (
              <>
                {/* Frequency */}
                <div>
                  <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                    {t("admin.exportReports.fields.frequency")} <span className="text-[#ED4122]">*</span>
                  </label>
                  <div className="w-full" data-field="frequency">
                    <Dropdown
                      value={frequency}
                      options={[
                        {
                          value: "Daily",
                          label: t(
                            "admin.exportReports.options.frequency.daily"
                          ),
                        },
                        {
                          value: "Weekly",
                          label: t(
                            "admin.exportReports.options.frequency.weekly"
                          ),
                        },
                        {
                          value: "Monthly",
                          label: t(
                            "admin.exportReports.options.frequency.monthly"
                          ),
                        },
                      ]}
                      onChange={(value) => {
                        setFrequency(value);
                        if (errors.frequency) {
                          setErrors(prev => ({ ...prev, frequency: "" }));
                        }
                      }}
                      placeholder={t("admin.exportReports.fields.frequency")}
                      showDefaultOnEmpty={false}
                      className={`w-full lg:w-full ${errors.frequency ? 'border-red-500' : ''}`}
                      height="h-[50px] sm:h-[60px]"
                    />
                    {errors.frequency && (
                      <p className="mt-1 text-sm text-[#ED4122] font-roboto">{errors.frequency}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                    {t("admin.exportReports.fields.deliveryMethod")} <span className="text-[#ED4122]">*</span>
                  </label>
                  <div className="w-full" data-field="deliveryMethod">
                    <Dropdown
                      value={deliveryMethod}
                      options={[
                        {
                          value: "Email",
                          label: t(
                            "admin.exportReports.options.deliveryMethod.email"
                          ),
                        },
                        {
                          value: "Download",
                          label: t(
                            "admin.exportReports.options.deliveryMethod.download"
                          ),
                        },
                      ]}
                      onChange={(value) => {
                        setDeliveryMethod(value);
                        if (errors.deliveryMethod) {
                          setErrors(prev => ({ ...prev, deliveryMethod: "" }));
                        }
                        // Clear recipients error if switching away from Email
                        if (value !== "Email" && errors.recipients) {
                          setErrors(prev => ({ ...prev, recipients: "" }));
                        }
                      }}
                      placeholder={t(
                        "admin.exportReports.fields.deliveryMethod"
                      )}
                      showDefaultOnEmpty={false}
                      className={`w-full lg:w-full ${errors.deliveryMethod ? 'border-red-500' : ''}`}
                      height="h-[50px] sm:h-[60px]"
                    />
                    {errors.deliveryMethod && (
                      <p className="mt-1 text-sm text-[#ED4122] font-roboto">{errors.deliveryMethod}</p>
                    )}
                  </div>
                </div>

                {/* Recipients */}
                {deliveryMethod === "Email" && (
                  <div>
                    <label className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue mb-2">
                      {t("admin.exportReports.fields.recipients")} <span className="text-[#ED4122]">*</span>
                      <span className="text-xs text-gray-500 ml-2">(Comma-separated)</span>
                    </label>
                    <div className="w-full" data-field="recipients">
                      <input
                        type="text"
                        value={recipients}
                        onChange={(e) => {
                          setRecipients(e.target.value);
                          if (errors.recipients) {
                            setErrors(prev => ({ ...prev, recipients: "" }));
                          }
                        }}
                        onBlur={() => {
                          if (deliveryMethod === "Email" && recipients) {
                            const emailList = recipients.split(",").map(email => email.trim()).filter(email => email);
                            const invalidEmails = emailList.filter(email => !validateEmail(email));
                            if (invalidEmails.length > 0) {
                              setErrors(prev => ({ 
                                ...prev, 
                                recipients: t("admin.exportReports.validation.invalidEmailFormat") || "Please enter valid email addresses (comma-separated)" 
                              }));
                            }
                          }
                        }}
                        placeholder={t(
                          "admin.exportReports.placeholders.recipients"
                        ) || "email1@example.com, email2@example.com"}
                        className={`w-full h-[50px] sm:h-[60px] rounded-[12px] border ${
                          errors.recipients ? 'border-[#ED4122]' : 'border-[rgba(3,39,70,0.2)]'
                        } bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue outline-none hover:border-[#03274666] transition shadow-input`}
                      />
                      {errors.recipients && (
                        <p className="mt-1 text-sm text-[#ED4122] font-roboto">{errors.recipients}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-4 sm:px-6 py-2.5 sm:py-3 font-roboto text-[14px] sm:text-[16px] font-medium leading-[20px] text-oxford-blue transition hover:bg-[#F9FAFB] w-full sm:w-auto"
            >
              {t("admin.exportReports.buttons.cancel")}
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={!isFormValid() || loading}
              className={`flex items-center justify-center rounded-[8px] px-4 sm:px-6 py-2.5 sm:py-3 font-roboto text-[14px] sm:text-[16px] font-semibold leading-[20px] text-white transition w-full sm:w-auto ${
                !isFormValid() || loading
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-[#ED4122] hover:bg-[#d43a1f] cursor-pointer"
              }`}
            >
              {loading 
                ? t("admin.exportReports.loading.exporting") || "Exporting..." 
                : t("admin.exportReports.buttons.exportReport")
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReportsPage;
