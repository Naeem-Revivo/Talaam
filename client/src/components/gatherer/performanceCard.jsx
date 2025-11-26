export const PerformanceCard = ({ data, daysRange = 50 }) => {
  // Default configuration for common performance metrics
  const defaultFields = [
    { key: 'acceptanceRate', label: 'Acceptance rate', format: 'percentage' },
    { key: 'rejectionRate', label: 'Rejection rate', format: 'percentage' }
  ];

  // Determine which fields to display based on available data
  const getFieldsToDisplay = () => {
    // If custom fields are provided in data, use those
    if (data.fields) {
      return data.fields;
    }
    
    // Otherwise, use default fields that exist in the data
    return defaultFields.filter(field => data[field.key] !== undefined);
  };

  const fields = getFieldsToDisplay();
  
  // Format the value based on field configuration
  const formatValue = (value, format) => {
    if (format === 'percentage') {
      return `${value}%`;
    }
    return value;
  };

  // Determine grid columns based on number of fields
  const getGridClass = () => {
    const count = fields.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    return 'grid-cols-2'; // fallback
  };

  return (
    <div className="rounded-[14px] shadow-[0px_4px_50px_0px_#0327461F] border border-[#03274633] overflow-hidden w-full">
      <div className="border-b border-[#CDD4DA] px-8 py-4">
        <h2 className="text-[20px] leading-[100%] font-archivo font-bold text-blue-dark">
          Your Performance
        </h2>
        <p className="text-[12px] leading-5 text-[#6B7280] font-normal font-roboto mt-1">
          Based on the last {data.daysRange || daysRange} days.
        </p>
      </div>

      <div className="p-8">
        <div className={`grid ${getGridClass()} gap-6`}>
          {fields.map((field) => (
            <div key={field.key}>
              <p className="text-[14px] leading-5 font-normal font-roboto text-[#6B7280] mb-2">
                {field.label}
              </p>
              <p className="text-[24px] leading-7 font-semibold font-archivo text-blue-dark">
                {formatValue(data[field.key], field.format)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};