import CardList from "./Components/CardList/CardList";
import CategoryList from "./Components/CategoryList/CategoryList";
import Featured from "./Components/Featured/Featured";
import Menu from "./Components/Menu/Menu";
import style from "./Homepage.module.css";

export default function Home() {
  return (
    <>
      <div className={style.container}>
        <Featured />
        <CategoryList />
        <div className={style.content}>
          <CardList />
          <Menu />
        </div>
      </div>
    </>
  );
}
