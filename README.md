# React + TypeScript + Vite

*******Project rule*******
## 🎨 Tailwind Design Rules
- Sử dụng class Tailwind ưu tiên `utility-first`, tránh viết CSS custom nếu không cần.
- Không override màu gốc của Tailwind (gray, blue...) nếu không có lý do rõ ràng.
- Chỉ mở rộng màu trong `tailwind.config.ts`, ví dụ:
  
  ## 🧼 Code Conventions
- Trang mới: Tạo folder trong features/, thêm vào AdminRoutes và NavLink để hiển thị.
  ( layout hiện tại đã có sẵn, khi code chỉ cần thêm vào trong AdminRoutes và tạo thêm 1 Item trong navItems để điều hướng )
- Tên file: Dùng PascalCase cho component, kebab-case cho asset/hình ảnh.
- Import: Sử dụng alias, ví dụ import { Button } from "@/components/ui/Button";.
- Quản lý asset: Import vào assets.ts trước, sau đó dùng trong file.
- Folder features: Dùng CamelCase cho tên folder (ví dụ: reportList, companyList).

















This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

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

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
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
