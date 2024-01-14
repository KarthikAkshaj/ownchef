import React from "react";
import style from "./CategoryList.module.css";
import Link from "next/link";

const CategoryList = () => {
  return (
    <>
      <div className={style.container}>
        <h1 className={style.title}>
          <span className={style.utxt}>Popular Catego</span>ries
        </h1>
        <div className={style.categories}>
          <Link
            href="/blog?cat=style"
            className={`${style.category} ${style.indian}`}
          >
            Indian
          </Link>
          <Link
            href="/blog?cat=style"
            className={`${style.category} ${style.italian}`}
          >
            Italian
          </Link>
          <Link
            href="/blog?cat=style"
            className={`${style.category} ${style.chinese}`}
          >
            Chinese
          </Link>
          <Link
            href="/blog?cat=style"
            className={`${style.category} ${style.thai}`}
          >
            Thai
          </Link>
          <Link
            href="/blog?cat=style"
            className={`${style.category} ${style.japanese}`}
          >
            Japanese
          </Link>
          <Link
            href="/blog?cat=style"
            className={`${style.category} ${style.spanish}`}
          >
            Spanish
          </Link>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
