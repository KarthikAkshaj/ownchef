"use client";

import React, { useContext } from "react";
import style from "./ThemeToggle.module.css";
import Image from "next/image";
import ThemeContext from "@/Context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggle } = useContext(ThemeContext);

  return (
    <>
      <div className={style.container} onClick={toggle}>
        <Image
          src="/Moon.png"
          alt=""
          width={16}
          height={16}
          className={style.Image_Moon}
        />
        <div
          className={style.ball}
          style={
            theme === "dark"
              ? { left: 1, backgroundColor: "#003566" }
              : { right: 1, backgroundColor: "#e9ecef" }
          }
        ></div>
        <Image
          src="/Sun.png"
          alt=""
          width={16}
          height={16}
          className={style.Image_Sun}
        />
      </div>
    </>
  );
};

export default ThemeToggle;
