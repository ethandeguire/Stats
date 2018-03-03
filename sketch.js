//github.com/ethandeguire/Stats

var dataSetSize; //used to be arrSize

var dataSetNums = []; //used to be arrNums
var dataSetFreqs = []; //used to be arrFreqs

var stdDevGroups = [];
var stdDevCount = [];

var customSizeGroups = [];
var customSizeCount = [];



var sumSqr = 0;
var dataSum = 0;
var avg;
var stdDev;
var Median;
var Q1;
var Q3;

var relFreqs;
var maxNum;
var minimumVal;
var maximumVal;
var result;
var outLiers = 0;

function freq() 
{
    var a = [], b = [], prev;

    for ( var i = 0; i < dataSet.length; i++ ) {
        if ( dataSet[i] !== prev ) {
            a.push(dataSet[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = dataSet[i];
    }

    return [a, b];
}

function sortArr()
{
	var count = 0;
	for (var b = 0; b<(dataSetSize-1); ++b){
		for (var a = 0; a<(dataSetSize-1); ++a){
			count += 1;
			if (dataSet[a] > dataSet[(a+1)])
			{
				var temp = dataSet[a];
				dataSet[a] = dataSet[(a+1)];
				dataSet[a+1] = temp;
			}
		}
	}	
}

function quartile(startPos, endPos)
{
	var range = endPos - startPos + 1;
	if (range % 2 == 1){
		var elimsQ = int(range/2);
		return dataSet[elimsQ+startPos];
	}else{
		var elimsQ = range/2;
		elimsQ += -1;
		return ((dataSet[elimsQ+startPos]+dataSet[elimsQ+startPos+1]) /2)
	}

}

function median()
{
	if (dataSetSize % 2 == 1){
		var elims = int(dataSetSize/2);
		Median = dataSet[elims];
		Q1 = quartile(0,elims-1);
		Q3 = quartile(elims+1,dataSetSize-1);
	}else{
		var elims = dataSetSize/2;
		elims += -1;
		Median = (dataSet[elims]+dataSet[elims+1])/2;
		Q1 = quartile(0,elims);
		Q3 = quartile(elims+1,dataSetSize-1);
	}
}

function setup() 
{
	
	createCanvas(800,400);
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
		
	console.log("Sum of Values: ",dataSum);
	console.log("Avg: ",avg);
	console.log("Standard Deviation: ",stdDev);
	console.log("Quartile 1: ",Q1);
	console.log("Median: ",Median);
	console.log("Quartile 3: ",Q3);
	console.log("Values ",dataSetSize);
	console.log("Data Set:", dataSet);
	console.log("Data Set Freqs:", dataSetFreqs);
	console.log("Data Set Nums:", dataSetNums);
	console.log("stdDevGroups:", stdDevGroups);
	console.log("stdDevCount:", stdDevCount);
	console.log("customSizeGroups:", customSizeGroups);
	console.log("customSizeCount:", customSizeCount);
	console.log("outliers: ",outLiers);	
	
	var textNum = [10]; // whitespace is very important below
	textNum[0] = "Sum of Values: 	     " + dataSum;
	textNum[1] = "Average:                   " + round(10000*avg)/10000;
	textNum[2] = "Std Deviation:   	     " + round(10000*stdDev)/10000;
	textNum[3] = "1st Quartile:   	        " + Q1;
	textNum[4] = "Median:                     "+ Median;
	textNum[5] = "3rd Quartile:  	         " + Q3;
	textNum[6] = "# of Values    	         " + dataSetSize;
	textNum[7] = "Minimum    	            " + minimumVal;
	textNum[8] = "Maximum    	           " + maximumVal;
	textNum[9] = "Outliers Excluded    " + outLiers;
	
	fill(255);
	stroke(120);
	
	
	//decrease this if more vars are added to textNum
	var textY = 27;
	textSize(15);
	for (var i = 0; i<textNum.length; i++){text(textNum[i], 530, 40 + textY * i);}	

	text(round(1000*minimumVal)/1000,16,395);
	text(round(1000*maximumVal)/1000,514,395);

	
}

function doMath()
{
	//these need to be recleared if doMath() is called more than once per instance
	dataSum = 0;
	sumSqr = 0;
	stdDevCount = [];
	stdDevGroups = [];
	
	//working standard deviation code - compacted
	for(var i=0;i<dataSetSize;i++){dataSum=dataSum+dataSet[i];}
	avg=dataSum/dataSetSize;
	for(var i=0; i<dataSetSize;i++){sumSqr=sumSqr+((dataSet[i]-avg)*(dataSet[i]-avg));}
	stdDev=sqrt(sumSqr/dataSetSize);
	
	median();
	minimumVal = dataSet[0];
	maximumVal = dataSet[dataSetSize-1];
	
	//finds relative frequency for each unique number in data set
	var temp = freq();
	dataSetNums = temp[0];
	dataSetFreqs = temp[1];
	uniqueNums = dataSetNums.length;
	relFreqs = [];
	for(var i=0;i<dataSetNums.length;i++){relFreqs[i] = dataSetFreqs[i] / dataSetSize;}
	maxNum = dataSetNums[dataSetNums.length-1];
	

	//for std dev horizontal
	dataRange = dataSet[dataSetSize-1] - dataSet[0];
	for(var i = 0; i<(dataRange/stdDev); i++){
		stdDevGroups[i] = round ( roundFactor * (stdDev * i + stdDev + minimumVal))/roundFactor;
		stdDevCount[i] = 0;
	}
	
	for(var i = 0; i<dataSetSize; i++){
		for (var j = 0; j<stdDevGroups.length; j++){
			if (dataSet[i] < stdDevGroups[j] && dataSet[i] >= stdDevGroups[j] - round(roundFactor*stdDev)/roundFactor){
				stdDevCount[j] += 1;
			}
		}
	}
	
	//for custom horizontal
	for(var i = 0; i<(dataRange/customHistoWidth); i++){
		customSizeGroups[i] = round(roundFactor * (customHistoWidth * i + customHistoWidth + minimumVal))/roundFactor;     //round ( roundFactor * (stdDev * i + stdDev + minimumVal))/roundFactor;
		customSizeCount[i] = 0;
	}
	
	for(var i = 0; i<dataSetSize; i++){
		for (var j = 0; j<customSizeGroups.length; j++){
			if (dataSet[i] < customSizeGroups[j] && dataSet[i] >= customSizeGroups[j] - round(roundFactor*customHistoWidth)/roundFactor){
				customSizeCount[j] += 1;
			}
		}
	}
}

function draw() 
{
	var graphBoxW = 500;
	var graphBoxH = 350;
	
	noStroke();
	fill(255);
	rect(20,20,graphBoxW,graphBoxH+11);
	
	rectMode(CORNER);
	textAlign(LEFT);

	//changes max numbers to write on histograph
	if ((graphMode == 0 && dataSetFreqs.length > maxNums) || (graphMode == 1 && stdDevGroups.length > maxNums) ||(graphMode == 2 && customSizeGroups.length > maxNums)){}else {var doNumbers = true};
	
	//draw histogram boxes in different colors according to their size.
	if (graphMode == 0)
	{
		var colConst = 200/dataSetNums.length;
		var histWidth = graphBoxW/dataSetNums.length;
		var oneSize = (graphBoxH-20) / max(dataSetFreqs);
		
		for (var i = 0; i<dataSetNums.length; ++i)
		{
			stroke(i*colConst+55,0,0);
			fill(i*colConst+55,0,0);
			rect(20+histWidth*i,height-20,histWidth,-oneSize*dataSetFreqs[i]);
			fill(255);
			if (doNumbers == true){var temp2 = round(100*dataSetNums[i])/100+' ';text(temp2, 12+histWidth*i+histWidth/2,height-20)}
		}
	}else if (graphMode == 1){
		var colConst = 200/stdDevGroups.length;
		var histWidth = graphBoxW/stdDevGroups.length;
		var oneSize = (graphBoxH-20) / max(stdDevCount);
		
		for (var i = 0; i<stdDevGroups.length; ++i)
		{
			stroke(i*colConst+55,0,0);
			fill(i*colConst+55,0,0);
			rect(20+histWidth*i,height-20,histWidth,-oneSize*stdDevCount[i]);
			fill(255);
			if (doNumbers == true){if (i != 0){var temp3 = round(100*(stdDevGroups[i-1]))/100 + '-' + round(100*(stdDevGroups[i]))/100;}else{var temp3 = round(100*minimumVal)/100 + '-' + round(100*stdDevGroups[i])/100;}text(temp3, -10+histWidth*i+histWidth/2,height-20)}
		}
	
	}else if (graphMode == 2){
		var colConst = 200/customSizeGroups.length;
		var histWidth = graphBoxW/customSizeGroups.length;
		var oneSize = (graphBoxH-20) / max(customSizeCount);
		
		for (var i = 0; i<customSizeGroups.length; ++i)
		{
			stroke(i*colConst+55,0,0);
			fill(i*colConst+55,0,0);
			rect(20+histWidth*i,height-20,histWidth,-oneSize*customSizeCount[i]);
			fill(255);
			if (doNumbers == true){if (i != 0){var temp3 = round(100*(customSizeGroups[i-1]))/100 + '-' + round(100*(customSizeGroups[i]))/100;}else{var temp3 = round(100*minimumVal)/100 + '-' + round(100*customSizeGroups[i])/100;}text(temp3, -10+histWidth*i+histWidth/2,height-20)}
		}
	}
	
	
	noStroke();
	fill(255);
	rect(535,300,245,70);
	
	//have 245 pixels = 100%
	// 100% should be max value, highest in dataset
	
	var newConst = 245/(dataSet[dataSetSize-1]+1);
	var Q3rd = (Q3*newConst)+535;
	var Q1st = (Q1*newConst)+535;
	
	rectMode(CORNERS);
	fill(255,0,10);
	rect(Q3rd,315,Q1st,355);
	rect(Q3rd,334,780,336);
	rect(535+(dataSet[0]*i),334,Q1st,336);
	fill(0);
	rect(Median*newConst+534,315,Median*newConst+536,355)
}

















