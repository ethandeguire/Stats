//github.com/ethandeguire/Stats
//change these numbers to edit dataset, separate by commas
var dataSet = [2,4,6,8,10,12];
var graphMode = "allPoints"; //"allPoints" or "histogram" (include ")
var deviationRoundingFactor = 1000; //value to round by - higher number == more precise. use powers of 10

var arrSize;
var devGroups = [];
var devCount = [];

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
	for (var b = 0; b<(arrSize-1); ++b){
		for (var a = 0; a<(arrSize-1); ++a){
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
	if (arrSize % 2 == 1){
		var elims = int(arrSize/2);
		Median = dataSet[elims];
		Q1 = quartile(0,elims-1);
		Q3 = quartile(elims+1,arrSize-1);
	}else{
		var elims = arrSize/2;
		elims += -1;
		Median = (dataSet[elims]+dataSet[elims+1])/2;
		Q1 = quartile(0,elims);
		Q3 = quartile(elims+1,arrSize-1);
	}
}

function setup() 
{
	
	createCanvas(800,400);
	background(120);
	stroke(1);
	strokeWeight(1);
	arrSize = dataSet.length;
	sortArr();
	
	//working standard deviation code - compacted
	for(var i=0;i<arrSize;i++){dataSum=dataSum+dataSet[i];}
	avg=dataSum/arrSize;
	for(var i=0; i<arrSize;i++){sumSqr=sumSqr+((dataSet[i]-avg)*(dataSet[i]-avg));}
	stdDev=sqrt(sumSqr/arrSize);
	
	median();
	minimumVal = dataSet[0];
	maximumVal = dataSet[arrSize-1];
	
	
	
	//finds relative frequency for each unique number in data set
	var temp = freq();
	arrNums = temp[0];
	arrFreqs = temp[1];
	uniqueNums = arrNums.length;
	relFreqs = [];
	for(var i=0;i<arrNums.length;i++){relFreqs[i] = arrFreqs[i] / arrSize;}
	maxNum = arrNums[arrNums.length-1];
	

	
	dataRange = dataSet[arrSize-1] - dataSet[0];
	for(var i = 0; i<(dataRange/stdDev); i++)
	{
		devGroups[i] = round ( deviationRoundingFactor * (stdDev * i + stdDev + minimumVal))/deviationRoundingFactor;
	}
		
	for (var i = 0; i<devGroups.length; i++)
	{
		devCount[i] = 0;
	}
	
	for(var i = 0; i<arrSize; i++)
	{
		for (var j = 0; j<devGroups.length; j++)
		if (dataSet[i] < devGroups[j] && dataSet[i] >= devGroups[j] - round(deviationRoundingFactor*stdDev)/deviationRoundingFactor)
		{
			devCount[j] += 1;
		}
	}
	
	
	
	console.log("Sum of Values: ",dataSum);
	console.log("Avg: ",avg);
	console.log("Standard Deviation: ",stdDev);
	console.log("Quartile 1: ",Q1);
	console.log("Median: ",Median);
	console.log("Quartile 3: ",Q3);
	console.log("Values ",arrSize);
	console.log("Data Set:", dataSet);
	console.log("Frequencies", arrFreqs);
	console.log("Deviation Groups", devGroups);
	console.log("Deviation Group Counts", devCount);
	
	var text1 = "Sum of Values:	   " + dataSum;
	var text2 = "Average:              " + avg;
	var text3 = "Std Deviation:  	  " + stdDev;
	var text4 = "1st Quartile:  	    " + Q1;
	var text5 = "Median:         	   "+ Median;
	var text6 = "3rd Quartile:  	   " + Q3;
	var text7 = "# of Values    	    " + arrSize;
	
	fill(255);
	stroke(120);
	textSize(15);
	text(text1,530,40);
	text(text2,530,80);
	text(text3,530,120);
	text(text4,530,160);
	text(text5,530,200);
	text(text6,530,240);
	text(text7,530,280);	
}

function draw() 
{
	var graphBoxW = 500;
	var graphBoxH = 350;
	
	noStroke();
	fill(255);
	rect(20,20,graphBoxW,graphBoxH);
	
	rectMode(CORNER);
	textAlign(LEFT);

	//draw histogram boxes in different colors according to their size.
	if (graphMode == "allPoints")
	{
		var colConst = 200/arrNums.length;
		var histWidth = graphBoxW/arrNums.length;
		var oneSize = (graphBoxH-20) / max(arrFreqs);
		
		for (var i = 0; i<arrNums.length; ++i)
		{
			stroke(i*colConst+55,0,0);
			fill(i*colConst+55,0,0);
			rect(20+histWidth*i,height-20,histWidth,-oneSize*arrFreqs[i]);
			fill(255);
			var temp2 = round(100*arrNums[i])/100+' ';
			text(temp2, 12+histWidth*i+histWidth/2,height-20)
		}
	}else if (graphMode == "histogram"){
		var colConst = 200/devGroups.length;
		var histWidth = graphBoxW/devGroups.length;
		var oneSize = (graphBoxH-20) / max(devCount);
		
		for (var i = 0; i<devGroups.length; ++i)
		{
			stroke(i*colConst+55,0,0);
			fill(i*colConst+55,0,0);
			rect(20+histWidth*i,height-20,histWidth,-oneSize*devCount[i]);
			fill(255);
			if (i != 0){var temp3 = round(100*(devGroups[i-1]))/100 + '-' + round(100*(devGroups[i]))/100;}
			else{var temp3 = round(100*minimumVal)/100 + '-' + round(100*devGroups[i])/100;}
			text(temp3, -10+histWidth*i+histWidth/2,height-20)
		}
	}
	
	
	noStroke();
	fill(255);
	rect(535,300,245,70);
	
	//have 245 pixels = 100%
	// 100% should be max value, highest in dataset
	
	var newConst = 245/(dataSet[arrSize-1]+1);
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

















