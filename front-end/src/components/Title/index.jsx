import style from "./Title.module.css";

export function Title({ title }) {
    return (
        <section className={style.title}>
          <h2>{title}</h2>

          <div className={style.underBar}></div>
        </section>
    );
}