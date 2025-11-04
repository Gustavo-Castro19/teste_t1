import globalStyle from "../../global.module.css";
import style from "./Footer.module.css";

export function Footer() {
    return (
        <footer>
            <div id="content" className={globalStyle.container}>
                <section className={style.footerSitemap}>
                    <h2>Stock dos Bons</h2>
                    <div className={style.footerUnderBar}></div>

                    <div className={style.links}>
                        <a href="#" tabIndex="11">Eletrônicos</a>
                        <a href="#" tabIndex="12">Móveis</a>
                        <a href="#" tabIndex="13">Hortifruti</a>
                    </div>
                </section>

                <section className={style.footerSitemap}>
                    <h2>Stock dos Bons</h2>
                    <div className={style.footerUnderBar}></div>

                    <div className={style.redesSociais}>
                        <a href="#" tabIndex="14">@StockDosBons</a>
                        <a href="#" tabIndex="15">(61) 98888-888</a>
                    </div>
                </section>
            </div>

            <div className={style.footerCopyright}>
                <p>&copy;  Stock dos Bons | todos os direitos reservados</p>
            </div>
        </footer>
    );
}
