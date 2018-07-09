var app = angular.module("app.todos", ["xeditable"]);

app.controller("todoController", ['$scope', 'svTodos', function ($scope, svTodos) {
    $scope.appName = "TODO DASHBOARD";
    $scope.formData = {};
    $scope.todos = [];
    $scope.loading = true;

    svTodos.get().then(function (data) {
        console.log(data);
        for (var i in data.data) {
            $scope.todos.push(data.data[i]);
        }
        $scope.loading = false;
    });

    $scope.createTodo = function () {
        $scope.loading = true;
        var todo = {
            text: $scope.formData.text,
            isDone: false
        };

        svTodos.create(todo).then(function (todo) {
            todo.text = $scope.formData.text;
            $scope.todos= todo.data;
            $scope.formData.text = "";
            $scope.loading = false;
        });
    };

    $scope.updateTodo = function (todo) {
        $scope.loading = true;
        svTodos.update(todo).then(function (todo) {
            console.log("Update todo: ", todo);
            $scope.todos = todo.data;
            $scope.loading = false;
        });
    };

    $scope.deleteTodo = function (todo, id) {
        $scope.loading = true;
        svTodos.delete(id).then(function (todo) {
            $scope.todos = todo.data;
            $scope.loading = false;
        });
    };
    
}]);