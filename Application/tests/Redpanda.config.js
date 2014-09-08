// Karma configuration
// Generated on Mon Jun 23 2014 16:05:57 GMT+0530 (IST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        '../../Library/jQuery/jquery-1.11.1.min.js',
		'../../Library/angularjs/angular.min.js',
		'../../Library/angularjs/angular-route.min.js',
		'../../Library/angularjs/angular-mocks.js', 
		'../../Library/angularjs/angular-cookies.min.js',
		'https://maps.googleapis.com/maps/api/js?key=AIzaSyCBF8c_gj70TqziWlHw3QjQpTqgJQquHZU',
		'../../Library/google_maps/lodash.js',
		'../../Library/google_maps/angular-google-maps.js',
		'../../Library/Calendar/calendar.js',
		'../../Library/bootstrap/ui-bootstrap-tpls-0.11.0.min.js',		
		'../../Library/ng-grid/ng-grid-2.0.7/ng-grid.min.js',
		'../Common/appShell.js',
		'../Manage/Customer/Customer.js',
		'../Manage/CustomerDetail/CustomerDetail.js',
		'../../Library/angularjs/upload.js',
		'../../Library/color_picker/bootstrap-colorpicker-module.js',
        '../../Library/jQuery_simple_color_picker/jquery.simplecolorpicker.js',
		'../Common/Components/googleMap/map.js',
		'../Manage/Contract/Contract.js',
		'../Manage/ContractDetail/ContractDetail.js',
		'../Manage/EmployeeDetail/EmployeeDetail.js',
		'../Manage/Employee/Employee.js',
		'../Common/Components/ngGridTable/table.js',
		'jasmine-standalone-1.3.0/spec/*.js'
		
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
