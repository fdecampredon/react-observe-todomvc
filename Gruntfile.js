
/*jshint node: true */
/* global ObserveUtils*/

module.exports = function(grunt) {
        
    grunt.loadNpmTasks('grunt-browserify');
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            'public/js/bundle.js': ['lib/client.js'],
            options: {
                debug : true
            }
        }
    });
        
    grunt.registerTask('default', ['browserify']);
};