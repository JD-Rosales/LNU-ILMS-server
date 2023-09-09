import { PrismaClient, Book, BorrowRequest } from '@prisma/client';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const createBook = async ({
  isbn,
  name,
  bookCover,
  bookCoverId,
  authorId,
  categoryIds,
  copies,
}: {
  isbn: number;
  name: string;
  bookCover?: string;
  bookCoverId?: string;
  authorId: number;
  categoryIds: number[];
  copies: number;
}) => {
  const newBook = await prisma.book.create({
    data: {
      isbn,
      name,
      bookCover,
      bookCoverId,
      authorId,
      copies,
      category: {
        connect: categoryIds.map((categoryId) => ({
          id: categoryId,
        })),
      },
    },
  });

  return newBook;
};

export const getBook = async (id: number) => {
  const book = await prisma.book.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      isbn: true,
      name: true,
      bookCover: true,
      copies: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return book;
};

export const getALLRequestedBooks = async () => {
  const requestBooks = await prisma.borrowRequest.findMany({
    select: {
      id: true,
      book: {
        select: {
          name: true,
          isbn: true,
        },
      },
      student: {
        select: {
          studentId: true,
        },
      },
      isApproved: true,
      requestDate: true,
    },
  });

  const flattenResult = requestBooks.map((data) => {
    return {
      id: data.id,
      bookName: data.book.name,
      isbn: data.book.isbn.toString(), //convert to string in order to be searchable in data table
      studentId: data.student.studentId.toString(), //convert to string in order to be searchable in data table
      isApproved: data.isApproved,
      requestDate: data.requestDate,
    };
  });

  return flattenResult;
};

export const getBookList = async ({
  myCursor,
  sortBy,
}: {
  myCursor?: number;
  sortBy?: string;
}) => {
  const booksId = await prisma.book.findMany({
    skip: myCursor ? 1 : 0,
    take: 10,
    ...(myCursor && {
      cursor: {
        id: myCursor,
      },
    }),
    select: {
      id: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return booksId;
};

export const getRequestedBook = async (studentId: number) => {
  const requestedBook = await prisma.borrowRequest.findFirst({
    where: {
      studentId,
    },
    select: {
      book: true,
      isApproved: true,
      requestDate: true,
      updatedAt: true,
    },
  });

  return requestedBook;
};

export const requestBook = async ({
  bookId,
  studentId,
}: {
  bookId: number;
  studentId: number;
}) => {
  const request = await prisma.borrowRequest.create({
    data: {
      bookId,
      studentId,
    },
  });

  return request;
};

export const cancelRequest = async ({
  bookId,
  studentId,
}: {
  bookId: number;
  studentId: number;
}) => {
  const request = await prisma.borrowRequest.findFirst({
    where: {
      studentId,
      AND: {
        bookId,
      },
    },
  });

  if (!request) throw new customeError(404, 'Book request cannot be found.');

  await prisma.borrowRequest.delete({
    where: {
      id: request.id,
    },
  });

  return request;
};

export const canBorrow = async (studentId: number): Promise<boolean> => {
  const hasBorrowed = await prisma.borrowedBook.findFirst({
    where: {
      studentId,
    },
  });

  if (hasBorrowed) return false;
  else return true;
};

export const canRequest = async (studentId: number): Promise<boolean> => {
  const hasRequested = await prisma.borrowRequest.findFirst({
    where: {
      studentId,
    },
  });

  if (hasRequested) return false;
  else return true;
};

export const checkUniqueIsbn = async (isbn: number): Promise<boolean> => {
  const book = await prisma.book.findUnique({
    where: {
      isbn,
    },
  });

  return book ? false : true;
};
