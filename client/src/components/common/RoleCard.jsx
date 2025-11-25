export const RoleCard = ({ role, tasks, pendingCount }) => {
  return (
    <div className="rounded-[14px] shadow-[0px_4px_50px_0px_#0327461F] border border-[#03274633] overflow-hidden w-full">
      <div className="border-b border-[#CDD4DA] pt-12 pb-6 py-4 text-center">
        <h2 className="text-[24px] leading-[100%] font-bold text-blue-dark text-archivo">Role: {role}</h2>
      </div>

      <div className="px-10 py-10">
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <li key={index} className="flex items-center">
              <span className="text-[#ED4122] mr-3 flex-shrink-0 mb-1">●</span>
              <span className="text-[#6B7280] text-[14px] leading-[100%] font-normal font-roboto text-sm">{task}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[#CDD4DA] px-10 py-10">
        <p className="text-[14px] leading-[100%] font-normal font-roboto text-[#6B7280]">Pending Tasks: <span className="font-medium">{pendingCount}</span></p>
      </div>
    </div>
  );
};
