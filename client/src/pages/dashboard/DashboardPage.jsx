import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BarChart } from '@mui/x-charts/BarChart';
import { vedio, timer } from '../../assets/svg/dashboard';

const DashboardPage = () => {
  const { t } = useLanguage();
  const [chartWidth, setChartWidth] = useState(1070);

  useEffect(() => {
    const updateChartWidth = () => {
      if (window.innerWidth < 768) {
        setChartWidth(650); // Minimum width for mobile scrolling to show all labels
      } else {
        setChartWidth(1070); // Desktop width
      }
    };

    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);
    return () => window.removeEventListener('resize', updateChartWidth);
  }, []);

  const sectionData = [
    { name: 'Quantitative', progress: 65, color: 'bg-moonstone-blue' },
    { name: 'Language', progress: 80, color: 'bg-[#C6D8D3]' },
    { name: 'Logical Reasoning', progress: 72, color: 'bg-cinnebar-red' },
    { name: 'General Knowledge', progress: 58, color: 'bg-papaya-whip' },
    { name: 'Current Affairs', progress: 45, color: 'bg-oxford-blue' },
  ];

  const performanceData = [
    { session: 'S1', accuracy: 65, state: 'normal' },
    { session: 'S2', accuracy: 72, state: 'normal' },
    { session: 'S3', accuracy: 68, state: 'selected' },
    { session: 'S4', accuracy: 75, state: 'normal' },
    { session: 'S5', accuracy: 82, state: 'hovered' },
    { session: 'S6', accuracy: 78, state: 'normal' },
    { session: 'S7', accuracy: 85, state: 'normal' },
    { session: 'S8', accuracy: 79, state: 'normal' },
    { session: 'S9', accuracy: 88, state: 'normal' },
    { session: 'S10', accuracy: 92, state: 'normal' },
  ];

  const getBarColor = (state) => {
    switch (state) {
      case 'selected':
        return '#ED4122'; // cinnebar-red
      case 'hovered':
        return '#032746'; // oxford-blue
      default:
        return '#6CA6C1'; // moonstone-blue
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 2xl:px-[70px] desktop:px-[260px] bg-gray-50 min-h-screen px-6">
      {/* Overview Section */}
      <div className="mb-8 md:mb-12">
        <h2 className="font-archivo font-bold text-2xl md:text-3xl lg:text-[36px] leading-tight md:leading-[40px] text-oxford-blue mb-2">Overview</h2>
        <p className="font-roboto font-normal text-base md:text-[18px] leading-6 md:leading-7 text-gray-500 mb-4 md:mb-6">
          {t('dashboard.overview.subtitle')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-4">
          {/* Progress Card */}
          <div className="rounded-xl border border-[#E5E7EB] shadow-[0px_6px_54px_0px_rgba(0,0,0,0.05)] p-4 md:p-6 w-full max-w-full lg:max-w-[548px] h-auto min-h-[200px] md:min-h-[251px]">
            <h3 className="font-archivo font-semibold text-[18px] leading-[28px] text-oxford-blue mb-3 md:mb-4">Progress</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-[90px] h-[90px] md:w-[115px] md:h-[115px]">
                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 192 192">
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 84 * 0.325} ${2 * Math.PI * 84}`}
                    className="text-moonstone-blue"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-archivo font-bold text-[24px] leading-[32px] text-oxford-blue">32.5%</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center font-roboto font-normal text-sm md:text-[16px] leading-5 md:leading-6 text-gray-500 mt-3 md:mt-4">
              325/1000 Questions Completed
            </p>
          </div>

          {/* Accuracy Card */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_6px_54px_0px_rgba(0,0,0,0.05)] p-4 md:p-6 w-full max-w-full lg:max-w-[548px] h-auto min-h-[200px] md:min-h-[251px]">
            <h3 className="font-archivo font-semibold text-[18px] leading-[28px] text-oxford-blue mb-3 md:mb-10">Accuracy</h3>  
            <div className="flex items-start justify-center h-full">
              <div className="text-center">
                <p className="font-archivo font-bold text-[36px] leading-[40px] text-cinnebar-red">78%</p>
                <p className="font-roboto font-normal text-sm md:text-base leading-5 md:leading-6 tracking-normal text-center align-middle text-gray-500">Overall</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Breakdown */}
      <div className="w-full max-w-[382px] md:max-w-[1120px] h-[491px] md:h-[508px]">
        <h2 className="font-archivo font-bold text-[20px] leading-[32px] text-oxford-blue mb-4 md:mb-3">Section Breakdown</h2>
        <div className="rounded-xl shadow-[0px_6px_54px_0px_rgba(0,0,0,0.05)] w-full bg-white p-4 md:p-5">
          <div className="space-y-3 w-full">
            {sectionData.map((section, index) => (
              <div 
                key={index} 
                className={`min-h-[70px] md:h-[77.6px] border border-[#E5E7EB]  rounded-lg mb-[18px] last:mb-0 px-4 md:px-5 py-3 md:py-4 flex flex-col justify-center ${
                  index === 0 ? 'bg-[#F7F7F7]' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-roboto text-[14px] leading-[20px] text-oxford-blue font-medium">{section.name}</span>
                  <span className="font-roboto text-[14px] leading-[20px] text-oxford-blue font-semibold">{section.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-[12px]">
                  <div
                    className={`${section.color} h-[12px] rounded-full transition-all duration-300`}
                    style={{ width: `${section.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white my-20 border border-[#E5E7EB] shadow-[0px_6px_54px_0px_rgba(0,0,0,0.05)] w-full max-w-full md:w-[1120px] h-auto md:h-auto rounded-[12px] overflow-x-hidden overflow-y-visible pb-8">
        <h2 className="font-archivo font-semibold pl-4 md:pl-6 lg:pl-10 pb-4 md:pb-5 pt-6 md:pt-10 text-[20px] leading-[28px] text-oxford-blue">
          {t('dashboard.performance.title')}
        </h2>
        <div className="rounded-xl flex flex-col items-center justify-center p-3 md:p-6 overflow-x-auto md:overflow-x-visible" style={{ scrollBehavior: 'smooth' }}>
          <div className="min-w-[650px] md:min-w-0 w-full md:w-[1070px] h-[320px]">
            <BarChart
              width={chartWidth}
              height={320}
              margin={{ left: 70, right: 30, top: 30, bottom: 80 }}
            series={[
              {
                data: performanceData.map((data) => data.accuracy),
                borderRadius: 4,
              },
            ]}
            xAxis={[
              {
                id: 'sessions',
                data: performanceData.map((data) => data.session),
                scaleType: 'band',
                label: 'Sessions',
                labelStyle: {
                  fontFamily: 'Roboto',
                  fontSize: 12,
                  fill: '#6B7280',
                },
                tickLabelStyle: {
                  fontFamily: 'Roboto',
                  fontSize: 12,
                  fill: '#6B7280',
                },
                colorMap: {
                  type: 'ordinal',
                  values: performanceData.map((data) => data.session),
                  colors: performanceData.map((data) => getBarColor(data.state)),
                },
              },
            ]}
            yAxis={[
              {
                id: 'accuracy',
                min: 0,
                max: 100,
                label: 'Accuracy (%)',
                labelStyle: {
                  fontFamily: 'Roboto',
                  fontSize: 12,
                  fill: '#6B7280',
                },
                tickLabelStyle: {
                  fontFamily: 'Roboto',
                  fontSize: 12,
                  fill: '#6B7280',
                },
                tickNumber: 6,
              },
            ]}
            grid={{ horizontal: true }}
            sx={{
              '& .MuiChartsAxis-directionY .MuiChartsAxis-line': {
                stroke: 'transparent',
              },
              '& .MuiChartsGrid-horizontal .MuiChartsGrid-line': {
                strokeDasharray: '4 4',
                stroke: '#E5E7EB',
              },
              '& .MuiChartsAxis-tickLabel': {
                fill: '#6B7280 !important',
                fontFamily: 'Roboto !important',
                fontSize: '12px !important',
              },
              '& .MuiChartsAxis-label': {
                fill: '#6B7280 !important',
                fontFamily: 'Roboto !important',
                fontSize: '12px !important',
              },
              '& .MuiChartsAxis-root': {
                overflow: 'visible',
              },
              '& .MuiChartsAxisBottom .MuiChartsAxis-tickLabel': {
                fill: '#6B7280 !important',
                fontFamily: 'Roboto !important',
                fontSize: '12px !important',
              },
              '& .MuiChartsAxisBottom .MuiChartsAxis-label': {
                fill: '#6B7280 !important',
                fontFamily: 'Roboto !important',
                fontSize: '12px !important',
              },
              '& .MuiChartsAxisLeft .MuiChartsAxis-tickLabel': {
                fill: '#6B7280 !important',
                fontFamily: 'Roboto !important',
                fontSize: '12px !important',
              },
              '& .MuiChartsAxisLeft .MuiChartsAxis-label': {
                fill: '#6B7280 !important',
                fontFamily: 'Roboto !important',
                fontSize: '12px !important',
              },
            }}
            slotProps={{
              legend: {
                hidden: true,
              },
              bar: {
                width: 35,
              },
            }}
            />
          </div>
          
          {/* Footer with legend */}
          <div className="flex items-center justify-center mt-1 flex-wrap gap-3 md:gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6CA6C1' }} />
                <span className="font-roboto text-[14px] leading-[20px] text-[#6B7280]">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#032746' }} />
                <span className="font-roboto text-[14px] leading-[20px] text-[#6B7280]">Hovered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ED4122' }} />
                <span className="font-roboto text-[14px] leading-[20px] text-[#6B7280]">Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-archivo font-bold text-[24px] leading-[32px] text-oxford-blue mb-4 md:mb-6">
          {t('dashboard.quickActions.title')}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 lg:gap-16">
          <button className="flex items-center justify-center gap-3 bg-cinnebar-red text-white w-full sm:w-auto sm:flex-1 max-w-full lg:max-w-[548px] h-[60px] md:h-[79.2px] rounded-lg transition-colors shadow-lg hover:opacity-90">
            <img src={vedio} alt="video icon" className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-archivo font-semibold text-[18px] leading-[28px] text-white">
              {t('dashboard.quickActions.startNewSession')}
            </span>
          </button>
          <button className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-oxford-blue border border-gray-300 w-full sm:w-auto sm:flex-1 max-w-full lg:max-w-[548px] h-[60px] md:h-[79.2px] rounded-lg transition-colors shadow-sm">
            <img src={timer} alt="timer icon" className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-archivo font-semibold text-[18px] leading-[28px] text-oxford-blue">
              {t('dashboard.quickActions.reviewSessions')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
