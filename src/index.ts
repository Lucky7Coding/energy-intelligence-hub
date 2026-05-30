import { Router } from 'itty-router';

const router = Router();

// Types
interface BrentData {
  price: number;
  currency: string;
  unit: string;
  timestamp: string;
  change24h: number;
  source: string;
}

interface ExchangeRateData {
  USD_ZAR: number;
  timestamp: string;
  source: string;
}

interface FuelPrice {
  unleaded95: number;
  unleaded93: number;
  diesel: number;
  timestamp: string;
  region: string;
}

// Cache helper
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache(key: string, fetcher: () => Promise<any>) {
  const now = Date.now();
  const cached = cache.get(key);
  
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, { data, timestamp: now });
  return data;
}

// API Routes

// Get Brent Crude Oil Data
router.get('/api/brent-crude', async (request: Request, env: any) => {
  try {
    return await fetchWithCache('brent-crude', async () => {
      // Using a free commodities API - you can upgrade to paid for more data
      const response = await fetch('https://api.example.com/brent-crude');
      
      // For demo, return realistic data structure
      const brentData: BrentData = {
        price: 82.45,
        currency: 'USD',
        unit: 'per barrel',
        timestamp: new Date().toISOString(),
        change24h: 1.2,
        source: 'demo'
      };

      return new Response(JSON.stringify(brentData), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch Brent crude data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Get USD/ZAR Exchange Rate
router.get('/api/exchange-rate', async (request: Request, env: any) => {
  try {
    return await fetchWithCache('exchange-rate', async () => {
      // Using exchangerate-api.com free tier
      const apiKey = env.EXCHANGE_RATE_API_KEY || 'demo';
      
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        const data = await response.json();
        
        const rateData: ExchangeRateData = {
          USD_ZAR: data.rates?.ZAR || 18.50,
          timestamp: new Date().toISOString(),
          source: 'exchangerate-api'
        };
        
        return new Response(JSON.stringify(rateData), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (err) {
        // Fallback demo data
        const fallback: ExchangeRateData = {
          USD_ZAR: 18.50,
          timestamp: new Date().toISOString(),
          source: 'demo'
        };
        return new Response(JSON.stringify(fallback), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        });
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch exchange rate' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Get SA Fuel Prices
router.get('/api/sa-fuel-prices', async (request: Request, env: any) => {
  try {
    return await fetchWithCache('sa-fuel-prices', async () => {
      // This would integrate with SA fuel price APIs
      const fuelData: FuelPrice = {
        unleaded95: 21.45,
        unleaded93: 20.89,
        diesel: 20.12,
        timestamp: new Date().toISOString(),
        region: 'Gauteng'
      };

      return new Response(JSON.stringify(fuelData), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch SA fuel prices' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Health check
router.get('/api/health', () => {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Contact form submission (KV storage)
router.post('/api/contact', async (request: Request, env: any) => {
  try {
    const data = await request.json();
    
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Store in KV (you'll need to set up KV in wrangler.toml)
    if (env.CONTACTS) {
      const id = `contact_${Date.now()}`;
      await env.CONTACTS.put(id, JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      }));
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to submit contact form' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Serve static assets
router.all('*', async (request: Request, env: any) => {
  try {
    let response = await env.ASSETS.fetch(request);
    
    if (response.status === 404 && !request.url.includes('/api')) {
      response = await env.ASSETS.fetch(new Request(new URL('/index.html', request.url).toString()));
    }
    
    return response;
  } catch (error) {
    return new Response('Not Found', { status: 404 });
  }
});

export default {
  fetch: router.handle
};
