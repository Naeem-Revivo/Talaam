import React from 'react';
import { OutlineButton, PrimaryButton } from '../common/Button';

const ProcessorHeader = ({
  t,
  handleClose,
  processing,
  canProcessQuestion,
  isFlagged,
  gathererRejectedFlag,
  nextDestination,
  setShowRejectModal,
  setShowRejectFlagModal,
  handleApproveFlagReason,
  handleAcceptGathererRejection,
  handleAcceptClick
}) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
        {t("processor.viewQuestion.title")}
      </h1>
      <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
        <OutlineButton
          text={t("processor.viewQuestion.close")}
          onClick={handleClose}
          className="py-[10px] px-[14px]"
          disabled={processing}
        />
        {/* Only show approve/reject buttons if question can still be processed */}
        {canProcessQuestion && (
          <>
            {/* Show different buttons for flagged questions OR gatherer rejected flag */}
            {isFlagged ? (
              <>
                <OutlineButton
                  text={
                    t("processor.viewQuestion.rejectReasonButton") ||
                    "Reject Reason"
                  }
                  onClick={() => setShowRejectFlagModal(true)}
                  className="py-[10px] px-[14px]"
                  disabled={processing}
                />
                <PrimaryButton
                  text={
                    t("processor.viewQuestion.approveReason") ||
                    "Approve Reason"
                  }
                  className="py-[10px] px-5"
                  onClick={handleApproveFlagReason}
                  disabled={processing}
                />
              </>
            ) : gathererRejectedFlag ? (
              <>
                <OutlineButton
                  text={
                    t("processor.viewQuestion.rejectGathererRejection") ||
                    "Reject Gatherer's Rejection"
                  }
                  onClick={() => setShowRejectFlagModal(true)}
                  className="py-[10px] px-[14px]"
                  disabled={processing}
                />
                <PrimaryButton
                  text={
                    t("processor.viewQuestion.acceptGathererRejection") ||
                    "Accept Gatherer's Rejection"
                  }
                  className="py-[10px] px-5"
                  onClick={handleAcceptGathererRejection}
                  disabled={processing}
                />
              </>
            ) : (
              <>
                <OutlineButton
                  text={t("processor.viewQuestion.reject")}
                  onClick={() => setShowRejectModal(true)}
                  className="py-[10px] px-[14px]"
                  disabled={processing}
                />
                <PrimaryButton
                  text={
                    nextDestination === "completed"
                      ? t("processor.viewQuestion.approveQuestion")
                      : nextDestination === "explainer"
                      ? t(
                          "processor.viewQuestion.acceptAndSendToExplainer"
                        )
                      : nextDestination === "creator"
                      ? t("processor.viewQuestion.acceptAndSendToCreator")
                      : t("processor.viewQuestion.acceptAndSend")
                  }
                  className="py-[10px] px-5"
                  onClick={handleAcceptClick}
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

export default ProcessorHeader;
