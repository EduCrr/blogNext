import styles from "./styles.module.scss";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import thumb from "../../../public/images/thumb.png";
import {
  FiChevronLeft,
  FiChevronsLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";
import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import { useState } from "react";

interface Post {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updateAt: string;
}

interface PostsProps {
  posts: Post[];
  page: string;
  totalPage: string;
}

const Post = ({ posts, page, totalPage }: PostsProps) => {
  const [post, setPosts] = useState(posts || []);
  const [currentPage, setCurrentPage] = useState(Number(page));

  //pegar nova pg no response
  const reqPage = async (pageNumber: number) => {
    const prismic = getPrismicClient();
    const response = await prismic.query(
      [Prismic.Predicates.at("document.type", "post")],
      {
        orderings: "[document.last_publication_date desc]",
        fetch: ["post.title", "post.description", "post.cover"],
        pageSize: 2,
        page: String(pageNumber),
      }
    );
    return response;
  };

  const navigatePage = async (pageNumber: number) => {
    const response = await reqPage(pageNumber);

    if (response.results.length === 0) {
      return;
    }

    const getPosts = response.results.map((item) => {
      return {
        slug: item.uid,
        title: RichText.asText(item.data.title),
        description:
          item.data.description.find((content) => content.type === "paragraph")
            ?.text ?? "",
        cover: item.data.cover.url,
        updateAt: new Date(item.last_publication_date).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
      };
    });

    setCurrentPage(pageNumber);
    setPosts(getPosts);
  };

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {post.map((item, k) => (
            <Link key={k} href={`posts/${item.slug}`}>
              <a>
                <Image
                  src={item.cover}
                  alt=""
                  width={720}
                  height={410}
                  quality={100}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNMTIysBwAD4gGcoHaHowAAAABJRU5ErkJggg=="
                />
                <strong>{item.title}</strong>
                <time>{item.updateAt}</time>
                <p>{item.description}</p>
              </a>
            </Link>
          ))}

          <div className={styles.buttonNavigate}>
            {Number(currentPage) >= 2 && (
              <div>
                <button onClick={() => navigatePage(1)}>
                  <FiChevronsLeft size={25} color="#Fff" />
                </button>
                <button onClick={() => navigatePage(Number(currentPage - 1))}>
                  <FiChevronLeft size={25} color="#Fff" />
                </button>
              </div>
            )}
            {Number(currentPage) < Number(totalPage) && (
              <div>
                <button onClick={() => navigatePage(Number(currentPage + 1))}>
                  <FiChevronsRight size={25} color="#Fff" />
                </button>
                <button onClick={() => navigatePage(Number(totalPage))}>
                  <FiChevronRight size={25} color="#Fff" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.Predicates.at("document.type", "post")],
    {
      orderings: "[document.last_publication_date desc]",
      fetch: ["post.title", "post.description", "post.cover"],
      pageSize: 2,
    }
  );

  //console.log(JSON.stringify(response));
  const posts = response.results.map((item) => {
    return {
      slug: item.uid,
      title: RichText.asText(item.data.title),
      description:
        item.data.description.find((content) => content.type === "paragraph")
          ?.text ?? "",
      cover: item.data.cover.url,
      updateAt: new Date(item.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages,
    },
    revalidate: 60 * 30,
  };
};

export default Post;
