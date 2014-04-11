season_changer = function(){
	var season_info = new Date();
	var year = season_info.getFullYear();
	var month = season_info.getMonth() + 1;
	var day = season_info.getDay();
	if (month == 12) month = 0;
	if (month <= 2)
	{
		// blue
		$("#sc-top").css("background-color", "#a0d8ef");
		$("#sc-bottom").css("background-color", "#eaf4fc");
	}
	else if (month <= 5)
	{
		// pink
		$("#sc-top").css("background-color", "#f6bfbc");
		$("#sc-bottom").css("background-color", "#fef4f4");
	}
	else if (month <= 8)
	{
		// green
		$("#sc-top").css("background-color", "#7ebeab");
		$("#sc-bottom").css("background-color", "#d6e9ca");
	}
	else if (month <= 11)
	{
		// orange
		$("#sc-top").css("background-color", "#f6ad49");
		$("#sc-bottom").css("background-color", "#fddea5");
	}
}();
