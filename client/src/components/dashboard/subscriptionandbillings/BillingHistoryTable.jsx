import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Table } from '../../common/TableComponent';
import subscriptionAPI from '../../../api/subscription';
import { showErrorToast } from '../../../utils/toastConfig';
import Loader from '../../common/Loader';

const BillingHistoryTable = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [billingHistoryData, setBillingHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define columns for the billing history table
  const billingHistoryColumns = [
    { key: 'invoice', label: t("dashboard.subscriptionBilling.billingHistory.columns.invoice") },
    { key: 'amount', label: t("dashboard.subscriptionBilling.billingHistory.columns.amount") },
    { key: 'date', label: t("dashboard.subscriptionBilling.billingHistory.columns.date") },
    { key: 'status', label: t("dashboard.subscriptionBilling.billingHistory.columns.status") },
    { key: 'actions', label: t("dashboard.subscriptionBilling.billingHistory.columns.actions") }
  ];

  // Fetch billing history on component mount
  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        setLoading(true);
        const response = await subscriptionAPI.getMyBillingHistory();
        
        if (response.success && response.data) {
          // Transform data to include actionType for the table
          const transformedData = response.data.billingHistory.map(item => ({
            ...item,
            actionType: 'download'
          }));
          setBillingHistoryData(transformedData);
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

  if (loading) {
    return (
      <Loader 
        size="md" 
        color="red" 
        className="py-8"
      />
    );
  }

  return (
    <div className="">
      <Table
        items={billingHistoryData}
        columns={billingHistoryColumns}
        page={currentPage}
        pageSize={10}
        total={billingHistoryData.length}
        onPageChange={setCurrentPage}
        onCustomAction={handleDownload}
        emptyMessage={t("dashboard.subscriptionBilling.billingHistory.emptyMessage")}
        showPagination={billingHistoryData.length > 10}
      />
    </div>
  );
};

export default BillingHistoryTable;