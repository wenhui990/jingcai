$(function(){
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
	    }
	});
});
