const pool = require("../database");
const mysql = require('mysql');
const shema = require('../model/notes');
const jwt = require('jsonwebtoken');
const config = require('../config');


module.exports.showNotes = async function(req, res, next){
    let token = req.cookies['jwt'];
    console.log("shownotes: " + token);
    jwt.verify(token, config.secret, function(_err, decoded) {
        if (_err) return res.status(401).send({message: 'Unauthorized!'});
        let user = decoded.id;
        try{
            pool.query('select * from notes_notes where user_id = ' + user + ' order by date desc', (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send({jsonData: rows});
            });
        }
        catch(err){
            next(err);
        }
    });
}


module.exports.newNote = async function(req, res, next) {
    let { error } = shema.validate(req.body);
    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            let query = "insert into notes_notes (date, text, user_id) values (?, ?, ?)"
            let date = new Date();
            let datum = date.toISOString().slice(0, 19).replace('T', ' ');
            let formated = mysql.format(query,[datum, req.body.text, decoded.id]);
            pool.query(formated, (err, response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from notes_notes where user_id = ' + decoded.id + ' order by date desc';

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

module.exports.deleteNote = async function(req, res, next) {
    try{
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            pool.query('delete from notes_notes where id =' + req.body.idnotes + ' and user_id = ' + decoded.id, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from notes_notes where user_id = ' + decoded.id + ' order by date desc';
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

module.exports.updateNote = async function (req, res, next) {
    let date = new Date();
    let vals = {iduser: req.body.iduser, text: req.body.text, date: date};
    let { error } = shema.validate(vals);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try{
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            let datum = date.toISOString().slice(0, 19).replace('T', ' ');
            pool.query('UPDATE notes_notes SET text = \"' + req.body.text + '\", date = \"' + datum + '\" WHERE id =' + req.body.idnotes, (err, rows) => {
                if (err){
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    let query = 'select * from notes_notes where user_id = ' + decoded.id + ' order by date desc';
                    pool.query(query, (_err, rows) => {
                        if (_err){
                            res.status(500).send(_err.sqlMessage);
                        }
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