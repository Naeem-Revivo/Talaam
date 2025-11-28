import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Table } from '../../common/TableComponent';

const BillingHistoryTable = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);

  // Define columns for the billing history table
  const billingHistoryColumns = [
    { key: 'invoice', label: t("dashboard.subscriptionBilling.billingHistory.columns.invoice") },
    { key: 'amount', label: t("dashboard.subscriptionBilling.billingHistory.columns.amount") },
    { key: 'date', label: t("dashboard.subscriptionBilling.billingHistory.columns.date") },
    { key: 'status', label: t("dashboard.subscriptionBilling.billingHistory.columns.status") },
    { key: 'actions', label: t("dashboard.subscriptionBilling.billingHistory.columns.actions") }
  ];

  // Sample data matching the image with updated status
  const billingHistoryData = [
    {
      id: 1,
      invoice: '#NV - 0091',
      amount: '$24.99',
      date: '12 Jan 2025',
      status: "Paid",
      actionType: 'download'
    },
    {
      id: 2,
      invoice: '#NV - 0092',
      amount: '$24.99',
      date: '12 Jan 2025',
      status: "Paid",
      actionType: 'download'
    },
    {
      id: 3,
      invoice: '#NV - 0093',
      amount: '$24.99',
      date: '12 Jan 2025',
      status: "Failed",
      actionType: 'download'
    },
    {
      id: 4,
      invoice: '#NV - 0094',
      amount: '$24.99',
      date: '12 Jan 2025',
      status: "Failed",
      actionType: 'download'
    }
  ];

  // Handler for download action
  const handleDownload = (item) => {
    console.log('Download invoice:', item);
    // Add your download logic here
  };

  return (
    <div className="">
      <Table
        items={billingHistoryData}
        columns={billingHistoryColumns}
        page={currentPage}
        pageSize={10}
        total={4}
        onPageChange={setCurrentPage}
        onCustomAction={handleDownload}
        emptyMessage={t("dashboard.subscriptionBilling.billingHistory.emptyMessage")}
        showPagination={false}
      />
    </div>
  );
};

export default BillingHistoryTable;