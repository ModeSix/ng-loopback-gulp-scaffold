angular.module('aymontcaApp')

.controller('IndexController', ['$scope', 'Restangular', function($scope, Restangular) {
    
    $scope.todos = Restangular.all('todos');
    
    $scope.testvar = Restangular.all('todos').getList().$object;
    
    var showEdit = false;
    
    $scope.newPost = function() {
        if($scope.newPostText) {
            var todos = Restangular.all('todos');
            
            var posted = {
                title: $scope.newPostText,
                isDone: false
            };
            todos.post(posted);
            $scope.testvar = Restangular.all('todos').getList().$object;
            $scope.newPostText = '';
            
        }
    };
    
    $scope.openEditor = function(fuckingthing) {
        
        var thisItem = {
            id: fuckingthing
        };
        
        $scope.thisItem = thisItem;
        
        console.log('Edit pressed.  Id that was sent is:' + thisItem.id);
        
        $scope.showEdit = true;
       
        //$scope.sentID = $scope.itemID;
        $scope.editText = Restangular.one('todos', thisItem.id).get().$object;
       
    }
    
}]);
