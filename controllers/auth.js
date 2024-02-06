const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const temporaryData = [
    {
        name: "Nirmal",
        email: "nirmal@gmail.com", 
        password: "rameshsuresh",
    },
    {
        name: "Ayush",
        email: "ayush@gmail.com", 
        password: "rameshsuresh",
    },
    {
        name: "Rahul",
        email: "rahul@gmail.com", 
        password: "rameshsuresh",
    }, 
];

exports.signUp = (req, res)=>{

    const {name, email, password} = req.body;   //Destructuring

    //Check if the user already exists
    const isValid = temporaryData.findIndex((ele) => (ele.email === email ));

    if(isValid !== -1){
        res.status(400).json({
            error: "User already exists.",
        });
    }

    //Generate token
    const token = jwt.sign({
        email: email,
    }, process.env.SECRET_KEY
    );

    console.log(token);

    //Hash Password
    bcrypt.hash(password, 10, (err, hash)=>{
        if(err){
            res.status(500).json({
                error: "Internal Server Error."
            })
        }

        const user = {
            name,
            email,
            password: hash,
        }
        temporaryData.push(user);
        console.log(temporaryData);

        // res.send("Token generated");
        //Send response to user along with token
        res.status(200).json({
            message: "User Added Successfully to database",
            token: token,
        })
    });
};

exports.signIn = (req, res)=>{
    
};