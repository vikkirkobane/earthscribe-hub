# TerraGuardian Deployment Guide

## Environment Setup

Before deploying, ensure you have the following environment variables configured:

```bash
# Production Environment Variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLAUDE_API_KEY=your_claude_api_key
VITE_APP_ENV=production
VITE_APP_URL=your_production_url
```

## Deployment to Vercel

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy from the command line**:
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

3. **Or link your GitHub repository** to Vercel for automatic deployments on push.

## Deployment to Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Deploy**:
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## Manual Deployment

1. **Build the project**:
```bash
npm run build
```

2. **Serve the `dist` folder** using your preferred web server (Apache, Nginx, etc.).

## Post-Deployment Tasks

1. **Verify the deployment**:
   - Access your deployed application
   - Test basic functionality (registration, login)
   - Verify environment variables are loaded

2. **Set up monitoring**:
   - Configure error tracking (Sentry)
   - Set up performance monitoring
   - Configure uptime monitoring

3. **Configure domain** (if applicable):
   - Point your custom domain to the deployment
   - Configure SSL certificate

4. **Test offline functionality**:
   - Verify service worker is registered
   - Test offline mode capabilities

## Security Considerations

- **API Keys**: Never expose sensitive API keys in the client-side code
- **CORS**: Configure appropriate CORS settings in Supabase
- **Authentication**: Ensure secure token handling
- **Input Validation**: All inputs should be validated on the backend

## Performance Optimization

- **Bundle Size**: Monitor bundle size with `npm run build` and analyze with:
```bash
npm run build -- --analyze
```

- **Image Optimization**: Ensure all images are optimized for web
- **Caching**: Implement appropriate caching strategies
- **CDN**: Consider using a CDN for static assets

## Rollback Plan

If issues arise after deployment:

1. **Immediate**: Switch to a previous stable version if possible
2. **Diagnose**: Check logs and monitoring tools
3. **Fix**: Deploy the fix as a hotfix
4. **Verify**: Ensure all functionality works as expected

## Monitoring Checklist

After deployment, monitor:

- [ ] Application uptime
- [ ] Error rates
- [ ] Performance metrics
- [ ] User authentication
- [ ] API connectivity
- [ ] Offline functionality
- [ ] Service worker registration

## Troubleshooting

**Service Worker Issues:**
- Clear browser cache and hard refresh
- Check if service worker is registered in browser dev tools

**API Connection Issues:**
- Verify environment variables
- Check CORS settings in Supabase dashboard
- Confirm API endpoints are accessible

**Build Issues:**
- Ensure all dependencies are installed
- Check for TypeScript errors
- Verify environment variables are properly configured