const nexlSource = {
	// 1) doesn't affect for absolute path 2) must provided for [asTest] option ??? 3) if provided, nexl engine makes sure that file path is located under the basePath ( i.e. files outside the basePath will be blocked )
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