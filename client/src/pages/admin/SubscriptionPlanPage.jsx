

// Main Component
const SubscriptionPlan = () => {


    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-[#032746]">
                            Subscription Plans
                        </h1>
                        <p className="font-roboto text-[18px] leading-[28px] text-[#6B7280]">
                            Manage available plans and their pricing
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            // onClick={handleExport}
                            className="h-[36px] w-[124px] rounded-[10px] border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-[#032746] transition hover:bg-[#F3F4F6] flex items-center justify-center gap-2"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.10357 3.51181C4.86316 3.2714 4.86316 2.88163 5.10357 2.64122L7.5651 0.179682C7.62172 0.123067 7.68994 0.0779487 7.76542 0.0467692C7.91558 -0.0155898 8.08542 -0.0155898 8.23558 0.0467692C8.31106 0.0779487 8.37908 0.123067 8.4357 0.179682L10.8972 2.64122C11.1376 2.88163 11.1376 3.2714 10.8972 3.51181C10.7774 3.63161 10.6199 3.6923 10.4623 3.6923C10.3048 3.6923 10.1472 3.63243 10.0274 3.51181L8.61619 2.10051V11.2821C8.61619 11.6217 8.34049 11.8974 8.0008 11.8974C7.66111 11.8974 7.38542 11.6217 7.38542 11.2821V2.10131L5.97416 3.51262C5.73293 3.75221 5.34398 3.75223 5.10357 3.51181ZM12.9231 5.74359C12.5834 5.74359 12.3077 6.01928 12.3077 6.35897C12.3077 6.69866 12.5834 6.97436 12.9231 6.97436C14.217 6.97436 14.7692 7.52656 14.7692 8.82051V12.9231C14.7692 14.217 14.217 14.7692 12.9231 14.7692H3.07692C1.78297 14.7692 1.23077 14.217 1.23077 12.9231V8.82051C1.23077 7.52656 1.78297 6.97436 3.07692 6.97436C3.41662 6.97436 3.69231 6.69866 3.69231 6.35897C3.69231 6.01928 3.41662 5.74359 3.07692 5.74359C1.09292 5.74359 0 6.83651 0 8.82051V12.9231C0 14.9071 1.09292 16 3.07692 16H12.9231C14.9071 16 16 14.9071 16 12.9231V8.82051C16 6.83651 14.9071 5.74359 12.9231 5.74359Z"
                                    fill="#032746"
                                />
                            </svg>
                            Export
                        </button>
                        <button
                            type="button"
                            // onClick={handleAddNew}
                            className="h-[36px] w-[180px] rounded-[10px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
                        >
                            + Add New Plan
                        </button>
                    </div>
                </header>
            </div>
        </div>
    );
};

export default SubscriptionPlan