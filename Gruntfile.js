var utils = require('./build-utils');

module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json'),
        filesToPreprocess = 'js,ts,css,scss,xml,xhtml,html,html,shtml',
        srcDir = './src',
        buildDir = './build',
        distDir = './dist',
        buildTime = new Date();

    var version = utils.version.parse(pkg.version),
        versionString = utils.version.getCacheKey(version);

    // Forçamos concat e outros plugins a usarem LF sempre
    grunt.util.linefeed = '\n';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: pkg,

        srcDir: srcDir,
        buildDir: buildDir,
        distDir: distDir,

        clean: {
            build: [buildDir],
            dist: [distDir]
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
                        to: versionString
                    },{
                        from: "$PROJECT_BUILD_TIME$",
                        to: buildTime.toISOString()
                    },{
                        from: "$PROJECT_LICENSE$",
                        to: "<%= pkg.license %>"
                    }
                ]
            }
        },

        ppem : {
            build: {
                baseDir: "<%= buildDir %>",
                verbose: false,
                defines: {
                    BUILD: true
                },
                files : [{
                    expand : true,
                    cwd : '<%= buildDir %>',
                    dest : '<%= buildDir %>',
                    src : ['*.{' + filesToPreprocess + '}']
                }]

            }
        },

        // Javascript compresion
        uglify: {
            dev: {
                options: {
                    beautify: true,
                    mangle: false,
                    compress: false,
                    preserveComments: 'all'
                },
                files : {
                    '<%= buildDir %>/jsx.js' : [
                        '<%= buildDir %>/jsx-core.js',
                        '<%= buildDir %>/jsx-exceptions.js',
                        '<%= buildDir %>/jsx-asserts.js',
                        '<%= buildDir %>/jsx-converters.js',
                        '<%= buildDir %>/jsx-ng.js'
                    ]
                }
            },
            min: {
                options: {
                    report: 'gzip',
                    sourceMap: true,
                    mangle: true,
                    compress: {
                        drop_console: true
                    },
                    preserveComments: 'some'
                },
                files : {
                    '<%= buildDir %>/jsx.min.js' : [
                        '<%= buildDir %>/jsx-core.js',
                        '<%= buildDir %>/jsx-exceptions.js',
                        '<%= buildDir %>/jsx-asserts.js',
                        '<%= buildDir %>/jsx-converters.js',
                        '<%= buildDir %>/jsx-ng.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask('build', [
        'clean:build',
        'copy:build',
        'ppem:build',
        'replace:build',
        'uglify'
    ]);
    grunt.registerTask('default', 'build');
};
