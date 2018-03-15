//github.com/ethandeguire/Stats
//change these numbers to edit dataset, separate by commas

var UserDataSet = [2, 2, 2, 5, 6, 6, 6, 6, 7, 8, 9, 10, 11, 11, 11, 11];
var dataSet;
// "0" = all points historammed ----- "1" = standard deviation histogram ----- "2" = custom size histogram
var graphMode = 1;
var roundFactor = 10; //value to round  by - higher number == more precise. use powers of 10
var customHistoWidth = 2; //value for horizontal ranges in histogram, only valid if graphMode = "custom"
var maxNums = 20; //max numbers allowed on histograph
var includeOutliers = true; //false or true

var arrSize;

var devGroups = [];
var devCount = [];

var custGroups = [];
var custCount = [];

var sumSqr = 0;
var dataSum = 0;
var avg;
var stdDev;
var Median;
var Q1;
var Q3;
var arrNums;
var arrFreqs;
var relFreqs;
var maxNum;
var minimumVal;
var maximumVal;
var result;
var outliers = 0;

function freq() {
	var a = [],
		b = [],
		prev;

	for (var i = 0; i < dataSet.length; i++) {
		if (dataSet[i] !== prev) {
			a.push(dataSet[i]);
			b.push(1);
		} else {
			b[b.length - 1]++;
		}
		prev = dataSet[i];
	}

	return [a, b];
}

function sortArr() {
	var count = 0;
	for (var b = 0; b < arrSize - 1; ++b) {
		for (var a = 0; a < arrSize - 1; ++a) {
			count += 1;
			if (dataSet[a] > dataSet[a + 1]) {
				var temp = dataSet[a];
				dataSet[a] = dataSet[a + 1];
				dataSet[a + 1] = temp;
			}
		}
	}
}

function quartile(startPos, endPos) {
	var range = endPos - startPos + 1;
	if (range % 2 == 1) {
		var elimsQ = int(range / 2);
		return dataSet[elimsQ + startPos];
	} else {
		var elimsQ = range / 2;
		elimsQ += -1;
		return (dataSet[elimsQ + startPos] + dataSet[elimsQ + startPos + 1]) / 2;
	}
}

function median() {
	if (arrSize % 2 == 1) {
		var elims = int(arrSize / 2);
		Median = dataSet[elims];
		Q1 = quartile(0, elims - 1);
		Q3 = quartile(elims + 1, arrSize - 1);
	} else {
		var elims = arrSize / 2;
		elims += -1;
		Median = (dataSet[elims] + dataSet[elims + 1]) / 2;
		Q1 = quartile(0, elims);
		Q3 = quartile(elims + 1, arrSize - 1);
	}
}

function setup() {
	everythingOnce();
	
	button = createButton("New Data Set");
  button.position(140,387);
  button.mouseClicked(newData);
  
  toggleOutliers = createButton("Toggle Outliers");
	toggleOutliers.position(20,387);
	toggleOutliers.mousePressed(outlierToggleFunc);
}

function outlierToggleFunc(){
  if (includeOutliers == true){
    includeOutliers = false
  }
  else if(includeOutliers == false){
    includeOutliers = true
  }
  
  everythingOnce();
}

function newData(){
  var txt = prompt("New data set, separate with commas");
  tmpVar = split(txt, ",");
  for (var i = 0; i<tmpVar.length; i++)
  {
    tmpVar[i] = tmpVar[i] - 1;
    tmpVar[i] = tmpVar[i] + 1;
  }
  
  UserDataSet = tmpVar;
  everythingOnce();
}

function everythingOnce() {
  dataSet = UserDataSet;
  
  sumSqr = 0;
  dataSum = 0;
  outLiers = 0;
  devGroups = [];
  devCount = [];
  custGroups = [];
  custCount = [];

	createCanvas(800, 415);
	background(120);
	stroke(1);
	strokeWeight(1);
	arrSize = dataSet.length;
	sortArr();
  
  
  
  doMath();
  
  
	if (includeOutliers == false)
	{
		var tempArray = [];
		var outRangeTop = Q3+(1.5*(Q3-Q1));
		var outRangeBottom = Q1-(1.5*(Q3-Q1));
		for(var i = 0; i<(arrSize); i++){
			if (dataSet[i] > outRangeTop || dataSet[i] < outRangeBottom){
				outLiers += 1;
			}else{
				splice(tempArray, dataSet[i], i);
			}
		}
		
		dataSet = tempArray;
		arrSize = dataSet.length;	
		
		doMath();
	}



	console.log('Sum of Values: ', dataSum);
	console.log('Avg: ', avg);
	console.log('Standard Deviation: ', stdDev);
	console.log('Quartile 1: ', Q1);
	console.log('Median: ', Median);
	console.log('Quartile 3: ', Q3);
	console.log('Values ', arrSize);
	console.log('Data Set:', dataSet);
	//console.log("Frequencies", arrFreqs);
	//console.log("Deviation Groups", devGroups);
	//console.log("Deviation Group Counts", devCount);
	//console.log("Custom Groups", custGroups);
	//console.log("Custom Group Counts", custCount);

	var text1 = 'Sum of Values:	     ' + dataSum;
	var text2 = 'Average:                 ' + avg;
	var text3 = 'Std Deviation:  	     ' + round(10000 * stdDev) / 10000;
	var text4 = '1st Quartile:  	       ' + Q1;
	var text5 = 'Median:         	        ' + Median;
	var text6 = '3rd Quartile:  	       ' + Q3;
	var text7 = '# of Values    	       ' + arrSize;
	var text8 = 'Minimum    	           ' + minimumVal;
	var text9 = 'Maximum    	         ' + maximumVal;

	fill(255);
	stroke(120);
	textSize(15);
	text(text1, 530, 40);
	text(text2, 530, 70);
	text(text3, 530, 100);
	text(text4, 530, 130);
	text(text5, 530, 160);
	text(text6, 530, 190);
	text(text7, 530, 220);
	text(text8, 530, 250);
	text(text9, 530, 280);
	
	var graphBoxW = 500;
	var graphBoxH = 350;

	noStroke();
	fill(255);
	rectMode(CORNER);
	rect(20, 20, graphBoxW, graphBoxH + 11);

	rectMode(CORNER);
	textAlign(LEFT);

	//changes max numbers to write on histograph
	if (
		(graphMode == 0 && dataSet.length > maxNums) ||
		(graphMode == 1 && devGroups.length > maxNums) ||
		(graphMode == 2 && custGroups.length > maxNums)
	) {
	} else {
		var doNumbers = true;
	}

	//draw histogram boxes in different colors according to their size.
	if (graphMode == 0) {
		var colConst = 200 / arrNums.length;
		var histWidth = graphBoxW / arrNums.length;
		var oneSize = (graphBoxH - 20) / max(arrFreqs);

		for (var i = 0; i < arrNums.length; ++i) {
			stroke(i * colConst + 55, 0, 0);
			fill(i * colConst + 55, 0, 0);
			rect(20 + histWidth * i, 380, histWidth, -oneSize * arrFreqs[i]);
			fill(255);
			if (doNumbers == true) {
				var temp2 = round(100 * arrNums[i]) / 100 + ' ';
				text(temp2, 12 + histWidth * i + histWidth / 2, 380);
			}
		}
	} else if (graphMode == 1) {
		var colConst = 200 / devGroups.length;
		var histWidth = graphBoxW / devGroups.length;
		var oneSize = (graphBoxH - 20) / max(devCount);

		for (var i = 0; i < devGroups.length; ++i) {
			stroke(i * colConst + 55, 0, 0);
			fill(i * colConst + 55, 0, 0);
			rect(20 + histWidth * i, 380, histWidth, -oneSize * devCount[i]);
			fill(255);
			if (doNumbers == true) {
				if (i != 0) {
					var temp3 =
						round(100 * devGroups[i - 1]) / 100 +
						'-' +
						round(100 * devGroups[i]) / 100;
				} else {
					var temp3 =
						round(100 * minimumVal) / 100 +
						'-' +
						round(100 * devGroups[i]) / 100;
				}
				text(temp3, -10 + histWidth * i + histWidth / 2, 380);
			}
		}
	} else if (graphMode == 2) {
		var colConst = 200 / custGroups.length;
		var histWidth = graphBoxW / custGroups.length;
		var oneSize = (graphBoxH - 20) / max(custCount);

		for (var i = 0; i < custGroups.length; ++i) {
			stroke(i * colConst + 55, 0, 0);
			fill(i * colConst + 55, 0, 0);
			rect(20 + histWidth * i, 380, histWidth, -oneSize * custCount[i]);
			fill(255);
			if (doNumbers == true) {
				if (i != 0) {
					var temp3 =
						round(100 * custGroups[i - 1]) / 100 +
						'-' +
						round(100 * custGroups[i]) / 100;
				} else {
					var temp3 =
						round(100 * minimumVal) / 100 +
						'-' +
						round(100 * custGroups[i]) / 100;
				}
				text(temp3, -10 + histWidth * i + histWidth / 2, 380);
			}
		}
	}

	noStroke();
	fill(255);
	rect(535, 300, 245, 70);

	//have 245 pixels = 100%
	// 100% should be max value, highest in dataset

	var newConst = 245 / (dataSet[arrSize - 1] + 1);
	var Q3rd = Q3 * newConst + 535;
	var Q1st = Q1 * newConst + 535;

	rectMode(CORNERS);
	fill(255, 0, 10);
	rect(Q3rd, 315, Q1st, 355);
	rect(Q3rd, 334, 780, 336);
	rect(535 + dataSet[0] * i, 334, Q1st, 336);
	fill(0);
	rect(Median * newConst + 534, 315, Median * newConst + 536, 355);
}

function doMath(){
  sumSqr = 0;
  dataSum = 0;
  outLiers = 0;
  devGroups = [];
  devCount = [];
  custGroups = [];
  custCount = [];
  
	//working standard deviation code - compacted
	for (var i = 0; i < arrSize; i++) {
		dataSum = dataSum + dataSet[i];
	}
	avg = dataSum / arrSize;
	for (var i = 0; i < arrSize; i++) {
		sumSqr = sumSqr + (dataSet[i] - avg) * (dataSet[i] - avg);
	}
	stdDev = sqrt(sumSqr / arrSize);

	median();
	minimumVal = dataSet[0];
	maximumVal = dataSet[arrSize - 1];

	//finds relative frequency for each unique number in data set
	var temp = freq();
	arrNums = temp[0];
	arrFreqs = temp[1];
	uniqueNums = arrNums.length;
	relFreqs = [];
	for (var i = 0; i < arrNums.length; i++) {
		relFreqs[i] = arrFreqs[i] / arrSize;
	}
	maxNum = arrNums[arrNums.length - 1];

	//for std dev horizontal
	dataRange = dataSet[arrSize - 1] - dataSet[0];
	for (var i = 0; i < dataRange / stdDev; i++) {
		devGroups[i] = round(roundFactor * (stdDev * i + stdDev + minimumVal)) / roundFactor;
		devCount[i] = 0;
	}

	for (var i = 0; i < arrSize; i++) {
		for (var j = 0; j < devGroups.length; j++) {
			if (
				dataSet[i] < devGroups[j] &&
				dataSet[i] >= devGroups[j] - round(roundFactor * stdDev) / roundFactor
			) {
				devCount[j] += 1;
			}
		}
	}

	//for custom horizontal
	for (var i = 0; i < dataRange / customHistoWidth; i++) {
		custGroups[i] =
			round(
				roundFactor * (customHistoWidth * i + customHistoWidth + minimumVal)
			) / roundFactor; //round ( roundFactor * (stdDev * i + stdDev + minimumVal))/roundFactor;
		custCount[i] = 0;
	}

	for (var i = 0; i < arrSize; i++) {
		for (var j = 0; j < custGroups.length; j++) {
			if (
				dataSet[i] < custGroups[j] &&
				dataSet[i] >=
					custGroups[j] - round(roundFactor * customHistoWidth) / roundFactor
			) {
				custCount[j] += 1;
			}
		}
	}
}

