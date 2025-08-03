# JobHuntly Admin Dashboard

Admin site cho nền tảng tuyển dụng **JobHuntly**. Ứng dụng được xây dựng với **React + Vite**, sử dụng kiến trúc **feature-based**, tích hợp **Redux Toolkit**, **Zustand**, và hỗ trợ đa ngôn ngữ qua `react-i18next`.

---

## 🧱 Tech Stack

- **React 18 + Vite**
- **Redux Toolkit + Zustand**
- **TailwindCSS**
- **ShadCN/UI + Custom UI**
- **i18n (vi + en)**
- **Modular (Feature-based) Folder Structure**

---

## 🚀 Scripts

| Command           | Mục đích                        |
| ----------------- | ------------------------------- |
| `npm run dev`     | Chạy project ở môi trường local |
| `npm run build`   | Build project production        |
| `npm run preview` | Preview sau khi build           |

---

## 📁 Folder Structure

```bash
src/
├── app/                    # Redux store chính
├── assets/                # Hình ảnh, tài nguyên tĩnh
├── components/            # UI components dùng chung (common, layout, ui-kit)
├── config/                # Cấu hình axios, biến môi trường
├── constants/             # Enum, roles, config hằng số
├── features/              # Các module chia theo tính năng
├── hooks/                 # Custom hooks
├── i18n/                  # Đa ngôn ngữ
├── layouts/               # Bố cục layout (AdminLayout, v.v.)
├── pages/                 # Trang đơn (404, 500...)
├── routes/                # Cấu hình route, protected route
├── services/              # Dịch vụ toàn cục (ex: notification)
├── store/                 # Slice ngoài feature
├── styles/                # CSS toàn cục
├── types/                 # Các định nghĩa TypeScript
└── main.tsx, App.tsx      # Điểm khởi động ứng dụng
```

## 📦 Feature Modules

Ví dụ về features/candidatelist:

```bash
features/
└── candidatelist/
    ├── components/       # UI component nội bộ
    ├── pages/            # Trang chính
    ├── services/         # API hoặc mock API
    └── mock/             # Dữ liệu mẫu

```

## 🔐 Authentication

- **Sử dụng Redux slice authSlice.ts**

- **LoginPage.tsx nằm trong features/auth/pages**

- **Tích hợp guard tại routes/ProtectedRoute.tsx**

## 🌐 Đa ngôn ngữ (i18n)
- **Cấu hình tại i18n/i18n.ts**

- **File ngôn ngữ tại i18n/locales/vi.po và en.po**

