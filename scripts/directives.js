angular.module('lazyWiki').directive('menuScrollChanger', function($window){
    return {
        link: function(scope, element, attrs){
            // TODO verificar la forma de cargar la directiva despues de cargar el contenido del articulo
            var e = document.getElementById('hello');
            var elem = angular.element(e);
            elem.bind('scroll', function(){
                scope.isScrolled = (this.pageYOffset > 30);
                scope.$apply();
            });
        },
        restrict: 'A'
    }
});