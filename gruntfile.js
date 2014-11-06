module.exports = function(grunt) {
    grunt.initConfig({
        sourceJsDir: 'assets/scripts',
        webJsDir: 'scripts',
        sourceCssDir: 'assets/scss',
        webCssDir: 'css',
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            sass: {
                files: ['<%= sourceCssDir %>/**/*.{scss,sass}'],
                tasks: ['libsass']
            },
            livereload: {
                files: ['*.html', '*.php', 'js/**/*.{js,json}', 'css/*.css','img/**/*.{png,jpg,jpeg,gif,webp,svg}'],
                options: {
                    livereload: true
                }
            },
            scripts: {
                files: ['<%= sourceJsDir %>/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                }
            }
        },
        libsass: {
            all: {
                options: {
                    includePath: ['<%= sourceCssDir %>'],
                    outputStyle: 'nested'
                },
                files: {
                    '<%= webCssDir %>/app.css': '<%= sourceCssDir %>/app.scss'
                }
            }
        },
        cssmin: {
            minify: {
                options: {
                    keepSpecialComments: 0
                },
                files: {
                    '<%= webCssDir %>/app.min.css': ['<%= webCssDir %>/app.css']
                }
            }
        },
        concat: {
            build: {
                src: [
                    '<%= sourceJsDir %>/foundation/foundation.js',
                    '<%= sourceJsDir %>/foundation/foundation.interchange.js',
                    '<%= sourceJsDir %>/foundation/foundation.accordion.js',
                    '<%= sourceJsDir %>/foundation/foundation.abide.js',
                    '<%= sourceJsDir %>/foundation/foundation.tooltip.js',
                    '<%= sourceJsDir %>/vendor/jquery.cookie.js',
                    '<%= sourceJsDir %>/vendor/svg4everybody.js',
                    '<%= sourceJsDir %>/app.js'
                ],
                dest: '<%= webJsDir %>/app.js'
            }
        },
        uglify: {
            options: {
                mangle: true,
                sourceMap: true
            },
            app: {
                src: '<%= webJsDir %>/app.js',
                dest: '<%= webJsDir %>/app.min.js'
            }
        },
        usebanner: {
            options: {
                position: 'top',
                banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */',
                linebreak: true
            },
            files: {
                src: ['<%= webJsDir%>/app*.js', '<%= webCssDir %>/app*.css']
            }
        }
    });

    grunt.loadNpmTasks('grunt-libsass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('default', ['libsass', 'cssmin', 'concat', 'uglify', 'usebanner']);
    grunt.registerTask('css', ['libsass', 'cssmin']);
    grunt.registerTask('js', ['concat', 'uglify']);
    grunt.registerTask('watcher', ['watch']);
};