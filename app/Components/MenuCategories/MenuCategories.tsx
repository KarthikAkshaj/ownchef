import Link from "next/link";
import React from "react";
import styles from "./MenuCategories.module.css";

const MenuCategories = () => {
  return (
    <div className={styles.categoryList}>
      <Link
        href="/blog?cat=style"
        className={`${styles.categoryItem} ${styles.style}`}
      >
        Thai
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.fashion}`}>
        Japanese
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.food}`}>
        Italian
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.travel}`}>
        Indian
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.culture}`}>
        Spanish
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.coding}`}>
        Chinese
      </Link>
    </div>
  );
};

export default MenuCategories;
