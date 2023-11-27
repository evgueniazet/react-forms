import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.module.scss';

const Main: React.FC = () => {
  return (
    <div>
      <h1 className={styles.title}>Main Page</h1>
      <Link className={styles.link} to="/uncontrolled-form">
        Uncontrolled Form
      </Link>
      <Link className={styles.link} to="/react-hook-form">
        React Hook Form
      </Link>
    </div>
  );
};

export default Main;
