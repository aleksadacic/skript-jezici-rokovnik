const pool = require("../database");
const mysql = require('mysql');
const shema = require('../model/user');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('../config');
const saltRound = 10;


let curr = -1;
//token

module.exports.newSignature = async function(req, res, next) {
    let { error } = shema.validate(req.body);
    if (error){
        console.log(error.details[0].message);
        res.status(400).send("Neispravni podaci!");
    }
    else {
        bcrypt.hash(req.body.password, saltRound, function (_err, hash) {
            console.log(hash);
            // u mysql tabeli sam stavio id PK auto increment zato ne mora da se prosledjuje id
            let query = "insert into auth_user (username,password) values (?,?)";
            let formated = mysql.format(query, [req.body.name, hash]);
            pool.query(formated, (err, _response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    let query = "select * from auth_user where username like \"" + req.body.name + "\"";
                    pool.query(query, (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else {
                            bcrypt.compare(req.params.pass, rows[0].password, function(err, _res) {
                                if(_res) {
                                    // Passwords match
                                    console.log(rows[0]);
                                    curr = rows[0].id;
                                    let token = jwt.sign({id: rows[0].id}, config.secret, {
                                        expiresIn: 86400
                                    })
                                    res.cookie("jwt", token, {secure: true, httpOnly: true})
                                    res.send({jsonData: rows[0]});
                                } else {
                                 // Passwords don't match
                                    curr = -1;
                                } 
                            });
                        }

                    });
                }
            });
        });
    }
}

module.exports.login = async function (req, res, next) {
    let { error } = shema.validate({name: req.body.name, password: req.body.password});
    if (error){
        console.log(error.details[0].message);
        res.status(400).send("Neispravni podaci!");
    }
    else {
        try {
            let query = "select * from auth_user where username like \"" + req.body.name + "\"";
            pool.query(query, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    bcrypt.compare(req.body.password, rows[0].password, function(err, _res) {
                        if(_res) {
                            // Passwords match
                            let token = jwt.sign({id: rows[0].id}, config.secret, {
                                expiresIn: 86400
                            })
                            console.log(token);
                            res.cookie("jwt", token, {secure: true, httpOnly: true})
                            res.send({jsonData: rows[0]});
                        } else {
                         // Passwords don't match
                            curr = -1;
                            res.status(500).send("Wrong password!"); //redirect na login opet
                        } 
                    });
                }
            });
        } catch (err) {
            next(err);
        }

    }
}

module.exports.logout = async function (req, res, next) {
    res.status(200).send({ auth: false, token: null });
}

module.exports.load = async function (req, res, next) {
    let token = req.cookies['jwt'];
    console.log("load: " + token)
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        try {
            console.log(decoded['id']);
            let query = "select * from auth_user where id = " + decoded['id'];
            pool.query(query, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else{
                    res.send({jsonData: rows[0], auth:true, token: token});
                }
            });
        }
        catch (err) {
            next(err);
        }
    });
}