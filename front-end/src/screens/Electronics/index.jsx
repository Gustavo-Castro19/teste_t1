import { Navbar } from "../../components/Navbar";
import { Title } from "../../components/Title";
import { Card } from "../../components/Card";
import { Footer } from "../../components/Footer";

import style from "../../global.module.css";

export function Electronics() {

  const cardData = [
    {
        id: 1,
        image: "../../assets/FurnitureImgs/img-1.jpg",
        tag: "Móveis",
        title: "Sofá 3 Lugares",
        description: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos",
        price: "R$2.500"
    },
    {
        id: 2,
        image: "../../assets/FurnitureImgs/img-2.jpg",
        tag: "Eletrônicos",
        title: "Smart TV 55\"",
        description: "Televisão com tecnologia 4K, HDR e sistema operacional Android TV integrado",
        price: "R$1.800"
    },
    {
        id: 3,
        image: "../../assets/FurnitureImgs/img-3.jpg",
        tag: "Decoração",
        title: "Mesa de Centro",
        description: "Mesa de centro em madeira maciça com design moderno e acabamento premium",
        price: "R$850"
    }
  ];

  return (
    <body>
      <Navbar />
        <div className={style.container}>
          <Title title="Eletrônicos" />

          <section className={style.cardContainer}>
            {cardData.map((card) => (
              <Card 
                key={card.id} 
                image={card.image} 
                tag={card.tag} 
                title={card.title} 
                description={card.description} 
                price={card.price} 
              />
            ))}
          </section>
        </div>
      <Footer />
    </body>
  );
}
