const EXCHANGE_RATE_BASE_URL = "https://open.er-api.com/v6/latest";

interface ExchangeRates {
  AED: number;
  USD: number;
  EUR: number;
  GBP: number;
  THB: number;
  IDR: number;
  TRY: number;
  [key: string]: number;
}

let cachedRates: ExchangeRates | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();
  
  if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const response = await fetch(`${EXCHANGE_RATE_BASE_URL}/AED`);
    const data = await response.json();
    
    if (data.result === "success") {
      cachedRates = data.rates;
      cacheTimestamp = now;
      return data.rates;
    }
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
  }

  // Fallback rates if API fails
  return {
    AED: 1,
    USD: 0.27,
    EUR: 0.25,
    GBP: 0.21,
    THB: 9.5,
    IDR: 4250,
    TRY: 8.8,
  };
}

export async function convertToAED(amount: number, fromCurrency: string): Promise<number> {
  if (fromCurrency === "AED") return amount;
  
  const rates = await getExchangeRates();
  const rate = rates[fromCurrency];
  
  if (!rate) {
    console.warn(`Unknown currency: ${fromCurrency}, returning original amount`);
    return amount;
  }
  
  // Convert: amount in foreign currency / rate = AED
  return Math.round(amount / rate);
}

export async function convertFromAED(amountAED: number, toCurrency: string): Promise<number> {
  if (toCurrency === "AED") return amountAED;
  
  const rates = await getExchangeRates();
  const rate = rates[toCurrency];
  
  if (!rate) {
    console.warn(`Unknown currency: ${toCurrency}, returning original amount`);
    return amountAED;
  }
  
  return Math.round(amountAED * rate);
}

export function formatCurrencyWithSymbol(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    AED: "AED",
    USD: "$",
    EUR: "€",
    GBP: "£",
    THB: "฿",
    IDR: "Rp",
    TRY: "₺",
  };
  
  const symbol = symbols[currency] || currency;
  return `${symbol} ${amount.toLocaleString()}`;
}
