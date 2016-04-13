'use strict';

module.exports = function (grunt) {
    
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });
    
     // Define the configuration for all the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
        options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish'),
            ignores: [
                'client/js/lb-services.js'
            ]
        },
        all: {
            src: [
            'Gruntfile.js',
            'client/{,*/}*.js'
            ]
        }
    },
    
    useminPrepare: {
        html: 'client/{,*/}*.html',
        options: {
            dest: 'dist'
        }
    },
      // Concat
    concat: {
        options: {
            separator: ';'
        },
        // dist configuration is provided by useminPrepare
        dist: {}
    },
      // Uglify
    uglify: {
        // dist configuration is provided by useminPrepare
        dist: {}
    },
    cssmin: {
        dist: {}
    },
      // Filerev
    filerev: {
        options: {
            encoding: 'utf8',
            algorithm: 'md5',
            length: 20
        },
        release: {
            // filerev:release hashes(md5) all assets (images, js and css )
            // in dist directory
            files: [{
                src: [
                    'dist/js/*.js',
                    'dist/styles/*.css',
                ]
            }]
        }
    },
      // Usemin
      // Replaces all assets with their revved version in html and css files.
      // options.assetDirs contains the directories for finding the assets
      // according to their relative paths
    usemin: {
        html: ['dist/*.html'],
        css: ['dist/styles/*.css'],
        options: {
            assetsDirs: ['dist', 'dist/styles']
        }
    },
        
    copy: {
        dist: {
            cwd: 'client',
            src: [ '**','!styles/**/*.css','!js/**/*.js' ],
            dest: 'dist',
            expand: true
    },
        
    fonts: {
        files:[
              {
                  //for bootstrap fonts
                    expand: true,
                    dot: true,
                    cwd: 'client/lib/bootstrap/dist',
                    src: ['fonts/*.*'],
                    dest: 'dist'
                }, {
                    //for font-awesome
                    expand: true,
                    dot: true,
                    cwd: 'client/lib/font-awesome',
                    src: ['fonts/*.*'],
                    dest: 'dist'
                }
            ]
        }
    },
    watch: {
        copy: {
            files: [ 'client/**', '!client/**/*.css', '!client/**/*.js'],
            tasks: [ 'build' ]
        },
        scripts: {
            files: ['client/js/**/*.js'],
            tasks:[ 'build']
        },
        styles: {
            files: ['client/styles/**/*.css'],
            tasks:['build']
        },
        livereload: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            files: [
                'client/{,*/}*.html',
                '.tmp/styles/{,*/}*.css',
                'client/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
        }
    },
    connect: {
        options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
    },
    dist: {
        options: {
            open: true,
            base:{
            path: 'dist',
            options: {
                index: 'index.html',
                maxAge: 300000
                }
            }
        }
        }
    },
        clean: {
        build:{
            src: [ 'dist/']
        }
    }
});

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'filerev',
        'usemin'
    ]);
    
    grunt.registerTask('serve',['build','connect:dist','watch']);

    grunt.registerTask('default',['build']);
    
};