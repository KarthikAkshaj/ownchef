import React from "react";
import style from "./SinglePage.module.css";
import Menu from "@/app/Components/Menu/Menu";
import Image from "next/image";

const page = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.infoContainer}>
          <div className={style.textContainer}>
            <h1>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo,
              aliquam?
            </h1>
            <div className={style.user}>
              <div className={style.userImageContainer}>
                <Image src="/Food.jpg" alt="pic" fill className={style.image} />
              </div>
              <div className={style.userTextContainer}>
                <span className={style.username}>YUJI ITADORI</span>
                <span className={style.date}>17.09.2024</span>
              </div>
            </div>
          </div>
          <div className={style.imageContainer}>
            <Image src="/Food.jpg" alt="pic" fill className={style.image} />
          </div>
        </div>
        <div className={style.content}>
          <div className={style.post}></div>
          <Menu />
        </div>
      </div>
    </>
  );
};

export default page;
