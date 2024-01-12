import React from "react";
import style from "./ThemeToggle.module.css";
import Image from "next/image";

const ThemeToggle = () => {
  return (
    <>
      <div className={style.container}>
        <Image src="/Moon.png" alt="" width={16} height={16} />
        <div className={style.ball}></div>
        <Image src="/Sun.png" alt="" width={16} height={16} />
      </div>
    </>
  );
};

export default ThemeToggle;
