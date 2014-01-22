/*jshint node: true */

module.exports = function(grunt) {
        
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            'js/bundle.js': ['tmp/app.js']
        },
        
        clean : {
            temp : 'tmp',
            js: 'js'
        },
        
        typescript: {
            app: {
                src: ['src/**/*.ts'],
                dest: 'tmp',
                base_path : 'src',
                options: {
                    base_path : 'src',
                    module : 'commonjs',
                    target: 'es5',
                    sourcemap: false,
                    comments : true,
                    noImplicitAny: true,
                    ignoreTypeCheck: false
                }
            },
         }
    });
        
    grunt.registerTask('default', ['clean:temp','typescript', 'clean:js', 'browserify', 'clean:temp']);
};