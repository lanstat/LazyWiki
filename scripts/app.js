var app = angular.module('lazyWiki',['ngRoute', 'ngSanitize', 'angular-bind-html-compile']);

app.config(function($routeProvider){
    $routeProvider.
        when('/', {
            controller: 'homeController',
            template: function(){
                return document.getElementById('homeTpl').innerHTML;
            }
        })
        .when('/wiki', {
            controller: 'wikiController',
            template: function(){
                return document.getElementById('articleTpl').innerHTML;
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('mainController', function($scope){
    $scope.test = 'hola mundo';
});

app.controller('menuController', function($scope){
    $scope.navigation = [
        {title:'Pagina principal', link:'#/'},
        {title:'Pagina aleatoria', link:'#/'},
        {title:'Interaccion', items:[
            {title:'Ayuda', link:'#/'},
            {title:'Acerca de', link:'#/'}
        ]},
        {title:'Herramientas', items:[
            {title:'Informacion de pagina', link:'#/'}
        ]}
    ];
});

app.controller('homeController', function($scope){
    $scope.test2 = 'wow';
});

app.controller('wikiController', function($scope, $location, $anchorScroll){
    var article = wikiDataBase.articles[0];

    $scope.scrollTo = function(id){
        $location.hash(id);
        $anchorScroll();
    };

    $scope.title =article.title;
    $scope.content = wikiEditor.decode(article.content);
});

(function () {
    'use strict';

    var module = angular.module('angular-bind-html-compile', []);

    module.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                });
            }
        };
    }]);
}());