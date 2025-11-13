import React from "react";

const statusTone = {
  Active: {
    wrapper: "bg-[#FDF0D5]",
    text: "text-[#ED4122]",
  },
  Suspended: {
    wrapper: "bg-[#C6D8D3]",
    text: "text-[#032746]",
  },
};

const TableHeader = () => (
  <thead className="hidden md:table-header-group">
    <tr className="bg-[#032746] text-center">
      {["User Name", "Email", "Workflow Role", "System Role", "Status", "Actions"].map(
        (column) => (
          <th
            key={column}
            className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white"
          >
            {column}
          </th>
        )
      )}
    </tr>
  </thead>
);

const TableRow = ({ user, onView, onEdit }) => {
  const tone = statusTone[user.status] ?? statusTone.Active;

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-[#032746] last:border-none md:table-row">
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] capitalize text-center">
        {user.name}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-[#032746] text-center">
        {user.email}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-[#032746] text-center">
        {user.workflowRole}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-[#032746] text-center">
        {user.systemRole}
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex h-[26px] min-w-[59px] items-center justify-center rounded-md px-3 text-sm font-normal ${tone.wrapper} ${tone.text}`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onView?.(user)}
            className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
            aria-label={`View ${user.name}`}
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
          <button
            type="button"
            onClick={() => onEdit?.(user)}
            className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
            aria-label={`Edit ${user.name}`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3967 6.00174C11.2376 6.00174 11.085 6.06493 10.9726 6.17742C10.8601 6.28991 10.7969 6.44248 10.7969 6.60157V10.2005C10.7969 10.3596 10.7337 10.5122 10.6212 10.6247C10.5087 10.7372 10.3561 10.8003 10.197 10.8003H1.79948C1.64039 10.8003 1.48783 10.7372 1.37534 10.6247C1.26285 10.5122 1.19965 10.3596 1.19965 10.2005V1.80296C1.19965 1.64387 1.26285 1.4913 1.37534 1.37882C1.48783 1.26633 1.64039 1.20313 1.79948 1.20313H5.39843C5.55752 1.20313 5.71009 1.13993 5.82258 1.02745C5.93507 0.914956 5.99826 0.762388 5.99826 0.603304C5.99826 0.44422 5.93507 0.291652 5.82258 0.179163C5.71009 0.0666738 5.55752 0.003478 5.39843 0.003478H1.79948C1.32223 0.003478 0.864523 0.193065 0.527055 0.530533C0.189587 0.868001 0 1.3257 0 1.80296V10.2005C0 10.6778 0.189587 11.1355 0.527055 11.4729C0.864523 11.8104 1.32223 12 1.79948 12H10.197C10.6743 12 11.132 11.8104 11.4695 11.4729C11.8069 11.1355 11.9965 10.6778 11.9965 10.2005V6.60157C11.9965 6.44248 11.9333 6.28991 11.8208 6.17742C11.7083 6.06493 11.5558 6.00174 11.3967 6.00174ZM2.3993 6.45761V9.00087C2.3993 9.15995 2.4625 9.31252 2.57499 9.42501C2.68748 9.5375 2.84005 9.6007 2.99913 9.6007H5.54239C5.62133 9.60115 5.69959 9.58602 5.77267 9.55617C5.84575 9.52632 5.91222 9.48234 5.96827 9.42675L10.1191 5.26995L11.8226 3.60243C11.8788 3.54667 11.9234 3.48033 11.9539 3.40724C11.9843 3.33414 12 3.25574 12 3.17656C12 3.09737 11.9843 3.01897 11.9539 2.94588C11.9234 2.87278 11.8788 2.80644 11.8226 2.75068L9.27931 0.177428C9.22355 0.121207 9.15721 0.0765832 9.08411 0.0461308C9.01102 0.0156784 8.93262 0 8.85343 0C8.77425 0 8.69585 0.0156784 8.62275 0.0461308C8.54966 0.0765832 8.48332 0.121207 8.42756 0.177428L6.73605 1.87494L2.57325 6.03173C2.51766 6.08778 2.47368 6.15425 2.44383 6.22733C2.41398 6.30041 2.39885 6.37867 2.3993 6.45761ZM8.85343 1.44906L10.5509 3.14657L9.69919 3.99832L8.00168 2.30081L8.85343 1.44906ZM3.59896 6.70354L7.15593 3.14657L8.85343 4.84407L5.29646 8.40104H3.59896V6.70354Z"
                fill="#032746"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

const mobileIcons = {
  user: (
    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M6.00699 6.53846C4.19228 6.53846 2.71667 5.07154 2.71667 3.26923C2.71667 1.46692 4.19228 0 6.00699 0C7.8217 0 9.29732 1.46692 9.29732 3.26923C9.29732 5.07154 7.8217 6.53846 6.00699 6.53846ZM6.00699 1.15385C4.83254 1.15385 3.87796 2.10231 3.87796 3.26923C3.87796 4.43615 4.83254 5.38462 6.00699 5.38462C7.18144 5.38462 8.13603 4.43615 8.13603 3.26923C8.13603 2.10231 7.18067 1.15385 6.00699 1.15385ZM9.09441 15H2.90559C1.03204 15 0 13.9808 0 12.13C0 10.0831 1.16594 7.69231 4.45161 7.69231H7.54839C10.8341 7.69231 12 10.0823 12 12.13C12 13.9808 10.968 15 9.09441 15ZM4.45161 8.84615C1.39897 8.84615 1.16129 11.3593 1.16129 12.13C1.16129 13.3331 1.68314 13.8462 2.90559 13.8462H9.09441C10.3169 13.8462 10.8387 13.3331 10.8387 12.13C10.8387 11.36 10.601 8.84615 7.54839 8.84615H4.45161Z"
        fill="#032746"
      />
    </svg>
  ),
  email: (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M9.69231 10H2.30769C0.819692 10 0 9.19273 0 7.72727V2.27273C0 0.807273 0.819692 0 2.30769 0H9.69231C11.1803 0 12 0.807273 12 2.27273V7.72727C12 9.19273 11.1803 10 9.69231 10ZM2.30769 0.909091C1.33723 0.909091 0.923077 1.31697 0.923077 2.27273V7.72727C0.923077 8.68303 1.33723 9.09091 2.30769 9.09091H9.69231C10.6628 9.09091 11.0769 8.68303 11.0769 7.72727V2.27273C11.0769 1.31697 10.6628 0.909091 9.69231 0.909091H2.30769ZM6.63326 5.41152L9.65595 3.24666C9.8621 3.09939 9.90767 2.81455 9.75751 2.61152C9.60797 2.40909 9.32007 2.36303 9.11268 2.51151L6.08984 4.67637C6.03569 4.71515 5.96371 4.71515 5.90956 4.67637L2.88672 2.51151C2.67872 2.36303 2.39143 2.4097 2.24189 2.61152C2.09173 2.81455 2.1373 3.09878 2.34345 3.24666L5.36614 5.41212C5.55567 5.54787 5.77786 5.61515 5.9994 5.61515C6.22094 5.61515 6.44434 5.54727 6.63326 5.41152Z"
        fill="#032746"
      />
    </svg>
  ),
  workflow: (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M1.87805 13H4.26829C4.73883 13 5.12195 12.626 5.12195 12.1667V11.1667C5.12195 10.7073 5.50507 10.3333 5.97561 10.3333C6.44615 10.3333 6.82927 10.7073 6.82927 11.1667V12.1667C6.82927 12.626 7.21239 13 7.68293 13H9.39024C10.4262 13 11.2683 12.1773 11.2683 11.1667V9.66667H12.122C13.158 9.66667 14 8.844 14 7.83333C14 6.82267 13.158 6 12.122 6H11.2683V4.5C11.2683 3.48933 10.4262 2.66667 9.39024 2.66667H7.85366V1.83333C7.85366 0.822667 7.01161 0 5.97561 0C4.93961 0 4.09756 0.822667 4.09756 1.83333V2.66667H1.87805C0.842049 2.66667 0 3.48933 0 4.5V6.16667C0 6.626 0.383121 7 0.853659 7H1.87805C2.34859 7 2.73171 7.374 2.73171 7.83333C2.73171 8.29267 2.34859 8.66667 1.87805 8.66667H0.853659C0.383121 8.66667 0 9.04067 0 9.5V11.1667C0 12.1773 0.842049 13 1.87805 13Z"
        fill="#032746"
      />
    </svg>
  ),
  system: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4.54193 4.97561C5.91405 4.97561 7.02977 3.85932 7.02977 2.4878C7.02977 1.11629 5.91405 0 4.54193 0C3.16982 0 2.0541 1.11629 2.0541 2.4878C2.0541 3.85932 3.16982 4.97561 4.54193 4.97561ZM4.54193 0.878049C5.42995 0.878049 6.15171 1.5998 6.15171 2.4878C6.15171 3.3758 5.42995 4.09756 4.54193 4.09756C3.65392 4.09756 2.93216 3.3758 2.93216 2.4878C2.93216 1.5998 3.65392 0.878049 4.54193 0.878049ZM6.2231 6.76686C6.07558 6.74286 5.90701 6.73171 5.70739 6.73171H3.3659C1.05777 6.73171 0.87806 8.64528 0.87806 9.23123C0.87806 10.1462 1.27202 10.5366 2.19515 10.5366H5.12202C5.36436 10.5366 5.56105 10.7333 5.56105 10.9756C5.56105 11.218 5.36436 11.4146 5.12202 11.4146H2.19515C0.779718 11.4146 0 10.639 0 9.23123C0 7.67299 0.881573 5.85366 3.3659 5.85366H5.70739C5.95384 5.85366 6.16809 5.86885 6.36244 5.90046C6.60185 5.93851 6.76516 6.16388 6.72594 6.4033C6.68789 6.64271 6.45549 6.80491 6.2231 6.76686ZM11.6975 8.92569L11.7754 8.88231C11.879 8.82436 11.9545 8.72721 11.9849 8.61307C12.016 8.49833 11.9984 8.37658 11.9381 8.27472L11.4019 7.37445C11.2802 7.17016 11.0197 7.09992 10.8101 7.21582L10.7322 7.25912C10.6169 7.3241 10.4723 7.32468 10.3552 7.25912C10.2458 7.19766 10.1779 7.08527 10.1779 6.96644C10.1779 6.6761 9.94083 6.44017 9.64873 6.44017H8.7566C8.46449 6.44017 8.22746 6.6761 8.22746 6.96644C8.22746 7.08585 8.1595 7.19766 8.05003 7.25912C7.93354 7.32468 7.789 7.32468 7.6731 7.25912C7.42373 7.12039 7.10529 7.20525 6.95953 7.44877L6.51285 8.19862C6.44085 8.31862 6.41978 8.46556 6.4549 8.60078C6.49061 8.73658 6.58136 8.85481 6.70429 8.92447C6.70838 8.92623 6.71191 8.92856 6.716 8.9309C6.82079 8.99354 6.88514 9.10302 6.88514 9.21951C6.88573 9.33951 6.81783 9.45248 6.70486 9.5157C6.58251 9.58535 6.49177 9.70303 6.45547 9.83825C6.41918 9.97464 6.43912 10.1175 6.51171 10.2404L6.9601 10.9914C7.10762 11.2384 7.4202 11.3221 7.67367 11.1805C7.78899 11.1155 7.93296 11.1155 8.05003 11.181C8.1595 11.2425 8.22682 11.3543 8.22682 11.4737C8.22682 11.7641 8.46394 12 8.75545 12H9.6493C9.94082 12 10.1779 11.7641 10.1779 11.4737C10.1779 11.3543 10.2458 11.2425 10.3552 11.181C10.4717 11.1155 10.6163 11.1155 10.7322 11.181C10.9822 11.3198 11.2995 11.2349 11.4458 10.9914L11.8954 10.2375C11.9668 10.1157 11.9861 9.97349 11.9498 9.8371C11.9135 9.70013 11.8246 9.58594 11.701 9.5157C11.6975 9.51394 11.6934 9.51159 11.6899 9.50984C11.5851 9.4472 11.5208 9.33714 11.5208 9.22066C11.5213 9.10007 11.5892 8.98715 11.6975 8.92569Z"
        fill="#032746"
      />
    </svg>
  ),
  status: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M5.99933 3.6915C4.72658 3.6915 3.69139 4.72652 3.69139 5.99907C3.69139 7.27162 4.72658 8.30664 5.99933 8.30664C7.27208 8.30664 8.30727 7.27162 8.30727 5.99907C8.30727 4.72652 7.27208 3.6915 5.99933 3.6915ZM5.99933 7.38362C5.23555 7.38362 4.61456 6.76272 4.61456 5.99907C4.61456 5.23542 5.23555 4.61453 5.99933 4.61453C6.76311 4.61453 7.3841 5.23542 7.3841 5.99907C7.3841 6.76272 6.76311 7.38362 5.99933 7.38362Z"
        fill="#032746"
      />
      <path
        d="M11.6664 7.20086C11.2393 6.95349 10.9734 6.4932 10.9728 5.99907C10.9722 5.50617 11.2362 5.04651 11.6689 4.79606C11.9858 4.61207 12.0942 4.20408 11.9108 3.88656L10.8817 2.11066C10.6983 1.79375 10.2903 1.68484 9.97268 1.8676C9.54248 2.11559 9.00766 2.11559 8.57623 1.86514C8.15096 1.61838 7.88631 1.15994 7.88631 0.668272C7.88631 0.299676 7.58597 0 7.21731 0H4.78319C4.41392 0 4.11421 0.299676 4.11421 0.668272C4.11421 1.15994 3.84955 1.61837 3.42305 1.86636C2.99285 2.11558 2.45864 2.11619 2.02844 1.8682C1.71025 1.68482 1.30283 1.79437 1.11942 2.11128L0.089149 3.88903C-0.0942556 4.20594 0.0146713 4.61329 0.334706 4.79913C0.761214 5.04588 1.0271 5.50555 1.02833 5.99845C1.02956 6.49196 0.764913 6.95287 0.332866 7.20332C0.179003 7.29254 0.0682226 7.43591 0.0226792 7.60821C-0.0228642 7.7799 0.000528343 7.95897 0.0897688 8.11343L1.11818 9.88811C1.30159 10.2056 1.70963 10.3158 2.02844 10.1318C2.45864 9.8838 2.99224 9.88442 3.41628 10.1299C3.84894 10.381 4.11296 10.8394 4.11235 11.3317C4.11235 11.7003 4.41207 12 4.78073 12H7.21731C7.58597 12 7.88569 11.7003 7.88569 11.3323C7.88569 10.84 8.15033 10.3816 8.57745 10.1336C9.00704 9.88441 9.54125 9.88318 9.97206 10.1318C10.2896 10.3152 10.6971 10.2062 10.8811 9.88933L11.9114 8.11159C12.0941 7.79345 11.9852 7.38546 11.6664 7.20086Z"
        fill="#032746"
      />
    </svg>
  ),
};

const MobileUserCard = ({ user, onView, onEdit }) => {
  const tone = statusTone[user.status] ?? statusTone.Active;

  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_6px_24px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex flex-col gap-3 text-[#032746]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F4FA]">{mobileIcons.user}</span>
          <p className="text-[16px] font-archivo font-semibold leading-[20px]">{user.name}</p>
        </div>
        <div className="flex items-center gap-3 text-[#1F2937]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F4FA]">{mobileIcons.email}</span>
          <p className="text-[14px] font-roboto leading-[18px]">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F4FA]">{mobileIcons.workflow}</span>
          <p className="text-[14px] font-roboto leading-[18px]">{user.workflowRole}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F4FA]">{mobileIcons.system}</span>
          <p className="text-[14px] font-roboto leading-[18px]">{user.systemRole}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F4FA]">{mobileIcons.status}</span>
          <span
            className={`inline-flex h-[28px] min-w-[62px] items-center justify-center rounded-md px-3 text-xs font-semibold ${tone.wrapper} ${tone.text}`}
          >
            {user.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onView?.(user)}
            className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
            aria-label={`View ${user.name}`}
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
          <button
            type="button"
            onClick={() => onEdit?.(user)}
            className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
            aria-label={`Edit ${user.name}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.3967 6.00174C11.2376 6.00174 11.085 6.06493 10.9726 6.17742C10.8601 6.28991 10.7969 6.44248 10.7969 6.60157V10.2005C10.7969 10.3596 10.7337 10.5122 10.6212 10.6247C10.5087 10.7372 10.3561 10.8003 10.197 10.8003H1.79948C1.64039 10.8003 1.48783 10.7372 1.37534 10.6247C1.26285 10.5122 1.19965 10.3596 1.19965 10.2005V1.80296C1.19965 1.64387 1.26285 1.4913 1.37534 1.37882C1.48783 1.26633 1.64039 1.20313 1.79948 1.20313H5.39843C5.55752 1.20313 5.71009 1.13993 5.82258 1.02745C5.93507 0.914956 5.99826 0.762388 5.99826 0.603304C5.99826 0.44422 5.93507 0.291652 5.82258 0.179163C5.71009 0.0666738 5.55752 0.003478 5.39843 0.003478H1.79948C1.32223 0.003478 0.864523 0.193065 0.527055 0.530533C0.189587 0.868001 0.000365662 1.3257 0.000365662 1.80296V10.2005C0.000365662 10.6778 0.189952 11.1355 0.52742 11.4729C0.864888 11.8104 1.32259 12 1.79984 12H10.1974C10.6747 12 11.1324 11.8104 11.4699 11.4729C11.8073 11.1355 11.9969 10.6778 11.9969 10.2005V6.60157C11.9969 6.44248 11.9337 6.28991 11.8212 6.17742C11.7087 6.06493 11.5561 6.00174 11.397 6.00174ZM2.39966 6.45761V9.00087C2.39966 9.15995 2.46286 9.31252 2.57535 9.42501C2.68784 9.5375 2.84041 9.6007 2.99949 9.6007H5.54274C5.62169 9.60115 5.69995 9.58602 5.77303 9.55617C5.84611 9.52632 5.91257 9.48234 5.96862 9.42675L10.1195 5.26995L11.823 3.60243C11.8792 3.54667 11.9238 3.48033 11.9543 3.40724C11.9847 3.33414 12.0004 3.25574 12.0004 3.17656C12.0004 3.09737 11.9847 3.01897 11.9543 2.94588C11.9238 2.87278 11.8792 2.80644 11.823 2.75068L9.27967 0.177428C9.22391 0.121207 9.15757 0.0765832 9.08447 0.0461308C9.01138 0.0156784 8.93298 0 8.85379 0C8.77461 0 8.69621 0.0156784 8.62311 0.0461308C8.55002 0.0765832 8.48368 0.121207 8.42792 0.177428L6.7364 1.87494L2.57361 6.03173C2.51802 6.08778 2.47404 6.15425 2.44419 6.22733C2.41434 6.30041 2.39921 6.37867 2.39966 6.45761ZM8.85379 1.44906L10.5513 3.14657L9.69955 3.99832L8.00204 2.30081L8.85379 1.44906ZM3.59931 6.70354L7.15629 3.14657L8.85379 4.84407L5.29681 8.40104H3.59931V6.70354Z"
                fill="#032746"
              />
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
    <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-[#032746] md:flex-row md:items-center md:justify-between md:bg-[#032746] md:px-6 md:text-white">
      <p className="text-[12px] font-roboto font-medium leading-[18px] tracking-[3%]">
        Showing {firstItem} to {lastItem} of {total} results
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 1}
          className={`flex h-[27.16px] w-[78px] items-center justify-center font-medium rounded border text-[14px] font-archivo leading-[16px] transition-colors ${
            page === 1
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          Previous
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange?.(pageNumber)}
            className={`flex h-8 w-8 items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
              pageNumber === page
                ? "border-[#ED4122] bg-[#ED4122] text-white"
                : "border-[#E5E7EB] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-[#032746]"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          onClick={handleNext}
          disabled={page === safeTotalPages}
          className={`flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-normal leading-[16px] transition-colors ${
            page === safeTotalPages
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const UserTable = ({
  users,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
}) => {
  return (
    <section className="w-full overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_6px_54px_rgba(0,0,0,0.05)] md:min-h-[348px]">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse">
          <TableHeader />
          <tbody>
            {users.length ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  user={user}
                  onView={onView}
                  onEdit={onEdit}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-[#6B7280]"
                >
                  No users match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 p-2 md:hidden">
        {users.length ? (
          users.map((user) => (
            <MobileUserCard key={user.id} user={user} onView={onView} onEdit={onEdit} />
          ))
        ) : (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-[#6B7280] shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
            No users match the current filters.
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

UserTable.defaultProps = {
  users: [],
  page: 1,
  pageSize: 10,
  total: 0,
};

export default UserTable;


