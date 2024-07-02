// const express = require('express');
// const app = express();
// const { pool } = require('./dbConfig');
// const bcrypt = require('bcrypt');
// const session = require('express-session');
// const flash = require('express-flash');
// const passport = require('passport');
// const fs = require('fs');
// const path = require('path');
// const bodyParser = require('body-parser');
// const initializePassPort = require('./passportConfig');

// initializePassPort(passport);
// const PORT = process.env.PORT || 3000;

// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// app.use(
//     session({ 
//         secret: "secret",
//         resave: false,
//         saveUninitialized: false
//     })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());

// app.get('/', (req, res) => {
//     res.render('home');
// });

// app.get('/test', (req, res) => {
//     res.render('test');
// });

// app.get('/users/register', (req, res) => {
//     res.render('register');
// });

// app.get('/users/login', (req, res) => {
//     res.render('login');
// });

// app.get('/users/home', (req, res) => {
//     res.render('home');
// });

// app.get('/users/home-login', (req, res) => {
//     res.render('home-login', { name: req.user.name });
// });

// app.get('/selling', (req, res) => {
//     fs.readFile('seller.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading file', err);
//             return res.status(500).send('Internal Server Error');
//         }

//         const formData = JSON.parse(data);
//         res.render('selling', { formData });
//     });
// });

// app.post('/users/register', async (req, res) => {
//     let { name, email, password, comfirmpassword } = req.body;

//     console.log({ name, email, password, comfirmpassword });

//     let errors = [];

//     if (!name || !email || !password || !comfirmpassword) {
//         errors.push({ message: 'Please enter all fields' });
//     }

//     if (password.length < 6) {
//         errors.push({ message: 'Password must be at least 6 characters' });
//     }

//     if (password != comfirmpassword) {
//         errors.push({ message: 'Password do not match'});
//     }

//     if (errors.length > 0) {
//         res.render('register', { errors });
//     }
//     else {
//         let hashedPassword = await bcrypt.hash(password, 10);
//         console.log(hashedPassword);

//         pool.query(
//             `SELECT * FROM users
//             WHERE email = $1`, [email], (err, results) => {
//                 if (err) {
//                     throw err;
//                 }
//                 console.log('reaches here');
//                 console.log(results.rows);

//                 if(results.rows.length > 0) {
//                     errors.push({ message: 'Email already exists' });
//                     res.render('register', { errors });
//                 } else {
//                     pool.query(
//                         `INSERT INTO users (name, email, password, comfirmpassword)
//                         VALUES ($1, $2, $3, $4)
//                         RETURNING id, password`,
//                         [name, email, hashedPassword, comfirmpassword],
//                         (err, results) => {
//                             if (err) {
//                                 throw err;
//                             }
//                             console.log(results.rows);
//                             req.flash('success_msg', 'You are now registered. Please log in');
//                             res.redirect('/users/login');
//                         }
//                     );
//                 }
//             }
//         )
//     }
// });

// app.post('/users/login', passport.authenticate('local', {
//     successRedirect: '/users/home-login',
//     failureRedirect: '/users/login',
//     failureFlash: true
// }));

// app.get('/selling-login', checkAuthenticated, async (req, res) => {
//     try {
//         const user_id = req.user.id; // ดึง ID ของผู้ใช้ที่เข้าสู่ระบบ
//         const user = await getUserById(user_id); // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        
//         // res.render('selling-login', { users: req.user.name });
//         res.render('selling-login', { 
//             user: user,
//             name: user.name,
//             email: user.email,
//             password: user.password
//         });
//     } catch (err) {
//         console.error('Error retrieving user data', err);
//         res.status(500).send('Internal Server Error');
//     }

    
// });


// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next(); // ไปต่อถ้าผู้ใช้เข้าสู่ระบบแล้ว
//     }
//     res.redirect('/users/login'); // ให้กลับไปยังหน้า login หากยังไม่ได้เข้าสู่ระบบ
// }

// async function getUserById(id) {
//     try {
//         const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
//         return result.rows[0]; // ส่งค่าข้อมูลผู้ใช้คนแรกที่พบ
//     } catch (err) {
//         throw err;
//     }
// }

// /* */

// app.use(express.json());

// app.post('/save-data', (req, res) => {
//     const formData = req.body;

//     // เขียนไฟล์ JSON ลงใน seller.json
//     fs.writeFile('seller.json', JSON.stringify(formData, null, 2), (err) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ message: 'Failed to save data' });
//         }

//         res.status(200).json({ message: 'Data saved successfully' });
//     });
// });


// app.use(express.static('public'));


// // Middleware เพื่อให้ Express สามารถอ่านข้อมูล JSON ที่ส่งมาได้
// app.use(bodyParser.json());

// // Endpoint สำหรับรับ HTTP POST request และเขียนข้อมูลลงในไฟล์ JSON
// app.post('/save-product', (req, res) => {
//     try {
//         const productData = req.body;

//         // Write productData to product.json file
//         const filePath = path.join(__dirname, 'product.json');
//         fs.writeFile(filePath, JSON.stringify(productData, null, 2), (err) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ message: 'Failed to save data' });
//             }

//             res.status(200).json({ message: 'Data saved successfully' });
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to save data' });
//     }
// });

// /*---*/

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const initializePassport = require('./passportConfig');

initializePassport(passport);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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

app.get('/users/home', (req, res) => {
    res.render('home');
});

app.get('/users/home-login', checkAuthenticated, (req, res) => {
    res.render('home-login', { name: req.user.name });
});

app.get('/selling', (req, res) => {
    fs.readFile('seller.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Internal Server Error');
        }

        const formData = JSON.parse(data);
        res.render('selling', { formData });
    });
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
        errors.push({ message: 'Password do not match' });
    }

    if (errors.length > 0) {
        res.render('register', { errors });
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
                if (err) {
                    throw err;
                }
                console.log('reaches here');
                console.log(results.rows);

                if (results.rows.length > 0) {
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

app.get('/selling-login', checkAuthenticated, async (req, res) => {
    try {
        const user_id = req.user.id; // ดึง ID ของผู้ใช้ที่เข้าสู่ระบบ
        const user = await getUserById(user_id); // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        
        res.render('selling-login', {
            user: user,
            name: user.name,
            email: user.email,
            password: user.password
        });
    } catch (err) {
        console.error('Error retrieving user data', err);
        res.status(500).send('Internal Server Error');
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.name) {
        return next(); // ไปต่อถ้าผู้ใช้เข้าสู่ระบบและมีชื่อผู้ใช้ที่ถูกต้อง
    }
    res.redirect('/users/login'); // ให้กลับไปยังหน้า login หากยังไม่ได้เข้าสู่ระบบ
}

async function getUserById(id) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0]; // ส่งค่าข้อมูลผู้ใช้คนแรกที่พบ
    } catch (err) {
        throw err;
    }
}

app.use(express.json());

app.post('/save-data', (req, res) => {
    const formData = req.body;

    // เขียนไฟล์ JSON ลงใน seller.json
    fs.writeFile('seller.json', JSON.stringify(formData, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to save data' });
        }

        res.status(200).json({ message: 'Data saved successfully' });
    });
});

app.use(express.static('public'));

app.use(bodyParser.json());

app.post('/save-product', (req, res) => {
    try {
        const productData = req.body;

        // Write productData to product.json file
        const filePath = path.join(__dirname, 'product.json');
        fs.writeFile(filePath, JSON.stringify(productData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to save data' });
            }

            res.status(200).json({ message: 'Data saved successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save data' });
    }
});

/* test */
app.get('/test',(req, res) => {
    // res.render('test');
    //อ่านไฟล์ product
    fs.readFile(path.join(__dirname, 'product.json'), 'utf8', (err, jsonString) => {
        if (err) {
            console.log('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }
        try {
            const data = JSON.parse(jsonString);
            // ส่งข้อมูล JSON ไปหน้า test
            res.render('test', { products: data });
        } catch (err) {
            console.log('Error parsing JSON:', err);
            return res.status(500).send('Error parsing JSON');
        }
    });
});

/* */

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
