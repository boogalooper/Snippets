/**Event listener
 * @r-bin
 */

<javascriptresource>

<name>Script Events Listener...</name>

<category>scriptevents</category>

</javascriptresource>

var log_name = "~/Desktop/EventListener.log";

var dsc_name = "d";

var lst_name = "list";

var ref_name = "r";

var dsc_numb = 0;

var lst_numb = -1;

var ref_numb = -1;

var tab = "    ";

var silent = false;

var events_CS6 = [ "All " ];

var events_CC = [

"TdT ","Avrg","ASty","Asrt","AccE","Add ","AdNs","AddT","Algn","AngS","AppI","BsRl","Btch","BtcF","Blr ","BlrM","Brdr","BrgC","CnvS","ChlC","ChnM",

"Chrc","Chrm","Cler","Cls ","Clds","ClrB","ClrH","ClrR","ClrP","CntC","Cntc","CnvM","copy","CpFX","CpyM","CpTL","Crql","CrtD","Crop","Crsh","Crst",

"Crvs","Cstm","cut ","CtTL","Ct  ","DrkS","Dntr","DfnP","Dfrg","Dlt ","Dstt","Dslc","Dspc","DfrC","Dfs ","DfsG","dlfx","Dspl","Dstr","Draw","DryB",

"Dplc","DstS","Embs","Eqlz","Exch","Expn","Expr","Extr","Fct ","Fade","Fthr","Fbrs","Fl  ","FlmG","Fltr","FndE","FltI","Flip","Frgm","Frsc","GsnB",

"getd","Gls ","GlwE","Grdn","GrMp","Grn ","GraP","GrpL","Grow","HlfS","Hd  ","HghP","HsbP","HStr","ImgS","Impr","InkO","Intr","IntW","Invs","Invr",

"LnsF","Lvls","LghE","Lnk ","Mk  ","Mxm ","Mdn ","Mrg2","MrgL","MSpt","MrgV","Mztn","Mnm ","Msc ","MscT","MtnB","move","NTSC","NGlw","Nxt ","NtPr",

"Ntfy","null","OcnR","Ofst","Opn ","Pnt ","PntD","PltK","past","PaFX","PstI","PstO","Ptch","Phtc","Pnch","Plc ","Plst","PlsW","Ply ","Pntl","Plr ",

"PstE","Pstr","Prvs","Prnt","PrfT","Prge","quit","RdlB","Rstr","RstT","RmvB","RmvL","RmvW","Rnm ","RplC","Rset","Rtcl","Rvrt","Rple","Rtte","RghP",

"save","slct","SlcC","setd","ShrE","Shrp","ShrM","Shr ","Shw ","Smlr","SmrB","Smth","SmdS","Slrz","Spt ","Sphr","SplC","Spng","SprS","StnG","Stmp",

"Stop","Strk","Sbtr","SbtF","Smie","TkMr","TkSn","TxtF","Txtz","Thrs","Tls ","TrnE","TrcC","Trnf","Trap","Twrl","Undr","undo","Ungr","Unlk","UnsM",

"Vrtn","Wait","WtrP","Wtrc","Wave","Wnd ","ZgZg",

"BacL","FilE","ColE","OpnU",

"rigidTransform",

"perspectiveWarpTransform",

"Adobe Camera Raw Filter",

"smartBrushWorkspace",

"focusMask",

];

if (!arguments.length) 

    {

    var events = (parseInt(app.version)==13)?events_CS6:events_CC;

    var d = new Window("dialog", "Event Listener 0.01")

    d.orientation = "row";

    d.spacing = 20;

    d.margins = 20;

    var b1 = d.add("button", undefined, "Enable");

    var b2 = d.add("button", undefined, "Disable");

    b1.onClick = function()

        {

        d.close();

        for (var i = 0; i < events.length; i++) enable_notifier(events, $.fileName);

        alert("Event Listener Enabled!", " ")

        }

    b2.onClick = function()

        {

        d.close();

        for (var i = 0; i < events.length; i++) disable_notifier(events, $.fileName);

        alert("Event Listener Disabled!", " ")

        }

    d.show();

    }

if (arguments.length >= 2) main(arguments[0], arguments[1]);

//////////////////////////////////////////////////////////////////////////

function main()

    {

    try 

        { 

        var func_name = typeIDToStringID(arguments[1]);

        if (!func_name) func_name = typeIDToChar(arguments[1]);

        if (func_name.toLowerCase().indexOf("modalstate")    >= 0) return;

        if (func_name.toLowerCase().indexOf("invokecommand") >= 0) return;

        if (func_name.toLowerCase().indexOf("togglebrushesflyout") >= 0) return;

        var msg = null;

        if (!silent)           

            {

            msg = new Window("palette", "Event Listener", undefined, {independent:true} );

            msg.preferredSize.width = 150;  

            msg.txt = msg.add("statictext", undefined, func_name);

            msg.show();

            }

        var file = new File(log_name);

        file.open("a");

        file.writeln("///////////////////////////////////////////////////////////////////////////////");  

        file.writeln("function " + func_name + "_" + Math.random().toString().substr(2) + " ()");  

        file.writeln(tab + "{");  

        file.writeln(tab + "try {"); 

        file.writeln(parse_desc(arguments[0]));

        file.writeln(tab + tab + "executeAction(" + k2s(arguments[1]) + ", d, DialogModes.NO);");  

        file.writeln(tab + tab + "}");

        file.writeln(tab + "catch (e) { throw(e); }");

        file.writeln(tab + "}");

        file.writeln("");

        file.close();

        if (msg)

            {

            msg.close();

            msg = null;

            }

        }

    catch (e) { _alert(e); }

    }

//////////////////////////////////////////////////////////////////////////

function _alert(e)

    { 

    if (e.number != 8007) 

        {

        alert("Line: " + e.line + "\n\n" +  e, "Bug!", true); 

        }           

    }

//////////////////////////////////////////////////////////////////////////

function enable_notifier(event_name, script_name, event_class)

    {

    try 

        {

        for (var i = 0; i < app.notifiers.length; i++)

            {

            if (app.notifiers.event == event_name &&

                File(app.notifiers.eventFile).fsName.toLowerCase() == File(script_name).fsName.toLowerCase())

                {

                if (!app.notifiersEnabled) app.notifiersEnabled = true;

                return true;

                }

            }

        app.notifiers.add(event_name, File(script_name), event_class);

        app.notifiersEnabled = true;

        return true;

        }

    catch (e) { _alert(e); return false; }

    }

//////////////////////////////////////////////////////////////////////////

function disable_notifier(event_name, script_name, event_class)

    {

    try 

        {

        var ret = false;

        for (var i = 0; i < app.notifiers.length; i++)

            {

            if (app.notifiers.event == event_name &&

                File(app.notifiers.eventFile).fsName.toLowerCase() == File(script_name).fsName.toLowerCase())

                {

                app.notifiers.remove();

                ret = true;

                }

            }

        if (!app.notifiers.length) app.notifiersEnabled = false;

        return ret;

        }

    catch (e) { _alert(e); return false; }

    }

//////////////////////////////////////////////////////////////////////////

function k2s(key)

    {

    try 

        {

        var str = typeIDToStringID(key);

        var chr = typeIDToCharID(key);

        switch (chr)

            {

            case "Gd  ": str = "guide";  break;

            case "Grn ": str = "green";  break;

            case "Grns": str = "greens"; break;

            case "Pnt ": str = "point";  break;

            case "Rds ": str = "";       break;

            }

        if (str) return "stringIDToTypeID(\"" + str + "\")";

        else if (chr) return "charIDToTypeID(\"" + chr + "\")";

        else return "Bug!";

        }

    catch (e) { throw(e); }

    }

////////////////////////////////////////////////////////////////////////////////////////////

function dat(s)

    {

    try 

        {

        var ret = "String.fromCharCode(";

        for (var i = 0; i < s.length; i++) 

            {

            var h = s.charCodeAt(i).toString(16).toUpperCase();

            if (h.length == 1) h = "0" + h;

            ret += "0x" + h;

            if (i != s.length-1) ret += ",";

            }

        ret += ")";

        

        return ret;

        }

    catch (e) { throw(e); }

    }

//////////////////////////////////////////////////////////////////////////

function parse_desc(desc)

    {

    try 

        {

        var name = dsc_name + (dsc_numb?dsc_numb:"");

        var code = (dsc_numb?"":(tab + tab)) + "var " + name + " = new ActionDescriptor();";

        for (var i = 0; i < desc.count; i++)

            {

            var key  = desc.getKey(i);

            var type = desc.getType(key);

            var str = "// UNNKOWN TYPE!"; 

            var var_numb;

            switch (type) 

                {

                case DescValueType.OBJECTTYPE:    ++dsc_numb; var_numb = dsc_numb; str = parse_desc(desc.getObjectValue(key)) + "\n" + tab + tab + name + ".putObject(" + k2s(key)    + ", " + k2s(desc.getObjectType(key)) + ", " + dsc_name + (var_numb?var_numb:"") + ");"; break;

                case DescValueType.LISTTYPE:      ++lst_numb; var_numb = lst_numb; str = parse_list(desc.getList(key))        + "\n" + tab + tab + name + ".putList("   + k2s(key)    + ", " + lst_name + (var_numb?var_numb:"") + ");"; break;

                case DescValueType.REFERENCETYPE: ++ref_numb; var_numb = ref_numb; str = parse_ref(desc.getReference(key))    + "\n" + tab + tab + name + ".putReference(" + k2s(key) + ", " + ref_name + (var_numb?var_numb:"") + ");"; break;

                case DescValueType.CLASSTYPE:        str = name + ".putClass(" + k2s(key) + ", " + k2s(desc.getClass(key))   + ");"; break;

                case DescValueType.RAWTYPE:          str = name + ".putData("  + k2s(key) + ", " + dat(desc.getData(key))    + ");"; break;; 

                case DescValueType.BOOLEANTYPE:      str = name + ".putBoolean("      + k2s(key) + ", " + desc.getBoolean(key)      + ");"; break;

                case DescValueType.INTEGERTYPE:      str = name + ".putInteger("      + k2s(key) + ", " + desc.getInteger(key)      + ");"; break;

                case DescValueType.DOUBLETYPE:       str = name + ".putDouble("       + k2s(key) + ", " + desc.getDouble(key)       + ");"; break;

                case DescValueType.LARGEINTEGERTYPE: str = name + ".putLargeInteger(" + k2s(key) + ", " + desc.getLargeInteger(key) + ");"; break;

                case DescValueType.STRINGTYPE:       str = name + ".putString(" + k2s(key) +          ", \"" + desc.getString(key) + "\");";  break;

                case DescValueType.ALIASTYPE:        str = name + ".putPath("   + k2s(key) + ", new File(\"" + desc.getPath(key)   + "\"));"; break;

                case DescValueType.UNITDOUBLE:       str = name + ".putUnitDouble(" + k2s(key) + ", " + k2s(desc.getUnitDoubleType(key))  + ", " + desc.getUnitDoubleValue(key)       + ");"; break;

                case DescValueType.ENUMERATEDTYPE:   str = name + ".putEnumerated(" + k2s(key) + ", " + k2s(desc.getEnumerationType(key)) + ", " + k2s(desc.getEnumerationValue(key)) + ");"; break;

                }

            code += "\n" + tab + tab + str;

            }

        return code;

        }

    catch (e) { _alert(e); throw(e); }

    }

//////////////////////////////////////////////////////////////////////////

function parse_list(list)

    {

    try 

        {

        var name = lst_name + (lst_numb?lst_numb:"");

        var code = "var " + name + " = new ActionList();";

        for (var i = 0; i < list.count; i++)

            {

            var type = list.getType(i);

            var str = "// UNNKOWN TYPE!"; 

            var var_numb;

            switch (type) 

                {

                case DescValueType.OBJECTTYPE:    ++dsc_numb; var_numb = dsc_numb; str = parse_desc(list.getObjectValue(i)) + "\n" + tab + tab + name + ".putObject("    + k2s(list.getObjectType(i)) + ", " + dsc_name + (var_numb?var_numb:"") + ");"; break;

                case DescValueType.LISTTYPE:      ++lst_numb; var_numb = lst_numb; str = parse_list(list.getList(i))        + "\n" + tab + tab + name + ".putList("      + lst_name + (var_numb?var_numb:"") + ");"; break;

                case DescValueType.REFERENCETYPE: ++ref_numb; var_numb = ref_numb; str = parse_ref(list.getReference(i))    + "\n" + tab + tab + name + ".putReference(" + ref_name + (var_numb?var_numb:"") + ");"; break;

                case DescValueType.CLASSTYPE:        str = name + ".putClass(" + k2s(list.getClass(i)) + ");"; break;

                case DescValueType.RAWTYPE:          str = name + ".putData("  + dat(desc.getData(i))  + ");"; break;; 

                case DescValueType.BOOLEANTYPE:      str = name + ".putBoolean("      + list.getBoolean(i)      + ");"; break;

                case DescValueType.INTEGERTYPE:      str = name + ".putInteger("      + list.getInteger(i)      + ");"; break;

                case DescValueType.DOUBLETYPE:       str = name + ".putDouble("       + list.getDouble(i)       + ");"; break;

                case DescValueType.LARGEINTEGERTYPE: str = name + ".putLargeInteger(" + list.getLargeInteger(i) + ");"; break;

                case DescValueType.STRINGTYPE:       str = name + ".putString(" +          "\"" + list.getString(i) + "\");";  break;

                case DescValueType.ALIASTYPE:        str = name + ".putPath("   + "new File(\"" + list.getPath(i)   + "\"));"; break;

                case DescValueType.UNITDOUBLE:       str = name + ".putUnitDouble(" + k2s(list.getUnitDoubleType(i))  + ", " + list.getUnitDoubleValue(i)       + ");"; break;

                case DescValueType.ENUMERATEDTYPE:   str = name + ".putEnumerated(" + k2s(list.getEnumerationType(i)) + ", " + k2s(list.getEnumerationValue(i)) + ");"; break;

                }

            code += "\n" + tab + tab + str;

            }

        return code;

        }

    catch (e) { _alert(e); throw(e); }

    }

////////////////////////////////////////////////////////////////////////////////////////////

function parse_ref(ref)

    {

    try 

        {

        var name = ref_name + (ref_numb?ref_numb:"");

        var code = "var " + name + " = new ActionReference();";

        while (1)

            {

            var ok = true;

            try { var type = ref.getForm(); } catch (e) { ok = false; }

            if (!ok) break;

            var str = "// UNNKOWN TYPE!"; 

            switch (type) 

                {

                case ReferenceFormType.ENUMERATED: str = name + ".putEnumerated(" + k2s(ref.getDesiredClass()) + ", " + k2s(ref.getEnumeratedType()) + ", " + k2s(ref.getEnumeratedValue()) + ");"; break;

                case ReferenceFormType.CLASSTYPE:  str = name + ".putClass("      + k2s(ref.getDesiredClass()) + ");"; break;

                case ReferenceFormType.IDENTIFIER: str = name + ".putIdentifier(" + k2s(ref.getDesiredClass()) + ", " + ref.getIdentifier() + ");"; break;

                case ReferenceFormType.INDEX:      str = name + ".putIndex("      + k2s(ref.getDesiredClass()) + ", " + ref.getIndex()      + ");"; break;

                case ReferenceFormType.OFFSET:     str = name + ".putOffset("     + k2s(ref.getDesiredClass()) + ", " + ref.getOffset()     + ");"; break;

                case ReferenceFormType.NAME:       str = name + ".putName("       + k2s(ref.getDesiredClass()) + ", \"" + ref.getName()   + "\");"; break;

                case ReferenceFormType.PROPERTY:   str = name + ".putProperty("   + k2s(ref.getDesiredClass()) + ", " + k2s(ref.getProperty())  + ");"; break;

                }

            code += "\n" + tab + tab + str;

            try { ref = ref.getContainer(); } catch (e) { ok = false; }

            if (!ok) break;

            }

        return code;

        }

    catch (e) { _alert(e); throw(e); }

    }