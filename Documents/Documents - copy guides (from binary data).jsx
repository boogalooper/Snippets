/**
 * activeDocument array?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/activedocument-array/td-p/13482837
 */
var apl = new AM('application'),
  doc = new AM('document'),
  len = apl.getProperty('numberOfDocuments');
if (len && doc.getProperty('numberOfGuides')) {
  var activeDocumentW = doc.getProperty('width'),
    activeDocumentH = doc.getProperty('height'),
    activeDocumentIdx = doc.getProperty('itemIndex'),
    docs = [];
  for (var i = 1; i <= len; i++) {
    if (i == activeDocumentIdx) continue;
    if (doc.getProperty('width', i, true) == activeDocumentW && doc.getProperty('height', i, true) == doc.getProperty('height', i, true) && !doc.getProperty('numberOfGuides', i, true)) {
      docs.push(doc.getProperty('itemIndex', i, true))
    }
  }
  if (docs.length) {
    doc.duplicate()
    doc.flatten()
    doc.fillBlack()
    activeDocument.xmpMetadata.rawData = '';
    var f = new File(Folder.temp.fsName + '/' + 'guides.jpg');
    doc.saveAsJPG(f, 0)
    doc.closeDocument()
    var guides = getGuidesFromFile(f);
    if (guides.length) {
      do {
        doc.selectDocument(docs.shift())
        for (var i = 0; i < guides.length; i++) {
          doc.makeGuide(guides[i].position, guides[i].orientation)
        }
      } while (docs.length)
      doc.selectDocument(activeDocumentIdx)
    }
  }
}
function getGuidesFromFile(f) {
  var guides = [];
  if (f.exists) {
    f.open('r');
    f.encoding = 'BINARY';
    var s = f.read();
    f.close();
    f.remove();
    var i = s.indexOf('8BIM' + String.fromCharCode(04, 08)) //guides resource ID 0x0408
    if (i != -1) {
      s = s.substr(i + 24) //skip header and go to fGuideCount 
      var len = parseInt(toHex(s, 0, 4), 16);//read 4 bytes of fGuideCount
      $.writeln(len)
      s = s.substr(4)
      if (len) {
        for (var i = 0; i < len; i++) {
          var cur = toHex(s, i * 5, 5);
          guides.push({
            position: parseInt(cur.substr(0, 8), 16) / 32,
            orientation: parseInt(cur.substr(8, 2), 16),
          })
        }
      }
    }
  }
  return guides;
}
function toHex(s, from, bits) {
  s = s.substr(from, bits);
  var h = '';
  for (var i = 0; i < bits; i++) h += (('0' + s.charCodeAt(i).toString(16)).slice(-2));
  return h
}
function hextoDec(val) {
  var hex = val.split('').reverse().join(''),
    dec = 0;
  for (var i = 0; i < hex.length; i++) {
    dec += parseInt(hex[i], 16) * Math.pow(16, i);
  }
  return dec;
}
function AM(target) {
  var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
  target = target ? s2t(target) : null;
  this.getProperty = function (property, id, idxMode) {
    property = s2t(property);
    (r = new ActionReference()).putProperty(s2t('property'), property);
    id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
      r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
    return getDescValue(executeActionGet(r), property)
  }
  this.hasProperty = function (property, id, idxMode) {
    property = s2t(property);
    (r = new ActionReference()).putProperty(s2t('property'), property);
    id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
      : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
    return executeActionGet(r).hasKey(property)
  }
  this.duplicate = function () {
    (r = new ActionReference()).putClass(s2t('document'));
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    (r1 = new ActionReference()).putProperty(charIDToTypeID('HstS'), s2t('currentHistoryState'));
    d.putReference(s2t('using'), r1);
    executeAction(s2t('make'), d, DialogModes.NO);
  }
  this.flatten = function () {
    executeAction(s2t('flattenImage'), undefined, DialogModes.NO);
  }
  this.fillBlack = function () {
    (d = new ActionDescriptor()).putEnumerated(s2t('using'), s2t('fillContents'), s2t('black'));
    d.putUnitDouble(s2t('opacity'), s2t('percentUnit'), 100);
    d.putEnumerated(s2t('mode'), s2t('blendMode'), s2t('normal'));
    executeAction(s2t('fill'), d, DialogModes.NO);
  }
  this.saveAsJPG = function (f, q) {
    (d = new ActionDescriptor()).putInteger(s2t('extendedQuality'), q);
    d.putEnumerated(s2t('matteColor'), s2t('matteColor'), s2t('none'));
    (d1 = new ActionDescriptor()).putObject(s2t('as'), s2t('JPEG'), d);
    d1.putPath(s2t('in'), f);
    executeAction(s2t('save'), d1, DialogModes.NO);
  }
  this.closeDocument = function () {
    (d = new ActionDescriptor()).putEnumerated(s2t('saving'), s2t('yesNo'), s2t('no'));
    executeAction(s2t('close'), d, DialogModes.NO);
  }
  this.makeGuide = function (position, orientation) {
    (d = new ActionDescriptor()).putUnitDouble(s2t('position'), s2t('pixelsUnit'), position);
    d.putEnumerated(s2t('orientation'), s2t('orientation'), s2t(orientation ? 'horizontal' : 'vertical'));
    (d1 = new ActionDescriptor()).putObject(s2t('new'), s2t('guide'), d);
    executeAction(s2t('make'), d1, DialogModes.NO);
  }
  this.selectDocument = function (idx) {
    (r = new ActionReference()).putIndex(s2t('document'), idx);
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    executeAction(s2t('select'), d, DialogModes.NO)
  }
  function getDescValue(d, p) {
    switch (d.getType(p)) {
      case DescValueType.OBJECTTYPE: return { type: t2s(d.getObjectType(p)), value: d.getObjectValue(p) };
      case DescValueType.LISTTYPE: return d.getList(p);
      case DescValueType.REFERENCETYPE: return d.getReference(p);
      case DescValueType.BOOLEANTYPE: return d.getBoolean(p);
      case DescValueType.STRINGTYPE: return d.getString(p);
      case DescValueType.INTEGERTYPE: return d.getInteger(p);
      case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(p);
      case DescValueType.DOUBLETYPE: return d.getDouble(p);
      case DescValueType.ALIASTYPE: return d.getPath(p);
      case DescValueType.CLASSTYPE: return d.getClass(p);
      case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(p));
      case DescValueType.ENUMERATEDTYPE: return { type: t2s(d.getEnumerationType(p)), value: t2s(d.getEnumerationValue(p)) };
      default: break;
    };
  }
}
