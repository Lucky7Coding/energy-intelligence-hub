# Deployment Guide - Energy Intelligence Hub

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 16+ installed
- ✅ Cloudflare account (free tier available)
- ✅ Git installed

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `itty-router` - Lightweight routing
- `wrangler` - Cloudflare CLI
- TypeScript dependencies

## Step 2: Authenticate with Cloudflare

```bash
npm run deploy
```

Or manually:

```bash
npx wrangler login
```

This will:
- Open your browser
- Ask you to authorize Cloudflare
- Save your credentials locally

## Step 3: Deploy to Cloudflare Workers

```bash
npm run deploy
```

You'll see output like:
```
✨ Built successfully
🚀 Uploaded to Cloudflare
⚙️ Deployed to https://energy-intelligence-hub.{your-domain}.workers.dev
```

## Step 4: Test Your Deployment

```bash
# Test the main site
curl https://energy-intelligence-hub.{your-domain}.workers.dev

# Test the APIs
curl https://energy-intelligence-hub.{your-domain}.workers.dev/api/health
curl https://energy-intelligence-hub.{your-domain}.workers.dev/api/brent-crude
curl https://energy-intelligence-hub.{your-domain}.workers.dev/api/exchange-rate
curl https://energy-intelligence-hub.{your-domain}.workers.dev/api/sa-fuel-prices
```

## Step 5: Connect Custom Domain (Optional)

If you have a custom domain:

1. Go to Cloudflare Dashboard
2. Add your domain
3. Update nameservers at your domain registrar
4. Create a Worker Route in Cloudflare Dashboard
5. Point `yoursite.com/*` to your Worker

## Environment Variables

If you need API keys, create a `.env` file:

```env
EXCHANGE_RATE_API_KEY=your_key_here
```

Then deploy:

```bash
npm run deploy
```

## Monitoring & Support

### View Logs
```bash
wrangler tail
```

### Check Cache Stats
```bash
curl https://your-domain/api/cache-stats
```

### Monitor Performance
- Cloudflare Dashboard → Workers → Metrics

## Troubleshooting

### API Returns 502 Error
- Check internet connection
- Verify APIs are accessible
- Check Cloudflare logs: `wrangler tail`

### Charts Not Loading
- Clear browser cache (Ctrl+Shift+Del)
- Check Chart.js CDN is accessible
- Inspect browser console for errors

### Contact Form Not Working
- Verify Cloudflare KV is set up (optional)
- Check form validation in browser console
- Review Worker logs: `wrangler tail`

## Performance Tips

✅ **Already Optimized:**
- 5-minute intelligent caching
- Gzip compression enabled
- CDN distribution via Cloudflare
- Minified assets
- lazy loading for charts

## Security

✅ **Already Configured:**
- CORS headers set correctly
- Input validation on forms
- No sensitive data in frontend
- Environment variables protected
- SSL/TLS automatic

## Next Steps After Deployment

1. **Share Your URL** - Your site is now live!
2. **Monitor Analytics** - Check Cloudflare Analytics
3. **Phase 2** - Add AI forecasting, news feed, PWA
4. **Custom Domain** - Set up professional domain
5. **Backups** - Repository is backed up on GitHub

## Getting Help

- **Cloudflare Docs**: https://developers.cloudflare.com/workers/
- **GitHub Issues**: Create an issue in your repository
- **Wrangler CLI**: `wrangler help`

---

**Your site is now deployed and live!** 🚀

View it at: `https://energy-intelligence-hub.{your-account}.workers.dev`
