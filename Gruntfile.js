'use strict';

module.exports = function(grunt) {
    
    require('time-grunt')(grunt);
    
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            files: ['!Gruntfile.js', '/client/**/*.js','!/client/lib/**/*'],
            reporter: require('jshint-stylish'),
            options: {
                ignores: '/client/js/lb-services.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'client/css',
                    src: ['*.scss'],
                    dest: 'client/css',
                    ext: '.css'
                }]
            }
        },
        useminPrepare: {
            html: 'client/**/*.html',
            options: {
                dest: 'dist'
            }
        },
        //Concat
        concat: {
            options: {
                separator: ';'
            },
            dist: {}
        },
        // Uglify
        uglify: {
            dist: []
        },
        cssmin: {
            dist: {}
        },
        
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            release: {
                files: [{
                    src: [
                        'dist/js/**/*.js',
                        'dist/css/**/*.css'
                    ]
                }]
            }
        },
        //Usemin - Replace all assets with revved version in html and css files
        usemin: {
            html: ['dist/**/*.html'],
            css: ['dist/css/**/*.css'],
            options: {
                assetDirs: ['dist', 'dist/css']
            }
        },
        
        copy: {
            dist: {
                cwd: 'client',
                src: ['**','!css/**/*.css','!js/**/*.js','!lib/**/*','!**/*.scss', '!**/*.css.map'],
                dest: 'dist/',
                expand: true
            },
        
        fonts: {
            files: [
                {
                    //bootstrap fonts
                    expand: true,
                    dot: true,
                    cwd: 'client/lib/bootstrap/dist',
                    src: ['fonts/*.*'],
                    dest: 'dist'
                }, {
                    //font-awesome
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
              files: ['client/**', '!client/**/*.css', '!client/**/*.js','!client/**/*.css.map'],
                tasks: ['build']
            },
            typesc: {
                
            },
            scripts: {
                files: ['client/js/**/*.js'],
                tasks: ['jshint', 'build'],
            },
            sassy: {
                files: ['client/css/**/*.scss'],
                tasks: ['sass']
            },
            styles: {
                files: ['client/styles/**/*.css'],
                tasks: ['build']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                'client/**/*.html',
                '.tmp/styles/**/*.css',
                'client/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
        },
         connect: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    livereload: 35729
                },
        dist: {
            options: {
                open: true,
                base: {
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
            build: {
                src: [ 'dist/']
            }
        }
  
    });

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'useminPrepare',
        'concat',
        'sass',
        'cssmin',
        'uglify',
        'copy',
        'filerev',
        'usemin'
    ]);
    
    
    grunt.registerTask('serve', [
        'build',
        'connect:dist',
        'watch'
    ]);
    
 

};