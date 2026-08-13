# 🚀 Asmaulhusna Agro Farm (KhamarCare)

A comprehensive dairy and agro-farm management application to handle farm operations, finances, AI-assisted tools, and hardware integrations.

---

## 📦 Stack / Tech Used

| Technology   | Version | Purpose              |
|--------------|---------|----------------------|
| React / Vite | `^8.2`  | Frontend framework & bundler |
| Zustand      | `^5.0`  | State management     |
| Supabase     | `^2.112`| Backend & Auth       |
| Dexie        | `^4.4`  | Offline database (IndexedDB) |
| i18next      | `^26.3` | Internationalization |
| Recharts     | `^3.10` | Data visualization   |

---

## 📁 Project Structure

```text
.
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages/views
│   ├── services/        # External API & hardware services (AI, Bluetooth)
│   ├── stores/          # Zustand state stores
│   ├── db/              # Dexie database setup
│   ├── utils/           # Utility functions (Calculations, predictions)
│   ├── i18n/            # Internationalization config
│   └── assets/          # Static assets
├── public/              # Public assets
├── package.json         # Project dependencies
└── README.md            # This file
```

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) `v18+`
- [Git](https://git-scm.com/)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/webrezaul/khamarCare.git
cd khamarCare
```

### 2. Configure Environment

Create an `.env` file and fill in any necessary credentials (e.g., Supabase keys):

```bash
cp .env.example .env
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Project

```bash
npm run dev
```

### 5. Open in Browser

Visit `http://localhost:5173` (default Vite port) in your browser.

---

## 🔧 Configuration

| Variable                   | Default | Description                            |
|----------------------------|---------|----------------------------------------|
| `VITE_SUPABASE_URL`        | -       | Supabase project URL (if applicable)   |
| `VITE_SUPABASE_ANON_KEY`   | -       | Supabase anonymous key (if applicable) |

---

## 📋 Available Commands

| Command              | Description                          |
|----------------------|--------------------------------------|
| `npm run dev`        | Start development server             |
| `npm run build`      | Build for production                 |
| `npm run preview`    | Preview the production build         |

---

## 🌐 Deployment

You can deploy the built application (`dist/` folder after running `npm run build`) to any static hosting provider like Vercel, Netlify, or GitHub Pages.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Changelog

| Version | Date       | Changes                     |
|---------|------------|-----------------------------|
| `1.0.0` | 2026-08-13 | Initial release setup       |

---

## 📄 License

MIT

---

## 👤 Author

**Asmaulhusna Agro Farm**
- GitHub: [@webrezaul](https://github.com/webrezaul)
