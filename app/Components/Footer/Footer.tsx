import React from "react";
import style from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";

const Footer = () => {
  return (
    <div className={style.container}>
      <div className={style.info}>
        <div className={style.logo}>
          <Image src="/Logo.png" alt="Own Chef" width={150} height={150} />
          <h1 className={style.logoText}>Own Chef</h1>
        </div>
        <p className={style.desc}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim
          necessitatibus similique aspernatur obcaecati veritatis. Aperiam cum
          porro sequi, totam minima consequuntur, aspernatur deleniti vero
          repellendus dorales.
        </p>
        <div className={style.icons}>
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
      </div>
      <div className={style.links}>
        <div className={style.list}>
          <span className={style.listTitle}>Links</span>
          <Link href="/">Homepage</Link>
          <Link href="/">Blog</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </div>
        <div className={style.list}>
          <span className={style.listTitle}>Tags</span>
          <Link href="/">Indian</Link>
          <Link href="/">Chinese</Link>
          <Link href="/">Italian</Link>
          <Link href="/">Spanish</Link>
        </div>
        <div className={style.list}>
          <span className={style.listTitle}>Social</span>
          <Link href="/">Facebook</Link>
          <Link href="/">Instagram</Link>
          <Link href="/">Tiktok</Link>
          <Link href="/">Youtube</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
