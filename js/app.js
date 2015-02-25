/*
 * Playing with forms and other stuff in Angular.js + Bootstrap.
 *
 * (c) 2015 Johannes Hildén
 *
 * MIT Licensed or something...
 *
 */
(function(){

    // Paste database... 
    var pasteDb = [];

    if (typeof(Storage) !== 'undefined') {
        try {
            pasteDb = JSON.parse(localStorage.getItem('pastebin-db')) || []; 
        }
        catch(err) {
            console.log('Error parsing local storage object.');
        }
    }

    //console.log(pasteDb);   // debug

    var newMsgFlag = false;

    var pastebin = angular.module('pastebin', ['ngRoute']);

    pastebin.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'views/home.html',
                controller  : 'mainController'
            })
            .when('/paste', {
                templateUrl : 'views/paste.html',
                controller  : 'pasteController'
            })
            .when('/about', {
                templateUrl : 'views/about.html',
                controller  : 'mainController'
            })
            .when('/view/:index', {
                templateUrl : 'views/view.html',
                controller  : 'viewController'
            });
     });

    pastebin.controller('mainController', function($scope) {
        $scope.items = angular.copy(pasteDb);
        $scope.fresh = newMsgFlag;
        newMsgFlag = false;
    });

    pastebin.controller('pasteController', function($scope) {

        $scope.reset = function() {
            $scope.form.$setPristine();
            $scope.paste.body = '';
        };

        $scope.save = function(paste) {
            if ($scope.form.$valid) {

                paste.index = pasteDb.length;
                pasteDb.push({
                    body     : paste.body,
                    index    : paste.index,
                    language : paste.language,
                    title    : paste.title
                });

                if (typeof(Storage) !== 'undefined') {
                    localStorage.setItem('pastebin-db', JSON.stringify(pasteDb)); 
                }

                newMsgFlag = true;

                // @todo: perhaps there is a more elegant way to redirect... 
                window.location.href = '#/';
            }
        }

    });

    pastebin.controller('viewController', function($scope, $routeParams) {

        var index = $routeParams.index;

        if (index < pasteDb.length) {
            $scope.paste = pasteDb[$routeParams.index];
        } else {
            // Invalid index
            window.location.href = '#/';
        }

    });

    /* http://stackoverflow.com/questions/16199418/how-do-i-implement-the-bootstrap-navbar-active-class-with-angular-js */
    pastebin.controller('headerController', function($scope, $location) {
        $scope.isActive = function (viewLocation) { 
            return viewLocation === $location.path();
        };
    });

}());
