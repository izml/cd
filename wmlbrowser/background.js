var wmls={};
chrome.webRequest.onHeadersReceived.addListener(
	function(d){
		if(d.url.indexOf('http://www')==0) return;
		var rs=d.responseHeaders;
		for(var i=rs.length-1;i>=0;i--){
			if(rs[i].name.toLowerCase()=='content-type'){
				var type=rs[i].value.toLowerCase();
				if(type.indexOf('text/vnd.wap.wml')>=0){ //"text/vnd.wap.wml;charset=utf-8"
					wmls[d.tabId]=1;
				//	sessionStorage['wmls']=JSON.stringify(wmls);
					if(type.indexOf('charset=')<0){
						rs[i].value='text/vnd.wap.wml;charset=utf-8'
						return {responseHeaders: rs};
					}
				}
				break;
			}
		}
	},
	// filters
	{urls:["http://*/*"],types:["main_frame"]},
	// extraInfoSpec
	["blocking","responseHeaders"]
);
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if(message.checkWML){
	//	var tid=sender.tab.id;
		if(wmls[sender.tab.id]){
			sendResponse({notWML:false});
			delete wmls[sender.tab.id];
		//	sessionStorage['wmls']=JSON.stringify(wmls);
		} else sendResponse({notWML:true});
	}
});
/*
chrome.webRequest.onBeforeSendHeaders.addListener(
	function(d){
		var req=d.requestHeaders
		for (var i=req.length-1; i>=0; i--) {
			if(req[i].name=='User-Agent'){
				req[i].value='Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; Titan)';
				break;
			}
		}
		return {requestHeaders: req};
	},
	// filters
	{urls: ["http://m.tianya.cn/*","http://wap.tianya.cn/*","http://m.sohu.com/*","http://*.3g.qq.com/*","http://3g.qq.com/*"],types:["main_frame"]},
	// extraInfoSpec
	["blocking","requestHeaders"]
);
*/