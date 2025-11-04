import style from "./Card.module.css";

export function Card({ image, tag, title, description, price }) {
    return (
        <div className={style.card} tabIndex="5">
            <div className={style.imgElement}>
                <img src={image} alt="imagem ilustrativa" />

                <p className={style.tag}>{tag}</p>
            </div>

            <div className={style.cardContent}>
                <div className={style.textContainer}>
                    <h2>{title}</h2>

                    <p>{description}</p>
                </div>

                <div className={style.content}>
                    <p>{price}</p>

                    <button className={style.btn} tabIndex="6">Ver mais</button>
                </div>
            </div>
        </div>
    );
}