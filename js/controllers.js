var global = {};
//global.correct = 7;
//global.incorrect = 4;
//global.skipped = 3;
global.q_id = 0;
var userID;

const SubjectsJson = {
    "Vestibular & Enem": { 
        "ITA": {
            "Matemática": { "Álgebra": true, "Geometria": true, "Combinatória": true, "Teoria dos números": true },
            "Física": { "Mecânica geral": true, "Cinemática": true, "Electromagnetismo": true, "Termodinâmica": true, "Física moderna": true, "Ondulatória": true }
        },
        "IME": {
            "Matemática": { "Álgebra": true, "Geometria": true, "Combinatória": true, "Teoria dos números": true },
            "Física": { "Mecânica geral": true, "Cinemática": true, "Electromagnetismo": true, "Termodinâmica": true, "Física moderna": true, "Ondulatória": true }
        }
    },
    "Concurso Público": {
        "Auditor Fiscal": {
            "Português": { "Álgebra": true, "Geometria": true, "Combinatória": true, "Teoria dos números": true },
            "Inglês": { "Mecânica geral": true, "Cinemática": true, "Electromagnetismo": true, "Termodinâmica": true, "Física moderna": true, "Ondulatória": true }
        },
        "Juiz": {
            "Português": { "Álgebra": true, "Geometria": true, "Combinatória": true, "Teoria dos números": true },
            "Inglês": { "Mecânica geral": true, "Cinemática": true, "Electromagnetismo": true, "Termodinâmica": true, "Física moderna": true, "Ondulatória": true }
        }
    }
}

const TutorSubjectsJson = [ // 'a' is the subject name, 'b' is whether it is selected if there are no cookies saved.
    { text: "Matemática", v: true },
    { text: "Física", v: true },
    { text: "Química", v: true },
    { text: "Biologia", v: true },
    { text: "História", v: true },
    { text: "Geografia", v: true },
    { text: "Português", v: true },
    { text: "Inglês", v: true },
    { text: "Filosofia", v: true },
    { text: "Sociologia", v: true },
    { text: "Arte", v: true },
    { text: "Computação", v: false },
    { text: "Medicina", v: false },
    { text: "Administração", v: false },
    { text: "Direito", v: false }
]

/*
    { Matemática: true },
    { Física: true },
    { Química: true },
    { História: true },
    { Geografia: true },
    { Biologia: true },
    { Português: true },
    { Filosofia: true },
    { Sociologia: true },
    { Arte: true },
    { Computação: false },
    { Medicina: false },
    { Administração: false },
    { Direito: false }
*/



angular.module('app.controllers', [])
  
.controller('loginCtrl', ['$scope', '$stateParams', '$rootScope',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $rootScope) {
    $scope.loginPage = true;

    // Initially sets the error message shown as an empty string.
    // It can be changed by the functions of the buttons when they are clicked.
    $scope.errorMessage = '';

    // Get elements
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    
    $scope.muda = function () {
        $scope.loginPage = false;
        console.log($scope.loginPage);
    }

    $scope.logOut = function () {
        firebase.auth().signOut().then(function () {
            $scope.loginPage = true;
            console.log('signed out');
            $scope.$apply();
        });
    }

    // Login function
    $rootScope.login = function () {
        // Get email and password
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();
        $scope.errorMessage = '';
        // Login
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise
            .then(a => {
                $scope.loginPage = false;
                console.log('logged in');
                $scope.$apply();
            })
            .catch(e => {
            console.log(e.message);
            console.log(e.code);
            switch (e.code) {
                case 'auth/invalid-email':
                    $scope.errorMessage = 'Digite um email no formato "nome@exemplo.com".';
                    break;
                case 'auth/user-not-found':
                    $scope.errorMessage = 'Nenhum usuário com esse email. Clique em "Se cadastrar" para criar outra conta.';
                    break;
                case 'auth/wrong-password':
                    $scope.errorMessage = 'Senha incorreta. Clique em "Se cadastrar" para criar outra conta.';
                    break;
                default:
                    $scope.errorMessage = 'Erro de conexão. Reconecte a internet e tente novamente.';
            }
            $scope.$apply();
        });
    };

    // Register function
    $rootScope.register = function () {
        // Get email and password
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();
        $scope.errorMessage = '';
        // Register new user
        const promise = auth.createUserWithEmailAndPassword(email, password);
        promise
            .then(a => {
                $scope.loginPage = false;
                console.log($scope.loginPage);
                console.log('registered');
                //registerUser($rootScope.userId, SubjectsJson);
                //$.mobile.changePage('../templates/mainMenu.html', { transition: "slideup", changeHash: false });
                //$(location).attr('href', '../templates/mainMenu.html');
                $scope.$apply();
            })
            .catch(e => {
                switch  (e.code) {
                    case 'auth/invalid-email':
                        $scope.errorMessage = 'Digite um email no formato "nome@exemplo.com".';
                        break;
                    case 'auth/email-already-in-use':
                        $scope.errorMessage = 'Email já em uso. Clique em "Entrar" ou em "Esqueci minha senha."';
                        break;
                    case 'auth/weak-password':
                        $scope.errorMessage = 'Senha deve ter ao mínimo 6 caracteres.';
                        break;
                    default:
                        $scope.errorMessage = 'Erro de conexão. Reconecte a internet e tente novamente.';
                }
                console.log(e.message);
                console.log(e.code);
                console.log("a");
                $scope.$apply();
        });
    };

    // Change-password function
    $rootScope.changePassword = function () {
        // Get email
        const email = txtEmail.value;
        const auth = firebase.auth();
        // Send email to change password  
        const promise = auth.sendPasswordResetEmail(email)
        //not working: // promise.addOnSuccessListener(s => { console.log('success'); });
        promise
            .then(a => { $scope.errorMessage = 'Email enviado com sucesso! Verifique sua caixa de emails para mudar sua senha.'; $scope.$apply(); })
            .catch(e => {
            console.log(e.message);
            console.log(e.code);
            switch  (e.code) {
                case 'auth/invalid-email':
                    $scope.errorMessage = 'Digite um email no formato "nome@exemplo.com".';
                    break;
                case 'auth/user-not-found':
                    $scope.errorMessage = 'Nenhum usuário com esse email. Clique em "Se cadastrar" para criar outra conta.';
                    break;
                default:
                    $scope.errorMessage = 'Erro de conexão. Reconecte a internet e tente novamente.';
            }
            $scope.$apply();
        });
        
    };

    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            $scope.loginPage = false;
            console.log('trocou', $scope.loginPage);
            console.log(firebaseUser.uid);
            $rootScope.userId = firebaseUser.uid;
            userID = firebaseUser.uid;
        } else {
            console.log('not logged in');
        }
    });


}])
   
.controller('mainMenuCtrl', ['$scope', '$rootScope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $stateParams) {
    // loads the question preferences of the user if they are already defined (i.e.: if the user has set preferences at least once).
    /*
    if (typeof $rootScope.questionsPref1 !== 'undefined') {
        if (typeof (Storage) !== "undefined") {
            localStorage

            // Store
            //localStorage.setItem("lastname", "Smith");
            // Retrieve
            console.log(localStorage.getItem("lastname"));
        } else {
            console.log("Sorry, your browser does not support Web Storage...");
        }
    }
    */
}])
   
.controller('connectCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   /*
.controller('practiceCtrl', ['$rootScope', '$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($rootScope, $scope, $stateParams) {
    console.log(firebase.auth().currentUser.uid);

}])
    */
.controller('practiceCtrl', function ($scope) {
    $scope.$on('$ionicView.enter', function () {
        // Code you want executed every time view is opened
        console.log(firebase.auth().currentUser.uid);
    })
})









   
.controller('statisticsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Questions');
        data.addColumn('number', 'Slices');

        var correctQuestionsCount = 0;
        var incorrectQuestionsCount = 0;
        //console.log(getAllAnswersFromUser(userID));
        console.log(firebase.auth().currentUser.uid);
        getAllAnswersFromUser(firebase.auth().currentUser.uid).then(function (answersJson) {
            for (var type in answersJson) {
                const byType = answersJson[type];
                for (var institution in byType) {
                    const byInstitution = byType[institution];
                    for (var subject in byInstitution) {
                        const bySubject = byInstitution[subject];
                        for (var subSubject in bySubject) {
                            const bySubSubject = bySubject[subSubject];
                            for (var question in bySubSubject) {
                                if (bySubSubject[question].correct)
                                    ++correctQuestionsCount;
                                else
                                    ++incorrectQuestionsCount;
                            }
                        }
                    }
                }
            }
            console.log('correct', correctQuestionsCount, 'incorrect', incorrectQuestionsCount);

            data.addRows([
                ['Respostas corretas: ' + correctQuestionsCount, correctQuestionsCount],
                ['Respostas incorretas ' + incorrectQuestionsCount, incorrectQuestionsCount],
            ]);

            // Set chart options
            console.log($(document).width(), $(window).width(), screen.width);
            const options = {
                'title': 'CorrectVsIncorrect',
                'width': 600, //$(document).width()
                'height': 200,
                'fontSize':15,
                'chartArea': { left: 0, top: 0, width: "50%", height: "100%" },
                'legend': {position: 'right', textStyle: {fontSize: 20}},
                'is3D': false
            };

            // Instantiate and draw our chart, passing in some options.
            var my_div = document.getElementById('chart_div');
            var my_chart = new google.visualization.PieChart(chart_div);

            google.visualization.events.addListener(my_chart, 'ready', function () {
                my_div.innerHTML = '<img src="' + my_chart.getImageURI() + '">';
            });

            my_chart.draw(data, options);

        });
        
    }
}])
   
.controller('question1Ctrl', ['$scope', '$rootScope', '$stateParams', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $stateParams, $state) {

    //console.log('the user current. ', firebase.auth().currentUser);
    //console.log('the user id is. ', firebase.auth().currentUser.uid);

    function getCookie(name) {
        match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match) return match[1];
    }

    console.log(document.cookie);
    const questPref1 = getCookie('questPref1');
    const questPref2 = getCookie('questPref2');
    const questPref3 = getCookie('questPref3');
    const questPref4 = getCookie('questPref4');
    console.log('received cookies: ', questPref1, questPref2, questPref3, questPref4);

    var Q = {};
    var path = '';
    //console.log(firebase.auth().currentUser.uid);
    console.log(firebase.auth().currentUser);
    //var userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : getCookie("userId");
    var sessionStorageUserId = sessionStorage.getItem('userId');
    if (sessionStorageUserId == null) 
        sessionStorageUserId = firebase.auth().currentUser.uid;
    getOptimalQuestionIndex(sessionStorageUserId, questPref1, questPref2, questPref3, questPref4).then(function (questIndex) {
        getQuestionByIndex(questIndex.index).then(function (R) {
            // sets the question ID.
            $rootScope.qid = questIndex.index;
            // sets the path of the question for registering later.
            path = questIndex.questionPath;
            //console.log(questIndex, 'chosen question ', questIndex.index, 'path ', questIndex.questionPath);
            global.q_id = $rootScope.qid; ///////////
            // displays the question queried from the Database
            Q=R;
            document.getElementById('question1-text').innerHTML = Q.text;
            document.getElementById('question1-title').innerHTML = '<strong>' + questIndex.formattedPath + ' (' + Q.title + ')' + '</strong>';
            document.getElementById('alternative_A').innerHTML = Q.A;
            document.getElementById('alternative_B').innerHTML = Q.B;
            document.getElementById('alternative_C').innerHTML = Q.C;
            document.getElementById('alternative_D').innerHTML = Q.D;
            document.getElementById('alternative_E').innerHTML = Q.E;
        });
    });
    
    answer=false;
    
    $scope.debug = function () {
        console.log('the path is ', path, 'and the applied preferences are ', questPref1, questPref2, questPref3, questPref4);
        console.log(userID, firebase.auth().currentUser.uid, sessionStorageUserId);
        console.log('AAAA the USER ID is', firebase.auth().currentUser.uid); //$rootScope.userId
        //console.log(firebase.auth().currentUser.uid, path, $rootScope.qid, answer);
        //addAnswer(firebase.auth().currentUser.uid, path, $rootScope.qid, answer);
        //$rootScope.nextQuestion();
    }

    $rootScope.nextQuestion = function () {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAathe path is ', path);
        addAnswer(firebase.auth().currentUser.uid, path, $rootScope.qid, answer);
        //sessionStorage.setItem('userId', $rootScope.userId);
        //document.cookie = "userId="+userId;
        sessionStorage.setItem("userId", sessionStorageUserId);
        location.reload();
        //$rootScope.userId = sessionStorage.getItem('userId');
        //update in question the no of ppl who answered 
    };

    $rootScope.correction=function(valueS){
        if(Q.correct != valueS){
            answer=false;
            //global.incorrect += 1;
        }else{
            answer=true;
            //global.correct += 1;
        }

        if(valueS == 1 && Q.correct != valueS) {
            document.getElementById('alternative_A').classList.remove('button-positive');
            document.getElementById('alternative_A').classList.add('button-assertive');
        } else if(valueS == 2 && Q.correct != valueS) {
            document.getElementById('alternative_B').classList.remove('button-positive');
            document.getElementById('alternative_B').classList.add('button-assertive');
        } else if(valueS == 3 && Q.correct != valueS) {
            document.getElementById('alternative_C').classList.remove('button-positive');
            document.getElementById('alternative_C').classList.add('button-assertive');
        } else if(valueS == 4 && Q.correct != valueS) {
            document.getElementById('alternative_D').classList.remove('button-positive');
            document.getElementById('alternative_D').classList.add('button-assertive');
        } else if (valueS == 5 && Q.correct != valueS) {
            document.getElementById('alternative_E').classList.remove('button-positive');
            document.getElementById('alternative_E').classList.add('button-assertive');
        }

        if(Q.correct == 1) {
            document.getElementById('alternative_A').classList.remove('button-positive');
            document.getElementById('alternative_A').classList.add('button-balanced');
        } else if(Q.correct == 2) {
            document.getElementById('alternative_B').classList.remove('button-positive');
            document.getElementById('alternative_B').classList.add('button-balanced');
        } else if(Q.correct == 3) {
            document.getElementById('alternative_C').classList.remove('button-positive');
            document.getElementById('alternative_C').classList.add('button-balanced');
        } else if(Q.correct == 4) {
            document.getElementById('alternative_D').classList.remove('button-positive');
            document.getElementById('alternative_D').classList.add('button-balanced');
        } else if(Q.correct == 5) {
        document.getElementById('alternative_E').classList.remove('button-positive');
        document.getElementById('alternative_E').classList.add('button-balanced');
        }

        // TODO call api to add answer + modify no of right/wrong ans to this question

        document.getElementById("alternative_A").disabled = true;
        document.getElementById("alternative_B").disabled = true;
        document.getElementById("alternative_C").disabled = true;
        document.getElementById("alternative_D").disabled = true;
        document.getElementById("alternative_E").disabled = true;

        document.getElementById('question1-button66').innerHTML = "Próxima";

    };

}])  
   
.controller('connectPreferencesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    /* JUST DEBUG
    $scope.$on('$ionicView.beforeEnter', function () {
        // Code you want executed every time view is opened
        const s2 = getCookie('s2');
        const e2 = getCookie('e2');
        console.log(document.cookie);
        console.log(s2, e2);
    })

    function getCookie(name) {
        match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match) return match[1];
    }
    */

}])
   
.controller('practicePreferencesCtrl', ['$scope', '$rootScope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $stateParams) {

    function getCookie(name) {
        match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match) return match[1];
    }

    $scope.$on('$ionicView.beforeEnter', function () {
        // Code to execute every time view is opened.
        console.log('INIT!!!');
        $scope.subjectsList = Object.keys(SubjectsJson);
        const questPref1 = getCookie('questPref1');
        //console.log(getCookie('thereIsNoSuch'));
        $scope.data = { 'chosenSubject': (questPref1 ? questPref1 : '') };
        $rootScope.questionsPref1 = $scope.data.chosenSubject;
    })
    //$scope.init();
    //$timeout($scope.init());

    $scope.optionChange = function (item) {
        $rootScope.questionsPref1 = $scope.data.chosenSubject
    };

    $rootScope.nextToPreferences2 = function () {
        $rootScope.questionsPref1 = $scope.data.chosenSubject;
    }

    $rootScope.show1 = function () {
        console.log($scope.data.chosenSubject, '1:', $rootScope.questionsPref1, '2:', $rootScope.questionsPref2, '3:', $rootScope.questionsPref3, 'user:', firebase.auth().currentUser.uid);
    }

}])
   
.controller('practicePreferences2Ctrl', ['$scope', '$rootScope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $stateParams) {

    function getCookie(name) {
        match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match) return match[1];
    }

    // initializes the scope's variables.
    $scope.$on('$ionicView.beforeEnter', function () {
        // Code to execute every time view is opened.
        console.log('init 2');
        const questPref1 = getCookie('questPref1');
        const questPref2 = getCookie('questPref2');
        //$scope.data = { 'chosenSubject': (questPref1 ? questPref1 : '') };
        $rootScope.subjectsList2 = Object.keys(SubjectsJson[$rootScope.questionsPref1]);
        console.log('a', $rootScope.subjectsList2);
        console.log('b', Object.keys(SubjectsJson[$rootScope.questionsPref1]));
        $scope.data = { 'chosenSubject2': ($rootScope.questionsPref1 != questPref1 ? '' : questPref2) };
        $rootScope.questionsPref2 = $scope.data.chosenSubject2;
        $scope.path = $rootScope.questionsPref1;
    })
    // better than the previous implementation: $scope.$apply($scope.init());

    $scope.optionChange2 = function (item) {
        $rootScope.questionsPref2 = $scope.data.chosenSubject2;
    };

    $rootScope.nextToPreferences3 = function () {
        $rootScope.questionsPref2 = $scope.data.chosenSubject2;
    }

    $rootScope.show2 = function () {
        console.log($scope.data.chosenSubject2, $rootScope.questionsPref1, $rootScope.questionsPref2, $rootScope.questionsPref3, $rootScope.subjectsList2, Object.keys(SubjectsJson[$rootScope.questionsPref1]), '2', $rootScope.appliedQuestionsPref1);
    }

}])
   
.controller('practicePreferences3Ctrl', ['$scope', '$rootScope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $stateParams) {

    function getCookie(name) {
        match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match) return match[1];
    }

    // initializes the scope's variables.
    $scope.$on('$ionicView.beforeEnter', function () {
        // Code to execute every time view is opened.
        console.log('init 3');
        const questPref1 = getCookie('questPref1');
        const questPref2 = getCookie('questPref2');
        const questPref3 = getCookie('questPref3');
        $rootScope.subjectsList3 = Object.keys(SubjectsJson[$rootScope.questionsPref1][$rootScope.questionsPref2]);
        $scope.data = { 'chosenSubject3': ($rootScope.questionsPref1 != questPref1 || $rootScope.questionsPref2 != questPref2 ? '' : questPref3) };
        $rootScope.questionsPref3 = $scope.data.chosenSubject3;
        $scope.path = $rootScope.questionsPref1 + ' > ' + $rootScope.questionsPref2;
    })

    //$timeout($scope.init());

    $scope.optionChange3 = function (item) {
        $rootScope.questionsPref3 = $scope.data.chosenSubject3;
    };

    $rootScope.nextToPreferences4 = function () {
        $rootScope.questionsPref3 = $scope.data.chosenSubject3;
    }

    $rootScope.show3 = function () {
        console.log($scope.data.chosenSubject3, $rootScope.questionsPref1, $rootScope.questionsPref2, $rootScope.questionsPref3, $scope.subjectsList2, '2');
    }

}])

.controller('practicePreferences4Ctrl', ['$timeout', '$scope', '$rootScope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($timeout, $scope, $rootScope, $stateParams) {

    function getCookie(name) {
        match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match) return match[1];
    }

    // initializes the scope's variables.
    $scope.$on('$ionicView.beforeEnter', function () {
        // Code to execute every time view is opened.
        console.log($rootScope.questionsPref1, $rootScope.questionsPref2, $rootScope.questionsPref3);
        $scope.path = $rootScope.questionsPref1 + ' > ' + $rootScope.questionsPref2 + ' > ' + $rootScope.questionsPref3;
        $scope.message = 'selecione quantas opções desejar';
        const questPref1 = getCookie('questPref1');
        const questPref2 = getCookie('questPref2');
        const questPref3 = getCookie('questPref3');
        const questPref4string = getCookie('questPref4');
        const questPref4 = (questPref4string ? JSON.parse(questPref4string) : null);
        const subjects = SubjectsJson[$rootScope.questionsPref1][$rootScope.questionsPref2][$rootScope.questionsPref3];
        // e.g.: subjects = { "Algebra":true, "Geometry":true, "Number Theory":true }
        console.log(questPref4);
        console.log(subjects);
        $scope.subjectsList4 = {};
        // if there is no saved question preferences for the 4th level option or if the user just changed the 1st, 2nd or 3rd level options.
        if ($rootScope.questionsPref1 != questPref1 || $rootScope.questionsPref2 != questPref2 || $rootScope.questionsPref3 != questPref3) {
            for (var k in subjects) {
                $scope.subjectsList4[k] = { 'text': k, 'selected': true };
            }
        } else {
            for (var k in subjects) {
                console.log(k, questPref4);
                $scope.subjectsList4[k] = { 'text': k, 'selected': questPref4[k].selected };
            }
        }
        console.log($scope.subjectsList4);
        // e.g.: $scope.subjectsList4 = {"Algebra":{{"text":"Albegra"}, {"selected":"true"}}, ...}
        $rootScope.questionsPref4 = $scope.subjectsList4;
    })

    //$timeout($scope.init());

    $scope.optionChange4 = function (item) {
        $rootScope.questionsPref4 = $scope.subjectsList4;
        // Checks if at least one option is selected, and shows the "apply" button if and only if at least one option is selected.
        var flagAtLeastOneSubjectSelected = false;
        for (var k in $scope.subjectsList4) {
            if ($scope.subjectsList4[k].selected) {
                flagAtLeastOneSubjectSelected = true;
            } 
        }
        if (flagAtLeastOneSubjectSelected) {
            btnApply.classList.remove('hide');
            $scope.message = 'selecione quantas opções desejar';
        } else {
            btnApply.classList.add('hide');
            $scope.message = 'selecione ao menos uma opção.';
        }
    };

    $rootScope.applyPreferences = function () {
        document.cookie = "questPref1=" + $rootScope.questionsPref1 + "; path=/";
        document.cookie = "questPref2=" + $rootScope.questionsPref2 + "; path=/";
        document.cookie = "questPref3=" + $rootScope.questionsPref3 + "; path=/";
        document.cookie = "questPref4=" + JSON.stringify($rootScope.questionsPref4) + "; path=/";
        console.log($rootScope.questionsPref4, '   and   ',
            "questPref4=" + $rootScope.questionsPref4 + "; path=/", '   and  ',
             "questPref4=" + JSON.stringify($rootScope.questionsPref4) + "; path=/");
    };

}])
   
.controller('practicePreferencesMultipageCtrl', ['$scope', '$rootScope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $stateParams) {
    $scope.pageNumber = 0;
    $scope.subjectSet1 = Object.keys(SubjectsJson);
    $scope.subjectPreferences = { 'a1Temp': (typeof $rootScope.appliedQuestionsPref1 === 'undefined' ? '' : $rootScope.appliedQuestionsPref1) };
    $scope.pageNumber = 1;
    // -- PAGE 1 --
    $scope.selectedChange1 = function (item) {
    };
    $scope.NextToPage2 = function () {
        $scope.subjectSet2 = Object.keys(SubjectsJson[$scope.subjectPreferences.a1Temp]);
        // sets the preference to the saved one if the user did not changed the last option. 
        $scope.subjectPreferences.a2 = ($scope.subjectPreferences.a1Temp == $rootScope.appliedQuestionsPref1 ? $rootScope.appliedQuestionsPref2 : '');
        // saves the chosen preference for the rest of the other pages (but will only be completely saved when "apply" is clicked.
        $scope.subjectPreferences.a1 = $scope.subjectPreferences.a1Temp;
        // go to the next page.
        $scope.pageNumber = 2;
    }
    // -- PAGE 2 --
    $scope.selectedChange2 = function (item) {
    };
    $scope.NextToPage3 = function () {
        $scope.subjectSet3 = Object.keys(SubjectsJson[$scope.subjectPreferences.a1][$scope.subjectPreferences.a2Temp]);
        // sets the preference to the saved one if the user did not changed the last option. 
        $scope.subjectPreferences.a3 = ($scope.subjectPreferences.a2 == $rootScope.appliedQuestionsPref2 ? $rootScope.appliedQuestionsPref3 : '');
        // saves the chosen preference for the rest of the other pages (but will only be completely saved when "apply" is clicked.
        $scope.subjectPreferences.a2 = $scope.subjectPreferences.a2Temp;
        // go to the next page.
        $scope.pageNumber = 3;
    }
    // -- PAGE 3 --
    $scope.selectedChange3 = function (item) {
    };
    $scope.NextToPage4 = function () {
        $scope.subjectSet4 = Object.keys(SubjectsJson[$scope.subjectPreferences.a1][$scope.subjectPreferences.a2][$scope.subjectPreferences.a3Temp]);
        // sets the preference to the saved one if the user did not changed the last option. 
        $scope.subjectPreferences.a4 = ($scope.subjectPreferences.a3 == $rootScope.appliedQuestionsPref3 ? $rootScope.appliedQuestionsPref4 : '');
        // saves the chosen preference for the rest of the other pages (but will only be completely saved when "apply" is clicked.
        $scope.subjectPreferences.a3 = $scope.subjectPreferences.a3Temp;
        // go to the next page.
        $scope.pageNumber = 4;

        $rootScope.appliedQuestionsPref1 = $scope.subjectPreferences.a1;
        $rootScope.appliedQuestionsPref2 = $scope.subjectPreferences.a2;
        $rootScope.appliedQuestionsPref3 = $scope.subjectPreferences.a3;

    }


    $scope.applyPreferences = function () {
        // applies the question preferences that were just defined.
        $rootScope.appliedQuestionsPref1 = $rootScope.questionsPref1;
        $rootScope.appliedQuestionsPref2 = $rootScope.questionsPref2;
        $rootScope.appliedQuestionsPref3 = $rootScope.questionsPref3;
        $rootScope.appliedQuestionsPref4 = $rootScope.questionsPref4;
    };
    $scope.debug = function () {
        console.log($scope.subjectPreferences.a1, $scope.subjectPreferences.a2, $scope.subjectPreferences.a3);
    }

}])

.controller('tutorsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    // ascending order
    function SortByPrice(x, y) {
        return x.price - y.price;
    }

    function SortByName(x, y) {
        return ((x.name == y.name) ? 0 : ((x.name > y.name) ? 1 : -1));
    }

    $scope.$on('$ionicView.beforeEnter', function () {
        // Code to execute every time view is opened
        function getCookie(name) {
            match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            if (match) return match[1];
        }
        function cookieOrStart(name) {
            const cookieOrUndefined = getCookie(name);
            return (cookieOrUndefined ? parseInt(cookieOrUndefined) : 6);
        }
        function cookieOrEnd(name) {
            const cookieOrUndefined = getCookie(name);
            return (cookieOrUndefined ? parseInt(cookieOrUndefined) : 23);
        }

        $scope.sorting = { method: 'price' };
        const cookieOrUndefined = getCookie('level');
        console.log(cookieOrUndefined);
        console.log(document.cookie);
        level = (cookieOrUndefined ? cookieOrUndefined : 'level1');
        const cookieOrUndefined2 = getCookie('subjectOfInterest');
        subjectPreferences = (cookieOrUndefined2 ? JSON.parse(cookieOrUndefined2) : TutorSubjectsJson);
        getTutorsFromPreferences(
            cookieOrStart('s1'),
            cookieOrStart('s2'),
            cookieOrStart('s3'),
            cookieOrStart('s4'),
            cookieOrStart('s5'),
            cookieOrStart('s6'),
            cookieOrStart('s7'),
            cookieOrEnd('e1'),
            cookieOrEnd('e2'),
            cookieOrEnd('e3'),
            cookieOrEnd('e4'),
            cookieOrEnd('e5'),
            cookieOrEnd('e6'),
            cookieOrEnd('e7'),
            48,
            0,
            level,
            subjectPreferences
        ).then(function (suitableTutors) {
            $scope.tutorList = suitableTutors;
            $scope.tutorList.sort(SortByPrice);
            console.log($scope.tutorList);
            $scope.noOne = ! $scope.tutorList.length;
            //$scope.errorMessage = ($scope.tutorList.length ? '' : 'Não há nenhum professor com as preferências definidas. Vá em "Preferências" e tente mudar a localização, o horário disponível ou a área de interesse. <br><br> Se você gostaria de se inscrever como professor particular, mande um email para "MilContato@ProtonMail.com"!');
        })
        
    })

    $scope.$on('$ionicView.beforeLeave', function () {
        console.log($scope.tutorList);
        console.log('DEBUG', $scope.sorting.method);
    })
    
    $scope.optionChange = function (item) {
        switch($scope.sorting.method) {
            case 'price':
                
                $scope.tutorList.sort(SortByPrice);
                break;
            case 'name':
                $scope.tutorList.sort(SortByName);
                break;
            case 'distance':
                $scope.tutorList.sort(SortByDistance);
                break;
            default:
                $scope.tutorList.sort(SortByPrice);
        }
    }
    /*
    document.getElementById("tutor-select").addEventListener("change", function () {
        var selectedParameter = document.getElementById("tutor-select").value;
        var firstElement = $("#tutors-list-item1");
        $("#tutors-list-item1").replaceWith($("#tutors-list-item3"));
        firstElement.insertAfter($("#tutors-list-item2"));

        var fourthElement = $("#tutors-list-item4");
        $("#tutors-list-item4").replaceWith($("#tutors-list-item5"));
        fourthElement.insertAfter($("#tutors-list-item2"));
    });
    */
}])
   
.controller('connectCoursesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('availableTimeCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    $scope.$on('$ionicView.beforeEnter', function () {
        // Code to execute every time view is opened.
        function getCookie(name) {
            match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            if (match) return match[1];
        }
        // return2 the time saved in cookies if it is defined, or a default value if it is not.
        function getCookieOrStart(name) {
            const cookieOrUndefined = getCookie(name);
            return (cookieOrUndefined ? parseInt(cookieOrUndefined) : 6);
        }
        // return2 the time saved in cookies if it is defined, or a default value if it is not.
        function getCookieOrEnd(name) {
            const cookieOrUndefined = getCookie(name);
            return (cookieOrUndefined ? parseInt(cookieOrUndefined) : 23);
        }

        $scope.data = {};
        $scope.data.MondayStart = getCookieOrStart('s2');
        $scope.data.MondayEnd = getCookieOrEnd('e2');
        $scope.data.TuesdayStart = getCookieOrStart('s3');
        $scope.data.TuesdayEnd = getCookieOrEnd('e3');
        $scope.data.WednesdayStart = getCookieOrStart('s4');
        $scope.data.WednesdayEnd = getCookieOrEnd('e4');
        $scope.data.ThursdayStart = getCookieOrStart('s5');
        $scope.data.ThursdayEnd = getCookieOrEnd('e5');
        $scope.data.FridayStart = getCookieOrStart('s6');
        $scope.data.FridayEnd = getCookieOrEnd('e6');
        $scope.data.SaturdayStart = getCookieOrStart('s7');
        $scope.data.SaturdayEnd = getCookieOrEnd('e7');
        $scope.data.SundayStart = getCookieOrStart('s1');
        $scope.data.SundayEnd = getCookieOrEnd('e1');
    })
     
    $scope.MondayStartChange = function () { document.cookie = "s2=" + $scope.data.MondayStart + "; path=/"; }
    $scope.MondayEndChange = function () { document.cookie = "e2=" + $scope.data.MondayEnd + "; path=/"; }
    $scope.TuesdayStartChange = function () { document.cookie = "s3=" + $scope.data.TuesdayStart + "; path=/"; }
    $scope.TuesdayEndChange = function () { document.cookie = "e3=" + $scope.data.TuesdayEnd + "; path=/"; }
    $scope.WednesdayStartChange = function () { document.cookie = "s4=" + $scope.data.WednesdayStart + "; path=/"; }
    $scope.WednesdayEndChange = function () { document.cookie = "e4=" + $scope.data.WednesdayEnd + "; path=/"; }
    $scope.ThursdayStartChange = function () { document.cookie = "s5=" + $scope.data.ThursdayStart + "; path=/"; }
    $scope.ThursdayEndChange = function () { document.cookie = "e5=" + $scope.data.ThursdayEnd + "; path=/"; }
    $scope.FridayStartChange = function () { document.cookie = "s6=" + $scope.data.FridayStart + "; path=/"; }
    $scope.FridayEndChange = function () { document.cookie = "e6=" + $scope.data.FridayEnd + "; path=/"; }
    $scope.SaturdayStartChange = function () { document.cookie = "s7=" + $scope.data.SaturdayStart + "; path=/"; }
    $scope.SaturdayEndChange = function () { document.cookie = "e7=" + $scope.data.SaturdayEnd + "; path=/"; }
    $scope.SundayStartChange = function () { document.cookie = "s1=" + $scope.data.SundayStart + "; path=/"; }
    $scope.SundayEndChange = function () { document.cookie = "e1=" + $scope.data.SundayEnd + "; path=/"; }

    $scope.startingHours = [
        { value: 6, displayName: '6:00' },
        { value: 7, displayName: '7:00' },
        { value: 8, displayName: '8:00' },
        { value: 9, displayName: '9:00' },
        { value: 10, displayName: '10:00' },
        { value: 11, displayName: '11:00' },
        { value: 12, displayName: '12:00' },
        { value: 13, displayName: '13:00' },
        { value: 14, displayName: '14:00' },
        { value: 15, displayName: '15:00' },
        { value: 16, displayName: '16:00' },
        { value: 17, displayName: '17:00' },
        { value: 18, displayName: '18:00' },
        { value: 19, displayName: '19:00' },
        { value: 20, displayName: '20:00' },
        { value: 21, displayName: '21:00' },
        { value: 22, displayName: '22:00' },
    ]

    $scope.endingHours = [
        { value: 7, displayName: '7:00' },
        { value: 8, displayName: '8:00' },
        { value: 9, displayName: '9:00' },
        { value: 10, displayName: '10:00' },
        { value: 11, displayName: '11:00' },
        { value: 12, displayName: '12:00' },
        { value: 13, displayName: '13:00' },
        { value: 14, displayName: '14:00' },
        { value: 15, displayName: '15:00' },
        { value: 16, displayName: '16:00' },
        { value: 17, displayName: '17:00' },
        { value: 18, displayName: '18:00' },
        { value: 19, displayName: '19:00' },
        { value: 20, displayName: '20:00' },
        { value: 21, displayName: '21:00' },
        { value: 22, displayName: '22:00' },
        { value: 23, displayName: '23:00' }
    ]

    $scope.debug = function () {
        function getCookie(name) {
            match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            if (match) return match[1];
        }
        console.log(document.cookie);
        console.log(getCookie('s2'));
    }

}])
   
.controller('subjectOfInterestCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    function getCookie(name) {
        match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match) return match[1];
    }

    // initializes the scope's variables.
    $scope.$on('$ionicView.beforeEnter', function () {
        // Code to execute every time view is opened.
        $scope.levels = {
            level1: 'Vestibular',
            level2: 'Prova/trabalho da faculdade',
            level3: 'Concurso público'
        }
        const cookieOrUndefined = getCookie('level');
        $scope.sel = {selectedLevel : (cookieOrUndefined ? cookieOrUndefined : 'level1') };
        const cookieOrUndefined2 = getCookie('subjectOfInterest');
        $scope.subjectsList = (cookieOrUndefined2 ? JSON.parse(cookieOrUndefined2) : TutorSubjectsJson);
        console.log($scope.subjectsList);
    })

    $scope.$on('$ionicView.beforeLeave', function () {
        console.log($scope.sel.selectedLevel);
        document.cookie = "subjectOfInterest=" + JSON.stringify($scope.subjectsList) + "; path=/";
        document.cookie = "level=" + $scope.sel.selectedLevel + "; path=/";
        console.log(document.cookie);
    })

    //$timeout($scope.init());
    /*
    $rootScope.applyPreferences = function () {
        document.cookie = "questPref1=" + $rootScope.questionsPref1 + "; path=/";
        document.cookie = "questPref2=" + $rootScope.questionsPref2 + "; path=/";
        document.cookie = "questPref3=" + $rootScope.questionsPref3 + "; path=/";
        document.cookie = "questPref4=" + JSON.stringify($rootScope.questionsPref4) + "; path=/";
        console.log($rootScope.questionsPref4, '   and   ',
            "questPref4=" + $rootScope.questionsPref4 + "; path=/", '   and  ',
             "questPref4=" + JSON.stringify($rootScope.questionsPref4) + "; path=/");
    };
    */


}])
   
.controller('mapCtrl', ['$scope', 'uiGmapGoogleMapApi', function($scope, uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps){
        // Configuration needed to display the road-map with traffic
        // Displaying Ile-de-france (Paris neighbourhood)
        $scope.map = {
            center: {
              latitude: -23.598763,
              longitude: -46.676547
            },
            zoom: 13,
            options: {
                mapTypeId: google.maps.MapTypeId.ROADMAP, // This is an example of a variable that cannot be placed outside of uiGmapGooogleMapApi without forcing of calling the google.map helper outside of the function
                streetViewControl: false,
                mapTypeControl: false,
                scaleControl: false,
                rotateControl: false,
                zoomControl: false
            }, 
            showTraficLayer:true
        };
    });
}])
 