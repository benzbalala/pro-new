const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const initializePassPort = require('./passportConfig');

initializePassPort(passport);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(
    session({ 
        secret: "secret",
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/users/register', (req, res) => {
    res.render('register');
});

app.get('/users/login', (req, res) => {
    res.render('login');
});

app.get('/users/home-login', (req, res) => {
    res.render('home-login', { user: req.user.name });
});

app.post('/users/register', async (req, res) => {
    let { name, email, password, comfirmpassword } = req.body;

    console.log({ name, email, password, comfirmpassword });

    let errors = [];

    if (!name || !email || !password || !comfirmpassword) {
        errors.push({ message: 'Please enter all fields' });
    }

    if (password.length < 6) {
        errors.push({ message: 'Password must be at least 6 characters' });
    }

    if (password != comfirmpassword) {
        errors.push({ message: 'Password do not match'});
    }

    if (errors.length > 0) {
        res.render('register', { errors });
    }
    else {
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, results) => {
                if (err) {
                    throw err;
                }
                console.log('reaches here');
                console.log(results.rows);

                if(results.rows.length > 0) {
                    errors.push({ message: 'Email already exists' });
                    res.render('register', { errors });
                } else {
                    pool.query(
                        `INSERT INTO users (name, email, password, comfirmpassword)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id, password`,
                        [name, email, hashedPassword, comfirmpassword],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash('success_msg', 'You are now registered. Please log in');
                            res.redirect('/users/login');
                        }
                    );
                }
            }
        )
    }
});

app.post('/users/login', passport.authenticate('local', {
    successRedirect: '/users/home-login',
    failureRedirect: '/users/login',
    failureFlash: true
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});