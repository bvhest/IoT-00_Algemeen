jQuery(window).load(function() { 
  var li_count = 0;
  var $li_element = jQuery( ".newblog-container .project-main-list" );
  var li_count = $li_element.length;
  // console.log("licount--"+li_count); console.log("li_pos--"+li_oh);
  // if(li_count){
    for (var i = 0; i<li_count; i++) 
    { 
      li_oh = $li_element.eq(i-3).outerHeight();
       if(i > 2 & i < 6){ $li_element.eq(i).css({'top' : li_oh +'px'}); }
       if(i >= 6){ var li_top_position = $li_element.eq(i-3).position().top;  
        $li_element.eq(i).css({'top' : li_top_position+li_oh+'px'}); }
    }
    if (i>0) {
    var p1 = $li_element.eq(-1).position().top;
    var p2 = $li_element.eq(-2).position().top;
    var p3 = $li_element.eq(-3).position().top;
    }else{   
      var p1=0; var p2=0; var p3=0;
    }
    var numbers_array2 = [p3, p2, p1];
    var biggestp = Math.max.apply( null, numbers_array2 );
    var llih3 = $li_element.eq(-3).height();
    var llih2 = $li_element.eq(-2).height();
    var llih1 = $li_element.eq(-1).height();
    var numbers_array = [llih3, llih2, llih1];
    var biggest = Math.max.apply( null, numbers_array );
    var ulheight = biggestp + biggest + 'px';
     jQuery('.newblog-container').css({'height' : ulheight });
  // }
});
  window.fbAsyncInit = function() {
        FB.init({
          appId      : '1608449732752156',
          xfbml      : true,
          version    : 'v2.4'
        });
      };
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));	  
	  
jQuery(document).ready(function(){

jQuery(".fave_btn").click(function(){
        
         var votemode='';
        if(jQuery(this).attr("isactivevote") == 'yes')
        {
        votemode='0'; jQuery(".fave_btn").attr("isactivevote","no");
   jQuery(".fave_btn").removeClass("yes");
        jQuery(".fave_btn").addClass("no");   jQuery(this).attr("title","Add to favourites");
        }
        else
        {
        votemode='1'; jQuery(".fave_btn").attr("isactivevote","yes");   jQuery(".fave_btn").removeClass("no");
        jQuery(".fave_btn").addClass("yes");  jQuery(".fave_btn").attr("title","Remove from favourites");
        }
        jQuery.ajax({
        url: document.getElementById("voteurl").value,
        type: 'POST',datatype:'json',
        data: { source: jQuery(this).attr("data-entity-id"),votemode:votemode} ,
        success: function (responseText) {
        var response = jQuery.parseJSON(responseText);
        if(response.success == 1){
        jQuery(".fave_count").html(response.votes);}else{
         alert("bad response");

}
              }
      });
});


jQuery(".formatting-help-link").click(function(){
var $this = jQuery(this);
if($this.text()  == 'formatting help')
{
$this.text('hide help');
}
else
{
$this.text('formatting help');
}
jQuery(".formatting-help").toggle();
});
jQuery(".comment-help-link").click(function(){
var $this = jQuery(this);
if($this.text()  == 'formatting help')
{
$this.text('hide help');
}
else
{
$this.text('formatting help');
}
var currentid=this.id;
curntvalue=currentid.split("_");
jQuery("#dishelptext_"+curntvalue[1]).toggle();
});
    jQuery(".cancelbtn").click(function(){
var currentid=this.id;
curntvalue=currentid.split("_");
jQuery("#postreplyComment_"+curntvalue[1]).toggle();

});
    jQuery(".replycmnt").click(function(){
   
var currentid=this.id;
curntvalue=currentid.split("_");
jQuery("#postreplyComment_"+curntvalue[1]).toggle();
    });
	jQuery(".replyform").hide();
});
	  
 var _URL = window.URL;
        
	  
	     document.observe("dom:loaded", function() {
        var antibot = document.createElement('input');
        var d = new Date();
        antibot.setAttribute('type', 'hidden');
        antibot.setAttribute('name', 'antibot-field');
        antibot.setAttribute('value', 'antibot-' + d.getMilliseconds());
        jQuery('#report_content_form').append(antibot);
    });
