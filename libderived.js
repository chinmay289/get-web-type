// module.exports = function(params){

		var ineed = require('ineed');
		var fs = require('fs');
		var common = require('common-words');

		var bayes = require('bayes');
		var grouper = bayes();
		
		var wordlist = []

		var files = fs.readFileSync('filelist.js', 'utf8');
		files = JSON.stringify(files);
		files = JSON.parse(files);
		// console.log('FILES:\n',files);

		var removeCommonWords = function(words, common){
		  common.forEach(function(obj) {
		    var word = obj.word;
		    while (words.indexOf(word) !== -1) {
		      // console.log(words[words.indexOf(word)])	
		      words.splice(words.indexOf(word), 1);
		    }
		  });
		  return words;
		}

		var getExistingBayesObject = function(filename){
			fs.readFile('object.js', 'utf8', function(err, data){
				if(!err){
					var bayesClassifierObj = JSON.parse(data);
					console.log(bayesClassifierObj);
				}
			});	
		}

		var getWordsFromWebPageText = function(filename, category){
			
			fs.readFile(filename, 'utf8', function(err, data){
			// fs.readFile('filename, 'utf8', function(err, data){
				var html = data ;
				var subset = [] ;
				
				texts = ineed.collect.texts.fromHtml(html).texts;
				
				for(var i in texts){
					var lines = texts[i].split('\n');
					
					for(var line in lines){
						line = line.toLowerCase();
						var words = lines[line].split(' ');
						wordlist = wordlist.concat(words);
						subset = subset.concat(words);
					}
				
				}
				removeCommonWords(wordlist, common);
				learnWords(subset, category);
				
			});
		};

		var writeBayesObjectToFile = function(filename){
			fs.writeFile(filename, grouper.toJson(), function(err){
				if(!err){
					console.log('Category for shoes: ',grouper.categorize('shoes'));
					console.log("Done");
				}
				else{
					console.error("Error:", err);
				}
			});
		};

		var parseWebPages = function(){ 
			getWordsFromWebPageText(process.argv[2], process.argv[3]) ;
			getWordsFromWebPageText(process.argv[4], process.argv[5]) ;
			getWordsFromWebPageText(process.argv[6], process.argv[7]) ;
			// getWordsFromWebPageText(process.argv[4], process.argv[5]) ;
			writeBayesObjectToFile('object.js');
			// console.log('category:',grouper.categorize('shoes'));
				
			// learnWords();
			// var cat = grouper.categorize('money')
			// console.log(cat);
			// grouperObject = grouper.toJson());
			// var newGrouper = grouper.fromJson(classifierObject);
		}

		var getWordsFromWebPageTitle = function(){
			fs.readFile('sampleHtm.html', 'utf8', function(err, data){
				var html = data ;
				var result = ineed.collect.title.fromHtml(html).title;
				var words = result.split(' ');
				wordlist = wordlist.concat(words);
				removeCommonWords(wordlist, common);
				console.log(wordlist);
			})
		};
		
		parseWebPages();
		
		var learnWords = function(wordList, category){
			for(var i in wordList){
				grouper.learn(wordList[i], category);
			};
		}		
	
		// return parsedDataFromWebPage;
// }