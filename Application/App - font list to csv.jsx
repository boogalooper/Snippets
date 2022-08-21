/**Fonts.length Inaccuracy?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/fonts-length-inaccuracy/td-p/13051474
 */
const scriptName = 'Create Font List'
const scriptVersion = '1.0'
const summary = 'This tool exports a CSV containing information about the fonts in the font library'
CreateFontList()
function CreateFontList() {
    try {
        var row = [],
            s2t = stringIDToTypeID;
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('fontList'));
        r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
        var fontsList = executeActionGet(r).getObjectValue(p);
        row.push('font.name,font.family,font.style,font.postScriptName')
        var fontNames = fontsList.getList(s2t('fontName')),
            fontFamilyNames = fontsList.getList(s2t('fontFamilyName')),
            fontStyleNames = fontsList.getList(s2t('fontStyleName')),
            fontPostScriptNames = fontsList.getList(s2t('fontPostScriptName')),
            fontLen = fontsList.getList(s2t('fontPostScriptName')).count,
            recorded = 0;
        for (var i = 0; i < fontLen; i++) {
            row.push(
                [
                    fontNames.getString(i),
                    fontFamilyNames.getString(i),
                    fontStyleNames.getString(i),
                    fontPostScriptNames.getString(i)
                ].join(','))
            recorded++
        }
        var outFile = new File(Folder.desktop + '/FontList.csv')
        outFile.open('w')
        outFile.encoding = "UTF8"
        outFile.write(row.join('\n'))
        outFile.close()
        // font loop
        if (outFile.exists && !outFile.error) {
            const font_size = 14
            const btn_w = 135
            const btn_h = 35
            var win = new Window('dialog')
            win.text = scriptName + ' ' + scriptVersion
            var txt = win.add('statictext', undefined, undefined, { multiline: true })
            txt.text = [outFile.fullName + ' was created successfully.',
            'It contains the ' + recorded + ' fonts in your local library.',
            (fontLen - recorded) + ' fonts could not be recorded.'].join('\n\n')
            txt.graphics.font = 'dialog:' + font_size
            txt.preferredSize.width = 350
            txt.justify = 'center'
            var grp = win.add('group')
            var btn_Open = grp.add('button')
            btn_Open.text = 'Open List'
            btn_Open.graphics.font = 'dialog:' + font_size
            btn_Open.preferredSize = [btn_w, btn_h]
            var btn_OK = grp.add('button')
            btn_OK.text = 'OK'
            btn_OK.graphics.font = 'dialog:' + font_size
            btn_OK.preferredSize = [btn_w, btn_h]
            btn_Open.onClick = function () {
                outFile.execute()
                win.close()
            } // btn_Open.onClick
            win.show()
        } // if success
    } catch (e) { alert('CreateFontList ' + e) }
} // CreateFontList