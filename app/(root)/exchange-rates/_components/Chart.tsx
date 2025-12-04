import React from 'react'

const Chart = () => {
  return (
    <div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Total Visitors</h2>
              <p className="text-sm text-neutral-400">Total for the last 3 months</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="90d">Last 3 months</option>
              <option value="30d">Last 30 days</option>
              <option value="7d">Last 7 days</option>
            </select>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#737373"
                  tick={{ fill: '#737373', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis 
                  stroke="#737373"
                  tick={{ fill: '#737373', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                  formatter={(value) => <span className="text-neutral-400 capitalize">{value}</span>}
                />
                <Area 
                  type="natural" 
                  dataKey="mobile" 
                  stackId="1"
                  stroke="#b91c1c" 
                  fill="url(#colorMobile)" 
                  strokeWidth={2}
                />
                <Area 
                  type="natural" 
                  dataKey="desktop" 
                  stackId="1"
                  stroke="#dc2626" 
                  fill="url(#colorDesktop)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
  )
}

export default Chart