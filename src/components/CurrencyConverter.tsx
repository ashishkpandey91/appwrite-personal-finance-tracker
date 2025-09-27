import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight } from "lucide-react";

const CURRENCIES = [
  "USD",
  "EUR",
  "INR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "KRW",
];

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`
      );
      if (!response.ok) throw new Error("Failed to fetch exchange rate");

      const data = await response.json();
      if (data.result !== "success")
        throw new Error(data.error || "Error fetching data");

      const rate = data.rates[toCurrency];
      if (!rate) throw new Error("Invalid currency pair");

      setExchangeRate(rate);
      const amt = parseFloat(amount) || 0;
      setConvertedAmount(amt * rate);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-[650px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Currency Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full"
            />
          </div>

          <div className="flex space-x-2">
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="From Currency" />
              </SelectTrigger>
              <SelectContent className="max-h-48 overflow-y-auto">
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={swapCurrencies}>
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="To Currency" />
              </SelectTrigger>
              <SelectContent className="max-h-48 overflow-y-auto">
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {loading && <p className="text-center text-gray-500">Converting...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && convertedAmount !== null && !error && (
              <p className="text-center text-lg font-semibold">
                {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
              </p>
            )}
            {exchangeRate && (
              <p className="text-center text-sm text-gray-500">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverter;