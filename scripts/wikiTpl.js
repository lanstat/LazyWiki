window.WIKI.template = {
    link: {
        thumb: function(fileName, text){
            var response = '';

            response += '<div class="thumb pull-right"> ';
            response += '<div class="thumbinner" style="width:222px;"><a href="#wiki/File:'+fileName+'" class="image"><img alt="" src="assets/'+fileName+'" width="220" height="330" class="thumbimage" data-file-width="274" data-file-height="411"></a>';
            response += '<div class="thumbcaption">';
            response += '<div class="magnify"><a href="/wiki/File:Is5Cummings.jpg" class="internal" title="Enlarge"></a></div>';
            response += text + '</div>';
            response += '</div>';
            response += '</div>';

            return response;
        }
    },
    cite: {
        book: function(){
            return '<span class="mw-cite-backlink"><b><a data-anchor="cite_ref-{index}" class="anchor"><span class="cite-accessibility-label">Subir </span>^</a></b></span>' +
            '<span class="reference-text"><cite class="citation book">{last}, {first} ({year}). ' +
            '<i>{title}</i>. {publisher} p.&nbsp;{page}. ' +
            '<a href="https://en.wikipedia.org/wiki/International_Standard_Book_Number" title="International Standard Book Number">ISBN</a>&nbsp;' +
            '<a href="/wiki/Special:BookSources/{isbn}" title="Special:BookSources/{isbn}">{isbn}</a>.</cite>' +
            '</span>';
        },
        web: function(){
            return '<span class="mw-cite-backlink"><b><a onclick="goTo(\'cite_ref-{index}\')" class="anchor"><span class="cite-accessibility-label">Jump up </span>^</a></b></span>' +
                '<span class="reference-text"><cite class="citation web"><a rel="nofollow" class="external text" href="{url}">"{title}"</a>. {publisher} {date}'+
                '<span class="reference-accessdate">. Retrieved <span class="nowrap">{accessdate}</span></span>.</cite>'+
                '</span>';
        }
    },
    block: {
        track: function(content){
            
        },
        For: function(content){
            return '<i>Para ' + content[1] + ', ver <a href="#/wiki/' + content[2]+ '">' + content[2] + '</a></i>';
        },
        Infobox_single: function(content){
            return 'gilada';
        }
    }
};