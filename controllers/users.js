const JWT=require('jsonwebtoken');
const User=require('../models/user');
const {JWT_SECRET, EMAIL_USER, EMAIL_PASSWORD}=require('../configs/config');
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');

signToken=(user)=>{
    return JWT.sign({
        iss: 'ashwani',
        sub: user.id, //here id and _id both are same(mongodb generated id)
        iat: new Date().getTime(), //current time
        exp: new Date().setDate(new Date().getDate()+30) //current time +30 day ahead
    },JWT_SECRET)
}

sendMail = async (email, code) => {
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
        text: `Your activation OTP is ${code}`
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

module.exports={

    //signup api (access: all)
    signUp: async(req,res,next)=>{
        const {email,password,name}=req.value.body;

        req.value.body.instituteId = req.value.body.instituteId.trim();

        const foundUser=await User.findOne({email: email})
        if(foundUser){
            return res.status(403).json({message: "Email is already registered"});
        }
        
        //initially setting isSuperUserProperty to false(this can be set true from database only)
        req.value.body.isSuperUser=false;

        //initially setting por to empty array (this can be set by admin only)
        req.value.body.por=[];

        let code = Math.floor(100000 + Math.random() * 900000);
        req.value.body.code=code;
        let mailresponse = await sendMail(email, code);
        if(mailresponse === true) {

            //create a new user
            const newUser=new User(req.value.body);
            await newUser.save();
            const token=signToken(newUser);
            res.status(200).json({
                token: token,
                user: newUser
            })
        } else {
            res.status(500).json({
                message: "Could not register your account"
            })
        }

    },

    //signin api (access: all)
    signIn: async(req,res,next)=>{
        //generate token
        const user=req.user;
        const token=signToken(user);

        res.status(200).json({
            token: token,
            user: user
        });
    },

    activateUser: async(req,res,next)=>{
        const { email, code } = req.body;
        const user = await User.findOne({email: email});
        if (user) {
            if (user.active === 1) {
                res.status(408).json({
                    "message": "User already activated"
                 });
            } else {
                if (user.code === code) {
                    User.findByIdAndUpdate({_id: user._id},{active: 1, code: null},{new:true}).then((updatedUser)=>{
                        const token=signToken(updatedUser);
                        res.status(200).json({
                            token: token,
                            user: updatedUser
                        });
                    });
                } else {
                    res.status(409).json({
                        "message": "Invalid activation code"
                     });
                }
            }
        } else {
            res.status(404).json({
                "message": "User not registered"
             });
        }
    },

    forgotPwd: async(req,res,next)=>{
        const { email } = req.body;
        const user = await User.findOne({email});
        if (user) {
            let code = Math.floor(100000 + Math.random() * 900000);
            if(user.active === 0) {
                code = user.code;
            }
            let mailresponse = await sendPwdResetMail(email, code);
            if(mailresponse === true) {
                // update user code
                await User.findByIdAndUpdate({_id: user._id},{code: code});
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

    resetPwd: async(req,res,next)=>{
        let { email, code, password, confirmPassword } = req.body;

        if (code == 0) {
            return res.status(407).json({
                "message": "Invalid reset password code"
            });
        }

        const user = await User.findOne({email});
        if(user) {
            if(user.code !== code) {
                return res.status(401).json({
                    "message": "Incorrect reset password code"
                });
            }
            if(password !== confirmPassword){
                return res.status(403).json({
                    "message": "Passwords do not match"
                });
            }
            let pwd=password;
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(pwd, salt);
            password = passwordHash;

            User.findByIdAndUpdate({_id: user._id},{password, code: 0},{new:true}).then((updatedUser)=>{
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
    getUser: async(req,res,next)=>{
        const userId = req.params.userId;

        const user=await User.findOne({_id: userId}).populate('pors');
        if(user){
            res.status(200).json({
                user: user
            })
        } else {
            res.status(404).json({
                message: "User not found"   
            })
        }
    },

    //patch particular user api (access: same user && superUser)
    patchUser: async(req,res,next)=>{
        const userId = req.params.userId;

        if (userId==req.user.id && !req.user.isSuperUser) {
            if(req.value.body.password!=undefined) {
                const pwd=req.value.body.password;
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(pwd, salt);
                req.value.body.password = passwordHash;
            }
            
            //setting isSuperUser value to false if user is not admin
            if(!req.user.isSuperUser) {
                req.value.body.isSuperUser=false;
            }
            req.value.body.isSuperUser=false;

            const user=await User.findOne({_id: userId});
            if(user){
                //restricting user to add pors if he/she is not superUser while updating his profile
                if(user.por.length==0) {
                    req.value.body.por=[];
                }
                User.findByIdAndUpdate({_id: userId},req.value.body,{new:true}).then((updatedUser)=>{
                    res.status(200).json({
                        user: updatedUser
                    });
                });
            } else {
                res.status(404).json({
                    message: "User not found"
                })
            }
        } else if(userId!=req.user.id && req.user.isSuperUser) {
            var updateData={};
            if(req.value.body.por!=undefined) {
                updateData.por=req.value.body.por;
            }
            if(req.value.body.isSuperUser!=undefined) {
                updateData.isSuperUser=req.value.body.isSuperUser;
            }

            const user=await User.findOne({_id: userId});
            if(user){
                User.findByIdAndUpdate({_id: userId}, updateData, {new:true}).then((updatedUser)=>{
                    res.status(200).json({
                        user: updatedUser
                    });
                });
            } else {
                res.status(404).json({
                    message: "User not found"
                })
            }
        } else if(userId==req.user.id && req.user.isSuperUser) {
            const user=await User.findOne({_id: userId});
            if(user){
                User.findByIdAndUpdate({_id: userId}, req.value.body, {new:true}).then((updatedUser)=>{
                    res.status(200).json({
                        user: updatedUser
                    });
                });
            } else {
                res.status(404).json({
                    message: "User not found"
                })
            }
        } else {
            res.status(401).json({
                message: "Unauthorized request"
            })
        }

        
    },
    

}