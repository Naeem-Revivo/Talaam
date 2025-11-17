import React from 'react';
import { check, x } from '../../assets/svg';

const FeaturesComparison = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compare All Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how our products stack up against each other to find the perfect fit.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-6 py-4 text-left font-semibold text-gray-900">Features</th>
                <th className="border border-gray-300 px-6 py-4 text-center font-semibold text-gray-900">LMS</th>
                <th className="border border-gray-300 px-6 py-4 text-center font-semibold text-gray-900">Virtual Classroom</th>
                <th className="border border-gray-300 px-6 py-4 text-center font-semibold text-gray-900">Assessment</th>
                <th className="border border-gray-300 px-6 py-4 text-center font-semibold text-gray-900">Mobile App</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Course Management</td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={x} alt="" className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Live Streaming</td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={x} alt="" className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={x} alt="" className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={x} alt="" className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Mobile Access</td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Analytics Dashboard</td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={x} alt="" className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Offline Access</td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={x} alt="" className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={x} alt="" className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={x} alt="" className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <img src={check} alt="" className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default FeaturesComparison;
