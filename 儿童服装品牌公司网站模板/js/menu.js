// JavaScript Document
//文档加载完毕之后执行
$(function(){
		var leng=$('.yifu ul li').length; //li的个数
	//alert(leng)
	var ulW=177*leng; //ul的宽度值
	var i=0; //i代表移动840的倍数
	//alert(ulW)
	//设置ul的宽度
	$('.yifu ul').css({'width':ulW+'px'});//变量不能放在引号里面 此处的加号起连接作用
	var timer;
	function autoMove(){
		timer=setInterval(function(){
			//i++;
			//if(i*840>=ulW){
				//i=0;	
			//}
			$('.yifu ul').animate({marginLeft:'-177px'},function(){
				$(this).css({'margin-left':'0'}).find('li:first').appendTo('.yifu ul');	
			});	
		},3000)	
	}
	autoMove();
	//鼠标放到slide上面停止滑动，移开继续滑动
	$('.mainr-chc').hover(function(){
		clearInterval(timer);
	},function(){
		autoMove();
	})
	//点击下一张
	$('.riget').click(function(){
		$('.yifu ul').animate({marginLeft:'-177px'},function(){
				$(this).css({'margin-left':'0'}).find('li:first').appendTo('.yifu ul');	
			});	
	})
	//点击上一组
	$('.lefi').click(function(){
		$('.yifu  ul').css({'margin-left':'-177px'}).find('li:last').prependTo('.yifu  ul');
		$('.yifu  ul').animate({marginLeft:'0'});
	})
	
	//文本框特效开始
	//文本框获得焦点
	$('#txt').focus(function(){
		var txt=$(this).val();
		if(txt=='产品搜索'){
			//设置文本框的value值为空
			$(this).val(''); //清空的前提是value值为默认值	
		}
		
	})
	//文本框失去焦点
	$('#txt').blur(function(){
		//获取当前文本框的value值
		var txt=$(this).val();
		//alert(keyWord)
		if(txt==""){
			//设置文本框的value值为默认值
			$(this).val('产品搜索'); //恢复默认值的前提是value里面为空	
		}
		
	})
	
	
	$('#banner>ul>li:gt(0)').hide();
	var n=0;
	var len=$('#banner>ul>li').length; //获取li的个数
	var t;
	function play(){
		//alert(n)
		$('#banner ul li').eq(n).show().siblings().hide();
		//给当前a增加on样式 兄弟的a移除样式on
		$('#main-c a').eq(n).addClass('bg').siblings().removeClass('bg');
	}
	function autoPlay(){
		//图片自动轮播
		t=setInterval(function(){
			//alert(1)	
			n++;
			if(n>=len){
				n=0;
			}
			play();
		},3000)	
	}
	//alert(len)
	autoPlay();
	//鼠标放到banner上停止播放，移开继续播放
	$('#banner,#main-c').hover(function(){
		clearInterval(t);
	},function(){
		autoPlay();
	})
	
	//点击数字显示相应的图片
	$('#main-c  a').each(function(index) {
        //alert(index)
		$(this).click(function(){
			//alert(index)	
			//alert(n)
			n=index;
			play();
		})
    });
   
  
   
   $("#mave").focus(function(){
	var name=$(this).val();
	  if(name=="NAME :"){
	$(this).val("");  
	   }
	   })
	 $("#mave").blur(function(){
		 var name=$(this).val();
		 if(name==""){
			 $(this).val("NAME :");
			 
			 }
		 
		 }) 
		 
		 
		 
		  $(".b-gy").focus(function(){
	var name=$(this).val();
	  if(name=="TEL :"){
	$(this).val("");  
	   }
	   })
	 $(".b-gy").blur(function(){
		 var name=$(this).val();
		 if(name==""){
			 $(this).val("TEL :");
			 
			 }
		 
		 })  
		 
		 
		 
		   $(".biao").focus(function(){
	var name=$(this).val();
	  if(name=="地址ADD :"){
	$(this).val("");  
	   }
	   })
	 $(".biao").blur(function(){
		 var name=$(this).val();
		 if(name==""){
			 $(this).val("地址ADD :");
			 
			 }
		 
		 })  
		 
		 	   $(".wenben").focus(function(){
				   $(".fo").children("p").hide();
				   })
	
	 $(".wenben").blur(function(){
		 var fo=$(this).val()
		 if(fo==""){
			
			  $(".fo").children("p").show();
			 }
		 
		 }) 
})
