# Fix for Rollup Native Binary Error on Linux Server

## Problem
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

This is a known npm bug with optional dependencies. Rollup's native binary for Linux wasn't installed.

## Solution

Run these commands on your Linux server:

```bash
# Navigate to your project directory
cd /var/www/coe-sched

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall all dependencies
npm install

# Rebuild the application
npm run build
```

## Alternative: Force Install Rollup Binary

If the above doesn't work, try:

```bash
# Install the specific rollup binary for Linux
npm install --save-optional @rollup/rollup-linux-x64-gnu

# Then rebuild
npm run build
```

## Prevention

To prevent this in the future:
1. Always run `npm install` on the same platform where you'll build
2. Or use Docker to ensure consistent environments
3. Consider using `npm ci` instead of `npm install` in production

