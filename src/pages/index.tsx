import styles from "../styles/home.module.scss";
import Head from "next/head";
import Image from "next/image";
import techsImage from "../../public/images/techs.svg";
import { GetStaticProps } from "next";
import { getPrismicClient } from "../services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
type DataType = {
  title: string;
  content: string;
  link: string;
  mobile: string;
  mobile_content: string;
  mobile_banner: string;
  title_web: string;
  web_content: string;
  web_banner: string;
};
interface DataProps {
  data: DataType;
}
export default function Home({ data }: DataProps) {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{data.title}</h1>
            <span>{data.content}</span>
            <a href={data.link}>
              <button>Começar agora</button>
            </a>
          </section>
          <img src="/images/banner-conteudos.png" alt="" />
        </div>
        <hr className={styles.divisor} />
        <div className={styles.sectionContainer}>
          <section>
            <h2>{data.mobile}</h2>
            <span>{data.mobile_content}</span>
          </section>
          <img src={data.mobile_banner} alt="" />
        </div>
        <hr className={styles.divisor} />
        <div className={styles.sectionContainer}>
          <img src={data.web_banner} alt="" />
          <section>
            <h2>{data.title_web}</h2>
            <span>{data.web_content}</span>
          </section>
        </div>
        <div className={styles.nextLevelContent}>
          <Image src={techsImage} alt="" />
          <h2>Lorem ipsum dolor sit amet, consectetur</h2>
          <span>Nisi ut aliquip ex ea commodo consequat.</span>
          <a href="/">
            <button>Começar agora</button>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.Predicates.at("document.type", "home"),
  ]);

  const {
    title,
    content,
    link,
    mobile,
    mobile_content,
    mobile_banner,
    title_web,
    web_content,
    web_banner,
  } = response.results[0].data;

  const data = {
    title: RichText.asText(title),
    content: RichText.asText(content),
    link: link.url,
    mobile: RichText.asText(mobile),
    mobile_content: RichText.asText(mobile_content),
    mobile_banner: mobile_banner.url,
    title_web: RichText.asText(title_web),
    web_content: RichText.asText(web_content),
    web_banner: web_banner.url,
  };

  return {
    props: {
      data,
    },
    revalidate: 60 * 2,
  };
};
