"use client";

import React, { useState } from "react";
import style from "./Write.module.css";
import Image from "next/image";
import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";

const Write = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      <div className={style.container}>
        <input type="text" placeholder="T I T L E" className={style.input} />
        <div className={style.editor}>
          <button className={style.button} onClick={() => setOpen(!open)}>
            <Image src="/plus.png" alt="" height={100} width={100}></Image>
          </button>
          {open && (
            <div className={style.add}>
              <button className={style.addButton}>
                {/* <label htmlFor="image">/ */}
                <Image src="/image.png" alt="" width={100} height={100} />
                {/* </label> */}
              </button>
              <button className={style.addButton}>
                <Image src="/external.png" alt="" width={100} height={100} />
              </button>
              <button className={style.addButton}>
                <Image src="/video.png" alt="" width={100} height={100} />
              </button>
            </div>
          )}
          <ReactQuill
            theme="bubble"
            value={value}
            onChange={setValue}
            placeholder="Share Your Elixir...."
            className={style.textArea}
          />
        </div>
        <button className={style.publish}>Publish</button>
      </div>
    </>
  );
};

export default Write;
