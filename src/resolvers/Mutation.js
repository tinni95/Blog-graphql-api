import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) {
      throw new Error("Unable to login");
    }

    const isPasswordValid = await bcrypt.compare(
      args.data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Unable to login");
    }

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info
    );
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    );
  },
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true,
    });

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: { post: args.id },
      });
    }

    if (!postExists) {
      throw new Error("Operation Forbidden.");
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!postExists) {
      throw new Error("Unable to delete.");
    }

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const publishedPostExists = await prisma.exists.Post({
      id: args.data.post,
      published: true,
    });

    if (!publishedPostExists) {
      throw new Error("Post not found.");
    }
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    );
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      author: {
        id: userId,
      },
      id: args.id,
    });

    if (!commentExists) {
      throw new Error("Unable to update.");
    }

    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      author: {
        id: userId,
      },
      id: args.id,
    });

    if (!commentExists) {
      throw new Error("Unable to delete.");
    }

    return prisma.mutation.deleteComment(
      {
        where: { id: args.id },
      },
      info
    );
  },
};

export default Mutation;
