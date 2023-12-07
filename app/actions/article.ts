'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { DEFAULT_PAGE_SIZE } from '@/constants/unknown';
import { db } from '@/libs/prisma';
import {
  type CreateArticleReq,
  type UpdateArticleReq,
} from '@/typings/article';

export async function getArticleByFriendlyURL(friendlyURL: string) {
  const article = await db.article.findUnique({
    where: {
      friendlyUrl: friendlyURL,
    },
    include: {
      tags: true,
    },
  });

  return article;
}

export async function getArticles(params: { page: number }) {
  const take = DEFAULT_PAGE_SIZE;
  const skip = (params.page - 1) * DEFAULT_PAGE_SIZE;

  const articles = await db.article.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      tags: true,
    },
    skip,
    take,
  });

  const count = await db.article.count({});

  const total = count ?? 0;

  revalidatePath('/admin/article');
  return { articles, total };
}

export async function deleteArticle(id: string) {
  await db.article.delete({
    where: {
      id,
    },
  });

  revalidatePath('/admin/article');
}

export async function updateArticle(parsed: UpdateArticleReq) {
  const article = await db.article.findFirst({
    where: { id: parsed.id },
    include: { tags: true },
  });

  const articleTagIDs = article?.tags.map((el) => el.id);
  // 新增的 tags
  const needConnect = parsed.tags?.filter((el) => !articleTagIDs?.includes(el));
  // 需要移除的 tags
  const needDisconnect = article?.tags
    .filter((el) => !parsed.tags?.includes(el.id))
    ?.map((el) => el.id);

  await db.article.update({
    data: {
      title: parsed.title,
      description: parsed.description,
      friendlyUrl: parsed.friendlyUrl,
      cover: parsed.cover,
      content: parsed.content,
      published: parsed.published,
      tags: {
        connect: needConnect?.length
          ? needConnect.map((tagID) => ({ id: tagID }))
          : undefined,
        disconnect: needDisconnect?.length
          ? needDisconnect.map((tagID) => ({ id: tagID }))
          : undefined,
      },
    },
    where: {
      id: parsed.id,
    },
  });

  revalidatePath('/admin/article');
  redirect('/admin/article');
}

export async function toggleArticlePublish(id: string) {
  const article = await db.article.findFirst({
    where: {
      id,
    },
  });

  if (article) {
    await db.article.update({
      data: {
        published: !article.published,
      },
      where: {
        id,
      },
    });
    revalidatePath('/admin/article');
  }
}
export async function getArticle(id: string) {
  const article = await db.article.findFirst({
    where: {
      id,
    },
    include: {
      tags: true,
    },
  });

  return article;
}

export async function createArticle(parsed: CreateArticleReq) {
  await db.article.create({
    data: {
      title: parsed.title,
      friendlyUrl: parsed.friendlyUrl,
      description: parsed.description,
      content: parsed.content,
      published: parsed.published,
      cover: parsed.cover,
      tags: {
        connect: parsed.tags
          ? parsed.tags.map((tagID) => ({ id: tagID }))
          : undefined,
      },
    },
  });

  redirect('/admin/article');
}

export async function getPublishedArticles(params: { page: number }) {
  const take = DEFAULT_PAGE_SIZE;
  const skip = (params.page - 1) * DEFAULT_PAGE_SIZE;

  const articles = await db.article.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      tags: true,
    },
    where: {
      published: true,
    },
    skip,
    take,
  });

  const count = await db.article.count({
    where: {
      published: true,
    },
  });

  const total = count ?? 0;

  return { articles, total };
}