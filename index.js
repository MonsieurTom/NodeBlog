/* Requires */
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let passport = require("passport");
let User = require("./models/user");
let Post = require("./models/post");
let LocalStrategy = require("passport-local");
let passportLocalMongoose = require("passport-local-mongoose");

/* inits */
const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/awesome-blog");


/* I override the size limit (1Mb) to be able to pass images (and Gifs) through json (base 64b) and stock them into my database */
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
/* Using EJS as templating engine*/
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

/* Session */
app.use(require("express-session")({
    secret:"Hello World, this is a session",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
/* Set serialization of passport on User's data*/
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
    Routes
 */
/* GET ROUTES */
app.get('/', (req, res) => {
    /* Query all data inside Post */
    Post.find({}, (err, posts) => {
        if (err)
            console.log(err);
        else {
            /* Render index.ejs with parameters:
            ** req.user is the user logged through sessions
            **/
            res.render('pages/index.ejs', {
                pageTitle: 'Home',
                posts: posts,
                currentUser: req.user
            });
        }
    });
});

//auth related
/* Sign-up page with error*/
app.get('/sign-up/:error', (req, res) => {
    res.render('pages/signup.ejs', {
        pageTitle: 'SignUp',
        error: req.params.error,
        currentUser: req.user
    });
});

/* Sign-up page without error */
app.get('/sign-up', (req, res) => {
    res.render('pages/signup.ejs', {
        pageTitle: 'SignUp',
        error: "",
        currentUser: req.user
    });
});

/* Sign-in page without error*/
app.get('/sign-in', (req, res) => {
   res.render('pages/signin.ejs', {
       pageTitle: 'SignIn',
       error: "",
       currentUser: req.user
   });
});

/* Sign-in page with error */
app.get('/sign-in/:error', (req, res) => {
    res.render('pages/signin.ejs', {
        pageTitle: 'SignUp',
        error: req.params.error,
        currentUser: req.user
    });
});

/* Logout the user stocked inside the session (done by the passport module) */
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
// END auth related

app.get('/new_post', (req, res) => {
    res.render('pages/post.ejs', {
        pageTitle: 'New blog post',
        currentUser: req.user
    });
});

app.get('/view_post/:id', (req, res) => {
    Post.find({_id: req.params.id}, (err, post) => {
        /* Check if a user is logged */
        if (!req.user) {
            res.render('pages/article.ejs', {
                pageTitle: post[0].title,
                post: post[0],
                currentUser: "",
                write_right: false
            });
        } else {
            /* Check if the user is an admin or is the owner of the article then display delete and edit options or not */
            if (req.user.username.localeCompare(post[0].author) === 0 || req.user.username.localeCompare("Admin") === 0) {
                res.render('pages/article.ejs', {
                    pageTitle: post[0].title,
                    post: post[0],
                    currentUser: req.user,
                    write_right: true
                });
            } else {
                res.render('pages/article.ejs', {
                    pageTitle: post[0].title,
                    post: post[0],
                    currentUser: req.user,
                    write_right: false
                });
            }
        }
    });
});

app.get('/delete_verif/:id', (req, res) => {
    Post.find({_id: req.params.id}, (err, post) => {
        /* Check if a user is logged */
        if (!req.user) {
            res.render('pages/delete_verif.ejs', {
                pageTitle: "Delete Article",
                post: post[0],
                currentUser: "",
                write_right: false
            });
        } else {
            /* Check if the user is an admin or the owner of the post, if so, display the page or not*/
            if (req.user.username.localeCompare(post[0].author) === 0 || req.user.username.localeCompare("Admin") === 0) {
                res.render('pages/delete_verif.ejs', {
                    pageTitle: "Delete Article",
                    post: post[0],
                    currentUser: req.user,
                    write_right: true
                });
            } else {
                res.render('pages/delete_verif.ejs', {
                    pageTitle: "Delete Article",
                    post: post[0],
                    currentUser: req.user,
                    write_right: false
                });
            }
        }
    });
});

app.get('/edit_post/:id', (req, res) => {
    Post.find({_id: req.params.id}, (err, post) => {
        /* Check if a user is logged */
    if (!req.user) {
            res.render('pages/edit_post.ejs', {
                pageTitle: 'Edit post',
                post: post[0],
                currentUser: "",
                write_right: false
            });
    } else {
        /* Check if the user is an admin or the owner of the post, if so, display the page or not*/
        if (req.user.username.localeCompare(post[0].author) === 0 || req.user.username.localeCompare("Admin") === 0) {
            res.render('pages/edit_post.ejs', {
                pageTitle: 'Edit post',
                post: post[0],
                currentUser: req.user,
                write_right: true
            });
        } else {
            res.render('pages/edit_post.ejs', {
                pageTitle: 'Edit post',
                post: post[0],
                currentUser: req.user,
                write_right: false,
            });
        }
    }
   });
});

app.get("/all/:page", (req, res) => {
   Post.find({}, (err, posts) => {
      res.render('pages/all.ejs', {
          pageTitle: "All posts",
          posts: posts,
          currentUser: req.user,
          pageNumber: req.params.page
      });
   });
});

/* DELETE ROUTES */
app.delete('/delete_post/:id', (req, res) => {
    Post.find({_id: req.params.id}, (err, post) => {
        /* check if a user is logged*/
        if (req.user) {
            /* check if the user is the owner of the post or an admin then delete the post */
            if (req.user.username.localeCompare(post[0].author) === 0 || req.user.username.localeCompare("Admin") === 0) {
                Post.deleteOne({_id: req.params.id}, function (err, post) {
                    if (err) {
                        res.status(500).send("unable to delete post");
                    } else {
                        res.send();
                    }
                });
            }
        }
    });
});

/* PUT ROUTES */
app.put('/edit_post', (req, res) => {
    Post.find({_id: req.body._id}, (err, post) => {
        /* check if a user is logged*/
        if (req.user) {
            /* check if the user is the owner of the post or an admin then delete the post */
            if (req.user.username.localeCompare(post[0].author) === 0 || req.user.username.localeCompare("Admin") === 0) {
                let updated_post = req.body;
                Post.updateOne({_id: req.body._id}, updated_post, function (err, post) {
                    if (err) {
                        res.status(500).send("unable to edit post")
                    } else {
                        res.send();
                    }
                });
            }
        }
    });

});

/* POST ROUTES */
app.post('/addpost', (req, res) => {

    postData = new Post();
    postData.title = req.body.title;
    postData.body = req.body.body;
    postData.author = req.user.username;
    postData.date = Date.now();

    postData.save().then( result => {
        res.send();
    }).catch(err => {
        res.status(400).send("Unable to save data");
    });

});

app.post('/register', (req, res) => {

    User.register(new User({
        username: req.body.username
    }), req.body.password, function (err, user) {
        if (err) {
            return (res.send(err.message));
        }
        return (res.send("success"))
    });
});

app.post('/login', function(req, res) {
    passport.authenticate('local', function(err, user, params) {
        if (req.xhr) {
            if (err)
                return res.send(err.message);
            if (!user && params)
                return res.send("Invalid Login");
            if (!user)
                return res.send("Invalid Login");
            req.login(user, {}, function(err) {
                if (err) { return res.send(error.message); }
                return res.send("success");
            });
        } else {
            if (err)   { return res.redirect('/login'); }
            if (!user) { return res.redirect('/login'); }
            req.login(user, {}, function(err) {
                if (err) { return res.redirect('/login'); }
                return res.redirect('/');
            });
        }
    })(req, res);
});

/*
    Listen
 */
app.listen(port, () => console.log(`App listening on port ${port}!`));