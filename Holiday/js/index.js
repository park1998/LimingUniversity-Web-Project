window.onload=function(){
				var div1=document.getElementById('imgdiv');
				var aUl=document.getElementById('imgul');
				var aLi=aUl.getElementsByTagName('li');
				var left=document.getElementById('left');
				var right=document.getElementById('right');
				var speed=4;
				
				aUl.innerHTML=aUl.innerHTML+aUl.innerHTML;
				aUl.style.width=aLi[0].offsetWidth*aLi.length+'px';
				
				function move(){
					if(aUl.offsetLeft<-aUl.offsetWidth/2) //往左
					{
						aUl.style.left='-40px';
					}
					if(aUl.offsetLeft>-40)   //往右
					{
					    aUl.style.left=-aUl.offsetWidth/2+'px';
					}
					aUl.style.left=aUl.offsetLeft-6+speed+'px';  //+右  -左
			    }
				
				var timer= setInterval(move,30);	
				
			    div1.onmouseover=function(){
			    	clearTimeout(timer);
			    }
			    div1.onmouseout=function(){
			    	timer=setInterval(move,30);
			    }
			    left.onclick=function(){
			    	speed=2;
			    }
			    right.onclick=function(){
			    	speed=10;
			    }
			}