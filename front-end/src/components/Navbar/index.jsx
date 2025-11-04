import styles from "./Navbar.module.css";

export function Navbar() {
  return (
    <header className={styles.header}>
      <a href="#" className={styles.logo} tabIndex="1">
        Stock dos Bons
      </a>

      <input className={styles.menuBtn} type="checkbox" id="menu-btn" />
      <label className={styles.menuIcon} htmlFor="menu-btn">
        <span className={styles.navicon}></span>
      </label>

      <ul className={styles.menu}>
        <li>
          <a href="/electronics" tabIndex="2">
            Eletrônicos
          </a>
        </li>
        <li>
          <a href="/furniture" tabIndex="3">
            Móveis
          </a>
        </li>
        <li>
          <a href="/hortifruti" tabIndex="4">
            Hortifruti
          </a>
        </li>
      </ul>

      <div className={styles.searchContainer}>
        <input
          type="text"
          id="InputSearch"
          placeholder="Buscar produto..."
          tabIndex="16"
        />
      </div>
    </header>
  );
}
