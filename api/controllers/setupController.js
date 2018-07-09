var Todos = require("../models/todoModel");

module.exports = function (app) {
    app.get("/api/setupTodos", function (req, res) {
        /*var seedTodos = [
            {
                text: "Learning Nodejs",
                isDone: false
            },
            {
                text: "Learning Angular",
                isDone: false
            },
            {
                text: "Learning React",
                isDone: false
            }
        ];*/

        Todos.create(/*seedTodos,*/ function (err, results) {
            res.send(results);
        });
    });
}