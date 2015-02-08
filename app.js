Stopwatch = function(listener, resolution) {
	this.startTime = 0;
	this.stopTime = 0;
	this.totalElapsed = 0; // * elapsed number of ms in total
	this.started = false;
	this.listener = (listener != undefined ? listener : null); 
	// * function to receive onTick events;
	this.tickResolution = (resolution != undefined ? resolution : 500); 
	// * how long between each tick in milliseconds;
	this.tickInterval = null;
	// * pretty static vars
	this.onehour = 1000 * 60 * 60;
	this.onemin = 1000 * 60;
	this.onesec = 1000;
};

Stopwatch.prototype.start = function() {
	var delegate = function(that, method){ 
			return function() { 
				return method.call(that); 
			};
	};

	if (!this.started) {
		this.startTime = new Date().getTime();
		this.stopTime = 0;
		this.started = true;
		this.tickInterval = setInterval(delegate(this, this.onTick),
		this.tickResolution);
	}
};

Stopwatch.prototype.stop = function() {
	if (this.started) {
		this.stopTime = new Date().getTime();
		this.started = false;
		var elapsed = this.stopTime - this.startTime;
		this.totalElapsed += elapsed;
		if (this.tickInterval != null)
			clearInterval(this.tickInterval);
	}
return this.getElapsed();
};

Stopwatch.prototype.reset = function() {
	this.totalElapsed = 0;
	// * if watch is running, reset it to current time
	this.startTime = new Date().getTime();
	this.stopTime = this.startTime;
};

Stopwatch.prototype.restart = function() {
	this.stop();
	this.reset();
	this.start();
};

Stopwatch.prototype.getElapsed = function() {
	// * if watch is stopped, use that date, else use now
	var elapsed = 0;
	if (this.started)
		elapsed = new Date().getTime() - this.startTime;
	elapsed += this.totalElapsed;
	var hours = parseInt(elapsed / this.onehour);
	elapsed %= this.onehour;
	var mins = parseInt(elapsed / this.onemin);
	elapsed %= this.onemin;
	var secs = parseInt(elapsed / this.onesec);
	var ms = elapsed % this.onesec;

return {
	hours: hours,
	minutes: mins,
	seconds: secs,
	milliseconds: ms
	};
};

Stopwatch.prototype.setElapsed = function(hours, mins, secs) {
	this.reset();
	this.totalElapsed = 0;
	this.totalElapsed += hours * this.onehour;
	this.totalElapsed += mins * this.onemin;
	this.totalElapsed += secs * this.onesec;
	this.totalElapsed = Math.max(this.totalElapsed, 0); // * No negative numbers
};

Stopwatch.prototype.toString = function() {
	var zpad = function(no, digits) {
	no = no.toString().slice(0, 2);
	while(no.length < digits)
	no = '0' + no;
	return no;
	};

	var e = this.getElapsed();
	return zpad(e.hours,2) + ':' + zpad(e.minutes,2) + ':' + zpad(e.seconds,2) +
		':' + zpad(e.milliseconds,2);
};

Stopwatch.prototype.setListener = function(listener) {
	this.listener = listener;
};

// * triggered every <resolution> ms
Stopwatch.prototype.onTick = function() {
	if (this.listener != null) {
		this.listener(this);
	}
};

/***************************************************************************/
var win = Ti.UI.createWindow({
 backgroundColor: '#ffffff',
 layout: 'vertical'
});

var timeView = Ti.UI.createView({
 top:0,
 width: '100%',
 height: '30%',
 backgroundColor: '#1C1C1C'
});

var label = Ti.UI.createLabel({
 color: '#404040',
 text: 'READY?',
 height: Ti.UI.SIZE,
 textAlign: 'center',
 verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
 font:{
 fontSize: '55sp',
 fontWeight: 'bold'
 }
});

timeView.add(label);
win.add(timeView);

var buttonsView = Ti.UI.createView({
 width: '100%',
 height: '15%',
 layout: 'horizontal'
});

var buttonStartLap = Ti.UI.createButton({
 title: 'GO!',
 color: '#C0BFBF',
 width: '50%',
 height: Ti.UI.FILL,
 backgroundColor: '#727F7F',
 font: {
 fontSize: '20sp',
 fontWeight: 'bold'
 },
});
buttonsView.add(buttonStartLap);

buttonStartLap.addEventListener('click', function() {
	// Check console
	_Stopwatch.restart();
	Ti.API.info('User clicked the button ');
	label.text = 'Started!';
	buttonStartLap.title= 'RESET/RESTART';
	_Stopwatch.start();
	buttonStopReset.title= 'SHOW LAP';
});

var buttonStopReset = Ti.UI.createButton({
 title: 'STOP',
 color: '#C0BFBF',
 width: '50%',
 height: Ti.UI.FILL,
 backgroundColor: '#404040',
 font: {
 fontSize: '20sp',
 fontWeight: 'bold'
 },
});

buttonStopReset.addEventListener('click', function() {
	// Check console	
	Ti.API.info('User clicked the button ');
	var telapsed = _Stopwatch.totalElapsed;
	label.text = _Stopwatch.toString(telapsed);
});

buttonsView.add(buttonStopReset);

win.add(buttonsView);

win.open();

var  _Stopwatch = new Stopwatch();


