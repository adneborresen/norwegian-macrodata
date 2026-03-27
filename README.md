# Norwegian Macroeconomic Data

A read-only public dashboard for Norwegian macroeconomic indicators — policy rates, CPI, GDP, unemployment, exchange rates, and more. Data is sourced from [Norges Bank Open Data](https://www.norges-bank.no/en/topics/Statistics/open-data/) and [SSB StatBank](https://www.ssb.no/en/statbank).

Built with Next.js (App Router), Tailwind CSS, and Recharts. Deployed on Vercel.

## Data Sources

| Source | Format | Indicators |
|--------|--------|------------|
| [Norges Bank Open Data API](https://data.norges-bank.no) | SDMX-JSON | Policy rate, NOWA, EUR/NOK, USD/NOK |
| [SSB StatBank PxWebApi v2](https://data.ssb.no/api/pxwebapi/v2) | json-stat2 | CPI, GDP, unemployment, wages, house prices, trade |

Both sources are proxied through Next.js API routes with server-side caching to stay within SSB's 30 req/min rate limit.

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

## License

MIT
