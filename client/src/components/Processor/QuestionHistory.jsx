import React from 'react';

const QuestionHistory = ({ historyItems, t }) => {
  return (
    <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto">
      <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
        {t("admin.questionDetails.sections.activityLog")}
      </h2>
      <div className="space-y-4 overflow-y-auto">
        {historyItems && historyItems.length > 0 ? (
          historyItems.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 w-full max-w-full h-auto"
              dir="ltr"
            >
              <div className="flex-shrink-0">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="15" cy="15" r="15" fill="#ED4122" />
                  <path
                    d="M21.125 14.125H15.875V8.875C15.875 8.392 15.483 8 15 8C14.517 8 14.125 8.392 14.125 8.875V14.125H8.875C8.392 14.125 8 14.517 8 15C8 15.483 8.392 15.875 8.875 15.875H14.125V21.125C14.125 21.608 14.517 22 15 22C15.483 22 15.875 21.608 15.875 21.125V15.875H21.125C21.608 15.875 22 15.483 22 15C22 14.517 21.608 14.125 21.125 14.125Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  {activity.notes || activity.action || activity.description || "Activity"}
                </p>
                <p className="font-roboto text-[12px] font-normal leading-[20px] text-dark-gray">
                  {activity.performedBy?.name || activity.performedBy?.username || activity.createdBy?.name || "Unknown"} - {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : "No date"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="font-roboto text-[14px] text-gray-500">
            No activity log available
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionHistory;
