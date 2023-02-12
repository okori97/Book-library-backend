const { Book } = require("../src/models");
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

describe("/books", () => {
  before(async () => Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const response = await request(app).post("/books").send({
          title: "Meditations",
          author: "Marcus Aurelius",
          genre: "Philosophy",
          ISBN: "978-3-16-148410-0",
        });

        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal("Meditations");
        expect(newBookRecord.title).to.equal("Meditations");
        expect(newBookRecord.author).to.equal("Marcus Aurelius");
        expect(newBookRecord.genre).to.equal("Philosophy");
        expect(newBookRecord.ISBN).to.equal("978-3-16-148410-0");
      });
    });
  });

  describe("with records in the database", () => {
    let books;

    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
          title: "Meditations",
          author: "Marcus Aurelius",
          genre: "Philosophy",
          ISBN: "978-3-16-148410-0",
        }),
        Book.create({
          title: "The Alchemist",
          author: "Paulo Cohello",
          genre: "Fiction",
          ISBN: "978-3-16-148410-1",
        }),
        Book.create({
          title: "The Hitchhiker's guide to the galaxy",
          author: "Douglas Adams",
          genre: "Fiction",
          ISBN: "978-3-16-148410-2",
        }),
      ]);
    });

    describe("GET /books", () => {
      it("gets all books records", async () => {
        const response = await request(app).get("/books");

        expect(response.status).to.equal(201);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((element) => element.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe("GET /books/:id", () => {
      it("gets books by id", async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it("returns a 404 if book does not exist", async () => {
        const book = books[0];
        const response = await request(app).get("/books/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found");
      });
    });

    describe("PATCH /books/:id", () => {
      it("updates books by id", async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ title: "The Meditations" });

        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(updatedBookRecord.title).to.equal("The Meditations");
      });

      it("returns a 404 if book does not exist", async () => {
        const response = await request(app)
          .patch(`/books/12345`)
          .send({ title: "The Meditations" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found");
      });
    });

    describe("DELETE /books/:id", () => {
      it("deletes books by id", async () => {
        book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it("returns a 404 if book does not exist", async () => {
        const response = await request(app).delete(`/books/1234`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found");
      });
    });
  });
});
