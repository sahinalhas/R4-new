# Deployment Guide

## Production Deployment on Replit

This application is configured for production deployment on Replit using the VM (Virtual Machine) deployment target, which maintains server state and is always running.

### Deployment Configuration

The application uses the following deployment settings:

- **Deployment Target**: VM (Virtual Machine)
- **Build Command**: `npm run build`
- **Run Command**: `npm start`

### Build Process

The build process includes two steps:

1. **Client Build** (`npm run build:client`)
   - Compiles React/TypeScript frontend with Vite
   - Applies production optimizations (minification, tree shaking, CSS code splitting)
   - Outputs to `dist/spa/` directory

2. **Server Build** (`npm run build:server`)
   - Compiles Express.js/TypeScript backend
   - Outputs to `dist/server/` directory

### Production Optimizations

The following optimizations are enabled for production builds:

#### Frontend (Vite)
- **Minification**: esbuild minifier for fast, efficient code compression
- **CSS Code Splitting**: Automatic splitting of CSS into smaller, cacheable chunks
- **Tree Shaking**: Removes unused code to reduce bundle size
- **Asset Compression**: gzip/brotli compression for static assets
- **Cache Headers**: Configured for optimal browser caching

#### Backend (Express.js)
- **Security Headers**: CORS, helmet for security
- **Database Connection Pooling**: SQLite with better-sqlite3
- **Error Handling**: Global error handlers with structured logging

### Environment Variables

No environment variables are currently required for basic operation. The application uses:

- SQLite database (file-based, no external database needed)
- No external API keys required for core functionality

### Database

The application uses SQLite with the following features:

- **Development Database**: `data.db` (auto-created on first run)
- **Automatic Migrations**: Schema migrations run automatically on startup
- **Database Indexes**: Performance indexes created automatically
- **Data Persistence**: Database file persists across deployments

### Monitoring & Logging

The application includes:

- **Structured Error Logging**: All errors logged with context
- **Global Error Handlers**: Catches uncaught exceptions and promise rejections
- **User-Facing Error Messages**: Toast notifications for user errors

### Performance

The application is optimized for:

- **React Query Configuration**:
  - `staleTime: 0` - Always fetch fresh data
  - `refetchOnWindowFocus: true` - Refresh data when user returns to tab
  - `refetchOnReconnect: true` - Refresh data after network reconnection

- **Database Indexes**: Optimized indexes on frequently queried columns
- **Production Build**: Minified and optimized bundles

### Deployment Steps

1. Click the **Deploy** button in Replit
2. The build process will run automatically
3. The production server will start on completion
4. Access your app via the deployment URL

### Post-Deployment Checklist

- [ ] Verify database initialized successfully
- [ ] Test core functionality (student management, counseling sessions)
- [ ] Check error handling (global error boundaries working)
- [ ] Verify data persistence across page refreshes
- [ ] Monitor logs for any errors or warnings

### Troubleshooting

**Database Errors**:
- Check that `data.db` file has correct permissions
- Verify migrations ran successfully (check startup logs)

**Build Failures**:
- Run `npm run lint` to check for linting errors
- Run `npm run typecheck` to verify TypeScript types
- Check `package.json` for missing dependencies

**Runtime Errors**:
- Check workflow logs for error messages
- Verify all required files are in `dist/` directory
- Ensure server is binding to correct port (5000)

### Rollback

If deployment issues occur, use Replit's built-in rollback feature to restore to a previous checkpoint.
