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

    client
        .query(`INSERT INTO notes (email, heading, content) VALUES ('${req.email}', '${heading}', '${content}');`)   
        .then((data)=>{
            res.status(200).json({
                message: "Note Added Successfully",
            });
        })
        .catch((err)=>{
            res.status(400).json({
                error: "Database Error Occured"
            });
        });
}; 

exports.getAllNotes = (req, res) => {
    client
        .query(`SELECT * FROM notes WHERE email = '${req.email}'`)
        .then((data)=>{
            const noteData = data.rows;
            const filteredData = noteData.map((note) => {
                return{
                    noteId: note.noteid,
                    heading: note.heading,
                    content: note.content,
                };
            });

            res.status(200).json({
                message: "Success",
                data: filteredData
            });
        })
        .catch((err)=>{
            res.status(400).json({
                error: "Database Error Occured"
            });
        });
};

exports.updateNote = (req, res) => {
    const noteId = req.noteId;
    const { heading, content } = req.body;
    client
        .query(`UPDATE notes SET heading='${heading}', content = '${content}' WHERE noteid='${noteId}'`)
        .then((data)=>{
            res.status(200).json({
                message: "Note Updated Successfully",
            });
        })
        .catch((err)=>{
            res.status(400).json({
                error: "Database Error Occured"
            });
        });
};

exports.deleteNote = (req, res) => {
    const noteId = req.noteId;
    client
        .query(`DELETE FROM notes WHERE noteid='${noteId}'`)
        .then((data)=>{
            res.status(200).json({
                message: "Note Deleted Successfully",
            });
        })
        .catch((err)=>{
            res.status(400).json({
                error: "Database Error Occured"
            });
        });
};