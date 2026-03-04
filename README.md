## UI/UX Web Server - SAPTHAGIRI NPS Frontend

This is the front-end codebase for the **SAPTHAGIRI NPS University Portal** handling real-time views, dashboard UI, user authentication and interactivity logic.

---

## 🛠️ Technology Stack & Tooling

We built this UI carefully using leading React tooling configurations for performance and developer comfort:

- **Core Library**: React (v19.2) & React-DOM
- **Build Tooling**: Vite (`@vitejs/plugin-react`) yielding lightning quick dev startup times
- **Routing**: `react-router-dom` for complete single page application transitions without hard reloads
- **Styling Framework**: Tailwind CSS with integration helpers `autoprefixer`, `clsx`, `postcss`
- **Data Binding**: `axios` for fast backend backend requests 
- **Icons & Display**: `lucide-react` dynamically imported SVGs
- **Charting / Visuals**: `recharts` responsive D3 abstractions
- **Spreadsheets / Exports**: `xlsx` to handle exporting / table transformations
- **Code Standards**: `eslint` with strict rules for code styling

---

## 💻 Getting Started Locally

> Ensure Node.js & npm is installed. It is highly recommended to run the `<root>/snpsubknd` backend on port `5000` (or set matching env vars) prior to boot!

Install the exact package footprints needed:

```bash
# Open directory
cd /Users/laxman/snpsu/snpsufnd

# Grab all npm bundles
npm install

# Run the lightning vite dev server
npm run dev
```

Your React server should mount perfectly smoothly typically resting around `http://localhost:5173/`

---

## 🏗️ Building for Production

To create a minified artifact payload of JS, HTML and CSS files ready for CDN drop or Nginx static hosting.

```bash
# Build an optimized artifact. Usually exported directly to /dist/ folder array
npm run build

# To locally check formatting on the production chunk output prior to deploy:
npm run preview
```
