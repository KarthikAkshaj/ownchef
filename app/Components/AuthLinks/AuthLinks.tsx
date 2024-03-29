"use client";

import React from "react";
import style from "./AuthLinks.module.css";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const AuthLinks = () => {
  const { status } = useSession();
  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login"> Login</Link>
      ) : (
        <>
          <Link href="/Write"> Add Recipe</Link>
          <span className={style.link} onClick={signOut}>
            Logout
          </span>
        </>
      )}
    </>
  );
};

export default AuthLinks;
