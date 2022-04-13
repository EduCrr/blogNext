import { GetServerSideProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";

interface PostsProps {
  post: {
    slug: string;
    title: string;
    description: string;
    cover: string;
    updateAt: string;
  };
}

const Post = ({ post }: PostsProps) => {
  console.log(post);
  return <>{post.title}</>;
};

export const getServerSidePros: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params;
  const prismic = getPrismicClient(req);
  const response = await prismic.getByUID("post", String(slug), {});

  if (!response) {
    return {
      redirect: {
        destination: "/posts",
        permanent: false,
      },
    };
  }

  const post = {
    slug: slug,
    title: RichText.asTech(response.data.title),
    description: RichText.asHtml(response.data.description),
    cover: response.data.cover.url,
    updateAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};

export default Post;
