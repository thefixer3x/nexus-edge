import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Placeholder translations (normally these would be loaded from JSON files)
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Nexus Edge",
      "tagline": "The AI-powered development platform",
      "login": "Login",
      "signup": "Sign Up",
      "products": "Products",
      "cart": "Cart",
      "checkout": "Checkout",
      "settings": "Settings"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido a Nexus Edge",
      "tagline": "La plataforma de desarrollo con IA",
      "login": "Iniciar Sesión",
      "signup": "Registrarse",
      "products": "Productos",
      "cart": "Carrito",
      "checkout": "Pagar",
      "settings": "Configuración"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    }
  });

export default i18n;
