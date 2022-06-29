import React from "react";
import { GraphQLClient, gql } from "graphql-request";
import BlogCard from "../Compoents/BlogCard";
import styles from "../styles/Home.module.css";

const GraphCMS = new GraphQLClient(
  "https://api-ap-south-1.graphcms.com/v2/cl4zkdzfw08x301ue52oy54hk/master"
);

const QUERY = gql`
  {
    posts {
      id
      title
      datePublish
      slug
      content {
        html
      }
      author {
        id
        name
        avatar {
          url
        }
      }
      coverPhoto {
          url
        }
      }
    }
  }
`;

const Home = ({ posts }) => {
  // const post = { title, author, coverPhoto, id, datePublish, slug };
  return (
    <div>
      <main className={styles.main}>
        {posts.map(({ title, author, coverPhoto, id, datePublish, slug }) => (
          <BlogCard
            title={title}
            author={author}
            coverPhoto={coverPhoto}
            key={id}
            datePublish={datePublish}
            slug={slug}
          />
        ))}
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const { posts } = await GraphCMS.request(QUERY);
  return {
    props: {
      posts,
    }, // will be passed to the page component as props
    revalidate: 10,
  };
}

export default Home;
