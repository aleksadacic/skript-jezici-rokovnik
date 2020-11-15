const pool = require("../database");
const mysql = require('mysql');
const shema = require('../model/todos');

let curr = -1;
let prev = -1;

module.exports.showTodos = async function(req, res, next){
    try{
        if (curr > -1 && prev === curr && (parseInt(req.params.id) === -1 || parseInt(req.params.id) === curr)) {
            await pool.query('select * from todos where iduser = ' + curr + ' and date >= cast((now()) as date) and date < cast((now() + interval 1 day) as date) order by date desc', (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(rows);
            });
        }else {
            await pool.query('select * from todos where iduser = ' + req.params.id + '  and date >= cast((now()) as date) and date < cast((now() + interval 1 day) as date) order by date desc', (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    curr = req.params.id;
                    if (prev !== curr)
                        prev = curr;
                    res.send(rows);
                }
            });
        }
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
        let query = "insert into todos (date, text, iduser, time, done) values (?, ?, ?, ?, ?)"
        let datum = date.toISOString().slice(0, 19).replace('T', ' ');
        let formated = mysql.format(query,[datum, req.body.text, req.body.iduser, time, 0]);
        await pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from todos where iduser=' + req.body.iduser +' and date >= cast((now()) as date) and date < cast((now() + interval 1 day) as date) order by date desc';

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

module.exports.deleteTodo = async function(req, res, next) {
    if (req.body.iduser === -1)
        return;
    try{
        await pool.query('delete from todos where idtodos=' + req.body.idtodos, (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from todos where iduser=' + req.body.iduser + ' and date >= cast((now()) as date) and date < cast((now() + interval 1 day) as date) order by date desc';
                pool.query(query, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows);
                });
            }
        });
    }
    catch(err){
        next(err);
    }
}

module.exports.updateTodo = async function(req, res, next) {
    console.log("uptodo: " + req.body.done + ", " + req.body.idtodos);
    let vals = {iduser: req.body.iduser, text: req.body.text, done: req.body.done};
    let { error } = shema.validate(vals);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try{
        await pool.query('UPDATE todos SET done = ' + req.body.done +' WHERE idtodos=' + req.body.idtodos, (err, rows) => {
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