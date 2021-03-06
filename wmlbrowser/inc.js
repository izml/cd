if(document.doctype==null)
chrome.extension.sendMessage({checkWML:true},function(message){
//chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.notWML) return;
	document.body.style.backgroundColor=document.body.style.color='AppWorkspace'
	if(document.readyState=='loading'){
		document.addEventListener('DOMContentLoaded',isWML,false);
	} else isWML();
});
function isWML(){
	var wml=document.body.firstChild.innerText;
/*
	wml='<?xml-stylesheet type="text/xsl" href="'+chrome.extension.getURL('wml.xsl')+'"?>'+wml
	document.write(wml);
	document.head.innerHTML='<link rel="stylesheet" type="text/css" href="'+chrome.runtime.getURL('wml.css')+'" /><script type="text/javascript" src="'+chrome.runtime.getURL('wml.js')+'"></script>'
	return;
*/
	wml=wml.match(/<!DOCTYPE[\s\S]+<\/wml>/m)[0];
	//如果<?xml ...>不在第一行时解析会出错,而且有的wml中也没有,干脆去掉.
	wml=(new DOMParser()).parseFromString(wml,'text/xml');
//	var pe=wml.getElementsByTagName("parsererror");
//	for(var i=0; i<pe.length; i++){document.body.innerHTML+=pe[i].innerHTML;}
	var xhr=new XMLHttpRequest();
	xhr.onload=function(e){
		var processor = new XSLTProcessor();
		processor.importStylesheet(xhr.responseXML);
		wml=processor.transformToDocument(wml);
		wml.getElementById('_wml_head_js').src=chrome.runtime.getURL('wml.js');
		wml.getElementById('_wml_head_css').href=chrome.runtime.getURL('wml.css');
		var sel=wml.getElementsByTagName('select');
		for(var i=sel.length-1;i>=0;i--){	// Chrome 中 option 元素不接受 onclick 事件
			if(sel[i].options[0].className=='_wml_onPick'){
				sel[i].innerHTML='<option selected="selected">'
					+chrome.i18n.getMessage("wml_select")+'</option>'+sel[i].innerHTML;
				sel[i].setAttribute('onchange','location.href=this.value;');
			//	sel[i].setAttribute('onkeydown','nsWMLKeyDown4Select(event)');
			}
		}
		document.write((new XMLSerializer()).serializeToString(wml).match(/<!DOCTYPE[\s\S]+<\/head>/m)[0]);
	//	document.write(''+'<body></body></html>');
		document.body=wml.body;
	};
	xhr.open('GET',chrome.extension.getURL('wml.xsl'),false);
	xhr.send();
}
