// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { UserProvider } from './context/UserContext';
import { TaskProvider } from './context/TaskContext';
// import { ThemeProvider } from './hooks/useTheme'; // Optional if using dark/light toggle

const Root = () => (
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <TaskProvider>
          {/* <ThemeProvider> */}
          <App />
          {/* </ThemeProvider> */}
        </TaskProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// ✅ Prevent duplicate createRoot() on hot reload
const container = document.getElementById('root');
if (!container._root) {
  const root = ReactDOM.createRoot(container);
  container._root = root;
  root.render(<Root />);
}
