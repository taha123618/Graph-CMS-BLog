import React from "react";
import { GraphQLClient, gql } from "graphql-request";
import styles from "../../styles/slug.module.css";

const GraphCMS = new GraphQLClient(
  "https://api-ap-south-1.graphcms.com/v2/cl4zkdzfw08x301ue52oy54hk/master"
);

const QUERY = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      datePublish
      author {
        id
        name
        avatar {
          url
        }
      }
      content {
        html
      }
      coverPhoto {
        id
        url
      }
    }
  }
`;

const SlugList = gql`
  {
    posts {
      slug
    }
  }
`;

export default function BlogPost({ post }) {
  // const post = { title, author, coverPhoto, id, datePublish, slug };
  return (
    <main className={styles.blog}>
      <img src={post.coverPhoto.url} className={styles.cover} alt="BlogPost" />
      <div className={styles.title}>
        <img src={post.author.avatar.url} alt="" />
        <div className={styles.authtext}>
          <h6> By {post.author.name}</h6>
          <h6 className={styles.date}> By {post.datePublish}</h6>
        </div>
      </div>
      <h2>{post.title}</h2>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      ></div>
    </main>
  );
}

export async function getStaticPaths() {
  const { posts } = await GraphCMS.request(SlugList);
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false, // false or 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const data = await GraphCMS.request(QUERY, { slug });
  const post = data.post;
  return {
    props: { post }, // will be passed to the page component as props
    revalidate: 10,
  };
}
