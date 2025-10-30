const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
require("../connection");

chai.use(chaiHttp);

let deleteID; // almacenar el _id del issue creado

suite("Functional Tests", function () {
  suite("Routing Tests", function () {

    suite("POST request Tests", function () {
      test("Create an issue with every field: POST /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .post("/api/issues/fcc-project")
          .set("content-type", "application/json")
          .send({
            issue_title: "Test Issue Full",
            issue_text: "Testing all fields",
            created_by: "FCC",
            assigned_to: "Atlas",
            status_text: "Open"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Test Issue Full");
            assert.equal(res.body.assigned_to, "Atlas");
            assert.equal(res.body.status_text, "Open");
            assert.equal(res.body.created_by, "FCC");
            assert.equal(res.body.issue_text, "Testing all fields");
            deleteID = res.body._id; // para PUT y DELETE
            done();
          });
      });

      test("Create an issue with only required fields: POST /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .post("/api/issues/fcc-project")
          .set("content-type", "application/json")
          .send({
            issue_title: "Test Issue Req",
            issue_text: "Testing required fields",
            created_by: "FCC"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Test Issue Req");
            assert.equal(res.body.created_by, "FCC");
            assert.equal(res.body.issue_text, "Testing required fields");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.status_text, "");
            done();
          });
      });

      test("Create an issue with missing required fields: POST /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .post("/api/issues/fcc-project")
          .set("content-type", "application/json")
          .send({
            issue_title: "",
            issue_text: "",
            created_by: "FCC"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "required field(s) missing");
            done();
          });
      });
    });

    suite("GET request Tests", function () {
      test("View issues on a project: GET /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .get("/api/issues/fcc-project")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });

      test("View issues on a project with one filter: GET /api/issues/fcc-project?open=true", function (done) {
        chai
          .request(server)
          .get("/api/issues/fcc-project")
          .query({ open: true })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            res.body.forEach(issue => assert.isTrue(issue.open));
            done();
          });
      });

      test("View issues on a project with multiple filters: GET /api/issues/fcc-project?open=true&assigned_to=Atlas", function (done) {
        chai
          .request(server)
          .get("/api/issues/fcc-project")
          .query({ open: true, assigned_to: "Atlas" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            res.body.forEach(issue => {
              assert.isTrue(issue.open);
              assert.equal(issue.assigned_to, "Atlas");
            });
            done();
          });
      });
    });

    suite("PUT request Tests", function () {
      test("Update one field on an issue: PUT /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .put("/api/issues/fcc-project")
          .send({ _id: deleteID, issue_text: "Updated text" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, deleteID);
            done();
          });
      });

      test("Update multiple fields on an issue: PUT /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .put("/api/issues/fcc-project")
          .send({ _id: deleteID, issue_title: "Updated Title", assigned_to: "Someone" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, deleteID);
            done();
          });
      });

      test("Update an issue with missing _id: PUT /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .put("/api/issues/fcc-project")
          .send({ issue_title: "Fail" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });

      test("Update an issue with no fields to update: PUT /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .put("/api/issues/fcc-project")
          .send({ _id: deleteID })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");
            done();
          });
      });

      test("Update an issue with an invalid _id: PUT /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .put("/api/issues/fcc-project")
          .send({ _id: "invalidid1234567890", issue_title: "Fail" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");
            done();
          });
      });
    });

    suite("DELETE request Tests", function () {
      test("Delete an issue: DELETE /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .delete("/api/issues/fcc-project")
          .send({ _id: deleteID })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");
            done();
          });
      });

      test("Delete an issue with an invalid _id: DELETE /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .delete("/api/issues/fcc-project")
          .send({ _id: "invalidid1234567890" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not delete");
            done();
          });
      });

      test("Delete an issue with missing _id: DELETE /api/issues/fcc-project", function (done) {
        chai
          .request(server)
          .delete("/api/issues/fcc-project")
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });
    });

  });
});
