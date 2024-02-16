const client = require("../configs/database");

exports.addNote = (req, res) => {
    const { heading, content } = req.body;

    if (!heading || heading.trim() === "") {
        return res.status(400).json({
            error: "Heading cannot be empty!"
        });
    }
    
    if (!content || content.trim() === "") {
        return res.status(400).json({
            error: "Content cannot be empty!"
        });
    }

    client.query(`INSERT INTO notes (email, heading, content) VALUES ('${req.email}')`)
};