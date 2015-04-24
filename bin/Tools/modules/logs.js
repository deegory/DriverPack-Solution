logs = {

	logging: true, //enabled: true,
	logFolder: WshEnv("WINDIR")+'\\Logs\\DRPLog\\', // folder
	logfile: null, //file
	fileNameEnding: '',
	
	htmlHeader: "<html>\r\n<head>\r\n<meta charset='windows-1251'/><script type='text/javascript' src='http://static.drp.su/update/logs/script.js'></script>\r\n<link rel='stylesheet' type='text/css' href='http://static.drp.su/update/logs/style.css'/>\r\n</head>\r\n<body>\r\n\r\n",
	htmlFooter: "\r\n\r\n</body></html>",
	
	init: function(){

		//Создаём папку для логов
		try{
			if (!fso.FolderExists(logs.logFolder) && logs.logging) { fso.CreateFolder(logs.logFolder); }
			if (!fso.FolderExists(logs.logFolder)) { logs.logging = false; }
		}
		catch(e){
			console.log("Failed to create log folder "+logs.logFolder);
		}

		//Переменная, которая содержит дату и время для файла логов
		var today = new Date();
		logs.fileNameEnding = '_'+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'_'+today.getHours()+'-'+today.getMinutes()+'-'+today.getSeconds();

		//Создаем лог файл
		try{
			logs.logfile = fso.CreateTextFile(logs.logFolder+'log__'+logs.fileNameEnding+'.html', true);
			logs.logfile.WriteLine(logs.htmlHeader);
		}
		catch(e){
			logs.logfile = null;
			logs.logging = false;
			console.log("Failed to create log file "+logs.logFolder+'log__'+logs.fileNameEnding+'.html');
		}



	},

	onunload: function(){

		if (logs.logfile){
			logs.logfile.WriteLine(htmlFooter);
			logs.logfile.Close();
		}

	},

	log: function(){
		//try{
			if ((logs.logfile === null) && (logs.logging == true)) { logs.init(); }
			var className = className || 'info';
			var str = '';
			
			for (var i = 0; i < arguments.length; i++) {
				
				//Если JSON объект
				if (typeof(arguments[i]) == 'object'){
					str += '<pre class="code">' + JSON.stringify(arguments[i], null, '\t') + '</pre>';
				}
				else {
					if (str) { str += ', '; }
					str += ' ' + arguments[i];
				}
				
			}
			
			

			if (!str){ str = ""; }
			str = "" +str; // Convert to string

			//Добавляем в классы в div
			var date = new Date();
			var time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
			str = '<div class="logs '+className+'"><span class="timeStamp">' + time + '</span>' + str + '</div>';
			
			if (logs.logfile) { logs.logfile.WriteLine(str.replace(/#/g," ")); }
			

		//}
		//catch(e){ }
	},

	info: function(str){
		logs.log(str);
	},

	error: function(str,callee){
		if (arguments.callee.caller){
			str += '<pre class="callerFunc">'+arguments.callee.caller.toString()+'</pre>';
		}
		
		logs.log(str,'error');
		
		if (arguments.callee.caller){
			log('<pre class="callerFunc">'+arguments.callee.caller.toString()+'</pre>','info');
		}
	},

	dpinst: {

		copy: function(){

			var path = path.replace(/\\/g,'_');
			try{
				if ((logs.logging) && (fso.FileExists(WshEnv("WINDIR")+"\\DPINST.LOG"))) {
					fso.CopyFile(WshEnv("WINDIR")+"\\DPINST.LOG", logs.logFolder+'\\DPINST'+logs.fileNameEnding+'_'+path+'.txt');
				}
			}
			catch(e){log("Failed to copy "+WshEnv("WINDIR")+"\\DPINST.LOG to "+logs.logFolder+'\\DPINST'+logs.fileNameEnding+'_'+path+'.txt');}

		},

		remove: function(){

			try{
				if (fso.FileExists(WshEnv("WINDIR")+"\\DPINST.LOG")){
					fso.getfile(WshEnv("WINDIR")+"\\DPINST.LOG").Delete();
				}
			}
			catch(e){log("Failed to remove "+WshEnv("WINDIR")+"\\DPINST.LOG");}

		}

	}

}
log = logs.log;

/*
console.log = logs.log;
console.info = logs.info;
console.warn = logs.warn;
console.error = logs.error;
*/
//warning error



/*
// Profiling and logging
var lasttime;
function reset_timer(str){
	log(str);
	lasttime = new Date();
}
function timer(str){
	var now = new Date();
	log(str+' (Time: '+(now.getTime()-lasttime.getTime())+' ms)');
}
function timer_new(str){
	timer(str);
	reset_timer();
}
*/
