// Here's my data model
function FindDiskriminant(a, b, c) {
	let x1;
	let x2;
	if (c) {
		D = Math.pow(b, 2)-4*a*c;
		if (D < 0) {
			x1 = false;
			x2 = false;
		} else if (D === 0) {
			x1 = -b / 2*a;
			x2 = -b / 2*a;
		} else {
			x1 = (-b + Math.sqrt(D)) / 2*a;
			x2 = (-b - Math.sqrt(D)) / 2*a;
		}
	} else {
		x1 = 0;
		x2 = (-b) / a;
	}

	return [x1, x2].sort(function(a,b){return a-b});
}

function NOK(A)
{   
    var  n = A.length, a = Math.abs(A[0]);
    for (var i = 1; i < n; i++)
     { var b = Math.abs(A[ i ]), c = a;
       while (a && b){ a > b ? a %= b : b %= a; } 
       a = Math.abs(c*A[ i ])/(a+b);
     }
    return a;
}

function ChartLine(canvas, ChartlistXY, tension=0, name_function='График функции'){
	const xMax = ChartlistXY
    .reduce((acc, x) => {
        acc = (x.x > acc) ? x.x : acc;
        return acc
    }, 0)

	const xMin = ChartlistXY
		.reduce((acc, x) => {
			acc = (x.x < acc) ? x.x : acc;
			return acc
		}, 0)

	const yMax = ChartlistXY
		.reduce((acc, y) => {
			acc = (y.y > acc) ? y.y : acc;
			return acc
		}, 0)

	const yMin = ChartlistXY
		.reduce((acc, y) => {
			acc = (y.y < acc) ? y.y : acc;
			return acc
		}, 0)

	const maxNum = xMax > yMax ? xMax : yMax;
	const minNum = Math.abs(xMin < yMin ? xMin : yMin);
	const maxNumber = maxNum > minNum ? maxNum : minNum;
	new Chart(canvas, {
		type: 'scatter',
		plugins: [{
			beforeDraw: chart => {
				var xAxis = chart.scales['x-axis-1'];
				var yAxis = chart.scales['y-axis-1'];
				const scales = chart.chart.config.options.scales;
				scales.xAxes[0].ticks.padding = yAxis.top - yAxis.getPixelForValue(0) + 5;
				scales.yAxes[0].ticks.padding = xAxis.getPixelForValue(0) - xAxis.right + 5;
			}
		}],
		data: {
			datasets: [{
				label: name_function,
				data: ChartlistXY,
				borderColor: 'red',
				borderWidth: 1,
				pointBackgroundColor: ['#F5BF2F', '#3BF5BB', '#F58C22', '#0A42F5', '#F54416'],
				pointBorderColor: ['#28A880', '#2FF5B7', '#F58C22', '#072DA8', '#164BF5'],
				pointRadius: 5,
				pointHoverRadius: 10,
				fill: false,
				tension: tension,
				showLine: true
			}]
		},
		options: {
			responsive:true,
			scales: {
				xAxes: [{
					ticks: {
						min: -Math.ceil(maxNumber),
						max: Math.ceil(maxNumber),
						stepSize: 1,
						callback: v => v == 0 ? '' : v
					},
					gridLines: {
						drawTicks: false
					}
				}],
				yAxes: [{
					ticks: {
						min: -Math.ceil(maxNumber),
						max: Math.ceil(maxNumber),
						stepSize: 1,
						callback: v => v == 0 ? '' : v
					},
					gridLines: {
						drawTicks: false
					}
				}]
			}
		}
	});
}

var ModelDiscriminant = function(a, b, c) {
	let res;

    this.a = ko.observable(a);
    this.b = ko.observable(b);
	this.c = ko.observable(c);
 
    this.resultDiskriminant = ko.pureComputed(function() {
        // Knockout tracks dependencies automatically. It knows that fullName depends on 
		//firstName and lastName, because these get called when evaluating fullName.
		this.a(Number(this.a()));
		this.b(Number(this.b()));
		this.c(Number(this.c()));
		const [x1, x2] = FindDiskriminant(this.a(), this.b(), this.c());

		if (x1) {
			res = "x1: " + x1 + "; x2: " + x2 + ";";
		} else {
			res = "Корней нету"
		}
        return res;
    }, this);
};

var ModelSystem = function(aSys1, bSys1, cSys1, aSys2, bSys2, cSys2) {
    this.aSys1 = ko.observable(aSys1);
    this.bSys1 = ko.observable(bSys1);
	this.cSys1 = ko.observable(cSys1);
	
	this.aSys2 = ko.observable(aSys2);
    this.bSys2 = ko.observable(bSys2);
	this.cSys2 = ko.observable(cSys2);
 
    this.resultSystem = ko.pureComputed(function() {
        // Knockout tracks dependencies automatically. It knows that fullName depends on 
		//firstName and lastName, because these get called when evaluating fullName.
		this.aSys1(Number(this.aSys1()));
		this.bSys1(Number(this.bSys1()));
		this.cSys1(Number(this.cSys1()));
		
		this.aSys2(Number(this.aSys2()));
		this.bSys2(Number(this.bSys2()));
		this.cSys2(Number(this.cSys2()));

		let res;
		let x;
		let y;
		let c;
		
		let signA1 = Math.sign(this.aSys1())
		let signA2 = Math.sign(this.aSys2())

		if (Math.abs(this.aSys1()) === Math.abs(this.aSys2())) {
			if (signA1 === signA2) {
				y = -this.bSys1() + this.bSys2();
				c = -this.cSys1() + this.cSys2();
				y = c / y;
				x = (this.cSys1() - this.bSys1()*y)/this.aSys1();
			} else {
				y = this.bSys1() + this.bSys2();
				c = this.cSys1() + this.cSys2();
				y = c / y;
				x = (this.cSys1() - this.bSys1()*y)/this.aSys1();
			} 
		} else {
			const nok = NOK([this.aSys1(), this.aSys2()])
			const mnoshitel1 = Math.abs(nok / this.aSys1())
			const mnoshitel2 = Math.abs(nok / this.aSys2())
			if (signA1 === signA2) {
				y = mnoshitel1*this.bSys1() - mnoshitel2*this.bSys2();
				c = mnoshitel1*this.cSys1() - mnoshitel2*this.cSys2();
				y = c / y;
				x = (this.cSys1() - this.bSys1()*y)/this.aSys1();
			} else {
				y = mnoshitel1*this.bSys1() + mnoshitel2*this.bSys2();
				c = mnoshitel1*this.cSys1() + mnoshitel2*this.cSys2();
				y = c / y;
				x = (this.cSys1() - this.bSys1()*y)/this.aSys1();
			}
		}
		
		res = 'x: ' + x + ', y: ' + y;
        return res;
    }, this);
};

var ModelLineChart = function(a, b) {
	let listXY = []
	let CharListXY = []

	this.aLine = ko.observable(a);
	this.bLine = ko.observable(b);

	this.xyChartLine = ko.pureComputed(function() {
		this.aLine(Number(this.aLine()));
		this.bLine(Number(this.bLine()));

		listXY = [
			{ elemXY1: 0, elemXY2: 2, elemXY3: -3},
			{ elemXY1: this.bLine(), elemXY2: (this.bLine() + (this.aLine()*2)), elemXY3: (this.bLine() + (this.aLine()*-3))},
		]

		CharListXY = [{x: 0, y: this.bLine()}, {x: 2, y: (this.bLine() + (this.aLine()*2))}, {x: -3, y: this.bLine() + (this.aLine()*-3)}]

		ChartLine("myChartLine", CharListXY, 0);

		return listXY;
	}, this);

};

var ModelParabolaChart = function(a, b, c) {
	let CharListXY = []
	let up_branches = true
	let x0;
	let y0;
	let top_parabola;
	let left_point;
	let right_point;
	let pre_left_point;
	let pre_right_point;

	this.aParabola = ko.observable(a);
	this.bParabola = ko.observable(b);
	this.cParabola = ko.observable(c);

	this.xyChartParabola = ko.pureComputed(function() {
		this.aParabola(Number(this.aParabola()));
		this.bParabola(Number(this.bParabola()));
		this.cParabola(Number(this.cParabola()));

		if (this.aParabola() < 0) {
			up_branches = false;
		}

		x0 = ((-1*this.bParabola())/(2*this.aParabola()))

		y0 = this.aParabola()*Math.pow(x0, 2) + this.bParabola()*x0 + this.cParabola()

		top_parabola = {x: x0, y: y0}
		const [x1, x2] = FindDiskriminant(this.aParabola(), this.bParabola(), this.cParabola())

		if (x2){
			left_point = {x:x1-2, y: (this.aParabola()*Math.pow((x1-2), 2)) + (this.bParabola()*(x1-2)) + this.cParabola()}
			right_point = {x:x2+2, y: this.aParabola()*Math.pow((x2+2), 2) + this.bParabola()*(x2+2) + this.cParabola()}
			pre_left_point = {x: x1, y: 0}
			pre_right_point = {x: x2, y: 0}

		}else {
			left_point = {x:-3, y: this.aParabola()*Math.pow(3, 2) + this.bParabola()*(-3) + this.cParabola()}
			right_point = {x:1, y: this.aParabola()*Math.pow((1), 2) + this.bParabola()*(1) + this.cParabola()}
			pre_left_point = {x: -2, y: this.aParabola()*Math.pow((-2), 2) + this.bParabola()*(-2) + this.cParabola()}
			pre_right_point = {x: 0, y: this.aParabola()*Math.pow((0), 2) + this.bParabola()*(0) + this.cParabola()}
		}

		CharListXY = [left_point, pre_left_point, top_parabola, pre_right_point, right_point]
		console.log(CharListXY)
		ChartLine("myParabolaLine", CharListXY, 0.35, 'График параболы');

		return "Ветки вверх: "+up_branches+", вершина параболы: "+x0+ ", " +y0+", дискриминант: "+ x1+', '+x2;
	}, this);

};

var ViewModel = {
    Discriminant: ModelDiscriminant('0', '0', '0'),
    System: ModelSystem('1', '1', '1', '5', '1', '1'),
	LineChart: ModelLineChart('2', '1'),
	ParabolaChart: ModelParabolaChart('-2', '4', '0'),
}; 
ko.applyBindings(ViewModel); // This makes Knockout get to work

