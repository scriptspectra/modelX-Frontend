'use client';

import React from 'react';
import { 
  Home, 
  Gauge, 
  GitBranch, 
  BarChart3, 
  FolderKanban, 
  Users, 
  Database, 
  FileText, 
  FileEdit, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
  description: string;
}

// Chart data will be loaded from the backend for the selected currency/time range
type RatePoint = { date: string; rate: number };

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, subtitle, description }) => {
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-neutral-400 text-sm font-medium">{title}</h3>
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          <TrendIcon className="w-3 h-3" />
          {change}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-4">{value}</div>
      <div className="flex items-center gap-2 text-sm mb-1">
        <span className="text-white font-medium">{subtitle}</span>
        <TrendIcon className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
      </div>
      <p className="text-neutral-500 text-sm">{description}</p>
    </div>
  );
};

const LoadingStatCard: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors flex flex-col items-center justify-center min-h-48">
      <h3 className="text-neutral-400 text-sm font-medium mb-4">{title}</h3>
      <Spinner className="w-6 h-6 text-neutral-400" />
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-lg">
        <p className="text-neutral-400 text-xs mb-2">
          {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-neutral-300 capitalize">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

interface InsightsData {
  usd_to_lkr: { value: string; change: string; is_positive: boolean };
  fastest_gainer: { currency: string; change: string; rate: string };
  fastest_loser: { currency: string; change: string; rate: string };
  most_volatile: { currency: string; volatility: string; rate: string };
}

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [currencies, setCurrencies] = React.useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>("");
  const [compareCurrency, setCompareCurrency] = React.useState<string>("");
  const [chartData, setChartData] = React.useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = React.useState(false);
  const [insights, setInsights] = React.useState<InsightsData | null>(null);
  const [insightsLoading, setInsightsLoading] = React.useState(true);

  const mainNavItems: NavItem[] = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Gauge, label: 'Dashboard', href: '/dashboard' },
    { icon: GitBranch, label: 'Lifecycle', href: '/lifecycle' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: FolderKanban, label: 'Projects', href: '/projects' },
    { icon: Users, label: 'Team', href: '/team' },
  ];

  const documentItems: NavItem[] = [
    { icon: Database, label: 'Data Library', href: '/data-library' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: FileEdit, label: 'Word Assistant', href: '/word-assistant' },
    { icon: MoreHorizontal, label: 'More', href: '/more' },
  ];

  // fetch list of unique currencies on mount
  React.useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch(`${API_BASE}/currency_rates/currencies`);
        const data = await res.json();
        let list: string[] = [];
        if (Array.isArray(data.currencies)) list = data.currencies;
        else if (data && typeof data.currencies === 'object' && data.currencies !== null) list = Object.values(data.currencies as any);
        if (list && list.length > 0) {
          setCurrencies(list);
          // prefer USD as default if available
          if (list.includes('USD')) setSelectedCurrency('USD');
          else setSelectedCurrency(list[0]);
        }
      } catch (e) {
        console.error("Failed to fetch currencies", e);
      }
    };
    fetchCurrencies();

    // Fetch insights on mount
    const fetchInsights = async () => {
      setInsightsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/currency_rates/insights`);
        const data = await res.json();
        setInsights(data);
      } catch (e) {
        console.error("Failed to fetch insights", e);
      } finally {
        setInsightsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  // fetch chart data when selectedCurrency, compareCurrency, or timeRange changes
  React.useEffect(() => {
    const fetchAndMerge = async () => {
      if (!selectedCurrency) {
        setChartData([]);
        return;
      }
      setLoading(true);
      try {
        const currenciesToFetch = [selectedCurrency];
        if (compareCurrency && compareCurrency !== selectedCurrency) currenciesToFetch.push(compareCurrency);

        const results = await Promise.all(currenciesToFetch.map((c) =>
          fetch(`${API_BASE}/currency_rates/?currency=${encodeURIComponent(c)}&time_range=${encodeURIComponent(timeRange)}`).then(r => r.json()).catch(() => [])
        ));

        // results is array of arrays [{date, rate}, ...]
        const dateMap: Record<string, Record<string, any>> = {};
        results.forEach((series: any[], idx: number) => {
          const cur = currenciesToFetch[idx];
          if (!Array.isArray(series)) return;
          series.forEach((p: any) => {
            const date = p.date;
            if (!date) return;
            if (!dateMap[date]) dateMap[date] = { date };
            // store by currency code so dataKey can be dynamic
            dateMap[date][cur] = typeof p.rate === 'number' ? p.rate : Number(p.rate);
          });
        });

        // create sorted array of dates ascending
        const merged = Object.keys(dateMap).map(d => dateMap[d]);
        merged.sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime());

        setChartData(merged);
      } catch (e) {
        console.error('Failed to fetch/merge rates', e);
        setChartData([]);
      }
      setLoading(false);
    };
    fetchAndMerge();
  }, [selectedCurrency, compareCurrency, timeRange]);

  return (
    <div className="flex min-h-screen bg-black">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {insightsLoading ? (
            <>
              <LoadingStatCard title="USD to LKR" />
              <LoadingStatCard title="Fastest Gaining" />
              <LoadingStatCard title="Fastest Losing" />
              <LoadingStatCard title="Most Volatile" />
            </>
          ) : (
            <>
              <StatCard
                title="USD to LKR"
                value={insights?.usd_to_lkr.value || "N/A"}
                change={insights?.usd_to_lkr.change || "0.0%"}
                isPositive={insights?.usd_to_lkr.is_positive ?? false}
                subtitle={insights?.usd_to_lkr.is_positive ? "Rate up" : "Rate down"}
                description="Today's exchange rate"
              />
              <StatCard
                title="Fastest Gaining"
                value={insights?.fastest_gainer.currency || "N/A"}
                change={insights?.fastest_gainer.change || "0.0%"}
                isPositive={true}
                subtitle={`${insights?.fastest_gainer.rate || "0"} LKR`}
                description="7-day performance"
              />
              <StatCard
                title="Fastest Losing"
                value={insights?.fastest_loser.currency || "N/A"}
                change={insights?.fastest_loser.change || "0.0%"}
                isPositive={false}
                subtitle={`${insights?.fastest_loser.rate || "0"} LKR`}
                description="7-day performance"
              />
              <StatCard
                title="Most Volatile"
                value={insights?.most_volatile.currency || "N/A"}
                change={`σ: ${insights?.most_volatile.volatility || "0"}`}
                isPositive={false}
                subtitle={`${insights?.most_volatile.rate || "0"} LKR`}
                description="7-day std deviation"
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
        {/* Chart 1 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">{selectedCurrency ? `${selectedCurrency} to LKR` : 'Currency to LKR'}</h2>
              <p className="text-sm text-neutral-400">{timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : timeRange === '1y' ? 'Last 1 year' : timeRange === '5y' ? 'Last 5 years' : 'Selected period'}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={compareCurrency}
                onChange={(e) => setCompareCurrency(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              >
                <option value="">Compare (none)</option>
                {currencies.filter(c => c !== selectedCurrency).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="1y">Last 1 year</option>
                <option value="5y">Last 5 years</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
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
                {/* Primary series */}
                {selectedCurrency && (
                  <Area
                    type="natural"
                    dataKey={selectedCurrency}
                    name={selectedCurrency}
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.12}
                    strokeWidth={2}
                    connectNulls={true}
                  />
                )}
                {/* Compare series (blue) */}
                {compareCurrency && compareCurrency !== selectedCurrency && (
                  <Area
                    type="natural"
                    dataKey={compareCurrency}
                    name={compareCurrency}
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.12}
                    strokeWidth={2}
                    connectNulls={true}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
            {/* (debug panel removed) */}
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex justify-center items-center">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
            <div className='h-full flex flex-col justify-center items-center p-6'>
              <h1 className='text-white'>1 USD</h1>
              <h1 className='text-white font-extrabold text-4xl'>308.25</h1>
              <h1 className='text-white font-bold text-2xl'>LKR</h1>
              <p className='text-sm text-slate-50 text-center mt-4'>
                *The confidence score reflects how strongly our model believes in this prediction based on past data and market patterns
              </p>
              <div className='flex flex-col gap-4 justify-center items-center'>
                <div>
                  <h1 className='text-amber-500'>CONFIDENCE SCORE</h1>                  
                </div>
                <div>
                  <h1 className='text-amber-500 font-extrabold text-4xl'>83%</h1>
                </div>
              </div>
            </div>
            <div className='h-full flex flex-col justify-center items-center p-6'>
              <h1 className='text-amber-500 font-bold text-2xl text-center'>Tomorrow’s Price Outlook</h1>
              <p className='text-center text-slate-300'>
                Our system analyzes market trends and provides a predicted price movement for the next 24 hours to help you plan your trades confidently.
              </p>
              <Button
                variant={'secondary'}
                className='mt-4'
              >
                predict
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;