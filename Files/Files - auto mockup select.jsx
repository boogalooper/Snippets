#target photoshop

(function () {
    var s2t = stringIDToTypeID;
    var c2t = charIDToTypeID;

    // Silent by design: any ambiguity/error => no action.
    try {
        if (getDocumentCount() !== 2) return;

        // Hot path: exactly two narrow property reads after document count.
        // documentID is not queried unless a replacement is really needed.
        var f1 = getDocumentFile(1);
        var f2 = getDocumentFile(2);
        if (!f1 || !f2) return;

        // ----- Fast numeric mode (1..99, optional group) -----
        // This path preserves the original speed: no folder enumeration while
        // the already-open numeric mockup is correct.
        var n12 = makeNumericPair(1, f1, 2, f2);
        var n21 = makeNumericPair(2, f2, 1, f1);

        if (n12 || n21) {
            // Numeric interpretation must be unique. Do not fall back to text
            // if both orientations look numeric: ambiguity means no action.
            if (!!n12 === !!n21) return;

            var np = n12 || n21;

            if (numericMockupMatchesWork(np.mockup, np.work)) return;

            // Normal cases use direct File.exists probes. Directory scanning is
            // only a rare fallback when the naming family itself changed.
            var numericTarget = findNumericMockupFile(
                np.mockupFile.parent,
                np.mockup,
                np.work
            );
            if (!numericTarget) return;

            replaceMockup(np.mockupIndex, np.mockupFile, numericTarget);
            return;
        }

        // ----- Text-key mode -----
        // Examples:
        //   work folder "М"  -> "15x20 М.tif"
        //   work folder "Ж"  -> "15x20 ж.psd"
        // First build both orientations WITHOUT enumerating folders. If one
        // currently-open mockup is already a strong match, stop immediately.
        var tc12 = makeTextCandidate(1, f1, 2, f2);
        var tc21 = makeTextCandidate(2, f2, 1, f1);

        var strong12 = tc12 && tc12.currentRank >= 2;
        var strong21 = tc21 && tc21.currentRank >= 2;
        if (strong12 || strong21) {
            if (!!strong12 === !!strong21) return;
            return; // The uniquely identified current mockup is already correct.
        }

        var t12 = tc12 ? resolveTextCandidate(tc12) : null;
        var t21 = tc21 ? resolveTextCandidate(tc21) : null;
        if (!!t12 === !!t21) return;

        var tp = t12 || t21;
        if (sameFile(tp.mockupFile, tp.targetFile)) return;

        replaceMockup(tp.mockupIndex, tp.mockupFile, tp.targetFile);
    } catch (_) {}


    // ---- Minimal ActionManager property reads ----

    function getDocumentCount() {
        var p = s2t('numberOfDocuments');
        var r = new ActionReference();
        r.putProperty(s2t('property'), p);
        r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
        return executeActionGet(r).getInteger(p);
    }

    function getDocumentFile(index) {
        try {
            var p = s2t('fileReference');
            var r = new ActionReference();
            r.putProperty(s2t('property'), p);
            r.putIndex(s2t('document'), index);
            var d = executeActionGet(r);
            return d.hasKey(p) ? d.getPath(p) : null;
        } catch (_) {
            return null;
        }
    }

    function getDocumentID(index) {
        try {
            var p = s2t('documentID');
            var r = new ActionReference();
            r.putProperty(s2t('property'), p);
            r.putIndex(s2t('document'), index);
            return executeActionGet(r).getInteger(p);
        } catch (_) {
            return -1;
        }
    }

    function getActiveDocumentID() {
        try {
            var p = s2t('documentID');
            var r = new ActionReference();
            r.putProperty(s2t('property'), p);
            r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
            return executeActionGet(r).getInteger(p);
        } catch (_) {
            return -1;
        }
    }


    // ---- Numeric matching ----

    function makeNumericPair(mockupIndex, mockupFile, workIndex, workFile) {
        var mockupName = fileName(mockupFile);
        if (!isLayoutExtension(extensionOf(mockupName))) return null;

        var mockup = parseNumericMockupName(mockupName);
        if (!mockup) return null;

        var work;
        try {
            work = parseNumericFolder(fileName(workFile.parent));
        } catch (_) {
            return null;
        }
        if (!work) return null;

        return {
            mockupIndex: mockupIndex,
            mockupFile: mockupFile,
            workIndex: workIndex,
            workFile: workFile,
            mockup: mockup,
            work: work
        };
    }

    function parseNumericMockupName(name) {
        var dot = name.lastIndexOf('.');
        if (dot <= 0 || dot === name.length - 1) return null;

        var base = name.substring(0, dot);
        // The first standalone 1..99 token from the left is the layout index.
        // Later standalone numbers belong to the family/variant name:
        // "08 ДШ 15" => index 8.
        var t = findFirstStandaloneNumber(base);
        if (!t) return null;

        var simple = parseNumericBase(base);

        return {
            number: t.number,
            tokenStart: t.start,
            tokenEnd: t.end,
            tokenWidth: t.end - t.start,
            base: base,
            normalizedBase: normalizeText(base),
            extension: name.substring(dot + 1).toLowerCase(),
            isSimple: !!simple,
            groupKey: simple ? simple.groupKey : ''
        };
    }

    // Work folders keep the strict convention: "2", "02", "02 А", etc.
    function parseNumericFolder(text) {
        var p = parseNumericBase(text);
        if (!p) return null;
        return {
            number: p.number,
            numberGroup: p.groupKey
        };
    }

    function parseNumericBase(text) {
        text = trim(text);
        var m = /^(\d{1,2})(?:\s+(.+?))?$/.exec(text);
        if (!m) return null;

        var n = parseInt(m[1], 10);
        if (n < 1 || n > 99) return null;

        return {
            number: n,
            groupKey: normalizeText(m[2] ? m[2] : '')
        };
    }

    // Finds the first independent numeric token 1..99 from left to right.
    // A digit touching a letter/digit is not an index, so 15x20 / 450х320 /
    // IMG123 are skipped. Later standalone numbers are intentionally ignored:
    // "08 ДШ 15" uses 08 as the layout index.
    function findFirstStandaloneNumber(text) {
        var i = 0;
        var n = text.length;

        while (i < n) {
            var c = text.charAt(i);
            if (c < '0' || c > '9') {
                i++;
                continue;
            }

            var start = i;
            while (i < n) {
                c = text.charAt(i);
                if (c < '0' || c > '9') break;
                i++;
            }
            var end = i;

            if (end - start > 2) continue;

            var leftOK = start === 0 || isNumericTokenBoundary(text.charAt(start - 1));
            var rightOK = end === n || isNumericTokenBoundary(text.charAt(end));
            if (!leftOK || !rightOK) continue;

            var value = parseInt(text.substring(start, end), 10);
            if (value < 1 || value > 99) continue;

            return { number: value, start: start, end: end };
        }
        return null;
    }

    function isNumericTokenBoundary(ch) {
        // Unlike text matching, this receives the original (not normalized)
        // filename, so both upper- and lower-case Latin/Cyrillic matter.
        // Treat the multiplication sign like x/х, so 15×20 is a size, not 15.
        if (ch === '×') return false;
        return !/[0-9A-Za-zА-Яа-яЁё]/.test(ch);
    }

    function numericMockupMatchesWork(mockup, work) {
        if (mockup.number !== work.number) return false;
        if (!work.numberGroup) return true;

        if (mockup.isSimple) return mockup.groupKey === work.numberGroup;
        return containsWholeToken(mockup.normalizedBase, work.numberGroup);
    }

    function findNumericMockupFile(folder, mockup, work) {
        var requiredGroup = work.numberGroup || (mockup.isSimple ? mockup.groupKey : '');
        var direct;

        // Common 01/1 + optional group convention: direct File.exists only.
        if (mockup.isSimple) {
            direct = probeSimpleNumericNames(folder, work.number, requiredGroup, mockup.extension);
            if (direct) return direct;
        } else {
            // Arbitrary family name: preserve every character except the index.
            // "Шк 08 450х320" -> probe "Шк 2 ..." and "Шк 02 ...".
            // If the folder explicitly requests a group, direct substitution is
            // safe only when that group is already present in this family name.
            if (!work.numberGroup || containsWholeToken(mockup.normalizedBase, work.numberGroup)) {
                direct = probePatternNumericNames(folder, mockup, work.number);
                if (direct) return direct;
            }
        }

        // Rare fallback for an extension change or a missing direct spelling.
        // For arbitrary families, never jump to another family just because
        // it has the requested number. For a simple no-group family, likewise
        // accept only another simple no-group layout.
        return scanNumericMockups(
            folder,
            work.number,
            requiredGroup,
            mockup.isSimple ? '' : numericFamilyKey(mockup),
            mockup.isSimple && !requiredGroup
        );
    }

    function probeSimpleNumericNames(folder, number, groupKey, extension) {
        var suffix = groupKey ? ' ' + groupKey : '';
        return probeTwoNames(
            folder,
            String(number) + suffix + '.' + extension,
            (number < 10 ? '0' + number : String(number)) + suffix + '.' + extension
        );
    }

    function probePatternNumericNames(folder, mockup, number) {
        var left = mockup.base.substring(0, mockup.tokenStart);
        var right = mockup.base.substring(mockup.tokenEnd);
        var ext = '.' + mockup.extension;
        return probeTwoNames(
            folder,
            left + String(number) + right + ext,
            left + (number < 10 ? '0' + number : String(number)) + right + ext
        );
    }

    function probeTwoNames(folder, a, b) {
        var fa = new File(folder.fsName + '/' + a);
        var same = a === b;
        var fb = same ? fa : new File(folder.fsName + '/' + b);
        var ea = fa.exists;
        var eb = same ? false : fb.exists;

        // Both padded and unpadded variants exist => ambiguous.
        if (ea && eb) return null;
        if (ea) return fa;
        if (eb) return fb;
        return null;
    }

    function numericFamilyKey(mockup) {
        return normalizeText(
            mockup.base.substring(0, mockup.tokenStart) + ' ' +
            mockup.base.substring(mockup.tokenEnd)
        );
    }

    function scanNumericMockups(folder, number, requiredGroup, familyKey, simpleNoGroup) {
        var files;
        try {
            files = folder.getFiles();
        } catch (_) {
            return null;
        }

        var found = null;
        for (var i = 0, n = files.length; i < n; i++) {
            var f = files[i];
            if (!(f instanceof File)) continue;

            var name = fileName(f);
            if (!isLayoutExtension(extensionOf(name))) continue;

            var p = parseNumericMockupName(name);
            if (!p || p.number !== number) continue;

            if (familyKey && numericFamilyKey(p) !== familyKey) continue;
            if (simpleNoGroup && (!p.isSimple || p.groupKey)) continue;

            if (requiredGroup) {
                if (p.isSimple) {
                    if (p.groupKey !== requiredGroup) continue;
                } else if (!containsWholeToken(p.normalizedBase, requiredGroup)) {
                    continue;
                }
            }

            // More than one valid candidate => do not guess.
            if (found) return null;
            found = f;
        }
        return found;
    }


    // ---- Text-key matching ----

    function makeTextCandidate(mockupIndex, mockupFile, workIndex, workFile) {
        var mockupName = fileName(mockupFile);
        if (!isLayoutExtension(extensionOf(mockupName))) return null;

        var key;
        try {
            key = parseTextFolderKey(fileName(workFile.parent));
        } catch (_) {
            return null;
        }
        if (!key) return null;

        return {
            mockupIndex: mockupIndex,
            mockupFile: mockupFile,
            workIndex: workIndex,
            workFile: workFile,
            textKey: key,
            currentRank: textMatchRank(baseName(mockupName), key)
        };
    }

    function resolveTextCandidate(candidate) {
        var target = findTextMockupFile(candidate.mockupFile.parent, candidate.textKey);
        if (!target) return null;

        candidate.targetFile = target;
        return candidate;
    }

    function parseTextFolderKey(text) {
        text = normalizeText(text);
        if (!text || parseNumericBase(text)) return null;
        return text;
    }

    function findTextMockupFile(folder, key) {
        var files;
        try {
            files = folder.getFiles();
        } catch (_) {
            return null;
        }

        var best = null;
        var bestRank = 0;
        var ambiguous = false;

        for (var i = 0, n = files.length; i < n; i++) {
            var f = files[i];
            if (!(f instanceof File)) continue;

            var name = fileName(f);
            if (!isLayoutExtension(extensionOf(name))) continue;

            var rank = textMatchRank(baseName(name), key);
            if (!rank) continue;

            if (rank > bestRank) {
                best = f;
                bestRank = rank;
                ambiguous = false;
            } else if (rank === bestRank) {
                ambiguous = true;
            }
        }

        return best && !ambiguous ? best : null;
    }

    // Ranking makes matching both flexible and conservative:
    //   3: basename exactly equals folder key        "М.tif"
    //   2: folder key is the final whole token       "15x20 М.tif"
    //   1: folder key is another whole token         "М 15x20.tif"
    // A single letter never matches inside another word.
    function textMatchRank(base, key) {
        base = normalizeText(base);
        key = normalizeText(key);
        if (!base || !key) return 0;
        if (base === key) return 3;

        var pos = base.length - key.length;
        if (pos > 0 && base.substring(pos) === key && isBoundary(base.charAt(pos - 1))) {
            return 2;
        }

        return containsWholeToken(base, key) ? 1 : 0;
    }

    function containsWholeToken(text, key) {
        var from = 0;
        while (true) {
            var p = text.indexOf(key, from);
            if (p < 0) return false;

            var e = p + key.length;
            var leftOK = p === 0 || isBoundary(text.charAt(p - 1));
            var rightOK = e === text.length || isBoundary(text.charAt(e));
            if (leftOK && rightOK) return true;

            from = p + 1;
        }
    }

    function isBoundary(ch) {
        // After normalizeText(), letters/digits are the only token characters.
        // Explicit Cyrillic range keeps this ExtendScript/ES3 compatible.
        return !/[0-9A-ZА-ЯЁ]/.test(ch);
    }

    function isLayoutExtension(ext) {
        ext = String(ext).toLowerCase();
        return ext === 'tif' || ext === 'tiff' || ext === 'psd' || ext === 'psb';
    }


    // ---- Replacement ----

    function replaceMockup(mockupIndex, oldMockupFile, targetFile) {
        if (!targetFile || sameFile(oldMockupFile, targetFile)) return;

        // Re-check immediately before any destructive action.
        try {
            if (!targetFile.exists) return;
        } catch (_) {
            return;
        }

        // IDs are deliberately deferred until a replacement is certain.
        var activeID = getActiveDocumentID();
        var mockupID = getDocumentID(mockupIndex);
        if (activeID < 0 || mockupID < 0) return;

        var workWasActive = activeID !== mockupID;

        // Photoshop Close acts on the active document. If necessary, select
        // the known mockup by ID and VERIFY that selection before closing.
        // The extra property read happens only on an actual replacement when
        // the work document was active; safety is more important here.
        if (workWasActive) {
            try {
                selectDocumentByID(mockupID);
            } catch (_) {
                return;
            }
            if (getActiveDocumentID() !== mockupID) return;
        }

        try {
            closeActiveDocumentNoSave();
        } catch (_) {
            // Best effort: if selection changed but close failed, restore work.
            if (workWasActive) {
                try { selectDocumentByID(activeID); } catch (_) {}
            }
            return;
        }

        var opened = false;
        try {
            openFile(targetFile);
            opened = true;
        } catch (_) {}

        if (!opened) {
            // Silent rollback only when OPEN itself failed. A later failure to
            // restore focus must never reopen the old mockup as a third document.
            try {
                if (oldMockupFile.exists) openFile(oldMockupFile);
            } catch (_) {}
        }

        if (workWasActive) {
            try { selectDocumentByID(activeID); } catch (_) {}
        }
    }


    // ---- Photoshop actions ----

    function closeActiveDocumentNoSave() {
        var d = new ActionDescriptor();
        d.putEnumerated(c2t('Svng'), c2t('YsN '), c2t('N   '));
        executeAction(c2t('Cls '), d, DialogModes.NO);
    }

    function selectDocumentByID(documentID) {
        var r = new ActionReference();
        r.putIdentifier(c2t('Dcmn'), documentID);
        var d = new ActionDescriptor();
        d.putReference(c2t('null'), r);
        executeAction(c2t('slct'), d, DialogModes.NO);
    }

    function openFile(file) {
        var d = new ActionDescriptor();
        d.putPath(c2t('null'), file);
        executeAction(c2t('Opn '), d, DialogModes.NO);
    }


    // ---- Tiny helpers ----

    function normalizeText(s) {
        return trim(s).replace(/\s+/g, ' ').toUpperCase();
    }

    function trim(s) {
        return String(s).replace(/^\s+|\s+$/g, '');
    }

    function fileName(f) {
        var s = String(f.name);
        if (s.indexOf('%') < 0) return s;
        try { return decodeURI(s); } catch (_) { return s; }
    }

    function baseName(name) {
        var p = name.lastIndexOf('.');
        return p > 0 ? name.substring(0, p) : name;
    }

    function extensionOf(name) {
        var p = name.lastIndexOf('.');
        return p >= 0 && p < name.length - 1 ? name.substring(p + 1).toLowerCase() : '';
    }

    function sameFile(a, b) {
        try {
            return String(a.fsName).toLowerCase() === String(b.fsName).toLowerCase();
        } catch (_) {
            return false;
        }
    }
})();
