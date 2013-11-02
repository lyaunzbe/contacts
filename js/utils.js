var win = window, doc = document;

// IE Custom event Polyfill
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, data: undefined };
    var evt = doc.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.data );
    return evt;
   };

  CustomEvent.prototype = win.CustomEvent.prototype;

  win.CustomEvent = CustomEvent;
})();

// My blazing fast, native JQuery alternative :) 
var $  = function(s){
  if(doc.querySelectorAll(s).length < 2)
    return doc.querySelectorAll(s)[0];
  else
    return doc.querySelectorAll(s);
}


var htmlEvents = {
  //Keyboard Events
  onkeydown:1,
  onkeypress:1,
  onkeyup:1,
  //Mouse Events
  onclick:1,
  ondblclick:1,
  onmousedown:1,
  onmousemove:1,
  onmouseout:1,
  onmouseover:1,
  onmouseup:1
}

function trigger(el, eventName, data){
  var event;
  if(htmlEvents['on'+eventName]){
    if(doc.createEvent){
        event = doc.createEvent('HTMLEvents');
        event.initEvent(eventName,true,true);
    }else if(doc.createEventObject){// IE < 9
        event = doc.createEventObject();
        event.eventType = eventName;
    }
    event.eventName = eventName;
    if(el.dispatchEvent){
        el.dispatchEvent(event);
    }else if(el.fireEvent && htmlEvents['on'+eventName]){// IE < 9
        el.fireEvent('on'+event.eventType,event);
    }else if(el[eventName]){
        el[eventName]();
    }else if(el['on'+eventName]){
        el['on'+eventName]();
    }
  }else{
    var event = new CustomEvent(eventName, {"data":data});
    el.dispatchEvent(event);
  }
}

// HTML String -> DocFrag Converter

function createFrag(htmlString) {
  var frag = doc.createDocumentFragment(),
      temp = doc.createElement('div');
  temp.innerHTML = htmlString;

  while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
  }
  return frag;
}

/**
* "Cookie Jar" Persistant Storage Layer
**/

function createCookie(name,value,days) {
  value = JSON.stringify(value);

  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  doc.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = doc.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length,c.length));
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}