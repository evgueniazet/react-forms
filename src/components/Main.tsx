import React from 'react';
import { Link } from 'react-router-dom';

const Main: React.FC = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <Link to="/uncontrolled-form">Uncontrolled Form</Link>
      <Link to="/react-hook-form">React Hook Form</Link>
    </div>
  );
};

export default Main;
