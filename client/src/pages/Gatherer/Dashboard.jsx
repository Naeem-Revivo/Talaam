import { OutlineButton, PrimaryButton } from "../../components/common/Button";

const Dashboard = () => {

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              Dashboard
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              Welcome back, John Doe submit question and track your review progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">

            <PrimaryButton text="Continue to Question Bank" className="py-[10px] px-10"/>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Dashboard;
