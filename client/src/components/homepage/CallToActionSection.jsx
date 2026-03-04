import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { starvalue, rightarrow } from "../../assets/svg";

const CallToActionSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <div className="w-full mobile:h-auto tablet:h-auto laptop:h-auto bg-[#F8FAFC] flex items-center justify-center py-[48px] laptop:py-[64px]">
      <div className="max-w-[1071px] mx-auto w-full px-4 md:px-8 lg:px-12">
        {/* Dark Container */}
        <div className="bg-gradient-to-t from-[#173B50] to-[#0F2D46] rounded-[48px] shadow-lg mobile:p-8 tablet:p-12 laptop:px-[120px] laptop:py-[80px] flex flex-col items-center text-center space-y-[40px]">
          {/* Top Badge */}
          <div className="bg-[#FFFFFF26] border border-[#FFFFFF4D] rounded-full px-6 py-3 flex items-center gap-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_30_442)">
                <path d="M6.6243 10.3334C6.56478 10.1027 6.44453 9.89215 6.27605 9.72367C6.10757 9.55519 5.89702 9.43494 5.6663 9.37542L1.5763 8.32075C1.50652 8.30095 1.44511 8.25892 1.40138 8.20105C1.35765 8.14318 1.33398 8.07262 1.33398 8.00008C1.33398 7.92755 1.35765 7.85699 1.40138 7.79912C1.44511 7.74125 1.50652 7.69922 1.5763 7.67942L5.6663 6.62408C5.89693 6.56462 6.10743 6.44447 6.2759 6.27611C6.44438 6.10775 6.56468 5.89734 6.6243 5.66675L7.67897 1.57675C7.69857 1.5067 7.74056 1.44498 7.79851 1.40101C7.85647 1.35705 7.92722 1.33325 7.99997 1.33325C8.07271 1.33325 8.14346 1.35705 8.20142 1.40101C8.25938 1.44498 8.30136 1.5067 8.32097 1.57675L9.37497 5.66675C9.43449 5.89747 9.55474 6.10802 9.72322 6.2765C9.8917 6.44498 10.1023 6.56523 10.333 6.62475L14.423 7.67875C14.4933 7.69815 14.5553 7.74009 14.5995 7.79814C14.6437 7.85618 14.6677 7.92713 14.6677 8.00008C14.6677 8.07304 14.6437 8.14399 14.5995 8.20203C14.5553 8.26008 14.4933 8.30202 14.423 8.32142L10.333 9.37542C10.1023 9.43494 9.8917 9.55519 9.72322 9.72367C9.55474 9.89215 9.43449 10.1027 9.37497 10.3334L8.3203 14.4234C8.3007 14.4935 8.25871 14.5552 8.20075 14.5992C8.1428 14.6431 8.07205 14.6669 7.9993 14.6669C7.92656 14.6669 7.85581 14.6431 7.79785 14.5992C7.73989 14.5552 7.69791 14.4935 7.6783 14.4234L6.6243 10.3334Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.333 2V4.66667" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.6667 3.33325H12" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.66699 11.3333V12.6666" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.33333 12H2" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_30_442">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span className="font-roboto font-bold text-white text-sm">
              {t('homepage.cta.badge')}
            </span>
          </div>

          {/* Main Heading */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="font-roboto font-bold text-[48px] leading-[48px] tracking-[0.35px] text-white">
              {t('homepage.cta.title')}
            </h2>

            {/* Subtitle */}
            <p className="font-roboto font-normal  mx-auto mobile:text-[14px] mobile:leading-[140%] tablet:text-[16px] tablet:leading-[140%] laptop:text-[18px] laptop:leading-[28px] tracking-[-0.44px ] text-[#FFFFFFE5] mt-[16px]">
              {t('homepage.cta.subtitle')}
            </p>
          </div>

          {/* Call-to-Action Button */}
          <button
            onClick={() => navigate("/create-account")}
            className="bg-gradient-to-r from-[#ED4122] to-[#DC2626] shadow-lg font-roboto font-semibold text-[20px] leading-[28px] tracking-[-0.45px] mobile:px-8 mobile:py-4 tablet:px-10 tablet:py-4 laptop:px-12 laptop:py-5 rounded-[16px] mobile:w-auto tablet:w-auto flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
          >
            {t('homepage.cta.button')}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 5L19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </button>

          {/* Bottom Features */}
          <div className="flex mobile:flex-col tablet:flex-row laptop:flex-row items-center justify-center gap-6 mobile:gap-4 tablet:gap-6 laptop:gap-8">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.04897 2.92708C9.34897 2.00608 10.652 2.00608 10.951 2.92708L12.021 6.21908C12.0863 6.41957 12.2134 6.59426 12.384 6.71818C12.5547 6.84211 12.7601 6.90892 12.971 6.90908H16.433C17.402 6.90908 17.804 8.14908 17.021 8.71908L14.221 10.7531C14.05 10.8771 13.9227 11.0521 13.8573 11.2529C13.7919 11.4538 13.7918 11.6702 13.857 11.8711L14.927 15.1631C15.227 16.0841 14.172 16.8511 13.387 16.2811L10.587 14.2471C10.4162 14.1231 10.2105 14.0563 9.99947 14.0563C9.78842 14.0563 9.58277 14.1231 9.41197 14.2471L6.61197 16.2811C5.82797 16.8511 4.77397 16.0841 5.07297 15.1631L6.14297 11.8711C6.20815 11.6702 6.20803 11.4538 6.14264 11.2529C6.07725 11.0521 5.94994 10.8771 5.77897 10.7531L2.97997 8.72008C2.19697 8.15008 2.59997 6.91008 3.56797 6.91008H7.02897C7.24002 6.91013 7.44568 6.84342 7.6165 6.71948C7.78732 6.59554 7.91455 6.42073 7.97997 6.22008L9.04997 2.92808L9.04897 2.92708Z" fill="#ED4122" />
              </svg>

              <span className="font-roboto font-semibold text-[#FFFFFFCC] text-sm tracking-[-0.15px]">
                {t('homepage.cta.feature1')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM13.707 8.707C13.8892 8.5184 13.99 8.2658 13.9877 8.0036C13.9854 7.7414 13.8802 7.49059 13.6948 7.30518C13.5094 7.11977 13.2586 7.0146 12.9964 7.01233C12.7342 7.01005 12.4816 7.11084 12.293 7.293L9 10.586L7.707 9.293C7.5184 9.11084 7.2658 9.01005 7.0036 9.01233C6.7414 9.0146 6.49059 9.11977 6.30518 9.30518C6.11977 9.49059 6.0146 9.7414 6.01233 10.0036C6.01005 10.2658 6.11084 10.5184 6.293 10.707L8.293 12.707C8.48053 12.8945 8.73484 12.9998 9 12.9998C9.26516 12.9998 9.51947 12.8945 9.707 12.707L13.707 8.707Z" fill="#ED4122" />
              </svg>

              <span className="font-roboto font-semibold text-[#FFFFFFCC] text-sm tracking-[-0.15px]">
                {t('homepage.cta.feature2')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4897 3.17C11.1097 1.61 8.88975 1.61 8.50975 3.17C8.45302 3.40442 8.34174 3.62213 8.18497 3.80541C8.02821 3.9887 7.83038 4.13238 7.60759 4.22477C7.38481 4.31716 7.14336 4.35564 6.90289 4.33709C6.66242 4.31854 6.42973 4.24347 6.22375 4.118C4.85175 3.282 3.28175 4.852 4.11775 6.224C4.65775 7.11 4.17875 8.266 3.17075 8.511C1.60975 8.89 1.60975 11.111 3.17075 11.489C3.40523 11.5458 3.62298 11.6572 3.80626 11.8141C3.98955 11.971 4.13319 12.1689 4.22549 12.3918C4.31779 12.6147 4.35614 12.8563 4.33742 13.0968C4.3187 13.3373 4.24343 13.5701 4.11775 13.776C3.28175 15.148 4.85175 16.718 6.22375 15.882C6.42969 15.7563 6.6624 15.6811 6.90293 15.6623C7.14347 15.6436 7.38502 15.682 7.60793 15.7743C7.83084 15.8666 8.02879 16.0102 8.18568 16.1935C8.34256 16.3768 8.45394 16.5945 8.51075 16.829C8.88975 18.39 11.1108 18.39 11.4888 16.829C11.5457 16.5946 11.6572 16.377 11.8142 16.1939C11.9711 16.0107 12.169 15.8672 12.3918 15.7749C12.6147 15.6826 12.8561 15.6442 13.0966 15.6628C13.3371 15.6815 13.5698 15.7565 13.7758 15.882C15.1477 16.718 16.7178 15.148 15.8818 13.776C15.7563 13.57 15.6812 13.3373 15.6626 13.0969C15.644 12.8564 15.6824 12.6149 15.7747 12.3921C15.8669 12.1692 16.0105 11.9713 16.1936 11.8144C16.3768 11.6575 16.5944 11.546 16.8288 11.489C18.3898 11.11 18.3898 8.889 16.8288 8.511C16.5943 8.45419 16.3765 8.34281 16.1932 8.18593C16.01 8.02904 15.8663 7.83109 15.774 7.60818C15.6817 7.38527 15.6434 7.14372 15.6621 6.90318C15.6808 6.66265 15.7561 6.42994 15.8818 6.224C16.7178 4.852 15.1477 3.282 13.7758 4.118C13.5698 4.24368 13.3371 4.31895 13.0966 4.33767C12.856 4.35639 12.6145 4.31804 12.3916 4.22574C12.1687 4.13344 11.9707 3.9898 11.8138 3.80651C11.6569 3.62323 11.5456 3.40548 11.4888 3.171L11.4897 3.17ZM9.99975 13C10.7954 13 11.5585 12.6839 12.1211 12.1213C12.6837 11.5587 12.9998 10.7956 12.9998 10C12.9998 9.20435 12.6837 8.44129 12.1211 7.87868C11.5585 7.31607 10.7954 7 9.99975 7C9.2041 7 8.44104 7.31607 7.87843 7.87868C7.31582 8.44129 6.99975 9.20435 6.99975 10C6.99975 10.7956 7.31582 11.5587 7.87843 12.1213C8.44104 12.6839 9.2041 13 9.99975 13Z" fill="#ED4122" />
              </svg>

              <span className="font-roboto font-semibold text-[#FFFFFFCC] text-sm tracking-[-0.15px]">
                {t('homepage.cta.feature3')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;
