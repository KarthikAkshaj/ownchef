import React from "react";
import style from "./SinglePage.module.css";
import Menu from "@/app/Components/Menu/Menu";
import Image from "next/image";
import Comments from "@/app/Components/Comments/Comments";

const page = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.infoContainer}>
          <div className={style.textContainer}>
            <h1 className="text-5xl font-medium">
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
          <div className={style.post}>
            <div className={style.description}>
              <h1 className="text-4xl font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing.
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perferendis autem repudiandae sit delectus culpa quisquam,
                labore mollitia voluptatibus veritatis! Consectetur earum unde
                ut animi ea, corporis assumenda debitis delectus repudiandae
                laborum asperiores quos nihil? Facere pariatur veniam incidunt
                itaque! Autem magni dolorum nihil cupiditate veniam tempore,
                ducimus reiciendis eveniet quae sit itaque nostrum maiores
                suscipit accusamus numquam non odio et, incidunt facilis,
                asperiores veritatis? Quidem unde similique aspernatur quo.
              </p>
            </div>
            <div className={style.comment}>
              <Comments />
            </div>
          </div>
          <Menu />
        </div>
      </div>
    </>
  );
};

export default page;
