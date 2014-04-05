season_changer = function(){
	var season_info = new Date();
	var year = season_info.getFullYear();
	var month = season_info.getMonth() + 1;
	var day = season_info.getDay();
	if (month <= 3)
	{
		$("#top").css("background-color", "#a0d8ef");
		$("#bottom").css("background-color", "#eaf4fc");
	}
	else if (month <= 6)
	{
		$("#top").css("background-color", "#f6ad49");
		$("#bottom").css("background-color", "#fddea5");
	}
	else if (month <= 9)
	{
		$("#top").css("background-color", "#7ebeab");
		$("#bottom").css("background-color", "#d6e9ca");
	}
	else if (month <= 12)
	{
		$("#top").css("background-color", "#f6bfbc");
		$("#bottom").css("background-color", "#fef4f4");
	}
}();
