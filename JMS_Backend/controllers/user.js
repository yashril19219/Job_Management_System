
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {hashPassword, comparePasswords} = require('./passHash');
const userModel = require('../models/user');
const { json } = require('body-parser');
const { set } = require('mongoose');
require('dotenv').config({path : "../config/.env"});
const {getFromCatch,deleteKey, saveInCatch} = require('../connections/redis');
const {sendMessage} = require("./rabbitmq");
//checking if email is valid using regex matching,
//source : stackoverflow,  https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};


//validating details that are entered, email should be valid, all fields must be field, password length and all
const validateDetails = async (username, email, password, ) =>{

    //checking empty fields
    if(!username || !email || !password){
        return {success: false, message : "Please enter all the fields"};
    }
    
    //email validation
    if(!(await validateEmail(email))){
        return  {success: false,message : "Enter Valid Email Address"};
    }
    //password length should be atleast 6, we can add more password filters validations,
    if(password.length<6){
        return {success: false,message : "Password length should be atleast 6"};
    }

    //if all are valid then we can return success message, 
    return {success : true, message : "Validation passed"};

}


//this function saves the user, by first hashing the password and then saving it into the database
const saveUser = async (username, email, password) =>{
    try {
        //hashing password
        const hashedPassword = await hashPassword(password);

        //making object of the model and then saving it
        await userModel({
            username : username,
            email : email,
            password: hashedPassword
            
        }).save();

        //returning if we have successfully saved the models
        return {success : true, message : "User added to the database"};
    } catch (error) {
        //if we encounter some problem we can return error.
        return {success : false, message : error};
    }
}



const register = async (req,res)=>{

    //getting data from the request body
    const {username,email, password} = req.body;

    try {

        //checking if the entered details are valid or not 
        const valid = await validateDetails(username,email,password);    

        //if they are invalid i.e, success us false we will be returning bad request error
        if(!valid.success){
            return res.status(400).json({success:  false, message : valid.message});
        }
        
        //now checking if the entered email is already in order database of not, 
        const doesExistEmail = await userModel.findOne({email : email});

        //if we have somedata in doesExistEmail then we can say that email already in use,
        if(doesExistEmail){
            return res.status(400).json({message : "Email Address already in use"});
        }
        //if all the validation are true, then we can save our user to the dataabse;

    
        await saveUser(username, email,password);
        deleteKey('users');
        const message={
            emails:[email],
            content:{
                message: `You have successfully register to job management system with username ${username}`
            }
        }

        await sendMessage(message,'Register');


        //returning 201 status code as user is created
        return res.status(201).send({success : true , message : "User registered successfully"});
    } catch (error) {
        //return 400 as if it will give use error, 
        return res.status(400).send({success : false, message : "User not registered",error : error});
    }
}



const login = async (req,res)=>{

    const {email, password} = req.body;

    try {
        
        const valid = await validateDetails("login", email , password);
        if(!valid.success){
            return res.status(400).json({success:  false, message : valid.message});
        }

        //now checking if the entered email is already in order database of not, 
        const doesExistEmail = await userModel.findOne({email : email});

        //if we have somedata in doesExistEmail then we can say that email already in use,
        if(!doesExistEmail){
            return res.status(400).json({message : "Email Address not registered"});
        }

        //maching passwored with database hashed password
        const passwordMatching = comparePasswords(password,doesExistEmail.password);

        //if password does not matches, we can return failed message
        if (!passwordMatching){
            return res.status(400).send({success : false, message : "Incorrect password"})
        }

        //creating dummy object, to make token
        const dummy = {
            userID : doesExistEmail._id,
            username : doesExistEmail.username,
            email : doesExistEmail.email,
            role : doesExistEmail.role
        }
        //creating token using jwt
        const token =  await jwt.sign(dummy, process.env.JWT_SECRET_TOKEN,{ expiresIn: '1h' });
        //storing the token in cookies
        res.cookie('jwt', token, { httpOnly: true });

        //return user logged in message
        return res.status(200).json({token, message :`login successfully as ${doesExistEmail.username}`});

    } catch (error) {
        //return bad request and, login failed message
        return res.status(400).send({success : false, message : "User login failed",error : error});
    }
}

const getUsers  = async(req,res)=>{
    
    try {
        const cacheData = await getFromCatch('users');

        if(cacheData.status=='CACHE HIT'){
            return res.status(200).send(cacheData.data);
        }
        const data = await userModel.find();
        saveInCatch('users',data);
        return res.status(200).send(data);

    } catch (error) {
        return res.status(400).send({success : false, message : "Cannot fetch users",error : error});
    }
}

const getUser = async (req,res) =>{
    const id = req.params.id;
    try {
        const cacheData = await getFromCatch('user'+id);
        if(cacheData.status=='CACHE HIT'){
            return res.status(200).send(cacheData.data);
        }
        const data = await userModel.findOne({_id: id});
        saveInCatch('user'+id,data);
        return res.status(200).send(data);
    } catch (error) {
        return res.status(400).send({success : false, message : `Could not get user with id ${id}`, error : error});
    }
}

const changeRole = async (req,res)=>{
    const {newRole} = req.body;
    const id = req.params.id;
    try {
        await userModel.updateOne({_id:id}, {$set : {role : newRole}});
        deleteKey('user'+id);
        deleteKey('users');
        return res.status(200).send({success : true, message : `successfully changed user role with user id : ${id} to ${newRole}`})
    } catch (error) {
        return res.status(400).send({success : false, message : `Could not change role of user with id ${id}`, error : error});
    }
}


module.exports = {login, register,getUsers,getUser,changeRole};

