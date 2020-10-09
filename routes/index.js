//const express = require('express');
import express from "express";
const router = express.Router();
const mysql = require("mysql");   // mysql 모듈 require
const models = require('../models');

let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");

//로그인
router.get("/login", function(req,res,next){
    // default : HMAC SHA256
    let token = jwt.sign({
            email: "foo@example.com"   // 토큰의 내용(payload)
        },
        secretObj.secret ,    // 비밀 키
        {
            expiresIn: '5m'    // 유효 시간은 5분
        })

    models.user.find({
        where: {
            email: "foo@example.com"
        }
    })
        .then( user => {
            if(user.pwd === "1234"){
                res.cookie("user", token);
                res.json({
                    token: token
                })
            }
        })
})

//사용자 확인
router.get("/someAPI", function(req, res, next){
    let token = req.cookies.user;

    let decoded = jwt.verify(token, secretObj.secret);
    if(decoded){
        res.send("권한이 있어서 API 수행 가능")
    }
    else{
        res.send("권한이 없습니다.")
    }
})

module.exports = router;

//게시글 목록
router.get('/board', async function(req, res, next) {
    let result = await models.post.findAll();
    if (result){
        for(let post of result){
            let result2 = await models.post.findOne({
                include: {
                    model: models.reply,
                    where: {
                        postId: post.id
                    }
                }
            })
            if(result2){
                post.replies = result2.replies
            }
        }
    }
    res.render("show", {
        posts : result
    });
});

//게시글 등록
router.post('/board', function(req, res, next) {
  let body = req.body;

  models.post.create({
    title: body.inputTitle,
    writer: body.inputWriter
  })
      .then( result => {
        console.log("데이터 추가 완료");
        res.redirect("/board");
      })
      .catch( err => {
        console.log("데이터 추가 실패");
      })
});

//게시글 조회
router.get('/board/:id', function(req, res, next) {
    let postID = req.params.id;

    models.post.findOne({
        where: {id: postID}
    })
        .then( result => {
            res.render("edit", {
                post: result
            });
        })
        .catch( err => {
            console.log("데이터 조회 실패");
        });
});

//게시글 수정
router.put('/board/:id', function(req, res, next) {
    let  postID = req.params.id;
    let body = req.body;

    models.post.update({
        title: body.editTitle,
        writer: body.editWriter
    },{
        where: {id: postID}
    })
        .then( result => {
            console.log("데이터 수정 완료");
            res.redirect("/board");
        })
        .catch( err => {
            console.log("데이터 수정 실패");
        });
});

//게시글 삭제
router.delete('/board/:id', function(req, res, next) {
    let postID = req.params.id;

    models.post.destroy({
        where: {id: postID}
    })
        .then( result => {
            res.redirect("/board")
        })
        .catch( err => {
            console.log("데이터 삭제 실패");
        });
});

// 댓글 등록
router.post("/reply/:postID", function(req, res, next){
    let postID = req.params.postID;
    let body = req.body;

    models.reply.create({
        postId: postID,
        writer: body.replyWriter,
        content: body.replyContent
    })
        .then( results => {
            res.redirect("/board");
        })
        .catch( err => {
            console.log(err);
        });
});


// router.get('/edit/:id', function(req, res, next) {
//   let postID = req.params.id;
//
//   models.post.findOne({
//     where: {id: postID}
//   })
//       .then( result => {
//         res.render("edit", {
//           post: result
//         });
//       })
//       .catch( err => {
//         console.log("데이터 조회 실패");
//       });
// });


// 커넥션 연결
let client = mysql.createConnection({
  user: "root",
  password: "0000",
  database: "mysqltest"
})

module.exports = router;

router.get('/create', function(req, res, next) {
  client.query("SELECT * FROM products;", function(err, result, fields){
    if(err){
      console.log(err);
      console.log("쿼리문에 오류가 있습니다.");
    }
    else{
      res.render('create', {
        results: result
      });
    }
  });
});

router.post('/create', function(req, res, next) {
  var body = req.body;

  client.query("INSERT INTO products (name, modelnumber, series) VALUES (?, ?, ?)", [
    body.name, body.modelnumber, body.series
  ], function(){
    res.redirect("/create");
  });
});

module.exports = router;