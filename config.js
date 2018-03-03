//github.com/ethandeguire/Stats
//change these numbers to edit dataset, separate by commas

var dataSet = [1,1,1,1,1,2,2,11,12,13,14,-1,-2,-3,-3,-3,17,18,3,24,25,3,2,4,5,5,3,6,5,4,0,2,2,2,19];
var graphMode = 1; // "0" = all points historammed ----- "1" = standard deviation histogram ----- "2" = custom size histogram
var roundFactor = 10; //value to round  by - higher number == more precise. use powers of 10
var customHistoWidth = 2; //value for horizontal ranges in histogram, only valid if graphMode = "custom"
var maxNums = 20; //max numbers allowed on histograph
var includeOutliers = false; //false or true