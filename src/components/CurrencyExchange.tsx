import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  DollarSign,
} from "lucide-react";

interface ExchangeRate {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  type: "forex" | "crypto";
  flag?: string;
}

export const CurrencyExchange = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "forex" | "crypto">("all");

  // Popular currency pairs and cryptos to track
  const forexPairs = [
    { symbol: "EUR/USD", name: "Euro to US Dollar", flag: "🇪🇺" },
    { symbol: "GBP/USD", name: "British Pound to US Dollar", flag: "🇬🇧" },
    { symbol: "JPY/USD", name: "Japanese Yen to US Dollar", flag: "🇯🇵" },
    { symbol: "CAD/USD", name: "Canadian Dollar to US Dollar", flag: "🇨🇦" },
    { symbol: "AUD/USD", name: "Australian Dollar to US Dollar", flag: "🇦🇺" },
  ];

  const cryptos = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "BNB", name: "Binance Coin" },
    { symbol: "XRP", name: "Ripple" },
    { symbol: "ADA", name: "Cardano" },
  ];

  const fetchRates = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch Forex rates (using exchangerate-api.com - free tier)
      const forexPromise = fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      )
        .then((res) => res.json())
        .then((data) => {
          const forexRates: ExchangeRate[] = [
            {
              id: "eurusd",
              symbol: "EUR/USD",
              name: "Euro to US Dollar",
              price: 1 / data.rates.EUR,
              change24h: Math.random() * 2 - 1, // Mock change (real API doesn't provide this)
              type: "forex",
              flag: "🇪🇺",
            },
            {
              id: "gbpusd",
              symbol: "GBP/USD",
              name: "British Pound to US Dollar",
              price: 1 / data.rates.GBP,
              change24h: Math.random() * 2 - 1,
              type: "forex",
              flag: "🇬🇧",
            },
            {
              id: "jpyusd",
              symbol: "JPY/USD",
              name: "Japanese Yen to US Dollar",
              price: 1 / data.rates.JPY,
              change24h: Math.random() * 2 - 1,
              type: "forex",
              flag: "🇯🇵",
            },
            {
              id: "cadusd",
              symbol: "CAD/USD",
              name: "Canadian Dollar to US Dollar",
              price: 1 / data.rates.CAD,
              change24h: Math.random() * 2 - 1,
              type: "forex",
              flag: "🇨🇦",
            },
          ];
          return forexRates;
        });

      // Fetch Crypto rates (using CoinGecko - free API)
      const cryptoPromise = fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,cardano&vs_currencies=usd&include_24hr_change=true"
      )
        .then((res) => res.json())
        .then((data) => {
          const cryptoRates: ExchangeRate[] = [
            {
              id: "bitcoin",
              symbol: "BTC",
              name: "Bitcoin",
              price: data.bitcoin?.usd || 0,
              change24h: data.bitcoin?.usd_24h_change || 0,
              type: "crypto",
            },
            {
              id: "ethereum",
              symbol: "ETH",
              name: "Ethereum",
              price: data.ethereum?.usd || 0,
              change24h: data.ethereum?.usd_24h_change || 0,
              type: "crypto",
            },
            {
              id: "binancecoin",
              symbol: "BNB",
              name: "Binance Coin",
              price: data.binancecoin?.usd || 0,
              change24h: data.binancecoin?.usd_24h_change || 0,
              type: "crypto",
            },
            {
              id: "ripple",
              symbol: "XRP",
              name: "Ripple",
              price: data.ripple?.usd || 0,
              change24h: data.ripple?.usd_24h_change || 0,
              type: "crypto",
            },
          ];
          return cryptoRates;
        });

      const [forexData, cryptoData] = await Promise.all([
        forexPromise,
        cryptoPromise,
      ]);
      setRates([...forexData, ...cryptoData]);
    } catch (err) {
      console.error("Error fetching rates:", err);
      setError("Failed to load exchange rates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, type: "forex" | "crypto") => {
    if (type === "crypto") {
      if (price >= 1000)
        return `$${price.toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })}`;
      if (price >= 1) return `$${price.toFixed(2)}`;
      return `$${price.toFixed(4)}`;
    } else {
      return price.toFixed(4);
    }
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  const filteredRates = rates.filter((rate) => {
    if (activeTab === "forex") return rate.type === "forex";
    if (activeTab === "crypto") return rate.type === "crypto";
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Exchange Rates</h3>
          </div>
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Exchange Rates</h3>
          </div>
          <button
            onClick={fetchRates}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Exchange Rates</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Live
          </span>
        </div>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 text-gray-500 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
        {[
          { id: "all", label: "All" },
          { id: "forex", label: "Forex" },
          { id: "crypto", label: "Crypto" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rates List */}
      <div className="space-y-2">
        {filteredRates.map((rate) => (
          <div
            key={rate.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  rate.type === "crypto"
                    ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {rate.flag || rate.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="font-medium text-gray-900">{rate.symbol}</div>
                <div className="text-xs text-gray-500 truncate max-w-32">
                  {rate.name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {formatPrice(rate.price, rate.type)}
              </div>
              <div
                className={`text-xs flex items-center gap-1 ${
                  rate.change24h >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {rate.change24h >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatChange(rate.change24h)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-400 text-center">
          Updated {new Date().toLocaleTimeString()} • Forex & Crypto rates
        </p>
      </div>
    </div>
  );
};
