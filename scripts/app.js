var app = angular.module('lazyWiki',['ngRoute', 'ngSanitize']);

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
        var data = 'window.wikiDataBase={';

        var convertToString = function(item){
            var count = 0;
            var content  = '{';
            for (var param in item) {
                if (item.hasOwnProperty(param)) {
                    if (typeof item[param] === 'object'){
                        content += param + ':' + convertToString(item[param]).content;
                    }else{
                        var line = item[param].replace(/'/g,'\\\'');
                        line = line.replace(/\n/g, '\\n');
                        content += param + ':\'' + line + '\'';
                    }
                    content  += ',';
                    count++;
                }
            }
            content = content.substring(0, content.length -1);
            content += '}';
            return {content: content, count: count};
        };

        var convert = convertToString(wikiDataBase.articles);

        data += 'count:' + convert.count + ',articles:'+ convert.content + '};';

        var blob = new Blob([data], {type: 'application/javascript;charset=utf-8;'});
        var link = angular.element('<a></a>');
        link.attr('href', window.URL.createObjectURL(blob));
        link.attr('download', 'data.js');
        link[0].click();
    };
});

app.controller('menuController', function($scope, $location){
    $scope.navigation = [
        {title:'Interaccion', items:[
            {title:'Ayuda', link:'#/'},
            {title:'Acerca de', link:'#/'}
        ]},
        {title:'Herramientas', items:[
            {title:'Informacion de pagina', link:'#/'}
        ]}
    ];

    $scope.getRandomPage = function(){
        var seed = parseInt(Math.random() * wikiDataBase.count);
        var index = 0;
        var page = '';

        for (var param in wikiDataBase.articles){
            if (wikiDataBase.articles.hasOwnProperty(param)) {
                if(seed == index){
                    page = param;
                    break;
                }
            }
            index ++;
        }

        $location.path('/wiki/'+page);
    };
});

app.controller('homeController', function($scope){
    $scope.test2 = 'wow';
});

app.controller('wikiController', function($scope, $routeParams, $route, $sce){
    var article = wikiDataBase.articles[$routeParams.name];
    $scope.routeName = $routeParams.name;

    $scope.toTrusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
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
        $scope.content = WIKI.decode(article.content);
    } else {
        $scope.isNew = true;
        $scope.formData = {
            title: $routeParams.name.replace(/_/g, ' '),
            content: ''
        };
    }
});

app.controller('wikiEditController', function($scope, $routeParams, $location){
    var article = wikiDataBase.articles[$routeParams.name];

    $scope.formData = {
        title: article.title,
        content: article.content
    };

    $scope.store = function(){
        wikiDataBase.articles[$routeParams.name.replace(' ', '_')] = {
            title: $scope.formData.title,
            content: $scope.formData.content
        };
        $location.path('/wiki/'+$routeParams.name);
    };
});

app.filter('safe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
