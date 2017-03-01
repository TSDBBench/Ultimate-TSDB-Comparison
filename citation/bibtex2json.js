var fs = require('fs');
var pandoc = require('node-pandoc');

/**
 * file: input bib file
 * enc: encoding of the bib file
 * outfilepath: path of the out files (fkeys.json, fbib.json)
 */
var parseBib = function(file,enc,csl,outfile, callback){
    enc = enc? enc : "utf8";
    if(!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');
    try {
        var bib_file = fs.readFileSync(file, enc);
        var csl_file = fs.readFileSync(csl, enc);
        // extract keys from bibtex file 
        var regex = /(?:@[^\{]*\{)([^,]*)/g;
        var match = regex.exec(bib_file);
        // create tmp file 'keys.txt' with json structure: {"key_1":"[@key]",...,"key_n":"[@key_n]"}
        var filecontent = "{\n";
        while (match != null){
            filecontent += '"' + match[1] + '":"[@' + match[1] + ']",\n';
            match = regex.exec(bib_file);
        }
        filecontent = filecontent.substr(0,filecontent.length-2) + "\n}";
        fs.writeFile("./tmp/keys.txt", filecontent, function(err) {if(err) return console.log(err);}); 
        
        // pandoc parse keys.txt with csl file and bib file
        var args = "--bibliography "+ file +" --csl " + csl + " -o ./tmp/keys.html"
        var pandoccallback = function(err, result){
            if(err) {return console.error('Error: ', err )};
            extractFormatedKeys(outfile);
            extractFormatedBib(outfile);
            callback();
        }    
        pandoc('./tmp/keys.txt',args,pandoccallback);
    } catch (err){
        console.log("No .bib file or .csl file found!")
        if(!fs.existsSync(outfile)) fs.mkdirSync(outfile);
        fs.writeFile(outfile + "/fkeys.json", "{}", function(err) {if(err) return console.log(err);});
        fs.writeFile(outfile + "/fbib.json", "{}", function(err) {if(err) return console.log(err);});
        callback();
    }
    
}

var extractFormatedKeys = function(filepath){
    var htmlfile = fs.readFileSync('./tmp/keys.html', 'utf8');
    var regex = /(?:<p>)(\{[^\}]*\})(?:<\/p>)/m;
    var match = regex.exec(htmlfile);
    var result = match ? match[1] : "";
    
    result = result.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
    result = result.replace(/&quot;/g, function(match, dec) {
        return '"';
    });
    result = result.replace(/<[^>]+>/g, function(match, dec) {
        return '';
    });
    result = result.replace(/,/g, function(match, dec) {
        return ',\n';
    });
    if(!fs.existsSync(filepath)) fs.mkdirSync(filepath);
    return fs.writeFile(filepath + "/fkeys.json", result, function(err) {if(err) return console.log(err);}); 
}

var extractFormatedBib = function(filepath){
    var htmlfile = fs.readFileSync('./tmp/keys.html', 'utf8');
    var regex = /(<div id="refs" class="references">[\w\W]*<\/div>)/m;
    var match = regex.exec(htmlfile);
    var result = match ? match[0] : "";
    
    regex = /(?:<div id="ref-)(.*)(?:">)([\W\w]*?)(?:<\/div>)/gm;
    match = regex.exec(result);
    var filecontent = "{\n";
    while (match != null){
        var line = ('"' + match[1] + '":' + JSON.stringify(match[2].trim()) + ',\n').replace(/\n/g, '');
        filecontent += line + '\n';
        match = regex.exec(result);
    }
    filecontent = filecontent.substr(0,filecontent.length-2) + "\n}";
    
    if(!fs.existsSync(filepath)) fs.mkdirSync(filepath);
    return fs.writeFile(filepath + "/fbib.json", filecontent, function(err) {if(err) return console.log(err);});    
} 

module.exports = {
    parse: parseBib
}