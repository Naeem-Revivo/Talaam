import React, { useState } from 'react';

// ============= REUSABLE TABLE COMPONENTS =============

const TableHeader = ({ columns }) => (
  <thead className="hidden md:table-header-group">
    <tr className="bg-oxford-blue text-center">
      {columns.map((column) => (
        <th
          key={column.key}
          className="px-6 py-4 text-[16px] font-medium leading-[16px] font-archivo text-white uppercase"
        >
          {column.label}
        </th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({ item, columns, onView, onEdit }) => {
  const getFieldKey = (columnName) => {
    return columnName.toLowerCase().replace(/ /g, "");
  };

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
      {columns.slice(0, -1).map((column) => {
                let value = item[column.key] || "—";

        // Special rendering for status
        if (column.key === 'status') {
          const isActive = value.toLowerCase() === 'active';
          const isScheduled = value.toLowerCase() === 'scheduled';
          return (
            <td key={column.key} className="px-6 py-4 text-center">
              <span className={`inline-block px-[12px] py-[5px] rounded-md text-[14px] leading-[100%] font-normal font-roboto ${isActive ? 'bg-[#FDF0D5] text-[#ED4122]' :
                isScheduled ? 'bg-[#ED4122] text-white' :
                  'bg-[#C6D8D3] text-oxford-blue'
                }`}>
                {value}
              </span>
            </td>
          );
        }

        // Special rendering for default (star)
        if (column.key === 'default') {
          const isDefault = item[column.key] === true || item[column.key] === 'true';
          return (
            <td key={column.key} className="px-6 py-4 text-center flex items-center justify-center">
              <span>
                <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.288 0.692674C10.5873 -0.228637 11.8907 -0.228635 12.1901 0.692676L14.1577 6.7484C14.2916 7.16043 14.6755 7.43939 15.1088 7.43939H21.4761C22.4449 7.43939 22.8476 8.679 22.0639 9.2484L16.9126 12.9911C16.5621 13.2457 16.4155 13.6971 16.5493 14.1091L18.517 20.1648C18.8163 21.0861 17.7618 21.8522 16.9781 21.2828L11.8268 17.5402C11.4763 17.2856 11.0017 17.2856 10.6512 17.5402L5.49993 21.2828C4.71621 21.8522 3.66174 21.0861 3.96109 20.1648L5.92871 14.1091C6.06259 13.6971 5.91593 13.2457 5.56544 12.9911L0.41413 9.2484C-0.369583 8.679 0.0331933 7.43939 1.00192 7.43939H7.36929C7.80251 7.43939 8.18647 7.16043 8.32034 6.7484L10.288 0.692674Z" fill={isDefault ? "#ED4122" : "#D1D5DB"} />
                </svg>
              </span>
            </td>
          );
        }

        return (
          <td
            key={column.key}
            className={`px-6 py-4 font-normal font-roboto text-center ${column.key === "schedule" || column.key === "message" ? "text-[12px] leading-4 text-[#6B7280]" : "text-[14px] leading-[100%] text-blue-dark"}`}
          >
            {value}
          </td>
        );
      })}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onEdit?.(item)}
            className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
            aria-label="Delete"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.3967 6.00174C11.2376 6.00174 11.085 6.06493 10.9726 6.17742C10.8601 6.28991 10.7969 6.44248 10.7969 6.60157V10.2005C10.7969 10.3596 10.7337 10.5122 10.6212 10.6247C10.5087 10.7372 10.3561 10.8003 10.197 10.8003H1.79948C1.64039 10.8003 1.48783 10.7372 1.37534 10.6247C1.26285 10.5122 1.19965 10.3596 1.19965 10.2005V1.80296C1.19965 1.64387 1.26285 1.4913 1.37534 1.37882C1.48783 1.26633 1.64039 1.20313 1.79948 1.20313H5.39843C5.55752 1.20313 5.71009 1.13993 5.82258 1.02745C5.93507 0.914956 5.99826 0.762388 5.99826 0.603304C5.99826 0.44422 5.93507 0.291652 5.82258 0.179163C5.71009 0.0666738 5.55752 0.003478 5.39843 0.003478H1.79948C1.32223 0.003478 0.864523 0.193065 0.527055 0.530533C0.189587 0.868001 0 1.3257 0 1.80296V10.2005C0 10.6778 0.189587 11.1355 0.527055 11.4729C0.864523 11.8104 1.32223 12 1.79948 12H10.197C10.6743 12 11.132 11.8104 11.4695 11.4729C11.8069 11.1355 11.9965 10.6778 11.9965 10.2005V6.60157C11.9965 6.44248 11.9333 6.28991 11.8208 6.17742C11.7083 6.06493 11.5558 6.00174 11.3967 6.00174ZM2.3993 6.45761V9.00087C2.3993 9.15995 2.4625 9.31252 2.57499 9.42501C2.68748 9.5375 2.84005 9.6007 2.99913 9.6007H5.54239C5.62133 9.60115 5.69959 9.58602 5.77267 9.55617C5.84575 9.52632 5.91222 9.48234 5.96827 9.42675L10.1191 5.26995L11.8226 3.60243C11.8788 3.54667 11.9234 3.48033 11.9539 3.40724C11.9843 3.33414 12 3.25574 12 3.17656C12 3.09737 11.9843 3.01897 11.9539 2.94588C11.9234 2.87278 11.8788 2.80644 11.8226 2.75068L9.27931 0.177428C9.22355 0.121207 9.15721 0.0765832 9.08411 0.0461308C9.01102 0.0156784 8.93262 0 8.85343 0C8.77425 0 8.69585 0.0156784 8.62275 0.0461308C8.54966 0.0765832 8.48332 0.121207 8.42756 0.177428L6.73605 1.87494L2.57325 6.03173C2.51766 6.08778 2.47368 6.15425 2.44383 6.22733C2.41398 6.30041 2.39885 6.37867 2.3993 6.45761ZM8.85343 1.44906L10.5509 3.14657L9.69919 3.99832L8.00168 2.30081L8.85343 1.44906ZM3.59896 6.70354L7.15593 3.14657L8.85343 4.84407L5.29646 8.40104H3.59896V6.70354Z" fill="#032746" />
            </svg>

          </button>
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
            aria-label="View"
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

const MobileCard = ({ item, columns, onView, onEdit }) => {
  const displayColumns = columns.slice(0, -1);

  const getFieldKey = (columnName) => {
    return columnName.toLowerCase().replace(/ /g, "");
  };

  return (
    <article className="flex flex-col rounded-[8px] border border-[#E5E7EB] bg-white shadow-sm md:hidden overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-3 text-oxford-blue">
        {displayColumns.map((column) => {
                    let value = item[column.key] || "—";

          // Special rendering for default (star icon)
          if (column.key === 'default') {
            const isDefault = item[column.key] === true || item[column.key] === 'true';
            return (
              <div key={column.key} className="flex items-center gap-2">
                <span className="text-[14px] font-normal text-oxford-blue">{column.label}:</span>
                <svg width="16" height="16" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.288 0.692674C10.5873 -0.228637 11.8907 -0.228635 12.1901 0.692676L14.1577 6.7484C14.2916 7.16043 14.6755 7.43939 15.1088 7.43939H21.4761C22.4449 7.43939 22.8476 8.679 22.0639 9.2484L16.9126 12.9911C16.5621 13.2457 16.4155 13.6971 16.5493 14.1091L18.517 20.1648C18.8163 21.0861 17.7618 21.8522 16.9781 21.2828L11.8268 17.5402C11.4763 17.2856 11.0017 17.2856 10.6512 17.5402L5.49993 21.2828C4.71621 21.8522 3.66174 21.0861 3.96109 20.1648L5.92871 14.1091C6.06259 13.6971 5.91593 13.2457 5.56544 12.9911L0.41413 9.2484C-0.369583 8.679 0.0331933 7.43939 1.00192 7.43939H7.36929C7.80251 7.43939 8.18647 7.16043 8.32034 6.7484L10.288 0.692674Z" fill={isDefault ? "#ED4122" : "#D1D5DB"} />
                </svg>
              </div>
            );
          }

          // Skip status field in top section
          if (column.key === 'status') {
            return null;
          }

          return (
            <div key={column.key} className="flex items-center gap-2">
              <span className="text-[14px] font-normal text-oxford-blue">{column.label}:</span>
              <span className="text-[14px] font-normal text-dark-gray">{value}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom section with status and action buttons */}
      <div className="flex items-center justify-between border-t border-[#E5E7EB] px-4 py-2.5">
        {/* Status badge */}
        {(() => {
          const statusKey = 'status';
          const statusValue = item[statusKey] || 'Inactive';
          const isActive = statusValue.toLowerCase() === 'active';
          const isScheduled = statusValue.toLowerCase() === 'scheduled';
          
          return (
            <span className={`inline-flex items-center px-[12px] py-[5px] rounded-md text-[14px] font-normal ${
              isActive ? 'bg-[#FDF0D5] text-[#ED4122]' : 
              isScheduled ? 'bg-[#ED4122] text-white' : 
              'bg-[#C6D8D3] text-oxford-blue'
            }`}>
              {statusValue}
            </span>
          );
        })()}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(item)}
            className="rounded-full p-1.5 text-oxford-blue transition hover:bg-white"
            aria-label="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.3967 6.00174C11.2376 6.00174 11.085 6.06493 10.9726 6.17742C10.8601 6.28991 10.7969 6.44248 10.7969 6.60157V10.2005C10.7969 10.3596 10.7337 10.5122 10.6212 10.6247C10.5087 10.7372 10.3561 10.8003 10.197 10.8003H1.79948C1.64039 10.8003 1.48783 10.7372 1.37534 10.6247C1.26285 10.5122 1.19965 10.3596 1.19965 10.2005V1.80296C1.19965 1.64387 1.26285 1.4913 1.37534 1.37882C1.48783 1.26633 1.64039 1.20313 1.79948 1.20313H5.39843C5.55752 1.20313 5.71009 1.13993 5.82258 1.02745C5.93507 0.914956 5.99826 0.762388 5.99826 0.603304C5.99826 0.44422 5.93507 0.291652 5.82258 0.179163C5.71009 0.0666738 5.55752 0.003478 5.39843 0.003478H1.79948C1.32223 0.003478 0.864523 0.193065 0.527055 0.530533C0.189587 0.868001 0 1.3257 0 1.80296V10.2005C0 10.6778 0.189587 11.1355 0.527055 11.4729C0.864523 11.8104 1.32223 12 1.79948 12H10.197C10.6743 12 11.132 11.8104 11.4695 11.4729C11.8069 11.1355 11.9965 10.6778 11.9965 10.2005V6.60157C11.9965 6.44248 11.9333 6.28991 11.8208 6.17742C11.7083 6.06493 11.5558 6.00174 11.3967 6.00174ZM2.3993 6.45761V9.00087C2.3993 9.15995 2.4625 9.31252 2.57499 9.42501C2.68748 9.5375 2.84005 9.6007 2.99913 9.6007H5.54239C5.62133 9.60115 5.69959 9.58602 5.77267 9.55617C5.84575 9.52632 5.91222 9.48234 5.96827 9.42675L10.1191 5.26995L11.8226 3.60243C11.8788 3.54667 11.9234 3.48033 11.9539 3.40724C11.9843 3.33414 12 3.25574 12 3.17656C12 3.09737 11.9843 3.01897 11.9539 2.94588C11.9234 2.87278 11.8788 2.80644 11.8226 2.75068L9.27931 0.177428C9.22355 0.121207 9.15721 0.0765832 9.08411 0.0461308C9.01102 0.0156784 8.93262 0 8.85343 0C8.77425 0 8.69585 0.0156784 8.62275 0.0461308C8.54966 0.0765832 8.48332 0.121207 8.42756 0.177428L6.73605 1.87494L2.57325 6.03173C2.51766 6.08778 2.47368 6.15425 2.44383 6.22733C2.41398 6.30041 2.39885 6.37867 2.3993 6.45761ZM8.85343 1.44906L10.5509 3.14657L9.69919 3.99832L8.00168 2.30081L8.85343 1.44906ZM3.59896 6.70354L7.15593 3.14657L8.85343 4.84407L5.29646 8.40104H3.59896V6.70354Z" fill="#032746" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="rounded-full p-1.5 text-oxford-blue transition hover:bg-white"
            aria-label="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.4615 2.15385H10.9064C10.2595 2.15385 10.2322 2.072 10.0549 1.54072L9.90984 1.10492C9.68943 0.444411 9.07416 0 8.37775 0H5.62225C4.92584 0 4.30985 0.443693 4.09015 1.10492L3.94513 1.54072C3.7678 2.07272 3.74051 2.15385 3.09364 2.15385H0.538462C0.241231 2.15385 0 2.39508 0 2.69231C0 2.98954 0.241231 3.23077 0.538462 3.23077H1.47036L2.02103 11.4865C2.12728 13.0839 3.10657 14 4.70759 14H9.29313C10.8934 14 11.8727 13.0839 11.9797 11.4865L12.5304 3.23077H13.4615C13.7588 3.23077 14 2.98954 14 2.69231C14 2.39508 13.7588 2.15385 13.4615 2.15385ZM5.11179 1.44523C5.18574 1.22482 5.39035 1.07692 5.62225 1.07692H8.37775C8.60965 1.07692 8.81498 1.22482 8.88821 1.44523L9.03323 1.88102C9.06482 1.97507 9.09641 2.06626 9.13087 2.15385H4.86769C4.90215 2.06554 4.93447 1.97436 4.96606 1.88102L5.11179 1.44523ZM10.9042 11.4147C10.836 12.4435 10.3234 12.9231 9.29241 12.9231H4.70687C3.6759 12.9231 3.164 12.4442 3.09507 11.4147L2.54944 3.23077H3.09292C3.18267 3.23077 3.25733 3.22144 3.33775 3.2157C3.36216 3.21929 3.38441 3.23077 3.40954 3.23077H10.589C10.6149 3.23077 10.6364 3.21929 10.6608 3.2157C10.7412 3.22144 10.8159 3.23077 10.9056 3.23077H11.4491L10.9042 11.4147ZM8.97436 6.28205V9.87179C8.97436 10.169 8.73313 10.4103 8.4359 10.4103C8.13867 10.4103 7.89744 10.169 7.89744 9.87179V6.28205C7.89744 5.98482 8.13867 5.74359 8.4359 5.74359C8.73313 5.74359 8.97436 5.98482 8.97436 6.28205ZM6.10256 6.28205V9.87179C6.10256 10.169 5.86133 10.4103 5.5641 10.4103C5.26687 10.4103 5.02564 10.169 5.02564 9.87179V6.28205C5.02564 5.98482 5.26687 5.74359 5.5641 5.74359C5.86133 5.74359 6.10256 5.98482 6.10256 6.28205Z" fill="#032746" />
            </svg>
          </button>
        </div>
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

  const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-oxford-blue md:flex-row md:items-center md:justify-between md:bg-oxford-blue md:px-6 md:text-white">
      <p className="text-[12px] font-medium leading-[18px]">
        Showing {firstItem} to {lastItem} of {total} results
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 1}
          className={`flex h-[27px] w-[78px] items-center justify-center rounded border text-[14px] font-semibold leading-[16px] transition-colors ${page === 1
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
            className={`flex h-8 w-8 items-center justify-center rounded border text-[14px] font-semibold leading-[16px] transition-colors ${pageNumber === page
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
          className={`flex h-[27px] w-[78px] items-center justify-center rounded border text-[14px] font-semibold leading-[16px] transition-colors ${page === safeTotalPages
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

export const Table = ({
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