(function(global, jsx, undefined) {
    "use strict";



    // TODO switch to jsx.converters.toString
    var toString = jsx.ensureString;



    /**
     * Adiciona caracteres à esquerda.
     *
     * @param {string} str
     * @param {string} character
     * @param {number} length
     * @returns {string}
     */
    function padLeft(str, character, length) {

        jsx.asserts.assertRange(arguments.length, 3, 3);
        jsx.asserts.assertStringLength(character, 1)

        character = toString(character);
        str = toString(str);

        while (str.length < length) {
            str = character + str;
        }

        return str;

    }



    /**
     *
     * @param {string} text
     * @param {RegExp} [stopwordsPattern]
     * @returns {string}
     */
    function toTitleCase(text, stopwordsPattern) {

        // a-Z, com/sem acentos (apenas os caracteres que tem correspondentes com/sem case)
        //[a-zA-Z\u00C0-\u00CF\u00D1-\u00DC\u00E0-\u00EF\u00F1-\u00FC]

        // A-Z
        // [A-Z\u00C0-\u00CF\u00D1-\u00DC]

        var _stopwordsPattern = stopwordsPattern == null ? toTitleCase.PORTUGUESE_STOPWORDS_PATTERN : stopwordsPattern;

        if (!(_stopwordsPattern instanceof RegExp)) {
            throw new Error('toTitleCase(): stopwordsPattern argument, if provided, must be a RegExp.');
        }

        text = toString(text);

        return text.replace(/([0-9a-zA-Z\u00C0-\u00CF\u00D1-\u00DC\u00E0-\u00EF\u00F1-\u00FC]+[^\s-]*) */g, function (e, n, r, i) {
            return r > 0 && r + n.length !== i.length && n.search(_stopwordsPattern) > -1 && i.charAt(r - 2) !== ":" && i.charAt(r - 1).search(/[^\s-]/) < 0 ? e.toLowerCase() : n.substr(1).search(/[A-Z\u00C0-\u00CF\u00D1-\u00DC]|\../) > -1 ? e : e.charAt(0).toUpperCase() + e.substr(1);
        });

    }
    toTitleCase.PORTUGUESE_STOPWORDS_PATTERN = /^(e|ou|[dn]?[ao](?:s|\(s\))?|[dn][ao]s?\([ao]s?\)|n?um(?:as?|a\(s?\)|\(as?\))?|em|de|para|por|pel[ao](?:s|\(s\))?|mas|etc|se(?:n(?:a|ã)o)?|como?|vs?\.?|via|n[º\.]|que|seja)$/i;



    /**
     *
     * @param {string} text
     * @returns {string}
     */
    var removeDiacritics = (function(){

        var diacritics = [
            [/[\u00C0-\u00C6]/g, 'A'],  //[/[\300-\306]/g, 'A'],
            [/[\u00E0-\u00E6]/g, 'a'],  //[/[\340-\346]/g, 'a'],
            [/[\u00C8-\u00CB]/g, 'E'],  //[/[\310-\313]/g, 'E'],
            [/[\u00E8-\u00EB]/g, 'e'],  //[/[\350-\353]/g, 'e'],
            [/[\u00CC-\u00CF]/g, 'I'],  //[/[\314-\317]/g, 'I'],
            [/[\u00EC-\u00EF]/g, 'i'],  //[/[\354-\357]/g, 'i'],
            [/[\u00D2-\u00D8]/g, 'O'],  //[/[\322-\330]/g, 'O'],
            [/[\u00F2-\u00F8]/g, 'o'],  //[/[\362-\370]/g, 'o'],
            [/[\u00D9-\u00DC]/g, 'U'],  //[/[\331-\334]/g, 'U'],
            [/[\u00F9-\u00FC]/g, 'u'],  //[/[\371-\374]/g, 'u'],
            [/[\u00D1]/g, 'N'],         //[/[\321]/g, 'N'],
            [/[\u00F1]/g, 'n'],         //[/[\361]/g, 'n'],
            [/[\u00C7]/g, 'C'],         //[/[\307]/g, 'C'],
            [/[\u00E7]/g, 'c'],         //[/[\347]/g, 'c'],
            [/[\u00FF]/g, 'y']          //[/[\377]/g, 'y']
        ];

        /**
         *
         * @param {string} text
         * @returns {string}
         */
        return function(text) {

            var i;

            text = toString(text);

            for (i = 0; i < diacritics.length; i++) {
                text = text.replace(diacritics[i][0], diacritics[i][1]);
            }

            return text;

        }

    })();



    jsx.text = {
        padLeft : padLeft,

        toTitleCase: toTitleCase,
        removeDiacritics:removeDiacritics
    };

})(window, jsx);
