import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { register } from './registerServiceWorker';

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    register({
      onSuccess: (registration) => {
        console.log('SW registered: ', registration);
      },
      onUpdate: (registration) => {
        console.log('SW updated: ', registration);
      }
    });
  });
}
