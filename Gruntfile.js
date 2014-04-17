/**
 * @author Andrzej Duś <andrzej@boycoy.com>
 */

module.exports = function(grunt) {
    // common variables
    var buildDir = 'dist';
    var distDir = 'dist';
    var minifiedFilename = 'parallaxer.min.js';

    // project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bump: {
            options: {},
            files: [ 'package.json' ]
        },
        closureBuilder: {
            options: {
                closureLibraryPath: 'custom_components/closure-library-20130212-95c19e7f0f5f', // path to closure library
                inputs: 'src/Parallaxer.js',
                compilerFile: 'bin/compiler-20130411/compiler.jar', // path to closure compiler
                compile: true, // boolean
                compilerOpts: {
                    define: ["'andrzejdus.DEBUG=false'"],
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
                dest: buildDir + '/' + minifiedFilename
            }
        },
        concat: {
          options: {
            stripBanners: true,
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %> - <%= pkg.repository.url %> */'
          },
          dist: {
            src: [buildDir + '/' + minifiedFilename],
            dest: distDir + '/' + minifiedFilename
          }
        }
    });

    grunt.loadNpmTasks('grunt-bumpx');
    grunt.loadNpmTasks('grunt-closure-tools');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task.
    grunt.registerTask('default', ['bump', 'closureBuilder', 'concat']);
};