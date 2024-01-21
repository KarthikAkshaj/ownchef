import React from "react";
import style from "./Featured.module.css";
import Image from "next/image";

const Featured = () => {
  return (
    <>
      <div className={style.container}>
        <h1 className={style.title}>
          <b className="font-semibold">Hey Chef!!</b> What you Cooking today??
        </h1>
        <div className={style.post}>
          <div className={style.imgContainer}>
            <Image src="/Food.jpg" alt="" fill className={style.image} />
          </div>
          <div className={style.textContainer}>
            <h1 className={style.postTitle}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor,
              atque!
            </h1>
            <p className={style.postDesc}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias
              nihil vitae natus aliquam numquam. Harum dolore nostrum unde quod
              dolores. Possimus nam laborum error facere! Et laudantium, iure
              sapiente sed distinctio atque. Temporibus, facilis vel unde quis
              nostrum suscipit autem pariatur tempora delectus possimus?
            </p>
            <button className={style.button}>Read More</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Featured;
