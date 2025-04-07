
import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          PetProfile
        </Link>
        <nav className={styles.nav}>
          <Link href="/pets" className={styles.navLink}>
            Pets
          </Link>
          <Link href="/care" className={styles.navLink}>
            Care Programs
          </Link>
          <Link href="/account" className={styles.navLink}>
            Account Settings
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
