
document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mouseup', mouseup, false);
document.addEventListener('mousemove', mousemove, false);
window.ondragstart = function() { return false; } 
var xcoorTo,xcoorFrom,speed;
var scrollItem;
var searchStr = "";
var mouseisdown = false;
const maxSize = 320;
const apiSearchPrefix = "https://www.googleapis.com/youtube/v3/search?maxResults=20&part=snippet&key=AIzaSyB8iFzdNo8E2OuiJeIhHPSXpbh3psn8mvQ&q="
const apiStatisticPrefix = "https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=AIzaSyB8iFzdNo8E2OuiJeIhHPSXpbh3psn8mvQ&id="
const youtubePrefix = "https://www.youtube.com/watch?v="
var elementwidth = 320;
var blockArr = [];
const accel = 1;
var searchResult;
var inInEnd = false;
var n = 0;


function mousedown(evt)
{
	mouseisdown = true;
}

function mousemove(evt)
{
	xcoorTo =  evt.screenX;
	if (mouseisdown )
	{
		scrollItem.scrollLeft += xcoorFrom-xcoorTo;
		speed = xcoorFrom-xcoorTo;
	}
	xcoorFrom=  evt.screenX;
}

function mouseup(evt)
{
	mouseisdown = false;
	speedProceed();
}

function resize()
{
	var scrollpoint = scrollItem.scrollLeft;               
	var curretSeen = Math.floor((scrollpoint+2)/elementwidth);       
	var newWindowSize = document.getElementById('body').clientWidth;
	var targetOnScreen = Math.floor(newWindowSize/maxSize) + 1;     
	var targetBlockArraySize = targetOnScreen*maxSize;				
	var targetAndWindowDif = newWindowSize - targetBlockArraySize;
	var sizeCurrection = targetAndWindowDif / targetOnScreen;		
	var currectedSize = (maxSize + sizeCurrection - 20)+'px';	
	for (var i = 0; i < blockArr.length; i++)						
	{
		blockArr[i].style.width = currectedSize;
	}
	elementwidth = maxSize + sizeCurrection;
	scrollItem.scrollLeft = curretSeen*elementwidth;
}

function speedProceed()
{
	if ((!(mouseisdown))&&(Math.abs(speed) > 1))
	{
		scrollItem.scrollLeft += speed;
		if (speed > 0)
		{
			speed -= accel;
		}
		else 
		{
			speed += accel;
		}
		setTimeout(function() {speedProceed();}, 10)
	}
	else
	{
		if (Math.abs(speed) <= 1)
		{
			positionNiceficator();
		}
	}
	var scrollpoint = scrollItem.scrollLeft;
	var WindowSize = document.getElementById('body').clientWidth;
	if ((scrollpoint+WindowSize+5 > listBlock.clientWidth) && !(inInEnd))
	{
		inInEnd = true;
		speed = 0;
		searchNextPage();
	}
	if (scrollpoint+WindowSize < listBlock.clientWidth - maxSize*2)
	{
		inInEnd = false;
	}
}


function loading()
{
	scrollItem = document.getElementById('scrollId');
	listBlock = document.getElementById('listBlock');
	for (var i = 0; i < 30; i++)
	{
		var element = document.createElement('div');
    	element.className = 'blockwithborder';
    	element.style.width = '300px';
    	listBlock.appendChild(element);
    	blockArr.push(element);
	}
	resize();
}


function speedNiceficator() 							
{
	var startX = scrollItem.scrollLeft % elementwidth 
	var time = Math.abs(speed/accel);					
	if  (speed > 0)									
	{										
		var predictionX = startX+ speed*time - accel*time*time/2;
	}
	else
	{
		var predictionX = startX + speed*time + accel*time*time/2; 
	}
	var stopOn = Math.floor(predictionX/elementwidth);
	if((predictionX % elementwidth) > (elementwidth / 2))
	{
		stopOn++
	}
	var targetX = stopOn*elementwidth - startX;		
	var sqrTime2 = 2*targetX*accel;
	time = Math.sqrt(Math.abs(sqrTime2));
	tempSpeed = accel*time;
	if (targetX < 0)
	{
		speed = tempSpeed/(-1);
	}
	else
	{
		speed = tempSpeed;
	}
}


function positionNiceficator() 
{
	var startX = scrollItem.scrollLeft % elementwidth 
	if(startX > (elementwidth / 2))						
	{
		var targetX = elementwidth - startX;
	}
	else
	{
		var targetX = -startX;
	}
	var sqrTime2 = 2*targetX*accel;
	time = Math.sqrt(Math.abs(sqrTime2));
	tempSpeed = accel*time;
	if (targetX < 0)
	{
		speed = tempSpeed/(-1);
	}
	else
	{
		speed = tempSpeed;
	}
	setTimeout(function() {speedProceed();}, 10)
}
function listClear()
{
	listBlock = document.getElementById('listBlock');
	blockArr.forEach(function(entry) 
	{
    	listBlock.removeChild(entry);
	});
	blockArr = [];
}

function searchNextPage()
{
	var loadInd = document.getElementById('loadingBar');
	loadInd.setAttribute("class", "loading");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", apiSearchPrefix + searchStr+ "&pageToken="+searchResult.nextPageToken, false); 
	xhr.send();
	searchResult = JSON.parse(xhr.responseText)
	loadingResults();
}

function searchFirst()
{
	listClear()
	searchStr = document.getElementById('keywords').value
	if(searchStr.length == 0)
	{
		alert('Пусто');
	}
	else
	{
		var loadInd = document.getElementById('loadingBar');
		loadInd.setAttribute("class", "loading");
		searchStr = searchStr.replace(/\s/g,'+');
		var xhr = new XMLHttpRequest();
		xhr.open("GET", apiSearchPrefix + searchStr, false); 
		xhr.send();
    	searchResult = JSON.parse(xhr.responseText);
		loadingResults();
	}
}
function do_nothing(evt)
{}
function loadingResults()
{

	scrollItem = document.getElementById('scrollId');
	listBlock = document.getElementById('listBlock');
	for (var i = 0; i < searchResult.items.length; i++)
	{
		if (searchResult.items[i].id.videoId != null){ 
		var element = document.createElement('div');		
    	element.className = 'blockwithborder';
    	listBlock.appendChild(element);
		blockArr.push(element); 				
											
    	var a = document.createElement('a');		
    	a.setAttribute("href", youtubePrefix + searchResult.items[i].id.videoId);
    	a.setAttribute("target", "_blank");
    	element.appendChild(a);	


    	var img = document.createElement('img');  
    	img.setAttribute("src",searchResult.items[i].snippet.thumbnails.high.url);
    	a.appendChild(img);

 		var h1 = document.createElement('h1');		
 		var t = document.createTextNode(searchResult.items[i].snippet.title);
 		h1.appendChild(t);
    	element.appendChild(h1);									

    	var h2 = document.createElement('h2');		
 		var t = document.createTextNode(searchResult.items[i].snippet.channelTitle);
 		h2.appendChild(t);
    	element.appendChild(h2);

   		var xhr = new XMLHttpRequest();
		xhr.open("GET", apiStatisticPrefix + searchResult.items[i].id.videoId, false); 
		xhr.send();
		var statResult = JSON.parse(xhr.responseText);
		var durationStr = statResult.items[0].contentDetails.duration;
		durationStr = durationStr.replace(/PT/g,'');
		durationStr = durationStr.replace(/H/g,':')
		durationStr = durationStr.replace(/M/g,':');
		durationStr = durationStr.replace(/S/g,'');	
		var p = document.createElement('p');		
 		var t = document.createTextNode(durationStr);
 		p.appendChild(t);
    	element.appendChild(p);	

    	var p = document.createElement('p');	
 		var t = document.createTextNode("Decsription: "+searchResult.items[i].snippet.description);
 		p.appendChild(t);
    	element.appendChild(p);	
    	}
	}
	resize();
	var loadInd = document.getElementById('loadingBar');
	loadInd.setAttribute("class", "hidden");
	speed = 0;
}