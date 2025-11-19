import { useLanguage } from "../../../context/LanguageContext";

const TableHeader = ({ columns }) => (
    <thead className="hidden md:table-header-group">
        <tr className="bg-oxford-blue text-center">
            {columns.map((column) => (
                <th
                    key={column.key}
                    className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white"
                >
                    {column.label}
                </th>
            ))}
        </tr>
    </thead>
);

// Table Row
const TableRow = ({ item, columns, onView, onEdit, t }) => {
    // Get the field key from column name (e.g., "Created By" -> "createdby")
    const getFieldKey = (columnName) => {
        const key = columnName.toLowerCase().replace(/ /g, "");
        // Map specific column names to data fields
        if (key === "subjectname" || key === "topicname" || key === "subtopicname" || key === "conceptname") {
            return "name";
        }
        return key;
    };

    return (
        <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
            {columns.slice(0, -1).map((column) => {
                const value = item[column.key] || "—";

                return (
                    <td
                        key={column.key}
                        className={`px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center`}
                    >
                        {value}
                    </td>
                );
            })}
            <td className="px-6 py-4 flex justify-center">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => onView?.(item)}
                        className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
                        aria-label={t('admin.classificationManagement.table.ariaLabels.view').replace('{{name}}', item.name)}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.2961 7.00203C13.1105 7.00203 12.9326 7.07576 12.8013 7.20699C12.6701 7.33823 12.5963 7.51623 12.5963 7.70183V11.9006C12.5963 12.0862 12.5226 12.2642 12.3914 12.3954C12.2601 12.5267 12.0821 12.6004 11.8966 12.6004H2.09939C1.91379 12.6004 1.7358 12.5267 1.60456 12.3954C1.47332 12.2642 1.39959 12.0862 1.39959 11.9006V2.10345C1.39959 1.91785 1.47332 1.73986 1.60456 1.60862C1.7358 1.47738 1.91379 1.40365 2.09939 1.40365H6.29817C6.48377 1.40365 6.66177 1.32992 6.793 1.19869C6.92424 1.06745 6.99797 0.889453 6.99797 0.703855C6.99797 0.518257 6.92424 0.340261 6.793 0.209023C6.66177 0.0777861 6.48377 0.00405766 6.29817 0.00405766H2.09939C1.5426 0.00405766 1.00861 0.225243 0.614898 0.618955C0.221185 1.01267 0 1.54666 0 2.10345V11.9006C0 12.4574 0.221185 12.9914 0.614898 13.3851C1.00861 13.7788 1.5426 14 2.09939 14H11.8966C12.4533 14 12.9873 13.7788 13.381 13.3851C13.7748 12.9914 13.9959 12.4574 13.9959 11.9006V7.70183C13.9959 7.51623 13.9222 7.33823 13.791 7.20699C13.6597 7.07576 13.4817 7.00203 13.2961 7.00203ZM2.79919 7.53387V10.501C2.79919 10.6866 2.87292 10.8646 3.00415 10.9958C3.13539 11.1271 3.31339 11.2008 3.49899 11.2008H6.46613C6.55822 11.2013 6.64952 11.1837 6.73478 11.1489C6.82004 11.114 6.89759 11.0627 6.96298 10.9979L11.8056 6.14828L13.793 4.20284C13.8586 4.13778 13.9107 4.06039 13.9462 3.97511C13.9817 3.88983 14 3.79837 14 3.70598C14 3.6136 13.9817 3.52214 13.9462 3.43686C13.9107 3.35158 13.8586 3.27418 13.793 3.20913L10.8259 0.206999C10.7608 0.141408 10.6834 0.089347 10.5981 0.0538192C10.5129 0.0182915 10.4214 0 10.329 0C10.2366 0 10.1452 0.0182915 10.0599 0.0538192C9.9746 0.089347 9.8972 0.141408 9.83215 0.206999L7.85872 2.18742L3.00213 7.03702C2.93727 7.10241 2.88596 7.17996 2.85113 7.26522C2.81631 7.35048 2.79866 7.44178 2.79919 7.53387ZM10.329 1.69057L12.3094 3.67099L11.3157 4.66471L9.33529 2.68428L10.329 1.69057ZM4.19878 7.82079L8.34858 3.67099L10.329 5.65142L6.17921 9.80122H4.19878V7.82079Z" fill="#032746" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit?.(item)}
                        className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
                        aria-label={t('admin.classificationManagement.table.ariaLabels.edit').replace('{{name}}', item.name)}
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

const BookIcon = ({ size = 14, color = "#032746", className = "" }) => (
    <svg width="12" height="15" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.4571 0H2.57143C0.913371 0 0 0.956308 0 2.69231V11.3077C0 12.9181 1.03337 14 2.57143 14H10.4571C11.3074 14 12 13.2756 12 12.3846V8.07692V6.28205V1.61538C12 0.72441 11.3074 0 10.4571 0ZM10.9714 1.61538V6.28205V8.07692C10.9714 8.37415 10.7403 8.61539 10.4571 8.61539H4.45714V1.07692H10.4571C10.7403 1.07692 10.9714 1.31815 10.9714 1.61538ZM2.57143 1.07692H3.42857V8.61539H2.57143C1.96731 8.61539 1.4448 8.78695 1.02857 9.08777V2.69231C1.02857 1.5601 1.49006 1.07692 2.57143 1.07692ZM10.4571 12.9231H2.57143C1.60526 12.9231 1.02857 12.3193 1.02857 11.3077C1.02857 10.2961 1.60526 9.69231 2.57143 9.69231H10.4571C10.6382 9.69231 10.8096 9.65358 10.9714 9.59327V12.3846C10.9714 12.6818 10.7403 12.9231 10.4571 12.9231Z" fill="#032746" />
    </svg>

);

const FileText = ({ size = 14, color = "#032746", className = "" }) => (
    <svg width="12" height="15" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.42857 0H2.57143C0.913371 0 0 0.888 0 2.5V10.5C0 12.112 0.913371 13 2.57143 13H9.42857C11.0866 13 12 12.112 12 10.5V2.5C12 0.888 11.0866 0 9.42857 0ZM10.9714 10.5C10.9714 11.5513 10.5099 12 9.42857 12H2.57143C1.49006 12 1.02857 11.5513 1.02857 10.5V2.5C1.02857 1.44867 1.49006 1 2.57143 1H9.42857C10.5099 1 10.9714 1.44867 10.9714 2.5V10.5ZM9.6 3.83333C9.6 4.10933 9.3696 4.33333 9.08571 4.33333H6.34286C6.05897 4.33333 5.82857 4.10933 5.82857 3.83333C5.82857 3.55733 6.05897 3.33333 6.34286 3.33333H9.08571C9.3696 3.33333 9.6 3.55733 9.6 3.83333ZM9.6 6.5C9.6 6.776 9.3696 7 9.08571 7H6.34286C6.05897 7 5.82857 6.776 5.82857 6.5C5.82857 6.224 6.05897 6 6.34286 6H9.08571C9.3696 6 9.6 6.224 9.6 6.5ZM4.64916 3.03532C4.85008 3.23065 4.85008 3.54734 4.64916 3.74268L3.7351 4.63135C3.63499 4.72868 3.50331 4.778 3.37165 4.778C3.24068 4.778 3.10832 4.72933 3.0082 4.632L2.55084 4.18734C2.34992 3.992 2.34992 3.67531 2.55084 3.47998C2.75107 3.28531 3.0768 3.28465 3.2784 3.47998L3.37232 3.57133L3.92294 3.03601C4.12316 2.84001 4.44825 2.83999 4.64916 3.03532ZM4.64916 5.70199C4.85008 5.89732 4.85008 6.21401 4.64916 6.40934L3.7351 7.29801C3.63499 7.39535 3.50331 7.44466 3.37165 7.44466C3.24068 7.44466 3.10832 7.396 3.0082 7.29867L2.55084 6.854C2.34992 6.65867 2.34992 6.34198 2.55084 6.14665C2.75107 5.95198 3.0768 5.95131 3.2784 6.14665L3.37232 6.238L3.92294 5.70268C4.12316 5.50668 4.44825 5.50665 4.64916 5.70199ZM9.6 9.16667C9.6 9.44267 9.3696 9.66667 9.08571 9.66667H6.34286C6.05897 9.66667 5.82857 9.44267 5.82857 9.16667C5.82857 8.89067 6.05897 8.66667 6.34286 8.66667H9.08571C9.3696 8.66667 9.6 8.89067 9.6 9.16667ZM4.64916 8.36865C4.85008 8.56399 4.85008 8.88068 4.64916 9.07601L3.7351 9.96468C3.63499 10.062 3.50331 10.1113 3.37165 10.1113C3.24068 10.1113 3.10832 10.0627 3.0082 9.96533L2.55084 9.52067C2.34992 9.32534 2.34992 9.00865 2.55084 8.81331C2.75107 8.61865 3.0768 8.61798 3.2784 8.81331L3.37232 8.90466L3.92294 8.36934C4.12316 8.17334 4.44825 8.17332 4.64916 8.36865Z" fill="#032746" />
    </svg>
);

const User = ({ size = 14, color = "#032746", className = "" }) => (
    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.00699 6.53846C4.19228 6.53846 2.71667 5.07154 2.71667 3.26923C2.71667 1.46692 4.19228 0 6.00699 0C7.8217 0 9.29732 1.46692 9.29732 3.26923C9.29732 5.07154 7.8217 6.53846 6.00699 6.53846ZM6.00699 1.15385C4.83254 1.15385 3.87796 2.10231 3.87796 3.26923C3.87796 4.43615 4.83254 5.38462 6.00699 5.38462C7.18144 5.38462 8.13603 4.43615 8.13603 3.26923C8.13603 2.10231 7.18067 1.15385 6.00699 1.15385ZM9.09441 15H2.90559C1.03204 15 0 13.9808 0 12.13C0 10.0831 1.16594 7.69231 4.45161 7.69231H7.54839C10.8341 7.69231 12 10.0823 12 12.13C12 13.9808 10.968 15 9.09441 15ZM4.45161 8.84615C1.39897 8.84615 1.16129 11.3593 1.16129 12.13C1.16129 13.3331 1.68314 13.8462 2.90559 13.8462H9.09441C10.3169 13.8462 10.8387 13.3331 10.8387 12.13C10.8387 11.36 10.601 8.84615 7.54839 8.84615H4.45161Z" fill="#032746" />
    </svg>
);

const CalendarDays = ({ size = 14, color = "#032746", className = "" }) => (
    <svg width="12" height="15" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.69231 0.923077H8.92308V0.461538C8.92308 0.206769 8.71631 0 8.46154 0C8.20677 0 8 0.206769 8 0.461538V0.923077H4V0.461538C4 0.206769 3.79323 0 3.53846 0C3.28369 0 3.07692 0.206769 3.07692 0.461538V0.923077H2.30769C0.819692 0.923077 0 1.74277 0 3.23077V9.69231C0 11.1803 0.819692 12 2.30769 12H9.69231C11.1803 12 12 11.1803 12 9.69231V3.23077C12 1.74277 11.1803 0.923077 9.69231 0.923077ZM2.30769 1.84615H3.07692V2.30769C3.07692 2.56246 3.28369 2.76923 3.53846 2.76923C3.79323 2.76923 4 2.56246 4 2.30769V1.84615H8V2.30769C8 2.56246 8.20677 2.76923 8.46154 2.76923C8.71631 2.76923 8.92308 2.56246 8.92308 2.30769V1.84615H9.69231C10.6628 1.84615 11.0769 2.26031 11.0769 3.23077V3.69231H0.923077V3.23077C0.923077 2.26031 1.33723 1.84615 2.30769 1.84615ZM9.69231 11.0769H2.30769C1.33723 11.0769 0.923077 10.6628 0.923077 9.69231V4.61538H11.0769V9.69231C11.0769 10.6628 10.6628 11.0769 9.69231 11.0769ZM4.16617 6.61539C4.16617 6.95508 3.89109 7.23077 3.55078 7.23077C3.21109 7.23077 2.93224 6.95508 2.93224 6.61539C2.93224 6.27569 3.20493 6 3.54462 6H3.55078C3.89047 6 4.16617 6.27569 4.16617 6.61539ZM6.6277 6.61539C6.6277 6.95508 6.35263 7.23077 6.01232 7.23077C5.67263 7.23077 5.39378 6.95508 5.39378 6.61539C5.39378 6.27569 5.66647 6 6.00616 6H6.01232C6.35201 6 6.6277 6.27569 6.6277 6.61539ZM9.08924 6.61539C9.08924 6.95508 8.81417 7.23077 8.47386 7.23077C8.13417 7.23077 7.85532 6.95508 7.85532 6.61539C7.85532 6.27569 8.12801 6 8.4677 6H8.47386C8.81355 6 9.08924 6.27569 9.08924 6.61539ZM4.16617 9.07692C4.16617 9.41662 3.89109 9.69231 3.55078 9.69231C3.21109 9.69231 2.93224 9.41662 2.93224 9.07692C2.93224 8.73723 3.20493 8.46154 3.54462 8.46154H3.55078C3.89047 8.46154 4.16617 8.73723 4.16617 9.07692ZM6.6277 9.07692C6.6277 9.41662 6.35263 9.69231 6.01232 9.69231C5.67263 9.69231 5.39378 9.41662 5.39378 9.07692C5.39378 8.73723 5.66647 8.46154 6.00616 8.46154H6.01232C6.35201 8.46154 6.6277 8.73723 6.6277 9.07692ZM9.08924 9.07692C9.08924 9.41662 8.81417 9.69231 8.47386 9.69231C8.13417 9.69231 7.85532 9.41662 7.85532 9.07692C7.85532 8.73723 8.12801 8.46154 8.4677 8.46154H8.47386C8.81355 8.46154 9.08924 8.73723 9.08924 9.07692Z" fill="#032746" />
    </svg>
);

const iconMap = {
    name: <BookIcon size={16} className="text-oxford-blue" />,
    description: <FileText size={16} className="text-oxford-blue" />,
    createdby: <User size={16} className="text-oxford-blue" />,
    datecreated: <CalendarDays size={16} className="text-oxford-blue" />,
};

const MobileCard = ({ item, columns, onView, onEdit, t }) => {
    const displayColumns = columns.slice(0, -1); // Exclude "Actions"

    // Normalize column name to match item key
    const getFieldKey = (columnName) => {
        const key = columnName.toLowerCase().replace(/ /g, "");
        if (["subjectname", "topicname", "subtopicname", "conceptname"].includes(key)) return "name";
        return key;
    };

    return (
        <article className="flex flex-col gap-4 rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-empty md:hidden">
            <div className="flex flex-col gap-3 text-oxford-blue">
                {displayColumns.map((column) => {
                    const value = item[column.key] || "—"; 
                    const icon = iconMap[column.key.toLowerCase()] || <FileText size={16} className="text-oxford-blue" />;

                    return (
                        <div key={column.key} className="flex items-start gap-2">
                            {icon}
                            <p className="text-[14px] font-roboto text-[#1F2937]">
                                <span className="font-semibold capitalize">{column.label}:</span>{" "}
                                <span className="text-[#374151]">{value}</span>
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => onView?.(item)}
                    className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
                    aria-label={t('admin.classificationManagement.table.ariaLabels.view').replace('{{name}}', item.name)}
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
                    onClick={() => onEdit?.(item)}
                    className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
                    aria-label={t('admin.classificationManagement.table.ariaLabels.edit').replace('{{name}}', item.name)}
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
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


// Pagination
const Pagination = ({ page, pageSize, total, onPageChange, t }) => {
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
        <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-oxford-blue md:flex-row md:items-center md:justify-between md:bg-oxford-blue md:px-6 md:text-white">
            <p className="text-[12px] font-roboto font-medium leading-[18px] tracking-[3%]">
                {t('admin.classificationManagement.table.pagination.showing')
                    .replace('{{first}}', firstItem)
                    .replace('{{last}}', lastItem)
                    .replace('{{total}}', total)}
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={page === 1}
                    className={`flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-medium leading-[16px] transition-colors ${page === 1
                        ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
                        : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
                        }`}
                >
                    {t('admin.classificationManagement.table.pagination.previous')}
                </button>
                {pages.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        type="button"
                        onClick={() => onPageChange?.(pageNumber)}
                        className={`flex h-[27.16px] w-8 items-center justify-center rounded border text-[14px] font-archivo font-medium leading-[16px] transition-colors ${pageNumber === page
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
                    className={`flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-medium leading-[16px] transition-colors ${page === safeTotalPages
                        ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
                        : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
                        }`}
                >
                    {t('admin.classificationManagement.table.pagination.next')}
                </button>
            </div>
        </div>
    );
};

// Main Table Component
const ClassificationTable = ({
    items,
    columns,
    page,
    pageSize,
    total,
    onPageChange,
    onView,
    onEdit,
    emptyMessage,
}) => {
    const { t } = useLanguage();

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
                                    onEdit={onEdit}
                                    t={t}
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
                            onEdit={onEdit}
                            t={t}
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
                t={t}
            />
        </section>
    );
};

export default ClassificationTable;