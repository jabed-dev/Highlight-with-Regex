const hlCSS = require('./hlCSS');

function setClass(className, value) {
    return `<span class="hljs-${className}">${value}</span>`;
    // class-name = meta, tag, name, attr, attr-str, comment 
}

function hlHTML(html) {

    const tagRegex = /&lt;.+?&gt;/gs
        , tagNameRegex = /(?<=&lt;\/?\s*)[\w-]+/g
        , tagBlockRegex = /(<)|(>)/g
        , metaTagRegex = /&lt;!.+?&gt;/g
        , attrsRegex = /(?<=&lt;\/?[\w-]+\s+)\w+.*?(?=\s*\/?&gt;)/gs
        , attrNameRegex = /[\w-]+/g
        , attrStrRegex = /("|').*?("|')/gs
        , commentRegex = /&lt;!--[^]*?--&gt;/g
        , styleRegex = /(?<=<style.*?>)[^]+?(?=<\/style\s*>)/gs
        , scriptRegex = /(?<=<script.*?>)[^]+?(?=<\/script\s*>)/gs;


    const metaTagFlag = '{!$}'
        , commentFlag = '{$!}'
        , styleFlag = '{$#}'
        , scriptFlag = '{$$}'
        , attrStrFlag = '{$=}';

    let metaTags = []
        , comments = []
        , styles = []
        , scripts = []
        , attrString;


    // style get
    html = html.replace(styleRegex, (style) => {
        styles.push(style);
        return styleFlag;
    });

    // script get
    html = html.replace(scriptRegex, (script) => {
        scripts.push(script);
        return scriptFlag;
    });

    // tag block set
    html = html.replace(tagBlockRegex, (match, lt, gt) => {
        return (lt ? '&lt;' : '&gt;');
    });
    // comment get
    html = html.replace(commentRegex, (comment) => {
        comments.push(comment);
        return commentFlag;
    });

    // tags get
    html = html.replace(tagRegex, (tag) => {
        // meta tags get
        tag = tag.replace(metaTagRegex, (metaTag) => {
            metaTags.push(metaTag);
            return metaTagFlag;
        });
        // attributes get
        tag = tag.replace(attrsRegex, (attr) => {
            attr = attr.replace(attrStrRegex, (attrStr) => {
                attrString = attrStr;
                return attrStrFlag;
            });
            // attribute name set
            attr = attr.replace(attrNameRegex, (attrName) => {
                return setClass('attr', attrName);
            });
            // attribute value set
            attr = attr.replace(/{\$=}/g, () => {
                return setClass('string', attrString);
            });

            return attr;
        });
        // tag name set
        tag = tag.replace(tagNameRegex, (tagName) => {
            return setClass('name', tagName);
        });
        // tags set
        return setClass('tag', tag);
    });

    // meta tags set
    html = html.replace(/{!\$}/g, () => {
        return setClass('meta', metaTags.shift());
    });

    // comment set
    html = html.replace(/{\$!}/g, () => {
        return setClass('comment', comments.shift());
    });

    // style set
    html = html.replace(/{\$#}/g, () => {
        return hlCSS(styles.shift());
    });

    // script set
    html = html.replace(/{\$\$}/g, () => {
        return setClass('script', scripts.shift());
    });

    return html;
}

module.exports = hlHTML;
