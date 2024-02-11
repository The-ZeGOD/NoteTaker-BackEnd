const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/database");

// const temporaryData = [
//     {
//         name: "Nirmal",
//         email: "nirmal@gmail.com", 
//         password: "rameshsuresh",
//     },
//     {
//         name: "Ayush",
//         email: "ayush@gmail.com", 
//         password: "rameshsuresh",
//     },
//     {
//         name: "Rahul",
//         email: "rahul@gmail.com", 
//         password: "rameshsuresh",
//     }, 
// ];

exports.signUp = (req, res) => {
    //EXTRACTING DATA SENT BY USER
    const { name, email, password } = req.body;
    //const isValid = temporaryData.findIndex((ele) => ele.email === email);
  
    //CHECKING IF THE EMAIL ALREADY EXISTS IN THE DATABASE
    client
        .query(`SELECT * FROM users WHERE email = '${email}';`)
        .then((data) => {
            isValid = data.rows;
  
            //IF USER ALREADY EXISTS WE RECIEVE A NON EMPTY ARRAY SO WE CHECK LENGTH OF ARRAY AND SEND RESPONSE BACK THAT USER ALREADY EXISTS
            if (isValid.length !== 0) {
                res.status(400).json({
                    error: "User already exists.",
                });
            } else {
                //IF THE CONDITION IS FALSE THAT IS THE USER DOES NOT EXIST ALREADY IN OUT DB, WE NEED TO SAVE HIS DATA TO DB FOR THAT FIRST WE HASH THE PLAIN PASSWORD GIVEN BY USER
                bcrypt.hash(password, 10, (err, hash) => {
                    //WHILE HASHING IF AN ERROR OCCURS WE SEND BACK SERVER ERROR AS RESPONSE
                    if (err) {
                        res.status(500).json({
                            error: "Internal server error.",
                        });
                    }
                
                    //IF NO ERROR OCCURS AND PASSWORD IS HASHED SUCCESSFULLY WE CREATE A USER OBJECT WITH NAME, EMAIL, AND HASHED PASSWORD
                    const user = {
                        name,
                        email,
                        password: hash,
                    };
  
                    //NOW WE NEED TO SAVE THE ABOVE USER TO OUR DB FOR THAT WE PERFORM A INSERT QUERY
                    client
                        .query(
                            `INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}' , '${user.password}');`
                        )
                        .then((data) => {
                            //IF THE USER IS SUCCESSFULLY SAVED IN OUR DB WE GENERATE TOKEN FOR THE USER TO SEND BACK TO THE BROWSER
                            const token = jwt.sign({
                                email: email,
                            },
                                process.env.SECRET_KEY
                            );
  
                            //FINALLY WE SEND THE TOKEN BACK TO USER WITH A SUCCESS MESSAGE
                            res.status(200).json({
                                message: "User added successfully to database",
                                token: token,
                            });
                        })
                        .catch((err) => {
                            //IF ANY ERROR OCCURS WHILE SAVING THE USER TO THE DATABASE WE SEND A DATABASE ERROR RESPONSE
                            res.status(500).json({
                                error: "Database error occurred!",
                            });
                        });
                });
            }
        })
        .catch((err) => {
            //IF ANY ERROR OCCURS WHILE CHECKING FOR USER IN THE DATABASE WE SEND A DATABASE ERROR RESPONSE
            res.status(500).json({
                error: "Database error occurred!",
            });
        });
};

exports.signIn = (req, res) => {
    const { email, password } = req.body;

    client
        .query(`SELECT * FROM users WHERE email = '${email}';`)
        .then((data) => {
            userData = data.rows;
        
            if(userData.length === 0) {
                res.status(400).json({
                    error: "User does not exist, signup instead!",
                });
            } else {
                bcrypt.compare(password, userData[0].password, (err, result)=>{
                    if(err){
                        res.status(500).json({
                            error: "Server Error!",
                        });
                    } else if(result === true){
                        const token = jwt.sign({
                            email: email,
                        },
                            process.env.SECRET_KEY
                        );

                        res.status(200).json({
                            message: "User Signed In Successfully",
                            token: token,
                        });
                    } else {
                        res.status(400).json({
                            error: "Enter correct password!",
                        })
                    }
                });
            }
        })
        .catch((err) => {
            //IF ANY ERROR OCCURS WHILE CHECKING FOR USER IN THE DATABASE WE SEND A DATABASE ERROR RESPONSE
            res.status(500).json({
                error: "Database error occurred!",
            });
        });
}