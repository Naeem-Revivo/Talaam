
const LoginHistoryTableHeader = ({ columns }) => (
  <thead className="hidden md:table-header-group">
    <tr className="bg-oxford-blue text-center">
      {columns.map((column) => (
        <th
          key={column}
          className="px-6 py-4 text-[16px] font-medium leading-[16px] text-white uppercase"
        >
          {column}
        </th>
      ))}
    </tr>
  </thead>
);

const LoginHistoryTableRow = ({ item, columns }) => {
  const getFieldKey = (columnName) => {
    return columnName.toLowerCase().replace(/ /g, "");
  };

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
      {columns.map((column) => {
        const fieldKey = getFieldKey(column);
        let value = item[fieldKey] || "—";

        // Special rendering for status
        if (fieldKey === 'status') {
          const isSuccess = value.toLowerCase() === 'success';
          const isFailure = value.toLowerCase() === 'failure';
          
          return (
            <td key={column} className="px-6 py-4 text-center">
              <span className={`inline-block px-[12px] py-[5px] rounded-md text-[14px] leading-[100%] font-normal ${
                isSuccess ? 'bg-[#FDF0D5] text-[#ED4122]' :
                isFailure ? 'bg-[#C6D8D3] text-oxford-blue' :
                'bg-[#C6D8D3] text-oxford-blue'
              }`}>
                {value}
              </span>
            </td>
          );
        }

        return (
          <td
            key={column}
            className="px-6 py-4 text-[14px] font-normal leading-[100%] text-center"
          >
            {value}
          </td>
        );
      })}
    </tr>
  );
};

const LoginHistoryMobileCard = ({ item, columns }) => {
  const getFieldKey = (columnName) => {
    return columnName.toLowerCase().replace(/ /g, "");
  };

  return (
    <article className="flex flex-col rounded-[8px] border border-[#E5E7EB] bg-white shadow-sm md:hidden overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-3 text-oxford-blue">
        {columns.map((column) => {
          const fieldKey = getFieldKey(column);
          let value = item[fieldKey] || "—";

          // Skip status field in top section (will show in bottom)
          if (fieldKey === 'status') {
            return null;
          }

          return (
            <div key={column} className="flex items-center gap-2">
              <span className="text-[14px] font-normal text-oxford-blue">{column}:</span>
              <span className="text-[14px] font-normal text-dark-gray">{value}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom section with status only */}
      <div className="flex items-center justify-between border-t border-[#E5E7EB] px-4 py-2.5">
        {/* Status badge */}
        {(() => {
          const statusKey = 'status';
          const statusValue = item[statusKey] || 'Unknown';
          const isSuccess = statusValue.toLowerCase() === 'success';
          const isFailure = statusValue.toLowerCase() === 'failure';
          
          return (
            <div className="flex items-center gap-2 w-full">
              <span className="text-[14px] font-normal text-oxford-blue">Status:</span>
              <span className={`inline-flex items-center px-[12px] py-[5px] rounded-md text-[14px] font-normal ${
                isSuccess ? 'bg-[#FDF0D5] text-[#ED4122]' : 
                isFailure ? 'bg-[#FDF0D5] text-[#ED4122]' : 
                'bg-[#C6D8D3] text-oxford-blue'
              }`}>
                {statusValue}
              </span>
            </div>
          );
        })()}
      </div>
    </article>
  );
};

export const LoginHistoryTable = ({
  items,
  columns,
  emptyMessage = "No login history found",
}) => {
  return (
    <section className="w-full overflow-hidden rounded-[12px] bg-white shadow-dashboard">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse">
          <LoginHistoryTableHeader columns={columns} />
          <tbody>
            {items.length ? (
              items.map((item) => (
                <LoginHistoryTableRow
                  key={item.id}
                  item={item}
                  columns={columns}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-dark-gray"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 p-2 md:hidden">
        {items.length ? (
          items.map((item) => (
            <LoginHistoryMobileCard
              key={item.id}
              item={item}
              columns={columns}
            />
          ))
        ) : (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-dark-gray shadow-empty">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
};