
function getTutorsFromPreferences(s1, s2, s3, s4, s5, s6, s7, e1, e2, e3, e4, e5, e6, e7, latitude, longitude, level, subjectPreferences) {
    const diffDegrees = 1000; // 0.1 latitude degree corresponds to a 11.1 km distance.
    function hasIntersection(tutorSubjects, subjectPreferences) {
        for (var k in subjectPreferences) {
            if (subjectPreferences[k].v && typeof tutorSubjects[subjectPreferences[k].text] !== 'undefined')
                return true;
        }
        return false;
    }
    return firebase.database().ref('tutors').orderByChild("latitude").startAt(latitude - diffDegrees).endAt(latitude + diffDegrees).once('value').then(function (snapshot) {
        const val = snapshot.val();
        console.log('Tutors: ', val);
        var suitableTutors = [];
        for (tutorInd in val) {
            const tutor = val[tutorInd];
            //suitableTutors.push(tutor);
            if (
                Math.abs(tutor['longitude'] - longitude) < diffDegrees // location
                && (tutor.s1 < e1 && tutor.e1 > s1 ||                  // time
                    tutor.s2 < e2 && tutor.e2 > s2 ||
                    tutor.s3 < e3 && tutor.e3 > s3 ||
                    tutor.s4 < e4 && tutor.e4 > s4 ||
                    tutor.s5 < e5 && tutor.e5 > s5 ||
                    tutor.s6 < e6 && tutor.e6 > s6 ||
                    tutor.s7 < e7 && tutor.e7 > s7) 
                && typeof tutor[level] !== 'undefined'                 // educational level of interest
                && hasIntersection(tutor.subj, subjectPreferences)     // subject of interest
                )
            {
                // if all conditions are met, then add the tutor to the list of suitable tutors.
                suitableTutors.push(tutor);
            }
        }
        console.log(suitableTutors);
        return suitableTutors;
    });
}

function addAnswer(userId, questionPath, questionId, val) {
    console.log('ID:::::::::: ', questionId);
    console.log('received variables: ', userId, questionPath, questionId, val);
    firebase.database().ref('answersByUsers/' + userId + '/' + questionPath + '/' + questionId).set({
        correct : val
  });
}

// register a new user by inserting an object representing the subject tree into a folder with the user id in Firebase.
function registerUser(userId, objectToInsert) {
    console.log('inserted  ', 'answersByUsers/' + userId);
    firebase.database().ref('answersByUsers/' + userId).set(
        objectToInsert
    );
}

function getAllAnswersFromUser(userId) {
    return firebase.database().ref('answersByUsers/' + userId).once('value').then(function (snapshot) {
        console.log('All the answers from that user are: ', snapshot.val());
        return snapshot.val();
    });
}
/*
function getAnswerListFromUser(userId, questPref1, questPref2, questPref3) {
    return firebase.database().ref('answersByUsers/' + userId + '/' + questPref1 + '/' + questPref2 + '/' + questPref3).once('value').then(function (snapshot) {
        console.log('the answer list for the user is: ', snapshot.val());
        return snapshot.val();
    });
}
*/
// Searches in Firebase by selected subjects and return the index of the question whose rate of correct answers is the nearest to the user.
// or -1 if there is no question that the user has never answered before.
function getOptimalQuestionIndex(userId, questPref1, questPref2, questPref3, questPref4String) {
    const questPref4 = JSON.parse(questPref4String);
    //console.log('/questionIndexes/' + questPref1 + '/' + questPref2 + '/' + questPref3, 'questPref4: ', questPref4);
    /*
    const userAnswerListPromise = getAnswerListFromUser(UserId, questPref1, questPref2, questPref3);
    console.log('PRINTING ANSWERS', userAnswerList);
    for (var subject in userAnswerList) {
        console.log('subject ', subject, 'has answer ', userAnswerList[subject]);
    }
    */
    return firebase.database().ref('answersByUsers/' + userId + '/' + questPref1 + '/' + questPref2 + '/' + questPref3).once('value').then(function (snapshot) {
        const userAnswerList = snapshot.val();
        //console.log('the answer list for the user is: ', userAnswerList);
        //console.log('PRINTING ANSWERS');
        //for (var subject in userAnswerList) {
        //    console.log('subject ', subject, 'has answer ', userAnswerList[subject]);
        //}

        return firebase.database().ref('/questionIndexes/' + questPref1 + '/' + questPref2 + '/' + questPref3).once('value').then(function (snapshot) {
            //console.log('/questionIndexes/' + questPref1 + '/' + questPref2 + '/' + questPref3, snapshot.val()); //= { Cinemática: {6: 0.1}, Eletromagnetismo: {1: 0.2, 5: 0.3}, ... }
            const userRate = 0.16 // the rate of corrent answers by the user. 
            var rateDiff = 1.0 // the difference between the rate of correct answers [of the user] and [of the question].  
            var indexBestQuestion = -1; // The index of the question whose rate is the nearest to the user
            // if it remains -1, it means there is no question that the user has never answered before.
            var subjectForPath = '';
            for (var subject in snapshot.val()) {
                if (questPref4[subject].selected) {
                    for (var index in snapshot.val()[subject]) {
                        // only considers questions that were not already answered by the user.
                        if (!(userAnswerList && userAnswerList[subject] && typeof userAnswerList[subject][index] !== 'undefined')) {

                            var diff = Math.abs(snapshot.val()[subject][index] - userRate);
                            if (diff < 0.1) {
                                // if the difference of rates is lower than 0.1, it is assumed that the index is a "good enough" result,
                                // and it simply returns the current index without having to go through the rest of the possible questions.
                                return {
                                    'index': index,
                                    'questionPath': questPref1 + '/' + questPref2 + '/' + questPref3 + '/' + subject, //use this to search in Firebase
                                    'formattedPath': questPref1 + ' > ' + questPref2 + ' > ' + questPref3 + ' > ' + subject //print this to the user see.
                                };
                            }
                            if (diff < rateDiff) {
                                rateDiff = diff;
                                indexBestQuestion = index;
                                subjectForPath = subject;
                            }
                        }
                    }
                }
            }
            return {
                'index': indexBestQuestion,
                'questionPath': questPref1 + '/' + questPref2 + '/' + questPref3 + '/' + subjectForPath, //use this to search in Firebase
                'formattedPath': questPref1 + ' > ' + questPref2 + ' > ' + questPref3 + ' > ' + subjectForPath //print this to the user see.
            };
        });
    });
    
}

// Searches in Firebase by a question index and return the question.
function getQuestionByIndex(qid) {
    
    //for geting value from matrix
    //return firebase.database().ref('/answers/user' + userID + '/' + questionID).once('value').then(function (snapshot) { return snapshot.val();              +1/0/-1

  	return firebase.database().ref('/questions/' + qid).once('value').then(function(snapshot) {

	  	var Q = {
	  		title : snapshot.val().year,
	  		text : snapshot.val().text,
	  		A: snapshot.val().A,
	  		B : snapshot.val().B,
	  		C : snapshot.val().C,
	  		D: snapshot.val().D,
	  		E: snapshot.val().E,
            correct : snapshot.val().correct
	  	}

	  	//console.log(Q);
	  	return Q;
	});
}