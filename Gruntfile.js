var utils = require('./build-utils');

module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json'),
        srcDir = './src',
        buildDir = './build',
        version = pkg.version;

    // Forçamos concat e outros plugins a usarem LF sempre
    grunt.util.linefeed = '\n';

    grunt.initConfig({
        pkg: pkg,

        buildDir: buildDir,
        srcDir: srcDir,

        clean: {
            build: [buildDir]
        },

        // Duplicate source for following building tasks
        // Copiamos o código fonte para trabalharmos em cima dele
        copy: {
            build: {
                files: [
                    {expand: true, cwd: '<%= srcDir %>/', src: ['**'], dest: '<%= buildDir %>/'}
                ]
            }
        },

        rename: {
            htaccess: {
                src: '<%= buildDir %>/build.htaccess',
                dest: '<%= buildDir %>/.htaccess'
            }
        },

        // Pré-processamento de strings (substituições)
        replace: {
            build: {
                src: [
                    '<%= buildDir %>/*.js'
                ],
                overwrite: true,
                replacements: [
                    {
                        from: "$PROJECT_NAME$",
                        to: "<%= pkg.name %>"
                    },
                    {
                        from: "$PROJECT_HOMEPAGE$",
                        to: "<%= pkg.homepage %>"
                    },{
                        from: "$PROJECT_VERSION$",
                        to: version
                    },{
                        from: "$PROJECT_BUILD_TIME$",
                        to: (new Date()).toUTCString()
                    },{
                        from: "$PROJECT_LICENSE$",
                        to: "<%= pkg.license %>"
                    }
                ]
            }
        },

        // Javascript compresion
        uglify: {
            options: {
                mangle: true,
                compress: true,
                preserveComments: 'some'
            },

            build: {
                options: {
                    report: 'gzip'
                },
                files : [{
                    expand : true,
                    cwd : '<%= buildDir %>',
                    dest : '<%= buildDir %>',
                    src : ['**/*.js']
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-rename');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', [
        'clean:build',
        'copy:build',
        'ppem:build',
        'sass:build',
        'clean:postBuild',
        'replace:build',
        'uglify:build',
        'clean:htaccess',
        'rename'
    ]);
    grunt.registerTask('default', 'build');
};
