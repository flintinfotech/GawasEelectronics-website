# Gawas Electronics - Website

React + TypeScript + Vite. Is project ka folder structure **JNPV School project** jaisa rakha hai,
taaki koi bhi (naya beginner bhi) turant samajh sake ki konsi file kahan hai.

## Run kaise kare

```bash
npm install                 # pehli baar
cp .env.example .env        # agar .env nahi hai (Windows: copy .env.example .env)
npm run dev                 # development server
npm run build               # production build
```

## Folder structure (konsi file kahan hai)

```
.env                      <- backend URL (VITE_API_BASE_URL). .env.example uska sample hai
src/
 ├─ main.tsx              <- app start
 ├─ App.tsx               <- routes (kaunsa URL kaunsa page)
 ├─ index.css             <- global CSS (colors, .container, .btn ...)
 │
 ├─ pages/                <- poore screens (ek URL = ek page)
 │    Home.tsx · Products.tsx · ProductDetail.tsx
 │
 ├─ components/           <- chhote reusable UI tukde
 │    Banner.tsx · Product.tsx (ProductCard, ProductList) · ProductSlider.tsx
 │    Promo.tsx · Perks.tsx · Lifestyle.tsx
 │    layout/             Header.tsx · Footer.tsx · Logo.tsx
 │
 ├─ services/             <- BACKEND se baat karne wali files (types + API calls)
 │    apiEndpoints.ts      ★ SAARI API URLs yahi hain
 │    productService.ts    Product ke types + API calls + helpers
 │    bannerService.ts     Banner ke types + API call
 │
 ├─ hooks/                <- React hooks (data load + loading/error state)
 │    useProducts.ts · useBanners.ts
 │
 ├─ lib/
 │    apiClient.ts         common API client (base url, headers, error handling)
 │
 ├─ config/
 │    config.ts            .env ki value yahi se milti hai (config.baseURL)
 │    site.ts              website ki fixed details (naam, phone, devices)
 │
 ├─ context/StoreContext.tsx   cart + wishlist ki state
 ├─ utils/img.ts               chhote helper functions
 └─ assets/                    images
```

**Ek feature = ek jodi:** `components/Product.tsx` (UI) + `services/productService.ts` (data).
Banner ke liye `components/Banner.tsx` + `services/bannerService.ts`.

## Nayi API kaise add kare (3 step)

1. **`src/services/apiEndpoints.ts`** me URL add karo:
   ```ts
   getAllCategories: () => `/flint/category/getAllCategories`,
   ```
2. **`src/services/categoryService.ts`** banao (productService.ts ko copy karke):
   ```ts
   import { api } from '../lib/apiClient'
   import { apiEndpoints } from './apiEndpoints'

   export type Category = { categoryId: number; categoryName: string }

   export const getAllCategories = () =>
     api.post<Category[]>(apiEndpoints.getAllCategories(), {})
   ```
3. Page / component me `getAllCategories()` call karo (ya `hooks/useCategories.ts` banao).

## .env kaise kaam karta hai

- `.env` me `VITE_API_BASE_URL=...` likha hai.
- `src/config/config.ts` use padhta hai -> baaki poora code `config.baseURL` use karta hai.
- Value badalne ke baad `npm run dev` restart karo.

---

## Vite template notes (original README)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
