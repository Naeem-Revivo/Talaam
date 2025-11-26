import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../common/Button";

// ReviewFeedback.jsx
const ReviewFeedback = ({ title, message, author, onDismiss, onEdit }) => {
  const { t } = useLanguage();
  return (
    <div className="border-2 border-dashed border-[#ED4122] rounded-[12px] p-10 bg-white">
      <div className="flex items-center gap-3 mb-2">
        <span className="mt-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.2507 0H5.84665C3.35065 0 2.73967 1.21303 2.28867 2.56403L0.289646 8.56403C-0.178354 9.96803 -0.0763194 11.239 0.574681 12.142C1.02068 12.762 1.95165 13.5 3.84665 13.5H7.00266V15.987C7.00266 17.243 7.62673 18.4091 8.67173 19.1071C9.06173 19.3671 9.51069 19.501 9.96469 19.501C10.2057 19.501 10.4477 19.463 10.6847 19.387C11.3687 19.167 11.9047 18.656 12.1657 17.955L14.2937 11.5H17.2497C18.4897 11.5 19.4997 10.491 19.4997 9.25V2.25C19.5007 1.009 18.4907 0 17.2507 0ZM13.0396 10.515L10.7527 17.456C10.6617 17.697 10.4707 17.88 10.2257 17.959C9.97968 18.038 9.71773 18.001 9.50473 17.859C8.87773 17.441 8.50376 16.741 8.50376 15.987V12.75C8.50376 12.336 8.16776 12 7.75376 12H3.84775C3.15175 12 2.22972 11.873 1.79172 11.265C1.43572 10.77 1.40572 9.95902 1.71372 9.03802L3.71274 3.03802C4.06774 1.97102 4.29065 1.49902 5.84665 1.49902H13.7507V9.99902C13.4267 10.001 13.1406 10.208 13.0396 10.515ZM18.0007 9.25C18.0007 9.664 17.6637 10 17.2507 10H15.2507V1.5H17.2507C17.6637 1.5 18.0007 1.836 18.0007 2.25V9.25Z"
              fill="#012149"
            />
          </svg>
        </span>

        <h3 className="font-bold text-blue-dark text-[18px] leading-[32px] font-archivo">
          {title}
        </h3>
      </div>

      <div className="ml-7 mb-14">
        <p className="text-[16px] leading-5 text-blue-dark font-normal font-roboto">
          {message}
        </p>
        <p className="text-[16px] leading-5 text-blue-dark font-normal font-roboto">
          - {author}
        </p>
      </div>

      <div className="flex justify-end gap-3 ml-7">
        <OutlineButton
          text={t("gatherer.questionBank.feedback.dismiss")}
          onClick={onDismiss}
          className="py-[10px] px-[14px] w-[176px]"
        />

        <PrimaryButton
          text={t("gatherer.questionBank.feedback.editQuestion")}
          className="py-[10px] px-5 w-[176px]"
          onClick={onEdit}
        />
      </div>
    </div>
  );
};

export default ReviewFeedback;
