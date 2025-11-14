import React, { useState } from 'react';
// import { LineChart } from '@mui/x-charts/LineChart';
import { accuracy, time, target } from '../../assets/svg/dashboard';

const AnalyticsPage = () => {
  const [selectedRange, setSelectedRange] = useState('all');
  const [selectedTopicTab, setSelectedTopicTab] = useState('quantitative');

  // Chart data for accuracy trend - matching the exact pattern from the image
  const accuracyData = [
    { date: 'Jan 15', accuracy: 68 },
    { date: 'Jan 17', accuracy: 75 },
    { date: 'Jan 19', accuracy: 82 },
    { date: 'Jan 21', accuracy: 88 },
    { date: 'Jan 23', accuracy: 85 },
  ];

  // Topics data
  const quantitativeTopics = [
    { name: 'Algebra', accuracy: 85 },
    { name: 'Geometry', accuracy: 78 },
    { name: 'Arithmetic', accuracy: 92 },
    { name: 'Statistics', accuracy: 71 },
    { name: 'Probability', accuracy: 66 },
  ];

  // Focus areas data
  const focusAreas = [
    { name: 'Probability', accuracy: 66 },
    { name: 'Sentence Correction', accuracy: 73 },
    { name: 'Statistics', accuracy: 71 },
    { name: 'Grammar', accuracy: 75 },
  ];

  return (
    <div className="bg-white min-h-screen p-4 md:p-6 lg:p-8 2xl:px-[70px]">
      {/* Page Title and Subtitle */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-[24px] md:text-[32px] font-bold text-oxford-blue mb-2 font-archivo leading-[32px] md:leading-[40px] tracking-[0%]">
          Performance Analytics
      </h1>
        <p className="text-[14px] md:text-[18px] font-normal text-[#6B7280] font-roboto leading-[28px] md:leading-[28px] tracking-[0%]">
          Deep insights into your learning progress.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Overall Accuracy Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 relative w-full min-h-[120px] md:min-h-[133.6px]" style={{ borderWidth: '1px' }}>
          <div className="absolute top-4 right-4">
            <img src={accuracy} alt="Accuracy" className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[20px] tracking-[0%] pt-2 md:pt-0 mb-2">Overall Accuracy</p>
          <p className="text-[24px] md:text-[30px] font-bold text-oxford-blue font-archivo leading-[20px] md:leading-[36px] pt-2 md:pt-0 tracking-[0%]">78%</p>
        </div>

        {/* Avg Time / Question Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 relative w-full min-h-[120px] md:min-h-[133.6px]" style={{ borderWidth: '1px' }}>
          <div className="absolute top-4 right-4">
            <img src={time} alt="Time" className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[20px] tracking-[0%] mb-2">Avg Time / Question</p>
          <p className="text-[24px] md:text-[30px] font-bold text-oxford-blue font-archivo leading-[20px] md:leading-[36px] tracking-[0%] pt-2 md:pt-0">52s</p>
          <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[18px] md:leading-[20px] tracking-[0%] pt-2 md:pt-0">Per question</p>
        </div>

        {/* Questions Completed Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 relative w-full min-h-[120px] md:min-h-[133.6px]" style={{ borderWidth: '1px' }}>
          <div className="absolute top-4 right-4">
            <img src={target} alt="Target" className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[20px] tracking-[0%] pt-2 md:pt-0 mb-2">Questions Completed</p>
          <p className="text-[24px] md:text-[30px] font-bold text-oxford-blue font-archivo leading-[20px] md:leading-[36px] tracking-[0%] py-2 md:py-0 mb-2">325/1000</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#6CA6C1] h-2 rounded-full" style={{ width: '32.5%' }}></div>
          </div>
        </div>
      </div>

      {/* Accuracy Trend Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 mb-6 md:mb-8 w-full max-w-[700px] min-h-[300px] md:min-h-[375px]" style={{ borderWidth: '1px' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] md:text-[20px] font-bold text-oxford-blue font-archivo leading-[26px] md:leading-[32px] tracking-[0%]">Accuracy Trend</h2>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="#9CA3AF" strokeWidth="1.5"/>
              <path d="M8 5V8L10 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedRange('all')}
              className={`px-4 py-2 rounded-full text-[14px] font-normal transition-colors font-roboto leading-[20px] tracking-[0%] text-center ${
                selectedRange === 'all'
                  ? 'bg-cinnebar-red text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedRange('30')}
              className={`px-4 py-2 rounded-full text-[14px] font-normal transition-colors font-roboto leading-[20px] tracking-[0%] text-center ${
                selectedRange === '30'
                  ? 'bg-cinnebar-red text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedRange('7')}
              className={`px-4 py-2 rounded-full text-[14px] font-normal transition-colors font-roboto leading-[20px] tracking-[0%] text-center ${
                selectedRange === '7'
                  ? 'bg-cinnebar-red text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              7 Days
            </button>
          </div>
        </div>
        <div className="h-[250px] md:h-[280px] w-full max-w-[650px] mx-auto overflow-x-auto">
          {/* <LineChart
            width={undefined}
            height={250}
            series={[
              {
                data: accuracyData.map(d => d.accuracy),
                color: '#6CA6C1',
                curve: 'natural',
                showMarkers: true,
              },
            ]}
            xAxis={[
              {
                data: accuracyData.map((_, i) => i),
                scaleType: 'point',
                valueFormatter: (value) => accuracyData[value]?.date || '',
              },
            ]}
            yAxis={[
              {
                min: 60,
                max: 100,
                label: 'Accuracy (%)',
                labelStyle: {
                  fontSize: '14px',
                  fontFamily: 'Roboto',
                  fontWeight: 400,
                  fill: '#4B5563',
                },
              },
            ]}
            grid={{ horizontal: true, vertical: false }}
            sx={{
              width: '100%',
              '& .MuiChartsAxis-tickLabel': {
                fontSize: '12px',
                fill: '#6B7280',
              },
              '& .MuiChartsAxis-label': {
                fontSize: '14px',
                fontFamily: 'Roboto',
                fontWeight: 400,
                fill: '#4B5563',
              },
              '& .MuiChartsGrid-line[data-direction="horizontal"]': {
                stroke: '#E5E7EB',
                strokeWidth: 1,
              },
              '& .MuiChartsGrid-line[data-direction="vertical"]': {
                display: 'none',
              },
              '& .MuiMarkElement-root': {
                fill: '#6CA6C1',
                stroke: '#6CA6C1',
                strokeWidth: 2,
                r: 4,
              },
            }}
          /> */}
        </div>
      </div>

      <div className="mb-8">
        {/* Your Percentile Section */}
        <div className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 w-full max-w-[1120px] min-h-[250px] md:min-h-[267px] mb-6 md:mb-8" style={{ borderWidth: '1px' }}>
          {/* Title */}
          <h2 className="text-[18px] md:text-[20px] font-bold text-oxford-blue font-archivo leading-[26px] md:leading-[32px] tracking-[0%] mb-4 md:mb-6">Your Percentile</h2>
          
          {/* Semi-circular gauge */}
          <div className="flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-full overflow-x-auto">
            <svg width="280" height="160" viewBox="0 0 280 160" className="overflow-visible max-w-full" style={{ minWidth: '240px', width: '100%', maxWidth: '280px' }}>
              {/* Background arc (full 100%) */}
              <path
                d="M 40 140 A 100 100 0 0 1 240 140"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="12"
              />
              {/* Progress arc (82% filled with moonstone blue) */}
              <path
                d="M 40 140 A 100 100 0 0 1 240 140"
                fill="none"
                stroke="#6CA6C1"
                strokeWidth="12"
                strokeDasharray="257.48 56.52"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Red dot at 82% position (147.6 degrees from start) */}
              <circle
                cx={40 + 100 * (1 - Math.cos((147.6 * Math.PI) / 180))}
                cy={140 - 100 * Math.sin((147.6 * Math.PI) / 180)}
                r="8"
                fill="#ED4122"
              />
              {/* Label with pointer */}
              <g transform={`translate(${40 + 100 * (1 - Math.cos((147.6 * Math.PI) / 180))}, ${140 - 100 * Math.sin((147.6 * Math.PI) / 180) - 30})`}>
                <rect x="-56.205" y="-12" width="116.41" height="30" rx="4" fill="#ED4122" />
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Archivo" dominantBaseline="middle">
                  82nd %ile
                </text>
                {/* Triangular pointer pointing down */}
                <polygon points="-5,22 0,28 5,22" fill="#ED4122" />
              </g>
            </svg>
          </div>

          {/* Descriptive Text with Icon */}
          <div className="flex items-center justify-center gap-2 mt-2 md:mt-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
              <text x="8" y="11.5" textAnchor="middle" fill="#9CA3AF" fontSize="11" fontWeight="600" fontFamily="Arial">i</text>
            </svg>
            <p className="text-[11px] md:text-[12px] text-gray-500 font-roboto">
              Based on all users in this Taalam QBank
            </p>
          </div>
          </div>
        </div>

        {/* Accuracy by Topic Section */}
        <div className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 w-full max-w-[1120px] min-h-[400px] md:min-h-[527px]" style={{ borderWidth: '1px' }}>
          <h2 className="text-[18px] md:text-[20px] font-bold text-oxford-blue mb-4 md:mb-6 font-archivo leading-[26px] md:leading-[32px] tracking-[0%]">Accuracy by Topic</h2>
          <div className="flex gap-2 mb-6 md:mb-9">
            <button
              onClick={() => setSelectedTopicTab('quantitative')}
              className={`px-4 py-2 rounded-full text-[14px] md:text-[16px] font-bold transition-colors font-archivo leading-[24px] tracking-[0%] text-center ${
                selectedTopicTab === 'quantitative'
                  ? 'bg-orange-dark text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              Quantitative
            </button>
            <button
              onClick={() => setSelectedTopicTab('language')}
              className={`px-4 py-2 rounded-full text-[14px] md:text-[16px] font-bold transition-colors font-archivo leading-[24px] tracking-[0%] text-center ${
                selectedTopicTab === 'language'
                  ? 'bg-orange-dark text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              Language
            </button>
          </div>
          <div className="space-y-4">
            {quantitativeTopics.map((topic, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-3 border border-[#E5E7EB] rounded-[8px] p-3 md:p-4" style={{ borderWidth: '1px' }}>
                <span className="text-[14px] md:text-[16px] font-medium text-oxford-blue font-archivo leading-[20px] md:leading-[24px] tracking-[0%]">{topic.name}</span>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:w-[200px] bg-[#FDF0D5] rounded-full h-2">
                    <div
                      className="bg-[#6CA6C1] h-2 rounded-full"
                      style={{ width: `${topic.accuracy}%` }}
                    ></div>
                  </div>
                  <span className="text-[14px] md:text-[16px] font-bold text-oxford-blue font-archivo leading-[20px] md:leading-[24px] tracking-[0%] text-right min-w-[40px]">
                    {topic.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Areas Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 w-full max-w-[1120px] min-h-[200px] md:min-h-[236px]" style={{ borderWidth: '1px' }}>
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <h2 className="text-[16px] md:text-[18px] font-semibold text-gray-800 font-archivo">Focus Areas</h2>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="7" stroke="#9CA3AF" strokeWidth="1.5"/>
            <path d="M8 5V8L10 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {focusAreas.map((area, index) => (
            <div
              key={index}
              className="bg-[#FDF0D5] rounded-full p-3 md:p-4 flex items-center justify-between w-full md:w-[527.2px] min-h-[50px] md:min-h-[57.6px] border border-[#FFE5B0]" style={{ borderWidth: '1px', borderRadius: '9999px' }}
            >
              <span className="text-[14px] md:text-[16px] font-normal text-oxford-blue font-archivo leading-[20px] md:leading-[24px] tracking-[0%]">{area.name}</span>
              <span className="text-[12px] md:text-[14px] font-normal text-[#4B5563] font-roboto leading-[18px] md:leading-[20px] tracking-[0%]">
                {area.accuracy}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

