# Changes

## GitHub Pages Setup
- Added `base: '/RPGDate/'` to vite.config.js for proper asset paths
- Added `gh-pages` as dev dependency
- Added `deploy` script to package.json

## Deployment Steps
1. Install the new dependency: `npm install`
2. Make sure your code is committed to git
3. Run: `npm run deploy`
4. Go to your GitHub repo → Settings → Pages
5. Set Source to "gh-pages" branch
6. Your site will be live at: `https://[your-username].github.io/RPGDate/`

**Note:** If your repository name is different from "RPGDate", update the `base` value in `vite.config.js` to match your repo name.
