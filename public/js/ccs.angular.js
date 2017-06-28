var ccsApp = angular.module("ccsApp", []);

function inputCtrl($scope){
    $scope.contact = {};
};

function phoneCntl($scope) {
	$scope.phoneModel = {};
};

var phoneModule = angular.module("phoneModule", [])
  .directive("phoneDirective", ["$filter", function($filter){

  	function link(scope, element, attributes){
  		scope.inputValue = scope.phoneModel;
  		scope.$watch("inputValue", function(value, oldValue) {
  			value = String(value);
  			var number = value.replace(/[^0-9]+/g, '');
  			scope.phoneModel = number;
  			scope.inputValue = $filter("phonenumber")(number);
  		});
  	}

  	return{
  		link : link,
  		restrict: 'E',
  		scope:{
  			phonePlaceholder: '=placeholder',
  			phoneModel : '=model',
  		},
  		template : '<input ng-model = "inputValue" type = "tel" class="phonenumber" placeholder="{{phonenumberPlaceholder}}" title="Phonenumber (Format: 999-999-9999):>'
  	};
  }])

  .filter("phonenumber", function() {

  	return function (number){
  		if (!number) { return "";}
  		number = String(number);

  		var formattedNumber = number;

  		var c = (number[0] == '1') ? "1 " : "";
  		number = number[0] == "1" ? number.slice(1) : number;

  		var area = number.substring(0,3);
  		var front = number.substring(3, 6);
  		var end = number.substring(6,10);

  		if (front) {
  			formattedNumber = (c + area + "-" + front);
  		}
  		if (end) {
  			formattedNumber += ("-" + end);
  		}
  		return formattedNumber;
  	};
  })