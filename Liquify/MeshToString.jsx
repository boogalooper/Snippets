var infile = (new File).openDlg();
if (infile)
{
    infile.open("r");
    infile.encoding = "binary";
    var s = infile.read();
    infile.close

    var o = ""
    for (var i = 0; i < s.length; i++) {
        o += s.charCodeAt(i) + ", "
    }

    var infile = File(infile + '.txt');
    infile.open("w");
    infile.write(o);
    infile.close
}