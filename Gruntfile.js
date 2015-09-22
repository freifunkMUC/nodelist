// Generated on 2015-09-22 using
// generator-webapp 1.1.0
'use strict';

module.exports = function (grunt) {
	// Automatically load required grunt tasks
	require('jit-grunt')(grunt, {
		useminPrepare: 'grunt-usemin',
		bower: 'grunt-bower-task',
	});
	
	// Configurable paths
	var config = {
		app: 'app',
		dist: 'dist',
	};
	
	// Define the configuration for all the tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// Project settings
		config: config,
		
		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['bower', 'wiredep'],
			},
			babel: {
				files: ['<%= config.app %>/scripts/{,*/}*.js'],
				tasks: ['babel:dist'],
			},
			gruntfile: {
				files: ['Gruntfile.js'],
			},
			sass: {
				files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
				tasks: ['sass', 'postcss'],
			},
			styles: {
				files: ['<%= config.app %>/styles/{,*/}*.css'],
				tasks: ['newer:copy:styles', 'postcss'],
			},
		},
		
		
		browserSync: {
			options: {
				background: true,
				open: false,
				watchOptions: { ignored: '' },
			},
			
			livereload: {
				options: {
					files: [
						'<%= config.app %>/{,*/}*.html',
						'.tmp/styles/{,*/}*.css',
						'<%= config.app %>/images/{,*/}*',
						'.tmp/scripts/{,*/}*.js',
					],
					port: 9000,
					server: {
						baseDir: ['.tmp', config.app],
						routes: {
							'/bower_components': './bower_components',
						},
					},
				},
			},
			
			test: {
				options: {
					port: 9001,
					logLevel: 'silent',
					host: 'localhost',
					server: {
						baseDir: ['.tmp', './test', config.app],
						routes: {
							'/bower_components': './bower_components',
						},
					},
				},
			},
			
			dist: {
				options: {
					background: false,
					server: '<%= config.dist %>',
				},
			},
		},
		
		
		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= config.dist %>/*',
						'!<%= config.dist %>/.git*',
					],
				}],
			},
			
			server: '.tmp',
		},
		
		
		// Make sure code styles are up to par and there are no obvious mistakes
		eslint: {
			target: [
				'Gruntfile.js',
				'<%= config.app %>/scripts/{,*/}*.js',
				'!<%= config.app %>/scripts/vendor/*',
				'test/spec/{,*/}*.js',
			],
		},

		// Compiles ES6 with Babel
		babel: {
			options: {
				sourceMap: true,
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/scripts',
					src: '{,*/}*.js',
					dest: '.tmp/scripts',
					ext: '.js',
				}],
			},
			test: {
				files: [{
					expand: true,
					cwd: 'test/spec',
					src: '{,*/}*.js',
					dest: '.tmp/spec',
					ext: '.js',
				}],
			},
		},

		// Compiles Sass to CSS and generates necessary files if requested
		sass: {
			options: {
				sourceMap: true,
				sourceMapEmbed: true,
				sourceMapContents: true,
				includePaths: ['.'],
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/styles',
					src: ['*.{scss,sass}'],
					dest: '.tmp/styles',
					ext: '.css',
				}],
			},
		},

		postcss: {
			options: {
				map: true,
				processors: [
					// Add vendor prefixed styles
					require('autoprefixer')({
						browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
					}),
				],
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/styles/',
				}],
			},
		},

		// Automatically inject Bower components into the HTML file
		wiredep: {
			app: {
				src: ['<%= config.app %>/index.html'],
				ignorePath: /^(\.\.\/)*\.\./,
			},
			sass: {
				src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
				ignorePath: /^(\.\.\/)+/,
			},
		},

		// Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
					'<%= config.dist %>/scripts/{,*/}*.js',
					'<%= config.dist %>/styles/{,*/}*.css',
					'<%= config.dist %>/images/{,*/}*.*',
					'<%= config.dist %>/styles/fonts/{,*/}*.*',
					'<%= config.dist %>/*.{ico,png}',
				],
			},
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			options: {
				root: ['.tmp/', 'app/', '.'],
				dest: '<%= config.dist %>',
				flow: {
					steps: {
						js: ['concat', 'uglifyjs'],
						css: ['concat', 'cssmin'],
					},
					post: {
						js: [
							{
								name: 'concat',
								createConfig: function (context, block) {
									context.options.generated.options = {
										sourceMap: true,
									};
								},
							},
							{
								name: 'uglify',
								createConfig: function (context, block) {
									context.options.generated.options = {
										banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
										sourceMapIn: '.tmp/concat/' + block.dest.replace('.js', '.js.map'),
										sourceMap: true,
									};
								},
							},
						],
						css: [
							{
								name: 'concat',
								createConfig: function (context, block) {
									context.options.generated.options = {
										sourceMap: true,
									};
								},
							},
							{
								name: 'cssmin',
								createConfig: function (context, block) {
									context.options.generated.options = {
										sourceMap: true,
									};
								},
							},
						],
					},
				},
			},
			html: '<%= config.app %>/index.html',
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: [
					'<%= config.dist %>',
					'<%= config.dist %>/images',
					'<%= config.dist %>/styles',
				],
			},
			html: ['<%= config.dist %>/{,*/}*.html'],
			css: ['<%= config.dist %>/styles/{,*/}*.css'],
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/images',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: '<%= config.dist %>/images',
				}],
			},
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/images',
					src: '{,*/}*.svg',
					dest: '<%= config.dist %>/images',
				}],
			},
		},

		htmlmin: {
			dist: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					conservativeCollapse: true,
					removeAttributeQuotes: true,
					removeCommentsFromCDATA: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					// true would impact styles with attribute selectors
					removeRedundantAttributes: false,
					useShortDoctype: true,
				},
				files: [{
					expand: true,
					cwd: '<%= config.dist %>',
					src: '{,*/}*.html',
					dest: '<%= config.dist %>',
				}],
			},
		},



		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.app %>',
					dest: '<%= config.dist %>',
					src: [
						'**',
						'!scripts/**',
						'!styles/**',
					],
				}],
			},
		},

		// Run some tasks in parallel to speed up build process
		concurrent: {
			server: [
				'babel:dist',
				'sass',
			],
			test: [
				'babel',
			],
			dist: [
				'babel',
				'sass',
				'imagemin',
				'svgmin',
			],
		},
		
		compress: {
			main: {
				options: {
					mode: 'gzip'
				},
				files: [{
					expand: true,
					cwd: 'dist',
					src: ['**', '!**/*.gzip'],
					dest: 'dist/',
					rename: function(dest, src) { return dest + src + '.gz'; }
				}]
			}
		},
		
		
		bower: {
			install: {},
		},
	});


	grunt.registerTask('serve', 'start the server and preview your app', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'browserSync:dist']);
		}

		grunt.task.run([
			'clean:server',
			'wiredep',
			'concurrent:server',
			'postcss',
			'browserSync:livereload',
			'watch',
		]);
	});

	grunt.registerTask('server', function (target) {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run([target ? ('serve:' + target) : 'serve']);
	});

	grunt.registerTask('test', function (target) {
		if (target !== 'watch') {
			grunt.task.run([
				'clean:server',
				'concurrent:test',
				'postcss',
			]);
		}

		grunt.task.run([
			'browserSync:test',
			//'mocha',
		]);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'bower',
		'wiredep',         // Merge includes from bower libs (js/css) into html
		'concurrent:dist', // Minimize app's svgs/images and convert app's ES6-js/scss to legacy-js/css
		'copy:dist',       // Copy app's files to dist
		'useminPrepare',   // Create concat, cssmin and uglify tasks
		'postcss',         // ???
		'concat',          // Concatenate generated and lib's js/css
		'cssmin',          // Minify css
		'uglify',          // Minify js
		'filerev',         // ???
		'usemin',          // 
		'htmlmin',
		'compress',
	]);

	grunt.registerTask('default', [
		'newer:eslint',
		'test',
		'build',
	]);
};
