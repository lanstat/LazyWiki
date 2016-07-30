var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var path = require('path');

var paths = {
    js: [
        './scripts/app.js',
        './scripts/tools.js',
        './scripts/wikieditor.js',
        './scripts/wikiTpl.js'
    ],
    angular: [
        './bower_components/angular/angular.min.js',
        './bower_components/angular-route/angular-route.min.js',
        './bower_components/angular-sanitize/angular-sanitize.min.js'
    ],
    styles: [
        './css/styles.css',
        './bower_components/bootstrap/dist/css/bootstrap.min.css'
    ],
    build: './build'
};

/**
 * Lista las tareas gulp habilitadas
 */
gulp.task('help', plug.taskListing);

/**
 * Minifica y empaqueta la aplicacion JavaScript
 * @return {Stream}
 */
gulp.task('jsmin', function() {
    console.log('Empaquetando, minificando, y copiando los JS');

    return gulp
        .src(paths.js)
        .pipe(plug.concat('lazyWiki.min.js'))
        .pipe(plug.uglify({}))
        .pipe(gulp.dest(paths.build+'/js'));
});

gulp.task('js', function() {
    console.log('Empaquetando, minificando, y copiando los JS');

    return gulp
        .src(paths.js)
        .pipe(plug.concat('lazyWiki.js'))
        .pipe(gulp.dest(paths.build+'/js/'));
});

gulp.task('angular', function(){
    console.log('Copiando librerias angular');

    return gulp
        .src(paths.angular)
        .pipe(gulp.dest(paths.build+'/js/'));
});

gulp.task('indexProd', function(){
    console.log('Genera la pagina de produccion');

    return gulp
        .src('./index.html')
        .pipe(plug.useref())
        .pipe(gulp.dest(paths.build));
});

gulp.task('eslint', function() {
    console.log('Realizando verificaciones de calidad de codigo');

    return gulp
        .src(paths.js)
        .pipe(plug.eslint())
        .pipe(plug.eslint.format())
        .pipe(plug.eslint.failAfterError());
});

gulp.task('copyAssets', function(){
    console.log('Copiando assets');
    return gulp
        .src('assets/**')
        .pipe(gulp.dest(paths.build+'/assets'));
});

gulp.task('copyStyles', function(){
    console.log('Copiando estilos');
    return gulp
        .src(paths.styles)
        .pipe(gulp.dest(paths.build+'/css'));
});

gulp.task('build', ['jsmin', 'copyAssets', 'angular', 'indexProd', 'copyStyles']);

/**
 * Ejecuta las pruebas de la aplicacion
 *
 * @todo Agregar las pruebas respectivas con karma y qunit o jasmine
 * @return {Stream}
 */
gulp.task('test', ['build'], function(done) {
    startTests(true, done);
});

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    karma.start({
        configFile: path.join(__dirname, '/karma.conf.js'),
        singleRun: !!singleRun
    }, karmaCompleted);

    function karmaCompleted() {
        done();
    }
}