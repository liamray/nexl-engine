const nexlSource = {
	// 1) doesn't affect for absolute file path
	// 2) if provided it must be an absolute path
	// 3) if provided, nexl engine makes sure that file path is located under the basePath ( i.e. files outside the basePath will be blocked )
	basePath: '/home/nexl-storage',

	// nexl source provided as file
	asFile: {
		// path to JavaScript file
		filePath: '/home/myFile.js'
	},

	// nexl source provided as JavaScript code
	asText: {
		// the JavaScript code
		text: 'myVar = 1; ...'
	}
};