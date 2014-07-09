$(function () {
	
	$(window).load(function(){
		$( "#accordion" ).hide();
	});

	$( "#homeBtn" ).click(function() {
		$( "#accordion" ).hide();
		$('#intro' ).show();
  		$('#myCarousel' ).show();
	});
  	$( "#ProjectBtn" ).click(function() {
  	$('#myCarousel' ).hide();
  	$('#intro' ).hide();
  	$( "#accordion" ).show();
	});
});