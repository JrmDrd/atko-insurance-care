const { ManagementClient } = require("auth0");

const management = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.M2M_CLIENT_ID,
    clientSecret: process.env.M2M_CLIENT_SECRET,
});

console.log(process.env.M2M_CLIENT_SECRET);

const emailDiscovery = async (email) => {
    try {
        console.log("this is the passed email: " +email);
        const users = await management.usersByEmail.getByEmail({ email: email })
        // const users = await management.usersByEmail.get({ email: email });
        return users.data;
    } catch (e) {
        console.log(e);
      }
};

const getUser = async (userId) => {
    try {
      const user = await management.users.get({ id: userId });
      console.log(user);
      return user.data;
    } catch (e) {
      console.log(e);
    }
  };

module.exports = {
    emailDiscovery,
    getUser
};