import React from "react";
import style from "./CardList.module.css";
import Pagination from "../Pagination/Pagination";

const CardList = () => {
  return (
    <>
      <div className={style.container}>
        < Pagination />
      </div>
    </>
  );
};

export default CardList;
