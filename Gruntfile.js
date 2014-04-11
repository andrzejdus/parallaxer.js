/**
 * @author Andrzej Duś <andrzej@boycoy.com>
 */

module.exports = function(grunt) {
    // common variables
    var distDir = 'dist';
    var distFile = 'parallaxer.min.js';

    // project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bump: {
            options: {},
            files: [ 'package.json' ]
        },
        closureBuilder:  {
            options: {
                closureLibraryPath: 'custom_components/closure-library-20130212-95c19e7f0f5f', // path to closure library
                inputs: 'src/Parallaxer.js',
                compilerFile: 'bin/compiler-20130411/compiler.jar', // path to closure compiler
                compile: true, // boolean
                compilerOpts: {
                    define: ["'DEBUG=false'"],
                },
                execOpts: {
                    maxBuffer: 999999 * 1024
                }
            },
            defaultTarget: {
                src: [
                    'src',
                    'custom_components/closure-library-20130212-95c19e7f0f5f/closure',
                    'custom_components/closure-library-20130212-95c19e7f0f5f/third_party/closure',
                    'libs/utils.js/src'
                ],
                dest: distDir + '/' + distFile
            }
        }
    });

    grunt.loadNpmTasks('grunt-bumpx');
    grunt.loadNpmTasks('grunt-closure-tools');

    // Default task.
    grunt.registerTask('default', ['bump', 'closureBuilder']);
};