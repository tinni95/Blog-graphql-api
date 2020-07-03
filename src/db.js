const users = [
  { id: "user1", name: "Gianni", email: "cmike@example.com", age: 27 },
  { id: "user2", name: "fadsfa", email: "cmike@example.com" },
];

const comments = [
  { id: "comment1", text: "comment1", author: "user1", post: "post1" },
  { id: "comment2", text: "comment2", author: "user1", post: "post2" },
  { id: "comment3", text: "comment3", author: "user2", post: "post2" },
  { id: "comment4", text: "comment4", author: "user2", post: "post2" },
];

const posts = [
  {
    id: "post1",
    title: "Gianni",
    body: "cmike@example.com",
    published: true,
    author: "user1",
  },
  {
    id: "post2",
    title: "fadsfa",
    body: "cmike@example.com",
    published: true,
    author: "user2",
  },
];

const db = {
  users,
  posts,
  comments,
};

export default db;
