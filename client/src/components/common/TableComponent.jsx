import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { cleanHtmlForDisplay } from "../../utils/textUtils";

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

const TableRow = ({ item, columns, onView, onEdit, onCustomAction, onShowFlagReason, onShowRejectionReason }) => {
  const getFieldKey = (columnName) => {
    return columnName.toLowerCase().replace(/ /g, "");
  };
  const { language, t } = useLanguage();
  const isRTL = language === "ar";


  console.log(item, 'item');

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
      {columns.slice(0, -1).map((column) => {
        let value = item[column.key] || "—";

        // Special rendering for indicators
        if (column.key === "indicators") {
          const indicators = item.indicators || {};
          const isFlagged = indicators.flag === true;
          const isApproved = indicators.approved === true;
          const isVariant = indicators.variant === true;
          
          return (
            <td key={column.key} className="px-6 py-8 text-center">
              <div className="flex flex-col items-center justify-center gap-1">
                {isFlagged ? (
                  <span className="inline-block px-[8px] py-[4px] rounded-md text-[10px] leading-[100%] font-normal bg-red-100 text-red-700">
                    🚩 Flagged
                  </span>
                ) : isVariant ? (
                  <span className="inline-block px-[8px] py-[4px] rounded-md text-[10px] leading-[100%] font-normal bg-blue-100 text-blue-700">
                    {t("creator.assignedQuestionPage.indicators.variant") || "Variant"}
                  </span>
                ) : isApproved ? (
                  <span className="inline-block px-[8px] py-[4px] rounded-md text-[10px] leading-[100%] font-normal bg-green-100 text-green-700">
                    {t("creator.assignedQuestionPage.indicators.approved") || "Approved"}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </td>
          );
        }

        // Special rendering for status and creatorStatus columns
        if (column.key === "status" || column.key === "creatorStatus" || column.key === "processorStatus" || column.key === "explainerStatus" || column.key === "adminStatus") {
          // Check if value contains "- Variant" (for variant questions)
          const isVariantStatus = typeof value === 'string' && value.includes(' - Variant');
          const baseValue = isVariantStatus ? value.replace(' - Variant', '').trim() : value;
          
          const isApproved = baseValue.toLowerCase() === "approved";
          const isCompleted = baseValue.toLowerCase() === "completed";
          const isPending = baseValue.toLowerCase() === "pending" || baseValue.toLowerCase() === "pending review";
          const isSentBack = baseValue.toLowerCase() === "sent back";
          const isReject = baseValue.toLowerCase() === "reject" || baseValue.toLowerCase() === "rejected";
          const isFlag = baseValue.toLowerCase() === "flag" || baseValue.toLowerCase() === "flagged";
          const isaccept = baseValue.toLowerCase() === "accepted";
          const isfixrequest = baseValue.toLowerCase() === "fix request";
          const isRevision = baseValue.toLowerCase() === "revision";
          const isDraft = baseValue.toLowerCase() === "draft";
          const isPaid = baseValue.toLowerCase() === "paid";
          const isFailed = baseValue.toLowerCase() === "failed";
          const isVisible = baseValue.toLowerCase() === "visible";
          const isHidden = baseValue.toLowerCase() === "hidden";
          const isVariantCreated = baseValue.toLowerCase() === "variant created";
          const isVariant = baseValue.toLowerCase() === "variant";
          const isFlagged = item.indicators?.flag === true;
          // Show reason button for status, creatorStatus, explainerStatus, or adminStatus column when flagged
          const showReasonButton = (column.key === "status" || column.key === "creatorStatus" || column.key === "explainerStatus" || column.key === "adminStatus") && isFlagged && onShowFlagReason && item.flagReason;
          
          return (
            <td key={column.key} className="px-6 py-8 text-center">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span
                  className={`inline-block px-[12px] py-[5px] rounded-md text-[12px] leading-[100%] font-normal ${
                    isFlag
                      ? "bg-red-100 text-red-700"
                      : isVariantCreated || isVariant
                      ? "bg-blue-100 text-blue-700"
                      : isApproved || isCompleted
                      ? "bg-green-100 text-green-700"
                      : isPaid
                      ? "bg-[#FDF0D5] text-[#ED4122]"
                      : isFailed
                      ? "bg-[#ED4122] text-white"
                      : isVisible
                      ? "bg-[#FDF0D5] text-[#ED4122]"
                      : isHidden
                      ? "bg-[#ED4122] text-white"
                      : isaccept
                      ? "bg-[#FDF0D5] text-[#ED4122]"
                      : isDraft
                      ? "bg-[#FDF0D5] text-[#ED4122]"
                      : isSentBack
                      ? "bg-[#ED4122] text-white"
                      : isRevision
                      ? "bg-[#ED4122] text-white"
                      : isfixrequest
                      ? "bg-[#ED4122] text-white"
                      : isReject
                      ? "bg-[#C6D8D3] text-blue-dark"
                      : isPending
                      ? "bg-[#FDF0D5] text-[#ED4122]"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {baseValue}
                </span>
                {isVariantStatus && (
                  <span className="inline-block px-[8px] py-[4px] rounded-md text-[10px] leading-[100%] font-normal bg-blue-100 text-blue-700">
                    {t("creator.assignedQuestionPage.indicators.variant") || "Variant"}
                  </span>
                )}
                {showReasonButton && (
                  <button
                    type="button"
                    onClick={() => onShowFlagReason(item.flagReason)}
                    className="text-orange-dark text-[12px] font-normal leading-[16px] font-roboto hover:underline transition px-2 py-1"
                  >
                    {t("creator.assignedQuestionPage.reasonButton") || "Reason"}
                  </button>
                )}
              </div>
            </td>
          );
        }

        // Special rendering for questionTitle and question to support HTML content
        if ((column.key === "questionTitle" || column.key === "question") && typeof value === "string" && value.includes("<")) {
          // Clean code tags with data attributes and preserve other HTML formatting
          let cleaned = cleanHtmlForDisplay(value);
          
          // Strip HTML tags to get text length for truncation
          const textOnly = cleaned.replace(/<[^>]*>/g, '');
          const shouldTruncate = textOnly.length > 50;
          
          // Simple truncation: if HTML is long, show first 200 chars (may cut HTML tags, but will still render)
          const displayHTML = shouldTruncate && cleaned.length > 200 
            ? cleaned.substring(0, 200) + "..." 
            : cleaned;
          
          return (
            <td
              key={column.key}
              className="px-6 py-8 font-normal font-roboto text-center text-[14px] leading-[16px] text-blue-dark"
              dangerouslySetInnerHTML={{ __html: displayHTML }}
            />
          );
        }

        return (
          <td
            key={column.key}
            className="px-6 py-8 font-normal font-roboto text-center text-[14px] leading-[16px] text-blue-dark"
          >
            {value}
          </td>
        );
      })}
      <td className="px-6 py-8">
        <div className="flex items-center justify-center gap-2">
          {item.actionType === "review" && (
            <button
              type="button"
              onClick={() => onView?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Review
            </button>
          )}
          {item.actionType === "download" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] flex items-center gap-3 font-normal leading-[16px] font-roboto hover:underline transition"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.21997 10.28C0.926971 9.98703 0.926971 9.51199 1.21997 9.21899C1.51297 8.92599 1.98801 8.92599 2.28101 9.21899L6.00098 12.939V0.75C6.00098 0.336 6.33698 0 6.75098 0C7.16498 0 7.50098 0.336 7.50098 0.75V12.939L11.2209 9.21899C11.5139 8.92599 11.989 8.92599 12.282 9.21899C12.575 9.51199 12.575 9.98703 12.282 10.28L7.28198 15.28C7.21298 15.349 7.13006 15.4039 7.03906 15.4419C6.94806 15.4799 6.84995 15.5 6.75195 15.5C6.65395 15.5 6.55709 15.4799 6.46509 15.4419C6.37309 15.4039 6.29092 15.349 6.22192 15.28L1.21997 10.28ZM12.75 18H0.75C0.336 18 0 18.336 0 18.75C0 19.164 0.336 19.5 0.75 19.5H12.75C13.164 19.5 13.5 19.164 13.5 18.75C13.5 18.336 13.164 18 12.75 18Z"
                  fill="#ED4122"
                />
              </svg>
              Download
            </button>
          )}
          {item.actionType === "toggle" && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => onCustomAction?.(item)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  item.visibility ? "bg-orange-dark" : "bg-[#E5E7EB]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    item.visibility
                      ? isRTL
                        ? "-translate-x-6"
                        : "translate-x-6"
                      : isRTL
                      ? "-translate-x-1"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}
          {/* Custom action buttons based on action type */}
          {item.actionType === "view" && (
            <button
              type="button"
              onClick={() => onView?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              View
            </button>
          )}
          {item.actionType === "viewicon" && (
            <button
              type="button"
              onClick={() => onView?.(item)}
              className="text-blue-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
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
          )}
          {item.actionType === "editicon" && (
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          )}
          {item.actionType === "update" && (
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Update
            </button>
          )}
          {item.actionType === "fix" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Fix
            </button>
          )}
          {!item.actionType && (
            <button
              type="button"
              onClick={() => onView?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              View
            </button>
          )}
          {item.actionType === "open" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Open
            </button>
          )}
          {item.actionType === "createVariant" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Create Variant
            </button>
          )}
          {item.actionType === "addExplanation" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Add Explanation
            </button>
          )}
          {item.actionType === "continue" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-medium leading-[100%] hover:underline transition"
            >
              Continue
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const MobileCard = ({ item, columns, onView, onEdit, onCustomAction, onShowFlagReason, onShowRejectionReason }) => {
  const displayColumns = columns.slice(0, -1);
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  return (
    <article className="flex flex-col rounded-[8px] border border-[#E5E7EB] bg-white shadow-sm md:hidden overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-3 text-oxford-blue">
        {displayColumns.map((column) => {
          let value = item[column.key] || "—";

          // Special rendering for indicators
          if (column.key === "indicators") {
            const indicators = item.indicators || {};
            const isFlagged = indicators.flag === true;
            const isApproved = indicators.approved === true;
            const isVariant = indicators.variant === true;
            
            return (
              <div key={column.key} className="flex items-center gap-2">
                <span className="text-[14px] font-normal text-oxford-blue">
                  {column.label}:
                </span>
                <div className="flex flex-col items-start gap-1">
                  {isFlagged ? (
                    <span className="inline-block px-[8px] py-[4px] rounded-md text-[10px] leading-[100%] font-normal bg-red-100 text-red-700">
                      🚩 Flagged
                    </span>
                  ) : isVariant ? (
                    <span className="inline-block px-[8px] py-[4px] rounded-md text-[10px] leading-[100%] font-normal bg-blue-100 text-blue-700">
                      {t("creator.assignedQuestionPage.indicators.variant") || "Variant"}
                    </span>
                  ) : isApproved ? (
                    <span className="inline-block px-[8px] py-[4px] rounded-md text-[10px] leading-[100%] font-normal bg-green-100 text-green-700">
                      {t("creator.assignedQuestionPage.indicators.approved") || "Approved"}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>
            );
          }

          // Special rendering for status, creatorStatus, and processorStatus columns
          if (column.key === "status" || column.key === "creatorStatus" || column.key === "processorStatus" || column.key === "explainerStatus" || column.key === "adminStatus") {
            // Check if value contains "- Variant" (for variant questions)
            const isVariantStatus = typeof value === 'string' && value.includes(' - Variant');
            const baseValue = isVariantStatus ? value.replace(' - Variant', '').trim() : value;
            
            const isApproved = baseValue.toLowerCase() === "approved";
            const isCompleted = baseValue.toLowerCase() === "completed";
            const isPending = baseValue.toLowerCase() === "pending" || baseValue.toLowerCase() === "pending review";
            const isSentBack = baseValue.toLowerCase() === "sent back";
            const isReject = baseValue.toLowerCase() === "reject" || baseValue.toLowerCase() === "rejected";
            const isFlag = baseValue.toLowerCase() === "flag" || baseValue.toLowerCase() === "flagged";
            const isaccept = baseValue.toLowerCase() === "accepted";
            const isfixrequest = baseValue.toLowerCase() === "fix request";
            const isRevision = baseValue.toLowerCase() === "revision";
            const isDraft = baseValue.toLowerCase() === "draft";
            const isVisible = baseValue.toLowerCase() === "visible";
            const isHidden = baseValue.toLowerCase() === "hidden";
            const isVariantCreated = baseValue.toLowerCase() === "variant created";
            const isVariant = baseValue.toLowerCase() === "variant";
            const isFlagged = item.indicators?.flag === true;
            // Show reason button for status, creatorStatus, explainerStatus, or adminStatus column when flagged
            const showReasonButton = (column.key === "status" || column.key === "creatorStatus" || column.key === "explainerStatus" || column.key === "adminStatus") && isFlagged && onShowFlagReason && item.flagReason;
            return (
              <div key={column.key} className="flex items-center gap-2">
                <span className="text-[14px] font-normal text-oxford-blue">
                  {column.label}:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-block px-[12px] py-[5px] rounded-md text-[12px] leading-[100%] font-normal ${
                      isFlag
                        ? "bg-red-100 text-red-700"
                        : isVariantCreated || isVariant
                        ? "bg-blue-100 text-blue-700"
                        : isApproved || isCompleted
                        ? "bg-green-100 text-green-700"
                        : isaccept
                        ? "bg-[#FDF0D5] text-[#ED4122]"
                        : isVisible
                        ? "bg-[#FDF0D5] text-[#ED4122]"
                        : isHidden
                        ? "bg-[#ED4122] text-white"
                        : isDraft
                        ? "bg-[#FDF0D5] text-[#ED4122]"
                        : isSentBack
                        ? "bg-[#ED4122] text-white"
                        : isRevision
                        ? "bg-[#ED4122] text-white"
                        : isfixrequest
                        ? "bg-[#ED4122] text-white"
                        : isReject
                        ? "bg-[#C6D8D3] text-blue-dark"
                        : isPending
                        ? "bg-[#FDF0D5] text-[#ED4122]"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {baseValue}
                  </span>
                  {isVariantStatus && (
                    <span className="inline-block px-[8px] py-[4px] rounded-md text-[10px] leading-[100%] font-normal bg-blue-100 text-blue-700">
                      {t("creator.assignedQuestionPage.indicators.variant") || "Variant"}
                    </span>
                  )}
                  {showReasonButton && (
                    <button
                      type="button"
                      onClick={() => onShowFlagReason(item.flagReason)}
                      className="text-orange-dark text-[12px] font-normal leading-[16px] font-roboto hover:underline transition px-2 py-1"
                    >
                      {t("creator.assignedQuestionPage.reasonButton") || "Reason"}
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // Special rendering for questionTitle and question to support HTML content in mobile view
          if ((column.key === "questionTitle" || column.key === "question") && typeof value === "string" && value.includes("<")) {
            // Clean code tags with data attributes and preserve other HTML formatting
            let cleaned = cleanHtmlForDisplay(value);
            
            // Strip HTML tags to get text length for truncation
            const textOnly = cleaned.replace(/<[^>]*>/g, '');
            const shouldTruncate = textOnly.length > 50;
            
            // Simple truncation: if HTML is long, show first 200 chars
            const displayHTML = shouldTruncate && cleaned.length > 200 
              ? cleaned.substring(0, 200) + "..." 
              : cleaned;
            
            return (
              <div key={column.key} className="flex items-center gap-2">
                <span className="text-[14px] font-normal text-oxford-blue">
                  {column.label}:
                </span>
                <span 
                  className="text-[14px] font-normal text-dark-gray"
                  dangerouslySetInnerHTML={{ __html: displayHTML }}
                />
              </div>
            );
          }

          return (
            <div key={column.key} className="flex items-center gap-2">
              <span className="text-[14px] font-normal text-oxford-blue">
                {column.label}:
              </span>
              <span className="text-[14px] font-normal text-dark-gray">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom section with action button */}
      <div className="flex items-center justify-end border-t border-[#E5E7EB] px-4 py-2.5">
        {/* Action button */}
        {item.actionType === "review" && (
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Review
          </button>
        )}
        {item.actionType === "download" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] flex items-center gap-3 font-normal leading-[16px] font-roboto hover:underline transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.21997 10.28C0.926971 9.98703 0.926971 9.51199 1.21997 9.21899C1.51297 8.92599 1.98801 8.92599 2.28101 9.21899L6.00098 12.939V0.75C6.00098 0.336 6.33698 0 6.75098 0C7.16498 0 7.50098 0.336 7.50098 0.75V12.939L11.2209 9.21899C11.5139 8.92599 11.989 8.92599 12.282 9.21899C12.575 9.51199 12.575 9.98703 12.282 10.28L7.28198 15.28C7.21298 15.349 7.13006 15.4039 7.03906 15.4419C6.94806 15.4799 6.84995 15.5 6.75195 15.5C6.65395 15.5 6.55709 15.4799 6.46509 15.4419C6.37309 15.4039 6.29092 15.349 6.22192 15.28L1.21997 10.28ZM12.75 18H0.75C0.336 18 0 18.336 0 18.75C0 19.164 0.336 19.5 0.75 19.5H12.75C13.164 19.5 13.5 19.164 13.5 18.75C13.5 18.336 13.164 18 12.75 18Z"
                fill="#ED4122"
              />
            </svg>
            Download
          </button>
        )}
        {item.actionType === "toggle" && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onCustomAction?.(item)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                item.visibility ? "bg-orange-dark" : "bg-[#E5E7EB]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.visibility
                    ? isRTL
                      ? "-translate-x-6"
                      : "translate-x-6"
                    : isRTL
                    ? "-translate-x-1"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}
        {item.actionType === "view" && (
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            View
          </button>
        )}
        {item.actionType === "viewicon" && (
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
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
        )}
        {item.actionType === "editicon" && (
          <button
            type="button"
            onClick={() => onEdit?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        )}
        {item.actionType === "update" && (
          <button
            type="button"
            onClick={() => onEdit?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Update
          </button>
        )}
        {item.actionType === "fix" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Fix
          </button>
        )}
        {!item.actionType && (
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            View
          </button>
        )}
        {item.actionType === "open" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Open
          </button>
        )}
        {item.actionType === "createVariant" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Create Variant
          </button>
        )}
        {item.actionType === "addExplanation" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Add Explanation
          </button>
        )}
        {item.actionType === "continue" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Continue
          </button>
        )}
      </div>
    </article>
  );
};

const Pagination = ({ page, pageSize, total, onPageChange, t, dir }) => {
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
    <div
      className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-oxford-blue md:flex-row md:items-center md:justify-between md:bg-oxford-blue md:px-6 md:text-white"
      dir={dir}
    >
      <p className="text-[12px] font-roboto font-medium leading-[18px] tracking-[3%]">
        {t("admin.questionBank.table.pagination.showing")
          .replace("{{first}}", firstItem)
          .replace("{{last}}", lastItem)
          .replace("{{total}}", total)}
      </p>
      <div
        className={`flex items-center gap-2 ${
          dir === "rtl" ? "flex-row-reverse" : ""
        }`}
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 1}
          className={`flex h-[30px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-medium leading-[16px] transition-colors ${
            page === 1
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          {t("admin.questionBank.table.pagination.previous")}
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange?.(pageNumber)}
            className={`flex h-[30px] w-8 items-center justify-center rounded border text-[14px] font-archivo font-medium leading-[16px] transition-colors ${
              pageNumber === page
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
          className={`flex h-[30px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-medium leading-[16px] transition-colors ${
            page === safeTotalPages
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          {t("admin.questionBank.table.pagination.next")}
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
  onCustomAction,
  emptyMessage,
  showPagination = true,
  onShowFlagReason,
  onShowRejectionReason,
  loading = false,
  loadingComponent,
}) => {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  return (
    <section
      className={`w-full flex flex-col justify-between overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard ${
        items.length > 0 || loading ? "min-h-auto" : "min-h-[300px]"
      }`}
      dir={dir}
    >
      <div className={`hidden overflow-x-auto md:block ${items.length > 0 || loading ? "" : "flex items-center justify-center min-h-[300px]"}`}>
        <table className={`min-w-full border-collapse ${items.length > 0 || loading ? "" : "h-full"}`}>
          <TableHeader columns={columns} />
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-dark-gray h-full"
                >
                  <div className="flex items-center justify-center min-h-[200px]">
                    {loadingComponent || <div className="text-oxford-blue">Loading...</div>}
                  </div>
                </td>
              </tr>
            ) : items.length ? (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  item={item}
                  columns={columns}
                  onView={onView}
                  onEdit={onEdit}
                  onCustomAction={onCustomAction}
                  onShowFlagReason={onShowFlagReason}
                  onShowRejectionReason={onShowRejectionReason}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-dark-gray h-full"
                >
                  <div className="flex items-center justify-center min-h-[200px]">
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={`flex flex-col gap-4 p-2 md:hidden ${items.length > 0 || loading ? "" : "min-h-[300px] flex items-center justify-center"}`}>
        {loading ? (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-dark-gray shadow-empty min-h-[200px] flex items-center justify-center w-full">
            {loadingComponent || <div className="text-oxford-blue">Loading...</div>}
          </div>
        ) : items.length ? (
          items.map((item) => (
            <MobileCard
              key={item.id}
              item={item}
              columns={columns}
              onView={onView}
              onEdit={onEdit}
              onCustomAction={onCustomAction}
              onShowFlagReason={onShowFlagReason}
              onShowRejectionReason={onShowRejectionReason}
            />
          ))
        ) : (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-dark-gray shadow-empty min-h-[200px] flex items-center justify-center">
            {emptyMessage}
          </div>
        )}
      </div>
      {showPagination && !loading && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          t={t}
          dir={dir}
        />
      )}
    </section>
  );
};
