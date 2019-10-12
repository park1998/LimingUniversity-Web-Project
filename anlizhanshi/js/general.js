/*
 * jQuery history plugin
 * 
 * sample page: http://www.mikage.to/jquery/jquery_history.html
 *
 * Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modified by Lincoln Cooper to add Safari support and only call the callback once during initialization
 * for msie when no initial hash supplied.
 */
jQuery.extend({historyCurrentHash:undefined,historyCallback:undefined,historyIframeSrc:undefined,historyInit:function(callback,src){jQuery.historyCallback=callback;if(src)jQuery.historyIframeSrc=src;var current_hash=location.hash.replace(/\?.*$/,'');jQuery.historyCurrentHash=current_hash;if(jQuery.browser.msie){if(jQuery.historyCurrentHash==''){jQuery.historyCurrentHash='#'}jQuery("body").prepend('<iframe id="jQuery_history" style="display: none;"'+(jQuery.historyIframeSrc?' src="'+jQuery.historyIframeSrc+'"':'')+'></iframe>');var ihistory=jQuery("#jQuery_history")[0];var iframe=ihistory.contentWindow.document;iframe.open();iframe.close();iframe.location.hash=current_hash}else if(jQuery.browser.safari){jQuery.historyBackStack=[];jQuery.historyBackStack.length=history.length;jQuery.historyForwardStack=[];jQuery.lastHistoryLength=history.length;jQuery.isFirst=true}if(current_hash)jQuery.historyCallback(current_hash.replace(/^#/,''));setInterval(jQuery.historyCheck,100)},historyAddHistory:function(hash){jQuery.historyBackStack.push(hash);jQuery.historyForwardStack.length=0;this.isFirst=true},historyCheck:function(){if(jQuery.browser.msie){var ihistory=jQuery("#jQuery_history")[0];var iframe=ihistory.contentDocument||ihistory.contentWindow.document;var current_hash=iframe.location.hash.replace(/\?.*$/,'');if(current_hash!=jQuery.historyCurrentHash){location.hash=current_hash;jQuery.historyCurrentHash=current_hash;jQuery.historyCallback(current_hash.replace(/^#/,''))}}else if(jQuery.browser.safari){if(jQuery.lastHistoryLength==history.length&&jQuery.historyBackStack.length>jQuery.lastHistoryLength){jQuery.historyBackStack.shift()}if(!jQuery.dontCheck){var historyDelta=history.length-jQuery.historyBackStack.length;jQuery.lastHistoryLength=history.length;if(historyDelta){jQuery.isFirst=false;if(historyDelta<0){for(var i=0;i<Math.abs(historyDelta);i++)jQuery.historyForwardStack.unshift(jQuery.historyBackStack.pop())}else{for(var i=0;i<historyDelta;i++)jQuery.historyBackStack.push(jQuery.historyForwardStack.shift())}var cachedHash=jQuery.historyBackStack[jQuery.historyBackStack.length-1];if(cachedHash!=undefined){jQuery.historyCurrentHash=location.hash.replace(/\?.*$/,'');jQuery.historyCallback(cachedHash)}}else if(jQuery.historyBackStack[jQuery.historyBackStack.length-1]==undefined&&!jQuery.isFirst){if(location.hash){var current_hash=location.hash;jQuery.historyCallback(location.hash.replace(/^#/,''))}else{var current_hash='';jQuery.historyCallback('')}jQuery.isFirst=true}}}else{var current_hash=location.hash.replace(/\?.*$/,'');if(current_hash!=jQuery.historyCurrentHash){jQuery.historyCurrentHash=current_hash;jQuery.historyCallback(current_hash.replace(/^#/,''))}}},historyLoad:function(hash){var newhash;hash=decodeURIComponent(hash.replace(/\?.*$/,''));if(jQuery.browser.safari){newhash=hash}else{newhash='#'+hash;location.hash=newhash}jQuery.historyCurrentHash=newhash;if(jQuery.browser.msie){var ihistory=jQuery("#jQuery_history")[0];var iframe=ihistory.contentWindow.document;iframe.open();iframe.close();iframe.location.hash=newhash;jQuery.lastHistoryLength=history.length;jQuery.historyCallback(hash)}else if(jQuery.browser.safari){jQuery.dontCheck=true;this.historyAddHistory(hash);var fn=function(){jQuery.dontCheck=false};window.setTimeout(fn,200);jQuery.historyCallback(hash);location.hash=newhash}else{jQuery.historyCallback(hash)}}});

/**
 * jQuery Galleriffic plugin
 *
 * Copyright (c) 2008 Trent Foley (http://trentacular.com)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Much thanks to primary contributer Ponticlaro (http://www.ponticlaro.com)
 */
;(function($){var allImages={};var imageCounter=0;$.galleriffic={version:'2.0.1',normalizeHash:function(hash){return hash.replace(/^.*#/,'').replace(/\?.*$/,'')},getImage:function(hash){if(!hash)return undefined;hash=$.galleriffic.normalizeHash(hash);return allImages[hash]},gotoImage:function(hash){var imageData=$.galleriffic.getImage(hash);if(!imageData)return false;var gallery=imageData.gallery;gallery.gotoImage(imageData);return true},removeImageByHash:function(hash,ownerGallery){var imageData=$.galleriffic.getImage(hash);if(!imageData)return false;var gallery=imageData.gallery;if(ownerGallery&&ownerGallery!=gallery)return false;return gallery.removeImageByIndex(imageData.index)}};var defaults={delay:3000,numThumbs:20,preloadAhead:40,enableTopPager:false,enableBottomPager:true,maxPagesToShow:7,imageContainerSel:'',captionContainerSel:'',controlsContainerSel:'',loadingContainerSel:'',renderSSControls:true,renderNavControls:true,playLinkText:'Play',pauseLinkText:'Pause',prevLinkText:'Previous',nextLinkText:'Next',nextPageLinkText:'Next &rsaquo;',prevPageLinkText:'&lsaquo; Prev',enableHistory:false,enableKeyboardNavigation:true,autoStart:false,syncTransitions:false,defaultTransitionDuration:1000,onSlideChange:undefined,onTransitionOut:undefined,onTransitionIn:undefined,onPageTransitionOut:undefined,onPageTransitionIn:undefined,onImageAdded:undefined,onImageRemoved:undefined};$.fn.galleriffic=function(settings){$.extend(this,{version:$.galleriffic.version,isSlideshowRunning:false,slideshowTimeout:undefined,clickHandler:function(e,link){this.pause();if(!this.enableHistory){var hash=$.galleriffic.normalizeHash($(link).attr('href'));$.galleriffic.gotoImage(hash);e.preventDefault()}},appendImage:function(listItem){this.addImage(listItem,false,false);return this},insertImage:function(listItem,position){this.addImage(listItem,false,true,position);return this},addImage:function(listItem,thumbExists,insert,position){var $li=(typeof listItem==="string")?$(listItem):listItem;var $aThumb=$li.find('a.thumb');var slideUrl=$aThumb.attr('href');var title=$aThumb.attr('title');var $caption=$li.find('.caption').remove();var hash=$aThumb.attr('name');imageCounter++;if(!hash||allImages[''+hash]){hash=imageCounter}if(!insert)position=this.data.length;var imageData={title:title,slideUrl:slideUrl,caption:$caption,hash:hash,gallery:this,index:position};if(insert){this.data.splice(position,0,imageData);this.updateIndices(position)}else{this.data.push(imageData)}var gallery=this;if(!thumbExists){this.updateThumbs(function(){var $thumbsUl=gallery.find('ul.thumbs');if(insert)$thumbsUl.children(':eq('+position+')').before($li);else $thumbsUl.append($li);if(gallery.onImageAdded)gallery.onImageAdded(imageData,$li)})}allImages[''+hash]=imageData;$aThumb.attr('rel','history').attr('href','#'+hash).removeAttr('name').click(function(e){gallery.clickHandler(e,this)});return this},removeImageByIndex:function(index){if(index<0||index>=this.data.length)return false;var imageData=this.data[index];if(!imageData)return false;this.removeImage(imageData);return true},removeImageByHash:function(hash){return $.galleriffic.removeImageByHash(hash,this)},removeImage:function(imageData){var index=imageData.index;this.data.splice(index,1);delete allImages[''+imageData.hash];this.updateThumbs(function(){var $li=gallery.find('ul.thumbs').children(':eq('+index+')').remove();if(gallery.onImageRemoved)gallery.onImageRemoved(imageData,$li)});this.updateIndices(index);return this},updateIndices:function(startIndex){for(i=startIndex;i<this.data.length;i++){this.data[i].index=i}return this},initializeThumbs:function(){this.data=[];var gallery=this;this.find('ul.thumbs > li').each(function(i){gallery.addImage($(this),true,false)});return this},isPreloadComplete:false,preloadInit:function(){if(this.preloadAhead==0)return this;this.preloadStartIndex=this.currentImage.index;var nextIndex=this.getNextIndex(this.preloadStartIndex);return this.preloadRecursive(this.preloadStartIndex,nextIndex)},preloadRelocate:function(index){this.preloadStartIndex=index;return this},preloadRecursive:function(startIndex,currentIndex){if(startIndex!=this.preloadStartIndex){var nextIndex=this.getNextIndex(this.preloadStartIndex);return this.preloadRecursive(this.preloadStartIndex,nextIndex)}var gallery=this;var preloadCount=currentIndex-startIndex;if(preloadCount<0)preloadCount=this.data.length-1-startIndex+currentIndex;if(this.preloadAhead>=0&&preloadCount>this.preloadAhead){setTimeout(function(){gallery.preloadRecursive(startIndex,currentIndex)},500);return this}var imageData=this.data[currentIndex];if(!imageData)return this;if(imageData.image)return this.preloadNext(startIndex,currentIndex);var image=new Image();image.onload=function(){imageData.image=this;gallery.preloadNext(startIndex,currentIndex)};image.alt=imageData.title;image.src=imageData.slideUrl;return this},preloadNext:function(startIndex,currentIndex){var nextIndex=this.getNextIndex(currentIndex);if(nextIndex==startIndex){this.isPreloadComplete=true}else{var gallery=this;setTimeout(function(){gallery.preloadRecursive(startIndex,nextIndex)},100)}return this},getNextIndex:function(index){var nextIndex=index+1;if(nextIndex>=this.data.length)nextIndex=0;return nextIndex},getPrevIndex:function(index){var prevIndex=index-1;if(prevIndex<0)prevIndex=this.data.length-1;return prevIndex},pause:function(){this.isSlideshowRunning=false;if(this.slideshowTimeout){clearTimeout(this.slideshowTimeout);this.slideshowTimeout=undefined}if(this.$controlsContainer){this.$controlsContainer.find('div.ss-controls a').removeClass().addClass('play').attr('title',this.playLinkText).attr('href','#play').html(this.playLinkText)}return this},play:function(){this.isSlideshowRunning=true;if(this.$controlsContainer){this.$controlsContainer.find('div.ss-controls a').removeClass().addClass('pause').attr('title',this.pauseLinkText).attr('href','#pause').html(this.pauseLinkText)}if(!this.slideshowTimeout){var gallery=this;this.slideshowTimeout=setTimeout(function(){gallery.ssAdvance()},this.delay)}return this},toggleSlideshow:function(){if(this.isSlideshowRunning)this.pause();else this.play();return this},ssAdvance:function(){if(this.isSlideshowRunning)this.next(true);return this},next:function(dontPause,bypassHistory){this.gotoIndex(this.getNextIndex(this.currentImage.index),dontPause,bypassHistory);return this},previous:function(dontPause,bypassHistory){this.gotoIndex(this.getPrevIndex(this.currentImage.index),dontPause,bypassHistory);return this},nextPage:function(dontPause,bypassHistory){var page=this.getCurrentPage();var lastPage=this.getNumPages()-1;if(page<lastPage){var startIndex=page*this.numThumbs;var nextPage=startIndex+this.numThumbs;this.gotoIndex(nextPage,dontPause,bypassHistory)}return this},previousPage:function(dontPause,bypassHistory){var page=this.getCurrentPage();if(page>0){var startIndex=page*this.numThumbs;var prevPage=startIndex-this.numThumbs;this.gotoIndex(prevPage,dontPause,bypassHistory)}return this},gotoIndex:function(index,dontPause,bypassHistory){if(!dontPause)this.pause();if(index<0)index=0;else if(index>=this.data.length)index=this.data.length-1;var imageData=this.data[index];if(!bypassHistory&&this.enableHistory)$.historyLoad(String(imageData.hash));else this.gotoImage(imageData);return this},gotoImage:function(imageData){var index=imageData.index;if(this.onSlideChange)this.onSlideChange(this.currentImage.index,index);this.currentImage=imageData;this.preloadRelocate(index);this.refresh();return this},getDefaultTransitionDuration:function(isSync){if(isSync)return this.defaultTransitionDuration;return this.defaultTransitionDuration/2},refresh:function(){var imageData=this.currentImage;if(!imageData)return this;var index=imageData.index;if(this.$controlsContainer){this.$controlsContainer.find('div.nav-controls a.prev').attr('href','#'+this.data[this.getPrevIndex(index)].hash).end().find('div.nav-controls a.next').attr('href','#'+this.data[this.getNextIndex(index)].hash)}var previousSlide=this.$imageContainer.find('span.current').addClass('previous').removeClass('current');var previousCaption=0;if(this.$captionContainer){previousCaption=this.$captionContainer.find('span.current').addClass('previous').removeClass('current')}var isSync=this.syncTransitions&&imageData.image;var isTransitioning=true;var gallery=this;var transitionOutCallback=function(){isTransitioning=false;previousSlide.remove();if(previousCaption)previousCaption.remove();if(!isSync){if(imageData.image&&imageData.hash==gallery.data[gallery.currentImage.index].hash){gallery.buildImage(imageData,isSync)}else{if(gallery.$loadingContainer){gallery.$loadingContainer.show()}}}};if(previousSlide.length==0){transitionOutCallback()}else{if(this.onTransitionOut){this.onTransitionOut(previousSlide,previousCaption,isSync,transitionOutCallback)}else{previousSlide.fadeTo(this.getDefaultTransitionDuration(isSync),0.0,transitionOutCallback);if(previousCaption)previousCaption.fadeTo(this.getDefaultTransitionDuration(isSync),0.0)}}if(isSync)this.buildImage(imageData,isSync);if(!imageData.image){var image=new Image();image.onload=function(){imageData.image=this;if(!isTransitioning&&imageData.hash==gallery.data[gallery.currentImage.index].hash){gallery.buildImage(imageData,isSync)}};image.alt=imageData.title;image.src=imageData.slideUrl}this.relocatePreload=true;return this.syncThumbs()},buildImage:function(imageData,isSync){var gallery=this;var nextIndex=this.getNextIndex(imageData.index);var newSlide=this.$imageContainer.append('<span class="image-wrapper current"><a class="advance-link" rel="history" href="#'+this.data[nextIndex].hash+'" title="'+imageData.title+'">&nbsp;</a></span>').find('span.current').css('opacity','0');newSlide.find('a').append(imageData.image).click(function(e){gallery.clickHandler(e,this)});var newCaption=0;if(this.$captionContainer){newCaption=this.$captionContainer.append('<span class="image-caption current"></span>').find('span.current').css('opacity','0').append(imageData.caption)}if(this.$loadingContainer){this.$loadingContainer.hide()}if(this.onTransitionIn){this.onTransitionIn(newSlide,newCaption,isSync)}else{newSlide.fadeTo(this.getDefaultTransitionDuration(isSync),1.0);if(newCaption)newCaption.fadeTo(this.getDefaultTransitionDuration(isSync),1.0)}if(this.isSlideshowRunning){if(this.slideshowTimeout)clearTimeout(this.slideshowTimeout);this.slideshowTimeout=setTimeout(function(){gallery.ssAdvance()},this.delay)}return this},getCurrentPage:function(){return Math.floor(this.currentImage.index/this.numThumbs)},syncThumbs:function(){var page=this.getCurrentPage();if(page!=this.displayedPage)this.updateThumbs();var $thumbs=this.find('ul.thumbs').children();$thumbs.filter('.selected').removeClass('selected');$thumbs.eq(this.currentImage.index).addClass('selected');return this},updateThumbs:function(postTransitionOutHandler){var gallery=this;var transitionOutCallback=function(){if(postTransitionOutHandler)postTransitionOutHandler();gallery.rebuildThumbs();if(gallery.onPageTransitionIn)gallery.onPageTransitionIn();else gallery.show()};if(this.onPageTransitionOut){this.onPageTransitionOut(transitionOutCallback)}else{this.hide();transitionOutCallback()}return this},rebuildThumbs:function(){var needsPagination=this.data.length>this.numThumbs;if(this.enableTopPager){var $topPager=this.find('div.top');if($topPager.length==0)$topPager=this.prepend('<div class="top pagination"></div>').find('div.top');else $topPager.empty();if(needsPagination)this.buildPager($topPager)}if(this.enableBottomPager){var $bottomPager=this.find('div.bottom');if($bottomPager.length==0)$bottomPager=this.append('<div class="bottom pagination"></div>').find('div.bottom');else $bottomPager.empty();if(needsPagination)this.buildPager($bottomPager)}var page=this.getCurrentPage();var startIndex=page*this.numThumbs;var stopIndex=startIndex+this.numThumbs-1;if(stopIndex>=this.data.length)stopIndex=this.data.length-1;var $thumbsUl=this.find('ul.thumbs');$thumbsUl.find('li').each(function(i){var $li=$(this);if(i>=startIndex&&i<=stopIndex){$li.show()}else{$li.hide()}});this.displayedPage=page;$thumbsUl.removeClass('noscript');return this},getNumPages:function(){return Math.ceil(this.data.length/this.numThumbs)},buildPager:function(pager){var gallery=this;var numPages=this.getNumPages();var page=this.getCurrentPage();var startIndex=page*this.numThumbs;var pagesRemaining=this.maxPagesToShow-1;var pageNum=page-Math.floor((this.maxPagesToShow-1)/2)+1;if(pageNum>0){var remainingPageCount=numPages-pageNum;if(remainingPageCount<pagesRemaining){pageNum=pageNum-(pagesRemaining-remainingPageCount)}}if(pageNum<0){pageNum=0}if(page>0){var prevPage=startIndex-this.numThumbs;pager.append('<a rel="history" href="#'+this.data[prevPage].hash+'" title="'+this.prevPageLinkText+'">'+this.prevPageLinkText+'</a>')}if(pageNum>0){this.buildPageLink(pager,0,numPages);if(pageNum>1)pager.append('<span class="ellipsis">&hellip;</span>');pagesRemaining--}while(pagesRemaining>0){this.buildPageLink(pager,pageNum,numPages);pagesRemaining--;pageNum++}if(pageNum<numPages){var lastPageNum=numPages-1;if(pageNum<lastPageNum)pager.append('<span class="ellipsis">&hellip;</span>');this.buildPageLink(pager,lastPageNum,numPages)}var nextPage=startIndex+this.numThumbs;if(nextPage<this.data.length){pager.append('<a rel="history" href="#'+this.data[nextPage].hash+'" title="'+this.nextPageLinkText+'">'+this.nextPageLinkText+'</a>')}pager.find('a').click(function(e){gallery.clickHandler(e,this)});return this},buildPageLink:function(pager,pageNum,numPages){var pageLabel=pageNum+1;var currentPage=this.getCurrentPage();if(pageNum==currentPage)pager.append('<span class="current">'+pageLabel+'</span>');else if(pageNum<numPages){var imageIndex=pageNum*this.numThumbs;pager.append('<a rel="history" href="#'+this.data[imageIndex].hash+'" title="'+pageLabel+'">'+pageLabel+'</a>')}return this}});$.extend(this,defaults,settings);if(this.enableHistory&&!$.historyInit)this.enableHistory=false;if(this.imageContainerSel)this.$imageContainer=$(this.imageContainerSel);if(this.captionContainerSel)this.$captionContainer=$(this.captionContainerSel);if(this.loadingContainerSel)this.$loadingContainer=$(this.loadingContainerSel);this.initializeThumbs();if(this.maxPagesToShow<3)this.maxPagesToShow=3;this.displayedPage=-1;this.currentImage=this.data[0];var gallery=this;if(this.$loadingContainer)this.$loadingContainer.hide();if(this.controlsContainerSel){this.$controlsContainer=$(this.controlsContainerSel).empty();if(this.renderSSControls){if(this.autoStart){this.$controlsContainer.append('<div class="ss-controls"><a href="#pause" class="pause" title="'+this.pauseLinkText+'">'+this.pauseLinkText+'</a></div>')}else{this.$controlsContainer.append('<div class="ss-controls"><a href="#play" class="play" title="'+this.playLinkText+'">'+this.playLinkText+'</a></div>')}this.$controlsContainer.find('div.ss-controls a').click(function(e){gallery.toggleSlideshow();e.preventDefault();return false})}if(this.renderNavControls){this.$controlsContainer.append('<div class="nav-controls"><a class="prev" rel="history" title="'+this.prevLinkText+'">'+this.prevLinkText+'</a><a class="next" rel="history" title="'+this.nextLinkText+'">'+this.nextLinkText+'</a></div>').find('div.nav-controls a').click(function(e){gallery.clickHandler(e,this)})}}var initFirstImage=!this.enableHistory||!location.hash;if(this.enableHistory&&location.hash){var hash=$.galleriffic.normalizeHash(location.hash);var imageData=allImages[hash];if(!imageData)initFirstImage=true}if(initFirstImage)this.gotoIndex(0,false,true);if(this.autoStart)this.play();setTimeout(function(){gallery.preloadInit()},1000);return this}})(jQuery);

/**
 * jQuery Opacity Rollover plugin
 *
 * Copyright (c) 2009 Trent Foley (http://trentacular.com)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
;(function($){var defaults={mouseOutOpacity:0.67,mouseOverOpacity:1.0,fadeSpeed:'fast',exemptionSelector:'.selected'};$.fn.opacityrollover=function(settings){$.extend(this,defaults,settings);var config=this;function fadeTo(element,opacity){var $target=$(element);if(config.exemptionSelector)$target=$target.not(config.exemptionSelector);$target.fadeTo(config.fadeSpeed,opacity)}this.css('opacity',this.mouseOutOpacity).hover(function(){fadeTo(this,config.mouseOverOpacity)},function(){fadeTo(this,config.mouseOutOpacity)});return this}})(jQuery);

/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 * Version: 3.0.4
 * Requires: 1.2.2+
 */
(function($){var types=['DOMMouseScroll','mousewheel'];$.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var i=types.length;i;){this.addEventListener(types[--i],handler,false)}}else{this.onmousewheel=handler}},teardown:function(){if(this.removeEventListener){for(var i=types.length;i;){this.removeEventListener(types[--i],handler,false)}}else{this.onmousewheel=null}}};$.fn.extend({mousewheel:function(fn){return fn?this.bind("mousewheel",fn):this.trigger("mousewheel")},unmousewheel:function(fn){return this.unbind("mousewheel",fn)}});function handler(event){var orgEvent=event||window.event,args=[].slice.call(arguments,1),delta=0,returnValue=true,deltaX=0,deltaY=0;event=$.event.fix(orgEvent);event.type="mousewheel";if(event.wheelDelta){delta=event.wheelDelta/120}if(event.detail){delta=-event.detail/3}deltaY=delta;if(orgEvent.axis!==undefined&&orgEvent.axis===orgEvent.HORIZONTAL_AXIS){deltaY=0;deltaX=-1*delta}if(orgEvent.wheelDeltaY!==undefined){deltaY=orgEvent.wheelDeltaY/120}if(orgEvent.wheelDeltaX!==undefined){deltaX=-1*orgEvent.wheelDeltaX/120}args.unshift(event,delta,deltaX,deltaY);return $.event.handle.apply(this,args)}})(jQuery);

/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 * 
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 * 
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;(function(b){var m,t,u,f,D,j,E,n,z,A,q=0,e={},o=[],p=0,d={},l=[],G=null,v=new Image,J=/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i,W=/[^\.]\.(swf)\s*$/i,K,L=1,y=0,s="",r,i,h=false,B=b.extend(b("<div/>")[0],{prop:0}),M=b.browser.msie&&b.browser.version<7&&!window.XMLHttpRequest,N=function(){t.hide();v.onerror=v.onload=null;G&&G.abort();m.empty()},O=function(){if(false===e.onError(o,q,e)){t.hide();h=false}else{e.titleShow=false;e.width="auto";e.height="auto";m.html('<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>');
F()}},I=function(){var a=o[q],c,g,k,C,P,w;N();e=b.extend({},b.fn.fancybox.defaults,typeof b(a).data("fancybox")=="undefined"?e:b(a).data("fancybox"));w=e.onStart(o,q,e);if(w===false)h=false;else{if(typeof w=="object")e=b.extend(e,w);k=e.title||(a.nodeName?b(a).attr("title"):a.title)||"";if(a.nodeName&&!e.orig)e.orig=b(a).children("img:first").length?b(a).children("img:first"):b(a);if(k===""&&e.orig&&e.titleFromAlt)k=e.orig.attr("alt");c=e.href||(a.nodeName?b(a).attr("href"):a.href)||null;if(/^(?:javascript)/i.test(c)||
c=="#")c=null;if(e.type){g=e.type;if(!c)c=e.content}else if(e.content)g="html";else if(c)g=c.match(J)?"image":c.match(W)?"swf":b(a).hasClass("iframe")?"iframe":c.indexOf("#")===0?"inline":"ajax";if(g){if(g=="inline"){a=c.substr(c.indexOf("#"));g=b(a).length>0?"inline":"ajax"}e.type=g;e.href=c;e.title=k;if(e.autoDimensions)if(e.type=="html"||e.type=="inline"||e.type=="ajax"){e.width="auto";e.height="auto"}else e.autoDimensions=false;if(e.modal){e.overlayShow=true;e.hideOnOverlayClick=false;e.hideOnContentClick=
false;e.enableEscapeButton=false;e.showCloseButton=false}e.padding=parseInt(e.padding,10);e.margin=parseInt(e.margin,10);m.css("padding",e.padding+e.margin);b(".fancybox-inline-tmp").unbind("fancybox-cancel").bind("fancybox-change",function(){b(this).replaceWith(j.children())});switch(g){case "html":m.html(e.content);F();break;case "inline":if(b(a).parent().is("#fancybox-content")===true){h=false;break}b('<div class="fancybox-inline-tmp" />').hide().insertBefore(b(a)).bind("fancybox-cleanup",function(){b(this).replaceWith(j.children())}).bind("fancybox-cancel",
function(){b(this).replaceWith(m.children())});b(a).appendTo(m);F();break;case "image":h=false;b.fancybox.showActivity();v=new Image;v.onerror=function(){O()};v.onload=function(){h=true;v.onerror=v.onload=null;e.width=v.width;e.height=v.height;b("<img />").attr({id:"fancybox-img",src:v.src,alt:e.title}).appendTo(m);Q()};v.src=c;break;case "swf":e.scrolling="no";C='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+e.width+'" height="'+e.height+'"><param name="movie" value="'+c+
'"></param>';P="";b.each(e.swf,function(x,H){C+='<param name="'+x+'" value="'+H+'"></param>';P+=" "+x+'="'+H+'"'});C+='<embed src="'+c+'" type="application/x-shockwave-flash" width="'+e.width+'" height="'+e.height+'"'+P+"></embed></object>";m.html(C);F();break;case "ajax":h=false;b.fancybox.showActivity();e.ajax.win=e.ajax.success;G=b.ajax(b.extend({},e.ajax,{url:c,data:e.ajax.data||{},error:function(x){x.status>0&&O()},success:function(x,H,R){if((typeof R=="object"?R:G).status==200){if(typeof e.ajax.win==
"function"){w=e.ajax.win(c,x,H,R);if(w===false){t.hide();return}else if(typeof w=="string"||typeof w=="object")x=w}m.html(x);F()}}}));break;case "iframe":Q()}}else O()}},F=function(){var a=e.width,c=e.height;a=a.toString().indexOf("%")>-1?parseInt((b(window).width()-e.margin*2)*parseFloat(a)/100,10)+"px":a=="auto"?"auto":a+"px";c=c.toString().indexOf("%")>-1?parseInt((b(window).height()-e.margin*2)*parseFloat(c)/100,10)+"px":c=="auto"?"auto":c+"px";m.wrapInner('<div style="width:'+a+";height:"+c+
";overflow: "+(e.scrolling=="auto"?"auto":e.scrolling=="yes"?"scroll":"hidden")+';position:relative;"></div>');e.width=m.width();e.height=m.height();Q()},Q=function(){var a,c;t.hide();if(f.is(":visible")&&false===d.onCleanup(l,p,d)){b.event.trigger("fancybox-cancel");h=false}else{h=true;b(j.add(u)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");f.is(":visible")&&d.titlePosition!=="outside"&&f.css("height",f.height());l=o;p=q;d=e;if(d.overlayShow){u.css({"background-color":d.overlayColor,
opacity:d.overlayOpacity,cursor:d.hideOnOverlayClick?"pointer":"auto",height:b(document).height()});if(!u.is(":visible")){M&&b("select:not(#fancybox-tmp select)").filter(function(){return this.style.visibility!=="hidden"}).css({visibility:"hidden"}).one("fancybox-cleanup",function(){this.style.visibility="inherit"});u.show()}}else u.hide();i=X();s=d.title||"";y=0;n.empty().removeAttr("style").removeClass();if(d.titleShow!==false){if(b.isFunction(d.titleFormat))a=d.titleFormat(s,l,p,d);else a=s&&s.length?
d.titlePosition=="float"?'<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">'+s+'</td><td id="fancybox-title-float-right"></td></tr></table>':'<div id="fancybox-title-'+d.titlePosition+'">'+s+"</div>":false;s=a;if(!(!s||s==="")){n.addClass("fancybox-title-"+d.titlePosition).html(s).appendTo("body").show();switch(d.titlePosition){case "inside":n.css({width:i.width-d.padding*2,marginLeft:d.padding,marginRight:d.padding});
y=n.outerHeight(true);n.appendTo(D);i.height+=y;break;case "over":n.css({marginLeft:d.padding,width:i.width-d.padding*2,bottom:d.padding}).appendTo(D);break;case "float":n.css("left",parseInt((n.width()-i.width-40)/2,10)*-1).appendTo(f);break;default:n.css({width:i.width-d.padding*2,paddingLeft:d.padding,paddingRight:d.padding}).appendTo(f)}}}n.hide();if(f.is(":visible")){b(E.add(z).add(A)).hide();a=f.position();r={top:a.top,left:a.left,width:f.width(),height:f.height()};c=r.width==i.width&&r.height==
i.height;j.fadeTo(d.changeFade,0.3,function(){var g=function(){j.html(m.contents()).fadeTo(d.changeFade,1,S)};b.event.trigger("fancybox-change");j.empty().removeAttr("filter").css({"border-width":d.padding,width:i.width-d.padding*2,height:e.autoDimensions?"auto":i.height-y-d.padding*2});if(c)g();else{B.prop=0;b(B).animate({prop:1},{duration:d.changeSpeed,easing:d.easingChange,step:T,complete:g})}})}else{f.removeAttr("style");j.css("border-width",d.padding);if(d.transitionIn=="elastic"){r=V();j.html(m.contents());
f.show();if(d.opacity)i.opacity=0;B.prop=0;b(B).animate({prop:1},{duration:d.speedIn,easing:d.easingIn,step:T,complete:S})}else{d.titlePosition=="inside"&&y>0&&n.show();j.css({width:i.width-d.padding*2,height:e.autoDimensions?"auto":i.height-y-d.padding*2}).html(m.contents());f.css(i).fadeIn(d.transitionIn=="none"?0:d.speedIn,S)}}}},Y=function(){if(d.enableEscapeButton||d.enableKeyboardNav)b(document).bind("keydown.fb",function(a){if(a.keyCode==27&&d.enableEscapeButton){a.preventDefault();b.fancybox.close()}else if((a.keyCode==
37||a.keyCode==39)&&d.enableKeyboardNav&&a.target.tagName!=="INPUT"&&a.target.tagName!=="TEXTAREA"&&a.target.tagName!=="SELECT"){a.preventDefault();b.fancybox[a.keyCode==37?"prev":"next"]()}});if(d.showNavArrows){if(d.cyclic&&l.length>1||p!==0)z.show();if(d.cyclic&&l.length>1||p!=l.length-1)A.show()}else{z.hide();A.hide()}},S=function(){if(!b.support.opacity){j.get(0).style.removeAttribute("filter");f.get(0).style.removeAttribute("filter")}e.autoDimensions&&j.css("height","auto");f.css("height","auto");
s&&s.length&&n.show();d.showCloseButton&&E.show();Y();d.hideOnContentClick&&j.bind("click",b.fancybox.close);d.hideOnOverlayClick&&u.bind("click",b.fancybox.close);b(window).bind("resize.fb",b.fancybox.resize);d.centerOnScroll&&b(window).bind("scroll.fb",b.fancybox.center);if(d.type=="iframe")b('<iframe id="fancybox-frame" name="fancybox-frame'+(new Date).getTime()+'" frameborder="0" hspace="0" '+(b.browser.msie?'allowtransparency="true""':"")+' scrolling="'+e.scrolling+'" src="'+d.href+'"></iframe>').appendTo(j);
f.show();h=false;b.fancybox.center();d.onComplete(l,p,d);var a,c;if(l.length-1>p){a=l[p+1].href;if(typeof a!=="undefined"&&a.match(J)){c=new Image;c.src=a}}if(p>0){a=l[p-1].href;if(typeof a!=="undefined"&&a.match(J)){c=new Image;c.src=a}}},T=function(a){var c={width:parseInt(r.width+(i.width-r.width)*a,10),height:parseInt(r.height+(i.height-r.height)*a,10),top:parseInt(r.top+(i.top-r.top)*a,10),left:parseInt(r.left+(i.left-r.left)*a,10)};if(typeof i.opacity!=="undefined")c.opacity=a<0.5?0.5:a;f.css(c);
j.css({width:c.width-d.padding*2,height:c.height-y*a-d.padding*2})},U=function(){return[b(window).width()-d.margin*2,b(window).height()-d.margin*2,b(document).scrollLeft()+d.margin,b(document).scrollTop()+d.margin]},X=function(){var a=U(),c={},g=d.autoScale,k=d.padding*2;c.width=d.width.toString().indexOf("%")>-1?parseInt(a[0]*parseFloat(d.width)/100,10):d.width+k;c.height=d.height.toString().indexOf("%")>-1?parseInt(a[1]*parseFloat(d.height)/100,10):d.height+k;if(g&&(c.width>a[0]||c.height>a[1]))if(e.type==
"image"||e.type=="swf"){g=d.width/d.height;if(c.width>a[0]){c.width=a[0];c.height=parseInt((c.width-k)/g+k,10)}if(c.height>a[1]){c.height=a[1];c.width=parseInt((c.height-k)*g+k,10)}}else{c.width=Math.min(c.width,a[0]);c.height=Math.min(c.height,a[1])}c.top=parseInt(Math.max(a[3]-20,a[3]+(a[1]-c.height-40)*0.5),10);c.left=parseInt(Math.max(a[2]-20,a[2]+(a[0]-c.width-40)*0.5),10);return c},V=function(){var a=e.orig?b(e.orig):false,c={};if(a&&a.length){c=a.offset();c.top+=parseInt(a.css("paddingTop"),
10)||0;c.left+=parseInt(a.css("paddingLeft"),10)||0;c.top+=parseInt(a.css("border-top-width"),10)||0;c.left+=parseInt(a.css("border-left-width"),10)||0;c.width=a.width();c.height=a.height();c={width:c.width+d.padding*2,height:c.height+d.padding*2,top:c.top-d.padding-20,left:c.left-d.padding-20}}else{a=U();c={width:d.padding*2,height:d.padding*2,top:parseInt(a[3]+a[1]*0.5,10),left:parseInt(a[2]+a[0]*0.5,10)}}return c},Z=function(){if(t.is(":visible")){b("div",t).css("top",L*-40+"px");L=(L+1)%12}else clearInterval(K)};
b.fn.fancybox=function(a){if(!b(this).length)return this;b(this).data("fancybox",b.extend({},a,b.metadata?b(this).metadata():{})).unbind("click.fb").bind("click.fb",function(c){c.preventDefault();if(!h){h=true;b(this).blur();o=[];q=0;c=b(this).attr("rel")||"";if(!c||c==""||c==="nofollow")o.push(this);else{o=b("a[rel="+c+"], area[rel="+c+"]");q=o.index(this)}I()}});return this};b.fancybox=function(a,c){var g;if(!h){h=true;g=typeof c!=="undefined"?c:{};o=[];q=parseInt(g.index,10)||0;if(b.isArray(a)){for(var k=
0,C=a.length;k<C;k++)if(typeof a[k]=="object")b(a[k]).data("fancybox",b.extend({},g,a[k]));else a[k]=b({}).data("fancybox",b.extend({content:a[k]},g));o=jQuery.merge(o,a)}else{if(typeof a=="object")b(a).data("fancybox",b.extend({},g,a));else a=b({}).data("fancybox",b.extend({content:a},g));o.push(a)}if(q>o.length||q<0)q=0;I()}};b.fancybox.showActivity=function(){clearInterval(K);t.show();K=setInterval(Z,66)};b.fancybox.hideActivity=function(){t.hide()};b.fancybox.next=function(){return b.fancybox.pos(p+
1)};b.fancybox.prev=function(){return b.fancybox.pos(p-1)};b.fancybox.pos=function(a){if(!h){a=parseInt(a);o=l;if(a>-1&&a<l.length){q=a;I()}else if(d.cyclic&&l.length>1){q=a>=l.length?0:l.length-1;I()}}};b.fancybox.cancel=function(){if(!h){h=true;b.event.trigger("fancybox-cancel");N();e.onCancel(o,q,e);h=false}};b.fancybox.close=function(){function a(){u.fadeOut("fast");n.empty().hide();f.hide();b.event.trigger("fancybox-cleanup");j.empty();d.onClosed(l,p,d);l=e=[];p=q=0;d=e={};h=false}if(!(h||f.is(":hidden"))){h=
true;if(d&&false===d.onCleanup(l,p,d))h=false;else{N();b(E.add(z).add(A)).hide();b(j.add(u)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");j.find("iframe").attr("src",M&&/^https/i.test(window.location.href||"")?"javascript:void(false)":"about:blank");d.titlePosition!=="inside"&&n.empty();f.stop();if(d.transitionOut=="elastic"){r=V();var c=f.position();i={top:c.top,left:c.left,width:f.width(),height:f.height()};if(d.opacity)i.opacity=1;n.empty().hide();B.prop=1;
b(B).animate({prop:0},{duration:d.speedOut,easing:d.easingOut,step:T,complete:a})}else f.fadeOut(d.transitionOut=="none"?0:d.speedOut,a)}}};b.fancybox.resize=function(){u.is(":visible")&&u.css("height",b(document).height());b.fancybox.center(true)};b.fancybox.center=function(a){var c,g;if(!h){g=a===true?1:0;c=U();!g&&(f.width()>c[0]||f.height()>c[1])||f.stop().animate({top:parseInt(Math.max(c[3]-20,c[3]+(c[1]-j.height()-40)*0.5-d.padding)),left:parseInt(Math.max(c[2]-20,c[2]+(c[0]-j.width()-40)*0.5-
d.padding))},typeof a=="number"?a:200)}};b.fancybox.init=function(){if(!b("#fancybox-wrap").length){b("body").append(m=b('<div id="fancybox-tmp"></div>'),t=b('<div id="fancybox-loading"><div></div></div>'),u=b('<div id="fancybox-overlay"></div>'),f=b('<div id="fancybox-wrap"></div>'));D=b('<div id="fancybox-outer"></div>').append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>').appendTo(f);
D.append(j=b('<div id="fancybox-content"></div>'),E=b('<a id="fancybox-close"></a>'),n=b('<div id="fancybox-title"></div>'),z=b('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),A=b('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>'));E.click(b.fancybox.close);t.click(b.fancybox.cancel);z.click(function(a){a.preventDefault();b.fancybox.prev()});A.click(function(a){a.preventDefault();b.fancybox.next()});
b.fn.mousewheel&&f.bind("mousewheel.fb",function(a,c){if(h)a.preventDefault();else if(b(a.target).get(0).clientHeight==0||b(a.target).get(0).scrollHeight===b(a.target).get(0).clientHeight){a.preventDefault();b.fancybox[c>0?"prev":"next"]()}});b.support.opacity||f.addClass("fancybox-ie");if(M){t.addClass("fancybox-ie6");f.addClass("fancybox-ie6");b('<iframe id="fancybox-hide-sel-frame" src="'+(/^https/i.test(window.location.href||"")?"javascript:void(false)":"about:blank")+'" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(D)}}};
b.fn.fancybox.defaults={padding:1,margin:40,opacity:false,modal:false,cyclic:false,scrolling:"auto",width:560,height:340,autoScale:true,autoDimensions:true,centerOnScroll:false,ajax:{},swf:{wmode:"transparent"},hideOnOverlayClick:true,hideOnContentClick:false,overlayShow:true,overlayOpacity:0,overlayColor:"#777",titleShow:true,titlePosition:"float",titleFormat:null,titleFromAlt:false,transitionIn:"fade",transitionOut:"fade",speedIn:300,speedOut:300,changeSpeed:300,changeFade:"fast",easingIn:"swing",
easingOut:"swing",showCloseButton:true,showNavArrows:true,enableEscapeButton:true,enableKeyboardNav:true,onStart:function(){},onCancel:function(){},onComplete:function(){},onCleanup:function(){},onClosed:function(){},onError:function(){}};b(document).ready(function(){b.fancybox.init()})})(jQuery);

/*
 * jScrollPane - v2.0.0beta9 - 2011-02-04
 * http://jscrollpane.kelvinluck.com/
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT and GPL licenses.
 */
(function(b,a,c){b.fn.jScrollPane=function(f){function d(D,N){var ay,P=this,X,aj,w,al,S,Y,z,r,az,aE,au,j,I,i,k,Z,T,ap,W,u,B,aq,ae,am,G,m,at,ax,y,av,aH,g,K,ai=true,O=true,aG=false,l=false,ao=D.clone(false,false).empty(),ab=b.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";aH=D.css("paddingTop")+" "+D.css("paddingRight")+" "+D.css("paddingBottom")+" "+D.css("paddingLeft");g=(parseInt(D.css("paddingLeft"),10)||0)+(parseInt(D.css("paddingRight"),10)||0);function ar(aQ){var aO,aP,aK,aM,aL,aJ,aI,aN;ay=aQ;if(X===c){aI=D.scrollTop();aN=D.scrollLeft();D.css({overflow:"hidden",padding:0});aj=D.innerWidth()+g;w=D.innerHeight();D.width(aj);X=b('<div class="jspPane" />').css("padding",aH).append(D.children());al=b('<div class="jspContainer" />').css({width:aj+"px",height:w+"px"}).append(X).appendTo(D)}else{D.css("width","");aJ=D.innerWidth()+g!=aj||D.outerHeight()!=w;if(aJ){aj=D.innerWidth()+g;w=D.innerHeight();al.css({width:aj+"px",height:w+"px"})}if(!aJ&&K==S&&X.outerHeight()==Y){D.width(aj);return}K=S;X.css("width","");D.width(aj);al.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()}aO=X.clone(false,false).css("position","absolute");aP=b('<div style="width:1px; position: relative;" />').append(aO);b("body").append(aP);S=Math.max(X.outerWidth(),aO.outerWidth());aP.remove();Y=X.outerHeight();z=S/aj;r=Y/w;az=r>1;aE=z>1;if(!(aE||az)){D.removeClass("jspScrollable");X.css({top:0,width:al.width()-g});o();E();Q();x();ah()}else{D.addClass("jspScrollable");aK=ay.maintainPosition&&(I||Z);if(aK){aM=aC();aL=aA()}aF();A();F();if(aK){M(aM,false);L(aL,false)}J();af();an();if(ay.enableKeyboardNavigation){R()}if(ay.clickOnTrack){q()}C();if(ay.hijackInternalLinks){n()}}if(ay.autoReinitialise&&!av){av=setInterval(function(){ar(ay)},ay.autoReinitialiseDelay)}else{if(!ay.autoReinitialise&&av){clearInterval(av)}}aI&&D.scrollTop(0)&&L(aI,false);aN&&D.scrollLeft(0)&&M(aN,false);D.trigger("jsp-initialised",[aE||az])}function aF(){if(az){al.append(b('<div class="jspVerticalBar" />').append(b('<div class="jspCap jspCapTop" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragTop" />'),b('<div class="jspDragBottom" />'))),b('<div class="jspCap jspCapBottom" />')));T=al.find(">.jspVerticalBar");ap=T.find(">.jspTrack");au=ap.find(">.jspDrag");if(ay.showArrows){aq=b('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",aD(0,-1)).bind("click.jsp",aB);ae=b('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",aD(0,1)).bind("click.jsp",aB);if(ay.arrowScrollOnHover){aq.bind("mouseover.jsp",aD(0,-1,aq));ae.bind("mouseover.jsp",aD(0,1,ae))}ak(ap,ay.verticalArrowPositions,aq,ae)}u=w;al.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){u-=b(this).outerHeight()});au.hover(function(){au.addClass("jspHover")},function(){au.removeClass("jspHover")}).bind("mousedown.jsp",function(aI){b("html").bind("dragstart.jsp selectstart.jsp",aB);au.addClass("jspActive");var s=aI.pageY-au.position().top;b("html").bind("mousemove.jsp",function(aJ){U(aJ.pageY-s,false)}).bind("mouseup.jsp mouseleave.jsp",aw);return false});p()}}function p(){ap.height(u+"px");I=0;W=ay.verticalGutter+ap.outerWidth();X.width(aj-W-g);if(T.position().left===0){X.css("margin-left",W+"px")}}function A(){if(aE){al.append(b('<div class="jspHorizontalBar" />').append(b('<div class="jspCap jspCapLeft" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragLeft" />'),b('<div class="jspDragRight" />'))),b('<div class="jspCap jspCapRight" />')));am=al.find(">.jspHorizontalBar");G=am.find(">.jspTrack");i=G.find(">.jspDrag");if(ay.showArrows){ax=b('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",aD(-1,0)).bind("click.jsp",aB);y=b('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",aD(1,0)).bind("click.jsp",aB);
if(ay.arrowScrollOnHover){ax.bind("mouseover.jsp",aD(-1,0,ax));y.bind("mouseover.jsp",aD(1,0,y))}ak(G,ay.horizontalArrowPositions,ax,y)}i.hover(function(){i.addClass("jspHover")},function(){i.removeClass("jspHover")}).bind("mousedown.jsp",function(aI){b("html").bind("dragstart.jsp selectstart.jsp",aB);i.addClass("jspActive");var s=aI.pageX-i.position().left;b("html").bind("mousemove.jsp",function(aJ){V(aJ.pageX-s,false)}).bind("mouseup.jsp mouseleave.jsp",aw);return false});m=al.innerWidth();ag()}}function ag(){al.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){m-=b(this).outerWidth()});G.width(m+"px");Z=0}function F(){if(aE&&az){var aI=G.outerHeight(),s=ap.outerWidth();u-=aI;b(am).find(">.jspCap:visible,>.jspArrow").each(function(){m+=b(this).outerWidth()});m-=s;w-=s;aj-=aI;G.parent().append(b('<div class="jspCorner" />').css("width",aI+"px"));p();ag()}if(aE){X.width((al.outerWidth()-g)+"px")}Y=X.outerHeight();r=Y/w;if(aE){at=Math.ceil(1/z*m);if(at>ay.horizontalDragMaxWidth){at=ay.horizontalDragMaxWidth}else{if(at<ay.horizontalDragMinWidth){at=ay.horizontalDragMinWidth}}i.width(at+"px");k=m-at;ad(Z)}if(az){B=Math.ceil(1/r*u);if(B>ay.verticalDragMaxHeight){B=ay.verticalDragMaxHeight}else{if(B<ay.verticalDragMinHeight){B=ay.verticalDragMinHeight}}au.height(B+"px");j=u-B;ac(I)}}function ak(aJ,aL,aI,s){var aN="before",aK="after",aM;if(aL=="os"){aL=/Mac/.test(navigator.platform)?"after":"split"}if(aL==aN){aK=aL}else{if(aL==aK){aN=aL;aM=aI;aI=s;s=aM}}aJ[aN](aI)[aK](s)}function aD(aI,s,aJ){return function(){H(aI,s,this,aJ);this.blur();return false}}function H(aL,aK,aO,aN){aO=b(aO).addClass("jspActive");var aM,aJ,aI=true,s=function(){if(aL!==0){P.scrollByX(aL*ay.arrowButtonSpeed)}if(aK!==0){P.scrollByY(aK*ay.arrowButtonSpeed)}aJ=setTimeout(s,aI?ay.initialDelay:ay.arrowRepeatFreq);aI=false};s();aM=aN?"mouseout.jsp":"mouseup.jsp";aN=aN||b("html");aN.bind(aM,function(){aO.removeClass("jspActive");aJ&&clearTimeout(aJ);aJ=null;aN.unbind(aM)})}function q(){x();if(az){ap.bind("mousedown.jsp",function(aN){if(aN.originalTarget===c||aN.originalTarget==aN.currentTarget){var aL=b(this),aO=aL.offset(),aM=aN.pageY-aO.top-I,aJ,aI=true,s=function(){var aR=aL.offset(),aS=aN.pageY-aR.top-B/2,aP=w*ay.scrollPagePercent,aQ=j*aP/(Y-w);if(aM<0){if(I-aQ>aS){P.scrollByY(-aP)}else{U(aS)}}else{if(aM>0){if(I+aQ<aS){P.scrollByY(aP)}else{U(aS)}}else{aK();return}}aJ=setTimeout(s,aI?ay.initialDelay:ay.trackClickRepeatFreq);aI=false},aK=function(){aJ&&clearTimeout(aJ);aJ=null;b(document).unbind("mouseup.jsp",aK)};s();b(document).bind("mouseup.jsp",aK);return false}})}if(aE){G.bind("mousedown.jsp",function(aN){if(aN.originalTarget===c||aN.originalTarget==aN.currentTarget){var aL=b(this),aO=aL.offset(),aM=aN.pageX-aO.left-Z,aJ,aI=true,s=function(){var aR=aL.offset(),aS=aN.pageX-aR.left-at/2,aP=aj*ay.scrollPagePercent,aQ=k*aP/(S-aj);if(aM<0){if(Z-aQ>aS){P.scrollByX(-aP)}else{V(aS)}}else{if(aM>0){if(Z+aQ<aS){P.scrollByX(aP)}else{V(aS)}}else{aK();return}}aJ=setTimeout(s,aI?ay.initialDelay:ay.trackClickRepeatFreq);aI=false},aK=function(){aJ&&clearTimeout(aJ);aJ=null;b(document).unbind("mouseup.jsp",aK)};s();b(document).bind("mouseup.jsp",aK);return false}})}}function x(){if(G){G.unbind("mousedown.jsp")}if(ap){ap.unbind("mousedown.jsp")}}function aw(){b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");if(au){au.removeClass("jspActive")}if(i){i.removeClass("jspActive")}}function U(s,aI){if(!az){return}if(s<0){s=0}else{if(s>j){s=j}}if(aI===c){aI=ay.animateScroll}if(aI){P.animate(au,"top",s,ac)}else{au.css("top",s);ac(s)}}function ac(aI){if(aI===c){aI=au.position().top}al.scrollTop(0);I=aI;var aL=I===0,aJ=I==j,aK=aI/j,s=-aK*(Y-w);if(ai!=aL||aG!=aJ){ai=aL;aG=aJ;D.trigger("jsp-arrow-change",[ai,aG,O,l])}v(aL,aJ);X.css("top",s);D.trigger("jsp-scroll-y",[-s,aL,aJ]).trigger("scroll")}function V(aI,s){if(!aE){return}if(aI<0){aI=0}else{if(aI>k){aI=k}}if(s===c){s=ay.animateScroll}if(s){P.animate(i,"left",aI,ad)
}else{i.css("left",aI);ad(aI)}}function ad(aI){if(aI===c){aI=i.position().left}al.scrollTop(0);Z=aI;var aL=Z===0,aK=Z==k,aJ=aI/k,s=-aJ*(S-aj);if(O!=aL||l!=aK){O=aL;l=aK;D.trigger("jsp-arrow-change",[ai,aG,O,l])}t(aL,aK);X.css("left",s);D.trigger("jsp-scroll-x",[-s,aL,aK]).trigger("scroll")}function v(aI,s){if(ay.showArrows){aq[aI?"addClass":"removeClass"]("jspDisabled");ae[s?"addClass":"removeClass"]("jspDisabled")}}function t(aI,s){if(ay.showArrows){ax[aI?"addClass":"removeClass"]("jspDisabled");y[s?"addClass":"removeClass"]("jspDisabled")}}function L(s,aI){var aJ=s/(Y-w);U(aJ*j,aI)}function M(aI,s){var aJ=aI/(S-aj);V(aJ*k,s)}function aa(aU,aP,aJ){var aN,aK,aL,s=0,aT=0,aI,aO,aR,aQ,aS;try{aN=b(aU)}catch(aM){return}aK=aN.outerHeight();aL=aN.outerWidth();al.scrollTop(0);al.scrollLeft(0);while(!aN.is(".jspPane")){s+=aN.position().top;aT+=aN.position().left;aN=aN.offsetParent();if(/^body|html$/i.test(aN[0].nodeName)){return}}aI=aA();aO=aI+w;if(s<aI||aP){aQ=s-ay.verticalGutter}else{if(s+aK>aO){aQ=s-w+aK+ay.verticalGutter}}if(aQ){L(aQ,aJ)}viewportLeft=aC();aR=viewportLeft+aj;if(aT<viewportLeft||aP){aS=aT-ay.horizontalGutter}else{if(aT+aL>aR){aS=aT-aj+aL+ay.horizontalGutter}}if(aS){M(aS,aJ)}}function aC(){return -X.position().left}function aA(){return -X.position().top}function af(){al.unbind(ab).bind(ab,function(aL,aM,aK,aI){var aJ=Z,s=I;P.scrollBy(aK*ay.mouseWheelSpeed,-aI*ay.mouseWheelSpeed,false);return aJ==Z&&s==I})}function o(){al.unbind(ab)}function aB(){return false}function J(){X.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(s){aa(s.target,false)})}function E(){X.find(":input,a").unbind("focus.jsp")}function R(){var s,aI;X.focus(function(){D.focus()});D.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(aM){if(aM.target!==this){return}var aL=Z,aK=I;switch(aM.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:s=aM.keyCode;aJ();break;case 35:L(Y-w);s=null;break;case 36:L(0);s=null;break}aI=aM.keyCode==s&&aL!=Z||aK!=I;return !aI}).bind("keypress.jsp",function(aK){if(aK.keyCode==s){aJ()}return !aI});if(ay.hideFocus){D.css("outline","none");if("hideFocus" in al[0]){D.attr("hideFocus",true)}}else{D.css("outline","");if("hideFocus" in al[0]){D.attr("hideFocus",false)}}function aJ(){var aL=Z,aK=I;switch(s){case 40:P.scrollByY(ay.keyboardSpeed,false);break;case 38:P.scrollByY(-ay.keyboardSpeed,false);break;case 34:case 32:P.scrollByY(w*ay.scrollPagePercent,false);break;case 33:P.scrollByY(-w*ay.scrollPagePercent,false);break;case 39:P.scrollByX(ay.keyboardSpeed,false);break;case 37:P.scrollByX(-ay.keyboardSpeed,false);break}aI=aL!=Z||aK!=I;return aI}}function Q(){D.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")}function C(){if(location.hash&&location.hash.length>1){var aJ,aI;try{aJ=b(location.hash)}catch(s){return}if(aJ.length&&X.find(location.hash)){if(al.scrollTop()===0){aI=setInterval(function(){if(al.scrollTop()>0){aa(location.hash,true);b(document).scrollTop(al.position().top);clearInterval(aI)}},50)}else{aa(location.hash,true);b(document).scrollTop(al.position().top)}}}}function ah(){b("a.jspHijack").unbind("click.jsp-hijack").removeClass("jspHijack")}function n(){ah();b("a[href^=#]").addClass("jspHijack").bind("click.jsp-hijack",function(){var s=this.href.split("#"),aI;if(s.length>1){aI=s[1];if(aI.length>0&&X.find("#"+aI).length>0){aa("#"+aI,true);return false}}})}function an(){var aJ,aI,aL,aK,aM,s=false;al.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(aN){var aO=aN.originalEvent.touches[0];aJ=aC();aI=aA();aL=aO.pageX;aK=aO.pageY;aM=false;s=true}).bind("touchmove.jsp",function(aQ){if(!s){return}var aP=aQ.originalEvent.touches[0],aO=Z,aN=I;P.scrollTo(aJ+aL-aP.pageX,aI+aK-aP.pageY);aM=aM||Math.abs(aL-aP.pageX)>5||Math.abs(aK-aP.pageY)>5;return aO==Z&&aN==I}).bind("touchend.jsp",function(aN){s=false}).bind("click.jsp-touchclick",function(aN){if(aM){aM=false;return false}})}function h(){var s=aA(),aI=aC();
D.removeClass("jspScrollable").unbind(".jsp");D.replaceWith(ao.append(X.children()));ao.scrollTop(s);ao.scrollLeft(aI)}b.extend(P,{reinitialise:function(aI){aI=b.extend({},ay,aI);ar(aI)},scrollToElement:function(aJ,aI,s){aa(aJ,aI,s)},scrollTo:function(aJ,s,aI){M(aJ,aI);L(s,aI)},scrollToX:function(aI,s){M(aI,s)},scrollToY:function(s,aI){L(s,aI)},scrollToPercentX:function(aI,s){M(aI*(S-aj),s)},scrollToPercentY:function(aI,s){L(aI*(Y-w),s)},scrollBy:function(aI,s,aJ){P.scrollByX(aI,aJ);P.scrollByY(s,aJ)},scrollByX:function(s,aJ){var aI=aC()+s,aK=aI/(S-aj);V(aK*k,aJ)},scrollByY:function(s,aJ){var aI=aA()+s,aK=aI/(Y-w);U(aK*j,aJ)},positionDragX:function(s,aI){V(s,aI)},positionDragY:function(aI,s){V(aI,s)},animate:function(aI,aL,s,aK){var aJ={};aJ[aL]=s;aI.animate(aJ,{duration:ay.animateDuration,ease:ay.animateEase,queue:false,step:aK})},getContentPositionX:function(){return aC()},getContentPositionY:function(){return aA()},getContentWidth:function(){return S()},getContentHeight:function(){return Y()},getPercentScrolledX:function(){return aC()/(S-aj)},getPercentScrolledY:function(){return aA()/(Y-w)},getIsScrollableH:function(){return aE},getIsScrollableV:function(){return az},getContentPane:function(){return X},scrollToBottom:function(s){U(j,s)},hijackInternalLinks:function(){n()},destroy:function(){h()}});ar(N)}f=b.extend({},b.fn.jScrollPane.defaults,f);b.each(["mouseWheelSpeed","arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){f[this]=f[this]||f.speed});var e;this.each(function(){var g=b(this),h=g.data("jsp");if(h){h.reinitialise(f)}else{h=new d(g,f);g.data("jsp",h)}e=e?e.add(g):g});return e};b.fn.jScrollPane.defaults={showArrows:false,maintainPosition:true,clickOnTrack:true,autoReinitialise:false,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,animateScroll:false,animateDuration:300,animateEase:"linear",hijackInternalLinks:false,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:0,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:false,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:"split",horizontalArrowPositions:"split",enableKeyboardNavigation:true,hideFocus:false,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:0.8}})(jQuery,this);

/*
 * jQuery 2d Transform v0.9.3
 * http://wiki.github.com/heygrady/transform/
 * Copyright 2010, Grady Kuhnline
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * Date: Sat Dec 4 15:46:09 2010 -0800
 */
(function(f,g,j,b){var h=/progid:DXImageTransform\.Microsoft\.Matrix\(.*?\)/,c=/^([\+\-]=)?([\d+.\-]+)(.*)$/,q=/%/;var d=j.createElement("modernizr"),e=d.style;function n(s){return parseFloat(s)}function l(){var s={transformProperty:"",MozTransform:"-moz-",WebkitTransform:"-webkit-",OTransform:"-o-",msTransform:"-ms-"};for(var t in s){if(typeof e[t]!="undefined"){return s[t]}}return null}function r(){if(typeof(g.Modernizr)!=="undefined"){return Modernizr.csstransforms}var t=["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"];for(var s in t){if(e[t[s]]!==b){return true}}}var a=l(),i=a!==null?a+"transform":false,k=a!==null?a+"transform-origin":false;f.support.csstransforms=r();if(a=="-ms-"){i="msTransform";k="msTransformOrigin"}f.extend({transform:function(s){s.transform=this;this.$elem=f(s);this.applyingMatrix=false;this.matrix=null;this.height=null;this.width=null;this.outerHeight=null;this.outerWidth=null;this.boxSizingValue=null;this.boxSizingProperty=null;this.attr=null;this.transformProperty=i;this.transformOriginProperty=k}});f.extend(f.transform,{funcs:["matrix","origin","reflect","reflectX","reflectXY","reflectY","rotate","scale","scaleX","scaleY","skew","skewX","skewY","translate","translateX","translateY"]});f.fn.transform=function(s,t){return this.each(function(){var u=this.transform||new f.transform(this);if(s){u.exec(s,t)}})};f.transform.prototype={exec:function(s,t){t=f.extend(true,{forceMatrix:false,preserve:false},t);this.attr=null;if(t.preserve){s=f.extend(true,this.getAttrs(true,true),s)}else{s=f.extend(true,{},s)}this.setAttrs(s);if(f.support.csstransforms&&!t.forceMatrix){return this.execFuncs(s)}else{if(f.browser.msie||(f.support.csstransforms&&t.forceMatrix)){return this.execMatrix(s)}}return false},execFuncs:function(t){var s=[];for(var u in t){if(u=="origin"){this[u].apply(this,f.isArray(t[u])?t[u]:[t[u]])}else{if(f.inArray(u,f.transform.funcs)!==-1){s.push(this.createTransformFunc(u,t[u]))}}}this.$elem.css(i,s.join(" "));return true},execMatrix:function(z){var C,x,t;var F=this.$elem[0],B=this;function A(N,M){if(q.test(N)){return parseFloat(N)/100*B["safeOuter"+(M?"Height":"Width")]()}return o(F,N)}var s=/translate[X|Y]?/,u=[];for(var v in z){switch(f.type(z[v])){case"array":t=z[v];break;case"string":t=f.map(z[v].split(","),f.trim);break;default:t=[z[v]]}if(f.matrix[v]){if(f.cssAngle[v]){t=f.map(t,f.angle.toDegree)}else{if(!f.cssNumber[v]){t=f.map(t,A)}else{t=f.map(t,n)}}x=f.matrix[v].apply(this,t);if(s.test(v)){u.push(x)}else{C=C?C.x(x):x}}else{if(v=="origin"){this[v].apply(this,t)}}}C=C||f.matrix.identity();f.each(u,function(M,N){C=C.x(N)});var K=parseFloat(C.e(1,1).toFixed(6)),I=parseFloat(C.e(2,1).toFixed(6)),H=parseFloat(C.e(1,2).toFixed(6)),G=parseFloat(C.e(2,2).toFixed(6)),L=C.rows===3?parseFloat(C.e(1,3).toFixed(6)):0,J=C.rows===3?parseFloat(C.e(2,3).toFixed(6)):0;if(f.support.csstransforms&&a==="-moz-"){this.$elem.css(i,"matrix("+K+", "+I+", "+H+", "+G+", "+L+"px, "+J+"px)")}else{if(f.support.csstransforms){this.$elem.css(i,"matrix("+K+", "+I+", "+H+", "+G+", "+L+", "+J+")")}else{if(f.browser.msie){var w=", FilterType='nearest neighbor'";var D=this.$elem[0].style;var E="progid:DXImageTransform.Microsoft.Matrix(M11="+K+", M12="+H+", M21="+I+", M22="+G+", sizingMethod='auto expand'"+w+")";var y=D.filter||f.curCSS(this.$elem[0],"filter")||"";D.filter=h.test(y)?y.replace(h,E):y?y+" "+E:E;this.applyingMatrix=true;this.matrix=C;this.fixPosition(C,L,J);this.applyingMatrix=false;this.matrix=null}}}return true},origin:function(s,t){if(f.support.csstransforms){if(typeof t==="undefined"){this.$elem.css(k,s)}else{this.$elem.css(k,s+" "+t)}return true}switch(s){case"left":s="0";break;case"right":s="100%";break;case"center":case b:s="50%"}switch(t){case"top":t="0";break;case"bottom":t="100%";break;case"center":case b:t="50%"}this.setAttr("origin",[q.test(s)?s:o(this.$elem[0],s)+"px",q.test(t)?t:o(this.$elem[0],t)+"px"]);return true},createTransformFunc:function(t,u){if(t.substr(0,7)==="reflect"){var s=u?f.matrix[t]():f.matrix.identity();return"matrix("+s.e(1,1)+", "+s.e(2,1)+", "+s.e(1,2)+", "+s.e(2,2)+", 0, 0)"}if(t=="matrix"){if(a==="-moz-"){u[4]=u[4]?u[4]+"px":0;u[5]=u[5]?u[5]+"px":0}}return t+"("+(f.isArray(u)?u.join(", "):u)+")"},fixPosition:function(B,y,x,D,s){var w=new f.matrix.calc(B,this.safeOuterHeight(),this.safeOuterWidth()),C=this.getAttr("origin");var v=w.originOffset(new f.matrix.V2(q.test(C[0])?parseFloat(C[0])/100*w.outerWidth:parseFloat(C[0]),q.test(C[1])?parseFloat(C[1])/100*w.outerHeight:parseFloat(C[1])));var t=w.sides();var u=this.$elem.css("position");if(u=="static"){u="relative"}var A={top:0,left:0};var z={position:u,top:(v.top+x+t.top+A.top)+"px",left:(v.left+y+t.left+A.left)+"px",zoom:1};this.$elem.css(z)}};function o(s,u){var t=c.exec(f.trim(u));if(t[3]&&t[3]!=="px"){var w="paddingBottom",v=f.style(s,w);f.style(s,w,u);u=p(s,w);f.style(s,w,v);return u}return parseFloat(u)}function p(t,u){if(t[u]!=null&&(!t.style||t.style[u]==null)){return t[u]}var s=parseFloat(f.css(t,u));return s&&s>-10000?s:0}})(jQuery,this,this.document);(function(d,c,a,f){d.extend(d.transform.prototype,{safeOuterHeight:function(){return this.safeOuterLength("height")},safeOuterWidth:function(){return this.safeOuterLength("width")},safeOuterLength:function(l){var p="outer"+(l=="width"?"Width":"Height");if(!d.support.csstransforms&&d.browser.msie){l=l=="width"?"width":"height";if(this.applyingMatrix&&!this[p]&&this.matrix){var k=new d.matrix.calc(this.matrix,1,1),n=k.offset(),g=this.$elem[p]()/n[l];this[p]=g;return g}else{if(this.applyingMatrix&&this[p]){return this[p]}}var o={height:["top","bottom"],width:["left","right"]};var h=this.$elem[0],j=parseFloat(d.curCSS(h,l,true)),q=this.boxSizingProperty,i=this.boxSizingValue;if(!this.boxSizingProperty){q=this.boxSizingProperty=e()||"box-sizing";i=this.boxSizingValue=this.$elem.css(q)||"content-box"}if(this[p]&&this[l]==j){return this[p]}else{this[l]=j}if(q&&(i=="padding-box"||i=="content-box")){j+=parseFloat(d.curCSS(h,"padding-"+o[l][0],true))||0+parseFloat(d.curCSS(h,"padding-"+o[l][1],true))||0}if(q&&i=="content-box"){j+=parseFloat(d.curCSS(h,"border-"+o[l][0]+"-width",true))||0+parseFloat(d.curCSS(h,"border-"+o[l][1]+"-width",true))||0}this[p]=j;return j}return this.$elem[p]()}});var b=null;function e(){if(b){return b}var h={boxSizing:"box-sizing",MozBoxSizing:"-moz-box-sizing",WebkitBoxSizing:"-webkit-box-sizing",OBoxSizing:"-o-box-sizing"},g=a.body;for(var i in h){if(typeof g.style[i]!="undefined"){b=h[i];return b}}return null}})(jQuery,this,this.document);(function(g,f,b,h){var d=/([\w\-]*?)\((.*?)\)/g,a="data-transform",e=/\s/,c=/,\s?/;g.extend(g.transform.prototype,{setAttrs:function(i){var j="",l;for(var k in i){l=i[k];if(g.isArray(l)){l=l.join(", ")}j+=" "+k+"("+l+")"}this.attr=g.trim(j);this.$elem.attr(a,this.attr)},setAttr:function(k,l){if(g.isArray(l)){l=l.join(", ")}var j=this.attr||this.$elem.attr(a);if(!j||j.indexOf(k)==-1){this.attr=g.trim(j+" "+k+"("+l+")");this.$elem.attr(a,this.attr)}else{var i=[],n;d.lastIndex=0;while(n=d.exec(j)){if(k==n[1]){i.push(k+"("+l+")")}else{i.push(n[0])}}this.attr=i.join(" ");this.$elem.attr(a,this.attr)}},getAttrs:function(){var j=this.attr||this.$elem.attr(a);if(!j){return{}}var i={},l,k;d.lastIndex=0;while((l=d.exec(j))!==null){if(l){k=l[2].split(c);i[l[1]]=k.length==1?k[0]:k}}return i},getAttr:function(j){var i=this.getAttrs();if(typeof i[j]!=="undefined"){return i[j]}if(j==="origin"&&g.support.csstransforms){return this.$elem.css(this.transformOriginProperty).split(e)}else{if(j==="origin"){return["50%","50%"]}}return g.cssDefault[j]||0}});if(typeof(g.cssAngle)=="undefined"){g.cssAngle={}}g.extend(g.cssAngle,{rotate:true,skew:true,skewX:true,skewY:true});if(typeof(g.cssDefault)=="undefined"){g.cssDefault={}}g.extend(g.cssDefault,{scale:[1,1],scaleX:1,scaleY:1,matrix:[1,0,0,1,0,0],origin:["50%","50%"],reflect:[1,0,0,1,0,0],reflectX:[1,0,0,1,0,0],reflectXY:[1,0,0,1,0,0],reflectY:[1,0,0,1,0,0]});if(typeof(g.cssMultipleValues)=="undefined"){g.cssMultipleValues={}}g.extend(g.cssMultipleValues,{matrix:6,origin:{length:2,duplicate:true},reflect:6,reflectX:6,reflectXY:6,reflectY:6,scale:{length:2,duplicate:true},skew:2,translate:2});g.extend(g.cssNumber,{matrix:true,reflect:true,reflectX:true,reflectXY:true,reflectY:true,scale:true,scaleX:true,scaleY:true});g.each(g.transform.funcs,function(j,k){g.cssHooks[k]={set:function(n,o){var l=n.transform||new g.transform(n),i={};i[k]=o;l.exec(i,{preserve:true})},get:function(n,l){var i=n.transform||new g.transform(n);return i.getAttr(k)}}});g.each(["reflect","reflectX","reflectXY","reflectY"],function(j,k){g.cssHooks[k].get=function(n,l){var i=n.transform||new g.transform(n);return i.getAttr("matrix")||g.cssDefault[k]}})})(jQuery,this,this.document);(function(e,g,h,c){var d=/^([+\-]=)?([\d+.\-]+)(.*)$/;var a=e.fn.animate;e.fn.animate=function(p,l,o,n){var k=e.speed(l,o,n),j=e.cssMultipleValues;k.complete=k.old;if(!e.isEmptyObject(p)){if(typeof k.original==="undefined"){k.original={}}e.each(p,function(s,u){if(j[s]||e.cssAngle[s]||(!e.cssNumber[s]&&e.inArray(s,e.transform.funcs)!==-1)){var t=null;if(jQuery.isArray(p[s])){var r=1,q=u.length;if(j[s]){r=(typeof j[s].length==="undefined"?j[s]:j[s].length)}if(q>r||(q<r&&q==2)||(q==2&&r==2&&isNaN(parseFloat(u[q-1])))){t=u[q-1];u.splice(q-1,1)}}k.original[s]=u.toString();p[s]=parseFloat(u)}})}return a.apply(this,[arguments[0],k])};var b="paddingBottom";function i(k,l){if(k[l]!=null&&(!k.style||k.style[l]==null)){}var j=parseFloat(e.css(k,l));return j&&j>-10000?j:0}var f=e.fx.prototype.custom;e.fx.prototype.custom=function(u,v,w){var y=e.cssMultipleValues[this.prop],p=e.cssAngle[this.prop];if(y||(!e.cssNumber[this.prop]&&e.inArray(this.prop,e.transform.funcs)!==-1)){this.values=[];if(!y){y=1}var x=this.options.original[this.prop],t=e(this.elem).css(this.prop),j=e.cssDefault[this.prop]||0;if(!e.isArray(t)){t=[t]}if(!e.isArray(x)){if(e.type(x)==="string"){x=x.split(",")}else{x=[x]}}var l=y.length||y,s=0;while(x.length<l){x.push(y.duplicate?x[0]:j[s]||0);s++}var k,r,q,o=this,n=o.elem.transform;orig=e.style(o.elem,b);e.each(x,function(z,A){if(t[z]){k=t[z]}else{if(j[z]&&!y.duplicate){k=j[z]}else{if(y.duplicate){k=t[0]}else{k=0}}}if(p){k=e.angle.toDegree(k)}else{if(!e.cssNumber[o.prop]){r=d.exec(e.trim(k));if(r[3]&&r[3]!=="px"){if(r[3]==="%"){k=parseFloat(r[2])/100*n["safeOuter"+(z?"Height":"Width")]()}else{e.style(o.elem,b,k);k=i(o.elem,b);e.style(o.elem,b,orig)}}}}k=parseFloat(k);r=d.exec(e.trim(A));if(r){q=parseFloat(r[2]);w=r[3]||"px";if(p){q=e.angle.toDegree(q+w);w="deg"}else{if(!e.cssNumber[o.prop]&&w==="%"){k=(k/n["safeOuter"+(z?"Height":"Width")]())*100}else{if(!e.cssNumber[o.prop]&&w!=="px"){e.style(o.elem,b,(q||1)+w);k=((q||1)/i(o.elem,b))*k;e.style(o.elem,b,orig)}}}if(r[1]){q=((r[1]==="-="?-1:1)*q)+k}}else{q=A;w=""}o.values.push({start:k,end:q,unit:w})})}return f.apply(this,arguments)};e.fx.multipleValueStep={_default:function(j){e.each(j.values,function(k,l){j.values[k].now=l.start+((l.end-l.start)*j.pos)})}};e.each(["matrix","reflect","reflectX","reflectXY","reflectY"],function(j,k){e.fx.multipleValueStep[k]=function(n){var p=n.decomposed,l=e.matrix;m=l.identity();p.now={};e.each(p.start,function(q){p.now[q]=parseFloat(p.start[q])+((parseFloat(p.end[q])-parseFloat(p.start[q]))*n.pos);if(((q==="scaleX"||q==="scaleY")&&p.now[q]===1)||(q!=="scaleX"&&q!=="scaleY"&&p.now[q]===0)){return true}m=m.x(l[q](p.now[q]))});var o;e.each(n.values,function(q){switch(q){case 0:o=parseFloat(m.e(1,1).toFixed(6));break;case 1:o=parseFloat(m.e(2,1).toFixed(6));break;case 2:o=parseFloat(m.e(1,2).toFixed(6));break;case 3:o=parseFloat(m.e(2,2).toFixed(6));break;case 4:o=parseFloat(m.e(1,3).toFixed(6));break;case 5:o=parseFloat(m.e(2,3).toFixed(6));break}n.values[q].now=o})}});e.each(e.transform.funcs,function(j,k){e.fx.step[k]=function(o){var n=o.elem.transform||new e.transform(o.elem),l={};if(e.cssMultipleValues[k]||(!e.cssNumber[k]&&e.inArray(k,e.transform.funcs)!==-1)){(e.fx.multipleValueStep[o.prop]||e.fx.multipleValueStep._default)(o);l[o.prop]=[];e.each(o.values,function(p,q){l[o.prop].push(q.now+(e.cssNumber[o.prop]?"":q.unit))})}else{l[o.prop]=o.now+(e.cssNumber[o.prop]?"":o.unit)}n.exec(l,{preserve:true})}});e.each(["matrix","reflect","reflectX","reflectXY","reflectY"],function(j,k){e.fx.step[k]=function(q){var p=q.elem.transform||new e.transform(q.elem),o={};if(!q.initialized){q.initialized=true;if(k!=="matrix"){var n=e.matrix[k]().elements;var r;e.each(q.values,function(s){switch(s){case 0:r=n[0];break;case 1:r=n[2];break;case 2:r=n[1];break;case 3:r=n[3];break;default:r=0}q.values[s].end=r})}q.decomposed={};var l=q.values;q.decomposed.start=e.matrix.matrix(l[0].start,l[1].start,l[2].start,l[3].start,l[4].start,l[5].start).decompose();q.decomposed.end=e.matrix.matrix(l[0].end,l[1].end,l[2].end,l[3].end,l[4].end,l[5].end).decompose()}(e.fx.multipleValueStep[q.prop]||e.fx.multipleValueStep._default)(q);o.matrix=[];e.each(q.values,function(s,t){o.matrix.push(t.now)});p.exec(o,{preserve:true})}})})(jQuery,this,this.document);(function(g,h,j,c){var d=180/Math.PI;var k=200/Math.PI;var f=Math.PI/180;var e=2/1.8;var i=0.9;var a=Math.PI/200;var b=/^([+\-]=)?([\d+.\-]+)(.*)$/;g.extend({angle:{runit:/(deg|g?rad)/,radianToDegree:function(l){return l*d},radianToGrad:function(l){return l*k},degreeToRadian:function(l){return l*f},degreeToGrad:function(l){return l*e},gradToDegree:function(l){return l*i},gradToRadian:function(l){return l*a},toDegree:function(n){var l=b.exec(n);if(l){n=parseFloat(l[2]);switch(l[3]||"deg"){case"grad":n=g.angle.gradToDegree(n);break;case"rad":n=g.angle.radianToDegree(n);break}return n}return 0}}})})(jQuery,this,this.document);(function(f,e,b,g){if(typeof(f.matrix)=="undefined"){f.extend({matrix:{}})}var d=f.matrix;f.extend(d,{V2:function(h,i){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,2)}else{this.elements=[h,i]}this.length=2},V3:function(h,j,i){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,3)}else{this.elements=[h,j,i]}this.length=3},M2x2:function(i,h,k,j){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,4)}else{this.elements=Array.prototype.slice.call(arguments).slice(0,4)}this.rows=2;this.cols=2},M3x3:function(n,l,k,j,i,h,q,p,o){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,9)}else{this.elements=Array.prototype.slice.call(arguments).slice(0,9)}this.rows=3;this.cols=3}});var c={e:function(k,h){var i=this.rows,j=this.cols;if(k>i||h>i||k<1||h<1){return 0}return this.elements[(k-1)*j+h-1]},decompose:function(){var v=this.e(1,1),t=this.e(2,1),q=this.e(1,2),p=this.e(2,2),o=this.e(1,3),n=this.e(2,3);if(Math.abs(v*p-t*q)<0.01){return{rotate:0+"deg",skewX:0+"deg",scaleX:1,scaleY:1,translateX:0+"px",translateY:0+"px"}}var l=o,j=n;var u=Math.sqrt(v*v+t*t);v=v/u;t=t/u;var i=v*q+t*p;q-=v*i;p-=t*i;var s=Math.sqrt(q*q+p*p);q=q/s;p=p/s;i=i/s;if((v*p-t*q)<0){v=-v;t=-t;u=-u}var w=f.angle.radianToDegree;var h=w(Math.atan2(t,v));i=w(Math.atan(i));return{rotate:h+"deg",skewX:i+"deg",scaleX:u,scaleY:s,translateX:l+"px",translateY:j+"px"}}};f.extend(d.M2x2.prototype,c,{toM3x3:function(){var h=this.elements;return new d.M3x3(h[0],h[1],0,h[2],h[3],0,0,0,1)},x:function(j){var k=typeof(j.rows)==="undefined";if(!k&&j.rows==3){return this.toM3x3().x(j)}var i=this.elements,h=j.elements;if(k&&h.length==2){return new d.V2(i[0]*h[0]+i[1]*h[1],i[2]*h[0]+i[3]*h[1])}else{if(h.length==i.length){return new d.M2x2(i[0]*h[0]+i[1]*h[2],i[0]*h[1]+i[1]*h[3],i[2]*h[0]+i[3]*h[2],i[2]*h[1]+i[3]*h[3])}}return false},inverse:function(){var i=1/this.determinant(),h=this.elements;return new d.M2x2(i*h[3],i*-h[1],i*-h[2],i*h[0])},determinant:function(){var h=this.elements;return h[0]*h[3]-h[1]*h[2]}});f.extend(d.M3x3.prototype,c,{x:function(j){var k=typeof(j.rows)==="undefined";if(!k&&j.rows<3){j=j.toM3x3()}var i=this.elements,h=j.elements;if(k&&h.length==3){return new d.V3(i[0]*h[0]+i[1]*h[1]+i[2]*h[2],i[3]*h[0]+i[4]*h[1]+i[5]*h[2],i[6]*h[0]+i[7]*h[1]+i[8]*h[2])}else{if(h.length==i.length){return new d.M3x3(i[0]*h[0]+i[1]*h[3]+i[2]*h[6],i[0]*h[1]+i[1]*h[4]+i[2]*h[7],i[0]*h[2]+i[1]*h[5]+i[2]*h[8],i[3]*h[0]+i[4]*h[3]+i[5]*h[6],i[3]*h[1]+i[4]*h[4]+i[5]*h[7],i[3]*h[2]+i[4]*h[5]+i[5]*h[8],i[6]*h[0]+i[7]*h[3]+i[8]*h[6],i[6]*h[1]+i[7]*h[4]+i[8]*h[7],i[6]*h[2]+i[7]*h[5]+i[8]*h[8])}}return false},inverse:function(){var i=1/this.determinant(),h=this.elements;return new d.M3x3(i*(h[8]*h[4]-h[7]*h[5]),i*(-(h[8]*h[1]-h[7]*h[2])),i*(h[5]*h[1]-h[4]*h[2]),i*(-(h[8]*h[3]-h[6]*h[5])),i*(h[8]*h[0]-h[6]*h[2]),i*(-(h[5]*h[0]-h[3]*h[2])),i*(h[7]*h[3]-h[6]*h[4]),i*(-(h[7]*h[0]-h[6]*h[1])),i*(h[4]*h[0]-h[3]*h[1]))},determinant:function(){var h=this.elements;return h[0]*(h[8]*h[4]-h[7]*h[5])-h[3]*(h[8]*h[1]-h[7]*h[2])+h[6]*(h[5]*h[1]-h[4]*h[2])}});var a={e:function(h){return this.elements[h-1]}};f.extend(d.V2.prototype,a);f.extend(d.V3.prototype,a)})(jQuery,this,this.document);(function(c,b,a,d){if(typeof(c.matrix)=="undefined"){c.extend({matrix:{}})}c.extend(c.matrix,{calc:function(e,f,g){this.matrix=e;this.outerHeight=f;this.outerWidth=g}});c.matrix.calc.prototype={coord:function(e,i,h){h=typeof(h)!=="undefined"?h:0;var g=this.matrix,f;switch(g.rows){case 2:f=g.x(new c.matrix.V2(e,i));break;case 3:f=g.x(new c.matrix.V3(e,i,h));break}return f},corners:function(e,h){var f=!(typeof(e)!=="undefined"||typeof(h)!=="undefined"),g;if(!this.c||!f){h=h||this.outerHeight;e=e||this.outerWidth;g={tl:this.coord(0,0),bl:this.coord(0,h),tr:this.coord(e,0),br:this.coord(e,h)}}else{g=this.c}if(f){this.c=g}return g},sides:function(e){var f=e||this.corners();return{top:Math.min(f.tl.e(2),f.tr.e(2),f.br.e(2),f.bl.e(2)),bottom:Math.max(f.tl.e(2),f.tr.e(2),f.br.e(2),f.bl.e(2)),left:Math.min(f.tl.e(1),f.tr.e(1),f.br.e(1),f.bl.e(1)),right:Math.max(f.tl.e(1),f.tr.e(1),f.br.e(1),f.bl.e(1))}},offset:function(e){var f=this.sides(e);return{height:Math.abs(f.bottom-f.top),width:Math.abs(f.right-f.left)}},area:function(e){var h=e||this.corners();var g={x:h.tr.e(1)-h.tl.e(1)+h.br.e(1)-h.bl.e(1),y:h.tr.e(2)-h.tl.e(2)+h.br.e(2)-h.bl.e(2)},f={x:h.bl.e(1)-h.tl.e(1)+h.br.e(1)-h.tr.e(1),y:h.bl.e(2)-h.tl.e(2)+h.br.e(2)-h.tr.e(2)};return 0.25*Math.abs(g.e(1)*f.e(2)-g.e(2)*f.e(1))},nonAffinity:function(){var f=this.sides(),g=f.top-f.bottom,e=f.left-f.right;return parseFloat(parseFloat(Math.abs((Math.pow(g,2)+Math.pow(e,2))/(f.top*f.bottom+f.left*f.right))).toFixed(8))},originOffset:function(h,g){h=h?h:new c.matrix.V2(this.outerWidth*0.5,this.outerHeight*0.5);g=g?g:new c.matrix.V2(0,0);var e=this.coord(h.e(1),h.e(2));var f=this.coord(g.e(1),g.e(2));return{top:(f.e(2)-g.e(2))-(e.e(2)-h.e(2)),left:(f.e(1)-g.e(1))-(e.e(1)-h.e(1))}}}})(jQuery,this,this.document);(function(e,d,a,f){if(typeof(e.matrix)=="undefined"){e.extend({matrix:{}})}var c=e.matrix,g=c.M2x2,b=c.M3x3;e.extend(c,{identity:function(k){k=k||2;var l=k*k,n=new Array(l),j=k+1;for(var h=0;h<l;h++){n[h]=(h%j)===0?1:0}return new c["M"+k+"x"+k](n)},matrix:function(){var h=Array.prototype.slice.call(arguments);switch(arguments.length){case 4:return new g(h[0],h[2],h[1],h[3]);case 6:return new b(h[0],h[2],h[4],h[1],h[3],h[5],0,0,1)}},reflect:function(){return new g(-1,0,0,-1)},reflectX:function(){return new g(1,0,0,-1)},reflectXY:function(){return new g(0,1,1,0)},reflectY:function(){return new g(-1,0,0,1)},rotate:function(l){var i=e.angle.degreeToRadian(l),k=Math.cos(i),n=Math.sin(i);var j=k,h=n,p=-n,o=k;return new g(j,p,h,o)},scale:function(i,h){i=i||i===0?i:1;h=h||h===0?h:i;return new g(i,0,0,h)},scaleX:function(h){return c.scale(h,1)},scaleY:function(h){return c.scale(1,h)},skew:function(k,i){k=k||0;i=i||0;var l=e.angle.degreeToRadian(k),j=e.angle.degreeToRadian(i),h=Math.tan(l),n=Math.tan(j);return new g(1,h,n,1)},skewX:function(h){return c.skew(h)},skewY:function(h){return c.skew(0,h)},translate:function(i,h){i=i||0;h=h||0;return new b(1,0,i,0,1,h,0,0,1)},translateX:function(h){return c.translate(h)},translateY:function(h){return c.translate(0,h)}})})(jQuery,this,this.document);

// We only want these styles applied when javascript is enabled
$('div.content-slide').css('display', 'block');

// Initially set opacity on thumbs and add
// additional styling for hover effect on thumbs
var onMouseOutOpacity = 0.67;
$('#thumbs ul.thumbs li, div.navigation a.pageLink').opacityrollover({
	mouseOutOpacity:   onMouseOutOpacity,
	mouseOverOpacity:  1.0,
	fadeSpeed:         'fast',
	exemptionSelector: '.selected'
});

// Initialize Advanced Galleriffic Gallery
var gallery = $('#thumbs').galleriffic({
	delay:                     2500,
	numThumbs:                 10,
	preloadAhead:              10,
	enableTopPager:            false,
	enableBottomPager:         false,
	imageContainerSel:         '#slideshow',
	controlsContainerSel:      '#controls',
	captionContainerSel:       '#caption',
	loadingContainerSel:       '#loading',
	renderSSControls:          true,
	renderNavControls:         true,
	playLinkText:              '',
	pauseLinkText:             '',
	prevLinkText:              '',
	nextLinkText:              '',
	nextPageLinkText:          'Next &rsaquo;',
	prevPageLinkText:          '&lsaquo; Prev',
	enableHistory:             true,
	autoStart:                 false,
	syncTransitions:           true,
	defaultTransitionDuration: 900,
	onSlideChange:             function(prevIndex, nextIndex) {
		// 'this' refers to the gallery, which is an extension of $('#thumbs')
		this.find('ul.thumbs').children()
			.eq(prevIndex).fadeTo('fast', onMouseOutOpacity).end()
			.eq(nextIndex).fadeTo('fast', 1.0);

		// Update the photo index display
/*		this.$captionContainer.find('div.photo-index')
			.html('Photo '+ (nextIndex+1) +' of '+ this.data.length);*/
	},
	onPageTransitionOut:       function(callback) {
		this.fadeTo('fast', 0.0, callback);
	},
	onPageTransitionIn:        function() {
		var prevPageLink = this.find('a.prev').css('visibility', 'hidden');
		var nextPageLink = this.find('a.next').css('visibility', 'hidden');
		
		// Show appropriate next / prev page links
		if (this.displayedPage > 0)
			prevPageLink.css('visibility', 'visible');

		var lastPage = this.getNumPages() - 1;
		if (this.displayedPage < lastPage)
			nextPageLink.css('visibility', 'visible');

		this.fadeTo('fast', 1.0);
	}
});

/**************** Event handlers for custom next / prev page links **********************/

gallery.find('a.prev').click(function(e) {
	gallery.previousPage();
	e.preventDefault();
});

gallery.find('a.next').click(function(e) {
	gallery.nextPage();
	e.preventDefault();
});

/****************************************************************************************/

/**** Functions to support integration of galleriffic with the jquery.history plugin ****/

// PageLoad function
// This function is called when:
// 1. after calling $.historyInit();
// 2. after calling $.historyLoad();
// 3. after pushing "Go Back" button of a browser
function pageload(hash) {
	// alert("pageload: " + hash);
	// hash doesn't contain the first # character.
	if(hash) {
		$.galleriffic.gotoImage(hash);
	} else {
		gallery.gotoIndex(0);
	}
}

// Initialize history plugin.
// The callback is called at once by present location.hash. 
$.historyInit(pageload, "advanced.html");

// set onlick event for buttons using the jQuery 1.3 live method
$("a[rel='history']").live('click', function(e) {
	if (e.button != 0) return true;

	var hash = this.href;
	hash = hash.replace(/^.*#/, '');

	// moves to a new page. 
	// pageload is called at once. 
	// hash don't contain "#", "?"
	$.historyLoad(hash);

	return false;
});
				

/* Load Google Fonts --> Begin */
WebFontConfig = {
		google: {families: ['Coda|Dancing+Script' ]}
	  };
	  (function() {
		var wf = document.createElement('script');
		wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
			'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		wf.type = 'text/javascript';
		wf.async = 'true';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(wf, s);
	  })();
	
/* Load Google Fonts --> End */


/* Google Map --> Begin */
	function initialize() {
		var latlng = new google.maps.LatLng(40.72, -74);
		var myOptions = {
				zoom: 12,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		var map = new google.maps.Map(document.getElementById("map_canvas"),
			myOptions);
	}	
/* Google Map --> End */

jQuery(document).ready(function($){
	
	$('body').append('<span id="body_loader"></span>');
		$('#body_loader').fadeIn(); 
	
	//In our jQuery function, we will first cache some element and define some variables:
	var $bg				= $('#background'),
		$bg_img			= $bg.find('img'),
		$bg_img_eq		= $bg_img.eq(0),
		total			= $bg_img.length,
		current			= 0,
		$next		= $('#next'),
		$prev		= $('#prev')
		
	$(window).load(function(){
		//hide loader
		$('#body_loader').fadeOut('fast', function(){
			init();
		}).remove(); 
	
	});
	
	var intervalID,
		play = $('#play'),
		titleItem = $('.title-item');	
	
	//shows the first image and initializes events
	function init(){
		//get dimentions for the image, based on the windows size
		var dim	= getImageDim($bg_img_eq);
		//set the returned values and show the image
		$bg_img_eq.css({
			width	: dim.width,
			height	: dim.height,
			left	: dim.left,
			top    : dim.top
		}).fadeIn('normal');

		//resizing the window resizes the $tf_bg_img
		$(window).bind('resize',function(){
			var dim	= getImageDim($bg_img_eq);
			$bg_img_eq.css({
				width	: dim.width,
				height	: dim.height,
				left	: dim.left,
				top		: dim.top
			});
		});
		
		var activeTitle = $bg_img_eq.attr('title');
			titleItem.html(activeTitle);
			titleItem.html(function(){
				var text= $(this).text().split(" ");
				var last = text.pop();
				return text.join(" ")+ (text.length > 0 ? " <span class='word-last'>"+ last + "</span>" : last);
			});
			
		play.bind('click', function() {
			if($(this).hasClass('pause')) {
				clearInterval(intervalID);
				$(this).removeClass('pause').addClass('play');
			} else {
				$(this).addClass('pause').removeClass('play');
				intervalID = setInterval("$('#next').trigger('click')", 10000);
			}

		});
			
		//click the arrow down, scrolls down
		$next.bind('click',function(){
			if($bg_img_eq.is(':animated'))
				return false;
				scroll('tb');
		});

		//click the arrow up, scrolls up
		$prev.bind('click',function(){
			if($bg_img_eq.is(':animated'))
			return false;
			scroll('bt');
		});
	}
	
	function scroll(dir){
			//else if "bt" decrement it
			current	= (dir == 'tb')?current + 1:current - 1;
			//we want a circular slideshow, 
			//so we need to check the limits of current
			if(current == total) current = 0;
			else if(current < 0) current = total - 1;
			
			var active = $bg_img.eq(current).attr('title');
			titleItem.html(active);
			titleItem.html(function(){
				var text= $(this).text().split(" ");
				var last = text.pop();
				return text.join(" ")+ (text.length > 0 ? " <span class='word-last'>"+ last + "</span>" : last);
			});
			//we get the next image
			var $bg_img_next	= $bg_img.eq(current),
				//its dimentions
				dim				= getImageDim($bg_img_next);
			//set the returned values and show the next image	
				$bg_img_next.css({
					width	: dim.width,
					height	: dim.height,
					top		: dim.top,
					left	: dim.left
				}).fadeIn(1500);

			//we want the old image to slide in the same direction, out of the viewport
				$bg_img_eq.stop().fadeOut(1500,function(){
				//the $tf_bg_img is now the shown image
					$bg_img_eq	= $bg_img_next;
			});		
		} // scroll functions ends here 
			

	//get dimentions of the image, 
	//in order to make it full size and centered
	function getImageDim($img){
		var w_w	= $(window).width(),
			w_h	= $(window).height(),
			r_w	= w_h / w_w,
			i_w	= $img.width(),
			i_h	= $img.height(),
			r_i	= i_h / i_w,
			new_w,new_h,
			new_left,new_top;
			
		if(r_w > r_i){
			new_h	= w_h;
			new_w	= w_h / r_i;
		}
		else {
			new_h	= w_w * r_i;
			new_w	= w_w;
		}

		return {
			width	: new_w + 'px',
			height	: new_h + 'px',
			left	: (w_w - new_w) / 2 + 'px',
			top		: (w_h - new_h) / 2 + 'px'
		};
	}
	
	/* Transform --> Begin */
	var $menu			= $('#navigation'),
		$menuItems			= $('#navigation li').children('a'),
		$more				= $('.more').not('.link'),
		$title_link         = $('.post-title a'),
		$post_thumb_link	= $('.post-thumb a').not('.zoomer'),
		$mbWrapper			= $('#content_wrapper'),
		$mbClose			= $mbWrapper.children('.close'),
		$mbContentItems		= $mbWrapper.children('.content'),
		$mbContentInnerItems= $mbContentItems.children('.content_inner');
		$mbPattern			= $('#pattern'),
		$works				= $('#imagelist > li')
		
		Menu		 		= (function(){
			
			var init		= function() {
				initPlugins();
				initPattern();
				initEventsHandler();
			},

			//initialise the jScollPane (scroll plugin)
			initPlugins		= function() {
				$mbContentInnerItems.jScrollPane({
					verticalDragMinHeight: 40,
					verticalDragMaxHeight: 40
				});
			},
			/*
				draws 16 boxes on a specific area of the page.
				we randomly calculate the top, left, and rotation angle for each one of them
			 */
			initPattern		= function() {
				for(var i = 0; i < 56; ++i) {
					//random opacity, top, left and angle
					var o		= 0.4,
					t		= Math.floor(Math.random()*196) + 5, // between 5 and 200
					l		= Math.floor(Math.random()*696) + 5, // between 5 and 700
					a		= Math.floor(Math.random()*101) - 50; // between -50 and 50
							
					$el		= $('<div>').css({
						opacity			: o,
						top				: t + 'px',
						left			: l + 'px'
					});
						
					if (!$.browser.msie)
						$el.transform({'rotate'	: a + 'deg'});
						
					$el.appendTo($mbPattern);
				}
				$mbPattern.children().draggable(); //just for fun
			},
			/*
				when the User closes a content item, we move the boxes back to the original place,
				with new random values for top, left and angle though
			 */
			disperse 		= function() {
				$mbPattern.children().each(function(i) {
					//random opacity, top, left and angle
					var o			= 0.4,
					t			= Math.floor(Math.random()*450) + 5, // between 5 and 200
					l			= Math.floor(Math.random()*696) + 5, // between 5 and 700
					a			= Math.floor(Math.random()*101) - 50; // between -50 and 50
					$el			= $(this),
					param		= {
						width	: '50px',
						height	: '50px',
						opacity	: o,
						top		: t + 'px',
						left	: l + 'px'
					};

					if (!$.browser.msie)
						param.rotate	= a + 'deg';
							
					$el.animate(param, 1000, 'easeOutExpo');
				});
			},
			initEventsHandler	= function() {
				/*
					click a link in the menu
				 */
				 $title_link.bind('click',clickin);
				 $more.bind('click',clickin);
				 $menuItems.bind('click',clickin);
				 $post_thumb_link.bind('click',clickin);

				 
				function clickin(e) {
					var $this	= $(this),
					pos		= $this.attr('data-rel'),
					speed	= $this.data('speed'),
					easing	= $this.data('easing');
					
					//if an item is not yet shown
					if(!$menu.data('open')){
						//if current animating return
						if($menu.data('moving')) return false;
						$menu.data('moving', true);
						$.when(openItem(pos, speed, easing)).done(function(){
							$menu.data({
								open	: true,
								moving	: false
							});
							showContentItem(pos);
							$mbPattern.children().fadeOut(500);
						});
						
					}
					else
						showContentItem(pos);
					return false;
				};

				/*
					click close makes the boxes animate to the top of the page
				 */
				 
				$mbClose.bind('click', function(e) {
					$menu.data('open', false);
					/*
						if we would want to show the default image when we close:
						changeBGImage('images/default.jpg');
					 */
					$mbPattern.children().fadeIn(500, function() {
						$mbContentItems.hide();
						$mbWrapper.hide();
					});
						
					disperse();
					return false;
				});
					
				/*
					click an image from "Works" content item,
					displays the image on the background
				 */
				
				$works.bind('click', function(e) {
						if($bg_img_eq.is(':animated'))
							return false;
						var $this = $(this);
						var activeEq = $this.index();
						changeBGImage(activeEq);
					return false;
				});
						
			},
			/*
				changes the background image
			 */
			changeBGImage		= function(active) {

				var actives = $bg_img.eq(active).attr('title');
				titleItem.html(actives);
				titleItem.html(function(){
					var text= $(this).text().split(" ");
					var last = text.pop();
					return text.join(" ")+ (text.length > 0 ? " <span class='word-last'>"+ last + "</span>" : last);
				});
				//we get the next image
				var $bg_img_next	= $bg_img.eq(active),
					//its dimentions
					dim				= getImageDim($bg_img_next);
				//set the returned values and show the next image	
					$bg_img_next.css({
						width	: dim.width,
						height	: dim.height,
						top		: dim.top,
						left	: dim.left
					}).fadeIn(1500);

				//we want the old image to slide in the same direction, out of the viewport
					$bg_img_eq.stop().fadeOut(1500,function(){
					//the $tf_bg_img is now the shown image
						$bg_img_eq	= $bg_img_next;
				});	
			},
			/*
				This shows a content item when there is already one shown:
			 */
			showContentItem		= function(pos) {
				$mbContentItems.hide();
				$mbWrapper.show();
				var $mbContentEq = $mbContentItems.eq(pos-1);
				$mbContentEq.show().children('.content_inner').jScrollPane();
				initialize(); 
			},
			/*
				moves the boxes from the top to the center of the page,
				and shows the respective content item
			 */
			openItem			= function(pos, speed, easing) {
				return $.Deferred(
				function(dfd) {
					$mbPattern.children().each(function(i) {
						var $el			= $(this),
						param		= {
							width	: '100px',
							height	: '100px',
							top		: 50 + 100 * Math.floor(i/7),
							left	: 337 + 100 * (i%7),
							opacity	: 1
						};
		
						if (!$.browser.msie)
							param.rotate	= '0deg';
								
						$el.animate(param, speed, easing, dfd.resolve);
					});
				}
			).promise();
			};
				
			return {
				init : init
			};
			
		})();
	
		/*
			call the init method of Menu
		 */
		Menu.init();
		
/* Transform --> End */
	
	if($(window).width() > 1280) {
		$('body').addClass('full');
	}
	
	if($(window).height() <= 900) {
		$('.content_wrapper').height(700);
		$('.content_inner').height(560);
	}
	
	if($(window).height() < 670) {
		$('.content_wrapper').height(550);
		$('.content_inner').height(410);
	}
	
	
/* Query data-rel to rel --> Begin */
	if (jQuery("a[data-rel]").length) {
		jQuery('a[data-rel]').each(function() {jQuery(this).attr('rel', jQuery(this).data('rel'));});
	}	
/* Query data-rel to rel --> End */	

	
/* Navigation --> Begin */
	jQuery("#navigation > ul > li").hover(function(){
			jQuery(this).find('ul').css({visibility: "visible"}).stop(true,true).show(600).css('display','block');
		},function(){
			jQuery(this).find('ul').stop(true,true).hide(400);
		});		
/* Navigation --> End*/	
	
	
/* Prepare loading fancybox --> Begin */

	jQuery('.zoomer').fancybox({
		'overlayShow'	: false,
		'transitionIn'	: 'elastic',
		'transitionOut'	: 'elastic'
	});	

	$(".iframe").fancybox({
		'transitionIn' : 'none',
		'transitionOut' : 'none'
	}); 

/* Prepare loading fancybox --> End */


/* Image wrapper --> Begin */

    function handle_image(img) {
        var $curtain;
        var IMAGE_ANIMATE_SPEED = 700;
        $curtain = $('<span class="curtain" />').css({
            width : img.width()+ parseInt(img.css("border-left-width")) + parseInt(img.css("border-right-width")),
            height : img.height() + parseInt(img.css("border-top-width")) + parseInt(img.css("border-bottom-width"))
		}).hover(function() {
            $(this).stop(true,true).animate({opacity:.7},IMAGE_ANIMATE_SPEED);
        },function() {
            $(this).stop(true,true).animate({opacity:0},IMAGE_ANIMATE_SPEED);
        })
        img.before($curtain);        
    }

    $img_collection = $('.zoomer img, .handled img');
    $img_collection.each(function() {
        handle_image($(this));
    });
    
/* Image wrapper --> End */
	
	
/* Accordion --> Begin */
   if($('ul.accordion').length) {
		$('ul.accordion').accordion({autoHeight:false,header:".opener",collapsible:true,event:"click"});
   }
   
      if($('ul.highlighter').length) {
		$('ul.highlighter').accordion({active:'.selected',autoHeight:false,header:".opener",collapsible:true,event:"click"});
   } 
/* Accordion --> End */


/* Tabs --> Begin */
	if($('.tabs').length) {	
		//When page loads...
		$("ul.tabs li:first").addClass("active").show(); //Activate first tab
		$(".tab_container .tab_content:first").show(); //Show first tab content
	
		//On Click Event
		$("ul.tabs li").click(function() {
	
			$("ul.tabs li").removeClass("active"); //Remove any "active" class
			$(this).addClass("active"); //Add "active" class to selected tab
			$(".tab_content").hide(); //Hide all tab content
	
			var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
			$(activeTab).fadeIn('slow'); //Fade in the active ID content
			return false;
		});
	}	
/* Tabs --> End */


/* Toggle --> Begin */
	if($('.toggle_container').length) {	
		$(".toggle_container").hide(); //Hide (Collapse) the toggle containers on load
	
		//Switch the "Open" and "Close" state per click then slide up/down (depending on open/close state)
		$("b.trigger").click(function(){
			$(this).toggleClass("active").next().slideToggle("slow");
			return false; //Prevent the browser jump to the link anchor
		});
	}
/* Toggle --> End */


/* Contactform --> Begin */
$('#contactform').submit(function(){
	
		var action = $(this).attr('action');
		
		$('#contactform #submit').after('<img src="assets/ajax-loader.gif" class="loader" />');
		
		$("#message").slideUp(750,function() {
		$('#message').hide();			
		
		$.post(action, { 
			name: $('#name').val(),
			email: $('#email').val(),
			phone: $('#phone').val(),
			subject: $('#subject').val(),
			comments: $('#msg').val(),
			verify: $('#verify').val()
		},
			function(data){
				document.getElementById('message').innerHTML = data;
				$('#message').slideDown('slow');
				$('#contactform img.loader').fadeOut('fast',function(){$(this).remove()});
				if(data.match('success') != null) $('#contactform').slideUp('slow');
			}
		);
		});
		return false; 
	});
/* Contactform --> End */

});


