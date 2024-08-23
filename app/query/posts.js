import { gql } from "@apollo/client";

export let GET_POST = gql`
  query Posts {
    posts {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        name
        username
        email
      }
    }
  }
`;

export let GET_DETAIL_POST = gql`
  query PostById($postByIdId: String!) {
  postById(id: $postByIdId) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    author {
      _id
      name
      username
      email
    }
  }
}
`;

export const LIKE_POST = gql`
mutation AddLike($postId: String!) {
  addLike(postId: $postId) {
    username
    createdAt
    updatedAt
  }
}
`

export const CREATE_POST =gql`
  mutation AddPost($form: PostForm) {
  AddPost(form: $form) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    author {
      _id
      name
      username
      email
    }
  }
}
`

export const CREATE_COMMENT = gql`
mutation AddComment($postId: String!, $content: String!) {
  addComment(postId: $postId, content: $content) {
    content
    username
    createdAt
    updatedAt
  }
}
`
