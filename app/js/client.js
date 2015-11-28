require('angular/angular');
var angular = window.angular;

var wordApp = angular.module('wordbreaker', []);
wordApp.controller('WordbreakerController', ['$scope', function($scope) {
	var mode;
	var answer = '';

  $scope.untriedLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  $scope.areUntriedLettersShown = true;

  $scope.toggleUntriedLetters = function() {
  	if($scope.areUntriedLettersShown) $scope.areUntriedLettersShown = false;
  	else $scope.areUntriedLettersShown = true;
  };

	//calling turns() increments it by one and returns it. calling turns(true) resets it to 0 and returns 0.
	var turns = function(reset) { 
		var turns = 0;
		return function(reset) {
			if (reset) return turns = 0;
			else return turns++;
		}
	}();

	$scope.newGame = function() {
		if ($('#newgame').html() == 'start the game') {
			answer = $('input[id="answer"]').val();
			if(answer != '') {
				if ($("input[id='hard']:checked").val()) mode = 'hard';
				if ($("input[id='normal']:checked").val()) mode = 'normal';
				$('input[id="answer"]').val('');
				turns(true);
				newGameDisplay(answer.length);
			} else {
				alert('You must enter an answer word to start the game.');
			}
		}
	};

	$scope.guess = function() {
		if(input != '' && answer != '') {
			var input = $('input[id="guessInput"]').val();
			for (i=0; i<input.length; i++) {
				removeFromUntried(input[i]);
			}
			$('input[id="guessInput"]').val('');
			$('#guessInput').select();
			var resObj = game(answer, input);
			if(resObj.gameOver) winner(resObj.arr);
			else {
				if(mode == 'hard') displayHard(resObj.arr);
				if(mode == 'normal') displayFeedback(resObj.arr);
			}
		}
	};

	function displayFeedback(resArray) {
		displayHistory();
		$('#feedback').html('');
		for (i=0; i<resArray.length; i++) {
			if (resArray[i][1] == '2') $('#feedback').append('<td class="full">' + resArray[i][0] + '</td>');
			if (resArray[i][1] == '1') $('#feedback').append('<td class="half">' + resArray[i][0] + '</td>');
			if (resArray[i][1] == '0') $('#feedback').append('<td class="none">' + resArray[i][0] + '</td>');
		}
	}

	function displayHard(resArray) {
		displayHistory();
		var hardArray = [];
		var lastGuess = '';
		for (i=0; i<resArray.length; i++) {
			lastGuess += resArray[i][0];
			hardArray.push(resArray[i][1]);
		}
		hardArray.sort(function(a, b){return b-a});
		$('#feedback').html('');
		$('#feedback').append('<td class="lastGuess">' + lastGuess + '</td>')
		for (i=0; i<hardArray.length; i++) {
			if (hardArray[i] == '2') $('#feedback').append('<td class="full"> </td>');
			if (hardArray[i] == '1') $('#feedback').append('<td class="half"> </td>');
			if (hardArray[i] == '0') $('#feedback').append('<td class="none"> </td>');
		}
	}

	function winner(resArray) {
		displayHistory();
		$('#feedback').html('');
		for (i=0; i<resArray.length; i++) {
			$('#feedback').append('<td class="full">' + resArray[i][0] + '</td>');
		}
		endGameDisplay();
	}

	function displayHistory() {
		var turnCount = '<td class="turns">' + turns() + '</td>';
		var feedback = $('#feedback').html();
		var history = turnCount + feedback;
		if (feedback !== '') $('#history').append('<tr>' + history + '</tr>');
	}

	function removeFromUntried(letter) {
		var index = $.inArray(letter, $scope.untriedLetters);
		if (index !== -1) {
			$scope.untriedLetters.splice(index, 1);
		}
	}

	function resetUntried() {
		$scope.untriedLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	}

	function newGameDisplay(letters) { 
		resetUntried();
		$('#answerBox').css('display', 'none');
		$('#newgame').css('box-shadow', 'none');
		$('#guessButton').css('box-shadow', '5px 5px 3px #888888');
		$('input[id="guessInput"]').val('');
		$('#guessInput').select();
		$('#title').html('wor<span style="color:#cc0000">db</span>reaker');
		$('#guessButton').attr('value', 'guess');
		$('#feedback').html('');
		$('#history').html('');
		$('#newgame').html(letters + ' letter word');
		$('input[id="guessInput"]').attr("maxlength", letters);
	}

	function endGameDisplay() {
		$('#answerBox').css('display', 'block');
		$('#newgame').html('start the game');
		$('#newgame').css('box-shadow', '5px 5px 3px #888888');
		$('#guessButton').css('box-shadow', 'none');
		$('#guessButton').attr('value', 'you won!');
		$('#title').html('wor<span style="color:#248f24">db</span>reaker');
	}

	function game(answer, guess) {
		guess = guess.toLowerCase();
		answer = answer.toLowerCase();

		var resArray = []; 
		for (i=0; i<answer.length; i++) { 
			if (guess[i]) resArray.push(guess[i] + '0'); 
			else resArray.push(' 0');
		} // would initialize array to ['c0', 't0', ' 0'];

		var resObj = {
			arr: resArray,
			gameOver: (answer == guess)
		};

		for (i=0; i<guess.length; i++) { 
			if (answer[i] == guess[i]) {
				resObj.arr[i] = resObj.arr[i][0] + '2';
				answer = removeLetter(answer, i);
				guess = removeLetter(guess, i);
			}
		} //since letter 'c' is contained in 'cat' AND at the same position (index 0), this loop would change 'c0' in resObj.arr to 'c2'

		for (i=0; i<guess.length; i++) {
			if (guess[i] !== '0') {
				if (answer.indexOf(guess[i]) !== -1) {
					resObj.arr[i] = resObj.arr[i][0] + '1';
					answer = removeLetter(answer, answer.indexOf(guess[i]));
				}
			}
		} //since letter 't' is contained in 'cat' but at a different position, this loop would change 't0' in resObj.arr to 't1'

		return resObj;
	}

	function removeLetter (string, index) { 
		var firstPart = string.substring(0, index);
		var secondPart = string.substring(index+1, string.length);

		return firstPart + '0' + secondPart;
	}

}]);