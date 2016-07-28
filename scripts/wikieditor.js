window.WIKI = {
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
            response = response.replace('<ref>'+refs[i]+'</ref>', '<sup id="cite_ref-'+(i+1)+'" class="reference"><a title="Un tiltulo provisional" onclick="goTo(\'cite_note-'+(i+1)+'\')">['+(i+1)+']</a></sup>');
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

        //BLoques de contenido
        response = this.parseBlocks(response);

        //Encabezado
        response = this.parseHeaders(response);

        response = response.replace(/\n/g, '<br>');

        return response;
    },
    parseHeaders: function(content){
        var headers = [];
        return content.replace(/==+(.+?)==+(\n|)/g, function(encountered){
            var response = '';
            encountered = encountered.trim();
            if (encountered.startsWith('====')){
                response = '<h5>' + encountered.replace(/====/g, '') + '</h5>';
            }else if (encountered.startsWith('===')){
                response = '<h4>' + encountered.replace(/===/g, '') + '</h4>';
            }else if (encountered.startsWith('==')){
                response = '<h3>' + encountered.replace(/==/g, '') + '</h3>';
            }
            return response;
        });
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
                data['type'] = aux[i].replace('cite ', '');
            }
        }

        data['index'] = index;

        if (typeof WIKI.template.cite[data['type']] !== 'undefined'){
            response = WIKI.template.cite[data['type']]().formatMatch(data);
        }

        return response;
    },
    parseLinks: function(content){
        var _this = this;
        var response = content;
        var links = this.matchPattern(content, '[[', ']]');

        for(var i=0; i< links.length; i++){
            response = response.replace('[['+links[i].content+']]', function(cont){
                var item = cont.split('|');
                var resp = '';

                switch (item.length){
                    case 1:
                        resp = '<a href="#wiki/'+ cont +'">'+ cont +'</a>';
                        break;
                    case 2:
                        resp = '<a href="#wiki/'+ item[0] +'">'+ item[1] +'</a>';
                        break;
                    default:
                        if (typeof WIKI.template.link[item[1]] !== 'undefined'){
                            resp = WIKI.template.link[item[1]](item[0].replace('File:', ''), _this.parseLinks(item[2]));
                        }else{
                            resp = cont;
                        }
                }

                return resp;
            }(links[i].content));
        }

        links = [];

        var pattern = /\[(.+?)[\]]/g;
        var match = pattern.exec(response);

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

                    resp = '<a href="{0}">{1}</a>'.format(href.replace(' ', '_'), item.join(' '));
                }else{
                    resp = '<a href="'+ cont +'">'+ cont +'</a>';
                }

                return resp;
            }(links[i]));
        }

        return response;
    },
    parseBlocks: function(content){
        var _this = this;
        var response = content;
        var blocks = this.matchPattern(content, '{{', '}}');

        for (var i = 0; i < blocks.length; i++){
            var block = blocks[i];

            response = response.replace('{{'+ block.content +'}}', function(record){
                var response = '';
                var parts = record.content.split('|');

                if (record.hasInner){
                    response = _this.parseBlocks(record.content);
                }

                var index = parts[0].replace(' ', '_').trim();
                if (typeof WIKI.template.block[index] !== 'undefined'){
                    response = WIKI.template.block[index](parts);
                }

                return response;
            }(block));
        }

        return response;
    },
    matchPattern : function(content, init, end){
        end = typeof end === 'undefined'? init: end;

        var response = [];
        var counter = 0;
        var buffer = '';
        var auxI = '';
        var auxE = '';
        var pivotI = 0;
        var pivotE = 0;
        var hasInner = false;

        for (var iter = 0; iter < content.length; iter++){
            if (content[iter] === init[pivotI] && pivotE == 0){
                pivotI++;
                auxI += content[iter];
                if (auxI === init){
                    if(counter > 0){
                        buffer += auxI;
                    } else {
                        buffer = '';
                    }

                    counter++;
                    auxI = '';
                    pivotI = 0;

                    if (counter > 1){
                        hasInner =true;
                    }
                }

                continue;
            }else{
                if (pivotI > 0){
                    buffer += auxI;
                }

                pivotI = 0;
                auxI = '';
            }

            if (counter > 0){
                if (content[iter] === end[pivotE] && pivotI == 0){
                    auxE += content[iter];
                    if (auxE === end){
                        counter--;

                        if (counter > 0){
                            buffer += auxE;
                        }

                        auxE = '';
                        pivotE = 0;
                    }

                    if (counter <= 0){
                        response.push({content: buffer, hasInner: hasInner});
                        hasInner = false;
                        buffer = '';
                    }
                    continue;
                } else {
                    if (pivotE > 0){
                        buffer += auxE;
                    }

                    auxE = '';
                    pivotE = 0;
                }

                buffer += content[iter];
            }
        }

        console.log(response);

        return response;
    }
};

