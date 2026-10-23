const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");

process.env.JWT_SECRET = "auth-controller-test-secret";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Voter = require("../models/Voter");
const { login } = require("../controllers/auth");

const originalFindOne = Voter.findOne;
const originalCompare = bcrypt.compare;

afterEach(() => {
  Voter.findOne = originalFindOne;
  bcrypt.compare = originalCompare;
});

function makeResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

test("login rejects missing credentials", async () => {
  const response = makeResponse();

  await login({ body: { voterId: "", password: "" } }, response);

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error, "Voter ID and password are required");
});

test("login rejects unknown voters", async () => {
  Voter.findOne = async () => null;
  const response = makeResponse();

  await login({ body: { voterId: "V-100", password: "password" } }, response);

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error, "Invalid credentials");
});

test("login rejects incorrect passwords", async () => {
  Voter.findOne = async () => ({ voterId: "V-100", password: "stored-hash" });
  bcrypt.compare = async () => false;
  const response = makeResponse();

  await login({ body: { voterId: "V-100", password: "wrong-password" } }, response);

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error, "Invalid credentials");
});

for (const [role, expectedRole] of [["voter", "Voters"], ["admin", "Admins"]]) {
  test(`login issues a ${expectedRole} token`, async () => {
    let lookup;
    Voter.findOne = async (query) => {
      lookup = query;
      return { voterId: "V-100", password: "stored-hash", role };
    };
    bcrypt.compare = async () => true;
    const response = makeResponse();

    await login({ body: { voterId: " v-100 ", password: "correct-password" } }, response);

    assert.deepEqual(lookup, { voterId: "V-100" });
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.user.role, expectedRole);
    assert.deepEqual(jwt.verify(response.body.token, process.env.JWT_SECRET), {
      sub: "V-100",
      role: expectedRole,
      iat: jwt.decode(response.body.token).iat,
      exp: jwt.decode(response.body.token).exp
    });
  });
}
