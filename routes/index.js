// const dotenv = require('dotenv');
let router = require('express').Router();
let { requiresAuth } = require('express-openid-connect');
let randomstring = require("randomstring");

// dotenv.config();

const { getUser, getUsersByEmail, createUser, accountLink, createUserWithPassword, linkUsers, updateUser } = require('../utils/auth0apis');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Atko Insurance - Care',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.post('/discovery', async (req, res, next) => {
  await getUsersByEmail(req.body.email).then((response) => {
    if (response.length >= 2) {
      //  More than one matching account selection
      res.redirect('/loginSelector');
    } else if (response.length = 1 && response[0].app_metadata.products[0] == 'home') {
      //  user is only home insurance
      console.log("we need to redirect to login with password !")
    } else {
      console.log("we need to redirect to DigID")
    }
    res.render('index', {
      title: 'Auth0 Webapp sample Nodejs',
      isAuthenticated: req.oidc.isAuthenticated()
    });
    }).catch((error) => {
      console.log(error);
  });
});

router.get('/loginSelector', function (req, res, next) {
  res.render('loginSelector', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/layout', function (req, res, next) {
  res.render('layout', {
    title: 'Atko Insurance - Layout Designer',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/digidLogin', (req, res, next) => {
  res.redirect(process.env.ISSUER_BASE_URL +'/authorize?response_type=code&client_id=' +process.env.CLIENT_ID +'&connection=Itsme&redirect_uri=' +process.env.APP_URL +'/callback&state=' +randomstring.generate(15))
});

router.get('/health-insurance-calculator', function (req, res, next) {
  res.render('healthCalculator', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.post('/health-insurance-calculator/submit', async (req, res, next) => {
  let user_metadata = {
    birthdate: req.body.birthday_day + '/' +req.body.birthday_month +'/' +req.body.birthday_year,
    quote: {
      type: 'care',
      date: 'date',
      coverage: req.body.coverage,
      status: 'pending',
      prices: '10€'
    },
    terms_and_condition: 'accepted'
  }
  await createUser(req.body.email, 'email', user_metadata).then((response) => {
    res.render('healthCalculatorOverview', {
      title: 'Auth0 Webapp sample Nodejs',
      isAuthenticated: req.oidc.isAuthenticated(),
      health_coverage: req.body.coverage,
      email: req.body.email,
      birthdate: req.body.birthday_day + '/' +req.body.birthday_month +'/' +req.body.birthday_year,
    })
  }).catch((error) => {
    console.log(error);
  });
});

router.post('/health-insurance-calculator/submit', async (req, res, next) => {
  let user_metadata = {
    birthdate: req.body.birthday_day + '/' +req.body.birthday_month +'/' +req.body.birthday_year,
    quote: {
      type: 'care',
      date: 'date',
      coverage: req.body.coverage,
      status: 'pending',
      prices: '10€'
    },
    terms_and_condition: 'accepted'
  }
  console.log(user_metadata)
  await createUser(req.body.email, 'email', user_metadata).then((response) => {
    res.render('healthCalculatorOverview', {
      title: 'Auth0 Webapp sample Nodejs',
      isAuthenticated: req.oidc.isAuthenticated(),
      health_coverage: req.body.coverage,
      email: req.body.email,
      birthdate: req.body.birthday_day + '/' +req.body.birthday_month +'/' +req.body.birthday_year,
    })
  }).catch((error) => {
    console.log(error);
  });
});

router.get('/health-insurance-calculator/save-for-later', async (req, res, next) => {
    res.render('healthCalculatorSaved', {
      title: 'Auth0 Webapp sample Nodejs',
      isAuthenticated: req.oidc.isAuthenticated(),
    })
});

router.get('/health-insurance-calculator/save-later', function (req, res, next) {
  res.render('healthCalculatorOverview', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), async (req, res, next) => {
  await getUser(req.oidc.user.sub).then((user) => {
    res.render('profile', {
        title: 'Atko insurance - Profile',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
        quote: user.user_metadata.quote,
        services: user.user_metadata.services,
      }) 
    }).catch((error) => {
      console.log(error);
    });
});

router.get('/offer/purchase', requiresAuth(), (req, res, next) => {
  res.render('purchase', {
    title: 'Atko Insurance - Purchase',
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user
  });
});

router.get('/coverages', requiresAuth(), (req, res, next) => {
  res.render('coverages', {
    title: 'Atko Insurance - Care - Your policies',
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user
  });
});

router.post('/purchase/submit', requiresAuth(), async (req, res, next) => {
  let user_metadata = {
    quote: {
      status: "accepted"
    },
    services: [
      { type: 'care', coverage:'name of the coverage' }
    ]
  }
  await createUserWithPassword(req.oidc.user.email, 'Username-Password-Authentication', {}, req.body.password).then(async(user) => {
    await linkUsers(req.oidc.user.sub, 'auth0', 'con_qWMNvTufPQFXPH2v', user.user_id).then(async(linkedUser) => {
      await updateUser(req.oidc.user.sub, { given_name: req.body.first_name, family_name: req.body.last_name, name: req.body.first_name +' ' +req.body.last_name, user_metadata: user_metadata }).then((updatedUser) => {
        res.render('congratulations', {
          title: 'Congratulations',
          isAuthenticated: req.oidc.isAuthenticated()
        });
      }).catch((error) => {
          console.log(error);
      });
    }).catch((error) => {
        console.log(error);
    });
  }).catch((error) => {
      console.log(error);
  });
});


router.post('/product-information', async (req, res) => {
    await getUser(req.oidc.user.sub).then((response) => {
        res.render('product-information', {
            layout: 'index',
            userAuthenticated: res.userAuthenticated,
            user:req.oidc.user,
            profile: response
        }) 
    }).catch((error) => {
        console.log(error);
    });
});

module.exports = router;