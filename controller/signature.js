const pool = require("../database");
const mysql = require('mysql');
const shema = require('../model/user');

// nepotrebna funkcija
// module.exports.showSignature = async function(req, res, next){
//     try{
//         await pool.query('select * from user', (err, rows) => {
//             if (err)
//                 res.status(500).send(err.sqlMessage);
//             else
//                 res.send(rows);
//         });
//     }
//     catch(err){
//         next(err);
//     }
// }

let curr = -1;

module.exports.newSignature = async function(req, res, next) {
    let { error } = shema.validate(req.body);
    if (error){
        console.log(error.details[0].message);
        res.status(400).send("Neispravni podaci!");
    }
    else {
        // u mysql tabeli sam stavio id PK auto increment zato ne mora da se prosledjuje id
        let query = "insert into user (name,password) values (?,?)"
        let formated = mysql.format(query, [req.body.name, req.body.password]);
        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                let query = "select * from user where name like \"" + req.body.name + "\" and password like \"" + req.body.password + "\"";

                pool.query(query, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else{
                        curr = rows[0].iduser;
                        res.send(rows[0]);
                    }

                });
            }
        });
    }
}

module.exports.login = async function (req, res, next) {
    let { error } = shema.validate({name: req.params.name, password: req.params.pass});
    if (error){
        console.log(error.details[0].message);
        res.status(400).send("Neispravni podaci!");
    }
    else {
        try {
            let query = "select * from user where name like \"" + req.params.name + "\" and password like \"" + req.params.pass + "\"";
            await pool.query(query, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else{
                    curr = rows[0].iduser;
                    res.send(rows[0]);
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports.logout = async function (req, res, next) {
    curr = -1;
}

module.exports.load = async function (req, res, next) {
    try {
        let query = "select * from user where iduser=" + curr;
        await pool.query(query, (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else{
                res.send(rows[0]);
            }
        });
    }
    catch (err) {
        next(err);
    }
}