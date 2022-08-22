var infile = File("d:/Liquify.msh");
infile.open("r");
infile.encoding = "binary";
var s = infile.read();
infile.close

var o = ""
for (var i = 0; i < s.length; i++) {
    o += s.charCodeAt(i) + ", "
}

var infile = File("d:/Liquify.txt");
infile.open("w");
infile.write(o);
infile.close