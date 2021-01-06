var openBtn = document.createElement('button');
openBtn.style.position = 'fixed';

// The part below is borrowed form Tuana's code
var iframe  = document.createElement ('iframe');
iframe.src  = chrome.runtime.getURL('side_panel.html');
iframe.setAttribute('id', 'myframe');
iframe.style.position = 'fixed';
iframe.style.top='0%'
iframe.style.left='0%'
iframe.style.height = "100%"
iframe.style.width = "400px";
document.body.zIndex = -1;
iframe.style.zIndex = 0x7FFFFFFF;
//iframe.style.backgroundColor = "#A0A0A0";
document.body.append(iframe);
