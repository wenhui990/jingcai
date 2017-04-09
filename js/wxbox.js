/*-------------------------------------------------------------------------
//jQuery弹出窗口 [2009-11-22]
//--------------------------------------------------------------------------
/*参数：[可选参数在调用时可写可不写,其他为必写]
----------------------------------------------------------------------------
  title:	窗口标题
content:  内容(可选内容为){ text | id | img | url | iframe }
  width:	内容宽度
 height:	内容高度
	 drag:  是否可以拖动(ture为是,false为否)
   time:	自动关闭等待的时间，为空是则不自动关闭
 showbg:	[可选参数]设置是否显示遮罩层(0为不显示,1为显示)
cssName:  [可选参数]附加class名称
------------------------------------------------------------------------*/
//示例:
//------------------------------------------------------------------------
//simpleWindown("例子","text:例子","500","400","true","3000","0","exa")
//------------------------------------------------------------------------
function tipsWindown(title,content,width_arg,height_arg,drag,time,showbg,cssName,isClose,backcall) {
	var width = width_arg >= 950 ? this.width = 950 : this.width=width_arg,			//设置最大窗口宽度
	height = height_arg >= 527 ? this.height = 527 : this.height=height_arg,  		//设置最大窗口高度
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
	simpleWindown_html += "<font style=\"color:#000;font-size:14px;vertical-align:middle;\"></font>";
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
	if( height >= 527 ) {
		$("#windown-title").css({width:(parseInt(width)+22)+"px"});
		$("#windown-content").css({width:(parseInt(width)+17)+"px",height:height+"px"});
	}else {
		$("#windown-title").css({width:(parseInt(width)+10)+"px"});
		$("#windown-content").css({width:width+"px",height:height+"px"});
	}
/*	$("#windown-box").css({
		left:"55%",
		top: getScrollTop()+height+"px",
		marginTop:-((parseInt(height)+40)/2)+"px",
		marginLeft:-((parseInt(width)+30)/2)+"px",
		position:"absolute",
		zIndex: "100002"});*/
	
	$("#windown-box").css({
		left:"50%",
		top: getScrollTop()+height+"px",
		marginTop:-((parseInt(height)+53)/2)+"px",
		marginLeft:-((parseInt(width)+0)/2)+"px",
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

//弹窗通用方法
function showTipsWindown(title,id,width,height){
	tipsWindown(title,"id:"+id,width,height,"true","","true",id);
}

function get(id){
	return document.getElementById(id);
};
