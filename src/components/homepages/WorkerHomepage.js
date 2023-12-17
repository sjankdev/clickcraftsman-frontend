import React from 'react';

const ClientHomepage = () => {
  return (
    <div>
      <header>
        <h1>Simple React Component</h1>
      </header>

      <main>
        <h2>Welcome to my React website!</h2>
        <p>This is a simple React component.</p>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Your Name</p>
      </footer>
    </div>
  );
};

export default ClientHomepage;
