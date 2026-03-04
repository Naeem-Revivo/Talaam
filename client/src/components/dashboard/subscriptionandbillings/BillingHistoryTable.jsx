import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import subscriptionAPI from '../../../api/subscription';
import { showErrorToast } from '../../../utils/toastConfig';
import Loader from '../../common/Loader';
import { invoice } from '../../../assets/svg';

const BillingHistoryTable = () => {
  const { t } = useLanguage();
  const [billingHistoryData, setBillingHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch billing history on component mount
  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        setLoading(true);
        const response = await subscriptionAPI.getMyBillingHistory();

        if (response.success && response.data) {
          setBillingHistoryData(response.data.billingHistory || []);
        }
      } catch (error) {
        console.error('Error fetching billing history:', error);
        showErrorToast(error.message || 'Failed to fetch billing history');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingHistory();
  }, []);

  // Handler for download action
  const handleDownload = (item) => {
    console.log('Download invoice:', item);
    // TODO: Add invoice download logic here
    // You can use the transactionId or subscription id to generate/download invoice
  };

  // Get status badge styling - matching image with white text
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';

    if (statusLower === 'paid') {
      return {
        bg: 'bg-[#DCFCE7]',
        text: 'text-[#16A34A]',
        label: t("dashboard.subscriptionBilling.billingHistory.status.paid") || "Paid"
      };
    } else if (statusLower === 'failed') {
      return {
        bg: 'bg-[#FEE2E2]',
        text: 'text-[#DC2626]',
        label: t("dashboard.subscriptionBilling.billingHistory.status.failed") || "Failed"
      };
    } else if (statusLower === 'refunded') {
      return {
        bg: 'bg-[#F59E0B]',
        text: 'text-white',
        label: t("dashboard.subscriptionBilling.billingHistory.status.refunded") || "Refunded"
      };
    } else {
      return {
        bg: 'bg-[#FEF9C3]',
        text: 'text-[#854D0E]',
        label: t("dashboard.subscriptionBilling.billingHistory.status.pending") || status || 'Pending'
      };
    }
  };

  // Format invoice number (remove # if present, add INV- prefix)
  const formatInvoice = (invoice) => {
    if (!invoice) return 'INV-0000';
    // Remove # if present and replace NV- with INV-
    return invoice.replace('#', '').replace('NV-', 'INV-');
  };

  if (loading) {
    return (
      <div className="bg-[#F5F7FB] rounded-[12px] p-8">
        <Loader
          size="md"
          color="oxford-blue"
          className="py-8"
        />
      </div>
    );
  }

  return (
    <div className="bg-[#F5F7FB] border-2 border-[#E5E5E5] rounded-[12px] overflow-hidden shadow-sm">
      <div className="bg-white rounded-[12px] overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="max-h-[362px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#E6EEF3] border-b border-[#E5E5E5]">
                  <th className="px-6 py-4 text-left text-[14px] leading-[21px] font-bold font-roboto text-[#475569] w-[20%] bg-[#E6EEF3]">
                    {t("dashboard.subscriptionBilling.billingHistory.columns.invoice") || "Invoice"}
                  </th>
                  <th className="px-6 py-4 text-left text-[14px] leading-[21px] font-bold font-roboto text-[#475569] w-[20%] bg-[#E6EEF3]">
                    {t("dashboard.subscriptionBilling.billingHistory.columns.amount") || "Amount"}
                  </th>
                  <th className="px-6 py-4 text-left text-[14px] leading-[21px] font-bold font-roboto text-[#475569] w-[20%] bg-[#E6EEF3]">
                    {t("dashboard.subscriptionBilling.billingHistory.columns.date") || "Date"}
                  </th>
                  <th className="px-6 py-4 text-left text-[14px] leading-[21px] font-bold font-roboto text-[#475569] w-[20%] bg-[#E6EEF3]">
                    {t("dashboard.subscriptionBilling.billingHistory.columns.status") || "Status"}
                  </th>
                  <th className="px-6 py-4 text-left text-[14px] leading-[21px] font-bold font-roboto text-[#475569] w-[20%] bg-[#E6EEF3]">
                    {t("dashboard.subscriptionBilling.billingHistory.columns.actions") || "Action"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {billingHistoryData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <p className="text-[16px] font-normal font-roboto text-[#6B7280]">
                        {t("dashboard.subscriptionBilling.billingHistory.emptyMessage") || "No billing history available"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  billingHistoryData.map((item, index) => {
                    const statusBadge = getStatusBadge(item.status);
                    return (
                      <tr
                        key={item.id || index}
                        className="bg-white border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors last:border-b-0"
                      >
                        {/* Invoice */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <img src={invoice} alt="invoice" className="w-10 h-10" />
                            <span className="text-base font-medium font-roboto text-[#171717]">
                              {formatInvoice(item.invoice)}
                            </span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <span className="text-base font-medium font-roboto text-[#171717]">
                            {item.amount || 'N/A'}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <span className="text-base font-normal font-roboto text-[#737373]">
                            {item.date || 'N/A'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-block px-[10px] py-[5px] rounded-[13px] text-[12px] leading-[100%] font-medium font-roboto ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDownload(item)}
                            className="text-oxford-blue hover:text-[#ED4122] transition-colors p-1"
                            aria-label="Download invoice"
                          >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M5.25 7.5L9 11.25L12.75 7.5" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M9 11.25V2.25" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-[#E5E7EB]">
          {billingHistoryData.map((item, index) => {
            const statusBadge = getStatusBadge(item.status);
            return (
              <div
                key={item.id || index}
                className="p-4 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.6667 2.5H3.33333C2.41286 2.5 1.66667 3.24619 1.66667 4.16667V15.8333C1.66667 16.7538 2.41286 17.5 3.33333 17.5H16.6667C17.5871 17.5 18.3333 16.7538 18.3333 15.8333V4.16667C18.3333 3.24619 17.5871 2.5 16.6667 2.5Z"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[14px] font-medium font-roboto text-oxford-blue">
                      {formatInvoice(item.invoice)}
                    </span>
                  </div>
                  <span className={`px-[10px] py-[5px] rounded-[13px] text-[12px] leading-[100%] font-medium font-roboto ${statusBadge.bg} ${statusBadge.text}`}>
                    {statusBadge.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px] font-normal font-roboto text-oxford-blue mb-2">
                  <span>{t("dashboard.subscriptionBilling.billingHistory.columns.amount") || "Amount"}: {item.amount || 'N/A'}</span>
                  <span>{item.date || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <button
                    onClick={() => handleDownload(item)}
                    className="text-oxford-blue hover:text-[#ED4122] transition-colors"
                    aria-label="Download invoice"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M5.25 7.5L9 11.25L12.75 7.5" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M9 11.25V2.25" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BillingHistoryTable;