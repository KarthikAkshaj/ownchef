import React from "react";
import style from "./AuthLinks.module.css";
import Link from "next/link";

const AuthLinks = () => {
  const status = "notauthenticated";
  return (
    <>
      {status === "notauthenticated" ? (
        <Link href="/Login"> Login</Link>
      ) : (
        <>
          <Link href="/Write"> Add Recipe</Link>
          <span className={style.link}> Logout </span>
        </>
      )}
    </>
  );
};

export default AuthLinks;
