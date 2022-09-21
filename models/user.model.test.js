const { User } = require("./user.model");

describe("user", () => {
  let error = null;
  const invalidUser = {};

  it("Should throw error", async () => {
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrow();
  });
});
