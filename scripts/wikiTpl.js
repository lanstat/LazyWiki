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
        for: function(content){
            return '<i>Para ' + content[1] + ', ver <a href="#/wiki/' + content[2]+ '">' + content[2] + '</a></i>';
        },
        infobox_single: function(content){
            return 'gilada';
        },
        url: function(content){
            return '<a href="' + content[1]+ '">' + content[1].replace(/http(s|):\/\//, '') + '</a>';
        },
        start_date_and_age: function(content){
            return content[3] + '/' + content[2] + '/' + content[1];
        },
        infobox_programming_language: function(content){
            var data = {};

            for (var i=1; i<content.length; i++){
                var match = /((\w|\s)+)=(.*)/.exec(content[i]);

                data[match[1].trim().replace(/\s/g, '_')] = match[3];
            }

            var template = '<table class="infobox vevent" style="width:22em">'+
                '<caption class="summary">{name}</caption>' +
                '<tbody><tr>'+
                '<td colspan="2" style="text-align:center"><a href="{logo}" class="image"><img alt="{logo}" src="{logo}" data-file-width="486" data-file-height="144"></a></td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row"><a href="#/wiki/Programming_paradigm" title="Paradigma de programación">Paradigma</a></th>'+
                '<td>{paradigm}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row"><a href="/wiki/Software_design" title="Diseño de software">Diseñado por</a></th>'+
                '<td>{designer}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row"><a href="/wiki/Software_developer" title="Software developer">Desarrollador</a></th>'+
                '<td class="organiser">{developer}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row">Primera aparición</th>'+
                '<td>{latest_preview_date}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row"><a href="/wiki/Software_release_life_cycle" title="Software release life cycle">Stable release</a></th>'+
                '<td>{latest_release_version}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row"><a href="/wiki/Software_release_life_cycle" title="Software release life cycle">Preview release</a></th>'+
                '<td>{latest_preview_version}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row"><a href="/wiki/Type_system" title="Type system">Typing discipline</a></th>'+
                '<td>{typing}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row"><a href="/wiki/Operating_system" title="Operating system">OS</a></th>'+
                '<td>{operating_system}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row"><a href="/wiki/Software_license" title="Software license">License</a></th>'+
                '<td>{license}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row"><a href="/wiki/Filename_extension" title="Filename extension">Filename extensions</a></th>'+
                '<td>{file_ext}</td>'+
                '</tr>'+
                '<tr>'+
                '<th scope="row">Website</th>'+
                '<td>{website}</td>'+
                '</tr>'+
                '<tr>'+
                '<th colspan="2" style="text-align:center;background-color: #eee;">Major <a href="/wiki/Programming_language_implementation" title="Programming language implementation">implementations</a></th>'+
                '</tr>'+
                '<tr>'+
                '<td colspan="2" style="text-align:center">{implementations}</td>'+
                '</tr>'+
                '<tr>'+
                '<th colspan="2" style="text-align:center;background-color: #eee;"><a href="/wiki/Dialect_(computing)" title="Dialect (computing)">Dialects</a></th>'+
                '</tr>'+
                '<tr>'+
                '<td colspan="2" style="text-align:center">{dialects}</td>'+
                '</tr>'+
                '<tr>'+
                '<th colspan="2" style="text-align:center;background-color: #eee;">Influenced by</th>'+
                '</tr>'+
                '<tr>'+
                '<td colspan="2" style="text-align:center">{influenced_by}</td>'+
                '</tr>'+
                '<tr>'+
                '<th colspan="2" style="text-align:center;background-color: #eee;">Influenced</th>'+
                '</tr>'+
                '<tr>'+
                '<td colspan="2" style="text-align:center">{influenced}</td>'+
                '</tr>'+
                '<tr>'+
                '<td colspan="2" class="hlist" style="text-align:center;border-top: 1px solid #aaa; padding-top: 3px;">'+
                '<ul>'+
                '<li>{wikibooks}</li>'+
                '</ul>'+
                '</td>'+
                '</tr>'+
                '</tbody></table>';

            return template.formatMatch(data);
        }
    }
};