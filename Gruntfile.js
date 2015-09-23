// Generated on 2015-09-22 using
// generator-webapp 1.1.0
'use strict';

module.exports = function (grunt) {
	// Automatically load required grunt tasks
	require('jit-grunt')(grunt, {
		useminPrepare: 'grunt-usemin',
		'bower-install-simple': 'grunt-bower-install-simple',
		'replace': 'grunt-text-replace',
	});
	
	
	
	// Define the configuration for all the tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//config: require('./app/scripts/config.js'),
		
		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['bower', 'wiredep'],
			},
			babel: {
				files: ['app/scripts/{,*/}*.js'],
				tasks: ['babel:dist'],
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: ['newer:eslint'],
			},
			sass: {
				files: ['app/styles/{,*/}*.{scss,sass}'],
				tasks: ['sass', 'postcss'],
			},
			styles: {
				files: ['app/styles/{,*/}*.css'],
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
						'app/{,*/}*.html',
						'.tmp/styles/{,*/}*.css',
						'app/images/{,*/}*',
						'.tmp/scripts/{,*/}*.js',
					],
					port: 9000,
					server: {
						baseDir: ['.tmp', 'app'],
						routes: {
							'/bower_components': './bower_components',
						},
					},
				},
			},
			
			dist: {
				options: {
					background: false,
					server: 'dist',
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
						'dist/*',
						'!dist/.git*',
					],
				}],
			},
			
			server: '.tmp',
		},
		
		
		// Make sure code styles are up to par and there are no obvious mistakes
		eslint: {
			target: [
				'Gruntfile.js',
				'app/scripts/{,*/}*.js',
				'!app/scripts/vendor/*',
				'test/spec/{,*/}*.js',
			],
		},
		
		
		// @ToDo Hm, it doesn't help with require and modules. Needed?
		// Compiles ES6 with Babel
		babel: {
			options: {
				sourceMap: true,
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'app/scripts',
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
					cwd: 'app/styles',
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
				src: ['app/index.html'],
				ignorePath: /^(\.\.\/)*\.\./,
			},
			sass: {
				src: ['app/styles/{,*/}*.{scss,sass}'],
				ignorePath: /^(\.\.\/)+/,
			},
		},
		
		
		// Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
					'dist/scripts/{,*/}*.js',
					'dist/styles/{,*/}*.css',
					'dist/images/{,*/}*.*',
					'dist/styles/fonts/{,*/}*.*',
					'dist/*.{ico,png}',
				],
			},
		},
		
		
		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			options: {
				root: ['.tmp/', 'app/', '.'],
				dest: 'dist',
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
			html: 'app/index.html',
		},
		
		
		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: [
					'dist',
					'dist/images',
					'dist/styles',
				],
			},
			html: ['dist/{,*/}*.html'],
			css: ['dist/styles/{,*/}*.css'],
		},
		
		
		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'app/images',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: 'dist/images',
				}],
			},
		},
		
		
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'app/images',
					src: '{,*/}*.svg',
					dest: 'dist/images',
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
					cwd: 'dist',
					src: '{,*/}*.html',
					dest: 'dist',
				}],
			},
		},
		
		
		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'app',
					dest: 'dist',
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
			server: ['babel:dist', 'sass'],
			dist:   ['babel'     , 'sass', 'imagemin', 'svgmin'],
		},
		
		
		compress: {
			main: {
				files: [{
					expand: true,
					cwd: 'dist',
					src: ['**'],
					dest: 'dist/',
					ext: function(dest, src) { return src + '.gz'; },
				}],
			},
		},
		
		
		replace: {
			main: {
				src: ['dist/index.html'],
				overwrite: true,
				replacements: [
					//{ from: '__site-name__',  to: '<%- config.siteName %>' },
					{ from: '__build-date__', to: '<%- grunt.template.today("yyyy-mm-dd") %>' },
				],
			},
		},
		
		'bower-install-simple': { install: {} },
	});


	// When called "grunt" or "grunt default"
	grunt.registerTask('default', [
		'newer:eslint',
		'clean:dist',
		'bower-install-simple',
		'wiredep',          // Merge includes from bower libs (js/css) into html
		'concurrent:dist',  // Minimize app's svgs/images and convert app's ES6-js/scss to legacy-js/css
		'copy:dist',        // Copy app's files to dist
		'replace',
		'useminPrepare',    // Create concat, cssmin and uglify tasks
		'postcss',          // ???
		'concat:generated', // Concatenate generated and lib's js/css
		'cssmin:generated', // Minify css
		'uglify:generated', // Minify js
		'filerev',          // ???
		'usemin',           // 
		'htmlmin',
		'compress',
	]);
	
	// When called "grunt serve:dist"
	grunt.registerTask('serve:dist', [
		'default',
		'browserSync:dist',
	]);
	
	// When called "grunt serve:dev"
	grunt.registerTask('serve:dev', [
		'clean:server',
		'wiredep',
		'concurrent:server',
		'postcss',
		'browserSync:livereload',
		'watch',
	]);
};
