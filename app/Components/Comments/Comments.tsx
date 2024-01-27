import React from "react";
import style from "./Comments.module.css";
import Link from "next/link";
import Image from "next/image";

const Comments = () => {
  const status = true;

  return (
    <>
      <div className={style.container}>
        <div className={style.title}>Comments</div>
        {status === true ? (
          <div className={style.write}>
            <textarea
              placeholder="Write a Comment..."
              className={style.input}
            ></textarea>
            <button className={style.button}> Send </button>
          </div>
        ) : (
          <Link href="/Login">Please Login to Write a comment</Link>
        )}

        <div className={style.comments}>
          <div className={style.comment}>
            <div className={style.user}>
              <div className={style.Cimage}>
                <Image
                  src="/Food.jpg"
                  alt="user Image"
                  fill
                  className={style.image}
                />
              </div>
              <div className={style.stylearound}>
                <div className={style.userInfo}>
                  <span className={style.username}>Megumi Fusigouro</span>
                  <span className={style.date}>10.02.2023</span>
                </div>
                <p className={style.desc}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Corrupti, molestiae optio odio dolorum recusandae
                  perspiciatis.
                </p>
              </div>
            </div>
          </div>
          <div className={style.comment}>
            <div className={style.user}>
              <div className={style.Cimage}>
                <Image
                  src="/Food.jpg"
                  alt="user Image"
                  fill
                  className={style.image}
                />
              </div>
              <div className={style.stylearound}>
                <div className={style.userInfo}>
                  <span className={style.username}>Megumi Fusigouro</span>
                  <span className={style.date}>10.02.2023</span>
                </div>
                <p className={style.desc}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Corrupti, molestiae optio odio dolorum recusandae
                  perspiciatis.
                </p>
              </div>
            </div>
          </div>
          <div className={style.comment}>
            <div className={style.user}>
              <div className={style.Cimage}>
                <Image
                  src="/Food.jpg"
                  alt="user Image"
                  fill
                  className={style.image}
                />
              </div>
              <div className={style.stylearound}>
                <div className={style.userInfo}>
                  <span className={style.username}>Megumi Fusigouro</span>
                  <span className={style.date}>10.02.2023</span>
                </div>
                <p className={style.desc}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Corrupti, molestiae optio odio dolorum recusandae
                  perspiciatis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comments;
