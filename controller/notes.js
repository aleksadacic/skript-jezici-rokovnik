const pool = require("../database");
const mysql = require('mysql');
const shema = require('../model/notes');

let curr = -1;
let prev = -1;

module.exports.showNotes = async function(req, res, next){
    try{
        console.log("curr: "+ curr + ", prev: " + prev + ", req: " + req.params.id);
        if (curr > -1 && prev === curr && (parseInt(req.params.id) === -1 || parseInt(req.params.id) === curr)) {
            await pool.query('select * from notes where iduser = ' + curr + ' order by date desc', (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(rows);
            });
        }else {
            console.log("fethchy: " + req.params.id);
            await pool.query('select * from notes where iduser = ' + req.params.id + ' order by date desc', (err, rows) => {
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

module.exports.newNote = async function(req, res, next) {
    let { error } = shema.validate(req.body);
    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "insert into notes (date, text, iduser) values (?, ?, ?)"
        let date = new Date();
        let datum = date.toISOString().slice(0, 19).replace('T', ' ');
        let formated = mysql.format(query,[datum, req.body.text, req.body.iduser]);
        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from notes where iduser = ' + req.body.iduser + ' order by date desc';

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

module.exports.deleteNote = async function(req, res, next) {
    if (req.body.iduser === -1)
        return;
    try{
        await pool.query('delete from notes where idnotes =' + req.body.idnotes, (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from notes where iduser = ' + req.body.iduser + ' order by date desc';
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

module.exports.updateNote = async function (req, res, next) {
    let date = new Date();
    let vals = {iduser: req.body.iduser, text: req.body.text, date: date};
    let { error } = shema.validate(vals);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try{
        let datum = date.toISOString().slice(0, 19).replace('T', ' ');
        await pool.query('UPDATE notes SET text = \"' + req.body.text + '\", date = \"' + datum + '\" WHERE idnotes=' + req.body.idnotes, (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else{
                let query = 'select * from notes where iduser = ' + req.body.iduser + ' order by date desc';
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