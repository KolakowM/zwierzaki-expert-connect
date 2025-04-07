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
```

```css
/* Header.module.css */
.header {
  background-color: #f0f0f0;
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav {
  display: flex;
}

.navLink {
  color: #555;
  text-decoration: none;
  margin-left: 20px;
  transition: color 0.3s ease;
}

.navLink:hover {
  color: #0070f3;
}
