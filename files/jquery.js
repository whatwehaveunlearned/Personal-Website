(function($){
/*
 * mcDropdown jQuery Plug-in
 *
 * Copyright 2013 Giva, Inc. (http://www.givainc.com/labs/) 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Date: 2013-10-07
 * Rev:  1.3.7
 */
$.fn.mcDropdown=function(list,options){var dd;this.each(function(){dd=$.data(this,"mcDropdown");if(dd){return false}new $.mcDropDownMenu(this,list,options)});return dd||this};$.mcDropdown={version:"1.3.7",setDefaults:function(options){$.extend(defaults,options)}};var defaults={minRows:8,maxRows:25,targetColumnSize:2,openFx:"slideDown",openSpeed:250,closeFx:"slideUp",closeSpeed:250,hoverOverDelay:200,hoverOutDelay:0,showFx:"show",showSpeed:0,hideFx:"hide",hideSpeed:0,dropShadow:true,autoHeight:true,lineHeight:19,screenPadding:10,allowParentSelect:false,delim:":",showACOnEmptyFocus:false,valueAttr:"rel",mouseintent:false,click:null,select:null,init:null};var isIE6=($.browser.version&&$.browser.version<=6);$.mcDropDownMenu=function(el,list,options){var $self,thismenu=this,$list,$divInput,settings,typedText="",matchesCache,oldCache,$keylist,$keylistiframe,bInput,bDisabled=false;$self=$(el);bInput=$self.is(":input");this.settings=settings=$.extend({},defaults,options);if((settings.mouseintent!==false)&&!$.fn.mouseintent){settings.mouseintent=false}else{if(settings.mouseintent){var mouseintentDefaults={monitorMovement:true,mouseAwayAfter:1500,borderThreshold:[0,150,150,0]};settings.mouseintent=$.extend({},mouseintentDefaults,$.isPlainObject(settings.mouseintent)?settings.mouseintent:{})}}if(settings.click==null){settings.click=function(e,dropdown,settings){if(this.attr(settings.valueAttr)){dropdown.setValue(this.attr(settings.valueAttr))}else{dropdown.setValue($(this.parents("li")[0]).attr(settings.valueAttr))}}}$(document).bind("click",function(e){var $target=$(e.target);var $ul=$target.parents().filter(function(){return this===$list[0]||(!!$keylist&&$keylist[0]===this)});if($ul.length){if(!$target.is("li")){return false}var bIsParent=$target.is(".mc_parent");if(bIsParent&&$keylist&&$ul[0]===$keylist[0]){updateValue($target.find("> ul > li:first"),false);e.stopPropagation();return false}else{if(!settings.allowParentSelect&&bIsParent){return false}}if($target.not(".mc_root")){hideBranch.apply($target.parent().parent()[0],[e])}if(settings.click!=null&&settings.click.apply($target,[e,thismenu,settings])==false){return false}}thismenu.closeMenu()});$list=(((typeof list=="object")&&!!list.jquery))?list:$(list);$list.appendTo("body").css({position:"absolute",top:-10000,left:-10000}).find("ul").andSelf().css("display","block").each(function(){var $el=$(this);$el.data("width",$el[0].clientWidth)}).css({top:0,left:0,display:"none"});$list.find("> li").addClass("mc_root");$("li > ul",$list).parent().addClass("mc_parent");$divInput=$('<div class="mcdropdown"><a href="#" tabindex="-1"></a><input type="hidden" name="'+(el.name||el.id)+'" id="'+(el.id||el.name)+'" /></div>').appendTo($('<div style="position: relative;"></div>')).parent();var $input=$self.replaceWith($divInput).attr({id:"",name:""});var $hidden=$divInput.find(":input");$divInput=$divInput.find(".mcdropdown").prepend($input);var $divInputClone=$divInput.clone().css({position:"absolute",top:-9999999,left:-999999,visibility:"visible"}).show().appendTo("body");var di={width:$divInputClone.width()-$("a",$divInputClone).width(),height:$divInputClone.outerHeight()};$divInputClone.remove();$.data($hidden[0],"mcDropdown",thismenu);$divInput.parent().height(di.height);if($.browser.safari){setTimeout(function(){$self.width($divInput.width()-$("a",$divInput).width())},100)}$self.width(di.width).filter(":input").attr("autocomplete","off").bind("keypress",checkKeypress).bind("mousedown",function(e){$(this).triggerHandler("focus");e.stopPropagation();return false}).bind("contextmenu",function(){return false}).bind("focus",onFocus).bind("blur",onBlur);if($.browser.msie||$.browser.safari){$self.bind("keydown",function(e){if(",8,9,37,38,39,40,".indexOf(","+e.keyCode+",")>-1){return checkKeypress(e)}})}$("a",$divInput).bind("click",function(e){if(bDisabled){return false}thismenu.openMenu(e);return false});this.setValue=function(value,skipCallback){$hidden.val(value);var name=displayString(value);if(skipCallback!==true){$hidden.triggerHandler("update",[value,name,this]);$self.triggerHandler("update",[value,name,this]);if(settings.select!=null){settings.select.apply(thismenu,[value,name])}}return $self[bInput?"val":"text"](name)};if(bInput){this.setValue($self[0].defaultValue,true)}this.getValue=function(value){return[$hidden.val(),$self[bInput?"val":"text"]()]};this.openMenu=function(e){if($list.is(":visible")){return(!!e)?thismenu.closeMenu():false}function open(){columnizeList($list).hide();addBindings($list);anchorTo($divInput.parent(),$list,true);$list.find(".mc_hover").removeClass("mc_hover");$list[settings.openFx](settings.openSpeed,function(){scrollToView($list)});if(isIE6&&!!$.fn.bgIframe){$list.bgIframe()}}if(e){open()}else{setTimeout(open,1)}};this.closeMenu=function(e){removeBindings($list);$list.find("ul").filter(function(){return this.style.visibility=="visible"}).parent().each(function(){hideBranch.apply(this,[true])});$list[settings.closeFx](settings.closeSpeed)};this.focus=function(){$self.focus()};this.disable=function(status){bDisabled=!!status;$divInput[bDisabled?"addClass":"removeClass"]("mcdropdownDisabled");$input.attr("disabled",bDisabled)};function getNodeText($el){var nodeContent;var nContents=$el.contents().filter(function(){return(this.nodeType==1)||(this.nodeType==3&&$.trim(this.nodeValue).length>0)});if(nContents[0]&&nContents[0].nodeType==3){nodeContent=nContents[0].nodeValue}else{if(nContents[0]&&nContents[0].nodeType==1){nodeContent=$(nContents[0]).text()}else{nodeContent=""}}return $.trim(nodeContent)}function getTreePath($li){if($li.length==0){return[]}var name=[getNodeText($li)];$li.parents().each(function(){var $el=$(this);if(this===$list[0]){return false}else{if($el.is("li")){name.push(getNodeText($el))}}});return name.reverse()}function displayValue(value){return getTreePath(getListItem(value))}function displayString(value){return displayValue(value).join(settings.delim)}function parseTree($selector){var s=[],level=(arguments.length>1)?++arguments[1]:1;$("> li",$selector).each(function(){var $self=$(this);var $ul=getChildMenu(this);s.push({name:getNodeText($self),element:this,children:($ul.length)?parseTree($ul,level):[]})});return s}function addBindings(el){removeBindings(el);$("> li",el).bind("mouseover.mcdropdown",hoverOver).bind("mouseout.mcdropdown",hoverOut)}function removeBindings(el){$("> li",el).unbind(".mcdropdown")}function scrollToView($el){var p=position($el,true);var sd=getScreenDimensions();if(p.bottom>sd.y){$("html,body").animate({scrollTop:"+="+((p.bottom-sd.y)+settings.screenPadding)+"px"})}}function hoverOver(e){var self=this,$child=getChildMenu(self);var timer=$.data(self,"mcDropdown-timer");clearTimeout(timer);$(this).addClass("mc_hover");if($child.length){$.data(self,"mcDropdown-timer",setTimeout(function(){showBranch.apply(self);if(settings.mouseintent){$child.bind("mouseenter.mcdropdown",function(){$(this).mouseintent($.extend({},settings.mouseintent,{mouseaway:function(){if($.isFunction(settings.mouseintent.mouseaway)){settings.mouseintent.mouseaway.apply(this,arguments)}hideBranch.apply(self,[true])}}))})}},settings.hoverOverDelay))}}function hoverOut(e){var self=this,$li=$(self),$child=getChildMenu(self);var timer=$.data(self,"mcDropdown-timer");clearTimeout(timer);$(this).removeClass("mc_hover");if($child.length&&((settings.mouseintent===false)||(!$child.data("mouseintent")))){$.data(self,"mcDropdown-timer",setTimeout(function(){hideBranch.apply(self,[true])},settings.hoverOutDelay))}if(isIE6){e.stopPropagation()}}function getShadow(depth){var shadows=$self.data("mcDropdown-shadows");if(!shadows){shadows={}}if(!shadows[depth]){shadows[depth]=$('<div class="mcdropdown_shadow"></div>').appendTo("body");if(!!$.fn.bgIframe){shadows[depth].bgIframe()}$self.data("mcDropdown-shadows",shadows)}return shadows[depth]}function getChildMenu(li){return $("> ul",li)}function showBranch(){var self=this;var $ul=getChildMenu(this);if($ul.is(":visible")||($ul.length==0)){return false}$(this).parent().find("> li ul:visible").not($ul).parent().each(function(){hideBranch.apply(this,[true])});columnizeList($ul);addBindings($ul);var depth=$ul.parents("ul").length;var sd=getScreenDimensions();var li_coords=position($(this));$ul.css({top:li_coords.bottom,left:li_coords.marginLeft}).show();var menuBottom=$ul.outerHeight()+$ul.offset().top;if(menuBottom>sd.y){$ul.css("top",li_coords.bottom-(menuBottom-sd.y)-settings.screenPadding)}var showShadow=function(){if(settings.dropShadow){var $shadow=getShadow(depth);var pos=position($ul);$shadow.css({top:pos.top+pos.marginTop,left:pos.left+pos.marginLeft,width:pos.width,height:pos.height,visibility:"visible"}).insertAfter($ul).show();$.data(self,"mcDropdown-shadow",$shadow)}};if(settings.showSpeed<=0){showShadow()}else{$ul.hide()[settings.showFx](settings.showSpeed,showShadow)}}function hideBranch(force){var $ul=getChildMenu(this);if(($ul.is(":hidden")||($ul.length==0))&&(force!==true)){return false}var shadow=$.data(this,"mcDropdown-shadow");if(settings.dropShadow&&shadow){shadow.css({display:"",visibility:"hidden"})}if(isIE6){$ul.css("visibility","hidden").parent().removeClass("mc_hover")}if(force===true){$ul.stop().css({display:"",visibility:"hidden"})}else{$ul.stop()[settings.hideFx](settings.hideSpeed)}}function position($el,bUseOffset){var bHidden=false;if($el.is(":hidden")){bHidden=!!$el.css("visibility","hidden").show()}var pos=$.extend($el[bUseOffset===true?"offset":"position"](),{width:$el.outerWidth(),height:$el.outerHeight(),marginLeft:parseInt($.curCSS($el[0],"marginLeft",true),10)||0,marginRight:parseInt($.curCSS($el[0],"marginRight",true),10)||0,marginTop:parseInt($.curCSS($el[0],"marginTop",true),10)||0,marginBottom:parseInt($.curCSS($el[0],"marginBottom",true),10)||0});if(pos.marginTop<0){pos.top+=pos.marginTop}if(pos.marginLeft<0){pos.left+=pos.marginLeft}pos.bottom=pos.top+pos.height;pos.right=pos.left+pos.width;if(bHidden){$el.hide().css("visibility","visible")}return pos}function anchorTo($anchor,$target,bUseOffset){var pos=position($anchor,bUseOffset);$target.css({position:"absolute",top:pos.bottom,left:pos.left});return pos.bottom}function getScreenDimensions(){var d={scrollLeft:$(window).scrollLeft(),scrollTop:$(window).scrollTop(),width:$(window).width(),height:$(window).height()};d.x=d.scrollLeft+d.width;d.y=d.scrollTop+d.height;return d}function getPadding(el,name){var torl=name=="height"?"Top":"Left",borr=name=="height"?"Bottom":"Right";return(parseInt("0"+$.curCSS(el,"border"+torl+"Width",true),10)+parseInt("0"+$.curCSS(el,"border"+borr+"Width",true),10)+parseInt("0"+$.curCSS(el,"padding"+torl,true),10)+parseInt("0"+$.curCSS(el,"padding"+borr,true),10)+parseInt("0"+$.curCSS(el,"margin"+torl,true),10)+parseInt("0"+$.curCSS(el,"margin"+borr,true),10))}function getListDimensions($el,cols){if(!$el.data("dimensions")){var ddWidth=$divInput.outerWidth();var width=(($el===$list)&&($el.data("width")*cols<ddWidth))?Math.floor(ddWidth/cols):$el.data("width");$el.data("dimensions",{column:width,item:width-getPadding($el.children().eq(0)[0],"width"),height:$el.height()})}return $el.data("dimensions")}function getHeight($el){if(settings.autoHeight===false){return settings.lineHeight}if(!$el.data("height")){$el.data("height",$el.outerHeight())}return $el.data("height")}function columnizeList($el){var $children=$el.find("> li");var items=$children.length;var calculatedCols=Math.ceil(items/settings.maxRows);var cols=!!arguments[1]?arguments[1]:(items<=settings.minRows)?1:(calculatedCols>settings.targetColumnSize)?calculatedCols:settings.targetColumnSize;var widths=getListDimensions($el,cols);var prevColumn=0;var columnHeight=0;var maxColumnHeight=0;var maxRows=Math.ceil(items/cols);var parentLIWidth=$el.parent("li").width();$el.css({visibility:"hidden",display:"block"});$children.each(function(i){var currentItem=i+1;var nextItemColumn=Math.floor((currentItem/items)*cols);var column=Math.floor((i/items)*cols);var $li=$(this);var marginTop;if(prevColumn!=column){marginTop=(columnHeight+1)*-1;columnHeight=0}else{marginTop=0}columnHeight+=(getHeight($li)||settings.lineHeight);$li.css({marginLeft:(widths.column*column),marginTop:marginTop,width:widths.item})[((nextItemColumn>column)||(currentItem==items))?"addClass":"removeClass"]("mc_endcol")[(marginTop!=0)?"addClass":"removeClass"]("mc_firstrow");if(columnHeight>maxColumnHeight){maxColumnHeight=columnHeight}prevColumn=column});if(($el!==$list)&&(maxColumnHeight+(settings.screenPadding*2)>=getScreenDimensions().height)){return columnizeList($el,cols+1)}$el.css("visibility","visible").height(maxColumnHeight);return $el}function getListItem(value){return $list.find("li["+settings.valueAttr+"='"+value+"']")}function getCurrentListItem(){return getListItem($hidden.val())}function onFocus(e){var $current=getCurrentListItem();var value=$self.val().toLowerCase();var treePath=value.toLowerCase().split(settings.delim);var currentNode=treePath.pop();var lastDelim=value.lastIndexOf(settings.delim)+1;typedText=treePath.join(settings.delim)+(treePath.length>0?settings.delim:"");setTimeout(function(){setSelection($self[0],lastDelim,lastDelim+currentNode.length)},0);if(!$keylist){$keylist=$('<ul class="mcdropdown_autocomplete"></ul>').appendTo("body");if(isIE6&&!!$.fn.bgIframe){$keylistiframe=$("<div></div>").bgIframe().appendTo("body")}}var hideResults=!(settings.showACOnEmptyFocus&&(typedText.length==0));var $siblings=($current.length==0||$current.hasClass("mc_root"))?$list.find("> li"):$current.parent().find("> li");showMatches($siblings,hideResults)}var iBlurTimeout=null;function onBlur(e){if(iBlurTimeout){clearTimeout(iBlurTimeout)}iBlurTimeout=setTimeout(function(){var $current=getCurrentListItem();if(!settings.allowParentSelect&&$current.is(".mc_parent")){var value=$current.find("li:not('.mc_parent'):first").attr(settings.valueAttr);thismenu.setValue(value,true)}var value=thismenu.getValue(),name=displayString(value);$hidden.triggerHandler("update",[value,name,this]);$self.triggerHandler("update",[value,name,this]);if(settings.select!=null){settings.select.apply(thismenu,value)}hideMatches();iBlurTimeout=null},200)}function showMatches($li,hideResults){var bCached=($li===oldCache),$items=bCached?$keylist.find("> li").removeClass("mc_hover mc_hover_parent mc_firstrow"):$li.clone().removeAttr("style").removeClass("mc_hover mc_hover_parent mc_firstrow mc_endcol").filter(":last").addClass("mc_endcol").end();if(!bCached||$keylist.is(":hidden")){$keylist.empty().append($items).width($divInput.outerWidth()-getPadding($keylist[0],"width")).css("height","auto");anchorTo($divInput.parent(),$keylist,true);$items.hover(function(){$keylist.find("> li").removeClass("mc_hover_parent mc_hover");$(this).addClass("mc_hover")},function(){$(this).removeClass("mc_hover")});$items.find("> ul").css("display","none");$keylist.show().css("visibility",(hideResults===true)?"hidden":"visible");if(isIE6){var maxHeight=parseInt($keylist.css("max-height"),10)||0;if((maxHeight>0)&&(maxHeight<$keylist.outerHeight())){$keylist.height(maxHeight)}if(!!$.fn.bgIframe){anchorTo($divInput.parent(),$keylistiframe.css({height:$keylist.outerHeight(),width:$keylist.width()},true).show())}}if(hideResults!==true){scrollToView($keylist)}}if(hideResults===true){$keylist.css({top:"-10000px",left:"-10000px"});if(isIE6&&!!$.fn.bgIframe){$keylistiframe.css("display","none")}}var $current=$keylist.find("li["+settings.valueAttr+"='"+$hidden.val()+"']");$current.addClass("mc_hover"+($current.is(".mc_parent")?"_parent":""));if($current.length>0&&(hideResults!=true)){scrollIntoView($current)}oldCache=matchesCache=$li}function hideMatches(){if(isIE6&&!!$.fn.bgIframe&&$keylistiframe){$keylistiframe.hide()}if($keylist){$keylist.hide()}}function checkKeypress(e){var key=String.fromCharCode(e.keyCode||e.charCode).toLowerCase();var $current=getCurrentListItem();var $lis=($current.length==0||$current.hasClass("mc_root"))?$list.find("> li"):$current.parent().find("> li");var treePath=typedText.split(settings.delim);var currentNode=treePath.pop();var compare=currentNode+key;var selectedText=getSelection($self[0]).toLowerCase();var value=$self.val().toLowerCase();if(e.keyCode==38){moveMatch(-1);return false}else{if(e.keyCode==40){moveMatch(1);return false}else{if(e.keyCode==27){typedText="";thismenu.setValue("");showMatches($list.find("> li"));return false}else{if(e.keyCode==8||e.keyCode==37){compare=(e.keyCode==37)?"":currentNode.substring(0,currentNode.length-1);if(selectedText==currentNode){currentNode=""}if(treePath.length>0&&currentNode.length==0){updateValue($current.parent().parent());return false}else{if(selectedText==value){typedText="";thismenu.setValue("");return false}}}else{if(e.keyCode==9||e.keyCode==13||e.keyCode==39||key==settings.delim){var $first=$current.find("> ul > li:first");if($first.length>0){updateValue($first)}else{if($.browser.msie){setSelection($self[0],0,0)}if(e.keyCode==9){$self.triggerHandler("blur");hideMatches();return true}else{$self.trigger("blur");hideMatches()}}return false}else{if(selectedText==value){typedText="";compare=key}}}}}}matchesCache=findMatches($lis,compare);if(matchesCache.length>0){typedText=treePath.join(settings.delim)+(treePath.length>0?settings.delim:"")+compare;updateValue(matchesCache.eq(0),true)}else{compare=compare.length?compare.substring(0,compare.length-1):"";matchesCache=findMatches($lis,compare);if(matchesCache.length>0){showMatches(matchesCache)}else{hideMatches()}}e.preventDefault();return false}function moveMatch(step){var $current=getCurrentListItem(),$next,pos=0;if($current.length==0){$current=matchesCache.filter(".mc_hover, .mc_hover_parent")}if($current.length==0||$keylist.is(":hidden")){$current=matchesCache.eq(0);step=0}matchesCache.each(function(i){if(this===$current[0]){pos=i;return false}});if(!matchesCache||matchesCache.length==0||$current.length==0){return false}pos=pos+step;if(pos<0){pos=matchesCache.length-1}else{if(pos>=matchesCache.length){pos=0}}$next=matchesCache.eq(pos);updateValue($next,true)}function findMatches($lis,compare){var matches=$([]);$lis.each(function(){var $li=$(this),label=getNodeText($li);if(label.substring(0,compare.length).toLowerCase()==compare){matches=matches.add($li)}});return matches}function updateValue($li,keepTypedText){var $siblings=keepTypedText?matchesCache:($li.length==0||$li.hasClass("mc_root"))?$list.find("> li"):$li.parent().find("> li");var treePath=getTreePath($li);var currentNode=treePath.pop().toLowerCase();if(!keepTypedText){typedText=treePath.join(settings.delim).toLowerCase()+(treePath.length>0?settings.delim:"")}thismenu.setValue($li.attr(settings.valueAttr),true);setSelection($self[0],typedText.length,currentNode.length+typedText.length);$siblings.filter(".mc_hover,.mc_hover_parent").removeClass("mc_hover mc_hover_parent");$li.addClass("mc_hover"+($li.is(".mc_parent")?"_parent":""));showMatches($siblings)}function getSelection(field){var text="";if(field.setSelectionRange){text=field.value.substring(field.selectionStart,field.selectionEnd)}else{if(document.selection){var range=document.selection.createRange();if(range.parentElement()==field){text=range.text}}}return text}function setSelection(field,start,end){if(field.createTextRange){var selRange=field.createTextRange();selRange.collapse(true);selRange.moveStart("character",start);selRange.moveEnd("character",end);selRange.select()}else{if(field.setSelectionRange){field.setSelectionRange(start,end)}else{if(field.selectionStart){field.selectionStart=start;field.selectionEnd=end}}}field.focus()}function scrollIntoView($el,center){var el=$el[0];var scrollable=$keylist[0];var s={pTop:parseInt($keylist.css("paddingTop"),10)||0,pBottom:parseInt($keylist.css("paddingBottom"),10)||0,bTop:parseInt($keylist.css("borderTopWidth"),10)||0,bBottom:parseInt($keylist.css("borderBottomWidth"),10)||0};if((el.offsetTop+el.offsetHeight)>(scrollable.scrollTop+scrollable.clientHeight)){scrollable.scrollTop=$el.offset().top+(scrollable.scrollTop-$keylist.offset().top)-((scrollable.clientHeight/((center==true)?2:1))-($el.outerHeight()+s.pBottom))}else{if(el.offsetTop-s.bTop-s.bBottom<=(scrollable.scrollTop+s.pTop+s.pBottom)){scrollable.scrollTop=$el.offset().top+(scrollable.scrollTop-$keylist.offset().top)-s.pTop}}}this.$mcDropdown=$self;this.$input=$input;this.$hidden=$hidden;if(settings.init!=null){settings.init.apply(thismenu,[$input,$hidden,$list])}}})(jQuery);