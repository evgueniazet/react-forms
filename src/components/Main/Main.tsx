import React from 'react';
import { useSelector } from 'react-redux';
import { selectFormImage } from '../../store/reducers/formReducer';
import { Link } from 'react-router-dom';
import styles from './Main.module.scss';

const Main: React.FC = () => {
  const formImage = useSelector(selectFormImage);

  return (
    <div>
      <h1 className={styles.title}>Main Page</h1>
      {formImage && <img src={formImage} alt="Uploaded" />}
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
