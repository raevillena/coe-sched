# Build Fix Instructions

## Issue: framer-motion dependency error

The error `"isBezierDefinition" is not exported by "node_modules/motion-dom/dist/es/index.mjs"` is caused by a version mismatch between `framer-motion` and its dependency `motion-dom`.

## Solution

Run these commands on your server:

```bash
cd /var/www/coe-sched

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall all dependencies (this will get compatible versions)
npm install

# If the error persists, explicitly install compatible versions
npm install framer-motion@latest motion-dom@latest

# Rebuild
npm run build
```

## Alternative: Update package.json

If the above doesn't work, update framer-motion to the latest version:

```bash
npm install framer-motion@latest
npm run build
```

## What Changed

1. Updated `vite.config.js` with better dependency resolution
2. Changed framer-motion version to use `^` for better compatibility
3. Added optimizeDeps configuration for better handling of framer-motion

