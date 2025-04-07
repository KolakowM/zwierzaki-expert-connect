
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          PetProfile
        </Link>
        <nav className={styles.nav}>
          <Link to="/pets" className={styles.navLink}>
            Pets
          </Link>
          <Link to="/care" className={styles.navLink}>
            Care Programs
          </Link>
          <Link to="/account" className={styles.navLink}>
            Account Settings
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
