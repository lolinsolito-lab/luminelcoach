import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const crown = `
       ✧             ✧
      /\\             /\\
     /  \\   _   _   /  \\
    /    \\ / \\ / \\ /    \\
   /      V   V   V      \\
  /                       \\
 /_________________________\\
`;

console.log(
  `%c${crown}`,
  "color: #C9A84C; font-weight: bold; font-family: monospace; font-size: 14px; text-shadow: 0 0 10px rgba(201,168,76,0.5);"
);
console.log(
  "%c LUMINEL ",
  "font-size: 46px; font-weight: 900; color: #C9A84C; text-shadow: 0 0 20px rgba(201,168,76,0.8); font-family: 'Cormorant Garamond', serif; letter-spacing: 12px;"
);
console.log(
  "%c TRANSFORMATIONAL COACHING ",
  "font-size: 14px; font-weight: bold; color: #F0EBE0; background: #06060F; padding: 8px 24px; border: 1px solid #C9A84C; letter-spacing: 8px; border-radius: 4px; display: inline-block; margin-top: 10px; margin-bottom: 10px;"
);
console.log(
  "%c✦ Insolito Experiences · Metodo Ikigai · Legge 4/2013 ✦",
  "color: #6A6560; font-size: 12px; letter-spacing: 2px;"
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);