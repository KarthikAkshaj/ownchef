import React from "react";
import style from "./Navbar.module.css";
import { SocialIcon } from "react-social-icons";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import AuthLinks from "../AuthLinks/AuthLinks";

const Navbar = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.social}>
          <SocialIcon
            bgColor="transparent"
            fgColor="#316FF6"
            network="facebook"
            url="/"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#d62976"
            network="instagram"
            url="/"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="black"
            network="x"
            url="/"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#CD201F"
            network="youtube"
            url="/"
          />
        </div>
        <div className={style.logo}>Own Chef</div>
        <div className={style.links}>
          <ThemeToggle />
          <Link href="/"> HomePage</Link>
          <Link href="/"> About</Link>
          <AuthLinks />
        </div>
      </div>
    </>
  );
};

export default Navbar;
