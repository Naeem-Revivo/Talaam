import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext';

const ReviewTable = ({ 
  columns, 
  data, 
  emptyMessage, 
  renderRow, 
  getCorrectColor 
}) => {
    const navigate = useNavigate();
    const { t } = useLanguage();

  if (data.length === 0) {
    return (
      <div className="hidden lg:block bg-white rounded-lg overflow-hidden border border-[#E5E7EB] shadow-dashboard w-full max-w-[1120px]">
        <div className="p-8 text-center text-oxford-blue">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block bg-white rounded-lg overflow-hidden border border-[#E5E7EB] shadow-dashboard w-full max-w-[1120px]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-oxford-blue text-center">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 md:px-6 py-3 md:py-4 text-[16px] font-archivo font-medium leading-[16px] text-white"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              // If custom renderRow function is provided, use it
              if (renderRow) {
                return (
                  <tr
                    key={item.id || index}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition last:border-b-0"
                  >
                    {renderRow(item, index, navigate, t, getCorrectColor)}
                  </tr>
                );
              }
              
              // Default rendering (for marked questions)
              return (
                <tr
                  key={item.id || index}
                  className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition last:border-b-0"
                >
                  <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                    {item.shortId || item.id}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-oxford-blue">
                    <div className="line-clamp-2">{item.questionText || item.text || ''}</div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                    {item.exam || 'N/A'}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                    {item.subject || 'N/A'}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                    {item.topic || 'N/A'}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                    {item.markedDate || item.date || 'N/A'}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-[10px] flex-wrap justify-center">
                      {item.actions || null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewTable;
