var TIMER = {
	bell:document.getElementById('bell'),
	beep:document.getElementById('beep'),
	tenthsSecond:0,
	tenths:10,
	secondsCounter:0,
	seconds:60,
	minutesCounter:0,
	minutes:60,
	horary:0,
	hours:24,
	interval:null,
	circuits:null,
	circuitsDuration:null,
	restsDuration:null,
	circuitsNum:null,
	circuitsCounter:1,
	circuitsDurationCounter:1,
	restsDurationCounter:0,
	totalNum:null,
	intervalsSecondsTotals:null,
	restsSecondsTotal:null,
	circuitsTotalTime:null,
	pause:0,
	graphWidth: $('.graphCont:first').width(),
	tool:function (action){
		$('.container.visible').removeClass('visible');
		$('.tabs.active').removeClass('active');
		if(action == 'crono'){$('#circuitsContainer,#settingsContainer').addClass('visible');$('#crono').addClass('active');}
		if(action == 'circuits'){$('#containerCrono,#settingsContainer').addClass('visible');$('#circuits').addClass('active');}
		if(action == 'settings'){$('#circuitsContainer,#containerCrono').addClass('visible');$('#settings').addClass('active');}
	},
	padding:function(param){
		if(param < 10){param = '0'+param;}
		return param;
	},
	startCircuits:function(){
		var action = $('#startCircuit').html();
		if(TIMER.pause == 0){
			TIMER.clearCircuits();
		}
		TIMER.circuitsDuration = $('#circuitSecs').val();
		TIMER.restsDuration = $('#restSecs').val();
		TIMER.circuitsNum = $('#circuitsNum').val();
		if(!TIMER.circuitsDuration.match(/^\d+$/) || !TIMER.restsDuration.match(/^\d+$/) || !TIMER.circuitsNum.match(/^\d+$/)){alert('Por favor, ingresa un numero valido.');}
		else{
			TIMER.circuits = setInterval(TIMER.runCircuits,1000);
			$('#startCircuit,#circuitSecs,#restSecs,#circuitsNum').addClass('disabled').prop('disabled',true);
			$('#pauseCircuit, #resetCircuit').removeClass('disabled').prop('disabled',false);
			
		}
		TIMER.pause = 0;
	},
	runCircuits:function(){
		TIMER.totalNum = TIMER.circuitsNum*2-1;
		TIMER.calculateTotalTime(TIMER.circuitsDuration,TIMER.restsDuration,TIMER.circuitsNum);
		TIMER.executeCircuits(); 
	},
	calculateTotalTime:function(intervals,restTime,circuits){
		var hours = 0;
		var minutes = 0;
		var seconds = 0;
		TIMER.circuitsTotalTime = intervals * circuits + restTime*(circuits-1);
		if(TIMER.circuitsTotalTime > 3600){hours = Math.floor(TIMER.circuitsTotalTime/3600);}
		minutes = TIMER.circuitsTotalTime-(hours*3600);
		seconds = minutes%60;
		minutes = Math.floor(minutes/60);
		
		$('#totalTime').empty().append(TIMER.padding(hours)+':'+TIMER.padding(minutes)+':'+TIMER.padding(seconds));
	},
	executeCircuits:function(){
		if(TIMER.circuitsCounter <= TIMER.totalNum){
			if(TIMER.circuitsCounter % 2 != 0){TIMER.runInterval();}
			if(TIMER.circuitsCounter % 2 == 0){TIMER.runRest();}
		}		
		if(TIMER.circuitsCounter > TIMER.totalNum){
			clearInterval(TIMER.circuits);
			TIMER.displayCircuits('circuit');
			TIMER.circuitsCounter = 1;	
			TIMER.circuitsDurationCounter = 1;
			TIMER.restsDurationCounter = 0; 
			$('#startCircuit,#circuitSecs,#restSecs,#circuitsNum').removeClass('disabled').prop('disabled',false);
			$('#pauseCircuit, #resetCircuit').prop('disabled',true).addClass('disabled');
			TIMER.beep.play();
		}
	},
	runInterval:function(){
		TIMER.displayCircuits('interval');
		if(TIMER.circuitsDurationCounter <= TIMER.circuitsDuration){TIMER.circuitsDurationCounter++;}
		if(TIMER.circuitsDurationCounter > TIMER.circuitsDuration){
			TIMER.circuitsDurationCounter = 1;TIMER.circuitsCounter++;
		}
	},
	runRest:function(){
		TIMER.displayCircuits('rest');
		if(TIMER.restsDurationCounter <= TIMER.restsDuration){TIMER.restsDurationCounter++;}
		if(TIMER.restsDurationCounter > TIMER.restsDuration){
			TIMER.restsDurationCounter = 0;TIMER.displayCircuits('circuit');TIMER.circuitsCounter++;
		}
	},
	displayCircuits:function(action){
		if(action == 'interval'){$('#circuitsInterval').empty().append(TIMER.padding(TIMER.circuitsDurationCounter));TIMER.circuitsGp('Intervals');}
		if(action == 'rest'){if(TIMER.circuitsCounter < TIMER.totalNum){$('#rests').empty().append(TIMER.padding(TIMER.restsDurationcounter));TIMER.circuitsGp('Rests');}}
		if(action == 'circuit'){$('#circuit').empty().append(TIMER.padding(TIMER.circuitsCounter/2));TIMER.circuitsGp('Circuits');}
	},
	circuitsGp:function(action){
		var secGraphWidth = null;
		if(action == 'Intervals'){if(TIMER.circuitsDurationCounter == 1){TIMER.bell.play(); $('#graphIntervals,#graphRests').empty();} secGraphWidth = (1/TIMER.circuitsDuration)*100;}
		if(action == 'Rests'){
			if(TIMER.restsDurationCounter == 0){TIMER.beep.play();$('#graphRests').empty();} 
			if(TIMER.restsDurationCounter >=1){ secGraphWidth = (1/TIMER.restsDuration)*100;}
		}
		if(action == 'Circuits'){	secGraphWidth = (1/TIMER.circuitsNum)*100;}
		TIMER.timerGraph(action,secGraphWidth);
	},
	clearCircuits:function(){
		$('#graphIntervals,#graphRests,#graphCircuits').empty();
		$('#circuitsInterval,#restTime,#circuit').empty().append('00');
	},
	pauseCircuits:function(){
		clearInterval(TIMER.circuits);
		$('#startCircuit').removeClass('disabled').prop('disabled',false);
		$('#pauseCircuit').addClass('disabled').prop('disabled',true);
		TIMER.pause=1;
	},
	resetCircuits:function resetCircuits(){
		TIMER.clearCircuits();
		clearInterval(TIMER.circuits);
		$('#circuitSecs,#restSecs').val(2);
		$('#circuitsNum').val(1);
		$('#startCircuit').removeClass('disabled').prop('disabled',false);
		TIMER.interval = null;
		TIMER.circuits = null;
		TIMER.circuitsDuration = null;
		TIMER.restsDuration = null;
		TIMER.circuitsNum = null;
		TIMER.circuitsCounter = 1;
		TIMER.circuitsDurationCounter = 1;
		TIMER.intervalsDurationCounter = 0;
		TIMER.totalNum = null;
		TIMER.intervalsSecondsTotal = null;
		TIMER.restsSecondsTotal = null;
		TIMER.circuitsTotalTime = null;
		TIMER.pause = 0;
	},
	startTimer:function(acto){
		clearInterval(TIMER.interval);
		TIMER.interval = setInterval(TIMER.runTimer,100);
		$('#start').addClass('disabled');
		$('#stop, #clear').removeClass('disabled');
	},
	runTimer:function(){
		TIMER.tenthsTimer();
	},
	stopTimer:function(){
		clearInterval(TIMER.interval);
		$('#start').removeClass('disabled');
		$('#stop').addClass('disabled');		
	},
	resetTimer:function(){
		$('#hours, #minutes, #seconds,#tenths').empty().append('00');
		$('.graphCont').empty();
		TIMER.secondsCounter = 0;
		TIMER.minutesCounter = 0;
		TIMER.horary = 0;
		TIMER.tenthsSecond = 0;
	},
	tenthsTimer:function(){
		if(TIMER.tenthsSecond <= TIMER.tenths){TIMER.tenthsSecond++;}
		if(TIMER.tenthsSecond == TIMER.tenths){TIMER.tenthsSecond=0;TIMER.secondsCountTimer();$('#graphTenths').empty();}
		TIMER.displayTimer('tenths',TIMER.tenthsSecond);
		TIMER.timerGraph('Tenths');
	},
	secondsCountTimer:function(){
		if(TIMER.secondsCounter <= TIMER.seconds){TIMER.secondsCounter++;}
		if(TIMER.secondsCounter == TIMER.seconds){TIMER.secondsCounter=0;TIMER.minutesTimer();$('#graphSeconds').empty();}
		TIMER.displayTimer('seconds',TIMER.secondsCounter);
		TIMER.timerGraph('Seconds');
	},
	minutesTimer:function(){
		if(TIMER.minutesCounter <= TIMER.minutes){TIMER.minutesCounter++;}
		if(TIMER.minutesCounter == TIMER.minutes){TIMER.minutesCounter =0;TIMER.hoursTimer();$('#graphMinutes').empty();}
		TIMER.displayTimer('minutes',TIMER.minutesCounter);
		TIMER.timerGraph('Minutes','');
	},
	hoursTimer:function(){
		if(TIMER.horary <= TIMER.hours){TIMER.horary++;}
		if(TIMER.horary == TIMER.hours){TIMER.horary=0;$('#graphHours').empty();}
		TIMER.displayTimer('hours',TIMER.horary);
		TIMER.timerGraph('Hours');
	},
	displayTimer:function(scope,param){
		$('#'+scope).empty().append(TIMER.padding(param));
	},
	timerGraph:function(action,secGraphWidth){
		if(action == 'Intervals' || action == 'Rests'){if(secGraphWidth == null){secGraphWidth = 0;}}
		$('#graph'+action).append('<span class="graphSec" style="width:'+secGraphWidth+'%"> </span>');
	}
};

var SETTINGS = {
	settingsList:null,
	clickHandler:function (){
		$(document).on('click','.pointer',function(){
			var action = $(this).attr('id');
			switch(action){
				case'crono':TIMER.tool(action);break;
				case'circuits':TIMER.tool(action);break;
				case'start':TIMER.startTimer();break;
				case'stop':TIMER.stopTimer();break;
				case'clear':TIMER.resetTimer();break;
				case'startCircuit':TIMER.startCircuits();break;
				case'pauseCircuit':TIMER.pauseCircuits();break;
				case'resetCircuit':TIMER.resetCircuits();break;
				case'settings':TIMER.tool(action);break;
				case'dark':case'white':SETTINGS.changeCSSsheet(action);break;
				//default:console.log('This handler haven\'t been defined');
			}
		});
	},
	isLSEnabled:function(){
		if(typeof(Storage) !== "undefined") {
			if(localStorage.settings != undefined){
				SETTINGS.changeCSSsheet(localStorage.theme);
			}
			else{//console.log('No settings file');}
		} else {
			
		}
	},
	changeCSSsheet:function(cssSheet){
		document.getElementById('appStyle').setAttribute('href', cssSheet+'.css');
		localStorage.theme=cssSheet;
	},
	run:function(){
		SETTINGS.isLSEnabled();
		SETTINGS.clickHandler();
	}
};

SETTINGS.run();