console.log("working ok");
c = document.getElementById("canvas");
x = c.getContext("2d");

var rangeN = (length, start=0) => [ ...Array(length-start).keys() ].map(i => i+start);

var tables = document.getElementById("tables");
function makeTable(rowLabels, colLabels, array){
	let t = document.createElement("table");
	tables.appendChild(t);
	let tr = document.createElement("tr");
	tr.innerHTML = "<th> </th>";
	for (let i = 0; i < colLabels.length; i++) {
		let th = document.createElement("th");
		th.innerText = colLabels[i];
		tr.appendChild(th);
	}
	t.appendChild(tr);

	for (let i = 0; i < array.length; i++) {
		let tr = document.createElement("tr");
		let th = document.createElement("th");
		th.innerText = rowLabels[i];
		tr.appendChild(th);
		for (let j = 0; j < array[0].length; j++) {
			let td = document.createElement("td");
			td.innerText = array[i][j];;
			tr.appendChild(td);
		}
		t.appendChild(tr);
	}
	return t;
}

var letters = rangeN(8).map(x => rangeN(8).map(y=>String.fromCharCode(x*8+y+65)))
makeTable(rangeN(8), rangeN(8), letters);

var splitAngle = (angle, dirnum) => Math.floor(((angle/Math.PI + 1 + 1/dirnum)/2)%1 * dirnum);

function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
		console.log("yay");
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}


// var alphabet= ["EST N A ","BCDFGHJK","PQUVWXYZ","12345678"];
var alphabet= ["  ETAOI ","BCDFGHJK","LMNPQRSU","VWXYZ. 3"]; //fast bottoms
//var prefixes=new Array("",alphabet[0].indexOf(" "),alphabet[0].lastIndexOf(" ")) 
var prefixes = [" "];
prefixes = [" "].concat(getIndicesOf(" ", alphabet[0]));
makeTable(prefixes, rangeN(8), alphabet);

function straddle(message){
  var out=""
  message=message.toUpperCase()
  message=message.replace(/([0-9])/g,"/$1") // dumb way to escape numbers
  for(var i=0;i<message.length;i++){
    var chr=message[i]
	if(chr==" ")continue
	for(var j=0;j<alphabet.length;j++){
	  var k=alphabet[j].indexOf(chr)
	  if(k<0)continue
	  out+=prefixes[j].toString()+k
	}
	if(chr=="/")out+=message[++i]
  }
  return out
}

function unstraddle(message){
	var out=""
	var n,o
	for(var i=0;i<message.length;i++){
		n=message[i]*1
		var pre = prefixes.indexOf(parseInt(n));
		// console.log(pre);
		if(pre != -1){
			// console.log(n);
			o = alphabet[pre][message[++i]];
		} else {
			o=alphabet[0][n];
		}
		o=="/"?out+=message[++i]:out+=o
	}
	return out
}
/*
str="One night-it was on the twentieth of March, 1888-I was returning."
document.writeln(str)
document.writeln(straddle(str))
document.writeln(unstraddle(straddle(str)))
*/
drawBackground();

start = {};
c.addEventListener("mousedown", (e) => {
	console.log(e.button);
	switch(e.button){
		case 0:
			start = {};
			start.x = e.x;
			start.y = e.y;
			break;
		case 2:
			clear();
			break;
	}
});

c.addEventListener("touchstart", (e) => {
	start = {};
	start.x = e.x;
	start.y = e.y;
});

end = {};
c.addEventListener("mouseup", (e) => {
	switch (e.button) {
		case 0:
			end.x = e.x;
			end.y = e.y;
			handleswipe(start, end);
			break;
	}
});

c.addEventListener("touchend", (e) => {
	end.x = e.x;
	end.y = e.y;
	handleswipe(start, end);
});
c.addEventListener("contextmenu", (e) => {
	e.preventDefault();
});
/*
c.addEventListener("mousemove", (e) => {
	end.x = e.x;
	end.y = e.y;
	handleswipe(start, end);
});//*/
function Swipe(start, end, dir){
	return {start: start, end: end, dir: dir};
}
// straddled handler
var out = document.getElementById("letters");
var caps = false;
var straddledHandler = (()=>{
	var [swipe1, swipe2] = [null, null];
	return (function (startcoord, endcoord, dir){
		let swipe = new Swipe(startcoord, endcoord, dir);
		if(!swipe1){
			swipe1 = swipe;
		 
		
			if(unstraddle(swipe.dir + "") != "undefined") {
				console.log(unstraddle("" + swipe1.dir + ""));
				print(unstraddle("" + swipe1.dir + ""));
				swipe1 = null;
				return;
			}
		} else if(!swipe2){
			swipe2 = swipe;
			let finaldir = "" + swipe1.dir + swipe2.dir;
			let text = unstraddle(finaldir);
			console.log(text);
			console.log(finaldir);

			if (text == "3"){
				caps = !caps;
			} else {
				print(text);
			}
			swipe1 = null;
			swipe2 = null;
		}
	})
})();

var boxesLetters = rangeN(4).map(x=>rangeN(8).map(y=>String.fromCharCode(x*8+y+97)));
makeTable(rangeN(4), rangeN(8), boxesLetters);
var boxesHandler = (()=>{
	return (function (startcoord, endcoord, dir, angle){
		//let dir = splitAngle(angle, 4)
		//let swipe = new Swipe(startcoord, endcoord, dir);
		let row = startcoord[1] * 2 + startcoord[0];
		console.log(startcoord, dir);
		let text = boxesLetters[row][dir];
		console.log(text, row);
		out.innerText += text;
		
	})
})();

//var box_letters = 
var gridHandler = (()=>{
	var [swipe1, swipe2] = [null, null];
	return (function (startcoord, endcoord, dir){
		let swipe = new Swipe(startcoord, endcoord, dir);
		if(!swipe1){
			swipe1 = swipe;
		} else if(!swipe2){
			swipe2 = swipe;
			console.log(letters[swipe1.dir][swipe2.dir]);
			out.innerText += letters[swipe1.dir][swipe2.dir];
			
			swipe1 = null;
			swipe2 = null;
		}
	})
})();

let handlers = {
	"straddled": straddledHandler,
	"grid": gridHandler,
	"boxes": boxesHandler,
};
var form = document.querySelector("form");
for(i in handlers){
	form.innerHTML += '<input type="radio" id="'+i+'" name="handler" value="'+i+'" checked="true">\n';
	form.innerHTML += '<label for="'+i+'">'+i+'</label><br/>\n';
}
function handleLetter(...args){
	return handlers[document.querySelector('input[name="handler"]:checked').value](...args);
}
function print(str){
	out.innerHTML += caps ? str.toUpperCase() : str.toLowerCase();
}

var out = document.getElementById("letters");

var output = document.getElementById("coords");
function handleswipe(start, end){
	//clear();
	x.fillStyle = "black";
	x.beginPath();
	x.moveTo(start.x, start.y);
	x.lineTo(end.x, end.y);
	x.stroke();
	var startcoord = [];
	var endcoord = [];
	if(start.x < c.width/2){
		startcoord[0] = 0;
	} else {
		startcoord[0] = 1;
	}
	if(start.y < c.height/2){
		startcoord[1] = 0;
	} else {
		startcoord[1] = 1;
	}
	if(end.x < c.width/2){
		endcoord[0] = 0;
	} else {
		endcoord[0] = 1;
	}
	if(end.y < c.height/2){
		endcoord[1] = 0;
	} else {
		endcoord[1] = 1;
	}
	var angle = Math.atan2(end.x - start.x, end.y - start.y);
	var dir = splitAngle(angle, 8);
	output.innerText = "Start: " + startcoord + " (" + start.x + ", " + start.y + ")\n";
	output.innerText += "End: " + endcoord + " (" + start.x + ", " + start.y + ")\n";	
	output.innerText += "angle: " + angle;
	output.innerText += "\ndirnum:" + dir;
	//output.innerText += "\ndirnum:" + Math.floor((dir/(2*Math.PI) + .5 + .125)%1 * 8);
	//handleCoord(startcoord, endcoord, dir);
	handleLetter(startcoord, endcoord, dir, angle);
}

function clear(){
	//console.log("working");
	x.clearRect(0.1,0.1,c.width,c.height);
	drawBackground();
	//console.log("working x 2");
	// x.fillRect(0,0,1,1);
	
	out.innerText = "";
}

function drawBackground(){
	x.fillStyle = "#111111";
	//x.fillStyle = "gray";
	x.beginPath();
	x.moveTo(c.width/2, 0);
	x.lineTo(c.width/2, c.height);
	x.moveTo(0, c.height/2);  
	x.lineTo(c.width, c.height/2);
	x.stroke();
}
