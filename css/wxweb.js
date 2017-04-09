//微信JS-SDK初始化
function initWx(url,shareLink,shareTitle,hideMenu){
	$.ajax({
		url : getPath()+'/manage/signature.do?url='+encodeURIComponent(url),
		dataType : "json",
		success : function(data) {
				if(data){
					wx.config({
						debug: false,
						appId: data.appId,
						timestamp: data.timestamp,
						nonceStr: data.nonceStr,
						signature: data.signature,
						jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','getLocation','hideOptionMenu','hideAllNonBaseMenuItem']
					});
					var param={
							title: shareTitle,
							link: 'http://'+window.location.host+getPath()+shareLink,
							imgUrl: 'http://'+window.location.host+getPath()+"/images/hd_share.jpg",
							success: function () {
								submitShare();
							}
					};
					wx.ready(function(){
						wx.onMenuShareTimeline(param);
						wx.onMenuShareAppMessage(param);
						wx.onMenuShareQQ(param);
						wx.onMenuShareWeibo(param);
						if(hideMenu){
							wx.hideAllNonBaseMenuItem();
						}
					});
				}
			}
	});
}

function submitShare(){
	$.ajax({
		url : getPath()+'/manage/sharemsg.do',
		dataType : "json",
		success : function(data) {}
	});
}

function loadGaScript(){
	try{
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	  ga('create', 'UA-60848080-1', 'auto');
	  ga('send', 'pageview');
	}catch(e){}
}

function initPwdReset(){
	var request, srchString = location.search.substring(1,
			location.search.length);
	if (srchString.length > 0) {
		request = parseParam(srchString);
		var id=request["u"];
		if(id){
			$("#mb").html(request["m"]);
			$("#sbm").click(function(){pwdReset(id);});
		}
	}
}

function changeInput(id){
	var ele=document.getElementById(id);
	ele.value="";
	ele.style.color='black';
}

function pwdReset(id){
	var mobile = $("#mobile").val();
	var password = $("#password").val();
	var rePassword = $("#rePassword").val();
	if(mobile=="请输入手机号"){
		$('#mobileErrMsg').html("请输入手机号");
		return ;
	}
	if(password=="请输入新密码"){
		$('#mobileErrMsg').html("请输入新密码");
		return ;
	}
	if(rePassword=="请确认新密码"){
		$('#mobileErrMsg').html("请确认新密码");
		return ;
	}
	if(password!=rePassword){
		$('#mobileErrMsg').html("两次输入的密码不一致，请重新输入！");
		return ;
	}
	$.ajax({
		type : "post",
		url : getPath()+'/web/pwdreset.do',
		data: "mobile="+mobile+"&pwd="+password+"&u="+id,
		dataType : "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			if(data){
				$("#mobileErrMsg").html(data.r);
				$("#mobileErrMsg").css("font-size","18px");
			}
		}
	});
}

//积分查询
function integralSearch(){
	var oid=getCookie("token");
	if(!oid){
		window.location = getPath() + "/htmlwx/denglu.html";
		return;
	}
	$.ajax({
		type : "post",
		url : getPath()+'/web/searchintegral.do',
		dataType : "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var dt=data["res"];
			if(dt&&dt!="0"){
				$("#allIntegral").html((dt.transAmount + dt.transAmount2).toFixed(2));
				$("#ranking").html(dt.ranking);
				$("#transAmount").html(dt.transAmount.toFixed(2));
				$("#transAmount2").html(Math.abs(dt.transAmount2).toFixed(2));
				if(dt.sign=="0"){
					$("#sign").html("您今日尚未签到，别忘了签到获取积分哦！");
				}else if(dt.sign=="1"&&dt.signAmount != null){
					$("#sign").html("您今日已经签到，获得"+dt.signAmount+"积分，请继续努力哦！");
				}
				if(dt.address){
					var adds=dt.n_province+dt.n_city;
					if(dt.n_contry){adds+=dt.n_contry;}
					adds+=dt.address+"["+dt.postCode+"]";
					$("#address").hide();
					$("#address2").show();
					$("#hint").hide();
					$("#address3").html(adds);
					$("#realName").html(dt.realName);
					$("#mz").val(dt.realName);
					$("#xxdz").val(dt.address);
					$("#yb").val(dt.postCode);
					$("#sf").val(dt.u_province);
					$("#cc").val(dt.u_city);
					$("#qx").val(dt.u_contry);		
				}else{
					$("#address").show();
					$("#address2").hide();
					$("#hint").show();
				}
				if(dt.phone){
					$("#mobile").html(dt.phone);
					$("#sjh").val(dt.phone);
				}else{
					$("#phoneTxt").hide();
				}
			}else{
				alert("查询失败");
			}
		},
		error : function(xhr, status) {
			
		}
	});
};

//积分查询
function userInfo(){
	var oid=getCookie("token");
	if(!oid){
		window.location.href = getPath() + "/htmlwx/denglu.html?type=ggklj";
		return;
	}
	$.ajax({
		type : "post",
		url : getPath()+'/web/user/get.do',
		dataType : "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			if(data.s == 404){
				window.location.href = getPath() + "/htmlwx/denglu.html?type=ggklj";
				return;
			}
			var dt=data["u"];
			if(dt){
				if(dt.needid == 1){
					$("#idCardImage").show()
				}
				if(dt.idcard1){
					$("#idCard1").html("<img width='50px' src="+dt.idcard1+">");
				}
				if(dt.idcard2){
					$("#idCard2").html("<img width='50px' src="+dt.idcard2+">");
				}
				if(dt.address){
					var adds=dt.userProvince+dt.userCity;
					if(dt.userCounty){adds+=dt.userCounty;}
					adds+=dt.address+"["+dt.postCode+"]";
					$("#address").hide();
					$("#address2").show();
					$("#hint").hide();
					$("#address3").html(adds);
					$("#realName").html(dt.realName);
					$("#idnum").html(dt.idnum);
					$("#mz").val(dt.realName);
					$("#xxdz").val(dt.address);
					$("#yb").val(dt.postCode);
					$("#sf").val(dt.u_province);
					$("#cc").val(dt.u_city);
					$("#qx").val(dt.u_contry);		
				}else{
					$("#address").show();
					$("#address2").hide();
					$("#hint").show();
				}
				if(dt.phone){
					$("#mobile").html(dt.phone);
					$("#sjh").val(dt.phone);
				}else{
					$("#phoneTxt").hide();
				}
			}else{
				alert("查询失败");
			}
		},
		error : function(xhr, status) {
			
		}
	});
};
//奖品详情期的查询
function awardIsssue(startIdx){
	$.ajax({
		type : "post",
		url : getPath()+'/web/awardIsssue.do',
		data : 'startIdx=' + startIdx,
		dataType : "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var data = data["r"];
			if(data){
				for(var i = 0; i < data.length; i++){
					$("#awardlist").append("<option value='" +data[i].ext02+ "'>" +data[i].ext02+ "</option>");
				}
			}
			awardList(startIdx);
		}
	});
	
}
//奖品详情
function awardList(startIdx){
	var awardlist = $("#awardlist").find("option:selected").val();
	$.ajax({
		type : "post",
		url : getPath()+'/web/awardList.do',
		data : 'startIdx=' + startIdx+'&awardlist='+awardlist,
		dataType : "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			awardListcallback(data);
		}
	});
}
function awardListcallback(dt){
	 if(dt){
		 $("#inteRanking").html(dt["i"]?dt["i"]:'--');
		 var tr, td, i;
			var tbody = document.getElementById("res");
			while (tbody.rows.length > 0) {
				tbody.removeChild(tbody.firstChild);
			}
			if (dt == null || !(dt["r"] instanceof Array) || dt["r"].length < 1) {
				drawPages(0, "awardList", 0);
				tr = tbody.insertRow(tbody.rows.length);
				td = tr.insertCell(tr.cells.length);
				td.colSpan = 2;
				td.innerHTML = noRecord;
				tr.style.height = "200px";
			} else {
				drawPages(dt["c"], "awardList", dt["s"]);
				var data = dt["r"];
				for (i = 0; i < data.length; i++) {
					if (data[i] != null) {
						var awards = data[i][1];
						for (var j = 0; j < awards.length; j++) {
							tr = tbody.insertRow(tbody.rows.length);
							if(j==0){
								td = tr.insertCell(tr.cells.length);
								td.innerHTML = awards[j].award;
								td.rowSpan = awards.length;
							}
							td = tr.insertCell(tr.cells.length);
							td.innerHTML = awards[j].mobile.substr(0,3)+"****"+awards[j].mobile.substr(7);
							if(j==awards.length-1){
								tr = tbody.insertRow(tbody.rows.length);
								td = tr.insertCell(tr.cells.length);
								td.className = "weyl";
								td.colSpan = 2;	
							}
							
						}
					}
				}
	 }
	 }
}
//公告详情
function infoDetail(num){
	$.ajax({
		type : "post",
		url : getPath()+'/web/infoDetail.do',
		dataType : "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			infoDetailcallback(data,num);
		}
	});
}
//公告详情页面
function infoDetailcallback(dt,num){
	var data = dt["t"];
	for(var i=0;i<data.length;i++){
			$("#title").html(data[num].title);
			$("#txt").html(data[num].txt);
	}
}
//期号查询时需要辨别是切换的哪个游戏的期号
function changeIssue(){
	var div = $("#saisId div");
	for(var i=0;i<div.length;i++){
		if(div[i].className=="on"){
			if(i==0){
				searchWxtradMatch(0,4,1014,0);	
			}else if(i==1){
				searchWxtradMatch(0,4,1004,1);
			}else{
				searchWxtradMatch(0,4,1006,2);
			}
		}
	}
}
//获取当前页的期号信息
function searchIssue(startIdx,type,gameNum,num){
	$.ajax({
		type : "post",
		url : getPath()+'/web/searchMatchaIssue.do',
		data : 'gameNum=' + gameNum + '&startIdx=' + startIdx+ '&type=' + type,
		dataType : "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			  document.getElementById("issue").options.length=0;
				var data = data["t"];
				if(data){
					for(var i = 0; i < data.length; i++){
						$("#issue").append("<option value='" +data[i].issue+ "'>" +data[i].issue+ "</option>");
					}
				}
			searchWxtradMatch(startIdx,type,gameNum,num);
		}
	});
};
//传统足球赛事查询
function searchWxtradMatch(startIdx,type,gameNum,num){
	var issue = $("#issue").find("option:selected").val();
	$.ajax({
		type : "post",
		url : getPath()+'/web/searchWxtradMatch.do',
		data : 'matchType=' + type + '&gameNum=' + gameNum+ '&issue=' + issue,
		dataType : "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
				searchWxtradtionMatchCallback(data,num);//传统足球
		}
	});
}
//传统足球
function searchWxtradtionMatchCallback(dt,num){
	 if(dt){
		 //公告信息
		 var infodata = dt["i"];
		 var infoDiv ="<ul>";
		 for (var i = 0; i < 3; i++) {
			 infoDiv +="<li>";
			 if(infodata.length>i){
				 infoDiv +="<a href='infoDetail"+i+".html'>"+infodata[i].title+"</a>";
			 }
			 infoDiv +="&nbsp;</li>";
		 }
		 infoDiv +="</ul>";
		 $("#info").html(infoDiv);
		 if(num==0){//14场，任选9
			 var timadata = dt["u"][0];
			 if(timadata){
				 //开售时间
				 $("#startTime").html(formatDateYMDHM(timadata.startTime));
				 //停售时间
				 $("#stopTime").html(formatDateYMDHM(timadata.stopTime));
			 }
			 var tr, td, i;
				var tbody = document.getElementById("res0");
				while (tbody.rows.length > 0) {
					tbody.removeChild(tbody.firstChild);
				}
					var data = dt["r"];
					var m=1;
					if (data) {
					for (i = 0; i < data.length; i++) {
						//var match = data[i][1];
						//for(var j = 0; j < match.length; j++){
								tr = tbody.insertRow(tbody.rows.length);
								tr.className = "tit";
								//if(j==0){
									td = tr.insertCell(tr.cells.length);
									td.innerHTML = data[i].leagueName;
									//td.rowSpan = match.length;
								//}
								td = tr.insertCell(tr.cells.length);
								td.innerHTML = m;
								m++;
								td = tr.insertCell(tr.cells.length);
								td.innerHTML = formatDateMD(data[i].matchTime);
								td = tr.insertCell(tr.cells.length);
								td.innerHTML = data[i].homeTeamName;
								td = tr.insertCell(tr.cells.length);
								td.innerHTML = data[i].guestTeamName;
								td = tr.insertCell(tr.cells.length);
								if(data[i].result){
									td.innerHTML = data[i].result;
									td.className ="c_yellow";
								}
								td = tr.insertCell(tr.cells.length);
								if(data[i].ext01){
									td.innerHTML = data[i].ext01;
									td.className ="c_yellow";
								}
							//}
						}
						
					}
							//奖金明细
							var tr, td, i;
							var tbody = document.getElementById("res00");
								while (tbody.rows.length > 0) {
									tbody.removeChild(tbody.firstChild);
								}		
								var awarddata = dt["a"];
								for (i = 0; i < awarddata.length; i++) {
									if(awarddata[i]){
										tr = tbody.insertRow(tbody.rows.length);
										tr.className ="td_bottom";
										td = tr.insertCell(tr.cells.length);
										td.innerHTML = awarddata[i].prizelevel;
										td.style.width="30%";
										td = tr.insertCell(tr.cells.length);
										td.innerHTML = awarddata[i].prizecount+"注";
										td = tr.insertCell(tr.cells.length);
										td.innerHTML = awarddata[i].prizeamount+"元";
										td.className ="c_yellow";
									}
							}
		 }else if(num==1){//4场进球
			 var timadata = dt["u"][0];
			 if(timadata){
				//开售时间
				 $("#startTime1").html(formatDateYMDHM(timadata.startTime));
				 //停售时间
				 $("#stopTime1").html(formatDateYMDHM(timadata.stopTime)); 
			 }
			 var tr, td, i;
				var tbody = document.getElementById("res1");
				while (tbody.rows.length > 0) {
					tbody.removeChild(tbody.firstChild);
				}
					var data = dt["r"];
					var m=1;
					if (data) {
					for (i = 0; i < data.length; i++) {
						//var match = data[i][1];
						//for(var j = 0; j < match.length; j++){
								tr = tbody.insertRow(tbody.rows.length);
								tr.className = "td_bottom";
								//if(j==0){
									td = tr.insertCell(tr.cells.length);
									td.innerHTML = data[i].leagueName;//赛事名称
									//td.rowSpan = match.length*2;
									td.rowSpan = 2;
									td.className = "td_right";
								//}
								td = tr.insertCell(tr.cells.length);
								td.innerHTML = m;//场次
								m++;
								td.rowSpan = 2;
								td = tr.insertCell(tr.cells.length);
								td.innerHTML = formatDateMD(data[i].matchTime);//比赛日期
								td.rowSpan = 2;
								td = tr.insertCell(tr.cells.length);
								td.innerHTML = data[i].homeTeamName;//主队

								td = tr.insertCell(tr.cells.length);
								if(data[i].result){
									td.innerHTML = data[i].result.split(',')[0];//结果
									td.className ="c_yellow";
								}
								td = tr.insertCell(tr.cells.length);
								if(data[i].ext01){
									td.innerHTML = data[i].ext01.split(',')[0];
									td.className ="c_yellow";
								}
								
								//第二行
								tr = tbody.insertRow(tbody.rows.length);
								tr.className = "td_bottom";
								td = tr.insertCell(tr.cells.length);
								td.innerHTML = data[i].guestTeamName;//客队

								td = tr.insertCell(tr.cells.length);
								if(data[i].result){
									td.innerHTML = data[i].result.split(',')[1];//结果
									td.className ="c_yellow";
								}
								td = tr.insertCell(tr.cells.length);
								if(data[i].ext01){
									td.innerHTML =data[i].ext01.split(',')[1];
									td.className ="c_yellow";
								}
							//}
						}
					}
							//奖金明细
							var tr, td, i;
							var tbody = document.getElementById("res11");
								while (tbody.rows.length > 0) {
									tbody.removeChild(tbody.firstChild);
								}		
								var awarddata = dt["a"];
								for (i = 0; i < awarddata.length; i++) {
									if(awarddata[i]){
										tr = tbody.insertRow(tbody.rows.length);
										tr.className ="td_bottom";
										td = tr.insertCell(tr.cells.length);
										td.innerHTML = awarddata[i].prizelevel;
										td.style.width="30%";
										td = tr.insertCell(tr.cells.length);
										td.innerHTML = awarddata[i].prizecount+"注";
										td = tr.insertCell(tr.cells.length);
										td.innerHTML = awarddata[i].prizeamount+"元";
										td.className ="c_yellow";
									}
							}
		 }else{//6场半全场
			 var timadata = dt["u"][0];
			 if(timadata){
				 //开售时间
				 $("#startTime2").html(formatDateYMDHM(timadata.startTime));
				 //停售时间
				 $("#stopTime2").html(formatDateYMDHM(timadata.stopTime)); 
			 }
			 var tr, td, i;
				var tbody = document.getElementById("res2");
				while (tbody.rows.length > 0) {
					tbody.removeChild(tbody.firstChild);
				}
					var data = dt["r"];
					var m=1;
					if (data){ 
					for (i = 0; i < data.length; i++) {
						//var match = data[i][1];
						//for(var j = 0; j < match.length; j++){
								tr = tbody.insertRow(tbody.rows.length);
								tr.className = "td_bottom";
								//if(j==0){
									td = tr.insertCell(tr.cells.length);
									td.innerHTML = data[i].leagueName;//赛事名称
									//td.rowSpan = match.length*2;
									td.rowSpan = 2;
									td.className = "td_right";
								//}
								td = tr.insertCell(tr.cells.length);
								td.rowSpan = 2;
								td.innerHTML = m;//场次
								m++;
								td = tr.insertCell(tr.cells.length);
								td.rowSpan = 2;
								td.innerHTML = formatDateMD( data[i].matchTime);//比赛日期
								td = tr.insertCell(tr.cells.length);
								td.rowSpan = 2;
								td.innerHTML =  data[i].homeTeamName;//主队
								
								td = tr.insertCell(tr.cells.length);
								td.rowSpan = 2;
								td.innerHTML =  data[i].guestTeamName;//客队
								
								td = tr.insertCell(tr.cells.length);
								td.rowSpan = 2;
								//td.style.cssText = "border-bottom:none";
								if( data[i].result){
									td.innerHTML = data[i].result.split(',')[1];//结果
									//改成了只要全场的比分，不要半场的了
									td.className ="c_yellow";
								}
								
								td = tr.insertCell(tr.cells.length);
								td.style.cssText = "border-bottom:none";
								if( data[i].ext01){
									td.innerHTML =  data[i].ext01.split(',')[0];
									td.className ="c_yellow";
								}

								//第二行
								tr = tbody.insertRow(tbody.rows.length);
								tr.className = "td_bottom";
								/*td = tr.insertCell(tr.cells.length);
								if(data[i].result){
									td.innerHTML = data[i].result.split(',')[1];//结果
									td.className ="c_yellow";
								}*/
								td = tr.insertCell(tr.cells.length);
								if( data[i].ext01){
									td.innerHTML = data[i].ext01.split(',')[1];
									td.className ="c_yellow";
								}
							//}
						}
					}
							//奖金明细
							var tr, td, i;
							var tbody = document.getElementById("res22");
								while (tbody.rows.length > 0) {
									tbody.removeChild(tbody.firstChild);
								}		
								var awarddata = dt["a"];
								for (i = 0; i < awarddata.length; i++) {
									if(awarddata[i]){
										tr = tbody.insertRow(tbody.rows.length);
										tr.className ="td_bottom";
										td = tr.insertCell(tr.cells.length);
										td.innerHTML = awarddata[i].prizelevel;
										td.style.width="30%";
										td = tr.insertCell(tr.cells.length);
										td.innerHTML = awarddata[i].prizecount+"注";
										td = tr.insertCell(tr.cells.length);
										td.innerHTML = awarddata[i].prizeamount+"元";
										td.className ="c_yellow";
									}
							} 
		 }

	 }
};

//订阅号热门赛事、重点赛事查询
function searchWxMatch(startIdx,type){
	$("input#initTeams").val('');
	$("input#initSingle").val(0);
	//“全部选择”按钮恢复选中状态
	$("div#sx_pop").find("a[name=chooseAll]").removeClass().addClass("ss_big_on");
	//单固按钮恢复未选中状态
	$("div.ss_sm_but").next().find("a").removeClass().addClass("ss_big_but");
	$.ajax({
		type : "post",
		url : getPath()+'/web/searchWxMatch.do',
		data : 'matchType=' + type + '&startIdx=' + startIdx,
		dataType : "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			 if(type != "1"){
				searchWxMatchCallback(data,type);//篮球足球热门赛事
				$("#hotMatch_"+type).addClass("on").siblings().removeClass("on");
			} else {
				searchWxDailyMatchCallback(data,type);//每日重点赛事
			}
		}
	});
};
//篮球足球热门赛事回滚
function searchWxMatchCallback(dt,type){
	var data = dt["r"];
	if(data){
		//赛事显示
		var weekDiv ="";
		for ( var i = 0; i < data.length; i++) {
			if(i==0){
				weekDiv += '<div class="ss_tag" onclick="changeMatchDiv(\''+data[i][0].split(" ")[0]+'\')">'+data[i][0]+'</div><div class="ss_con" id="'+data[i][0].split(" ")[0]+'">';
			}else{
				weekDiv += '<div class="ss_tag" onclick="changeMatchDiv(\''+data[i][0].split(" ")[0]+'\')">'+data[i][0]+'</div><div class="ss_con" style="display:none" id="'+data[i][0].split(" ")[0]+'">';
			}
			var matchs = data[i][1];
			for(var j = 0; j < matchs.length; j++){
				if(matchs[j].homeTeamName){
					if(matchs[j].leagueColor){
						leagueColor = matchs[j].leagueColor;
					}
					weekDiv += '<div name="'+matchs[j].leagueName+'" class="team_name">';
					weekDiv += '<div name="showOdds">';
					weekDiv += '<div class="f_l align_c"><span>'+matchs[j].leagueName+'</span><br/>';
					weekDiv += data[i][0].split(" ")[1].replace("星期","周")+matchs[j].matchNum.substring(9)+'</div>';
					weekDiv += '<div class="f_l align_c" style="width: 70%;"><p>';
					if(type==2){
						weekDiv += matchs[j].homeTeamName+' VS '+matchs[j].guestTeamName ;
					}else if(type==3){
						weekDiv += matchs[j].guestTeamName+' VS '+matchs[j].homeTeamName ;
					}
					if(matchs[j].flag == 1){//1:是，2：否
						//weekDiv += '<img src="../images/icon_dan.png"/>';
						weekDiv += ' <font class="c_yellow">单</font>';
					}
					weekDiv += '</p><font class="white_gray">开赛时间：'+formatDate(matchs[j].stopTime).substring(0,16)+'</font></div>';
					
					weekDiv += '<div class="collect"></div><div name="oddsflg" class="collect_nl"></div></div>';
					//赔率
					var odds = '';
					var spfOdd0 = '--',spfOdd1 = '--',spfOdd3='--';
					var rqOdd0 = '--',rqOdd1 = '--',rqOdd3='--',letCount='';
					if(matchs[j].odds != null){
						odds = matchs[j].odds;
						for ( var m = 0; m < odds.length; m++) {
							odd = eval('(' + odds[m].odds + ')');
							if(odds[m].gameNum == "200401"){
								spfOdd0 = (odd.odd0/1000).toFixed(2);
								spfOdd1 = (odd.odd1/1000).toFixed(2);
								spfOdd3 = (odd.odd3/1000).toFixed(2);
							}
							if(odds[m].gameNum == "200402"){
								rqOdd0 = (odd.odd0/1000).toFixed(2);
								rqOdd1 = (odd.odd1/1000).toFixed(2);
								rqOdd3 = (odd.odd3/1000).toFixed(2);
								letCount = '（'+odds[m].letCount/10+'）';
								if(odds[m].letCount > 0){
									letCount = '（+'+odds[m].letCount/10+'）';
								}
							}
							if(odds[m].gameNum == "200411"){
								spfOdd0 = (odd.odd0/1000).toFixed(2);
								spfOdd3 = (odd.odd3/1000).toFixed(2);
							}
							if(odds[m].gameNum == "200412"){
								rqOdd0 = (odd.odd0/1000).toFixed(2);
								rqOdd3 = (odd.odd3/1000).toFixed(2);
								letCount = '（'+odds[m].letCount/10+'）';
								if(odds[m].letCount > 0){
									letCount = '（+'+odds[m].letCount/10+'）';
								}
							}
						}
					}
					if(type == 2){
						weekDiv += '<div class="abc"><table class="whil"><tr><td width="24%">&nbsp;</td><td width="27%">胜</td><td width="26%">平</td><td width="23%">负</td></tr><tr><td>胜平负</td>';
						weekDiv += '<td class="c_yellow">'+spfOdd3+'</td><td class="c_yellow">'+spfOdd1+'</td><td class="c_yellow">'+spfOdd0+'</td></tr><tr>';
						weekDiv += '<td>让球 '+letCount+' </td>';
						weekDiv += '<td class="c_yellow">'+rqOdd3+'</td><td class="c_yellow">'+rqOdd1+'</td><td class="c_yellow">'+rqOdd0+'</td></tr></table></div>';
					}else if(type == 3){
						weekDiv += '<div class="abc"><table class="whil"><tr><td width="24%">&nbsp;</td><td width="27%">主负</td><td width="23%">主胜</td></tr><tr><td>胜负</td>';
						weekDiv += '<td class="c_yellow">'+spfOdd0+'</td><td class="c_yellow">'+spfOdd3+'</td></tr><tr>';
						weekDiv += '<td>让分'+letCount+' </td>';
						weekDiv += '<td class="c_yellow">'+rqOdd0+'</td><td class="c_yellow">'+rqOdd3+'</td></tr></table></div>';
					}
					weekDiv += '</div>';
				}
			}
			weekDiv += '</div>';
		}
		$("#matchs").html(weekDiv);
		$("div[name=showOdds]").click(function(e){
			var target = e.target;
			if(target.nodeName != "DIV"){
				target = target.parentNode.parentNode;
			}else{
				//收藏按钮操作事件
				if(target.className == "collect"){
					target.className="collect_full";
					return ;
				}else if(target.className=="collect_full"){
					target.className="collect";
					return ;
				}
				if($(target).attr("name") != "showOdds"){
					target = target.parentNode;
				}
			}
			//赔率展开收缩功能
			/*if($(target).next(".abc").is(":visible")){
				$(target).next(".abc").hide();
				$(target).find("div[name=oddsflg]").removeClass().addClass("collect_nl2");
			}else{
				$(target).next(".abc").show();
				$(target).find("div[name=oddsflg]").removeClass().addClass("collect_nl");
			}*/
		});
	}
	//赛选框中赛事显示
	var teams = dt["t"];
	if(teams != null){
		var teamDiv = '';
		for ( var i = 0; i < teams.length; i++) {
			teamDiv += '<a href="javascript:void(0);" class="on" onclick="if(this.className == \'on\'){this.className=\'\'}else{this.className=\'on\'};changeChooseAll();">'+teams[i]+'</a>';
		}
		$("#teams").html(teamDiv);
	}
};
//显示和隐藏分组赛事
function changeMatchDiv(id){
	var matchDiv = $("#"+id);
	if (matchDiv.is(":visible")) {
		matchDiv.hide();
		//matchDiv.prev().removeClass("ahtl2").addClass("ahtl");
	}else{
		matchDiv.show();
		//matchDiv.prev().removeClass("ahtl").addClass("ahtl2");
	}
	checkChilds();
};
//得到选中的赛事并记录
function getShowTeams(flg){
	var teams = "";
	var target = $("#windown-content div.ss_sm_but");
	if(flg == "collect"){
		target = $("#sx_pop div.ss_sm_but");
	}
	target.find("a.on").each(function(){
		teams += $(this).html()+",";
	});
	if(flg){
		$("input#initTeams").val(teams);
		var centerClass = target.next().find("a")[0].className;
		if(centerClass == "ss_big_on"){//如果“只显示单固” 按钮选中，则input#initSingle的值设为1
			$("input#initSingle").val(1);
		}
		//筛选弹出框的位置控制
		var ch = $("#windown-box").css("top");
		if(ch){
			ch = parseInt((ch.substring(0,3))/2);
			$("#windown-box").css({
				top:ch+"px"
			});
		}
	}
	return teams;
};
//筛选确认按钮，将筛选出来的赛事显示，未选中的隐藏
function showTeams(flg){
	var teams = getShowTeams(flg);
	var single = $("input#initSingle").val();
	$("div.team_name").each(function(){
		if(teams.indexOf($(this).attr("name")) < 0){
			this.style.display="none";
		}else{
			this.style.display="";
			if(single == 1 && $(this).find("font.c_yellow").length < 1){
				this.style.display="none";
			}
			if(flg!=null && $("input#initCollect").val() == 1 && this.style.display == "" && $(this).find("div.collect").length>0){
				this.style.display="none";
			}
		}
	});
	$("div#sx_pop").html($("#windown-content").html());
	checkChilds();
	closeWindow();
};
//如果分组列表下赛事都隐藏，则该列表样式改为向下
function checkChilds(flg){
	$("div.team_name").each(function(){
		if($(this).parent().parent().find("div.team_name :visible").length == 0){
			//$(this).parent().parent().prev().removeClass("ahtl2").addClass("ahtl");
		}
	});
};
//筛选取消按钮，取消时点中的筛选要恢复原状
function cancleSelect(){
	var teams = $("input#initTeams").val();
	$("#windown-content div.ss_sm_but").find("a").each(function(){
		if(teams.indexOf($(this).html()) > -1){
			$(this).removeClass().addClass("on");
		}else{
			$(this).removeClass("on");
		}
	});
	var single = $("input#initSingle").val();
	var cName = "ss_big_on";
	if(single == 0){
		cName = "ss_big_but";
	}
	$("#windown-content div.ss_sm_but").next().find("a")[0].className = cName;
	changeChooseAll();
	$("div#sx_pop").html($("#windown-content").html());
	closeWindow();
};
//“全部赛事”按钮
function changeChooseAll(flg){
	//flg标记选择的“全部赛事”按钮
	var chooseAll = $("#windown-content a[name=chooseAll]");
	var target = $("#windown-content div.ss_sm_but");
	var cName = "";
	if(!flg){
		if(target.find("a.on").length < target.find("a").length){
			chooseAll[0].className='ss_big_but';
		}else{
			chooseAll[0].className='ss_big_on';
		}
		return ;
	}
	if(chooseAll[0].className =='ss_big_on'){
		chooseAll[0].className='ss_big_but';
		cName = "";
	}else{
		chooseAll[0].className='ss_big_on';
		cName = "on";
	}
	target.find("a").each(function(){
		$(this).removeClass().addClass(cName);
	});	
};
//每日重点赛事回滚
function searchWxDailyMatchCallback(dt,type){
	var data = dt["r"];
	if(data != null){
		//赛事显示
		var htmlstr = $("div.nr1").children().html();
		var weekDiv = "";
		var str = "";
		var matchNum = "--",homeTeamName = "--",guestTeamName = "--",leagueName = "--";
		var s = 0;
		for ( var i = 0; i < data.length; i++) {
			var matchs = data[i][1];
			for(var j = 0; j < matchs.length; j++){
				weekDiv = "";
				s++;
				if(s == 1){
					weekDiv += '<section  name="num'+s+'" class="main-page z-current"  style="-webkit-transition: none; transition: none; -webkit-transform-origin: 50% 0%; -webkit-transform: translateY(0px);">';
				}else{
					weekDiv += '<section  name="num'+s+'" class="main-page"  style="-webkit-transition: -webkit-transform 0.4s ease-out; transition: -webkit-transform 0.4s ease-out; -webkit-transform: scale(1); -webkit-transform-origin: 50% 0%;">';
				}
				weekDiv += htmlstr ;
				weekDiv += "</section>";
				$("div.nr").append(weekDiv);
				var target = $("section[name=num"+s+"]");
				if(matchs[j].matchNum){
					matchNum = matchs[j].matchNum;
				}
				if(matchs[j].homeTeamName){
					homeTeamName = matchs[j].homeTeamName;
				}
				if(matchs[j].guestTeamName){
					guestTeamName = matchs[j].guestTeamName;
				}
				if(matchs[j].leagueName){
					leagueName = matchs[j].leagueName;
				}
				target.find("font[name=teams]").html(data[i][0].split(" ")[1].replace("星期","周")+matchs[j].matchNum.substring(9)+'  '+homeTeamName+' VS '+guestTeamName);
				target.find("font[name=endTime]").html(leagueName+'  开赛时间：'+formatDate(matchs[j].stopTime));
				var recommend0 ="--",recommend1 ="--",recommend2 ="--";
				if(matchs[j].recommend != null){
					recommend0 = matchs[j].recommend.split("|")[0];
					recommend1 = matchs[j].recommend.split("|")[1];
					recommend2 = matchs[j].recommend.split("|")[2];
				}
				var history0 ="--",history1 ="--",history2 ="--";
				if(matchs[j].history != null){
					history0 = matchs[j].history.split(",")[0]; 
					history1 = matchs[j].history.split(",")[1]; 
					history2 = matchs[j].history.split(",")[2];
				}
				var record0 ="--",record1 ="--",record2 ="--",record3 ="--";
				if(matchs[j].record != null){
					record0 = matchs[j].record.split("|")[0];
					record1 = matchs[j].record.split("|")[1];
					record2 = matchs[j].record.split("|")[2];
					record3 = matchs[j].record.split("|")[3];
				}
				target.find("font[name=recommend0]").html(recommend0);
				target.find("font[name=recommend1]").html(recommend1);
				target.find("font[name=recommend2]").html(recommend2);
				
				//参考固定奖金
				var odds = '';
				var spfOdd0 = '--',spfOdd1 = '--',spfOdd3='--';
				var rqOdd0 = '--',rqOdd1 = '--',rqOdd3='--',letCount='';
				if(matchs[j].odds != null){
					odds = matchs[j].odds;
					for ( var m = 0; m < odds.length; m++) {
						odd = eval('(' + odds[m].odds + ')');
						if(odds[m].gameNum == "200401"){
							spfOdd0 = (odd.odd0/1000).toFixed(2);
							spfOdd1 = (odd.odd1/1000).toFixed(2);
							spfOdd3 = (odd.odd3/1000).toFixed(2);
						}
						if(odds[m].gameNum == "200402"){
							rqOdd0 = (odd.odd0/1000).toFixed(2);
							rqOdd1 = (odd.odd1/1000).toFixed(2);
							rqOdd3 = (odd.odd3/1000).toFixed(2);
							letCount = '('+odds[m].letCount/10+')';
							if(odds[m].letCount > 0){
								letCount = '(+'+odds[m].letCount/10+')';
							}
						}
					}
				}
				target.find("font[name=spfOdds]").html(spfOdd3+"&nbsp;&nbsp;&nbsp;&nbsp;"+ spfOdd1+"&nbsp;&nbsp;&nbsp;&nbsp;" +spfOdd0);
				target.find("font[name=letCount]").html(letCount);
				target.find("font[name=rqOdds]").html(rqOdd3+"&nbsp;&nbsp;&nbsp;&nbsp;"+ rqOdd1+"&nbsp;&nbsp;&nbsp;&nbsp;" +rqOdd0);
				target.find("font[name=historys]").html(homeTeamName +' '+ history0+'胜' + history1 + '平'+history2+'负');
				//图片宽度是以值为40 宽度为200算，即history*5
				target.find("font[name=history0]").html("胜 "+history0).parent().next("img").css("width",history0*5);
				target.find("font[name=history1]").html("平 "+history1).parent().next("img").css("width",history1*5);
				target.find("font[name=history2]").html("负 "+history2).parent().next("img").css("width",history2*5);
				target.find("font[name=record0]").html("主队近期战绩："+record0);
				target.find("font[name=record1]").html("<b>主队主场战绩："+record1 +"</b>");
				target.find("font[name=record2]").html("<b>客队近期战绩："+record2 +"</b>");
				target.find("font[name=record3]").html("<b>客队客场战绩："+record3 +"</b>");
			}
		}
	}
	//初始化动态效果需要的对象
	var currentPage = null, activePage = null, triggerLoop = !0, startX = 0, startY = 0, moveDistanceX = 0, moveDistanceY = 0, isStart = !1, isNext = !1, isFirstTime = !0, theClass, scroll = !1, isMobile = mobilecheck(), flipMode,
	 App = getAPP($("div.nr"),0);
	 function getAPP(a, b) {
	    this._$app = a, 
		this._$pages = this._$app.find(".main-page"), 
		this.$currentPage = this._$pages.eq(0), 
		this._isFirstShowPage = !0, 
		this._isInitComplete = !1, 
		this._isDisableFlipPage = !1, 
		this._isDisableFlipPrevPage = !1, 
		this._isDisableFlipNextPage = !1,
		this._scrollMode = b, 
		flipMode = b, 
		theClass = this;
	    var c = $(window);
	    !function() {
	        c.on("scroll.elasticity", function(a) {
	            a.preventDefault()
	        }).on("touchmove.elasticity", function(a) {
	            a.preventDefault()
	        }), c.delegate("img", "mousemove", function(a) {
	            a.preventDefault()
	        })
	    }(), theClass._$app.on("mousedown touchstart", function(a) {
	        scrollStart(a)
	    }).on("mousemove touchmove", function(a) {
	        scrollMove(a)
	    }).on("mouseup touchend mouseleave", function(a) {
	        scrollEnd(a)
	    })
	}
};
//显示收藏
function showCollect(){
	if($("#showCollect").html() == "收藏"){
		$("#showCollect").html("全部");
		$("#showCollect").css("background-image","url(../images/shoucang_y.png)");
		$("#initCollect").val(1);
	}else{
		$("#showCollect").html("收藏");
		$("#showCollect").css("background-image","url(../images/shoucang_no.png)");
		$("#initCollect").val(0);
	}
	showTeams("collect");
};
//用户地址修改
 function updateAddrs(){
	 var realName = $("#name").val(),
	 	detailAddrs = $("#detailAdds").val(),
	 	postCode = $("#postCode").val(),
	 	mobile = $("#mobile1").val(),
	 	province = $("#province").val(),
	 	city = $("#city").val(),
	 	country = $("#country").val(),
	    idCard = $.trim($("#idCard").val());
	if (postCode == "" || postCode == "邮编" || realName == ""||province==""||city==""
		|| realName == "请填写真实姓名" || detailAddrs == ""
		|| detailAddrs == "街道及详细地址" || mobile == "" || mobile == "手机号码" ||
		idCard == "") {
		$("#errorMsg").html("请填写完全部资料后再提交");
		return;
	}
	if(idCard.length != 18){
		$("#errorMsg").html("请检查身份证号填写是否正确");
		return;
	}
	if(!mobilePhone(mobile)){
		$("#errorMsg").html("手机号格式不正确");
		return;
	}
	$.ajax({
		type : "POST",
		url : getPath() + '/web/updateaddrs.do',
		data : "realName=" + realName + "&detailAddrs=" + detailAddrs
				+ "&postCode=" + postCode + "&mobile=" + mobile  
				 + "&province=" + province + "&city=" + city
				+ "&country=" + country + "&idCard="+idCard,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			if (data["errorCode"] == 0) {
				closeWindow();
				if($("#id1").length > 0){
					userInfo();
				} else {
					integralSearch();
				}
			}
		},
		error : function(xhr, status) {

		}
	}); 
 };
 //设置省份
 function setProvince(){
	 var city=document.getElementById('city');
		if(city!=null){
			city.options.length=0;
			var vOption = document.createElement("option");
			vOption.value = "";
	   	 	vOption.text = "请选择";
	   	 	city.options.add(vOption);
		}
		var country=document.getElementById('country');
		if(country!=null){
			country.options.length=0;
			var vOption = document.createElement("option");
			vOption.value = "";
	   	 	vOption.text = "请选择";
	   	 	country.options.add(vOption);
		}
		var options = {
	            url:getPath()+'/web/getProvince.do',
	            async:false,
	            dataType: "json",
	            success: function(data) {
	            	bindProvince(data, 'province', '');
	            	setCity();
				}
			};
		$.ajax(options);
 };
 //绑定省份
 function bindProvince(json, divID, defaultValue) {
	var vProvince = document.getElementById(divID);
	vProvince.options.length = 0;
	var vOption = document.createElement("option");
	vOption.value = "";
	vOption.text = "请选择";
	vProvince.options.add(vOption);
	for ( var i = 0; i < json.length; i++) {
		var provinceName = json[i].name;
		var provinceId = json[i].num;
		var oOption = document.createElement("option");
		oOption.value = provinceId;
		oOption.text = provinceName;
		vProvince.options.add(oOption);
	}
	if (defaultValue)
		vProvince.value = defaultValue;
};
 // 设置城市
 function setCity() {
	var country = document.getElementById('country');
	if (country != null) {
		country.options.length = 0;
		var vOption = document.createElement("option");
		vOption.value = "";
		vOption.text = "请选择";
		country.options.add(vOption);
	}
	var city = document.getElementById('city');
	if (city != null) {
		var p = document.getElementById('province').value;
		if (p > 0) {
			var options = {
				url : getPath() + '/web/getCity.do?provNum=' + p,
				async:false,
				dataType : "json",
				success : function(data) {
					buildCity(data, 'city', '');
					setCountry();
				}
			};
			$.ajax(options);
		}
	}
};
 // 绑定城市
 function buildCity(json, divID, defaultValue) {
	var vCity = document.getElementById(divID);
	vCity.options.length = 0;
	var vOption = document.createElement("option");
	vOption.value = "";
	vOption.text = "请选择";
	vCity.options.add(vOption);
	for ( var i = 0; i < json.length; i++) {
		var cityName = json[i].name;
		var cityId = json[i].num;
		var oOption = document.createElement("option");
		oOption.value = cityId;
		oOption.text = cityName;
		vCity.options.add(oOption);
	}
	if (defaultValue)
		vCity.value = defaultValue;
};
 // 设置县区
 function setCountry() {
	var country = document.getElementById('country');
	if (country != null) {
		var c = document.getElementById('city').value;
		if (c > 0) {
			var options = {
				url : getPath() + '/web/getCounty.do?cNum=' + c,
				async:false,
				dataType : "json",
				success : function(data) {
					if (data != null) {
						buildCountry(data, 'country', '');
					}
				}
			};
			$.ajax(options);
		}
	}
};
 // 绑定县区
 function buildCountry(json, divID, defaultValue) {
	var vCountry = document.getElementById(divID);
	vCountry.options.length = 0;
	var vOption = document.createElement("option");
	vOption.value = "";
	vOption.text = "请选择";
	vCountry.options.add(vOption);
	for ( var i = 0; i < json.length; i++) {
		var countryName = json[i].name;
		var countryId = json[i].num;
		var oOption = document.createElement("option");
		oOption.value = countryId;
		oOption.text = countryName;
		vCountry.options.add(oOption);
	}
	if (defaultValue)
		vCountry.value = defaultValue;
};
 
 /** 最新活动相关js开始* */
// 验证表单输入是否为空
 function require(objValue){
	var pat = /.+/;
	if(objValue.match(pat) ==  null)
		return false;
	return true;
};
//验证表单输入长度是否在规定的范围之内
 function limitArea(objValue,min,max){
	var len = objValue.length;
	if(min > len || max < len)
		return false;
	return true;
};
//验证表单输入长度是否为一个确定的长度
 function limitFix(objValue,fixLen){
	var len = objValue.length;
	if(len != fixLen)
		return false;
	return true;
};
//验证手机号格式
 function mobilePhone(mobile){
	 return /^1[34578][0-9]{9}$/.test(mobile);
}
//手机号码格式验证
function checkMobile(){
	var mobile =$("#mobile").val(),
    errMessage = "mobileErrMsg";
	if(mobile != "请输入手机号码" && require(mobile)){
		// 格式验证	
		if(!mobilePhone(mobile)){
			$("#"+errMessage).html("手机号码格式错误！");
			return false;
		}
		var result = true;
	}else{
		$("#"+errMessage).html("请输入手机号码！");
		return false;
	}
	if(result){
		$("#"+errMessage).html("");
	}
	return result;
};
function checkUserPwd (){
	var userPwd = $("#password").val();
	var errMessage = "mobileErrMsg";
    if(require(userPwd)){
		// 长度范围6-18
		if(!limitArea(userPwd,6,18)){
			$("#"+errMessage).html('登录密码长度为6-18个字符！');
			return false;
		}
		var pwregx = /^(?!\d+$)(?![A-Za-z]+$)[a-zA-Z0-9]+$/i;
		if(!pwregx.test(userPwd)){
			$("#"+errMessage).html('登录密码必须是英文和数字的组合！');
			return false;
		}
		$("#"+errMessage).html("");
		return true;
    }
};
function checkCfmUserPwd (){
	var cfmUserPwd = $("#rePassword").val();
	var errMessage = "mobileErrMsg";
    if(require(cfmUserPwd) && checkUserPwd()){
	    var newpwd = $('#password').val();
		// 两次密码输入是否一致。
		if(newpwd != cfmUserPwd){
			$("#"+errMessage).html('两次输入的密码不一致，请重新输入！');
			return false;
		}
		$("#"+errMessage).html('');
		return true;
    }
}

//问卷调查
function question(){
	var oid=getCookie("token");
	if(!oid){
		window.location = getPath() + "/htmlwx/question2login.html";
		return;
	}
	$.ajax({
		type : "post",
		url : getPath() + '/web/question.do',
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			questionCallback(data);
		}
	});
}
function questionCallback(dt) {
	var submsg="";
	if(dt && dt["n"]){
		showTipsWindown('', 'worn',300,200);
		$("#windown-content p[name=message]").html(dt["n"]);
		$("#windownbg").next().css({
			top: 289+"px"
		});
		$("#windownbg").css({
			height:parseInt(document.documentElement.scrollHeight)+700+"px"
		});
	}else{
		var question = dt["r"][0];
		var userquestion = dt["u"][0];
		var m=1;
		//判断是否有进行中的主题
		if(question){
				//判断是否有剩余次数
			if(userquestion && userquestion.count==question.attendTimes){
				submsg = '您今日已完成答题，请明日再来！';
				showTipsWindown('', 'worn',300,200);
				$("#windown-content p[name=message]").html(submsg);
				$("#windownbg").next().css({
					top: 289+"px"
				});
				$("#windownbg").css({
					height:parseInt(document.documentElement.scrollHeight)+700+"px"
				});
				return;
			}else{//存在就表示已经参加过，没有就表示一次还没有参加过
				 $("#points").val(question.points);//答对一道题获取的相应积分
					var questionItem = question.questionItems;
					 var attType = {"0":"A","1":"B","2":"C","3":"D"};
					 var quesDiv='';
					 var options='';
					 if(questionItem){
						 for(var i=0; i<questionItem.length; i++){
							//把正确答案存起来
							$("#answerattr").val($("#answerattr").val()+questionItem[i].answer+";");
							if(i==0){
								quesDiv+='<div id="showDiv'+m+'"> <div class="timu">'+m+"."+questionItem[i].text+'</div><div class="main_jg"></div><div class="main_w" >';
							}else{
								quesDiv+='<div id="showDiv'+m+'" style="display:none"> <div class="timu">'+m+"."+questionItem[i].text+'</div><div class="main_jg"></div><div class="main_w" >';
							}
							m++;
							options = questionItem[i].options.split(";");
							for(var j=0; j<options.length; j++){
								quesDiv +='<div class="daan">'+attType[j]+"."+options[j]+'</div>';
							}
							quesDiv +='</div></div>';
						 }
						 //第二期的
//						 for(var i=0; i<questionItem.length; i++){
//							 //把正确答案存起来
//							 $("#answerattr").val($("#answerattr").val()+questionItem[i].answer+";");
//							 if(i==0){
//								 quesDiv+='<div id="showDiv'+m+'"> <div class="bg_tm" style="border-top:none;border-left:none;border-right:none;text-align:center;">'+m+"."+questionItem[i].text+'</div><div class="main_jg"></div><div class="main_w" style=" margin:0 auto; width:200px;">';
//								 }else{
//									 quesDiv+='<div id="showDiv'+m+'" style="display:none"> <div class="bg_tm" style="border-top:none;border-left:none;border-right:none;text-align:center;">'+m+"."+questionItem[i].text+'</div><div class="main_jg"></div><div class="main_w" style=" margin:0 auto; width:200px;">';
//								 }
//							 m++;
//							 options = questionItem[i].options.split(";");
//							 for(var j=0; j<options.length; j++){
//									quesDiv +='<p class="bg_tm da_box">'+attType[j]+"&nbsp"+options[j]+'</p><div class="main_jg"></div>';
//								}
//							 quesDiv +='</div></div>';
//						 }
						 //第一期的
						 /*for(var i=0; i<questionItem.length; i++){
							 //把正确答案存起来
							 $("#answerattr").val($("#answerattr").val()+questionItem[i].answer+";");
							 if(i==0){
								 quesDiv+='<div id="showDiv'+m+'"><div class="question_con">'+m+"."+questionItem[i].text+'</div><div class="question_btn">';
								 }else{
									 quesDiv+='<div id="showDiv'+m+'" style="display:none"><div class="question_con">'+m+"."+questionItem[i].text+'</div><div class="question_btn">';
								 }
							 m++;
							 options = questionItem[i].options.split(";");
							 for(var j=0; j<options.length; j++){
									quesDiv +="<a>"+attType[j]+"&nbsp"+options[j]+"</a>";
								}
							 quesDiv +='</div></div>';
						 }*/
						$('#question').html(quesDiv); 
					 }
			}
		}else{
			submsg = '暂无活动';
			showTipsWindown('', 'worn',300,200);
			$("#windown-content p[name=message]").html(submsg);
			$("#windownbg").next().css({
				top: 289+"px"
			});
			$("#windownbg").css({
				height:parseInt(document.documentElement.scrollHeight)+700+"px"
			});
			return;
		}
	}
	
	//$("#question a").unbind("click").click(function() {
		$("#question div.main_w div").unbind("click").click(function() {
		//再次判断参与主题是否与当前一致
		//再次判断是否有剩余次数
		var p = questionAgain();
		var totalDiv = $("#question").find("div[id^=showDiv]");
		var divId = $(this).parent().parent().attr("id");
		divId = parseInt(divId.substring(divId.length-1))+1;
		var a = divId-1;
		//$(this).addClass("on");
		$(this).removeClass().addClass("da_on");
		//var atrr = $("#showDiv"+a).find("a");
		var atrr = $("#showDiv"+a).find("div.main_w div");
		//还要把选择的选项存起来
		var answer = $("#answer").val();
		for(var i=0;i<atrr.length;i++){
			//if(atrr[i].className=="on"){
			if(atrr[i].className=="da_on"){
				var m='';
				if(i==0){
					m='A';
				}else if(i==1){
					m='B';
				}else if(i==2){
					m='C';
				}else{
					m='D';
				}
				$("#answer").val(answer+m+";");
			}
		}
		var answerattr = $("#answerattr").val();
		var answer = $("#answer").val();
		var points = $("#points").val(); 
		if(a==totalDiv.length){
			$("#showDiv"+a).css("display","none");
			var datas = "answerattr=" + answerattr  + "&answer=" + answer + "&points=" + points;
			var r = questionBetSubmit(datas);
		}else{
			showRegPage(divId,a,totalDiv.length);	
		}
	});
}
function questionBetSubmit(datas){
	 //var res=null;
	 $.ajax({
		    async:false,
			type : "post",
			url : getPath() + '/web/questionbetsubmit.do',
			data : datas,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				if(data!=null){
					if(data["n"] != null){
						alert(data["n"]);
						window.location.reload();
						return ;
					}
					if(data["c"]>=data["m"]){
						$("#covt").show();
						return ;
					}
					$("#covf").show();
					$("#covf").click(function(){
						window.location.reload();
					});
//					$("#questionEnd").css("display","");
//					$("#count").html(data["c"]);//答对几道题
//					$("#accountBalance").html(data["a"]);//获取的总共积分
//					if(data["c"]>=data["m"]){
//						$("#drawCount").html(data["d"]);//获取的抽奖次数
//					}
					//res="ok";	
				}
			}
	});
	//return res;
};
//比如页面是昨天打开的，再次判断是否还有次数和是否还有进行中的问卷
function questionAgain(){
	$.ajax({
		type : "post",
		url : getPath() + '/web/question.do',
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
		}
	});
}
//显示隐藏页面
function showRegPage(m,n,total){
	for(var j=1;j<=total;j++){
		var r=$("#showDiv"+m);
		var o=$("#showDiv"+n);
			o.css("display","none");
		if(j==m){
			r.css("display","");
		}/*else{
			r.css("display","none");
		}*/
	}
}
 //最新活动登录并挑战
function loginChallenge(flg) {
	if(flg!="login" &&!$("#readgz")[0].checked){//先判断有没有勾选“已阅读活动规则”
		$('#mobileErrMsg').html("请先阅读活动规则及相关条款！");
		return;
	}
	var mobile = $("#mobile").val();
	var password = $("#password").val();
	var checkCode = $("#checkCode").val();

	if(!checkMobile()){
		return;
	}
	if(password==''){
		$('#mobileErrMsg').html("登录密码不能为空！");
		return;
	}
	if(checkCode==''){
		$('#mobileErrMsg').html("验证码不能为空！");
		return;
	}
	var datas = "mobile=" + mobile + "&password=" + password + "&flg=" + flg +"&checkCode=" + checkCode;
	$.ajax({
		type : "post",
		url : getPath() + '/web/wxlogin.do',
		data : datas,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			if(data["r"] == "ok"){
				refreshCc();
				$("#checkCode").val("");
				var url = location.search;
			    if (url.indexOf("?") != -1) {
			      var strs = url.split("=");
			      if(strs[1]=="ggk"){
						window.location = getPath() + "/htmlwx/hd_ggk.html";
						return;
				  } else if(strs[1] == "ggkzj"){
					  	window.location = getPath() + "/htmlwx/hd_ggk_zj.html";
						return;
				  } else if(strs[1] == "ggklj"){
					  	window.location = getPath() + "/htmlwx/perfectInfo.html";
						return;
				  } else if(strs[1] == "raffle"){
					  	window.location = getPath() + "/htmlwx/hd_raffle.html";
						return;
				  } else if(strs[1] == "raffler"){
					  	window.location = getPath() + "/htmlwx/hd_raffle_record.html";
						return;
				  }
			    }
				if(flg!="login"){
					if(data["s"]==0){//首次激活活动要提示赠送多少积分
//						window.location = getPath() + "/htmlwx/firstPage.html";
						window.location = getPath() + "/htmlwx/hd_dati.html";
						//showTipsWindown('', 'worn',300,200);
					}else{
						if(flg=='question'){//参加问卷调查登陆
							//window.location = getPath() + "/htmlwx/question.html";
							window.location = getPath() + "/htmlwx/hd_dati.html";
						}else{
							window.location = getPath() + "/htmlwx/mychallenge.html";
						}
					}
				}else{
					window.location = getPath() + "/htmlwx/jifen.html";
				}
			}else{
				refreshCc();
				$("#checkCode").val("");
				$("#mobileErrMsg").html(data["r"]);
			}
		}
	});
};
//页面积分的显示
function pageshow(){
	var mutil = parseInt($('#allmutil').val());
	var totalsum = mutil * 2;
	$("#totalsum").html(totalsum);
};

//刮刮卡
function ggk(){
	$.ajax({
		type : "post",
		url : getPath() + '/web/guaguaka.do',
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			ggkCallBack(data);
		},error: function (jqXHR, textStatus, errorThrown) {
		    console.log(jqXHR.responseText);
		    console.log(jqXHR.status);
		    console.log(jqXHR.readyState);
		    console.log(jqXHR.statusText);
		    console.log(textStatus);
		    console.log(errorThrown);
		}
	});
};
var point1 = 0;
function ggkCallBack(dt){
	if(dt){
		if(dt.s == 200){
			if(dt.u){
			    $(".allgold").html(dt.u.accountBalance);
			}else{
				$(".allgold").html("0");
			}
			for(var i in dt.r){
				var content = "";
				var ggk = dt.r[i];
				content += "<div class='jp_item jp_item"+i%2+"'>";
				content += "<h2><img style='margin-right:5px;vertical-align:bottom;' src='../images/jp_ico"+i%2+".png' />"+ggk.param1+"积分奖品设置</h2><ul>";
				for(var j in ggk.apList){
					content += "<li>"+ggk.apList[j].name+"</li>";
				}
				content += "</ul><div class='clearf'></div>";
				content += "<div class='cover_bg"+i%2+"'><div name='"+ggk.id+"' class='scratch' id='scratch"+ggk.id+"'><div class='card' id='card"+ggk.id+"'></div></div></div>";
				content += "</div>";
				$("#hd").append(content);
				if(point1 == 0){
					point1 = ggk.param1;
				}
				initCart(ggk.id, ggk.param1);
			}
		} else {
			alert(dt.r);
		}
	} else {
		alert("无数据");
	}
}

function initCart(id, point){
	var color="";
	if(point == point1 || point == 100){
		color="#567395"
	}else{
		color="#955064"
	}
	LuckyCard.case({
   	 scratchDivId: "scratch"+id,
   	 coverColor:color,
   	 coverImg:'',
   	 cardDivId : "card"+id,
        ratio: 0.05,
        bizId : id,
        startMoveCallback : function(){
       	 ggkSubmit($("#scratch"+this.opt.bizId).attr("name"), point);
        },
        coverText : point+" 积 分 刮 一 次"
   }, function() {
       //this.clearCover();
	   $("#scratch"+this.opt.bizId+" canvas").remove();
   });
}

function ggkSubmit(id, point){
	(function func(id, point){
		$.ajax({
			type : "post",
			url : getPath() + '/web/guaguaka/sumbit.do',
			data : {
				id : id
			},
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				var content = "<br><a href='#' onclick='initCart("+id+","+point+")'>再刮一次</a>";
				if(data){
					if(data.s == 200){
						$("#card"+id).html("恭喜获得<span style='font-weight:bold;font-size:20px;'>"+data.r+"</span>，完善信息领奖哦"+content);
					} else if(data.s == 404){
						window.location.href = getPath() + "/htmlwx/denglu.html?type=ggk";
						return;
					} else {
						$("#card"+id).html(data.r+content);
					}
				} else {
					$("#card"+id).html("运气不佳"+content);
				}
				if(data.u){
				    $(".allgold").html(data.u.accountBalance);
				}
			}
		});
	})(id, point);
}

//中奖记录
function ggkRecord(){
	$.ajax({
		type : "post",
		url : getPath() + '/web/guaguaka/record.do',
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			ggkRecordCallBack(data);
		}
	});
};
function ggkRecordCallBack(data){
	var dt = data["r"];
	if(dt.indexOf("请重新登录") > -1){
		window.location.href = getPath() + "/htmlwx/denglu.html?type=ggkzj";
		return;
	}
	//var content = "<thead><tr><td>所用积分</td><td>奖品</td><td>时间</td><td>奖品状态</td></tr></thead><tbody>";
	var content = "<thead><tr><td>所用积分</td><td>奖品</td><td>时间</td></tr></thead><tbody>";
	if(dt && dt.length > 0){
		for (var i = 0; i < dt.length; i++) {
			if (dt[i] != null) {
				var trcalss = "";
				if(dt[i].param1 == dt[0].param1){
					trcalss = "odd";
				}else{
					trcalss = "even";
				}
				content += "<tr class='"+trcalss+"'>";
//				content += "<td>";
//				content += (i+1);
//				content += "</td>";
				content += "<td>";
				content += dt[i].param1;
				content += "</td>";
				content += "<td>";
				if(dt[i].name&&dt[i].worth){
 					content += dt[i].name;
 				} else {
 					content += "未中奖";
 				}
				content += "</td>";
				content += "<td>";
				content += formatDate(dt[i].raffleTime);
				content += "</td>";
//				content += "<td>";
//				if(dt[i].status == 0 && dt[i].name){
//					content += "未完善信息";
//				}else if(dt[i].status == 1 && dt[i].name){
//					content += "已中奖,待发货";
//				}else if(dt[i].status == 2 && dt[i].name){
//					content += "已发货";
//				}else if(dt[i].status == 0 && !dt[i].name){
//					content += "--";
//				}
//				content += "</td>";
				content += "</tr>";
				content += "<tr class='spacetr'><td></td><td></td><td></td><td></td></tr>"
			}
		}
		content += "</tbody>";
	} else {
		content += "<tr><td colspan='4'>暂无记录</td></tr>";
		content += "</tbody>";
	}
	$("#record").html(content);
	$(".wanshan").html("完善信息才能领取奖品<a href='perfectInfo.html' class='togift'>完善信息</a>");
}

//抽奖
function luckydraw(){
	$.ajax({
		type : "post",
		url : getPath() + '/web/luckydraw.do?prov=FJ',
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			luckydrawCallBack(data);
		}
	});
};
function luckydrawCallBack(dt){
	if(dt){
		if(!dt["u"]){
			window.location.href = getPath() + "/htmlwx/question2login.html";
		}
		var user = dt["u"][0];//用户的信息,获取抽奖次数
		var luckyuser = dt["a"];//获奖名单,取前十个
		var userDiv = '';
		$("#availableCount").html(user.availableRaffleCount);//
		userDiv+='<ul class="list_con2" id="dynamicshow">';
		for(var i=0;i<luckyuser.length;i++){
			if(i==0){
				userDiv+='<li>恭喜'+luckyuser[i].mobile.substring(0,3)+'*****'+luckyuser[i].mobile.substring(8)+'获得'+luckyuser[i].worth+'元'+luckyuser[i].name+'</li>';
			}else{
			    userDiv+='<li style="display:none;">恭喜'+luckyuser[i].mobile.substring(0,3)+'*****'+luckyuser[i].mobile.substring(8)+'获得'+luckyuser[i].worth+'元'+luckyuser[i].name+'</li>';
			}
		}
		userDiv+='</ul>';
		$("#luckyUser").html(userDiv);
		//获奖名单动态显示
		$(".list_con2").bootstrapNews({
			newsPerPage: 12,
			autoplay: true,
			pauseOnHover: true,
			navigation: false,
			direction: 'up',
			newsTickerInterval: 2000,
			onToDo: function () {
				//console.log(this);
			}
		});	
		$("#btn_run").unbind("click").click(function(){
			luckyBetSumbit();
		});
	}
};
//点击开始抽奖
function luckyBetSumbit(){
	var res="";
	$.ajax({
		type : "post",
		url : getPath() + '/web/luckyBetSumbit.do?prov=FJ',
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var res=0;
			if(data.r.indexOf("恭喜")>-1||data.r.indexOf("灰心")>-1){
				$("#btn_run").unbind("click");
				res = data.l;
//				if(data.r.substring(5,8)=="500"){
//					res=1;
//				}else if(data.r.substring(5,8)=="100"){
//					res=2;
//				}else if(data.r.substring(5,7)=="50"){
//					res=3;
//				}
				var level = {"0":"无","1":"一","2":"二","3":"三","4":"四","5":"五","6":"六"};
				var name ={"1":"59元代金券","2":"39元代金券","3":"19元代金券","4":"9元代金券","5":"8元代金券","0":"6元代金券"};
				var str = {"1":960,"2":720,"3":840,"4":780,"5":900,"6":1020};
				$("#run").rotate({ 
					duration:3000, //转动时间 
					angle: 0, //默认角度
					animateTo: str[res], //转动角度 
					easing: $.easing.easeOutSine,
					callback: function(){ 
						//$(".dialog").css("background","url(../images/zj"+res+".png)");
						//$(".dialog").css("background-repeat","no-repeat");
						$("#cov1").html("恭喜您，获得<font class='yellow'>"+level[data.l]+"等奖</font>"+name[data.l]);
						$("#cov2").html(level[data.l]+"等奖"+name[data.l]);
						$("#cov").show(); 
					} 
					});	
			}else{
				if(data.r.indexOf("次数不足")>-1){
					$("#cov0").html('<img src="../images/zjn.png"  width="550"  style="display:inline-block;"/>');
					$("#cov").show(); 
				}else{
					showTipsWindown('', 'worn',300,200);
					$("#windown-content p[name=message]").html(data.r);
				}
				
			}
		}
	});
}

//指引界面
function zhiyin(){
	$.ajax({
		type : "post",
		url : getPath() + '/web/zhiyin.do',
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
		}
	});
}
//我的挑战
function myChallenge(){
	var oid=getCookie("token");
	
	if(!oid){
		window.location = getPath() + "/htmlwx/newactivity.html";
		return;
	}
	var request, srchString = location.search.substring(1,
			location.search.length);
	if (srchString.length > 0) {
		request = parseParam(srchString);
		var flag=request["flag"];
	}
	$.ajax({
		type : "post",
		url : getPath() + '/web/mychallenge.do',
		data : 'flag=' + flag,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			if(flag=="first"){
				//showTipsWindown('', 'first',300,200);
				//showTipsWindown('', 'first',417,527);//不送积分，不要弹框
			}
			/*if(!data["x"]){
				if(data&&data["e"]==0){//之前没有答过题的跳到指引界面，并且只跳一次
					window.location = getPath() + "/htmlwx/zhiyin.html";
				}	
			}*/
			myChallengeCallbackJX(data);
		}
	});
};

function myChallengeCallbackJX(data) {
	if (data.r==='请重新登录'){
		window.location = getPath() + "/htmlwx/newactivity.html";
		return;
	}else if (data.r==='当前无比赛'){
		$("#mainbetdiv").hide();
		$("#todaytitle").html(data.r);
		return;
	}else{
		var today=data.m.matchNum;
		today = today.substring(0,4)+"-"+today.substring(4,6)+"-"+today.substring(6,8);
		var endtime = new Date();
		endtime.setTime(data.m.endTime);
		var odds=data.m.odds;
		if (odds){
			odds=JSON.parse(odds);
			var odd3=odds.odd3;
			var odd1=odds.odd1;
			var odd0=odds.odd0;
			if (odd3){
				odd3=(odd3/1000).toFixed(2);
				$("#odd3").html(odd3);
			}
			if (odd1){
				odd1=(odd1/1000).toFixed(2);
				$("#odd1").html(odd1);
			}
			if (odd0){
				odd0=(odd0/1000).toFixed(2);
				$("#odd0").html(odd0);
			}
		}

		$("#today").html(today);
		$("#matchWeek").html(data.m.matchNumDate);
		$("#leguageName").html(data.m.leagueName);
		$("#endBet").html(endtime.toTimeString().substring(0,8));
		if (data.m.letCount!==0){
			$("#home").html(data.m.homeName+"("+data.m.letCount+")");
		}else{
			$("#home").html(data.m.homeName);
		}

		$("#guest").html(data.m.awayName);
		$("#betAgain").html(data.u);

		if (data.u===0){
			//$("#subbutton").hide();
			$("#betImg").attr("src","../hd_imgs/qrtz_no.png");
		}
		var starttime=new Date();
		starttime.setTime(data.m.startTime);
		if (starttime>new Date() || endtime<new Date()){
			$("#timeprompt").html("参与时间 "+starttime.toTimeString().substring(0,8)+"~"+endtime.toTimeString().substring(0,8));
			$("#timeprompt").show();
			$("#betImg").attr("src","../hd_imgs/qrtz_no.png");
			//$("#subbutton").hide();
		}

	}


}

function checkbetSubmit(){

		var chooseodd=document.getElementById('chooseodd').value;
		var datas = "betContent="+chooseodd;
		var r=betSubmit(datas);
		if(r=='ok'){
			submsg = '恭喜你，提交成功!';
			$("#betAgain").html(0);
			$("#betImg").attr("src","../hd_imgs/qrtz_no.png");
			//$("#subbutton").hide();
		}else{
			submsg = r;
		}
		//showTipsWindown('', 'worn',300,200);
		showTipsWindown('', 'worn',950,600);
		$("#windown-content p[name=message]").html(submsg);
}

function mychallengeChoose() {
	var oBtnbod = document.getElementById('btnbod');
	var chooseodd=document.getElementById('chooseodd');
	var aAbtn = oBtnbod.getElementsByTagName('a');
	var aClassname = [ 'btn_sheng','btn_ping','btn_fu' ];

	for(var i=0;i<aAbtn.length;i++){
		aAbtn[i].onclick = function(){
			clearAll();
			if (this.className.indexOf('btn_sheng')>=0){
				chooseodd.value="3";
			}else if (this.className.indexOf('btn_ping')>=0){
				chooseodd.value="1";
			}else if (this.className.indexOf('btn_fu')>=0){
				chooseodd.value="0";
			}
			this.className = this.className + '_on';
		}
	}
	function clearAll(){
		for(var j=0;j<aAbtn.length;j++){
			aAbtn[j].className = aClassname[j];
		}
	}

}

//四期活动
function myChallengeCallback(data){
	var user = data["r"][0];
	var ticketcount = data["tc"];
	var ticketsum = data["ts"];
	var match = data["m"];
	
	//当前账户兑换劵
	$("#ticketsum").html(ticketsum);
	//累计获得兑换劵
	$("#ticketcount").html(ticketcount);
	
	var tzcs = 1;//此数据后面改为可配
	if(user.betCountToday < tzcs){
		tzcsStr = '剩余投注次数：<b class="c_yellow">'+(tzcs-user.betCountToday)+'</b>次';
	}else if(user.betCountToday >= tzcs){
		tzcsStr = '剩余投注次数：<b class="c_yellow">'+(tzcs-user.betCountToday)+'</b>次';
	}
	$("#tzcs").html(tzcsStr);
	//取截止时间最早的，两个比较一下
	var endTime = match[0].endTime;
	for(var i=0;i<match.length;i++){
		if(endTime>match[i].endTime){//formatDate(match.endTime)
			endTime=match[i].endTime;
		}
	}
	
	//三个赛事，如果都是销售中或者已截止的或者待销售的直接显示即可，主要是如果三个赛事的状态不一样，就要区分一下了
	//1 如果有待销售和已截止的，那么只显示待销售的
	//2、
	var nextsale=0,saleing=0,end=0;
	for(var i=0;i<match.length;i++){
		if(data["t"] < match[i].startTime){//有销售赛事，但是还没到投注时间
			nextsale++;
		}else if(data["t"] > match[i].endTime){//已截止的
			end++;
		}else if(data["t"]> match[i].startTime && data["t"] < match[i].endTime){
			saleing++;
		}
	}
	if(saleing>0){//销售中
		//match.length=match.length-(match.length-saleing);
		$("#betSubmit").removeClass().addClass("sure_zt");
	}else if(nextsale>0){//待销售
		//match.length=match.length-(match.length-nextsale);
		$("#betSubmit").removeClass().addClass("sure_zt3");
	}else if(end==2){//已截止
		//match.length=match.length;
		$("#betSubmit").removeClass().addClass("sure_zt3");
	}
	var tzcs=1;
	if(tzcs-user.betCountToday<=0){
		$("#betSubmit").removeClass().addClass("sure_zt4");
	}
	//取前两个赛事循环
	var matchDiv="";
	for(var i=0;i<match.length;i++){
		if(match[i].type=="0"){//猜胜负
			//支持率
			var winRate=0,drawRate=0,lostRate=0,sum=0;
			sum = match[i].winBetCount+match[i].drawBetCount+match[i].lostBetCount;
			if(sum!=0){
				 winRate=(match[i].winBetCount/sum)*100;
				 drawRate=(match[i].drawBetCount/sum)*100;
				 lostRate=(match[i].lostBetCount/sum)*100;
			}
			
			matchDiv+='<div class="bet_box1" id="'+match[i].id+'"><div class="bet_box1_time">截止时间'+formatDate(endTime).split(" ")[1]+'</div>';
			matchDiv+='<div class="bet_box1_z" name="havea"><div class="team1_logo">'+match[i].awayName+'(客)</div>';
			var odds = match[i].odds;
			if(odds != null){
				odds = eval('(' + odds + ')');
				matchDiv+='<a href="javascript:void(0);" name="caishengfu" class="button_b_" rel="0" >主负 <font>'+((odds.odd0)/1000).toFixed(2)+'</a>'+lostRate.toFixed(2)+'%';
			}else{
				matchDiv+='<a href="javascript:void(0);" name="caishengfu" class="button_b_" rel="0" >主负 <font></a>'+lostRate.toFixed(2)+'%';
				$("#betSubmit").removeClass().addClass("sure_zt3");
			}
			matchDiv+='</div><div class="bet_box1_v"><span class="col_orange">'+match[i].matchNumDate.split(" ")[1].replace("星期","周")+match[i].matchNum.substring(9)+' &nbsp;'
			+'</span><br/><br/><img src="../images/v.jpg" /><br/>';
			
			if(match[i].concedeNum!=null && match[i].concedeNum != 0){//让球数大于0，才显示出来让球数
				matchDiv+='<span class="col_orange">('+match[i].concedeNum+')</span><br/><br/><br/>支持率</div>';	
			}
			
			matchDiv+='<div class="bet_box1_k" name="havea"><div class="team2_logo">'+match[i].homeName+'(主)</div>';
			if(odds != null){
				//odds = eval('(' + odds + ')');
				matchDiv+='<a href="javascript:void(0);" name="caishengfu" class="button_b_" rel="3" >主胜 <font>'+((odds.odd3)/1000).toFixed(2)+'</a>'+winRate.toFixed(2)+'%';
			}else{
				matchDiv+='<a href="javascript:void(0);" name="caishengfu" class="button_b_" rel="3" >主胜 <font></a>'+winRate.toFixed(2)+'%';
				$("#betSubmit").removeClass().addClass("sure_zt3");
			}
			matchDiv+='</div></div>';
		}
	}
	for(var i=0;i<match.length;i++){
		if(match[i].type!="0"){
			//支持率
			var winRate=0,drawRate=0,lostRate=0,sum=0;
			sum = match[i].winBetCount+match[i].drawBetCount+match[i].lostBetCount;
			if(sum!=0){
				 winRate=(match[i].winBetCount/sum)*100;
				 drawRate=(match[i].drawBetCount/sum)*100;
				 lostRate=(match[i].lostBetCount/sum)*100;
			}
			
			var guessResult = {"0":"猜胜负","1":"得分","2":"三分球","3":"篮板","4":"助攻"};//竞猜的三个选项
			var rm=match[i].remark.split(/:|：/);
			//matchDiv+='<div class="hdcj_md">球员'+guessResult[match[i].type]+'竞猜</div>';
			matchDiv+='<div class="bet_box2" id="'+match[i].id+'"><div class="hdcj_md">球员'+guessResult[match[i].type]+'竞猜</div><div class="bet_person"></div>';
			matchDiv+='<div class="bet_box2_i"><img class="box2_p" width="129px" heigth="117px" src="'+match[i].picture+'" /><div class="box2_i"><span class="col_orange">姓名：</span>'
			+match[i].homeName+'</div><div class="box2_i"><span class="col_orange">位置：</span>'+match[i].awayName
			+'</div><div class="box2_i"><span class="col_orange">'+rm[0]+':</span>'+rm[1]+'</div></div>';
			
			matchDiv+='<div class="bet_box2_b"><a href="javascript:void(0)" rel="1" name="otherfu" class="button_b">'+match[i].option1+'</a><a href="javascript:void(0)" rel="2" name="otherfu" class="button_b">'
			+match[i].option2+'</a><a href="javascript:void(0)" rel="3" name="otherfu" class="button_b">'+match[i].option3+'</a><br/><br/><font class="zhichi1">'
			//+match[i].option2+'</a><a href="javascript:void(0)" rel="3" name="otherfu" class="button_b">'+match[i].option3+'</a><br/><br/><b class="zhichi">支持率</b><font><b class="zhichi1">'
			+winRate.toFixed(2)+'%</font><font class="zhichi2">'+drawRate.toFixed(2)+'%</font><font class="zhichi3">'+lostRate.toFixed(2)+'%</font></div></div>';
		}
	}
	$("#matchInfo").html(matchDiv);
	
	var luckyuser = data["ra"];//获奖名单,取前十个
	var userDiv = '';
	userDiv+='<ul class="list_con2" id="dynamicshow">';
	for(var i=0;i<luckyuser.length;i++){
		if(i==0){
			userDiv+='<li>兑换信息：'+luckyuser[i].mobile.substring(0,3)+'*****'+luckyuser[i].mobile.substring(8)+'兑换'+luckyuser[i].name+'</li>';
		}else{
		    userDiv+='<li style="display:none;">兑换信息：'+luckyuser[i].mobile.substring(0,3)+'*****'+luckyuser[i].mobile.substring(8)+'兑换'+luckyuser[i].name+'</li>';
		}
	}
	userDiv+='</ul>';
	$("#userinfo").html(userDiv);
	//获奖名单动态显示
	$(".list_con2").bootstrapNews({
		newsPerPage: 12,
		autoplay: true,
		pauseOnHover: true,
		navigation: false,
		direction: 'up',
		newsTickerInterval: 2000,
		onToDo: function () {
			//console.log(this);
		}
	});	
	
	var oddsId = $("div#matchInfo a");
	var betContent,matchId,betContent1,matchId1;
	oddsId.click(function(){
		var name = $(this).attr("name");//看看点击的是哪种游戏
		if(name=="caishengfu" && this.className != "button_o_"){
			$(".bet_box1").find("a[name=caishengfu]").removeClass().addClass("button_b_");
			$(this).removeClass().addClass("button_o_");
			betContent = $(this).attr("rel");
			matchId = $(".bet_box1").attr("id");//某场赛事编号，写在id里
		}else if(name=="otherfu" && this.className != "button_o"){
			$(this).removeClass().addClass("button_o");
			$(this).siblings("a[name=otherfu]").removeClass().addClass("button_b");
			betContent1 = $(this).attr("rel");
			matchId1 = $(".bet_box2").attr("id");//某场赛事编号，写在id里
		}else{
			if(name=="caishengfu"){
				$(this).removeClass().addClass("button_b_");
			}else{
				$(this).removeClass().addClass("button_b");
			}
			//没有选择赔率的时候，将betContent置为null
			betContent = null;
			betContent1 = null;
		}
	});
	$("#betSubmit").unbind("click").click(function(){
		if(this.className == "sure_zt2"||this.className== "sure_zt3"||this.className== "sure_zt4"){
			//showTipsWindown('', 'worn',300,200);
			//$("#windown-content p[name=message]").html("暂无可投注比赛！");
			return ;
		}else{
			var flg = 0;
			if(betContent == null||betContent1== null){
				//showTipsWindown('', 'worn',300,200);
				showTipsWindown('', 'worn',417,527);
				$("#windown-content p[name=message]").html("请选择竞猜项~");
				return ;
			}else{
				var submsg = "";
				/*if(user.accountBalance<100){
					submsg = '对不起，您当前账户剩余积分不足100，无法参加虚拟投注，请明日继续努力赚取积分吧';
					showTipsWindown('', 'worn',300,200);
					$("#windown-content p[name=message]").html(submsg);
					return;
				}*/
				/*if(multitimes*2>user.accountBalance.toFixed(2)){
					submsg = '对不起，积分不足!';
					//showTipsWindown('', 'worn',300,200);
					showTipsWindown('', 'worn',417,527);
					$("#windown-content p[name=message]").html(submsg);
					return;
				}*/
				if(user.betCountToday < tzcs){
					var datas = "matchId="+matchId+"&userId="+user.id+"&mobile="+user.mobile+"&betContent="+betContent+"&matchId1="+matchId1+"&betContent1="+betContent1;
					var r=betSubmit(datas);
					if(r=='ok'){
						submsg = '恭喜你，提交成功!';
						$("#betSubmit").removeClass().addClass("sure_zt4");
					}else{
						submsg = r;
					}
					//showTipsWindown('', 'worn',300,200);
					showTipsWindown('', 'worn',417,527);
					$("#windown-content p[name=message]").html(submsg);
				}else if(user.betCountToday >= tzcs){
					submsg = '您当日的投注机会已经用完，请明日继续~';
					/*if(flg == 0){
						submsg = '做的好！今日已完成'+tzcs+'次投注，别忘了明日继续参加哦';
						flg = 1;
					}else{
						submsg = '对不起，您当日的投注机会已经用完，请明日继续';
					}*/
					//showTipsWindown('', 'worn',300,200);
					showTipsWindown('', 'worn',417,527);
					$("#windown-content p[name=message]").html(submsg);
				}
			}
		}
		$("#windown-content a").click(function(){
			closeWindow();
			window.location = getPath() + "/htmlwx/mychallenge.html";
		});
	});
};

function myChallengeCallback11(data){
	var user = data["r"][0];
	var match = data["m"];
	var tzcs = 1;//此数据后面改为可配
	
	//取截止时间最早的，三个比较一下
	var endTime = match[0].endTime;
	for(var i=0;i<match.length;i++){
		if(endTime>match[i].endTime){//formatDate(match.endTime)
			endTime=match[i].endTime;
		}
	}
	$("#endTime").html(formatDate(endTime).split(" ")[1]);
	
	$("#ljzjjf").html((user.awardSum).toFixed(2));//累计中奖积分
	$("#zhjf").html((user.accountBalance).toFixed(2));//当前账户积分
	$("#jifen").val((user.accountBalance).toFixed(2));
	
	//三个赛事，如果都是销售中或者已截止的或者待销售的直接显示即可，主要是如果三个赛事的状态不一样，就要区分一下了
	//1 如果有待销售和已截止的，那么只显示待销售的
	//2、
	var nextsale=0,saleing=0,end=0;
	for(var i=0;i<match.length;i++){
		if(data["t"] < match[i].startTime){//有销售赛事，但是还没到投注时间
			nextsale++;
		}else if(data["t"] > match[i].endTime){//已截止的
			end++;
		}else if(data["t"]> match[i].startTime && data["t"] < match[i].endTime){
			saleing++;
		}
	}
	if(saleing>0){//销售中
		match.length=match.length-(match.length-saleing);
		$("#betSubmit").removeClass().addClass("sure_zt");
	}else if(nextsale>0){//待销售
		match.length=match.length-(match.length-nextsale);
		$("#betSubmit").removeClass().addClass("sure_zt3");
	}else if(end==3){//已截止
		match.length=match.length;
		$("#betSubmit").removeClass().addClass("sure_zt3");
	}
	var tzcs=1;
	if(tzcs-user.betCountToday<=0){
		$("#betSubmit").removeClass().addClass("sure_zt4");
	}
	//取前三个赛事循环
	var matchDiv="";
	for(var i=0;i<match.length;i++){
		//支持率
		var winRate=0,drawRate=0,lostRate=0,sum=0;
		sum = match[i].winBetCount+match[i].drawBetCount+match[i].lostBetCount;
		if(sum!=0){
			 winRate=(match[i].winBetCount/sum)*100;
			 drawRate=(match[i].drawBetCount/sum)*100;
			 lostRate=(match[i].lostBetCount/sum)*100;
		}
		//赛事编号：match[i].leagueName+"&nbsp;"+match[i].matchNumDate.split(" ")[1].replace("星期","周")+match[i].matchNum.substring(9)
		matchDiv+='<div class="tz_body" id="odds"><p class="mzb col_green f18">'+match[i].matchNumDate.split(" ")[1].replace("星期","周")+match[i].matchNum.substring(9)+' &nbsp;'+match[i].leagueName+'</p><div class="qiudui"><span class="f_l">'+match[i].homeName
		+'</span><span class="f_r" id="awayName">'+match[i].awayName+'</span>';
		if(match[i].concedeNum!=null && match[i].concedeNum != 0){//让球数大于0，才显示出来让球数
			matchDiv+='<i class="col_red">('+match[i].concedeNum+')</i>';	
		}
		matchDiv+='</div><div class="btn_3 f26"><div class="btn_body" id="'+match[i].id+'"><ul>';
		var odds = match[i].odds;
		if(odds != null){
			odds = eval('(' + odds + ')');
			matchDiv+='<li class="mar_left"><a href="javascript:void(0);" rel="3" >主胜 <font>'+((odds.odd3)/1000).toFixed(2)+'</font></a><br/><font>'+winRate.toFixed(2)+'%</font></li>'
			+'<li class="mar_left"><a href="javascript:void(0);" rel="1" >平  <font>'+((odds.odd1)/1000).toFixed(2)+'</font></a><br/><font>'+drawRate.toFixed(2)+'%</font></li>'
			+'<li class="mar_left"><a href="javascript:void(0);" rel="0" >主负 <font>'+((odds.odd0)/1000).toFixed(2)+'</font></a><br/><font>'+lostRate.toFixed(2)+'%</font></li>'
			+'</ul></div><span class="zcl f18">支持率</span></div><i class="mub f18">'+(i+1)+'.</i></div>';
		}else{
			matchDiv+='<li class="mar_left"><a href="javascript:void(0);" rel="3" >主胜 <font></font></a><br/><font>'+winRate.toFixed(2)+'%</font></li>'
			+'<li class="mar_left"><a href="javascript:void(0);" rel="1" >平  <font></font></a><br/><font>'+drawRate.toFixed(2)+'%</font></li>'
			+'<li class="mar_left"><a href="javascript:void(0);" rel="0" >主负 <font></font></a><br/><font>'+lostRate.toFixed(2)+'%</font></li>'
			+'</ul></div><span class="zcl f18">支持率</span></div><i class="mub f18">'+(i+1)+'.</i></div>';
			$("#betSubmit").removeClass().addClass("sure_zt3");
		}
	}
	$("#matchInfo").html(matchDiv);
	var oddsId = $("div#matchInfo a");
	var betContent,matchId ;
	oddsId.click(function(){
		if(this.className != "on"){
			$(this).removeClass().addClass("on");
			//不同等级下的移除
			$(this).parent().parent().parent().parent().parent().siblings().each(function(){
				$(this).find("a").removeClass();
			});
			//同等级下的移除
			$(this).parent().siblings().each(function(){
				$(this).find("a").removeClass();
			});
			betContent = $(this).attr("rel");
			matchId = $(this).parent().parent().parent().attr("id");//某场赛事编号，写在id里
		}else{
			$(this).removeClass();
			//没有选择赔率的时候，将betContent置为null
			betContent = null;
		}
	});
	$("#betSubmit").unbind("click").click(function(){
		var multitimes = $("#allmutil").val();
		if(this.className == "sure_zt2"||this.className== "sure_zt3"||this.className== "sure_zt4"){
			//showTipsWindown('', 'worn',300,200);
			//$("#windown-content p[name=message]").html("暂无可投注比赛！");
			return ;
		}else{
			var flg = 0;
			if(betContent == null){
				//showTipsWindown('', 'worn',300,200);
				showTipsWindown('', 'worn',417,527);
				$("#windown-content p[name=message]").html("还没有选择奖金哦~");
				return ;
			}else{
				var submsg = "";
				/*if(user.accountBalance<100){
					submsg = '对不起，您当前账户剩余积分不足100，无法参加虚拟投注，请明日继续努力赚取积分吧';
					showTipsWindown('', 'worn',300,200);
					$("#windown-content p[name=message]").html(submsg);
					return;
				}*/
				if(multitimes*2>user.accountBalance.toFixed(2)){
					submsg = '对不起，积分不足!';
					//showTipsWindown('', 'worn',300,200);
					showTipsWindown('', 'worn',417,527);
					$("#windown-content p[name=message]").html(submsg);
					return;
				}
				if(user.betCountToday < tzcs){
					var datas = "matchId="+matchId+"&userId="+user.id+"&mobile="+user.mobile+"&betContent="+betContent+"&multitimes="+multitimes;
					var r=betSubmit(datas);
					if(r=='ok'){
						submsg = '恭喜你，提交成功!';
						$("#betSubmit").removeClass().addClass("sure_zt4");
					}else{
						submsg = r;
					}
					//showTipsWindown('', 'worn',300,200);
					showTipsWindown('', 'worn',417,527);
					$("#windown-content p[name=message]").html(submsg);
				}else if(user.betCountToday >= tzcs){
					submsg = '您当日的投注机会已经用完，请明日继续~';
					/*if(flg == 0){
						submsg = '做的好！今日已完成'+tzcs+'次投注，别忘了明日继续参加哦';
						flg = 1;
					}else{
						submsg = '对不起，您当日的投注机会已经用完，请明日继续';
					}*/
					//showTipsWindown('', 'worn',300,200);
					showTipsWindown('', 'worn',417,527);
					$("#windown-content p[name=message]").html(submsg);
				}
			}
		}
		$("#windown-content a").click(function(){
			closeWindow();
			window.location = getPath() + "/htmlwx/mychallenge.html";
		});
	});
};

function myChallengeCallback1(data){
	var user = data["r"][0];
	var tzcs = 1;//此数据后面改为可配
	var tzcsStr = '您今日尚未投注，还有<b class="c_yellow">'+tzcs+'</b>次机会哦!';
	
	$("#ljtzjf").html((user.betSum).toFixed(2));//累计投注积分
	$("#ljzjjf").html((user.awardSum).toFixed(2));//累计中奖积分
	$("#ljczday").html(user.betDay);//累计参加天数
	$("#ljtz").html(user.betCount);//累计投注次数
	$("#lszj").html(user.awardCount);//累计中奖次数
	 $("#inteRanking").html(data["i"]?data["i"]:'--');//当期排名
	/*if(user.betCountToday < tzcs){
		tzcsStr = '您已投注<b class="c_yellow">'+user.betCountToday+'</b>次，还有<b class="c_yellow">'+(tzcs-user.betCountToday)+'</b>次机会哦!';
	}else if(user.betCountToday >= tzcs){
		tzcsStr = '您今日已投注<b class="c_yellow">'+user.betCountToday+'</b>次，请明日再来！';
	}*/
	if(user.betCountToday < tzcs){
		tzcsStr = '还有<b class="c_yellow">'+(tzcs-user.betCountToday)+'</b>次机会哦!';
	}else if(user.betCountToday >= tzcs){
		tzcsStr = '还有<b class="c_yellow">'+(tzcs-user.betCountToday)+'</b>次机会哦!';
	}
	$("#tzcs").html(tzcsStr);
	var awardRate = 0;
	if(user.betCount > 0){
		awardRate = (user.awardCount/user.betCount*100).toFixed(2);
	}
	$("#zjl").html(awardRate);//中奖率
	$("#zhjf").html((user.accountBalance).toFixed(2));//当前账户积分
		
	//销售中赛事还没结束，并且已有了待销售赛事的时候就不能取第一个赛事
	var matchAll = data["m"];
	/*var matchNameAll = data["n"];*/
	var match,matchName,k,m;
	if(matchAll!=null){
		for ( var i = 0; i < matchAll.length; i++) {
			if(matchAll[i].startTime<data["t"] && data["t"] < matchAll[i].endTime){
				match= matchAll[i];
				k = i;
				break;
			}else if(data["t"]<matchAll[i].startTime){
				match = matchAll[i];
				m = i;
			}else{
				match = matchAll[0];
			}	
		}
	}
	//日期也要与赛事日期相对应
	/*if(matchNameAll!=null){
		for ( var j = 0; j < matchNameAll.length; j++) {
			if(j==k){
				 matchName = matchNameAll[k];
				  break;	
			}else if(j==m){
				matchName = matchNameAll[m];
			}else{
				matchName = matchNameAll[0];
			}
		}	
	}*/
		//英超周三001
		$("#matchName").html(match.leagueName+"&nbsp;"+match.matchNumDate.split(" ")[1].replace("星期","周")+match.matchNum.substring(9));
		//$("#matchName").html(match.leagueName+"&nbsp;"+matchName.split(" ")[1].replace("星期","周")+match.matchNum.substring(9));
		$("#endTime").html("截止投注时间："+formatDate(match.endTime));
		if(data["t"] < match.startTime){
			$("#endTime").html("开始投注时间："+formatDate(match.startTime));
		}
		$("#homeName").html(match.homeName);
		$("#awayName").html(match.awayName);
		var letCount = match.concedeNum;
		if(letCount > 0){
			letCount = "+"+letCount;
		}
		$("#letCount").html(letCount);
		//支持率
		var sum=match.winBetCount+match.drawBetCount+match.lostBetCount;
		if(sum!=0){
			var winRate=(match.winBetCount/sum)*100;
			var drawRate=(match.drawBetCount/sum)*100;
			var lostRate=(match.lostBetCount/sum)*100;
			$("#winRate").html(winRate.toFixed(2)+"%");
			$("#drawRate").html(drawRate.toFixed(2)+"%");
			$("#lostRate").html(lostRate.toFixed(2)+"%");
		}
		var odds = match.odds;
		var oddsId = $("div#odds a");
		var betContent ;
		if(odds != null){
			odds = eval('(' + odds + ')');
			$(oddsId[0]).html("主胜"+(odds.odd3/1000).toFixed(2));
			$(oddsId[1]).html("平"+(odds.odd1/1000).toFixed(2));
			$(oddsId[2]).html("主负"+(odds.odd0/1000).toFixed(2));
			oddsId.click(function(){
				if(this.className != "on"){
					$(this).removeClass().addClass("on");
					$(this).parent().siblings().each(function(){
						$(this).find("a").removeClass();
					});
					betContent = $(this).attr("rel");
				}else{
					$(this).removeClass();
					//没有选择赔率的时候，将betContent置为null
					betContent = null;
				}
			});
		}else{
			$(oddsId[0]).html("主胜");
			$(oddsId[1]).html("平");
			$(oddsId[2]).html("主负");
		}
		if(odds == null && data["t"] < match.endTime && data["t"] > match.startTime){//当前赛事截止，有销售赛事但没有赔率
			$("#betSubmit").removeClass().addClass("ahd_but_gray");
			$("#betSubmit").html("本场已停，请10点再来");
		}else if(odds == null || (data["t"] > match.endTime)){//当前赛事截止，没有待销售赛事
			$("#betSubmit").removeClass().addClass("ahd_but_gray");
			$("#betSubmit").html("本场已停，请10点再来");
		}else if(data["t"] < match.startTime){//当前赛事截止，有销售赛事，但是还没到投注时间
			$("#betSubmit").removeClass().addClass("ahd_but_gray");
			$("#betSubmit").html("本场已停，请10点再来");
		}else {
			$("#betSubmit").removeClass().addClass("ahd_but_big");
		}

	$("#betSubmit").unbind("click").click(function(){
		var multitimes = $("#allmutil").val();
		if(this.className == "ahd_but_gray"){
			//showTipsWindown('', 'worn',300,200);
			//$("#windown-content p[name=message]").html("暂无可投注比赛！");
			return ;
		}else{
			var flg = 0;
			if(betContent == null){
				//showTipsWindown('', 'worn',300,200);
				showTipsWindown('', 'worn',417,527);
				$("#windown-content p[name=message]").html("还没有选择奖金哦~");
				return ;
			}else{
				var submsg = "";
				/*if(user.accountBalance<100){
					submsg = '对不起，您当前账户剩余积分不足100，无法参加虚拟投注，请明日继续努力赚取积分吧';
					showTipsWindown('', 'worn',300,200);
					$("#windown-content p[name=message]").html(submsg);
					return;
				}*/
				if(multitimes*2>user.accountBalance.toFixed(2)){
					submsg = '对不起，积分不足!';
					//showTipsWindown('', 'worn',300,200);
					showTipsWindown('', 'worn',417,527);
					$("#windown-content p[name=message]").html(submsg);
					return;
				}
				if(user.betCountToday < tzcs){
					var datas = "matchId="+match.id+"&userId="+user.id+"&mobile="+user.mobile+"&betContent="+betContent+"&multitimes="+multitimes;
					var r=betSubmit(datas);
					if(r=='ok'){
						submsg = '恭喜你，提交成功!';
					}else{
						submsg = r;
					}
					//showTipsWindown('', 'worn',300,200);
					showTipsWindown('', 'worn',417,527);
					$("#windown-content p[name=message]").html(submsg);
				}else if(user.betCountToday >= tzcs){
					submsg = '您当日的投注机会已经用完，请明日继续~';
					/*if(flg == 0){
						submsg = '做的好！今日已完成'+tzcs+'次投注，别忘了明日继续参加哦';
						flg = 1;
					}else{
						submsg = '对不起，您当日的投注机会已经用完，请明日继续';
					}*/
					//showTipsWindown('', 'worn',300,200);
					showTipsWindown('', 'worn',417,527);
					$("#windown-content p[name=message]").html(submsg);
				}
			}
		}
		$("#windown-content a").click(function(){
			closeWindow();
			window.location = getPath() + "/htmlwx/mychallenge.html";
		});
	});
};
//我的挑战--提交投注
 function betSubmit(datas){
	 var res="出错了";
	 $.ajax({
		    async:false,
			type : "post",
			url : getPath() + '/web/betsubmit.do',
			data : datas,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				res=data.r;
			}
	});
	return res;
 };
 //学习园地
 function studyGarden(){
	 $.ajax({
			type : "post",
			url : getPath() + '/web/studygarden.do',
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				studyGardenCallback(data);
			},
			error : function(xhr, status) {

			}
		});
 };
 function studyGardenCallback(dt){
	 var classType = {"0":"k_kuan","1":"k_zhai","2":"k_zhai","3":"k_kuan","4":"k_kuan","5":"k_zhai","6":"k_zhai","7":"k_kuan"};
	 var studys = dt["r"];
		if(studys != null){
			var studyDiv = '';
			if(studys.length%2==0){//模块是偶数
				for ( var i = 0; i < studys.length; i++) {
					studyDiv += '<a onmousedown="changeAddClass(this);" ontouchstart="changeAddClass(this);" ontouchend="changeNoClass(this);" onmouseup="changeNoClass(this);" title="'+studys[i].logoUrl2+";"+studys[i].url+";"+studys[i].logoUrl+'" class="'+classType[i]+'"><img src="'+studys[i].logoUrl+'"><br/>'+studys[i].name+'</a>';
				}
			}else{//模块是单数，自动补充一个'敬请期待模块'
				for ( var i = 0; i < studys.length; i++) {
					studyDiv += '<a onmousedown="changeAddClass(this);" ontouchstart="changeAddClass(this);" ontouchend="changeNoClass(this);" onmouseup="changeNoClass(this);" title="'+studys[i].logoUrl2+";"+studys[i].url+";"+studys[i].logoUrl+'" class="'+classType[i]+'"><img src="'+studys[i].logoUrl+'"><br/>'+studys[i].name+'</a>';
				}	
				 var classNoType = {"0":"k_kuan icon_no","1":"k_zhai icon_no","2":"k_zhai icon_no","3":"k_kuan icon_no","4":"k_kuan icon_no","5":"k_zhai icon_no","6":"k_zhai icon_no","7":"k_kuan icon_no"};
					studyDiv += '<a class="'+classNoType[studys.length+1]+'"><img src="../images/s_icon_n.png"><br/>敬请期待</a>';
			}
			$("#studygarden").html(studyDiv);
		}
 };
 function changeAddClass(e){
	 var target = e;
	 var title = e.title;
	 var logourl = title.split(";")[0];
	 var className = e.className;
	 $(target).removeClass().addClass(className+" on");
	 $(target).find("img").attr('src', logourl);
	 $(target).on('mousedown touchstart',function(e){
		 touchstart(target);
	 });
	 $(target).on('mouseup mousemove touchend touchmove',function(e){
		 changeNoClass(target);
	 });
 };
 function touchstart(e) {
     var target = e;
	 var title = e.title;
	 var logourl = title.split(";")[0];
	 var className = e.className;
	 $(target).removeClass().addClass(className+" on");
	 $(target).find("img").attr('src', logourl);
	}
 function changeNoClass(e){
	 var target = e;
	 var title = e.title;
	 var  url = title.split(";")[1];
	 var logourl =  title.split(";")[2];
	 var className = e.className;
	 className =  className.substr(0,6);
	 $(target).removeClass().addClass(className);
	 $(target).find("img").attr('src', logourl);
	 target.href = url;
 }
 
//历史排名
 function historyranking(startIdx){
	 var issue = $("#issue").val();
	 var day = $("#day").val();
	 $.ajax({
			type : "post",
			url : getPath() + '/web/ranking.do',
			data : 'startIdx=' + startIdx+'&issue='+issue+'&day='+day,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				rankingCallback(data);
			}
		});
 };
//排名
 function ranking(startIdx){
	 $.ajax({
			type : "post",
			url : getPath() + '/web/ranking.do',
			data : 'startIdx=' + startIdx,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				rankingCallback(data);
			}
		});
 };
 function rankingCallback(dt){
	 if(dt){
		 $("#inteRanking").html(dt["i"]?dt["i"]:'--');
		 var tr, td, i;
			var tbody = document.getElementById("res");
			while (tbody.rows.length > 0) {
				tbody.removeChild(tbody.firstChild);
			}
			/*if (dt == null || !(dt["r"] instanceof Array) || dt["r"].length < 1) {
				drawPages(0, "ranking", 0);
				tr = tbody.insertRow(tbody.rows.length);
				td = tr.insertCell(tr.cells.length);
				td.colSpan = 8;
				td.innerHTML = noRecord;
				tr.style.height = "200px";
			} else {
				if(dt["c"]>300){
					dt["c"] = 300;
				}
				drawPages(dt["c"], "ranking", dt["s"]);*/
				var data = dt["r"];
				if(data!=null && data.length>0){
					$('#rankTime').val(data?formatDateNoTime(data[0].statTime-86400000):'');
					//dt["i"]?dt["i"]:'--'
					//$('#rankTime').val(formatDateNoTime(data[0].statTime));
					for (i = 0; i < data.length; i++) {
						if (data[i] != null) {
							tr = tbody.insertRow(tbody.rows.length);
							td = tr.insertCell(tr.cells.length);
							td.innerHTML = (dt["s"]+(i+1));
							td = tr.insertCell(tr.cells.length);
							td.innerHTML = data[i].mobile.substr(0,3)+"****"+data[i].mobile.substr(7);
							td = tr.insertCell(tr.cells.length);
							td.innerHTML = (data[i].integration).toFixed(2);
						}
					}	
				}
	 }
 };
//活动记录
 function getHdRecord(){
	var oid=getCookie("token");
	if(!oid){
		window.location = getPath() + "/htmlwx/hdbegin.html";
		return;
	}
	 $.ajax({
		type : "post",
		url : getPath() + '/web/hdrecord.do',
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			getHdRecordCallback(data);
		}
	});
 };
 
 function getHdRecordCallback(data){
	 var awardRanking = data["r"];
	 $("#awardRanking").html("全国排名："+awardRanking);
	 orderlist = data["m"];
	 var orderStr = "";
	 var betResult = {"0":"主负","1":"平","3":"主胜"};
	 var guessResult = {"0":"猜胜负","1":"得分","2":"三分球","3":"篮板","4":"助攻"};//竞猜的三个选项
	 
	 for ( var i = 0; i < orderlist.length; i++) {
		 data = orderlist[i][1];
		 orderStr += '<div class="duihuan_product_detail_n">';
		 for ( var j = 0; j < data.length; j++) {
		 if(data[j].betTime>1438876799000){//暂时显示是2015/8/7以后的订单
		 //猜胜负游戏
		 if(data[j].type=="0"){
			 orderStr +='<p>'+formatDate(data[j].betTime)+'</p><p>'+data[j].aliasNum+'</p><p><b class="col_orange2">'
			 +data[j].awayName+'</b>&nbsp;&nbsp;VS <b class="col_orange2">'+data[j].homeName+'</b>';
			 
			 if(data[j].state=="2"||data[j].betAward > 0){
				 orderStr +='<span><b class="col_orange2">+1</b></span>'; 
			 }else if(data[j].state=="1"){
				 orderStr +='<span>未中奖</span>'; 
			 }else{
				 orderStr +='<span>未开奖</span>'; 
			 }
			 orderStr +='</p><p><b class="col_orange2">投注：</b>';
				 if(data[j].betAward > 0){
					 if(data[j].concedeNum!=null && data[j].concedeNum != 0){
						 orderStr += '让球('+data[j].concedeNum+')&nbsp;'+betResult[data[j].betContent];
					 }else{
						 orderStr +=  betResult[data[j].betContent];
					 }
				 }else{
					 if(data[j].concedeNum!=null && data[j].concedeNum != 0 ){
						 orderStr += '让球('+data[j].concedeNum+')&nbsp;'+betResult[data[j].betContent];
					 }else{
						 orderStr += betResult[data[j].betContent];
					 }
				 }
				 orderStr +='</p>'; 
		 		}
		 	}
		 }
		 for ( var j = 0; j < data.length; j++) {//其他游戏
			 if(data[j].type!="0"){
			 orderStr +='<p><img src="../images/line.jpg" width="50%"></p>';//中间横线
			 var option;
			 if(data[j].betContent=="1"){
				 option=data[j].option1;
			 }else if(data[j].betContent=="2"){
				 option=data[j].option2;
			 }else{
				 option=data[j].option3;
			 }
			 orderStr +='<p><b class="col_orange2">球员：</b>'+data[j].homeName+'</p><p><b class="col_orange2">类型：</b>'+guessResult[data[j].type];
			 if(data[j].state=="2"||data[j].betAward > 0){
				 orderStr +='<span><b class="col_orange2">+1</b></span>'; 
			 }else if(data[j].state=="1"){
				 orderStr +='<span>未中奖</span>'; 
			 }else{
				 orderStr +='<span>未开奖</span>'; 
			 }
			 orderStr +='<span></p><p><b class="col_orange2">投注：</b>'+option+'</p>';  
		 }
		 	}
		 orderStr +='</div>';
		 } 
	 		$("#orders").html(orderStr); 	
 };
 
 
 function getHdRecordCallback1(data){
	 var awardRanking = data["r"];
	 $("#awardRanking").html("全国排名："+awardRanking);
	 data = data["m"];
	 var orderStr = "";
	 var betResult = {"0":"主负","1":"平","3":"主胜"};
	 var guessResult = {"0":"猜胜负","1":"得分","2":"三分球","3":"篮板","4":"助攻"};//竞猜的三个选项
	 
	 for ( var i = 0; i < data.length; i++) {
		 if(data[i].betTime>1438876799000){//暂时显示是2015/8/7以后的订单
		 orderStr += '<div class="zj_list"><span class="zj_left f_l">';
		 if(data[i].state=="2"||data[i].betAward > 0){
			 orderStr +='<i class="i_01 col_red">+'+data[i].betAward+'</i><i class="i_02"><img src="../images/icon05.png" width="37" height="36"></i>'; 
		 }else if(data[i].state=="1"){
			 orderStr +='<i class="i_01 col_red">未中奖</i><i class="i_02"><img src="../images/icon06.png" width="37" height="36"></i>'; 
		 }else{
			 orderStr += '<i class="i_01">未开奖</i><i class="i_02"><img src="../images/icon04.png" width="37" height="36"></i>';
		 }
		 orderStr +='</span><span class="zj_right f_l">';
		 
			 orderStr +=formatDate(data[i].betTime)+'<br/>'+data[i].aliasNum+'<br/>'+data[i].homeName+'VS '+data[i].awayName+'<br/>';
			 orderStr += '投注：';
			 if(data[i].betAward > 0){
				 orderStr += '<font class="col_red">';
				 if(data[i].concedeNum!=null && data[i].concedeNum != 0){
					 orderStr += '让球('+data[i].concedeNum+')&nbsp;'+betResult[data[i].betContent] +'</font>';
				 }else{
					 orderStr +=  betResult[data[i].betContent] +'</font>';
				 }
			 }else{
				 if(data[i].concedeNum!=null && data[i].concedeNum != 0 ){
					 orderStr += '让球('+data[i].concedeNum+')&nbsp;'+betResult[data[i].betContent];
				 }else{
					 orderStr += betResult[data[i].betContent];
				 }
			 }
			 var aa=100;
			 if(data[i].betTime>betChangeTime){
				aa=2;
			 }
			 orderStr +='<br/>倍数：'+data[i].multitimes+'倍<br/>消耗：'+aa*(data[i].multitimes)+'积分'; 
			 var option;
			 if(data[i].betContent=="0"){
				 option=data[i].option1;
			 }else if(data[i].betContent=="1"){
				 option=data[i].option2;
			 }else{
				 option=data[i].option3;
			 }
			 orderStr +='<br/>'+'球员：'+data[i].homeName+'<br/>'+'类型：'+guessResult[data[i].type]+'<br/>投注： '+option+'<br/>';
		 orderStr += '</span></div><div class="blue_line"></div>';
	 	}
	}
    $("#orders").html(orderStr); 	
	 
 };
 
 //兑换界面查询
 function getChangeTicket(){
	 $.ajax({
	 		type : "post",
	 		url : getPath() + '/web/getChangeTicket.do',
	 		dataType : "json",
	 		contentType : "application/x-www-form-urlencoded; charset=utf-8",
	 		success : function(data) {
	 			ChangeTicketCallBack(data);
	 		}
	 	}); 
 }
 //兑换界面回调
 function ChangeTicketCallBack(dt){
	 var changelist = dt["r"];
	 var ticketCount = dt["t"];//当前兑换劵
	 var time = dt["ti"];//当前时间
	 $("#ticketcount").html(ticketCount); 
	 var changeStr="";
	 for(var i=0;i<changelist.length;i++){
		 changeStr+='<div class="duihuan_product"><img width="192px" height="223px" class="product" src="'+downloadPath+changelist[i].logo+'"><br/><br/><p><b>奖品名称：</b>'
		 +'<b id="name'+changelist[i].id+'">'+changelist[i].name+'</b></p><p><b>商品编号：'+changelist[i].activityNum+'</b></p><p><b>奖品数量：</b>'
		 +changelist[i].raffleNum+'/'+changelist[i].totalNum+'</p><p><b>消耗兑换券：</b><b id="param'+changelist[i].id+'">'+changelist[i].param1+'</b>张</p>';
		 if(time>changelist[i].startTime && time<changelist[i].endTime){
			 changeStr+='<p><a id="activityid'+changelist[i].id+'" class="zc_btn">兑换</a></p>';
		 }else{
			 changeStr+='<p><a class="zc_btn1">已结束</a></p>';
		 }
		 changeStr+='</div>';
	 }
	 
	  $("#orders").html(changeStr); 
	  
	  //点击兑换,需要什么参数就传什么参数
	  $("a[id^=activityid]").unbind("click").click(function(){
		  var activityid = $(this).attr("id").substring(10);
		  $("#activityid").val(activityid);
		  var name = $("#name"+activityid).html();
		  var param = $("#param"+activityid).html();
		  showTipsWindown('', 'alert',417,527);
			$("#windown-content p[name=message]").html("您选择兑换"+name+"，将消耗兑换劵"+param+"张");
			// var datas = "activityid=" + activityid;
				//var r = toChange(datas);
		 });
	
 }
 
 //点击兑换
 function toChange(){
	 var activityid = $("#activityid").val();
 	 $.ajax({
 		    async:false,
 			type : "post",
 			url : getPath() + '/web/toChange.do',
 			data :  'activityid=' + activityid,
 			dataType : "json",
 			contentType : "application/x-www-form-urlencoded; charset=utf-8",
 			success : function(data) {
 				if(data&&data["r"]=="ok"){
 					showTipsWindown('', 'worn',417,527);
 					$("#windown-content p[name=message]").html("兑换成功,若您兑换的为实物奖品，请及时填写领奖信息，并发送身份证正反面照片！");
 					//window.location = getPath() + "/htmlwx/changeticket.html";
 				}else{
 					showTipsWindown('', 'worn',417,527);
 					$("#windown-content p[name=message]").html(data["r"]);
 				}
 				
 			}
 	});
 };
 
 //奖品兑换详情
 function getChangeTicketDetail(){
	 $.ajax({
	 		type : "post",
	 		url : getPath() + '/web/getChangeTicketDetail.do',
	 		dataType : "json",
	 		contentType : "application/x-www-form-urlencoded; charset=utf-8",
	 		success : function(data) {
	 			getChangeTicketDetailCallBack(data);
	 		}
	 	}); 
 }
 //奖品兑换详情回调
 function getChangeTicketDetailCallBack(data){
	 	var tr, td, i;
	 	var tbody = document.getElementById("res");
	 	while (tbody.rows.length > 0) {
	 		tbody.removeChild(tbody.firstChild);
	 	}
	 	var dt = data["r"];
	 	if(dt){
	 		for (i = 0; i < dt.length; i++) {
	 			if (dt[i] != null) {
	 				//if(dt[i].createTime>1439308799000){//之前的纪录不要了，暂时从8月12号开始
	 				tr = tbody.insertRow(tbody.rows.length);
	 				tr.style.height="1px";
	 				tr.className="duihuan_box_detail";
	 				td = tr.insertCell(tr.cells.length);
	 				td.setAttribute("colspan", 2);
	 				//td.innerHTML = "<div class=''></div>";
	 				tr = tbody.insertRow(tbody.rows.length);
	 				td = tr.insertCell(tr.cells.length);
	 				td.className="pad-lf";
	 				td.width="35%";
	 				var time = formatDate(dt[i].raffleTime).split(" ");
	 				td.innerHTML = time[0]+'<br>'+time[1];
	 				td = tr.insertCell(tr.cells.length);
	 				td.width="65%";
	 				var name="<b class='col_orange2'>奖品名称：</b>"+dt[i].name+"<br><b class='col_orange2'>消耗兑换劵：</b>"+dt[i].param1+"张";
	 					if(dt[i].code && dt[i].status==2){
	 						name+="<br><b class='col_orange2'>奖品卡密：</b>"+dt[i].code;
	 					}else{
	 						name+="<br>";
	 					}
	 				td.innerHTML = name;
	 			  //}
	 			}
	 		}
	 	}
 }
 
//中奖记录
 function getCjRecord(){
 	$.ajax({
 		type : "post",
 		url : getPath() + '/web/getCjRecord.do',
 		dataType : "json",
 		contentType : "application/x-www-form-urlencoded; charset=utf-8",
 		success : function(data) {
 			CjRecordCallBack(data);
 		}
 	});
 };

//抽奖记录回调
 function CjRecordCallBack(data){
 	var tr, td, i;
 	var tbody = document.getElementById("res");
 	while (tbody.rows.length > 0) {
 		tbody.removeChild(tbody.firstChild);
 	}
 	var dt = data["r"];
 	if(dt.indexOf("请重新登录") > -1){
 		window.location = getPath() + "/htmlwx/question2login.html";
 	}
 	if(dt){
 		for (i = 0; i < dt.length; i++) {
 			if (dt[i] != null) {
 				if(dt[i].raffleTime>1477379460000){//之前的纪录不要了，暂时从8月12号开始
 					tr = tbody.insertRow(tbody.rows.length);
 	 				td = tr.insertCell(tr.cells.length);
 	 				td.width="228";
 	 				td.innerHTML = formatDate(dt[i].raffleTime).split(" ")[0].replace(/\-/g,".");
 	 				td = tr.insertCell(tr.cells.length);
 	 				td.width="156";
 	 				var name="";
 	 				if(dt[i].name&&dt[i].worth){
 	 					//name=dt[i].name+dt[i].worth+"元";
 	 					name=dt[i].name;
 	 				}else{
 	 					name="六等奖";
 	 				}
 	 				td.innerHTML = name;
 	 				td = tr.insertCell(tr.cells.length);
 	 				td.width="260";
 	 				if(dt[i].name&&dt[i].worth){
 	 					if(dt[i].num){
 	 						td.innerHTML = "兑换码："+dt[i].num;
 	 					}else{
 	 						td.innerHTML = "发奖中";
 	 					}
 	 				}else{
 	 					td.innerHTML = "50积分";
 	 				}
 				}
 			}
 		}
 	}
 }
// //中奖记录回调
// function CjRecordCallBack(data){
// 	var tr, td, i;
// 	var tbody = document.getElementById("res");
// 	while (tbody.rows.length > 0) {
// 		tbody.removeChild(tbody.firstChild);
// 	}
// 	var dt = data["r"];
// 	if(dt){
// 		for (i = 0; i < dt.length; i++) {
// 			if (dt[i] != null) {
// 				if(dt[i].raffleTime>1439308799000){//之前的纪录不要了，暂时从8月12号开始
// 				tr = tbody.insertRow(tbody.rows.length);
// 				tr.className = "hh_line";
// 				tr.style.height="1px";
// 				td = tr.insertCell(tr.cells.length);
// 				td.setAttribute("colspan", 2);
// 				td.innerHTML = "<div class='vv'></div>";
// 				tr = tbody.insertRow(tbody.rows.length);
// 				td = tr.insertCell(tr.cells.length);
// 				td.className="pad-lf";
// 				td.width="35%";
// 				var time = formatDate(dt[i].createTime).split(" ");
// 				td.innerHTML = time[0]+'<br>'+time[1];
// 				td = tr.insertCell(tr.cells.length);
// 				td.width="65%";
// 				var name="";
// 				if(dt[i].award){
// 					name="奖品名称："+dt[i].award;
// 					if(dt[i].code){
// 						name+="<br>兑换码："+dt[i].code;
// 					}else{
// 						name+="<br>兑换码：--";
// 					}
// 				}else{
// 					name="奖品名称：未中奖<br>兑换码：--";
// 				}
// 				td.innerHTML = name;
// 			  }
// 			}
// 		}
// 	}
// }
 /**最新活动相关js结束**/
 //积分详情
function integralDetail(){
	var oid=getCookie("token");
	if(!oid){
		window.location = getPath() + "/htmlwx/denglu.html";
		return;
	}
	var request,flag="", srchString = location.search.substring(1,location.search.length);
	if (srchString.length > 0) {
		request = parseParam(srchString);
		flag=request["flag"];
	}else{
		alert("查询失败");
		return;
	}
	var type=$("#type").val();
	$.ajax({
		type : "GET",
		url : getPath() + '/web/integralDetail.do?type='+type,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			integralDetailCallback(data["res"],flag);
		}
	});
}
function integralDetailCallback(dt,flag){
	var content="";
	if(dt&&flag){
		for(var i=0;i<dt.length;i++){
			if(flag=="1"&&dt[i].transAmount>0){
				content+='<div class="team_name Ma_con">流水号：'+dt[i].id+'<br />'+
				'交易类型：'+transType[dt[i].transType]+'<br/>收入：'+(dt[i].transAmount).toFixed(2)+'<br />'+
				'余额：'+(dt[i].accountBalance).toFixed(2)+'<br />交易时间: '+formatDate(dt[i].transTime);
				if(dt[i].remark){
					content+='<br/>备注：'+dt[i].remark+'<br /></div>';
				}else{
					content+='<br/>备注：<br /></div>';
				}
			}else if(flag=="2"&&dt[i].transAmount<0){
				content+='<div class="team_name Ma_con">流水号：'+dt[i].id+'<br />'+
				'交易类型：'+transType[dt[i].transType]+'<br/>支出：'+(dt[i].transAmount).toFixed(2)+'<br />'+
				'余额：'+(dt[i].accountBalance).toFixed(2)+'<br />交易时间: '+formatDate(dt[i].transTime);
				if(dt[i].remark){
					content+='<br/>备注：'+dt[i].remark+'<br /></div>';
				}else{
					content+='<br/>备注：<br /></div>';
				}
			}
		}
	}else{
		alert("查询失败");
	}
	$("#res").html(content);
}
function Change(type){
	$("#type").val(type);
	for(var i=1;i<4;i++){
		$("#con_"+i).removeClass("on");
	}
	 $("#con_"+type).addClass("on");
	 integralDetail();
}

//用户注册发送手机验证码
function getCodeData(){
//	$.ajax({
//		url : $n.ilsp.page.getPath()+ '/util/codeWait.htm',
//		cache : false,
//		dataType : "json",
//		success : function(data) {
			$("#codeAlive").html(10);//短信验证码在几分钟内有效
			$("#codeWait").html(60);//短信验证码在60秒内没有收到可以重新获取
//		}
//	});
};
//注册发送验证码
function sendSms(){
	var mobile = $("#mobile").val();
	var reqUrl = document.location.href;
	var openId = "";
	if(reqUrl.split("?").length > 0){
		openId = reqUrl.split("?")[1];
	}
//	ospenId = 'oGYn6ji1ZlSn4ayX1GOcj_KHpV7U';
//	setCookie('openId',openId);
	if(checkMobile()){
		$.ajax({
			type : "post",
			url : getPath() + '/web/sendSms.do',
			data : "mobile="+mobile+"&openId="+openId,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				if(data.s==true){
					$("#mobileErrMsg").html("发送成功！");
					if(data.r != null && data.r.split("#")>0){
						$("#mobileErrMsg").html("距上次发送时间未超过60s,请稍后再试！");
						countdown(data.split("#")[1]);
					}
				}else{
					$("#mobileErrMsg").html(data.r);
					return ;
				}
				var d=new Date().getTime();
				setCookie('smsDownLoad','new');
				var codeWait=document.getElementById('codeWait').innerHTML;
				countdown(codeWait);
			},
			error : function(xhr, status) {

			}
		});
	}
	
};
function countdown(i){
	$("#counta").show().siblings("a").hide();
	$("#smsSend")[0].onclick=null;
	$("#smsSend").css("background","#d5d5d5");
	if (i<1) {
		delCookie('smsDownLoad');
		$("#counta").hide().siblings("a").show();
		$("#smsSend")[0].onclick=function(){sendSms();};
		$("#smsSend").css("background","#ea4545");
		return ;
	}
	$("#time").html(i);
	i--;
	id_of_timeout = setTimeout(function(){countdown(i)},1000);
};
//用户注册绑定
function register(){
	var mobile = $("#mobile").val();
	var mobileCode = $("#mobileCode").val();
	var password = $("#password").val();
	if($('#mobileErrMsg').html() != ""){
		return ;
	}
	if(password=="请输入登录密码"){
		$('#mobileErrMsg').html("请输入登录密码");
		return ;
	}
	if(!$("#xieyi")[0].checked){
		$('#mobileErrMsg').html("请阅读并同意订阅号服务协议！");
		return ;
		
	}
	var datas = "mobile=" + mobile + "&mobileCode=" + mobileCode + "&password=" + password;
	$.ajax({
		type : "post",
		url : getPath() + '/web/register.do',
		data : datas,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			if(data.r != null){
				$("#mobileErrMsg").html(data.r);
				return;
			}
			if(Number(data) > 0){
				//window.location = getPath() + "/htmlwx/regsuccess.html";
//				showTipsWindown('', 'worn',417,527);
//				$("#windown-content p[name=message]").html("注册成功");
				
				/*alert("注册成功");
				window.location = getPath() + "/htmlwx/mychallenge.html?flag=first";*/
				alert("注册成功");
				window.location = getPath() + "/htmlwx/hd_dati.html";
				
				//自动跳出指引页面
				//window.location = getPath() + "/htmlwx/zhiyin.html";
			}else{
				$("#mobileErrMsg").html(data+"小于0");
				return;
			}
		}
	});
};

function getRedbag(){
	var request, srchString = location.search.substring(1,
			location.search.length);
	if (srchString.length > 0) {
		request = parseParam(srchString);
		//var id=request["o"];
		var u=request["u"];
		var f=request["f"];
		var a=request["a"];
		//var t=request["t"];
		if( u && f && a){
			$.ajax({
				type : "post",
				url : getPath() + '/web/redbag.do',
				data : "&f="+f+"&a="+a+"&u="+u,
				dataType : "json",
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				success : function(data) {
					if(data.r != null && data.r!="fail" && data.r!="ill"){
						location.href=getPath() +"/web/barcodehtm.do?c="+data.r;
					}else if(data.r != null && data.r==="ill"){
						alert("抢红包次数过多");
					}
					else{
						if(f.indexOf("SC")){
							alert("太可惜了你没有抽中，下次再来吧！");
						}else if (f.indexOf("SX")){
							alert("红包已抢完，明天要早来哦~");
						}else{
							alert("红包已抢完!");
						}

					}
				}
			});
		}else{
			alert("红包已抢完~");
		}
	}else{
		alert("红包已抢完~");
	}	
}
