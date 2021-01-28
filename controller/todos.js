const pool = require("../database");
const mysql = require('mysql');
const shema = require('../model/todos');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports.showTodos = async function(req, res, next){
    try{
        let token = req.cookies['jwt'];
        console.log("showtodos: " + token);
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            pool.query('select * from todos_todos where user_id = ' + decoded.id, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send({jsonData: rows});
            });
        });
    }
    catch(err){
        next(err);
    }
}

module.exports.newTodo = async function (req, res, next) {
    let date = new Date();
    let time = req.body.h + ":" + req.body.m + ":00";
    let values = {text: req.body.text, date: date, time: time, iduser: req.body.iduser, done: false }
    let { error } = shema.validate(values);
    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            let query = "insert into todos_todos (text, user_id, time) values (?, ?, ?)"
            let datum = date.toISOString().slice(0, 19).replace('T', ' ');
            let formated = mysql.format(query,[req.body.text, decoded.id, time]);
            pool.query(formated, (err, response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from todos_todos where user_id=' + decoded.id;

                    pool.query(query, (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else
                            res.send({jsonData: rows});

                    });
                }
            });
    });
    }
}

module.exports.deleteTodo = async function(req, res, next) {
    try{
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            pool.query('delete from todos_todos where id=' + req.body.idtodos, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from todos_todos where user_id=' + decoded.id;
                    pool.query(query, (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else
                            res.send({jsonData: rows});
                    });
                }
            });
    });
    }
    catch(err){
        next(err);
    }
}

module.exports.updateTodo = async function(req, res, next) {
    console.log("uptodo: " + req.body.done + ", " + req.body.idtodos);
    try{
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            pool.query('UPDATE todos_todos SET done = ' + req.body.done +' WHERE id=' + req.body.idtodos, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send({jsonData: rows});
        });
    });
    }
    catch(err){
        next(err);
    }
}