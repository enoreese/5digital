const router = require('express').Router();
const passport = require('passport');
const crypto = require("crypto");
const async = require("async");
const sgMail = require('@sendgrid/mail');
const passportConfig = require('../config/passport');
const User = require('../models/user');
const File = require('../models/file');
const Token = require('../models/token');
const Project = require('../models/projects');
const upload = require('./upload');
const middleware = require("../middleware")
const bcrypt = require("bcrypt-nodejs");
const helper = require('../config/helpers');

const sendGridKey = "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";

const admin = 1;
const mainuser = 2;

/* SIGNUP ROUTE */
router.route('/register')
  .get((req, res, next) => {
    res.render('main/register');
  })
  .post((req, res, next) => {
    User.findOne({ email: req.body.email }, function (err, existingUser) {
      if (existingUser) {
        req.flash('error', 'Account with that email address already exists.');
        return res.redirect('/register');
      } else {
        const user = new User();
        const { fullname, email, phone, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
          req.flash('error', 'Passwords do not match');
          return res.redirect('/register');
        }

        if (!fullname || !email || !password || !phone) {
          req.flash('error', 'Please enter input fields');
          return res.redirect('/register')
        }
        user.fullname = fullname;
        user.email = email;
        user.password = password;
        user.phonenumber = phone;
        user.role = mainuser;
        user.photo = user.gravatar();
        user.save(function (err) {
          if (err) return next(err);
          // Create a verification token for this user
          var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

          // Save the verification token
          token.save(function (err) {
            if (err) { req.flash('error', err.message); }

            sgMail.setApiKey(sendGridKey);
            const msg = {
              to: user.email,
              from: 'no-reply@5digitalmarketing.com',
              subject: 'Account Verification Token',
              html: '<p>Hello,\n\n' + 'Please verify your account by clicking this link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n</p>',
            }
            sgMail.send(msg)
            req.flash('success', 'A verification email has been sent to ' + user.email + '.');
            return res.redirect('/register');
          })

        });
      }
    });
  });

// FORGOTTEN PASSWORD
router.post('/forgot', (req, res, next) => {
  async.waterfall([

    function (done) {
      crypto.randomBytes(16, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },

    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },

    function (token, user, done) {
      sgMail.setApiKey(sendGridKey);
      const msg = {
        to: user.email,
        from: 'no-reply@5digitalmarketing.com',
        subject: 'Password Reset',
        html: '<p>' + 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged.\n </p>',
      }
      sgMail.send(msg, function (err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      })
    }
  ],

    function (err) {
      if (err) return next(err);
      res.redirect('/forgot');
    })
})

// PASSWORD RESET
router.route('/reset/:token')
  .get((req, res) => {
    User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } }, function (err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('main/reset', {
        user: req.user
      });
    });
  })
  .post((req, res) => {
    async.waterfall([
      function (done) {
        User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } }, function (err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function (err) {
            req.logIn(user, function (err) {
              done(err, user);
            });
          });
        });
      },
      function (user, done) {
        sgMail.setApiKey(sendGridKey);
        const msg = {
          to: user.email,
          from: 'no-reply@5digitalmarketing.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        sgMail.send(msg, function (err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function (err) {
      res.redirect('/profile');
    });
  });


// PASSWORD CHANGE
router.route('/change-password')
  .get(middleware.isLoggedIn, (req, res, next) => {
    res.render('main/password-change')
  })
  .post(middleware.isLoggedIn, (req, res, next) => {
    async.waterfall([
      function (done) {
        User.findOne({ _id: req.user._id }, function (err, user) {

          if (err) return next(err)

          var res = bcrypt.comparesync(req.body.oldpassword, user.password)

          if (!res) {
            req.flash('error', "Old password wrong")
            return res.redirect('/change-password')
          }

          user.password = req.body.newpassword;
          user.save(function (err) {
            done(err, user)
          })
        })
      },

      function (user, done) {
        sgMail.setApiKey(sendGridKey);
        const msg = {
          to: user.email,
          from: 'no-reply@5digitalmarketing.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        sgMail.send(msg, function (err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function (err) {
      if (err) return next(err)
      req.flash('success', 'Your password was changed successfully')
      res.redirect('/change-password')
    })
  })


//TOKEN CONFIRMATION 
router.get('/confirmation/:token_id', (req, res, next) => {
  // Find a matching token
  Token.findOne({ token: req.params.token_id }, function (err, token) {
    if (!token) {
      req.flash('error', 'We were unable to find a valid token. Your token may have expired, Click Here')
      return res.redirect('/login')
    }

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId }, function (err, user) {
      if (!user) {
        req.flash('error', 'We were unable to find a user for this token.')
        return res.redirect('/login')
      }

      if (user.isVerified) {
        req.flash('error', 'This user has already been verified.');
        return res.redirect('/login')
      }

      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err) return next(err);
        console.log(user)
        req.flash('success', 'Your account has been verified. Please log in.');
        return res.redirect('/create-password?id='+user._id);
      });
    });
  });
});

//CREATE PASSWORD
router.route('/create-password')
  .get((req, res, next) => {
    var id = req.query.id;
    res.render('main/create_password', {id: id})
  })
  .post((req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
      req.flash('error', 'Confirm password do not match')
      return res.redirect('/create-password')
    } else {
      User.findById({ '_id': req.body.id }, (err, user) => {
        if (err) return next(err);

        user.password = req.body.password
        user.save((err) => {

          req.flash('success', 'Password Created Successfully! Please login.')
          return res.redirect('/login')
        })
      })
    }
  })

//RESEND CONFIRMATION TOKEN
router.route('/resend')
  .get((req, res, next) => {
    res.render('user-accounts/token_resender')
  })
  .post((req, res, next) => {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (!user) {
        req.flash('error', 'We were unable to find a user with that email.')
        return res.redirect('/resend')
      }
      if (user.isVerified) {
        req.flash('success', 'This account has already been verified. Please log in.')
        return res.redirect('/login')
      }

      // Create a verification token, save it, and send email
      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the verification token
      token.save(function (err) {
        if (err) { req.flash('error', err.message); }

        sgMail.setApiKey(sendGridKey);
        const msg = {
          to: user.email,
          from: 'no-reply@5digitalmarketing.com',
          subject: 'Account Verification Token',
          html: '<p>Hello,\n\n' + 'Please verify your account by clicking this link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n</p>',
        }
        sgMail.send(msg)
        req.flash('success', 'A verification email has been sent to ' + user.email + '.')
        return res.redirect('/resend')
      })
    })
  })


/* LOGIN ROUTE */
router.route('/login')
  .get((req, res, next) => {
    if (req.user) return res.redirect('/dashboard');
    res.render('main/login', { 'error': req.flash('loginMessage') });
  })
  .post(passport.authenticate('local-login', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
// .post((req, res, next) => {
//   var username = req.body.email;
//   var password = req.body.password;

//   console.log('1');
//   if (username && password) {
//     console.log('2');
//     // Change auth DB here -------\|/
//     var query = 'SELECT * FROM wp_users WHERE username = ? AND password = ?'
//     helper.query(query,  [username, password], (err, results, fields) => {
//       console.log('3');
//       if (err) next(err);

//       res.redirect('/sew-cloth');
//       // helper.end();
//     })
//   } else {

//   }
// });

/* BUYER PROFILE ROUTE */
router.route('/dashboard')
  .get(passportConfig.isAuthenticated, (req, res, next) => {
    User.findOne({ _id: req.user._id })
      // .populate('file')
      .populate('projects')
      .exec(function (err, user) {

        // user.projects.forEach((project) => {
        //   project.created = project.created​.toLocale​Date​String()
        // })

        res.render('dashboard/index', { sidebar: 'dashboard', user: user });
      });
  })
  .post((req, res, next) => {
    User.findOne({ _id: req.user._id }, function (err, user) {
      if (err) throw err;
      if (user) {
        if (req.body.fullname) user.fullname = req.body.fullname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.phonenumber) user.phonenumber = req.body.phonenumber;
        if (req.body.address) user.address = req.body.address;
        if (req.body.shippingaddress) user.shippingaddress = req.body.shippingaddress;
        user.save(function (err) {
          req.flash('success', 'Your details have been successfully updated')
          res.redirect('/profile/' + req.user._id)
        })
      }
    })
  });

router.route('/projects')
  .get(passportConfig.isAuthenticated, (req, res, next) => {
    User.findOne({ _id: req.user._id })
      .populate('projects')
      // .populate('measurements')
      .exec(function (err, user) {
        console.log(user)

        res.render('dashboard/projects', { sidebar: 'projects', user: user });
      });
  })
  .post((req, res, next) => {
    console.log(req.body);
    var projectType = req.body.projectType,
      projectLevel = req.body.projectLevel,
      projectDuration = req.body.projectDuration,
      projectDescription = req.body.projectDescription,
      title = req.body.title;

    const project = new Project();

    project.projectType = projectType;
    project.projectLevel = projectLevel;
    project.projectDuration = projectDuration;
    projectDescription = projectDescription;
    project.title = title;
    project.userId = req.user._id;

    project.save((err) => {
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
      User.update(
        {
          _id: newUser._id
        },
        {
          $push: { sew: project._id }
        }, function (err, count) {
          if (err) {
            return next(err)
          }

          // Project Verification Email
          sgMail.setApiKey(sendGridKey);
          const msg = {
            to: req.user.email,
            from: 'no-reply@5digitalmarketing.com',
            subject: 'New Project Application',
            html: '<p>Hello,\n\n' + 'You have registered for a Project: \n Here are details of your project: \n\n' +
              'Project Title: ' + project.title + '\n' +
              'New or Existing Project? ' + proLevel + '\n' +
              'Start time: ' + proDur + '\n' +
              '.\n</p>',
          }
          sgMail.send(msg)

          // Project Verification Email to admin
          sgMail.setApiKey(sendGridKey);
          const msg2 = {
            to: 'hello@5digitalmarketing.com',
            from: 'no-reply@5digitalmarketing.com',
            subject: 'New Project Application',
            html: '<p>Hello,\n\n' + 'A user has registered for a Project: \n Here are details of the project: \n\n' +
              'Project Title: ' + project.title + '\n' +
              'New or Existing Project? ' + proLevel + '\n' +
              'Start time: ' + proDur + '\n' +
              '.\n</p>',
          }
          sgMail.send(msg2)

          req.flash('success', 'Your Project has been created successfully. ');
          return res.redirect('/projects')
        })
    })
  })

router.route('/account')
  .get(passportConfig.isAuthenticated, (req, res, next) => {
    User.findOne({ _id: req.user._id })
      // .populate('file')
      // .populate('measurements')
      .exec(function (err, user) {

        res.render('dashboard/account', { sidebar: 'account', user: user });
      });
  })

router.route('/billing')
  .get(passportConfig.isAuthenticated, (req, res, next) => {
    // User.findOne({ _id: req.user._id })
    //   // .populate('file')
    //   // .populate('measurements')
    //   .exec(function (err, user) {

    res.render('dashboard/billing', { sidebar: 'billing' });
    // });
  })

router.route('/settings')
  .get(passportConfig.isAuthenticated, (req, res, next) => {
    // User.findOne({ _id: req.user._id })
    //   // .populate('file')
    //   // .populate('measurements')
    //   .exec(function (err, user) {

    res.render('dashboard/settings', { sidebar: 'settings' });
    // });
  })

/* EDIT BUYER PROFILE ROUTE */
router.route('/edit-profile')
  .get(passportConfig.isAuthenticated, (req, res, next) => {
    User.findOne({ _id: req.user._id })
      .populate('file')
      .populate('measurements')
      .exec(function (err, user) {
        var noMeasurement;
        if (user.measurements.length < 0) {
          noMeasurement = false;
        } else {
          noMeasurement = true;
        }
        res.render('main/edit_profile', { foundUser: user, noMeasurement: noMeasurement });
      });
  })
  .post((req, res, next) => {
    User.findOne({ _id: req.user._id }, function (err, user) {
      if (err) throw err;
      if (user) {
        if (req.body.fullname) user.fullname = req.body.fullname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.phonenumber) user.phonenumber = req.body.phonenumber;
        if (req.body.address) user.address = req.body.address;
        if (req.body.shippingaddress) user.shippingaddress = req.body.shippingaddress;
        user.save(function (err) {
          req.flash('success', 'Your details have been successfully updated')
          res.redirect('/profile/' + req.user._id)
        })
      }
    })
  });



//PROFILE PICTURE
router.post('/upload', (req, res) => {
  User.findOne({ _id: req.user._id }, function (err, user) {
    upload(req, res, (error) => {
      if (error) {
        console.log(error);
      } else {
        if (req.file == undefined) {
          console.log('file is undefined');
        } else {

          /** Create new record in mongoDB*/
          var fullPath = req.file.filename;
          user.photo = fullPath;
          user.save(function (err) {
            req.flash('success', 'Your profile picture have been successfully uploaded')
            res.redirect('/profile')
          });
        }
      }
    });
  })
})


//LOGOUT ROUTE
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
