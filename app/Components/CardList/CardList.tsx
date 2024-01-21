import React from "react";
import style from "./CardList.module.css";
import Pagination from "../Pagination/Pagination";
import Card from "../Card/Card";

const CardList = () => {
  return (
    <>
      <div className={style.container}>
        <h1 className={style.title}>
          <span className={style.utxt}>Recent Po</span>sts
        </h1>
        <div className={style.posts}>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>

        <Pagination />
      </div>
    </>
  );
};

export default CardList;
