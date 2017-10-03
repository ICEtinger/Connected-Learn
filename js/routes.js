angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('mainMenu', {
    url: '/menu',
    templateUrl: 'templates/mainMenu.html',
    controller: 'mainMenuCtrl'
  })

  .state('connect', {
    url: '/connect',
    templateUrl: 'templates/connect.html',
    controller: 'connectCtrl'
  })

  .state('practice', {
    url: '/practice',
    templateUrl: 'templates/practice.html',
    controller: 'practiceCtrl'
  })

  .state('statistics', {
    url: '/page17',
    templateUrl: 'templates/statistics.html',
    controller: 'statisticsCtrl'
  })

  .state('question1', {
    url: '/question',
    templateUrl: 'templates/question1.html',
    controller: 'question1Ctrl'
  })

  .state('connectPreferences', {
    url: '/connectPreferences',
    templateUrl: 'templates/connectPreferences.html',
    controller: 'connectPreferencesCtrl'
  })

  .state('practicePreferences', {
    url: '/practicePreferences1',
    templateUrl: 'templates/practicePreferences.html',
    controller: 'practicePreferencesCtrl'
  })

  .state('practicePreferences2', {
    url: '/practicePreferences2',
    templateUrl: 'templates/practicePreferences2.html',
    controller: 'practicePreferences2Ctrl'
  })

  .state('practicePreferences3', {
    url: '/practicePreferences3',
    templateUrl: 'templates/practicePreferences3.html',
    controller: 'practicePreferences3Ctrl'
  })

  .state('practicePreferences4', {
      url: '/practicePreferences4',
      templateUrl: 'templates/practicePreferences4.html',
      controller: 'practicePreferences4Ctrl'
  })

  .state('practicePreferencesMultipage', {
      url: '/practicePreferencesMultipage',
      templateUrl: 'templates/practicePreferencesMultipage.html',
      controller: 'practicePreferencesMultipageCtrl'
  })

  .state('tutors', {
    url: '/tutors',
    templateUrl: 'templates/tutors.html',
    controller: 'tutorsCtrl'
  })

  .state('connectCourses', {
    url: '/page10',
    templateUrl: 'templates/connectCourses.html',
    controller: 'connectCoursesCtrl'
  })

  .state('connectWithStudents', {
    url: '/connectWithStudents',
    templateUrl: 'templates/connectWithStudents.html',
    controller: 'connectWithStudentsCtrl'
  })

  .state('availableTime', {
    url: '/page5',
    templateUrl: 'templates/availableTime.html',
    controller: 'availableTimeCtrl'
  })

  .state('subjectOfInterest', {
    url: '/page6',
    templateUrl: 'templates/subjectOfInterest.html',
    controller: 'subjectOfInterestCtrl'
  })

  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'mapCtrl'
  })

$urlRouterProvider.otherwise('/login')


});