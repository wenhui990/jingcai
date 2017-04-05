$(function(){
	// 表单验证
	$("#defaultForm").validate({
	    rules: {
	    	phone:{
	    		required: true,
		        maxlength: 11,
		        minlength: 11,
		        digits:true
	    	},
	      password: {
	        required: true,
	        minlength: 6,
	        rangelength:[6,18]
	      },
	      repassword: {
	        required: true,
	        minlength: 6,
	        rangelength:[6,18],
	        equalTo: "#password"
	      },
	      phone_code: {
	      	required: true,
	      	maxlength: 6,
	      	minlength: 6,
	      	digits: true
	      },
	      agree: "required"
	    },
	    messages: {
	    	phone:{
	    		required: "请输入手机号码",
	        	minlength: "请使用真实手机号作为账户名"
	    	},
	        password: {
		        required: "请输入密码",
		        minlength: "密码需要6-18个字符，数字、英文字母，区分大小写"
	        },
	        repassword: {
		        required: "请输入密码",
		        minlength: "密码需要6-18个字符，数字、英文字母，区分大小写",
		        equalTo: "两次密码输入不一致"
	        },
	        phone_code: {
	        	required: "请输入验证码",
	        	minlength: "只能输入6位数字，不可输入其他字符串"
	        }
	    }
	});
	
	var num = 60,timer;
	// 获取验证码
	$(document).on('click','.phone_code_btn',function(e){
		e.stopPropagation();
		$(this).hide();
		$(".phone_code_btn_num").show();
		
		timer = setInterval(function(){
			--num;
			console.log(num)
			if (num<=0) {
				$('.phone_code_btn').show();
				$(".phone_code_btn_num").hide();
				clearInterval(timer);
				num=60;
			}
			$(".phone_code_btn_num").find('span').text(num);
		},1000);
	});
	
});
