//	https://forums.adobe.com/thread/2254681	/	CS5.1	/	Kukurykus	/	25.12.16

//	it finds all 4 character codes from 18`974`736 used in Photoshop and write them in a file on Desktop

#target photoshop

function SPC(v) {spc = ''; while(spc.length < v) {spc += '\u00A0'}; return spc}
function rw(v1, v2, v3) {v2.open(v1), v1 < 'w' ? v3 = v2.read() : v2.write(v3), v2.close(); return v3};

var lst = [], ESC, I = 0, esc = false, ARR = [];

(win = new Window("dialog",  SPC(6) + 'Would you like:')).margins = 5; win.spacing = 5
for(var i = 0; i <= 1; i++) {
	win.add('radiobutton', undefined, !i ?'Slower with progressBar,' : 'or 1 / 4 faster without ?')
}
win.ok = win.add ("button", [0, 0, 160, 29], "OK", {name:'close'}), win.children[0].value = true, win.show()
yon = win.children[0].value == true ? true : false

ASC =[], arr = [], asc(32, 33), asc(35, 36), asc(48, 58), asc(64, 91), asc(94, 95), asc(97, 123)
function asc(v1, v2){for(i = v1; i < v2; i++) {ASC.push(String.fromCharCode(v1++))}}

function spd(v) {
	function pgb(v) {
			eval("win.bar = (win = new Window('palette', (txt = 'Wait to end of this process...') &&\
			yon ? SPC(3) + txt : ''))" + (yon ?".add('progressbar', [0,0,177.9, 35], n = 0, w = 1779)" :
			".add('statictext {text:' + uneval(txt) + '}')")), win.margins = 5; return win
	}
	(function beg(){try{PGB= pgb(v), win.show(), refresh()} catch(errBef) {beg()}})()
}

SPD = spd(yon);	// as result 1/3 slower with progressBar, or faster without

(function rot(v) {
	try{
		function prc(v) {
			for(i = v; i < len = ASC.length; i++) {for(j = 0; j <len; j++) {for(k = 0; k < len; k++) {for(l = 0; l < len; l++) {
				(str = typeIDToStringID(charIDToTypeID(chr = ASC[i] + ASC[j] + ASC[k] + ASC[l]))) ? 
				(arr.push('\n"'  + chr + '"' + (function(){for(s = ' ', (S = 30 - str.length), L = 0; L <= S; L++) s += ' '; return s})() + str),
				yon ? (n++, ((n == w) || !(n % 100)) ? (PGB.bar.value = n + 1, refresh()) : n) : null) : null
				if (esc) (lst.push(arr[arr.length - 1].match(/.*$/))), ESC = esc, esc = false
			}}}}
		}
		prc(v || 0)
	}
	catch(err) {
		win.close(), bol = false; function okn() {
			grp = (win = new Window('dialog')).add('group')
			cnt = grp.add('button', undefined, 'Continue'), cnl = grp.add('button', undefined, 'Cancel')
			cnt.onClick = function () {win.close(), bol = true,  esc = true, SPD = spd(yon), n = arr.length, PGB.bar.value = n, rot(i)}
			cnl.onClick = function () {win.close(), bol = true}, win.show()
		}
		while (!bol) okn()
	}
})()

rw('w', File('~/Desktop/cs.txt'), (STR = "String(arr).replace(/,/g, '')") && lst.length ?
(function(){while(lst.length) {var r = (r || eval(STR)).replace(RegExp('((?:[\\w #@^]*\\n)*)(' + lst[0] + 
')\\n(?:[\\w #@^]*\\n)*?' + lst[0] + '((?:\\n[\\w #@^]*)*)', 'g'), '$1$2$3'); LST = lst.shift()}; return r})() : eval(STR))