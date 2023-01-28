const { Reader } = require("../src/models/");
const { expect } = require("chai");
const app = require("../src/app");
const request = require("supertest");

describe("/readers", () => {
  before(async () => Reader.sequelize.sync());

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {
        const response = await request(app).post("/readers").send({
          name: "Elizabeth Bennet",
          email: "future_ms_darcy@gmail.com",
          password: "password",
        });

        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal("Elizabeth Bennet");
        expect(newReaderRecord.name).to.equal("Elizabeth Bennet");
        expect(newReaderRecord.email).to.equal("future_ms_darcy@gmail.com");
      });
    });
  });

  describe("with records in the database", () => {
    let readers;

    beforeEach(async () => {
      readers = await Promise.all([
        Reader.create({
          name: "Elizabeth Bennet",
          email: "future_ms_darcy@gmail.com",
          password: "password",
        }),
        Reader.create({
          name: "Arya Stark",
          email: "vmorgul@me.com",
          password: "password",
        }),
        Reader.create({
          name: "Lyra Belacqua",
          email: "darknorth123@msn.org",
          password: "password",
        }),
      ]);
    });

    describe("GET /readers", () => {
      it("gets all readers records", async () => {
        const response = await request(app).get("/readers");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
        });
      });
    });

    describe("GET /readers/:id", () => {
      it("gets readers by id", async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
      });

      it("returns a 404 if reader does not exist", async () => {
        const response = await request(app).get("/readers/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found");
      });
    });

    describe("PATCH /readers/:id", () => {
      it("updates a readers email by id", async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: "miss_e_bennet@gmail.com" });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal("miss_e_bennet@gmail.com");
      });

      it("returns a 404 if reader does not exist", async () => {
        const response = await request(app)
          .patch(`/readers/12345`)
          .send({ email: "miss_e_bennet@gmail.com" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found");
      });
    });

    describe("DELETE /reader/:id", () => {
      it("delete reader record by id", async () => {
        const reader = readers[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it("returns a 404 if reader does not exist", async () => {
        const response = await request(app).delete(`/readers/12345`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found");
      });
    });
  });
});
