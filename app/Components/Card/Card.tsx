import React from "react";
import style from "./Card.module.css";
import Image from "next/image";
import Link from "next/link";

const Card = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.imageContainer}>
          <Image src="/Food.jpg" alt="" fill className={style.image} />
        </div>
        <div className={style.textContainer}>
          <div className={style.detail}>
            <span className={style.date}>DATE</span>
            <span className={style.category}>Category </span>
          </div>
          <Link href="/" className={style.title}>
            <h1>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
              modi nesciunt natus.
            </h1>
          </Link>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
            inventore temporibus impedit odio animi porro dolorem?
          </p>
          <Link href="/" className={style.link}>
            <button>Read more</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Card;
