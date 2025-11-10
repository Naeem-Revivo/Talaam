import React from 'react';
import { headcard1, headcard2, headcard3, headcard4 } from '../../assets/svg/dashboard/admin';

const stats = [
  {
    title: 'Total Users',
    value: '12,800',
    delta: '+12% from last month',
    deltaColor: 'text-[#F97316]',
    icon: headcard1,
  },
  {
    title: 'Verified Users',
    value: '9,234',
    delta: '72% verification rate',
    deltaColor: 'text-[#0EA5E9]',
    icon: headcard2,
  },
  {
    title: 'Active Subscriptions',
    value: '3,456',
    delta: '+8% this week',
    deltaColor: 'text-[#22C55E]',
    icon: headcard3,
  },
  {
    title: 'Revenue',
    value: '$89,432',
    delta: '+15% this month',
    deltaColor: 'text-[#EF4444]',
    icon: headcard4,
  },
];

const latestSignups = [
  {
    name: 'Sarah Ahmad',
    email: 'sarah.ahmad@gmail.com',
    time: '2 min ago',
    avatarColor: 'bg-[#FDE68A]',
  },
  {
    name: 'Emily Davis',
    email: 'emilydavis@gmail.com',
    time: '15 min ago',
    avatarColor: 'bg-[#BFDBFE]',
  },
  {
    name: 'Emily Davis',
    email: 'emilydavis@gmail.com',
    time: '30 min ago',
    avatarColor: 'bg-[#C4B5FD]',
  },
];

const notifications = [
  {
    title: 'High Server Load',
    description: 'CPU usage above 85%',
    time: '10 min ago',
    color: 'bg-[#FEE2E2]',
    dot: 'bg-[#EF4444]',
  },
  {
    title: 'Scheduled Maintenance',
    description: 'Database backup at 2 AM',
    time: '1 hr ago',
    color: 'bg-[#E0F2FE]',
    dot: 'bg-[#0EA5E9]',
  },
  {
    title: 'Backup Completed',
    description: 'Daily backup successful',
    time: '1 day ago',
    color: 'bg-[#DCFCE7]',
    dot: 'bg-[#22C55E]',
  },
];

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FB] px-6 py-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="font-archivo font-bold text-[36px] leading-[40px] text-[#032746]">
            Dashboard Overview
          </h1>
          <p className="font-roboto text-[18px] leading-[28px] text-[#6B7280]">
            Monitor system activity and key metrics
          </p>
        </header>

        {/* Stats */}
        <section className="flex flex-wrap gap-7">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-[8px] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] border border-[#E5E7EB] px-4 py-5 flex flex-col gap-4 w-[262px] h-[130px]"
            >
              <div className="flex items-center justify-between px-3">
              <div className="space-y-2">
                <p className="text-sm text-[#6B7280] font-roboto">{item.title}</p>
                  <p className="font-archivo font-semibold text-[30px] leading-[28px] text-[#032746]">
                    {item.value}
                  </p>
                  <p className="font-roboto text-[16px] leading-[20px] text-[#ED4122]">
                    {item.delta}
                  </p>
              </div>
              <div className="w-10 h-10 rounded-[6px] flex items-center justify-center bg-[#ED4122]">
                <img src={item.icon} alt={item.title} className="" />
              </div>
              </div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-[8px] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-archivo font-semibold text-oxford-blue">
                  User Growth Trend
                </h3>
                <p className="text-sm text-[#6B7280] font-roboto">Monthly active users</p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#E5E7EB] hover:bg-gray-50 transition">
                <span className="sr-only">More</span>
                <div className="w-5 h-5 flex flex-col justify-between">
                  <span className="block w-full h-[2px] bg-[#9CA3AF]" />
                  <span className="block w-full h-[2px] bg-[#9CA3AF]" />
                  <span className="block w-full h-[2px] bg-[#9CA3AF]" />
                </div>
              </button>
            </div>
            <div className="mt-8">
              <div className="h-[240px] relative">
                <svg viewBox="0 0 460 240" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="460" height="240" fill="url(#gridPattern)" />
                  <path
                    d="M30 200 L80 190 L130 170 L180 150 L230 120 L280 100 L330 80 L380 60 L430 45"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M30 200 Q80 190 130 170 T230 120 330 80 430 45 L430 240 L30 240 Z"
                    fill="url(#growthGradient)"
                  />
                  {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((label, idx) => (
                    <text
                      key={label}
                      x={30 + idx * 80}
                      y={220}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="12"
                      fontFamily="Roboto"
                    >
                      {label}
                    </text>
                  ))}
                  {[0, 5, 10, 15].map((value, idx) => (
                    <text
                      key={value}
                      x={10}
                      y={200 - idx * 50}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="12"
                      fontFamily="Roboto"
                    >
                      {value}k
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>
          <div className="rounded-[8px] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-6 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-archivo font-semibold text-oxford-blue">Subscription Plans</h3>
                <p className="text-sm text-[#6B7280] font-roboto">Plan distribution</p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#E5E7EB] hover:bg-gray-50 transition">
                <span className="sr-only">More</span>
                <div className="w-5 h-5 flex flex-col justify-between">
                  <span className="block w-full h-[2px] bg-[#9CA3AF]" />
                  <span className="block w-full h-[2px] bg-[#9CA3AF]" />
                  <span className="block w-full h-[2px] bg-[#9CA3AF]" />
                </div>
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center mt-6">
              <div className="relative">
                <svg width="220" height="220" viewBox="0 0 220 220">
                  <circle
                    cx="110"
                    cy="110"
                    r="90"
                    stroke="#E5E7EB"
                    strokeWidth="28"
                    fill="none"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="90"
                    stroke="#60A5FA"
                    strokeWidth="28"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 90 * 0.7} ${2 * Math.PI * 90}`}
                    strokeDashoffset={-2 * Math.PI * 90 * 0.3}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="90"
                    stroke="#F59E0B"
                    strokeWidth="28"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 90 * 0.2} ${2 * Math.PI * 90}`}
                    strokeDashoffset={-2 * Math.PI * 90 * 0.8}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="90"
                    stroke="#1D4ED8"
                    strokeWidth="28"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 90 * 0.1} ${2 * Math.PI * 90}`}
                    strokeDashoffset={-2 * Math.PI * 90 * 0.95}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-archivo font-semibold text-oxford-blue">70.8%</p>
                  <p className="text-sm text-[#6B7280] font-roboto">Free Plan</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#60A5FA]" />
                  <span className="text-sm text-[#6B7280] font-roboto">Free</span>
                </div>
                <span className="text-sm font-medium text-oxford-blue font-roboto">70.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="text-sm text-[#6B7280] font-roboto">Premium</span>
                </div>
                <span className="text-sm font-medium text-oxford-blue font-roboto">21.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#1D4ED8]" />
                  <span className="text-sm text-[#6B7280] font-roboto">Organization</span>
                </div>
                <span className="text-sm font-medium text-oxford-blue font-roboto">5.1%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom panels */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-[8px] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-archivo font-semibold text-oxford-blue">Latest Sign-ups</h3>
              <button className="text-sm text-[#3B82F6] font-roboto hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {latestSignups.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${user.avatarColor} w-10 h-10 rounded-full flex items-center justify-center`}>
                      <span className="text-base font-archivo font-semibold text-oxford-blue">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-archivo font-semibold text-oxford-blue">{user.name}</p>
                      <p className="text-xs text-[#6B7280] font-roboto">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#9CA3AF] font-roboto">{user.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-archivo font-semibold text-oxford-blue">System Notifications</h3>
              <button className="text-sm text-[#3B82F6] font-roboto hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {notifications.map((note) => (
                <div
                  key={note.title}
                  className={`${note.color} rounded-xl px-4 py-3 border border-[#E5E7EB] flex flex-col gap-1`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${note.dot}`} />
                      <p className="text-sm font-archivo font-semibold text-oxford-blue">{note.title}</p>
                    </div>
                    <span className="text-xs text-[#9CA3AF] font-roboto">{note.time}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] font-roboto">{note.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;



