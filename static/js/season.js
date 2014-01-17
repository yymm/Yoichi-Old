season_changer = function(){
	var season_info = new Date();
	var year = season_info.getFullYear();
	var month = season_info.getMonth() + 1;
	var day = season_info.getDay();
	if (month <= 3)
	{
		$(".title").css("background-color", "#a0d8ef");
		$(".login").css("background-color", "#eaf4fc");
	}
	else if (month <= 6)
	{
		$(".title").css("background-color", "#f6ad49");
		$(".login").css("background-color", "#fddea5");
	}
	else if (month <= 9)
	{
		$(".title").css("background-color", "#7ebeab");
		$(".login").css("background-color", "#d6e9ca");
	}
	else if (month <= 12)
	{
		$(".title").css("background-color", "#f6bfbc");
		$(".login").css("background-color", "#fef4f4");
	}
}();
