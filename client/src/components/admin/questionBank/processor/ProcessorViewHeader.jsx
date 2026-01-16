import React from 'react';
import { OutlineButton, PrimaryButton } from '../../../common/Button';

const ProcessorViewHeader = ({
  t,
  onClose,
  canProcessQuestion,
  isFlagged,
  flagStatus,
  gathererRejectedFlag,
  nextDestination,
  onReject,
  onApproveFlagReason,
  onRejectFlagReason,
  onAcceptGathererRejection,
  onAccept,
  processing
}) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
        {t("header.titles.admin.pendingProcessorView") || t("admin.questionBank.pendingProcessor.viewQuestion.title") || "Review Pending Processor Question"}
      </h1>
      <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
        <OutlineButton
          text={t("processor.viewQuestion.close")}
          onClick={onClose}
          className="py-[10px] px-[14px]"
          disabled={processing}
        />
        {canProcessQuestion && (
          <>
            {/* Show flag action buttons if question is flagged and flagStatus is not 'rejected' */}
            {isFlagged && flagStatus !== 'rejected' ? (
              <>
                <OutlineButton
                  text={t("processor.viewQuestion.rejectReasonButton") || "Reject Reason"}
                  onClick={onRejectFlagReason}
                  className="py-[10px] px-[14px]"
                  disabled={processing}
                />
                <PrimaryButton
                  text={t("processor.viewQuestion.approveReason") || "Approve Reason"}
                  className="py-[10px] px-5"
                  onClick={onApproveFlagReason}
                  disabled={processing}
                />
              </>
            ) : gathererRejectedFlag ? (
              <>
                <OutlineButton
                  text={t("processor.viewQuestion.rejectGathererRejection") || "Reject Gatherer's Rejection"}
                  onClick={onRejectFlagReason}
                  className="py-[10px] px-[14px]"
                  disabled={processing}
                />
                <PrimaryButton
                  text={t("processor.viewQuestion.acceptGathererRejection") || "Accept Gatherer's Rejection"}
                  className="py-[10px] px-5"
                  onClick={onAcceptGathererRejection}
                  disabled={processing}
                />
              </>
            ) : (
              <>
                <OutlineButton
                  text={t("processor.viewQuestion.reject")}
                  onClick={onReject}
                  className="py-[10px] px-[14px]"
                  disabled={processing}
                />
                <PrimaryButton
                  text={
                    nextDestination === 'completed'
                      ? t("processor.viewQuestion.approveQuestion")
                      : nextDestination === 'explainer'
                      ? t("processor.viewQuestion.acceptAndSendToExplainer")
                      : nextDestination === 'creator'
                      ? t("processor.viewQuestion.acceptAndSendToCreator")
                      : t("processor.viewQuestion.acceptAndSend")
                  }
                  className="py-[10px] px-5"
                  onClick={onAccept}
                  disabled={processing}
                />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default ProcessorViewHeader;
