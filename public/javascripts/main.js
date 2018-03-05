(function() {
        'use strict';
        angular.module('myApp',[])
        .controller('myCtrl1', myCtrlFn)
        .service('myService1', myServiceFn)
        .directive('myList', myListDir)
        .constant('ApiBasePath', "http://localhost:3000");

        myListDir.$inject = [];
        function myListDir() {
            var ddo = {
                templateUrl: 'listItem.html',
                scope: {
                    listCtrl: "=list"
                },
                //link: myLinkFn
            }
            return ddo;
        }
        function myLinkFn(scope, element, attrs, controller) {
            scope.$watch('listCtrl.itemList', function(newValue, oldValue) {
                console.log(newValue + " :: " + oldValue);

                element.find(".dontshow").html("Hello");
                element.find(".dontshow").slideUp(2000);
                //element.fadeIn(5000);
            })
        }
        myCtrlFn.$inject = ['$scope', '$interval', 'myService1'];


        function myCtrlFn($scope, $interval, myService1) {
            var c1 = this;

            var promise = myService1.getList();
            promise.then(function (response){
                c1.tweetList = response.data;
                c1.tweets = response.data;
                // console.log(response.data);
            })
            .catch(function (error) {
                console.log("Error");
            });

            $scope.$watch('c1.tweets', function(oldValue, newValue){
                if (typeof oldValue === "undefined") return;
                if (typeof newValue === "undefined") return;
                if(oldValue[0]._id != newValue[0]._id) {
                    console.log("OLD VALUE" + oldValue);
                    console.log("NEW VALUE" + newValue);
                    c1.tweetList = c1.tweets;
                }
            });

            c1.loop = function() {
                $interval(function(){
                    var promise = myService1.getList();

                    promise.then(function (response){
                        c1.tweets = response.data;
                        // console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log("Error");
                    });
                    console.log("loop");

                }, 5000);
            }

            c1.loop();

        };

        myServiceFn.$inject = ['$http', 'ApiBasePath'];
        function myServiceFn($http, ApiBasePath) {
            var mySer = this;
            mySer.getList = function () {
                var response = $http({
                    method: "GET",
                    url: ApiBasePath + "/data"
                });
                return response;
            }

        }

    }
)();
