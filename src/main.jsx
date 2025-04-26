import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initViewportHandler } from './utils/viewportHandler';

// Initialize mobile viewport optimizations
const viewportHandler = initViewportHandler();

// Add global error handling for production
if (process.env.NODE_ENV === 'production') {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Could send to error tracking service here
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Create a resize observer for dynamic adjustments
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    const gameContainer = entry.target;
    
    // Adjust scaling for games based on container size
    if (gameContainer.classList.contains('game-container')) {
      const { width, height } = entry.contentRect;
      
      // Calculate optimal scaling
      if (width < 576 || height < 400) {
        // For very small screens, apply stronger scaling
        gameContainer.style.transform = 'scale(0.85)';
        gameContainer.style.transformOrigin = 'center center';
      } else if (width < 768) {
        // For medium screens
        gameContainer.style.transform = 'scale(0.9)';
        gameContainer.style.transformOrigin = 'center center';
      } else {
        // Reset for larger screens
        gameContainer.style.transform = 'none';
      }
    }
  }
});

// Apply resize observer to game containers when they're created
// We use a mutation observer to watch for game containers added to the DOM
const mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const gameContainers = node.querySelectorAll('.game-container');
        gameContainers.forEach(container => {
          resizeObserver.observe(container);
        });
      }
    });
  });
});

// Start observing the document body for game container additions
mutationObserver.observe(document.body, { childList: true, subtree: true });