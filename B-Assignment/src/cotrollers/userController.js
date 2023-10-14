const userModel = require('../models/userModel');
const {hashPassword, comparePassword} = require('../helper/passHelper')
const jwt = require('jsonwebtoken')

const {isValidEmail, isValidPassword, isValidPhone} = require('../validations/validations')

const createUser = async (req, res) => {
    try {
        const data = req.body
//-------------------------------------------Checking the body data--------------------------------------//
        if(Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'Please enter data'})

        const {email, phone, password} = data
//-------------------------------------------Checking required fields---------------------------------------------//
        if(!email) return res.status(400).send({ status: false, message: 'email is required' });
        if(!phone) return res.status(400).send({ status: false, message: 'phone is required' });
        if(!password) return res.status(400).send({ status:false, message: 'password is required' });

//-------------------------------------------Validate the fields---------------------------------------------//
        if(!isValidEmail(email)) return res.status(400).send({ status:false, message: 'email is not valid' });
        if(!isValidPhone(phone)) return res.status(400).send({ status:false, message: 'phone is not valid'});
        if(!isValidPassword(password)) return res.status(400).send({ status:false, message: 'password is not valid'});  

//-------------------------------------------Checking uniqueness of the fields--------------------------------------//
        let checkEmail = await userModel.findOne({ email: email})
        if(checkEmail) return res.status(400).send({ status: false, message: 'email already exists' });

        let phoneNo = await userModel.findOne({ phone: phone})
        if(phoneNo) return res.status(400).send({ status: false, message: 'phone number already exists' });

//-------------------------------------------bcrypt the password--------------------------------------//
        const password1 = await hashPassword(password)

        const userData = await userModel({ email, phone, password: password1}).save()
        res.status(201).send({status: 'success', data: userData})
    } catch (error) {
        res.status(500).send({status: false, message: error.message})
    }
};


/******************************************************LoginUser************************************************************* */
     
const loginUser = async function (req, res) {
    try {
        const data = req.body
//-------------------------------------------Checking the body data--------------------------------------//
        if(Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'Please enter data'});

        const {email, phone, password} = data

//-------------------------------------------Checking required fields---------------------------------------------//        
        if(!email && !phone) return res.status(400).send({ status: false, message: 'email or phone is required' });
        if(!password) return res.status(400).send({ status: false, message: 'password is required' });

//-------------------------------------------Checking fields are exist or not---------------------------------------------// 
        if(email){  
            if(!isValidEmail(email)) return res.status(400).send({status: false, message: 'Invalid email'}); 
            let userEmail = await userModel.findOne({email: email});    
            if(!userEmail) return res.status(400).send({ status: false, message: 'email is not found' });
            
            let matchPassword = await comparePassword(password, userEmail.password)
            if(!matchPassword) return res.status(400).send({ status: false, message: 'password is not found' });

            let token = jwt.sign({userId: userEmail._id}, 'my-secret-key')
            res.status(200).send({ status: true, message: 'successfully login', data: token});  
        }
        if(phone){
            if(!isValidPhone(phone)) return res.status(400).send({ status: false, message: 'Invalid phone'})
            let userPhone = await userModel.findOne({ phone: phone });
            if(!userPhone) return res.status(400).send({ status: false, message: 'phone is not found' });
            
            let matchPassword = await comparePassword(password, userPhone.password)
            if(!matchPassword) return res.status(400).send({ status: false, message: 'password is not found' });

            let token = jwt.sign({userId: userPhone._id}, 'my-secret-key')
            res.status(200).send({ status: true, message: 'successfully login', data: token});             
        }  
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
};

const forgotPassword = async function(req, res) {
    try {
          const data = req.body
          
          if(Object.keys(data).length == 0) return res.status(400).send({status: false, message: 'Please enter data'})

          const {email, phone} = data

          if(!email && !phone) return res.status(400).send({status: false, message: 'email or phone is required'});

          if(email){
               if(!isValidEmail(email)) return res.status(400).send({status: false, message: 'email is not valid'});
               let userData = await userModel.findOneAndUpdate({email: email}, {$set: {password: ''}}, {new: true});
               if(!userData) return res.status(400).send({status: false, message: ' email is not found'});
               return res.status(200).send({status: false, message: "success", data: userData});
          }

          if(phone){
            if(!isValidPhone(phone)) return res.status(400).send({status: false, message: 'phone is not valid'});
            let userData = await userModel.findOneAndUpdate({phone: phone}, {$set: {password: ''}}, {new: true});
            if(!userData) return res.status(400).send({status: false, message: ' phone is not found'});
            return res.status(200).send({status: false, message: "success", data: userData});
       }
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}

const resetPassword = async function (req, res) {
      try {
            const data = req.body
            if(Object.keys(data).length == 0 ) return res.status(400).send({status: false, message: 'please enter data'});

            let newPassword = data.password
            if(!newPassword) return res.status(400).send({status: false, message: 'please enter a new password'});
            if(!isValidPassword(newPassword)) return res.status(400).send({status: false, message: 'password is not valid'});
            
            let newHashPassword = await hashPassword(newPassword);
            let newData = await userModel.findOneAndUpdate({password: ''},{$set: {password: newHashPassword}}, {new: true})
            res.status(200).send({status:true, message: 'password updated successfully', data: newData});
      } catch (error) {
        return res.status(500).send({status: false, message: error.message});
      }
}

module.exports = {createUser, loginUser, forgotPassword, resetPassword}