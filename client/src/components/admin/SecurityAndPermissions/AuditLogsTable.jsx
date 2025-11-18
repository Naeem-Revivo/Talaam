const TableHeader = ({ columns }) => (
    <thead className="hidden md:table-header-group">
        <tr className="bg-oxford-blue text-center">
            {columns.map((column) => (
                <th
                    key={column}
                    className="px-6 py-4 text-[16px] leading-[16px] font-medium text-white uppercase tracking-wide whitespace-nowrap"
                >
                    {column}
                </th>
            ))}
        </tr>
    </thead>
);

const TableRow = ({ item, columns, onView }) => {
    const getFieldKey = (columnName) => {
        return columnName.toLowerCase().replace(/ /g, "").replace(/\//g, "");
    };

    return (
        <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row hover:bg-[#F9FAFB] transition-colors">
            {columns.slice(0, -1).map((column) => {
                const fieldKey = getFieldKey(column);
                let value = item[fieldKey] || "—";

                console.log(fieldKey, "field key")

                return (
                    <td
                        key={column}
                        className={`px-6 py-4 font-normal leading-[100%] font-roboto text-center  ${fieldKey === "timestamp" ? "text-[#6B7280] text-[12px]" : "text-blue-dark text-[14px]"}`}
                    >
                        {value}
                    </td>
                );
            })}
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => onView?.(item)}
                        className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
                        aria-label="View details"
                    >
                        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.6301 4.17854C12.6875 2.61796 10.5717 0 7 0C3.42834 0 1.31254 2.61796 0.36991 4.17854C-0.123303 4.99325 -0.123303 6.00604 0.36991 6.82146C1.31254 8.38204 3.42834 11 7 11C10.5717 11 12.6875 8.38204 13.6301 6.82146C14.1233 6.00604 14.1233 4.99396 13.6301 4.17854ZM12.706 6.275C11.8804 7.64184 10.0404 9.93548 7 9.93548C3.9596 9.93548 2.11957 7.64255 1.29395 6.275C1.00535 5.79667 1.00535 5.20263 1.29395 4.72431C2.11957 3.35747 3.9596 1.06382 7 1.06382C10.0404 1.06382 11.8804 3.35676 12.706 4.72431C12.9954 5.20334 12.9954 5.79667 12.706 6.275ZM7 2.48387C5.31719 2.48387 3.94883 3.83723 3.94883 5.5C3.94883 7.16277 5.31719 8.51613 7 8.51613C8.68281 8.51613 10.0512 7.16277 10.0512 5.5C10.0512 3.83723 8.68281 2.48387 7 2.48387ZM7 7.45161C5.91091 7.45161 5.02571 6.57658 5.02571 5.5C5.02571 4.42342 5.91091 3.54839 7 3.54839C8.08909 3.54839 8.97429 4.42342 8.97429 5.5C8.97429 6.57658 8.08909 7.45161 7 7.45161Z" fill="#25314C" />
                        </svg>

                    </button>
                </div>
            </td>
        </tr>
    );
};

const MobileCard = ({ item, columns, onView }) => {
    const displayColumns = columns.slice(0, -1);

    const getFieldKey = (columnName) => {
        return columnName.toLowerCase().replace(/ /g, "").replace(/\//g, "");
    };

    return (
        <article className="flex flex-col rounded-[8px] border border-[#E5E7EB] bg-white shadow-sm md:hidden overflow-hidden">
            <div className="flex flex-col gap-2 px-4 py-3 text-oxford-blue">
                {displayColumns.map((column) => {
                    const fieldKey = getFieldKey(column);
                    let value = item[fieldKey] || "—";

                    return (
                        <div key={column} className="flex items-start gap-2">
                            <span className="text-[13px] font-semibold text-oxford-blue min-w-[120px]">{column}:</span>
                            <span className="text-[13px] font-normal text-dark-gray">{value}</span>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-end border-t border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5">
                <button
                    type="button"
                    onClick={() => onView?.(item)}
                    className="rounded-full p-1.5 text-oxford-blue transition hover:bg-white"
                    aria-label="View details"
                >
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6301 4.17854C12.6875 2.61796 10.5717 0 7 0C3.42834 0 1.31254 2.61796 0.36991 4.17854C-0.123303 4.99325 -0.123303 6.00604 0.36991 6.82146C1.31254 8.38204 3.42834 11 7 11C10.5717 11 12.6875 8.38204 13.6301 6.82146C14.1233 6.00604 14.1233 4.99396 13.6301 4.17854ZM12.706 6.275C11.8804 7.64184 10.0404 9.93548 7 9.93548C3.9596 9.93548 2.11957 7.64255 1.29395 6.275C1.00535 5.79667 1.00535 5.20263 1.29395 4.72431C2.11957 3.35747 3.9596 1.06382 7 1.06382C10.0404 1.06382 11.8804 3.35676 12.706 4.72431C12.9954 5.20334 12.9954 5.79667 12.706 6.275ZM7 2.48387C5.31719 2.48387 3.94883 3.83723 3.94883 5.5C3.94883 7.16277 5.31719 8.51613 7 8.51613C8.68281 8.51613 10.0512 7.16277 10.0512 5.5C10.0512 3.83723 8.68281 2.48387 7 2.48387ZM7 7.45161C5.91091 7.45161 5.02571 6.57658 5.02571 5.5C5.02571 4.42342 5.91091 3.54839 7 3.54839C8.08909 3.54839 8.97429 4.42342 8.97429 5.5C8.97429 6.57658 8.08909 7.45161 7 7.45161Z" fill="#25314C" />
                    </svg>

                </button>
            </div>
        </article>
    );
};

const Pagination = ({ page, pageSize, total, onPageChange }) => {
    const totalPages = Math.ceil(total / pageSize);
    const safeTotalPages = Math.max(totalPages, 1);
    const firstItem = total ? (page - 1) * pageSize + 1 : 0;
    const lastItem = total ? Math.min(page * pageSize, total) : 0;

    const handlePrev = () => {
        if (page > 1) onPageChange?.(page - 1);
    };

    const handleNext = () => {
        if (page < safeTotalPages) onPageChange?.(page + 1);
    };

    const getPageNumbers = () => {
        const maxVisible = 5;

        if (safeTotalPages <= maxVisible) {
            return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
        }

        if (page <= 3) {
            return [1, 2, 3, 4, 5];
        }

        if (page >= safeTotalPages - 2) {
            return Array.from({ length: 5 }, (_, i) => safeTotalPages - 4 + i);
        }

        return [page - 2, page - 1, page, page + 1, page + 2];
    };

    const pages = getPageNumbers();

    return (
        <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-oxford-blue md:flex-row md:items-center md:justify-between md:bg-oxford-blue md:px-6 md:text-white">
            <p className="text-[12px] font-medium leading-[18px] font-roboto">
                Showing {firstItem} to {lastItem} of {total} results
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={page === 1}
                    className={`flex h-[27px] w-[78px] items-center justify-center rounded border text-[14px] font-medium leading-[16px] transition-colors ${page === 1
                        ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
                        : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
                        }`}
                >
                    Previous
                </button>
                {pages.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        type="button"
                        onClick={() => onPageChange?.(pageNumber)}
                        className={`flex h-[27px] w-8 items-center justify-center rounded border text-[14px] font-medium leading-[16px] transition-colors ${pageNumber === page
                            ? "border-[#ED4122] bg-[#ED4122] text-white"
                            : "border-[#E5E7EB] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-[#032746]"
                            }`}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={page === safeTotalPages}
                    className={`flex h-[27px] w-[78px] items-center justify-center rounded border text-[14px] font-medium leading-[16px] transition-colors ${page === safeTotalPages
                        ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
                        : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export const DataTable = ({
    items,
    columns,
    page,
    pageSize,
    total,
    onPageChange,
    onView,
    emptyMessage,
}) => {
    return (
        <section className="w-full flex flex-col justify-between overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard md:min-h-[348px]">
            <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full border-collapse">
                    <TableHeader columns={columns} />
                    <tbody>
                        {items.length ? (
                            items.map((item) => (
                                <TableRow
                                    key={item.id}
                                    item={item}
                                    columns={columns}
                                    onView={onView}
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
                        <MobileCard
                            key={item.id}
                            item={item}
                            columns={columns}
                            onView={onView}
                        />
                    ))
                ) : (
                    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-dark-gray shadow-empty">
                        {emptyMessage}
                    </div>
                )}
            </div>
            <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={onPageChange}
            />
        </section>
    );
};