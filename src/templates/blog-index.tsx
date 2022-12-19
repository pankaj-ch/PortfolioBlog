import * as React from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import {
  Container,
  FlexList,
  Box,
  Space,
  BlockLink,
  Heading,
  Subhead,
  Kicker,
  Text,
  HomepageImage,
} from "../components/ui"
import { BlogAuthor, BlogPost } from "./blog-post"
import SEOHead from "../components/head"
interface PostCardSmallProps {
  slug: string
  image?: HomepageImage
  title?: string
  categories?: string
}

interface PostCardProps extends PostCardSmallProps {
  excerpt?: string
  author?: BlogAuthor
}

function PostCard({
  slug,
  image,
  title,
  excerpt,
  author,
  categories,
  ...props
}: PostCardProps) {
  return (
    <BlockLink {...props} to={`/blog/${slug}`}>
      {image && (
        <>
          <GatsbyImage alt={image.alt} image={image.gatsbyImageData} />
          <Space size={3} />
        </>
      )}
      <Subhead>
        <Kicker>{categories}</Kicker>
        {title}
      </Subhead>
      <Text>
        <p dangerouslySetInnerHTML={{ __html: excerpt }} />
      </Text>
      {author?.name && (
        <Text variant="bold">
          <div>By {author.name}</div>
        </Text>
      )}
    </BlockLink>
  )
}

function PostCardSmall({
  slug,
  image,
  title,
  categories,
  ...props
}: PostCardSmallProps) {
  return (
    <BlockLink {...props} to={`/blog/${slug}`}>
      {image && (
        <>
          <GatsbyImage alt={image.alt} image={image.gatsbyImageData} />
          <Space size={3} />
        </>
      )}
      <Subhead>
        <Kicker>{categories}</Kicker>
        {title}
      </Subhead>
    </BlockLink>
  )
}

export interface BlogIndexProps {
  data: {
    allBlogPost: {
      nodes: BlogPost[]
    }
  }
}

export default function BlogIndex(props: BlogIndexProps) {
  const posts = props.data.allBlogPost.nodes

  const featuredPosts = [];
  const regularPosts = [];

  for (const post of posts) {
    const categories = post.categories?.nodes?.map((x) => x.name);
    const isFeatured = categories.some((x) => x === "Featured");
    const postsBucket = isFeatured ? featuredPosts : regularPosts;
    postsBucket.push({ ...post, categories: categories.join(", ") })
  }

  return (
    <Layout>
      <Container>
        <Box paddingY={4}>
          <Heading as="h1">Blog</Heading>
          <FlexList variant="start" gap={0} gutter={3} responsive>
            {featuredPosts.map((post) => (
              <Box as="li" key={post.id} padding={3} width="half">
                <PostCard {...post} />
              </Box>
            ))}
          </FlexList>
        </Box>
        <Box paddingY={4}>
          <Subhead>Product Updates</Subhead>
          <FlexList responsive wrap gap={0} gutter={3} variant="start">
            {regularPosts.map((post) => (
              <Box as="li" key={post.id} padding={3} width="third">
                <PostCardSmall {...post} />
              </Box>
            ))}
          </FlexList>
        </Box>
      </Container>
    </Layout>
  )
}
export const Head = () => {
  return <SEOHead title="Blog" />
}

export const query = graphql`
  query {
    allBlogPost(sort: { date: DESC }) {
      nodes {
        id
        slug
        title
        excerpt
        categories {
          nodes {
            id 
            name
          }
        }
        image {
          id
          alt
          gatsbyImageData
        }
        author {
          id
          name
        }
      }
    }
  }
`
