var app = angular.module('horizAdjuster', ['ui.router']);


app.factory('boxes',['$http',function($http){
	var o = {
		boxes: []
	};
	o.get = function(id) {
  	return $http.get('/boxes/' + id).then(function(res){
  		return res.data;
  	});
  };
	o.getAll = function() {
		return $http.get('/boxes').success(function(data){
			angular.copy(data, o.boxes);
		});
	};
	o.changeValue = function (box, newValue) {
		// console.log('(Factory) ' + box.value + " --> " + newValue);
		return $http({
			method:'PUT',
			url:'/boxes/' + box._id + '/changeValue',
			data: {'action': 'update','newValue': newValue}
		})
		// return $http.put('/boxes/' + box._id + '/changeValue', newValue)
			.success(function(data) {
				// console.log('(Factory Success)');
				box.value = newValue;
			});
	};
	o.create = function(box) {
		return $http.post('/boxes', box).success(function(data){
			o.boxes.push(data);
		});
	};
	o.removeBox = function(box) {
		// console.log('(removeBox start)');
		// return $http.delete('/boxes/' + box._id + '/removeBox')
		return $http({
			method:'DELETE',
			url:'/boxes/' + box._id + '/removeBox',
			data: {'action': 'delete', 'boxid': box._id}
		})
			.success(function(){
				// console.log('(removeBox end)');
		});
	};
	o.removeBoxes = function(removeVal) {
		// console.log('(removeBoxes start) removeVal: ' + removeVal);
		return $http({
			method:'PUT',
			url:'/boxes/removeBoxes',
			data: {'action': 'delete', 'removeVal': removeVal}
		})
			.success(function() {
				// console.log('(removeBoxes) success');
		});
	};
	return o;
}]),

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state(
			'home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve: {
					boxPromise: ['boxes', function(boxes){
						return boxes.getAll();
					}]
				}
		})
		.state(
			'boxes', {
				url: '/boxes/{id}',
				templateUrl: '/boxes.html',
				controller: 'BoxesCtrl',
				resolve: {
					box: ['$stateParams', 'boxes', function($stateParams, boxes) {
						return boxes.get($stateParams.id);
					}]
				}	
			})
		$urlRouterProvider.otherwise('home');
	}]);

app.controller('MainCtrl', [
	'$scope',
	'$state',
	'boxes',
	function($scope, $state, boxes){
		$scope.test = "Testing";
		$scope.boxes = boxes.boxes;
		$scope.addBox = function(){
			// console.log('(addBox)');
			if (!$scope.value || $scope.value==='') { $scope.value = 12321;}
			boxes.create({
				value: $scope.value
			});
			$scope.value='';
		};
		$scope.removeBoxes = function(){
			if (!$scope.removeVal || $scope.removeVal==='') {return;}
			boxes.removeBoxes($scope.removeVal);
			// boxes.getAll().then(function(data) {$scope.boxes = data;});
			console.log($scope.boxes[1]._id);
			$scope.removeVal = '';
			$state.reload();
		};
	}]);

app.controller('BoxesCtrl', [
	'$scope',
	'$state',
	'boxes',
	'box',
	function($scope, $state, boxes, box){
		$scope.box = box;
		$scope.boxtest = "Box Testing";
		$scope.removeBox = function() {
			// console.log('(BoxesCtrl) Attempting to remove box ' + box._id);
			boxes.removeBox(box);
			$state.go('home');
			// $state = '/home';
		}
		$scope.changeValue = function() {
			// console.log('(Controller) Scope newValue: ' + $scope.newValue);
			if(!$scope.newValue || $scope.newValue==='') {return;}
			boxes.changeValue(box, $scope.newValue);
			$scope.newValue = '';
		};
	}]);