import React, { useMemo } from "react";
import {
  headcard1,
  headcard2,
  headcard3,
  headcard4,
  threebar,
  alert,
  sclock,
  blacktick,
} from "../../assets/svg/dashboard/admin";
import AdminMetricCard from "../../components/admin/AdminMetricCard";

const stats = [
  {
    title: "Total Users",
    value: "12,800",
    delta: "+12% from last month",
    deltaColor: "text-[#ED4122]",
    icon: headcard1,
  },
  {
    title: "Verified Users",
    value: "9,234",
    delta: "72% verification rate",
    deltaColor: "text-[#6B7280]",
    icon: headcard2,
  },
  {
    title: "Active Subscriptions",
    value: "3,456",
    delta: "+8% this week",
    deltaColor: "text-[#6B7280]",
    icon: headcard3,
  },
  {
    title: "Revenue",
    value: "$89,432",
    delta: "+15% this month",
    deltaColor: "text-[#6B7280]",
    icon: headcard4,
  },
];

const growthMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const growthValues = [
  1, 1.4, 2.1, 3.8, 4.6, 6.1, 7.3, 8.8, 10.6, 11.9, 13.1, 14.3,
];
const growthYAxis = [0, 2.5, 5, 7.5, 10, 12.5, 15];

const subscriptionSegments = [
  { label: "Free", value: 70.8, color: "#E5E7EB", isBase: true },
  { label: "Premium", value: 21.1, color: "#ED4122" },
  { label: "Organization", value: 5.1, color: "#6CA6C1" },
];

const latestSignups = [
  {
    name: "Sarah Ahmad",
    email: "sarah.ahmad@gmail.com",
    time: "2 min ago",
    avatarColor: "bg-[#FDE68A]",
  },
  {
    name: "Emily Davis",
    email: "emilydavis@gmail.com",
    time: "15 min ago",
    avatarColor: "bg-[#BFDBFE]",
  },
  {
    name: "Emily Davis",
    email: "emilydavis@gmail.com",
    time: "30 min ago",
    avatarColor: "bg-[#C4B5FD]",
  },
];

const notifications = [
  {
    title: "High Server Load",
    description: "CPU usage above 85%",
    time: "CPU usage above 85%",
    bg: "bg-[#FEF2F2]",
    border: "border-[#F97316]",
    iconBg: "bg-[#EF4444]",
    titleColor: "text-[#EF4444]",
    descriptionColor: "text-[#EF4444]",
    timeColor: "text-[#EF4444]",
    icon: alert,
    titleClass: "text-[16px] leading-[16px]",
    descriptionClass: "text-[12px] leading-[16px]",
    timeClass: "text-[8px] leading-[12px]",
  },
  {
    title: "Scheduled Maintenance",
    description: "Database backup at 2 AM",
    time: "Tomorrow",
    bg: "bg-[#FEFCE8]",
    border: "border-[#FAFF70]",
    iconBg: "bg-[#60A5FA]",
    titleColor: "text-[#6CA6C1]",
    descriptionColor: "text-[#6CA6C1]",
    timeColor: "text-[#6CA6C1]",
    icon: sclock,
    titleClass: "text-[16px] leading-[16px]",
    descriptionClass: "text-[12px] leading-[16px]",
    timeClass: "text-[8px] leading-[14px]",
  },
  {
    title: "Backup Completed",
    description: "Daily backup successful",
    time: "1 hour ago",
    bg: "bg-[#F0FDF4]",
    border: "border-[#BAFFCB]",
    iconBg: "bg-[#0F172A]",
    titleColor: "text-[#032746]",
    descriptionColor: "text-[#032746]",
    timeColor: "text-[#032746]",
    icon: blacktick,
    titleClass: "text-[16px] leading-[16px]",
    descriptionClass: "text-[12px] leading-[16px]",
    timeClass: "text-[8px] leading-[14px]",
  },
];

const AdminDashboardPage = () => {
  const { linePath, points } = useMemo(() => {
    const chartWidth = 460;
    const chartHeight = 240;
    const leftPadding = 50;
    const rightPadding = 20;
    const topPadding = 20;
    const bottomPadding = 30;
    const usableWidth = chartWidth - leftPadding - rightPadding;
    const usableHeight = chartHeight - topPadding - bottomPadding;

    const maxValue = 15;
    const pointCoords = growthValues.map((value, index) => {
      const x = leftPadding + (usableWidth / (growthValues.length - 1)) * index;
      const y = topPadding + usableHeight - (value / maxValue) * usableHeight;
      return { x, y, value };
    });

    const d = pointCoords
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(
            2
          )}`
      )
      .join(" ");

    return { linePath: d, points: pointCoords };
  }, []);

  const donutData = useMemo(() => {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const total = subscriptionSegments.reduce((sum, seg) => sum + seg.value, 0);
    const gapSize = 8;
    const segmentsCount = subscriptionSegments.length;
    const availableCircumference = circumference - gapSize * segmentsCount;
    const gapFraction = gapSize / circumference;

    let rotationAccumulator = 0;
    const segments = subscriptionSegments.map((segment) => {
      const strokeLength =
        (segment.value / total) * Math.max(availableCircumference, 0);
      const dasharray = `${strokeLength} ${circumference}`;
      const dashFraction = strokeLength / circumference;
      const rotation = rotationAccumulator;
      rotationAccumulator += dashFraction + gapFraction;

      return {
        ...segment,
        dasharray,
        rotation,
      };
    });

    const highlighted =
      subscriptionSegments.find((segment) => segment.isBase) ??
      subscriptionSegments[0];

    return {
      segments,
      radius,
      circumference,
      gapSize,
      trackColor: "#EEF2F6",
      highlighted,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-6 sm:px-6 sm:py-8 2xl:px-16">
      <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
        <header className="space-y-1 text-center sm:text-left">
          <h1 className="font-archivo font-bold text-[28px] leading-[32px] text-[#032746] sm:text-[36px] sm:leading-[40px]">
            Dashboard Overview
          </h1>
          <p className="font-roboto text-[16px] leading-[24px] text-[#6B7280] sm:text-[18px] sm:leading-[28px]">
            Monitor system activity and key metrics
          </p>
        </header>

        {/* Stats */}
        <section className="flex flex-wrap gap-4 sm:gap-6 lg:gap-7 w-full xl:justify-between">
          {stats.map((item) => (
            <AdminMetricCard
              key={item.title}
              title={item.title}
              value={item.value}
              subtext={item.delta}
              subtextClassName={item.deltaColor}
              icon={item.icon}
              iconWrapperClassName="bg-[#ED4122]"
              className="w-full sm:w-[calc(50%-12px)] lg:w-[262px] lg:h-[130px]"
            />
          ))}
        </section>

        {/* Charts */}
        <section className="flex flex-col lg:flex-row gap-10 w-full justify-between">
          <div className="rounded-[8px] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-6 w-full lg:w-[639px] xl:w-full lg:h-[462px]">
            <div className="flex items-start justify-between flex-col gap-4 sm:flex-row sm:gap-0">
              <div>
                <h3 className="text-lg font-archivo font-semibold text-oxford-blue">
                  User Growth Trend
                </h3>
                <p className="text-sm text-[#6B7280] font-roboto">
                  Monthly active users
                </p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl transition">
                <span className="sr-only">More</span>
                <img src={threebar} alt="menu" />
              </button>
            </div>
            <div className="mt-6 sm:mt-8">
              <div className="relative h-[300px] sm:h-[348px]">
                <svg
                  viewBox="0 0 460 240"
                  className="absolute inset-0 h-full w-full"
                >
                  <defs>
                    <linearGradient
                      id="growthGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#1D4ED8"
                        stopOpacity="0.18"
                      />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {growthYAxis.map((value) => {
                    const chartHeight = 240;
                    const topPadding = 20;
                    const bottomPadding = 30;
                    const usableHeight =
                      chartHeight - topPadding - bottomPadding;
                    const y =
                      topPadding + usableHeight - (value / 15) * usableHeight;
                    return (
                      <g key={value}>
                        <line
                          x1={50}
                          x2={440}
                          y1={y}
                          y2={y}
                          stroke="#E5E7EB"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          opacity="0.8"
                        />
                        <text
                          x={30}
                          y={y + 4}
                          fill="#9CA3AF"
                          fontSize="12"
                          fontFamily="Roboto"
                          textAnchor="end"
                        >
                          {value === 0 ? "0" : `${value}k`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area */}
                  <path
                    d={`M${points[0].x} ${points[0].y} ${points
                      .map((point) => `L${point.x} ${point.y}`)
                      .join(" ")} L${points[points.length - 1].x} 230 L${
                      points[0].x
                    } 230 Z`}
                    fill="url(#growthGradient)"
                  />
                  {/* Line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Points */}
                  {points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="4.5"
                      fill="#60A5FA"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  ))}
                  {/* Month Labels */}
                  {growthMonths.map((label, idx) => (
                    <text
                      key={label}
                      x={points[idx].x}
                      y={230}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="12"
                      fontFamily="Roboto"
                    >
                      {label}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>
          <div className="rounded-[8px] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-6 flex flex-col w-full lg:w-[455px] lg:h-[462px]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-archivo font-semibold text-oxford-blue">
                  Subscription Plans
                </h3>
                <p className="text-sm text-[#6B7280] font-roboto">
                  Plan distribution
                </p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl transition">
                <span className="sr-only">More</span>
                <img src={threebar} alt="menu" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="relative">
                <svg width="260" height="260" viewBox="0 0 260 260">
                  <circle
                    cx="130"
                    cy="130"
                    r={donutData.radius}
                    stroke={donutData.trackColor}
                    strokeWidth="26"
                    fill="none"
                  />
                  {donutData.segments.map((segment) => (
                    <circle
                      key={segment.label}
                      cx="130"
                      cy="130"
                      r={donutData.radius}
                      stroke={segment.color}
                      strokeWidth="26"
                      fill="none"
                      strokeLinecap="butt"
                      strokeDasharray={segment.dasharray}
                      transform={`rotate(${
                        segment.rotation * 360 - 90
                      } 130 130)`}
                    />
                  ))}
                  <circle
                    cx="130"
                    cy="130"
                    r={donutData.radius - 30}
                    fill="#FFFFFF"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <p className="font-archivo font-semibold text-[32px] leading-[36px] text-[#032746]">
                    {donutData.highlighted.value.toFixed(1)}%
                  </p>
                  <p className="text-sm font-roboto text-[#6B7280]">
                    {donutData.highlighted.label}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {subscriptionSegments.map((segment) => (
                <div
                  key={segment.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="text-sm text-[#6B7280] font-roboto">
                      {segment.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[#032746] font-roboto">
                    {segment.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom panels */}
        <section className="flex flex-col lg:flex-row gap-6 lg:gap-4 justify-between">
          <div className="flex-wrap rounded-[8px] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-6 w-full lg:w-[558px] xl:w-full lg:h-[410px]">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h3 className="font-archivo font-semibold text-[20px] leading-[28px] text-[#032746]">
                Latest Sign-ups
              </h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {latestSignups.map((user) => (
                <div
                  className="flex w-full flex-col gap-3 rounded-xl border border-[#6CA6C1] bg-[#E5E7EB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0 lg:h-[86px]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${user.avatarColor} flex h-10 w-10 items-center justify-center rounded-full`}
                    >
                      <span className="font-roboto text-[16px] leading-[20px] text-[#032746] font-normal">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-roboto text-[16px] leading-[20px] text-[#032746] font-normal">
                        {user.name}
                      </p>
                      <p className="font-roboto text-[12px] leading-[20px] text-[#6B7280]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className="font-roboto text-[12px] leading-[20px] text-[#6B7280]">
                    {user.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-wrap rounded-[8px] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-6 w-full lg:w-[558px] xl:w-full lg:h-[410px]">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h3 className="font-archivo font-semibold text-[20px] leading-[28px] text-[#032746]">
                System Notifications
              </h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {notifications.map((note) => (
                <div
                  key={note.title}
                  className={`${note.bg} flex w-full flex-col gap-2 rounded-xl border ${note.border} px-4 py-4 w-full lg:h-[86px]`}
                >
                  <div className="flex items-start gap-3">
                    <img src={note.icon} alt="" className="" />
                    <div className="flex flex-col gap-1">
                      <p
                        className={`font-roboto font-normal ${note.titleClass} ${note.titleColor}`}
                      >
                        {note.title}
                      </p>
                      <p
                        className={`font-roboto font-normal ${note.descriptionClass} ${note.descriptionColor}`}
                      >
                        {note.description}
                      </p>
                      <p
                        className={`font-roboto font-normal ${note.timeClass} ${note.timeColor}`}
                      >
                        {note.time}
                      </p>
                    </div>
                  </div>
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
