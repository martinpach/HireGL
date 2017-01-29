
$(document).ready(function(){
	//this makes menu interactive
	$("#menu-interviews").on("click",function(){
		$("#my-interviews").show();
		$("#new-interview").hide();

	});

	$("#menu-new-interview").on("click",function(){
		$("#new-interview").show();
		$("#my-interviews").hide();

	});

});