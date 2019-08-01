const router = require('express').Router();
const async = require('async');
const crypto = require('crypto');
const User = require('../models/user');
const Token = require('../models/token')
const Project = require('../models/projects');
const File = require('../models/file');
const Sew = require('../models/sew');
const upload = require('./upload');
const middleware = require("../middleware")
const sgMail = require('@sendgrid/mail');

const keyPublishable = "pk_test_qfNCMoLA8b0UU73HbTRw1odB";

const sendGridKey = "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";


//HOMEPAGE ROUTE
// router.get('/', (req, res, next) => {
//   res.redirect('/sew-cloth');
// });

//HOMEPAGE
router.get('/', (req, res, next) => {
  res.render('main/index');
})

//ABOUT US
router.get('/about', (req, res, next) => {
  res.render('main/about');
})

//SERVICES
router.get('/services', (req, res, next) => {
  res.render('main/services');
})

router.get('/facebook-market', (req, res, next) => {
  res.render('main/services/facebook_market');
})

router.get('/seo', (req, res, next) => {
  res.render('main/services/seo');
})

router.get('/ppc', (req, res, next) => {
  res.render('main/services/ppc');
})

router.get('/email-market', (req, res, next) => {
  res.render('main/services/email_market');
})

router.get('/digital-market', (req, res, next) => {
  res.render('main/services/digital_market');
})

router.get('/social-market', (req, res, next) => {
  res.render('main/services/social_market');
})

router.get('/web-design', (req, res, next) => {
  res.render('main/services/web_design');
})

router.get('/branding', (req, res, next) => {
  res.render('main/services/branding');
})

router.get('/print-media', (req, res, next) => {
  res.render('main/services/print_media');
})

router.get('/thank-you-smgk', (req, res, next) => {
  res.render('main/landing_pages/thank_you');
})

//CONTACT US
router.route('/contact')
  .get((req, res, next) => {
    res.render('main/contact');
  })
  .post((req, res, next) => {
    var name = req.body.name,
      email = req.body.email,
      message = req.body.message,
      subject = req.body.subject;

    sgMail.setApiKey(sendGridKey);
    const msg = {
      to: 'mosesazorbo@yahoo.com',
      from: 'no-reply@5digital.com',
      subject: 'New Project Application',
      html: '<p>Hello,\n\n' + 'A user withe following query has contacted you: \n Here are details: \n\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Subject: ' + subject + '\n' +
        'Message: ' + message + '\n' +
        '.\n</p>',
    }
    sgMail.send(msg)

    req.flash('success', 'Your message has been sent successfully.');
    return res.redirect('/contact');
  })

//CONTACT US
router.get('/terms', (req, res, next) => {
  res.render('main/terms_use');
})

//FORGOT PASSWORD
router.get('/forgot', (req, res, next) => {
  res.render('main/forgot');
})

//Confirm Web Design
router.get('/confirm/web', (req, res, next) => {
  res.render('main/confirmation/web');
})

//Confirm Web Design
router.get('/confirm/digital', (req, res, next) => {
  res.render('main/confirmation/digital');
})

//Confirm Web Design
router.get('/confirm/branding', (req, res, next) => {
  res.render('main/confirmation/branding');
})


// Landing page
router.get('/free-social-media-graphic-kit', (req, res, next) => {
  res.render('main/landing_pages/free-social-media-graphic-kit');
})

router.get('/free-social-media-graphic-kit-d', (req, res, next) => {
  res.render('main/landing_pages/free-social-media-graphics-kit-dollar');
})

router.get('/free-social-media-graphic-kit-n', (req, res, next) => {
  res.render('main/landing_pages/free-social-media-graphic-kit-naira');
})

//CAREER
router.get('/new-project', (req, res, next) => {
  res.render('main/new_project');
})
router.post('/new-project', (req, res, next) => {
  var projectType = req.body.projectType,
    projectLevel = req.body.projectLevel,
    projectDuration = req.body.projectDuration,
    title = req.body.title;

  console.log(req.body)

  User.findOne({ 'email': req.body.email }, (err, user) => {
    if (req.body.email) {
      console.log('User Exists')
      // if user already exists
      // userId = user._id;
      // if (req.body.password) {
      // var resp = bcrypt.comparesync(req.body.password, user.password)

      // if (!resp) {
      //   req.flash('error', "Wrong Password")
      //   return res.redirect('/new-project')
      // }

      var newUser = new User();
      newUser.fullname = req.body.fullname;
      newUser.email = req.body.email;
      // newUser.phonenumber = req.body.phone;
      newUser.photo = newUser.gravatar();

      newUser.save((err) => {
        var project = new Project();
        project.projectType = projectType;
        project.projectLevel = projectLevel;
        project.projectDuration = projectDuration;
        project.title = title;
        project.userEmail = req.body.email;

        project.save((err) => {
          if (projectType === 'web_design') {
            var proLevel = 'Web Design'
          } else if (projectType === 'digital_market') {
            var proLevel = 'Digital Marketing'
          } else {
            var proLevel = 'Branding'
          }

          if (projectDuration === 'now') {
            var proDur = 'Now'
          } else if (projectDuration === '1_week') {
            var proDur = '1 Week'
          } else if (projectDuration === '1_month') {
            var proDur = '1 Month'
          } else {
            var proDur = '2 Months'
          }

          // Project Verification Email
          sgMail.setApiKey(sendGridKey);
          const msg = {
            to: newUser.email,
            from: 'no-reply@5digital.com',
            subject: 'New Project Application',
            html: '<p>Hello,\n\n' + 'You have registered for a Project: \n Here are details of your project: \n\n' +
              'Project Title: ' + project.title + '\n' +
              'New or Existing Project? ' + proLevel + '\n' +
              'Start time: ' + proDur + '\n' +
              '.\n</p>',
          }
          sgMail.send(msg)

          // Admin Email
          sgMail.setApiKey(sendGridKey);
          const msg2 = {
            to: 'hello@5digitalmarketing.com',
            from: 'no-reply@5digital.com',
            subject: 'New Project Application',
            html: '<p>Hello,\n\n' + 'A User' + + 'have registered for a Project: \n Here are details of your project: \n\n' +
              'Project Title: ' + project.title + '\n' +
              'New or Existing Project? ' + proLevel + '\n' +
              'Start time: ' + proDur + '\n' +
              '.\n</p>',
          }
          sgMail.send(msg2)

          // req.flash('success', 'Your Project has been created');
          if (projectType === 'web_design') {
            return res.redirect('/confirm/web')
          } else if (projectType === 'digital_market') {
            return res.redirect('/confirm/digital')
          } else {
            return res.redirect('/confirm/branding')
          }

          // req.flash('success', 'Your Project has been created');
          // passport.authenticate('local-login', {
          //   successRedirect: '/', // redirect to the secure profile section
          //   failureRedirect: '/new-project', // redirect back to the signup page if there is an error
          //   failureFlash: true // allow flash messages
          // })
        })
      })
      // }
    } else {
      console.log('New User')
      var newUser = new User();
      newUser.fullname = req.body.fullname;
      newUser.email = req.body.email;
      newUser.phonenumber = req.body.phone;
      newUser.photo = newUser.gravatar();
      newUser.save((err) => {
        if (err) return next(err);

        // Create a verification token for this user
        var token = new Token({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the verification token
        token.save(function (err) {
          console.log('token save')

          if (err) { req.flash('error', err.message); }

          // Verification Email
          sgMail.setApiKey(sendGridKey);
          const msg = {
            to: newUser.email,
            from: 'no-reply@5digital.com',
            subject: 'Account Verification Token',
            html: '<p>Hello,\n\n' + 'Please verify your account by clicking this link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n</p>',
          }
          sgMail.send(msg)

          var project = new Project();
          project.projectType = projectType;
          project.projectLevel = projectLevel;
          project.projectDuration = projectDuration;
          project.title = title;
          project.userId = newUser._id;

          project.save((error) => {
            if (error) return next(error);

            console.log('project save')
            if (projectLevel === 'web_design') {
              var proLevel = 'Web Design'
            } else if (projectLevel === 'digital_market') {
              var proLevel = 'Digital Marketing'
            } else {
              var proLevel = 'Branding'
            }

            if (projectDuration === 'now') {
              var proDur = 'Now'
            } else if (projectDuration === '1_week') {
              var proDur = '1 Week'
            } else if (projectDuration === '1_month') {
              var proDur = '1 Month'
            } else {
              var proDur = '2 Months'
            }

            // Add to User Document
            User.findById({ '_id': newUser._id }, function (err, newUser) {
              if (err) {
                return next(err)
              }

              newUser.projects.push(project._id)

              newUser.save((err) => {
                // Project Verification Email
                sgMail.setApiKey(sendGridKey);
                const msg = {
                  to: newUser.email,
                  from: 'no-reply@5digital.com',
                  subject: 'New Project Application',
                  html: '<p>Hello,\n\n' + 'You have registered for a Project: \n Here are details of your project: \n\n' +
                    'Project Title: ' + project.title + '\n' +
                    'New or Existing Project? ' + proLevel + '\n' +
                    'Start time: ' + proDur + '\n' +
                    '.\n</p>',
                }
                sgMail.send(msg)

                req.flash('success', 'A verification email has been sent to ' + newUser.email + '.');
                return res.redirect('/')
              })
            }
            );
          })
        })
      })
    }
  })
})

//PRODUCTION
router.get('/production', (req, res, next) => {
  res.render('main/production');
})

//SEW CLOTH
router.route('/sew-cloth')
  .get((req, res, next) => {
    if (!req.user) res.redirect('login');
    User.findById({ _id: req.user._id })
      .populate('measurements')
      .populate('file')
      .exec(function (err, user) {
        res.render('main/sew', { user: user });
      })
  })
  .post((req, res, next) => {

    console.log(req.body)

    //  upload(req, res,(error) => {
    //   if(error){
    //      console.log(error);
    //   }else{
    //     if(req.file == undefined){
    //       console.log('file is undefined');
    //     }else{

    /** Create new record in mongoDB*/
    // var fullPath = req.file.filename;
    var document = {
      measurement: req.body.measurement,
      design: req.body.design,
      occasion: req.body.occasion,
      fabric: req.body.fabric,
      delivery: req.body.delivery,
    };

    var sew = new Sew(document);
    sew.save(function (err) {

      sgMail.setApiKey(sendGridKey);
      const msg = {
        to: req.user.email,
        from: 'justtawaservices@gmail.com',
        subject: 'Tailoring Request Summary',
        html: '<p>Hello,\n\n' + 'Here are the details of your order: \n\n' +
          'Measurement: ' + req.body.measurement + '\n\n' +
          'Design: ' + req.body.design + '\n\n' +
          'Fabric: ' + req.body.fabric + '\n\n' +
          'Delivery: ' + req.body.delivery + '\n\n' +
          'Thank you for your patronage',
      }
      sgMail.send(msg)

      User.update(
        {
          _id: req.user._id
        },
        {
          $push: { sew: sew._id }
        }, function (err, count) {
          if (err) {
            return next(err)
          }

          req.flash('success', 'Your request has been submitted.')
          var url = '/checkout/' + String(sew._id);
          res.redirect(url)
        }
      );
      //       });
      //     }
      //   }
      // });

    })
  });

// CHECKOUT
router.get('/checkout/:id', (req, res, next) => {
  Sew.findOne({ _id: req.params.id })
    .exec(function (err, sew) {
      console.log(sew)
      res.render('main/checkout', { sew, keyPublishable })
    })
})

//PAYMENT
router.route('/payment')
  .get(middleware.isLoggedIn, (req, res, next) => {
    res.render('main/payment', { keyPublishable });
  })
  .post(middleware.isLoggedIn, (req, res) => {
    var sews = req.session.sew;
    var price = 50
    price *= 100;

    stripe.customers.create({
      email: req.user.email,
      source: req.body.stripeToken
    })
      .then(customer =>
        stripe.charges.create({
          amount: price,
          description: "Justtawa Charge",
          currency: "usd",
          customer: customer.id
        }))
      .then(charge => {
        const success = sews;
        if (success) {
          sgMail.setApiKey(sendGridKey);
          const msg = {
            to: email,
            from: 'justtawaservices@gmail.com',
            subject: 'Order Status',
            html: '<p>Hi!,\n\n' + 'Your order was successfully created. Your Cloth gets delivered in the next ten days</p>',
          }
          sgMail.send(msg)
          res.render('main/payment_successful')
        }

      })
      .catch(err => console.log(err));
  });

//AFTER PAYMENT PAGE
router.get('/payment-successful', middleware.isLoggedIn, (req, res, next) => {
  res.render('main/payment_successful');
})

router.get('/payment-failed', middleware.isLoggedIn, (req, res, next) => {
  res.render('main/payment_failed');
})

module.exports = router;