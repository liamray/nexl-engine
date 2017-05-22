var PARSED_STR = {
	str: 'the original str',
	chunks: ['hello', 'world', null, 'test'],
	chunkSubstitutions: {
		2: 'NEXL_EXPRESSION_DEFINITION' // key points to a null value in chunks
	}
};


var NEXL_EXPRESSION_DEFINITION = {

	str: 'the original expression',

	length: 15,

	actions: [
		{
			actionId: '.', // for property resolution
			actionValue: {
				chunks: [],
				chunkSubstitutions: {
					0: 'NEXL_EXPRESSION_DEFINITION'
				}

			}
		},

		{
			actionId: '(', // for function call
			actionValue: [
				'NEXL_EXPRESSION_DEFINITION',
				'NEXL_EXPRESSION_DEFINITION'
			]
		},

		{
			actionId: '[', // for array indexes
			actionValue: {
				iterationExpression: 'NEXL_EXPRESSION_DEFINITION', // nexl expression for iteration. optional
				arrayIndexes: [
					{
						min: MIN,
						max: MAX // where MIN|MAX can be : primitive (negative) number, ^, $, nexl expression
					}
				]
			}
		},

		{
			actionId: '#', // array operations
			actionValue: 'S'
		},

		{
			actionId: '@', // default value
			actionValue: {
				chunks: [],
				chunkSubstitutions: {
					0: 'NEXL_EXPRESSION_DEFINITION'
				}

			}
		}

	]
};