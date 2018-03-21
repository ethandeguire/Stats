//github.com/ethandeguire/Stats


//CFG:
  //non user changeable config
    var maxNums = 20; //max numbers allowed on histograph
    var customHistoWidth = 2; //value for horizontal ranges in histogram, only valid if graphMode = "custom"
    var roundFactor = 10; //value to round  by - higher number == more precise. use powers of 10
  //config for defaults - all user changeable
    //var UserDataSet = [-1,2,3,7,-5,3,4,5];
    var UserDataSet = [12, 8, 9, 12, 1, 5, 5, 2, 17, 12, 15, 13, 15, 8, 19, 12, 14, 12, 3, 12, 11, 5, 1, 9, 15, 10, 15, 3, 1, 11, 5, 6, -1, 12, 11, 12, 13, 13, 12, 7, 21, 7, 4, 9, 14, 9, 15, 7, 18, 9, 18, 20, 20, 10, 8, 11, 5, 16, 10, 15, 8, 11, 7, 4, 9, -2, 6, 12, 10, 22, 7, 2, -1, 7, 9, 12, 7, 12, 4, 6, 10, 2, 11, 15, 14, 9, 16, 6, 17, 5, 10, 0, 10, 13, 11, 7, 4, 11, 7, 9, 4, 0, 15, 13, 6, 2, 10, 15, 16, 14, 6, 9, 9, 14, 13, 12, 12, 1, 13, 18, 21, 18, 2, 9, 5, 12, 6, 10, 11, 2, 15, 2, 6, 10, 4, 3, 6, 1, 7, 14, 1, 10, 9, 6, 3, 7, 12, 18, 13, 10, 3, 10, 8, 15, 12, 12, 10, 10, 13, 8, 12, 7, 6, 12, 7, 4, 11, 9, 7, 8, 12, 8, 6, 9, 22, 14, 11, 10, 15, 18, 4, 11, 5, 9, 18, 13, 9, 20, 7, 20, 15, 4, 5, 8, 8, 13, 7, 11, 19, 9, 9, 14, 11, 16, 0, 20, 5, 9, 14, 13, 13, 8, 1, 9, 10, 11, 12, 5, 13, 18, 5, 5, 14, 10, 8, 16, 6, 10, 21, 13, 10, 14, 15, 17, 11, 9, 17, 9, 13, 10, 17, 13, 13, 8, 4, 5, 10, 2, 4, 3, 8, 5, -1, 10, 7, 6, 6, 17, 16, 16, 11, 8, 18, 6, 5, 8, 12, 5, 8, 4, 9, 14, 14, 4, 6, 18, 18, 8, 5, 15, 10, 11, 5, 9, 6, 3, 8, 10, 19, 8, 14, 10, 16, 21, 8, 14, 8, 2, 6, 4, 4, 1, 15, 16, 5, 9, 19, 7, 13, 10, 8, 10, 13, 9, 7, 15, 16, 13, 9, 3, 5, 14, 13, 17, 17, 1, 14, 13, 9, 10, 15, 9, 2, 15, 19, 6, 12, 3, 5, 3, 13, 11, 15, 8, 7, 11, 12, 13, 7, 9, 4, 13, 6, 9, 19, 14, 17, 10, 11, 8, 5, 14, 15, 1, 3, 20, 14, 7, 7, 12, 21, 16, 15, 11, 11, 10, 1, 3, 6, 11, 5, 12, 21, 2, 15, 6, 13, 11, 15, 10, 4, 15, 15, 10, 7, 14, 20, 16, 8, 5, 11, 14, 11, 10, 1, 3, 7, 20, 13, 10, 16, 8, 11, 8, 10, 2, 10, 10, 6, 12, 9, 5, 12, 15, 8, 2, 6, 4, 9, 12, 11, 15, 7, 11, 15, 9, 12, 7, 4, 11, 7, 14, 10, 10, 12, 10, 14, 9, 10, 8, 14, 11, 12, 9, 14, 13, 10, 18, 4, 5, 5, 12, 4, 9, 4, 14, 6, 19, 8, 7, 8, 6, 20, 6, 11, 13, 9, 8, 3, -2, 14, 16, 7, 11, 12, 1, 14, 13, 6, 16, 3, 7, 5, 14, 5, 11, 30, 30, 30, 30];
    var graphMode = 1; //defualt: 0 = all points, 1 = std dev, 2 = custom
    var includeOutliers = false; //default - true/false


//arrays init:
  var dataSetSize;
  var dataSet = [], dataSetNums = [];
  var dataSetFreqs = [], dataSetRelFreqs = [];
  var stdDevGroups = [], stdDevCount = [];
  var customSizeGroups = [], customSizeCount = [];

//calculated values init
  var avg, stdDev, Median, Q1, Q3;
  var minimumVal, maximumVal;

function freq() {
	var a = [], b = [], prev;

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
	for (var b = 0; b < dataSetSize - 1; ++b) {
		for (var a = 0; a < dataSetSize - 1; ++a) {
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
	if (dataSetSize % 2 == 1) {
		var elims = int(dataSetSize / 2);
		Median = dataSet[elims];
		Q1 = quartile(0, elims - 1);
		Q3 = quartile(elims + 1, dataSetSize - 1);
	} else {
		var elims = dataSetSize / 2;
		elims += -1;
		Median = (dataSet[elims] + dataSet[elims + 1]) / 2;
		Q1 = quartile(0, elims);
		Q3 = quartile(elims + 1, dataSetSize - 1);
	}
}

function setup() {
	createGraph();

  toggleOutliers = createButton("Toggle Outliers");
	toggleOutliers.position(20,387);
	toggleOutliers.mouseClicked(outlierToggleFunc);
	
	newButton = createButton("New Data Set");
  newButton.position(130,387);
  newButton.mouseClicked(newData);
  
	selGraphMode = createSelect();
	selGraphMode.position(235,387);
	selGraphMode.option("Standard Deviation Mode");
	selGraphMode.option("All Points Mode");
	selGraphMode.option("Custom Mode");
	selGraphMode.changed(selGraphModeFunc);

  zButton = createButton("Calculate Z-Score");
  zButton.position(415,387);
  zButton.mouseClicked(zButtonFunc);
}

function selGraphModeFunc(){
  if (selGraphMode.value() == "All Points Mode"){graphMode = 0;}
  else if (selGraphMode.value() == "Standard Deviation Mode"){graphMode = 1;}
  else if (selGraphMode.value() == "Custom Mode"){graphMode = 2;}
  createGraph();
}
function outlierToggleFunc(){
  if (includeOutliers == true){includeOutliers = false}
  else if(includeOutliers == false){includeOutliers = true}
  createGraph();
}
function newData(){
  var txt = prompt("New data set, separate with commas");
  tmpVar = split(txt, ",");
  for (var i = 0; i<tmpVar.length; i++){
    tmpVar[i] = tmpVar[i] - 1;
    tmpVar[i] = tmpVar[i] + 1;
  }
  UserDataSet = tmpVar;
  createGraph();
}
function zButtonFunc(){
  var txt = prompt("Enter the point to calculate Z-Score of");
  var zScore = (float(txt) - avg) / stdDev;
  console.log(zScore);
  
}

function createGraph() {
  dataSet = UserDataSet;
  
  sumSqr = 0;
  dataSum = 0;
  outLiers = 0;
  
  stdDevGroups = [];
  stdDevCount = [];
  
  customSizeGroups = [];
  customSizeCount = [];

	createCanvas(800, 415);
	background(120);
	stroke(1);
	strokeWeight(1);
	dataSetSize = dataSet.length;
	sortArr();
  
  
  
	doMath();
  
  
	if (includeOutliers == false)
	{
		var tempArray = [];
		var outRangeTop = Q3+(1.5*(Q3-Q1));
		var outRangeBottom = Q1-(1.5*(Q3-Q1));
		for(var i = 0; i<(dataSetSize); i++){
			if (dataSet[i] > outRangeTop || dataSet[i] < outRangeBottom){
				outLiers += 1;
			}else{
				splice(tempArray, dataSet[i], i);
			}
		}
		
		dataSet = tempArray;
		dataSetSize = dataSet.length;	
		
		doMath();
	}



	console.log('Sum of Values: ', dataSum);
	console.log('Avg: ', avg);
	console.log('Standard Deviation: ', stdDev);
	console.log('Quartile 1: ', Q1);
	console.log('Median: ', Median);
	console.log('Quartile 3: ', Q3);
	console.log('Values ', dataSetSize);
	//console.log('Data Set:', dataSet);
	console.log("-------------------------------");
  
   /*
	*	console.log("Frequencies", dataSetFreqs);
	*	console.log("Deviation Groups", stdDevGroups);
	*	console.log("Deviation Group Counts", stdDevCount);
	*	console.log("Custom Groups", customSizeGroups);
	*	console.log("Custom Group Counts", customSizeCount);
	*/
	var textNum = [9]; // whitespace is very important below
	textNum[0] = "Outliers Excluded     " + (UserDataSet.length - dataSet.length);
	textNum[1] = "Average:                   " + round(10000*avg)/10000;
	textNum[2] = "Std Deviation:   	     " + round(10000*stdDev)/10000;
	textNum[3] = "1st Quartile:   	        " + Q1;
	textNum[4] = "Median:                     "+ Median;
	textNum[5] = "3rd Quartile:  	         " + Q3;
	textNum[6] = "# of Values    	         " + dataSetSize;
	textNum[7] = "Minimum    	            " + minimumVal;
	textNum[8] = "Maximum    	           " + maximumVal;
	

	//decrease this if more vars are added to textNum
	var textY = 29;
	textSize(15);
	fill(255);
	stroke(120);
	for (var i = 0; i<textNum.length; i++){text(textNum[i], 530, 40 + textY * i);}	
	
	var graphBoxW = 500;
	var graphBoxH = 350;

	noStroke();
	fill(255);
	rectMode(CORNER);
	rect(20, 20, graphBoxW, graphBoxH + 11);

	rectMode(CORNER);
	textAlign(LEFT);

	//changes max numbers to write on histograph
	if ((graphMode == 0 && dataSet.length > maxNums) ||	(graphMode == 1 && stdDevGroups.length > maxNums) || (graphMode == 2 && customSizeGroups.length > maxNums)) {
	}else{
		var doNumbers = true;
	}

	//draw histogram boxes in different colors according to their size.
	if (graphMode == 0) {
		var colConst = 200 / dataSetNums.length;
		var histWidth = graphBoxW / dataSetNums.length;
		var oneSize = (graphBoxH - 20) / max(dataSetFreqs);

		for (var i = 0; i < dataSetNums.length; ++i) {
			stroke(i * colConst + 55, 0, 0);
			fill(i * colConst + 55, 0, 0);
			rect(20 + histWidth * i, 380, histWidth, -oneSize * dataSetFreqs[i]);
			fill(255);
			if (doNumbers == true) {
				var temp2 = round(100 * dataSetNums[i]) / 100 + ' ';
				text(temp2, 12 + histWidth * i + histWidth / 2, 380);
			}
		}
	} 
	else if (graphMode == 1) {
		var colConst = 200 / stdDevGroups.length;
		var histWidth = graphBoxW / stdDevGroups.length;
		var oneSize = (graphBoxH - 20) / max(stdDevCount);

		for (var i = 0; i < stdDevGroups.length; ++i) {
			stroke(i * colConst + 55, 0, 0);
			fill(i * colConst + 55, 0, 0);
			rect(20 + histWidth * i, 380, histWidth, -oneSize * stdDevCount[i]);
			fill(255);
			if (doNumbers == true) {
				if (i != 0) {
					var temp3 =
						round(100 * stdDevGroups[i - 1]) / 100 +
						'-' +
						round(100 * stdDevGroups[i]) / 100;
				} else {
					var temp3 =
						round(100 * minimumVal) / 100 +
						'-' +
						round(100 * stdDevGroups[i]) / 100;
				}
				text(temp3, -10 + histWidth * i + histWidth / 2, 380);
			}
		}
	} 
	else if (graphMode == 2) {
		var colConst = 200 / customSizeGroups.length;
		var histWidth = graphBoxW / customSizeGroups.length;
		var oneSize = (graphBoxH - 20) / max(customSizeCount);

		for (var i = 0; i < customSizeGroups.length; ++i) {
			stroke(i * colConst + 55, 0, 0);
			fill(i * colConst + 55, 0, 0);
			rect(20 + histWidth * i, 380, histWidth, -oneSize * customSizeCount[i]);
			fill(255);
			if (doNumbers == true) {
				if (i != 0) {
					var temp3 =
						round(100 * customSizeGroups[i - 1]) / 100 +
						'-' +
						round(100 * customSizeGroups[i]) / 100;
				} else {
					var temp3 =
						round(100 * minimumVal) / 100 +
						'-' +
						round(100 * customSizeGroups[i]) / 100;
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
	var range = maximumVal - minimumVal;
	var newConst = 245 / range;
	var Q1st = (Q1 - minimumVal) * newConst + 535;
	var med = (Median - minimumVal) * newConst + 535;
	var Q3rd = (Q3 - minimumVal) * newConst + 535;

	rectMode(CORNERS);
	fill(255, 0, 10);
	rect(535,334,780,336); //line from min to max (always same on canvas)
	rect(Q1st, 320, Q3rd,350); //box from 1st Qaurtile to 3rd Qaurtile
	fill(0);
	rect(med - 1, 320, med + 1, 350);

}

function doMath(){
  sumSqr = 0;
  dataSum = 0;
  outLiers = 0;
  stdDevGroups = [];
  stdDevCount = [];
  customSizeGroups = [];
  customSizeCount = [];
  
	//working standard deviation code - compacted
	  var sumSqr = 0, dataSum = 0;
	for (var i = 0; i < dataSetSize; i++) {
		dataSum = dataSum + dataSet[i];
	}
	avg = dataSum / dataSetSize;
	for (var i = 0; i < dataSetSize; i++) {
		sumSqr = sumSqr + (dataSet[i] - avg) * (dataSet[i] - avg);
	}
	stdDev = sqrt(sumSqr / dataSetSize);

	median();
	minimumVal = dataSet[0];
	maximumVal = dataSet[dataSetSize - 1];

	//finds relative frequency for each unique number in data set
	var temp = freq();
	dataSetNums = temp[0];
	dataSetFreqs = temp[1];
	uniqueNums = dataSetNums.length;
	for (var i = 0; i < dataSetNums.length; i++) {
		dataSetRelFreqs[i] = dataSetFreqs[i] / dataSetSize;
	}

	//for std dev horizontal
	dataRange = dataSet[dataSetSize - 1] - dataSet[0];
	for (var i = 0; i < dataRange / stdDev; i++) {
		stdDevGroups[i] = round(roundFactor * (stdDev * i + stdDev + minimumVal)) / roundFactor;
		stdDevCount[i] = 0;
	}

	for (var i = 0; i < dataSetSize; i++) {
		for (var j = 0; j < stdDevGroups.length; j++) {
			if (
				dataSet[i] < stdDevGroups[j] &&
				dataSet[i] >= stdDevGroups[j] - round(roundFactor * stdDev) / roundFactor
			) {
				stdDevCount[j] += 1;
			}
		}
	}

	//for custom horizontal histogram
	for (var i = 0; i < dataRange / customHistoWidth; i++) {
		customSizeGroups[i] =
			round(
				roundFactor * (customHistoWidth * i + customHistoWidth + minimumVal)
			) / roundFactor; //round ( roundFactor * (stdDev * i + stdDev + minimumVal))/roundFactor;
		customSizeCount[i] = 0;
	}

	for (var i = 0; i < dataSetSize; i++) {
		for (var j = 0; j < customSizeGroups.length; j++) {
			if (
				dataSet[i] < customSizeGroups[j] &&
				dataSet[i] >=
					customSizeGroups[j] - round(roundFactor * customHistoWidth) / roundFactor
			) {
				customSizeCount[j] += 1;
			}
		}
	}
}