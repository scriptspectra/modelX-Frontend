'use client';
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { city_list } from './cityList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WeatherData {
  city: string;
  lon: number;
  lat: number;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  pressure: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  windSpeed: number;
  windDirection: string;
  windDegree: number;
  gusts: number;
  icon: string;
}

interface Star {
  top: string;
  left: string;
  width: string;
  height: string;
  animation: string;
}

interface City {
  id: number;
  name: string;
  state: string;
  country: string;
  coord: { lon: number; lat: number };
}

const cityList: City[] = city_list;

function degreesToDirection(deg: number) {
  const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
  return directions[Math.round(deg / 45) % 8];
}

// Map weather icon codes to background images
const weatherBackgrounds: Record<string, string> = {
  '01d': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1200',
  '01n': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200',
  '02d': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200',
  '02n': 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=1200',
  '03d': 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1200',
  '03n': 'https://images.unsplash.com/photo-1532978379173-f0bc2c62d1f4?w=1200',
  '04d': 'https://images.unsplash.com/photo-1611928482473-7b27d24eab80?w=1200',
  '04n': 'https://images.unsplash.com/photo-1500740516770-92bd004b996e?w=1200',
  '09d': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200',
  '09n': 'https://images.unsplash.com/photo-1518803194621-27188ba362c9?w=1200',
  '10d': 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=1200',
  '10n': 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=1200',
  '11d': 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1200',
  '11n': 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1200',
  '13d': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200',
  '13n': 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?w=1200',
  '50d': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1200',
  '50n': 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=1200',
};

const WeatherUI: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Colombo');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [prompt, setPrompt] = useState('');
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Stars
  useEffect(() => {
    const generatedStars: Star[] = [...Array(100)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 3}px`,
      height: `${Math.random() * 3}px`,
      animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
    }));
    setStars(generatedStars);
  }, []);

  const filteredCities = cityList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setInsights([]);

    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityName, prompt }),
      });

      const res = await response.json();
      const w = res.data;

      setWeather({
        city: w.name,
        lon: w.coord.lon,
        lat: w.coord.lat,
        temp: Number((w.main.temp - 273.15).toFixed(1)),
        condition: w.weather[0].main,
        description: w.weather[0].description,
        humidity: w.main.humidity,
        pressure: w.main.pressure,
        feelsLike: Number((w.main.feels_like - 273.15).toFixed(1)),
        minTemp: Number((w.main.temp_min - 273.15).toFixed(1)),
        maxTemp: Number((w.main.temp_max - 273.15).toFixed(1)),
        windSpeed: w.wind.speed,
        windDegree: w.wind.deg,
        windDirection: degreesToDirection(w.wind.deg),
        gusts: w.wind?.gust || 0,
        icon: w.weather[0].icon,
      });

      setInsights(res.llmInsights?.insights?.slice(0, 6) || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedCity) fetchWeather(selectedCity.name);
  };

  useEffect(() => {
    const colombo = cityList.find(c => c.name === 'Colombo');
    if (colombo) {
      setSelectedCity(colombo);
      setSearchQuery(colombo.name);
      fetchWeather(colombo.name);
    }
  }, []);

  const displayed = weather;
  const iconUrl = displayed
    ? `https://openweathermap.org/img/wn/${displayed.icon}@4x.png`
    : "";

    const backgroundImage = displayed
    ? weatherBackgrounds[displayed.icon] 
        || weatherBackgrounds[displayed.icon.replace('n','d')] // fallback to day version
        || weatherBackgrounds['01d'] // ultimate fallback
    : weatherBackgrounds['01n'];

    console.log(backgroundImage)

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      <div
        className="relative w-full md:w-[500px] md:min-h-screen overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900/100 to-gray-900/70" />

        {/* STARS */}
        <div className="absolute inset-0 opacity-30">
          {stars.map((s, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.width,
                height: s.height,
                animation: s.animation,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        `}</style>

        <div className="relative z-10 p-8 max-w-md">
          {/* Search Input */}
          <div className="relative mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedCity(null);
                setShowDropdown(true);
              }}
              className="w-full bg-white/20 backdrop-blur-md text-white text-base px-5 py-3 rounded-xl outline-none placeholder-white/70 pr-12"
              placeholder="Search Sri Lankan city..."
            />
            <Search
              onClick={handleSubmit}
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5 cursor-pointer ${!selectedCity ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            />

            {/* Dropdown */}
            {showDropdown && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white/30 backdrop-blur-sm text-black rounded-b-xl max-h-60 overflow-y-auto z-20">
                {filteredCities.map(city => (
                  <div
                    key={city.id}
                    onClick={() => {
                      setSearchQuery(city.name);
                      setSelectedCity(city);
                      setShowDropdown(false);
                    }}
                    className="p-3 cursor-pointer hover:bg-white/50"
                  >
                    {city.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WEATHER DISPLAY */}
          {displayed && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-6xl font-bold text-white mb-1">{displayed.city}</h1>
                  <p className="text-white/80 text-sm mb-2">lon: {displayed.lon}, lat: {displayed.lat}</p>
                  <img src={iconUrl} alt="Weather Icon" className="w-24 h-24 drop-shadow-lg" />
                </div>

                <div className="text-right mt-4">
                  <div className="text-5xl font-bold text-white">{displayed.temp}°C</div>
                  <div className="text-2xl text-white mt-1">{displayed.condition}</div>
                  <div className="text-white/80 text-sm mt-1">{displayed.description}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
                  <div className="text-white/80 text-base mb-1">humidity</div>
                  <div className="text-4xl font-bold text-white">{displayed.humidity}</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
                  <div className="text-white/80 text-base mb-1">pressure</div>
                  <div className="text-4xl font-bold text-white">{displayed.pressure}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Temp", value: displayed.temp },
                  { label: "Feels", value: displayed.feelsLike },
                  { label: "Min", value: displayed.minTemp },
                  { label: "Max", value: displayed.maxTemp },
                ].map((item, i) => (
                  <div key={i} className="bg-white/15 backdrop-blur-md rounded-xl p-3">
                    <div className="text-white/80 text-xs uppercase mb-1">{item.label}</div>
                    <div className="text-xl font-bold text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-white text-base mb-2">Wind Speed</div>
                  <div className="text-4xl font-bold text-white">{displayed.windSpeed}</div>
                  <div className="text-white/80 text-sm">m/s</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-base mb-2">Wind Direction</div>
                  <div className="text-4xl font-bold text-white">{displayed.windDegree}°</div>
                  <div className="text-white/80 text-sm">{displayed.windDirection}</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-base mb-2">Gusts</div>
                  <div className="text-4xl font-bold text-white">{displayed.gusts}</div>
                  <div className="text-white/80 text-sm">m/s</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:flex-1 bg-black p-6 md:p-10">
        <h1 className="text-white text-3xl font-bold mb-6">Insights</h1>

        <Tabs defaultValue="Business" className="w-full">
        <TabsList className='bg-gray-800'>
            <TabsTrigger 
                value="Business"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-100"
            >
                Business
            </TabsTrigger>
            <TabsTrigger 
                value="Public"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-100"
            >
                Public
            </TabsTrigger>
        </TabsList>
        <TabsContent value="Business">
            {insights.map((i, idx) => {
                if (i.category == "Business") {
                    return(
                        <div key={idx} className="bg-white/10 text-white p-5 rounded-2xl mb-4">
                            <p className="text-base opacity-70">{i.category} → {i.area}</p>
                            <p className="text-xl font-semibold mt-2">{i.insight}</p>
                            <p className="text-sm opacity-80 mt-1">Why: {i.why}</p>
                        </div>
                    )
                }
            })}
        </TabsContent>
        <TabsContent value="Public">
            {insights.map((i, idx) => {
                if (i.category == "Public") {
                    return(
                        <div key={idx} className="bg-white/10 text-white p-5 rounded-2xl mb-4">
                            <p className="text-base opacity-70">{i.category} → {i.area}</p>
                            <p className="text-xl font-semibold mt-2">{i.insight}</p>
                            <p className="text-sm opacity-80 mt-1">Why: {i.why}</p>
                        </div>
                    )
                }
            })}
        </TabsContent>
        </Tabs>

        {loading && <p className="text-white opacity-70">Loading...</p>}
      </div>
    </div>
  );
};

export default WeatherUI;
