const User = require('../models/user');
const VerificationToken = require('../models/verificationtoken');
const {
    JWT_SECRET,
    EMAIL_USER,
    EMAIL_PASSWORD
} = require('../configs/config');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const crypto = require('crypto')
const nodemailer = require('nodemailer');

signToken = (user) => {
    return JWT.sign({
        iss: 'ashwani',
        sub: user.id, //here id and _id both are same(mongodb generated id)
        iat: new Date().getTime(), //current time
        exp: new Date().setDate(new Date().getDate() + 30) //current time +30 day ahead
    }, JWT_SECRET)
}

sendMail = async (email, token, host) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    });
    let mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Celesta, Activate your account',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttps:\/\/' + host + '\/users\/verify\/' + token + '\n'
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
}

sendPwdResetMail = async (email, code) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    });
    let mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Celesta, Password Reset Mail',
        text: `Your password reset code is ${code}`
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {

    //signup api (access: all)
    signUp: async (req, res, next) => {
        const rawUser = req.value.body;

        const foundUser = await User.findOne({
            email: rawUser.email
        })
        if (foundUser) {
            return res.status(403).send({
                message: "Email is already registered with us."
            });
        }

        const newUser = new User(req.value.body);
        await newUser.save();

        var newToken = new VerificationToken({
            userId: newUser._id,
        });
        await newToken.save();

        let mailresponse = await sendMail(newUser.email, newToken._id, req.headers.host);

        if (mailresponse === true) {            
            res.status(200).send(newUser)
        } else {
            res.status(500).send({message: "Mail send failed!"})
        }

    },

    //signin api (access: all)
    signIn: async (req, res, next) => {
        //generate token
        const user = req.user;
        const token = signToken(user);

        res.status(200).send({
            token: token,
            user: user
        });
    },

    activateUser: async (req, res, next) => {
        
        const foundToken = await VerificationToken.findById(req.params.token)

        if (foundToken) {

            const foundUser = await User.findById(foundToken.userId);

            if (foundUser) {

                if (foundUser.isVerified) return res.status(400).send({ message: 'This user has already been verified.' });

                User.findByIdAndUpdate(foundUser._id, {isVerified: true}, {new: true}).then((updatedUser) => {
                    res.status(200).send("The account has been verified. Please log in.");
                });


                // await foundUser.save();
                // res.status(200).send("The account has been verified. Please log in.");

            } else {
                return res.status(400).send({ message: 'We were unable to find a user for this token.' });
            }

        } else {
            return res.status(400).send({ message: 'We were unable to find a valid token. Your token my have expired.' });
        }

    },

    forgotPwd: async (req, res, next) => {
        const {
            email
        } = req.body;
        const user = await User.findOne({
            email
        });
        if (user) {
            let code = Math.floor(100000 + Math.random() * 900000);
            if (user.active === 0) {
                code = user.code;
            }
            let mailresponse = await sendPwdResetMail(email, code);
            if (mailresponse === true) {
                // update user code
                await User.findByIdAndUpdate({
                    _id: user._id
                }, {
                    code: code
                });
                res.status(200).json({
                    message: "Password reset code is sent to your webmail account"
                })
            } else {
                res.status(504).json({
                    message: "Could not send password reset code to your webmail account"
                })
            }
        } else {
            res.status(404).json({
                "message": "No user found for this webmail"
            });
        }
    },

    resetPwd: async (req, res, next) => {
        let {
            email,
            code,
            password,
            confirmPassword
        } = req.body;

        if (code == 0) {
            return res.status(407).json({
                "message": "Invalid reset password code"
            });
        }

        const user = await User.findOne({
            email
        });
        if (user) {
            if (user.code !== code) {
                return res.status(401).json({
                    "message": "Incorrect reset password code"
                });
            }
            if (password !== confirmPassword) {
                return res.status(403).json({
                    "message": "Passwords do not match"
                });
            }
            let pwd = password;
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(pwd, salt);
            password = passwordHash;

            User.findByIdAndUpdate({
                _id: user._id
            }, {
                password,
                code: 0
            }, {
                new: true
            }).then((updatedUser) => {
                res.status(200).json({
                    "message": "Password reset successful. You can now login with your new password"
                });
            });

        } else {
            res.status(404).json({
                "message": "No user found for this webmail"
            });
        }
    },

    // //get all user api (access: auth users)
    // getAllUsers: async(req,res,next)=>{
    //     const users=await User.find({})
    //     if(users){
    //         res.status(200).json({
    //             users: users
    //         })
    //     } else {
    //         res.status(404).json({
    //             message: "No users found"
    //         })
    //     }
    // },


    //get particular user api (access: auth users)
    getUser: async (req, res, next) => {
        const userId = req.params.userId;

        const user = await User.findOne({
            _id: userId
        })
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(404).send({
                message: "User not found"
            })
        }
    },

}