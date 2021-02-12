const { query } = require('express');
const express = require('express');
const { checkUser } = require('../middleware/authMiddleware');
const app = express();
const userRoute = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');


let User = require('../models/user');




// Update user
userRoute.route('/userinfo/').put((req, res, next) => {
    const token = req.cookies.jwt;
    jwt.verify(token, config.accessTokenSecret, async (err, decodedToken) => {
        if (err) {
            res.locals.user = null;
            res.cookie('jwt', '', { maxAge: 1 });
            next();
        } else {

            User.findByIdAndUpdate(decodedToken.id, {
                $set: req.body
            }, { new: true }, (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    res.json(data)
                    console.log('Data updated successfully')
                }
            }).where("deletedAt", { $eq: null }).select("-deletedAt").populate({ path: "friends", match: { 'deleted_at': null } });
        }
    });

})


userRoute.route('/friend/').put((req, res, next) => {
    const token = req.cookies.jwt;
    jwt.verify(token, config.accessTokenSecret, async (err, decodedToken) => {
        if (err) {
            res.locals.user = null;
            res.cookie('jwt', '', { maxAge: 1 });
            next();
        } else {
            let em = req.body.email;
            let op = req.body.op;
            if (op === "add") {

                User.findOne({ email: em }, function (err, result) {
                    if (err) {
                        res.status(404).json({ errors: [{ msg: err.message }] });
                    }
                    else if (!result) {
                        res.status(404).json({ errors: [{ msg: "friend does not exist" }] });
                    } else {
                        if (decodedToken.id != result._id) {

                            console.log(decodedToken.id)
                            console.log(result._id)

                            User.findByIdAndUpdate(decodedToken.id, {
                                $addToSet: { friends: result._id }
                            }, { new: true }, (error, data) => {
                                if (error) {
                                    return next(error);

                                } else {
                                    res.json(data)
                                    console.log('friend added successfully')
                                }
                            }).where("deletedAt", { $eq: null }).select("-deletedAt").populate({ path: "friends", match: { 'deleted_at': null } });
                        }
                        else {
                            res.status(404).json({ errors: [{ msg: "cannot add your own email as friend" }] });
                        }
                    }
                });


            } else if (op === "delete") {
                User.findOne({ email: em }, function (err, result) {
                    if (err) {
                        res.status(404).json({ errors: [{ msg: "friend does not exist" }] });
                    }
                    else if (!result) {
                        res.status(404).json({ errors: [{ msg: "friend does not exist" }] });
                    } else {

                        User.findByIdAndUpdate(decodedToken.id, {
                            $pull: { friends: result._id }
                        }, { new: true }, (error, data) => {
                            if (error) {
                                return next(error);

                            } else {
                                res.json(data)
                                console.log('friend removed successfully')
                            }
                        }).where("deletedAt", { $eq: null }).select("-deletedAt").populate({ path: "friends", match: { 'deleted_at': null } });
                    }
                });


            } else {
                res.status(404).json({ errors: [{ msg: "operation denied" }] });
            }



        }

    });





})



module.exports = userRoute;