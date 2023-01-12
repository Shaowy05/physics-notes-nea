// Importing the React library
import React from 'react';

// Importing ReactDOM library
import ReactDOM from 'react-dom/client';

// Importing styling for index.js
import './index.css';

// Importing the App Component which contains our React App
import App from './App';

// Creating a 'root' i.e the document, which allows us to display our
// App on the website
const root = ReactDOM.createRoot(document.getElementById('root'));

// Using .render to finally display the App upon execution
root.render(
    <App />
);