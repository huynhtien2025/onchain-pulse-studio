# OnChain Pulse Studio
https://onchain-pulse-studio.vercel.app/
SoSoValue buildathon theme: **Build Your One-Person On-Chain Finance Business**.

It combines:

- SoSoValue data/news/index intelligence
- SoDEX market/account/trade workflow
- Live market backup inside backend only
- Explainable signal scoring
- Portfolio/risk cockpit
- Buildathon pitch page


## SoDEX safety

`ENABLE_LIVE_TRADING=false` by default. The trade ticket returns a dry-run payload unless live trading is explicitly enabled.

## SoSoValue endpoint overrides

If your SoSoValue dashboard shows exact paths different from the defaults, set:

```env
SOSOVALUE_MARKET_PATH=
SOSOVALUE_NEWS_PATH=
SOSOVALUE_ETF_PATH=
SOSOVALUE_INDEX_PATH=
```
