require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes")
const client = require("./configs/database");

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

client.connect((err)=>{
    if(err){
        console.log(err);
    }
    console.log("Database Connected!");
});

app.get('/', (req, res)=>{
    res.status(200).send("Server is up and running!!");
})

app.use("/auth", authRoutes);
app.use("/note", noteRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
});