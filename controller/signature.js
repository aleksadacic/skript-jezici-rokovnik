const pool = require("../database");
const mysql = require('mysql');
const shema = require('../model/user');

module.exports.showSignature = async function(req, res, next){
    try{
        await pool.query('select * from user', (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else
                res.send(rows);
        });
    }
    catch(err){
        next(err);
    }
}

module.exports.newSignature = async function(req, res, next) {
    let { error } = shema.validate(req.body);
    if (error)
        res.status(400).send(error.details[0].message);
    else {
        // u mysql tabeli sam stavio id PK auto increment zato ne mora da se prosledjuje id
        let query = "insert into user ( username) values (?)"
        let formated = mysql.format(query, [ req.body.username]);
        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from user';

                pool.query(query, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows);

                });
            }
        });
    }
}