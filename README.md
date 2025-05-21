# Nexus Edge – AI-Assisted Marketplace

A modern, AI-powered marketplace built with TypeScript, React, Tailwind CSS, Vite, and shadcn/ui. Features include product recommendations, natural language search, chat-based support, and a premium, accessible UI.

---

## Tech Stack

- **TypeScript** – Type-safe development
- **React** – Component-based UI
- **Tailwind CSS** – Utility-first styling
- **Vite** – Fast build tool
- **shadcn/ui** – Accessible UI components
- **Zustand/Jotai** – State management
- **React Query** – Data fetching/caching
- **Supabase/Firebase** – Authentication & backend
- **Other**: Radix UI, class-variance-authority, clsx, lucide-react

---

## Project Structure

```
marketplace/
├── public/                # Static assets (index.html, favicon, etc.)
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components (Index, ProductListing, etc.)
│   ├── lib/               # Utility functions, API clients
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   ├── stores/            # State management (Zustand/Jotai)
│   ├── config/            # App configuration
│   ├── contexts/          # React context providers (Auth, Theme)
│   └── App.tsx            # Main app component
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
├── package.json           # Project dependencies and scripts
└── ...                    # Other configs, backend, and integrations
```

---

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Development server

```sh
npm run dev
```

### 3. Build for production

```sh
npm run build
```

### 4. Lint and format

```sh
npm run lint
npm run format
```

---

## Features

- **Homepage**: Featured products, AI recommendations
- **Product Listing**: Filters, search, and recommendations
- **Product Detail**: AI-powered Q&A, details, and add to cart
- **Cart & Checkout**: Modern, secure checkout flow
- **User Dashboard**: Order history, wishlist, editable profile
- **AI Integration**: Product recommendations, chat support, personalized suggestions
- **Performance**: Lazy loading, skeleton states, API caching, code splitting
- **Modern UI/UX**: Accessible focus, dark mode, smooth scroll, adaptive cursor, responsive design

---

## Enhancements

- Modern meta tags for SEO/social
- Resource preloading (fonts, critical assets)
- Adaptive cursor (desktop only)
- Smooth scroll and optional scroll snap
- Dark mode via CSS variables
- Accessible focus states

---

## Security & Privacy

- Secure APIs and route protection
- Token management (HTTP-only cookies or secure storage)
- Data privacy (GDPR compliance, user data management)
- Encryption in transit and at rest

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

MIT

---

## Credits

- [shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Firebase](https://firebase.google.com/)

---

Let me know if you want to add more sections (e.g., API docs, deployment, or advanced usage)!

## Sayswitch API

## Wyse API



The API credentials are securely stored in the Supabase vault:

## Implementation Notes

- All API calls are routed through Supabase Edge Functions
- Credentials are managed via Supabase Secrets
- Rate limiting is handled at the Edge Function level
- limited data is cached in Supabase Storage
- Response times and success rates are monitored
