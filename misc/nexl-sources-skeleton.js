const nexlSource = {
	basePath: '/home/nexl-storage', // optional
	filePath: '/home/myFile.js', // 1) mandatory if fileContent not provided; 2) optional if provided fileContent and there is no include directives with relative path ( otherwise nexl engine doesn't know what is to include )
	fileContent: 'myVar = 1; ...', // optional
	fileEncoding: 'UTF-8' // optional
};