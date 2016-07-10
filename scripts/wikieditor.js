window.wikiEditor = {
    decode: function(content){
        var response = content;
        var match;
        var pattern;
        var refs = [];
        var block;

        //Referencias
        pattern = /<ref>(.+?)<\/ref>/g;
        match = pattern.exec(response);

        while (match != null){
            refs.push(match[1]);
            match = pattern.exec(response);
        }

        block = '<ol>';
        for(var i=0; i< refs.length; i++){
            response = response.replace('<ref>'+refs[i]+'</ref>', '<sup id="cite_ref-'+(i+1)+'" class="reference"><a title="asda" ng-click="scrollTo(\'cite_note-'+(i+1)+'\')">['+(i+1)+']</a></sup>');
            block += '<li id="cite_note-'+(i+1)+'" class="">' + this.parseRef(refs[i], (i+1)) + '</li>';
        }
        block += '</ol>';

        response = response.replace(/\{\{RefList\}\}/gi, block);

        //Formateo
        response = response.replace(/'''''((\w|\s)+)'''''/g, '<b><i>$1</i></b>');
        response = response.replace(/'''(.+?)'''/g, '<b>$1</b>');
        response = response.replace(/''(.+?)''/g, '<i>$1</i>');

        //links
        response = this.parseLinks(response);

        // response = response.replace(/\[\[(.+?)\|thumb\|(.+?)[\]][\]]\n/g, this.parseThumb(response));
        // response = response.replace(/\[\[(.+?)\|(.+?)[\]][\]]/g, '<a href="#wiki3/$1">$2</a>');
        // response = response.replace(/\[\[(.+?)[\]][\]]/g, '<a href="#wiki2/$1">$1</a>');
        // response = response.replace(/\[(.+?)\s(.+?)[\]]/g, '<a href="$1">$2</a>');

        //Encabezado
        response = response.replace(/==(.+?)==/g, '<h3>$1</h3>');

        response = response.replace(/\n/g, '<br>');

        return response;
    },
    parseRef: function(content, index){
        var response = '';
        var data = {};

        content = content.substring(2, content.length-2);

        var aux = content.split(/\|/g);
        for (var i=0; i < aux.length; i++){
            var match = /^(\w+)=(.*)$/.exec(aux[i]);
            if (match != null){
                data[match[1]] = match[2];
            }else{
                data['type'] = aux[i];
            }
        }

        switch (data['type']){
            case 'cite book':
                response += '<span class="mw-cite-backlink"><b><a ng-click="scrollTo(\'cite_ref-'+index+'\')"><span class="cite-accessibility-label">Subir </span>^</a></b></span>';
                response += '<span class="reference-text"><cite class="citation book">'+data.last+', '+data.first+' ('+data.year+'). ';
                response += '<i>'+ data.title +'</i>. '+ data.publisher +' p.&nbsp;' + data.page + '. ';
                response += '<a href="https://en.wikipedia.org/wiki/International_Standard_Book_Number" title="International Standard Book Number">ISBN</a>&nbsp;';
                response += '<a href="/wiki/Special:BookSources/978-0-89102-124-7" title="Special:BookSources/'+data.isbn+'">'+data.isbn+'</a>.</cite>';
                response += '</span>';
                break;
        }

        return response;
    },
    parseThumb: function(content){
        var response = '';

        response += '<div class="thumb pull-right"> '
        response += '<div class="thumbinner" style="width:222px;"><a href="#wiki/File:Is5Cummings.jpg" class="image"><img alt="" src="assets/220px-Is5Cummings.jpg" width="220" height="330" class="thumbimage" srcset="//upload.wikimedia.org/wikipedia/en/a/a1/Is5Cummings.jpg 1.5x, //upload.wikimedia.org/wikipedia/en/a/a1/Is5Cummings.jpg 2x" data-file-width="274" data-file-height="411"></a>';
        response += '<div class="thumbcaption">';
        response += '<div class="magnify"><a href="/wiki/File:Is5Cummings.jpg" class="internal" title="Enlarge"></a></div>';
        response += 'First edition (publ. <a href="/wiki/Boni_%26_Liveright" title="Boni &amp; Liveright">Boni &amp; Liveright</a>)</div>';
        response += '</div>';
        response += '</div>';

        return response;
    },
    parseLinks: function(content){
        var response = content;
        var links = [];

        var pattern = /\[\[(.+?)[\]][\]]/g;
        var match = pattern.exec(content);

        while (match != null){
            links.push(match[1]);
            match = pattern.exec(content);
        }

        for(var i=0; i< links.length; i++){
            response = response.replace('[['+links[i]+']]', function(cont){
                var item = cont.split('|');
                var resp = '';

                if (item.length > 1){
                    if (item[0].startsWith('File')){

                    } else {
                        resp = '<a href="#wiki/'+ item[0] +'">'+ item[1] +'</a>';
                    }
                }else{
                    resp = '<a href="#wiki/'+ cont +'">'+ cont +'</a>';
                }

                return resp;
            }(links[i]));
        }
        links = [];

        pattern = /\[(.+?)[\]]/g;
        match = pattern.exec(response);

        while (match != null){
            if(!parseInt(match[1])){
                links.push(match[1]);
            }
            match = pattern.exec(response);
        }

        for(var i=0; i< links.length; i++){
            response = response.replace('['+links[i]+']', function(cont){
                var item = cont.split(' ');
                var resp = '';

                if (item.length > 1){
                    var href = item[0];
                    delete  item[0];

                    resp = '<a href="'+ href +'">'+ item.join(' ') +'</a>';
                }else{
                    resp = '<a href="'+ cont +'">'+ cont +'</a>';
                }

                return resp;
            }(links[i]));
        }

        return response;
    }
};
