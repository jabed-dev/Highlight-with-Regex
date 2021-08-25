function setClass(className, value) {
    return `<span class="hljs-${className}">${value}</span>`;
    // class-name = selector-class, selector-id, selector-tag, selector-pseudo, attribute, attr-value, number, meta, built_in, string, keyword, bullet 
}

function hlCSS(css) {

    const tags = `* a abbr address area article aside b bdi bdo blockquote body button canvas city code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 hr i iframe img input ins kbd label legend li main map mark meta nav object ol optgroup option output p param pre progress q samp section select small source span strong style sub summary sup svg table tbody td template textarea tfoot th thead time tr track u ul var video wbr`;
    const units = `% ch cm em ex fr in mm pc pt px rem vh vmax vmin vw`;

    const blockSelectorRegex = /(?<=(^|\})[;\s\t\n\r]*)[^;\s\t\n\r][^]+?\{[^]+?\}/g
        , allSelectorRegex = /^.+?(?=\{)/gs
        , tagSelectRegex = /(?<!(\.|#|::|:|-))(\b\w+\b)|\*/g
        , classSelectRegex = /\.[\w-]+/g
        , idSelectRegex = /#[\w-]+/g
        , pseudoSelectRegex = /(::|:)[\w-]+/g
        , typeSelectRegex = /\[.+?\]/g
        , typeSelectKeyRegex = /(?<=\[\s*)[\w-]+/g
        , typeSelectValueRegex = /(?<==\s*)("|')?[\w-]+("|')?(?=\s*\])/g
        , keywordRegex = /(@[a-z-]+|\band\b)/gi
        , attrBlockRegex = /\{[^]+?\}/g
        , attrNameRegex = /(?<=\s*)[\w-]+?(?=\s*:(?!\/))/g
        , attrAllValueRegex = /(?<=:\s*)[^\s\t\n\r\/\\].*?(?=\s*(;|\n))/gs
        , attrValueRegex = /^\s*\b[a-z-]+\b(?=\s+|$)/gi
        , attrNumColorRegex = /#([0-9a-f]{3,8})|[0-9]+(%|[a-z]{0,4})/gi
        , attrStringRegex = /(("|').*?("|'))|((?<=(?<!(rgb|hsl)a?)\(\s*).+?(?=\s*\)))/gs
        , attrFuncRegex = /\b[a-z-]+\(.*?\)/gis
        , attrMetaRegex = /\B!important\b/gi
        , mediaRegex = /@media(\(|\s+)[^]+?\)\s*\{/g
        , bracketsRegex = /\{|\}/g
        , commentRegex = /\/\*[^]*?\*\//g;


    const commentFlag = '<$!>'
        , mediaFlag = '<$@>'
        , stringFlag = '<$$>';

    let comments = []
        , mediaAll = []
        , string;


    // comment get
    css = css.replace(commentRegex, (comment) => {
        comments.push(comment);
        return commentFlag;
    });
    // media get
    css = css.replace(mediaRegex, (med) => {
        mediaAll.push(med);
        return mediaFlag;
    });

    // block get
    css = css.replace(blockSelectorRegex, (block) => {
        // selectors get
        block = block.replace(allSelectorRegex, (selectors) => {
            // tag set
            selectors = selectors.replace(tagSelectRegex, (tag) => {
                let matchTag = tag === '*' ? tag : tags.match(new RegExp(`\\b${tag}\\b`, 'gi'));
                if (!matchTag) {
                    return tag;
                }
                return setClass('selector-tag', matchTag.toString());
            });
            // type set
            selectors = selectors.replace(typeSelectRegex, (type) => {
                type = type.replace(typeSelectValueRegex, (typeValue) => {
                    return setClass('string', typeValue);
                });
                type = type.replace(typeSelectKeyRegex, (typeKey) => {
                    return setClass('selector-class', typeKey);
                });
                return setClass('attr-value', type);
            });
            // class set
            selectors = selectors.replace(classSelectRegex, (className) => {
                return setClass('selector-class', className);
            });
            // id set 
            selectors = selectors.replace(idSelectRegex, (id) => {
                return setClass('selector-id', id);
            });
            // pseudo set
            selectors = selectors.replace(pseudoSelectRegex, (pseudo) => {
                return setClass('selector-pseudo', pseudo);
            });
            // keyword set
            selectors = selectors.replace(keywordRegex, (keyword) => {
                return setClass('keyword', keyword);
            });

            return selectors;
        });

        // attribute block get
        block = block.replace(attrBlockRegex, (attrBlock) => {
            // attribute name set
            attrBlock = attrBlock.replace(attrNameRegex, (attrName) => {
                return setClass('attribute', attrName);
            });
            // attribute all values get
            attrBlock = attrBlock.replace(attrAllValueRegex, (attrValues) => {
                // attribute string get
                attrValues = attrValues.replace(attrStringRegex, (str) => {
                    string = str;
                    return stringFlag;
                });
                // attribute all value set
                attrValues = attrValues.replace(attrValueRegex, (attrValue) => {
                    return setClass('attr-value', attrValue);
                });
                // attribute colors and units set
                attrValues = attrValues.replace(attrNumColorRegex, (match, xcolor, unit) => {
                    if (xcolor) {
                        if (xcolor.length > 8) return match;
                        match = match.replace('#', setClass('bullet', '#'));
                    } else if (unit) {
                        if (unit !== '%' && !units.match(new RegExp(`\\b${unit}\\b`))) return match;
                        match = match.replace(unit, setClass('bullet', unit));
                    }

                    return setClass('number', match);
                });

                // attribute function set
                attrValues = attrValues.replace(attrFuncRegex, (func) => {
                    return setClass('built_in', func);
                });
                // attribute meta set
                attrValues = attrValues.replace(attrMetaRegex, (meta) => {
                    return setClass('meta', meta);
                });
                // attribute stings set
                attrValues = attrValues.replace(/<\$\$>/g, () => {
                    return setClass('string', string);
                });

                return attrValues;
            });

            return attrBlock;
        });

        return block;
    });

    // media set 
    css = css.replace(/<\$@>/g, () => {
        let media = mediaAll.shift();
        media = media.replace(keywordRegex, (keyword) => {
            return setClass('keyword', keyword);
        });
        media = media.replace(attrNameRegex, (attrName) => {
            return setClass('attribute', attrName);
        });
        media = media.replace(attrNumColorRegex, (match, xcolor, unit) => {
            if (!parseInt(match)) return match;
            if (unit) {
                if (unit !== '%' && !units.match(new RegExp(`\\b${unit}\\b`))) return match;
                match = match.replace(unit, setClass('bullet', unit));
            }

            return setClass('number', match);
        });

        return media.replace(/\(.*\)/g, (match) => setClass('keyword', match));
    });

    // brackets set
    css = css.replace(bracketsRegex, (bracket) => {
        return setClass('string', bracket);
    });

    // comment set
    css = css.replace(/<\$!>/g, () => {
        return setClass('comment', comments.shift());
    });

    return css;
}

module.exports = hlCSS;
