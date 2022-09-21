const mockingoose = require("mockingoose");
const { User } = require("./user.model");
const { getUsers, addUser } = require("./user.model");

describe("Users service", () => {
  const invalidUser = {};

  it("Should throw validation error", async () => {
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrow();
  });

  describe("getUsers", () => {
    it("Should return all users", async () => {
      const users = [
        {
          username: "test",
        },
        {
          username: "test2",
        },
      ];

      mockingoose(User).toReturn(users, "find");

      const result = await getUsers();
      expect(result[0].username).toBe("test");
    });
  });

  describe("addUser", () => {
    it("Should add a user", async () => {
      const user = {
        username: "test",
      };

      const newUser = await addUser(user);

      expect(newUser.username).toBe("test");
    });
  });
});
