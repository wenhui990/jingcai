var downloadPath="/wx/";
var noRecord='查询完毕，没有相关记录';
var	running1="<img src='";
var	running2="/imgs/loading.gif'>";
var transType = {"0":"签到","1":"活动赠送","2":"问卷赠送","3":"活动消费","4":"积分兑换","5":"积分抽奖","6":"调账","7":"冻结","8":"解冻","9":"积分返还"};
var betChangeTime=new Date(2015,3,20).getTime();
var maxIssueDay=[1,1];
var currentRequests = {};

$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
	if (!currentRequests[options.url]) {
    	currentRequests[ options.url ] = jqXHR;
    } else {
    	jqXHR.abort();
    }
	var complete = options.complete;
	options.complete = function(jqXHR, textStatus) {
		currentRequests[options.url] = null;
		if ($.isFunction(complete)) {
			complete.apply(this, arguments);
		}
	};
});

function getPath(){
	return "/ilsp-wechat";
}

function refreshCc(){
	var b=document.getElementById("checkCodeImg"),c="";
	b&&(c="/ilsp-wechat/manage/captcha.do?"+Math.random().toString(),b.src=c);
}

function parseParam(msg){
	var request = new Object();
	var args = msg.split("&");
	for(var i=0;i<args.length;i++){
		var _args = args[i].split("=");
		if(_args.length == 2 && _args[0] != ""){
			request[_args[0]] = decodeURI(_args[1]);
		}
	}
	return request;
}

function getCookie(cookieName){
	var allCookies = document.cookie;
	var cpos = allCookies.indexOf(cookieName);
	if (cpos != -1){
		cpos += cookieName.length + 1;
		var cend = allCookies.indexOf(";", cpos);
		if (cend == -1){
			cend = allCookies.length;
		}
		var cookieValue = allCookies.substring(cpos, cend);
		return cookieValue;
   }
   return null;
}

function setCookie(name,value){
    document.cookie = name + "="+ encodeURI (value) + ";path=/";
}

function delCookie(name){
	var cookieValue = this.getCookie(name);
	if(cookieValue != null){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1000);
	    document.cookie = name + "=" + cookieValue + ";path=/;expires=" + exp.toGMTString();
	}
}

function formatDate(longDate){
  if(!longDate){
	return "";
  }
  var d=new Date(parseInt(longDate));
  var m=parseInt(d.getMonth(),10)+1;
  var da=parseInt(d.getDate(),10);
  var hour = parseInt(d.getHours(),10);
  var min = parseInt(d.getMinutes(),10);
  var sec = parseInt(d.getSeconds(),10);
  if(m<10){m="0"+m;}
  if(da<10){da="0"+da;}
  if(hour < 10){hour = "0" + hour;}
  if(min < 10){min = "0" + min;}
  if(sec < 10){sec = "0" + sec;}
  return d.getFullYear()+"-"+m+"-"+da +" " + hour + ":" + min + ":" + sec;
}

function formatDateNoTime(longDate){
	  if(!longDate){
		return "";
	  }
	  var d=new Date(parseInt(longDate));
	  var m=parseInt(d.getMonth(),10)+1;
	  var da=parseInt(d.getDate(),10);
	  if(m<10){m="0"+m;}
	  if(da<10){da="0"+da;}
	  return d.getFullYear()+"-"+m+"-"+da;
}

function formatDateMD(longDate){
	  if(!longDate){
		return "";
	  }
	  var d=new Date(parseInt(longDate));
	  var m=parseInt(d.getMonth(),10)+1;
	  var da=parseInt(d.getDate(),10);
	  if(m<10){m="0"+m;}
	  if(da<10){da="0"+da;}
	  return m+"-"+da;
}

function formatDateYMDHM(longDate){
	  if(!longDate){
		return "";
	  }
	  var d=new Date(parseInt(longDate));
	  var m=parseInt(d.getMonth(),10)+1;
	  var da=parseInt(d.getDate(),10);
	  var hour = parseInt(d.getHours(),10);
	  var min = parseInt(d.getMinutes(),10);
	  var sec = parseInt(d.getSeconds(),10);
	  if(m<10){m="0"+m;}
	  if(da<10){da="0"+da;}
	  if(hour < 10){hour = "0" + hour;}
	  if(min < 10){min = "0" + min;}
	  if(sec < 10){sec = "0" + sec;}
	  return d.getFullYear()+"-"+m+"-"+da +" " + hour + ":" + min;
}

function drawPages(totalRecords, jsMethod, stIdx) {
	var size = 8;
	if(arguments.length>3){
		size=arguments[3];
	}
	if(jsMethod=="awardList"){
		size = 20;
	}
	var i, sp, ep, st, et, ljsm, njsm, pages, nowPg, pHtml = "";
	var p = $(".main_page");
	if(arguments.length>3 && arguments[3] == "detail"){
		p = $("#transres").parent().next(".main_page");
		size = 8;
	}
	if(arguments.length>3 && arguments[3] == "prize"){
		var id = $("#integralLotteryId").val();
		p = $("#pri_"+id);
		size = 8;
	}
	if (p == null) {
		return;
	}
	if (totalRecords < 1) {
		p.html('');
		return;
	}
	pages = Math.ceil(totalRecords / size);
	nowPg = stIdx / size + 1;
	if (nowPg < 2) {
		ljsm = "<a href='javascript:void(0)'>";
	} else {
		ljsm = "<a href='javascript:" + jsMethod + "(" + (nowPg - 2) * size
				+ ")'>";
	}
	if (nowPg >= pages) {
		njsm = "<a href='javascript:void(0)'>";
	} else {
		njsm = "<a href='javascript:" + jsMethod + "(" + nowPg * size
				+ ")'>";
	}

	pHtml += "共 " + totalRecords + " 条 " + ljsm + "上一页</a> ";
	pHtml += "<a id='pg1' href='javascript:" + jsMethod
			+ "(0)'>1</a> ";
	if (pages <= 6) {
		for (i = 2; i <= pages; i++) {
			pHtml += "<a id='pg" + i + "' href='javascript:" + jsMethod
					+ "(" + (i - 1) * size + ")'>" + i + "</a> ";
		}
	} else {
		if (nowPg < pages - 3) {
			st = 0;
		} else {
			st = nowPg + 2 - pages;
		}
		if (nowPg > 4) {
			pHtml += " ... ";
			et = 0;
		} else {
			et = 4 - nowPg;
		}
		sp = nowPg - 3 - st;
		ep = nowPg + 2 + et;
		if (sp < 2)
			sp = 2;
		if (ep > pages - 1)
			ep = pages - 1;
		for (i = sp; i <= ep; i++) {
			pHtml += "<a id='pg" + i + "' href='javascript:" + jsMethod
					+ "(" + (i - 1) * size + ")'>" + i + "</a> ";
		}
		if (nowPg < pages - 3) {
			pHtml += " ... ";
		}
		pHtml += "<a id='pg" + pages + "' href='javascript:" + jsMethod
				+ "(" + (pages - 1) * size + ")'>" + pages
				+ "</a> ";
	}
	pHtml += njsm + "下一页</a>";
	pHtml += " <select id='Tiaozhuan' onchange='" + jsMethod
			+ "(this.value)'>";
	for (i = 1; i <= pages; i++) {
		if (i == nowPg) {
			pHtml += "<option value='" + (i - 1) * size + "' selected >第"
					+ i + "页</option>";
		} else {
			pHtml += "<option value='" + (i - 1) * size + "'>第" + i
					+ "页</option>";
		}
	}
	p.html(pHtml + "</select>");

	var nowPgLink = document.getElementById("pg" + nowPg);
	if (nowPgLink != null) {
		nowPgLink.href = "javascript:void(0)";
		nowPgLink.style.fontSize = "14px";
		nowPgLink.style.fontWeight = "bold";
	}
}

function showRunning(colnum,id) {
	var tr, td, tbody = document.getElementById("res");
	if(arguments.length>1){
		tbody = document.getElementById("res_"+id);
	}
	while (tbody.rows.length > 0) {
		tbody.removeChild(tbody.firstChild);
	}
	if(arguments.length>1){
		$("#pri_"+id).html('');
	}else{
		$(".main_page").html('');
	}
	tr = tbody.insertRow(tbody.rows.length);
	td = tr.insertCell(tr.cells.length);
	td.colSpan = colnum;
	td.innerHTML = this.running1 + getPath() + this.running2;
	tr.style.height = "200px";
}

function changeRankIssue(){
	var issue = $("#issue").val();
	var dayOption=document.getElementById("day").options;
	dayOption.length=0;
	var k=7;
	if(maxIssueDay[0]==issue){
		k=maxIssueDay[1];
	}
	for(var i=1;i<=k;i++){
		dayOption[dayOption.length]=new Option(i,i);
	}
	dayOption[dayOption.length-1].selected=true;
}

function initRankDay(){
	 var issueOption=document.getElementById("issue").options;
	 var dayOption=document.getElementById("day").options;
	 $.ajax({
			type : "post",
			url : 'http://sp.grsx.cc'+getPath()+'/web/rankIssueDay.do',
			dataType : "json",
			success : function(data) {
				if(data){
					maxIssueDay[0]=data.issue;
					maxIssueDay[1]=data.day;
					issueOption.length=0;
					dayOption.length=0;
					for(var i=1;i<=maxIssueDay[0];i++){
						issueOption[issueOption.length]=new Option(i,i);
					}
					for(var i=1;i<=maxIssueDay[1];i++){
						dayOption[dayOption.length]=new Option(i,i);
					}
					if(issueOption.length>0){
						issueOption[issueOption.length-1].selected=true;
						dayOption[dayOption.length-1].selected=true;
					}
				}
			}
	 });
}

function tipsWindown(title,content,width_arg,height_arg,drag,time,showbg,cssName,isClose,backcall) {
	var width = width_arg >= 950 ? this.width = 950 : this.width=width_arg,			//设置最大窗口宽度
	height = height_arg >= 600 ? this.height = 600 : this.height=height_arg,  		//设置最大窗口高度
	doc_width = $(document).width(), doc_height = $(document).height(),			    //获得文档的宽度和高度
	simpleWindown_html = '',														//弹框的html文本
	contentType;																	//自定义文本的类型(id or text)
	//清除内容
	$("#windownbg").remove();
	$("#windown-box").remove();
	
	//构造弹框html文本
	simpleWindown_html = "<div id=\"windownbg\" style=\"width:" + doc_width + "px;height:" + doc_height + "px;";
	simpleWindown_html += "filter:alpha(opacity=0);background-color: rgb(66, 66, 66);position: absolute;";
	simpleWindown_html += "left: 0px; top: 0px; opacity:0;z-index:100001\"></div>";
	
	simpleWindown_html += "<div id=\"windown-box\"><div id=\"windown-title\">";
	simpleWindown_html += "<font style=\"color:#FFF;font-weight:bold;font-size:14px;vertical-align:middle;\"></font>";
	//是否有关闭按钮,默认
	if(isClose){
		simpleWindown_html += "<div id=\"windown-close\">关闭</div>";
	}
	simpleWindown_html += "</div><div id=\"windown-content-border\"><div id=\"windown-content\"></div></div></div>";
	//body追加弹框html文本
	$("body").append(simpleWindown_html);
	
	contentType = content.substring(0,content.indexOf(":"));						//从参数中截取文本类型 
	content = content.substring(content.indexOf(":") + 1, content.length);			//从参数中截取文本
	switch(contentType) {
		case "text":
		$("#windown-content").html(content);
		break;
		case "id":
		$("#windown-content").html($("#"+content+"").html());
		break;
	}
	$("#windown-title font").html('&nbsp;'+title);
	if(showbg == "true") {$("#windownbg").show();}else {$("#windownbg").remove();};
	$("#windownbg").animate({opacity:"0.5"},"normal");//设置透明度
	$("#windown-box").show();
	if( height >= 600 ) {
		$("#windown-title").css({width:(parseInt(width)+22)+"px"});
		$("#windown-content").css({width:(parseInt(width)+17)+"px",height:height+"px"});
	}else {
		$("#windown-title").css({width:(parseInt(width)+10)+"px"});
		$("#windown-content").css({width:width+"px",height:height+"px"});
	}
	$("#windown-box").css({
		left:"50%",
//		top:getScrollTop()+height+"px",
//		marginTop:-((parseInt(height)+52)/2)+"px",
		marginLeft:-((parseInt(width)+32)/2)+"px",
		position:"absolute",
		zIndex: "100002"});
}
function getScrollTop(){
    var bodyTop = 0;  
    if (typeof window.pageYOffset != 'undefined') {  
            bodyTop = window.pageYOffset;  
    } else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {  
            bodyTop = document.documentElement.scrollTop;  
    } else if (typeof document.body != 'undefined') {  
            bodyTop = document.body.scrollTop;  
    }
    return bodyTop
}

//关闭窗口
function closeWindow() {
	$("#windownbg").remove();
	$("#windown-box").fadeOut("slow",function(){$(this).remove();});
}

function showTipsWindown(title,id,width,height){
	tipsWindown(title,"id:"+id,width,height,"true","","true",id);
}

function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
