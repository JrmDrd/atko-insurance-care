var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
// const { emailDiscovery, getUser } = require('../utils/apis');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.post('/discovery', async (req, res, next) => {
  // await getUser('auth0|65b90d38488b3c81a26b711e').then((response) => {
  //     console.log(response);
  //     }).catch((error) => {
  //       console.log(error);
  //   });
  await emailDiscovery(req.body.email).then((response) => {
    }).catch((error) => {
        console.log(error);
    });
});


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

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

module.exports = router;