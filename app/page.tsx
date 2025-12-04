'use client'

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Globe, TrendingUp, Menu, Clock } from 'lucide-react';

const keywordData = [
  { name: 'Power BI', value: 64.4, color: '#4285F4' },
  { name: 'Data Analyst', value: 11.4, color: '#EA4335' },
  { name: 'Visualization', value: 9.3, color: '#34A853' },
  { name: 'SQL Query', value: 9.0, color: '#FBBC04' },
  { name: 'Developer', value: 6.0, color: '#FF6D01' },
];

const timeSeriesData = [
  { date: '23 Apr', value: 14200 },
  { date: '25 Apr', value: 15800 },
  { date: '27 Apr', value: 16100 },
  { date: '29 Apr', value: 16649 },
];

const Dashboard: React.FC = () => {
  const [selectedCountries] = useState(69);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl font-light text-gray-800">
                Google <span className="font-normal">Trends</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">{selectedCountries} Countries Selected</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg">
            Details →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* The Developer Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm text-gray-500">The Developer</h3>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold text-gray-800">1211</span>
                <button className="px-4 py-1 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-full transition-colors mb-2">
                  Details →
                </button>
              </div>
            </div>

            {/* Rising Keywords */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm text-gray-500 mb-2">Rising Keywords</h3>
              <p className="text-purple-600 font-medium mb-4">The Greatest Estate Developer</p>
              <div className="space-y-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}>
                  <span className="text-xs text-gray-600 ml-2">25K</span>
                </div>
              </div>
            </div>

            {/* Top Keywords */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm text-gray-500 mb-2">Top Keywords</h3>
              <p className="text-gray-700 font-medium mb-4">Software Developer</p>
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}>
                <span className="text-xs text-gray-600 ml-2">100</span>
              </div>
            </div>

            {/* Keywords Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Keywords</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={keywordData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4285F4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Navigation Icons */}
            <div className="flex flex-col gap-4 items-center">
              <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors shadow-lg">
                <Globe className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-colors shadow-lg">
                <TrendingUp className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-colors shadow-lg">
                <Clock className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Center - Globe */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl flex items-center justify-center">
                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center">
                  <Globe className="w-40 h-40 text-white opacity-30" />
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-10 right-10 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-100"></div>
              <div className="absolute bottom-20 left-10 w-3 h-3 bg-red-400 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Last 7 Days Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm text-gray-500 mb-2">Last 7 Days</h3>
              <div className="text-5xl font-bold text-gray-800 mb-4">16649</div>
              
              {/* Mini Chart */}
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={timeSeriesData}>
                  <Line type="monotone" dataKey="value" stroke="#4285F4" strokeWidth={2} dot={{ fill: '#4285F4', r: 4 }} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                </LineChart>
              </ResponsiveContainer>

              {/* Trend Indicators */}
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                {timeSeriesData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Track Keyword Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Click here to Next Page</p>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Track Keyword</h3>
                  <p className="text-gray-600">Performance by Date</p>
                </div>
                <div className="w-16 h-16 bg-blue-500 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center transition-colors">
                  <span className="text-white text-3xl">→</span>
                </div>
              </div>
            </div>

            {/* LinkedIn Button */}
            <div className="flex justify-center mt-8">
              <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;