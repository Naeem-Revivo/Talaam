const TableHeader = () => (
    <thead className="hidden md:table-header-group">
        <tr className="bg-[#032746] text-center">
            {["Subject Name", "Description", "Created By", "Date", "Actions"].map(
                (column) => (
                    <th
                        key={column}
                        className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white"
                    >
                        {column}
                    </th>
                )
            )}
        </tr>
    </thead>
);

// Table Row
const TableRow = ({ subject, onView, onEdit }) => {
    return (
        <tr className="hidden border-b border-[#E5E7EB] bg-white text-[#032746] last:border-none md:table-row">
            <td className="px-6 py-4 text-[14px] font-roboto font-semibold leading-[100%] text-center">
                {subject.name}
            </td>
            <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-[#032746] text-center">
                {subject.description}
            </td>
            <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-[#032746] text-center">
                {subject.createdBy}
            </td>
            <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-[#032746] text-center">
                {subject.dateCreated}
            </td>
            <td className="px-6 py-4 flex justify-center">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => onView?.(subject)}
                        className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
                        aria-label={`View ${subject.name}`}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.2961 7.00203C13.1105 7.00203 12.9326 7.07576 12.8013 7.20699C12.6701 7.33823 12.5963 7.51623 12.5963 7.70183V11.9006C12.5963 12.0862 12.5226 12.2642 12.3914 12.3954C12.2601 12.5267 12.0821 12.6004 11.8966 12.6004H2.09939C1.91379 12.6004 1.7358 12.5267 1.60456 12.3954C1.47332 12.2642 1.39959 12.0862 1.39959 11.9006V2.10345C1.39959 1.91785 1.47332 1.73986 1.60456 1.60862C1.7358 1.47738 1.91379 1.40365 2.09939 1.40365H6.29817C6.48377 1.40365 6.66177 1.32992 6.793 1.19869C6.92424 1.06745 6.99797 0.889453 6.99797 0.703855C6.99797 0.518257 6.92424 0.340261 6.793 0.209023C6.66177 0.0777861 6.48377 0.00405766 6.29817 0.00405766H2.09939C1.5426 0.00405766 1.00861 0.225243 0.614898 0.618955C0.221185 1.01267 0 1.54666 0 2.10345V11.9006C0 12.4574 0.221185 12.9914 0.614898 13.3851C1.00861 13.7788 1.5426 14 2.09939 14H11.8966C12.4533 14 12.9873 13.7788 13.381 13.3851C13.7748 12.9914 13.9959 12.4574 13.9959 11.9006V7.70183C13.9959 7.51623 13.9222 7.33823 13.791 7.20699C13.6597 7.07576 13.4817 7.00203 13.2961 7.00203ZM2.79919 7.53387V10.501C2.79919 10.6866 2.87292 10.8646 3.00415 10.9958C3.13539 11.1271 3.31339 11.2008 3.49899 11.2008H6.46613C6.55822 11.2013 6.64952 11.1837 6.73478 11.1489C6.82004 11.114 6.89759 11.0627 6.96298 10.9979L11.8056 6.14828L13.793 4.20284C13.8586 4.13778 13.9107 4.06039 13.9462 3.97511C13.9817 3.88983 14 3.79837 14 3.70598C14 3.6136 13.9817 3.52214 13.9462 3.43686C13.9107 3.35158 13.8586 3.27418 13.793 3.20913L10.8259 0.206999C10.7608 0.141408 10.6834 0.089347 10.5981 0.0538192C10.5129 0.0182915 10.4214 0 10.329 0C10.2366 0 10.1452 0.0182915 10.0599 0.0538192C9.9746 0.089347 9.8972 0.141408 9.83215 0.206999L7.85872 2.18742L3.00213 7.03702C2.93727 7.10241 2.88596 7.17996 2.85113 7.26522C2.81631 7.35048 2.79866 7.44178 2.79919 7.53387ZM10.329 1.69057L12.3094 3.67099L11.3157 4.66471L9.33529 2.68428L10.329 1.69057ZM4.19878 7.82079L8.34858 3.67099L10.329 5.65142L6.17921 9.80122H4.19878V7.82079Z" fill="#032746" />
                        </svg>

                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit?.(subject)}
                        className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
                        aria-label={`Edit ${subject.name}`}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.4615 2.15385H10.9064C10.2595 2.15385 10.2322 2.072 10.0549 1.54072L9.90984 1.10492C9.68943 0.444411 9.07416 0 8.37775 0H5.62225C4.92584 0 4.30985 0.443693 4.09015 1.10492L3.94513 1.54072C3.7678 2.07272 3.74051 2.15385 3.09364 2.15385H0.538462C0.241231 2.15385 0 2.39508 0 2.69231C0 2.98954 0.241231 3.23077 0.538462 3.23077H1.47036L2.02103 11.4865C2.12728 13.0839 3.10657 14 4.70759 14H9.29313C10.8934 14 11.8727 13.0839 11.9797 11.4865L12.5304 3.23077H13.4615C13.7588 3.23077 14 2.98954 14 2.69231C14 2.39508 13.7588 2.15385 13.4615 2.15385ZM5.11179 1.44523C5.18574 1.22482 5.39035 1.07692 5.62225 1.07692H8.37775C8.60965 1.07692 8.81498 1.22482 8.88821 1.44523L9.03323 1.88102C9.06482 1.97507 9.09641 2.06626 9.13087 2.15385H4.86769C4.90215 2.06554 4.93447 1.97436 4.96606 1.88102L5.11179 1.44523ZM10.9042 11.4147C10.836 12.4435 10.3234 12.9231 9.29241 12.9231H4.70687C3.6759 12.9231 3.164 12.4442 3.09507 11.4147L2.54944 3.23077H3.09292C3.18267 3.23077 3.25733 3.22144 3.33775 3.2157C3.36216 3.21929 3.38441 3.23077 3.40954 3.23077H10.589C10.6149 3.23077 10.6364 3.21929 10.6608 3.2157C10.7412 3.22144 10.8159 3.23077 10.9056 3.23077H11.4491L10.9042 11.4147ZM8.97436 6.28205V9.87179C8.97436 10.169 8.73313 10.4103 8.4359 10.4103C8.13867 10.4103 7.89744 10.169 7.89744 9.87179V6.28205C7.89744 5.98482 8.13867 5.74359 8.4359 5.74359C8.73313 5.74359 8.97436 5.98482 8.97436 6.28205ZM6.10256 6.28205V9.87179C6.10256 10.169 5.86133 10.4103 5.5641 10.4103C5.26687 10.4103 5.02564 10.169 5.02564 9.87179V6.28205C5.02564 5.98482 5.26687 5.74359 5.5641 5.74359C5.86133 5.74359 6.10256 5.98482 6.10256 6.28205Z" fill="#032746" />
                        </svg>

                    </button>
                </div>
            </td>
        </tr>
    );
};

// Mobile Card
const MobileCard = ({ subject, onView, onEdit }) => {
    return (
        <article className="flex flex-col gap-4 rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_6px_24px_rgba(0,0,0,0.05)] md:hidden">
            <div className="flex flex-col gap-3 text-[#032746]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[16px] font-archivo font-semibold leading-[20px]">{subject.name}</p>
                        <p className="mt-1 text-[14px] font-roboto text-[#6B7280]">{subject.description}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 text-[14px] font-roboto text-[#1F2937]">
                    <p><span className="font-semibold">Created By:</span> {subject.createdBy}</p>
                    <p><span className="font-semibold">Date:</span> {subject.dateCreated}</p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1 border-t border-[#E5E7EB]">
                <button
                    type="button"
                    onClick={() => onView?.(subject)}
                    className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
                    aria-label={`View ${subject.name}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1 1 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5s8.577 3.01 9.964 7.178a1 1 0 0 1 0 .644C20.577 16.49 16.64 19.5 12 19.5s-8.577-3.01-9.964-7.178Z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => onEdit?.(subject)}
                    className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
                    aria-label={`Edit ${subject.name}`}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.3967 6.00174C11.2376 6.00174 11.085 6.06493 10.9726 6.17742C10.8601 6.28991 10.7969 6.44248 10.7969 6.60157V10.2005C10.7969 10.3596 10.7337 10.5122 10.6212 10.6247C10.5087 10.7372 10.3561 10.8003 10.197 10.8003H1.79948C1.64039 10.8003 1.48783 10.7372 1.37534 10.6247C1.26285 10.5122 1.19965 10.3596 1.19965 10.2005V1.80296C1.19965 1.64387 1.26285 1.4913 1.37534 1.37882C1.48783 1.26633 1.64039 1.20313 1.79948 1.20313H5.39843C5.55752 1.20313 5.71009 1.13993 5.82258 1.02745C5.93507 0.914956 5.99826 0.762388 5.99826 0.603304C5.99826 0.44422 5.93507 0.291652 5.82258 0.179163C5.71009 0.0666738 5.55752 0.003478 5.39843 0.003478H1.79948C1.32223 0.003478 0.864523 0.193065 0.527055 0.530533C0.189587 0.868001 0 1.3257 0 1.80296V10.2005C0 10.6778 0.189587 11.1355 0.527055 11.4729C0.864523 11.8104 1.32223 12 1.79948 12H10.197C10.6743 12 11.132 11.8104 11.4695 11.4729C11.8069 11.1355 11.9965 10.6778 11.9965 10.2005V6.60157C11.9965 6.44248 11.9333 6.28991 11.8208 6.17742C11.7083 6.06493 11.5558 6.00174 11.3967 6.00174ZM2.3993 6.45761V9.00087C2.3993 9.15995 2.4625 9.31252 2.57499 9.42501C2.68748 9.5375 2.84005 9.6007 2.99913 9.6007H5.54239C5.62133 9.60115 5.69959 9.58602 5.77267 9.55617C5.84575 9.52632 5.91222 9.48234 5.96827 9.42675L10.1191 5.26995L11.8226 3.60243C11.8788 3.54667 11.9234 3.48033 11.9539 3.40724C11.9843 3.33414 12 3.25574 12 3.17656C12 3.09737 11.9843 3.01897 11.9539 2.94588C11.9234 2.87278 11.8788 2.80644 11.8226 2.75068L9.27931 0.177428C9.22355 0.121207 9.15721 0.0765832 9.08411 0.0461308C9.01102 0.0156784 8.93262 0 8.85343 0C8.77425 0 8.69585 0.0156784 8.62275 0.0461308C8.54966 0.0765832 8.48332 0.121207 8.42756 0.177428L6.73605 1.87494L2.57325 6.03173C2.51766 6.08778 2.47368 6.15425 2.44383 6.22733C2.41398 6.30041 2.39885 6.37867 2.3993 6.45761ZM8.85343 1.44906L10.5509 3.14657L9.69919 3.99832L8.00168 2.30081L8.85343 1.44906ZM3.59896 6.70354L7.15593 3.14657L8.85343 4.84407L5.29646 8.40104H3.59896V6.70354Z"
                            fill="#032746"
                        />
                    </svg>
                </button>
            </div>
        </article>
    );
};

// Pagination Component
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

    const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1);

    return (
        <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-[#032746] md:flex-row md:items-center md:justify-between md:bg-[#032746] md:px-6 md:text-white">
            <p className="text-[12px] font-roboto font-medium leading-[18px] tracking-[3%]">
                Showing {firstItem} to {lastItem} of {total} results
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={page === 1}
                    className={`flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${page === 1
                        ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
                        : "border-[#032746] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-white"
                        }`}
                >
                    Previous
                </button>
                {pages.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        type="button"
                        onClick={() => onPageChange?.(pageNumber)}
                        className={`flex h-8 w-8 items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${pageNumber === page
                            ? "border-[#ED4122] bg-[#ED4122] text-white"
                            : "border-[#E5E7EB] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-[#032746]"
                            }`}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={page === safeTotalPages}
                    className={`flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${page === safeTotalPages
                        ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
                        : "border-[#032746] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-white"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

// Classification Table Component
const ClassificationTable = ({
    subjects,
    page,
    pageSize,
    total,
    onPageChange,
    onView,
    onEdit,
}) => {
    return (
        <section className="w-full max-w-[1120px] overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_6px_54px_rgba(0,0,0,0.05)] md:min-h-[348px]">
            <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full border-collapse">
                    <TableHeader />
                    <tbody>
                        {subjects.length ? (
                            subjects.map((subject) => (
                                <TableRow
                                    key={subject.id}
                                    subject={subject}
                                    onView={onView}
                                    onEdit={onEdit}
                                />
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-10 text-center text-sm text-[#6B7280]"
                                >
                                    No subjects match the current filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col gap-4 p-2 md:hidden">
                {subjects.length ? (
                    subjects.map((subject) => (
                        <MobileCard key={subject.id} subject={subject} onView={onView} onEdit={onEdit} />
                    ))
                ) : (
                    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-[#6B7280] shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
                        No subjects match the current filters.
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

export default ClassificationTable;