var app = angular.module('lazyWiki',['ngRoute', 'ngSanitize', 'angular-bind-html-compile']);

app.config(function($routeProvider){
    $routeProvider.
        when('/', {
            controller: 'homeController',
            template: function(){
                return document.getElementById('homeTpl').innerHTML;
            }
        })
        .when('/wiki/:name', {
            controller: 'wikiController',
            template: function(){
                return document.getElementById('articleTpl').innerHTML;
            }
        })
        .when('/wiki/:name/edit', {
            controller: 'wikiEditController',
            template: function(){
                return document.getElementById('editArticleTpl').innerHTML;
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('mainController', function($scope){
    $scope.saveDatabase = function(){
        var data = 'window.wikiDataBase={articles:';

        var convertToString = function(item){
            var response  = '{';
            for (var param in item) {
                if (item.hasOwnProperty(param)) {
                    if (typeof item[param] === 'object'){
                        response += param + ':' + convertToString(item[param]);
                    }else{
                        var line = item[param].replace(/'/g,'\\\'');
                        line = line.replace(/\n/g, '\\n');
                        response += param + ':\'' + line + '\'';
                    }
                    response  += ',';
                }
            }
            response = response.substring(0, response.length -1);
            response += '}';
            return response;
        };

        data += convertToString(wikiDataBase.articles) + '};';

        var blob = new Blob([data], {type: 'application/javascript;charset=utf-8;'});
        var link = angular.element('<a></a>');
        link.attr('href', window.URL.createObjectURL(blob));
        link.attr('download', 'data.js');
        link[0].click();
    };
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

app.controller('wikiController', function($scope, $location, $anchorScroll, $routeParams, $route){
    var article = wikiDataBase.articles[$routeParams.name];
    $scope.routeName = $routeParams.name;

    $scope.scrollTo = function(id){
        $location.hash(id);
        $anchorScroll();
    };

    $scope.store = function(){
        wikiDataBase.articles[$routeParams.name] = {
            title: $scope.formData.title,
            content: $scope.formData.content
        };
        $route.reload();
    };

    if (article){
        $scope.title = article.title;
        $scope.content = wikiEditor.decode(article.content);    
    } else {
        $scope.isNew = true;
        $scope.formData = {
            title: $routeParams.name.replace(/_/g, ' '),
            content: ''
        };
    }
});

app.controller('wikiEditController', function($scope, $routeParams, $location, $rootScope){
    var article = wikiDataBase.articles[$routeParams.name];

    $scope.formData = {
        title: article.title,
        content: article.content
    };

    $scope.store = function(){
        wikiDataBase.articles[$routeParams.name] = {
            title: $scope.formData.title,
            content: $scope.formData.content
        };
        $location.path('/wiki/'+$routeParams.name);
    };
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