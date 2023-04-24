/**
 * How to record javascript dialog input in Action?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-record-javascript-dialog-input-in-action/td-p/13711495
 */

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource> 
<name>Poser Frames</name> 
<menu>automate</menu>
<enableinfo>true</enableinfo>
<eventid>f35c20c1-2a5c-45d2-98e2-fead0d2bc8c3</eventid>
<terminology><![CDATA[<< /Version 1
					   /Events <<
					   /f35c20c1-2a5c-45d2-98e2-fead0d2bc8c3 [(Poser Frames) <<
					   /recipe [(Recipie text) /string]
					   /checkbox [(My checkbox) /boolean]
					   >>]
						>>
					 >> ]]></terminology>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/

var isCancelled = false,
	cfg = new Config;

main()

isCancelled ? 'cancel' : undefined

function main() {
	if (!app.playbackParameters.count) {
		//normal run (from scripts menu)
		if (displayDialog() == 2) { isCancelled = true; return } else {
			app.playbackParameters = cfg.toDescriptor();
		}
	}
	else {
		cfg.toObject(app.playbackParameters)
		if (app.playbackDisplayDialogs == DialogModes.ALL) {
			// user run action in dialog mode (edit action step)
			if (displayDialog() == 2) { isCancelled = true; return } else {
				app.playbackParameters = cfg.toDescriptor();
			}
		}
		if (app.playbackDisplayDialogs != DialogModes.ALL) {
			// user run script without recording
			alert('variable recordered in action:\nRecipie: ' + cfg.recipe + '\nCheckbox value: ' + cfg.checkbox);
		}
	}
}

function displayDialog() {
	var dialog = new Window("dialog");
	dialog.size = [500, 170];
	dialog.text = "Run Poser Frames with recipe";
	dialog.orientation = "column";
	dialog.alignChildren = ["left", "top"];
	dialog.spacing = 10;
	dialog.margins = 20;


	dialog.statictext1 = dialog.add("statictext", undefined, undefined, { name: "label" });
	dialog.statictext1.text = "Your recipe:";
	dialog.statictext1.alignment = ["fill", "top"];

	dialog.edittext1 = dialog.add("edittext", undefined, undefined, { multiline: true });
	dialog.edittext1.alignment = ["fill", "top"];
	dialog.edittext1.size = [400, 50];
	dialog.edittext1.text = cfg.recipe;

	dialog.checkbox = dialog.add('checkbox', undefined, 'sample text');
	dialog.checkbox.value = cfg.checkbox

	var submit = dialog.add("button", undefined, undefined, { name: "submit" });
	submit.text = "Run Poser Frames!";

	dialog.submit.onClick = function () {
		cfg.recipe = dialog.edittext1.text;
		dialog.close();
	};

	dialog.checkbox.onClick = function () { cfg.checkbox = this.value }

	return dialog.show();
}

function Config() {
	//defaults
	this.recipe = ''
	this.checkbox = false

	this.toDescriptor = function () {
		var d = new ActionDescriptor(),
			s2t = stringIDToTypeID;
		for (var i = 0; i < this.reflect.properties.length; i++) {
			var k = this.reflect.properties[i].toString();
			if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect") continue;
			var v = this[k];
			switch (typeof (v)) {
				case "boolean": d.putBoolean(s2t(k), v); break;
				case "string": d.putString(s2t(k), v); break;
			}
		}
		return d;
	}

	this.toObject = function (d) {
		var t2s = typeIDToStringID;
		for (var i = 0; i < d.count; i++) {
			var k = d.getKey(i);
			switch (d.getType(k)) {
				case DescValueType.BOOLEANTYPE: this[t2s(k)] = d.getBoolean(k); break;
				case DescValueType.STRINGTYPE: this[t2s(k)] = d.getString(k); break;
			}
		}
	}
}