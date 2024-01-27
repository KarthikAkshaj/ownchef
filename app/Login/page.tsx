import React from "react";
import style from "./LoginPage.module.css";

const LoginPage = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.wrapper}>
          <div className={style.socialButton}>Sign in With Google</div>
          <div className={style.socialButton}>Sign in With GitHub</div>
          <div className={style.socialButton}>Sign in With Facebook</div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
