$(function(){


    var linkConfluenceURL = 'https://confluence.cdk.com/display/DEV/Dealer+Sites+Live+on+Next+Gen',
        tableLexusSites = $('#table-lexus-websites'),
        tableGMSites = $('#table-gm-websites');

    $.ajax({ "url": linkConfluenceURL,
            "crossDomain": true,
        }
    ).done(function(data){

        $(data)
            .find('#DealerSitesLiveonNextGen-LexusDealers')
            .next()
            .appendTo(tableLexusSites);
        $(data)
            .find('#DealerSitesLiveonNextGen-GMDealers')
            .next()
            .appendTo(tableGMSites);

        $.each([tableLexusSites,tableGMSites],function(){
             this
                 .find('table')
                 .addClass('table table-striped table-bordered table-hover');

             /* Renaming the first column from 'Number' to '#' to cut down text length */
            this.find('table tbody tr:first-child th:first-child').text('#');
            this
                .find('table tbody tr:first-child th:nth-child(4)').addClass('hidden').next().addClass('hidden');


            /* Prepend a Row with a second level table header */
            var colLiveHeader, colLocalHeader, rowHeader2;
            colLiveHeader = $("<th colspan='4' class='text-center'>Live Links</th>");
            colLocalHeader = $("<th colspan='2' class='text-center'>Local Links</th>");

            rowHeader2 = $('<tr></tr>');
            colLiveHeader.appendTo(rowHeader2);
            colLocalHeader.appendTo(rowHeader2);

            rowHeader2.prependTo(this.find('table'));

            //console.log( this.find('table tbody td:nth-child(3) > a') );
            /* Adding the attr target="_new" to existing anchor tag */
            this
                .find('table tbody td:nth-child(3) > a')
                .each(function(index){
                    var linkObj = $(this);

                    linkObj.attr('target',"_new")
                        .attr('data-toggle','tooltip')
                        .attr('data-placement','bottom')

                    var strDesignTitle, strLiveDate;
                    strDesignTitle = 'Design: '+linkObj.parents('td').next().text();
                    strLiveDate = '; Live Date: '+linkObj.parents('td').next().next().text();
                    linkObj.attr('title',strDesignTitle + strLiveDate);
                    linkObj.parents('td').next().addClass('hidden').next().addClass('hidden');
                });




            var hydraUrl = $("<th></th>");
            hydraUrl.text("Hydra");

            var header = this.find('table tbody tr').get(1);
            //console.log(header);
            hydraUrl.appendTo(header);

            var localUrl = $("<th></th>");
            localUrl.text("Consumer");
            localUrl.appendTo(header);

            var localUrl = $("<th></th>");
            localUrl.text("Editor");
            localUrl.appendTo(header);



            var webLinks = this.find('table tbody tr');

            webLinks.each(function(index) {

                if (index > 0) {

                    var that = this;
                    //console.log(that);
                    var currentUrl = $(this).find('td a');
                    //console.log(currentUrl);
                    currentUrl = currentUrl.attr('href');
                    //console.log(currentUrl);
                    currentUrl += "?debug=true";

                    $.ajax({url: currentUrl, "crossDomain": true})
                        .done(function (data2) {

                        var newTd = $('<td></td>');
                        var newAnchor = $('<a target="_new"></a>');

                        var ajaxHydraUrl = $(data2).find('a').eq(0);
                       // console.log(ajaxHydraUrl, ajaxHydraUrl.attr('href'));
                        newAnchor.attr('href', ajaxHydraUrl.attr('href'));
                        newAnchor.text("Click Here");
                        newAnchor.appendTo(newTd);

                        newTd.appendTo($(that).get(0));

                        var newTd2 = $('<td></td>');
                        var newAnchor2 = $('<a target="_new"></a>');
                        var origHydraUrl = ajaxHydraUrl.length ? ajaxHydraUrl.attr('href') : "#ERROR";
                        var localHydraUrl, localHydraUrlIndex;
                        var localHydraEditorUrl;

                        localHydraUrlIndex = origHydraUrl.indexOf('/route');
                        localHydraUrl = "localhost:8082"+origHydraUrl.substr(localHydraUrlIndex)
                        newAnchor2.attr('href', localHydraUrl);
                        newAnchor2.text("Click Here");
                        newAnchor2.appendTo(newTd2);
                        newTd2.appendTo($(that).get(0));

                        var newTd3 = $('<td></td>');
                        var newAnchor3 = $('<a target="_new"></a>');
                        localHydraEditorUrl = localHydraUrl.replace('/consumer?','/editor?');
                        newAnchor3.attr('href', localHydraEditorUrl);
                        newAnchor3.text("Click Here");
                        newAnchor3.appendTo(newTd3);

                        newTd3.appendTo($(that).get(0));

                    });

                }

            });

        });

        $('[data-toggle="tooltip"]').tooltip();

    });

    var filterWebId = $('#filter-webid');

    $('#btn-filter').click(function(evt){

            $.each([tableGMSites,tableLexusSites],function(){
                var currentTable = this;

                if(this.hasClass('active')){
                   var filterVal = filterWebId.val();

                   if(filterVal.length > 0){

                       currentTable.find('table tbody tr').each(function(index){
                           if(index > 0){

                               $(this).addClass('hidden');
                           }
                       });

                       currentTable.find('table tbody tr > td:contains("'+filterVal+'")').each(function(){
                           $(this).parent().removeClass('hidden');
                       });
                   }else{
                       currentTable.find('table tbody tr').each(function(index){
                           if(index > 0){

                               $(this).removeClass('hidden');
                           }
                       });
                   }

                }

            });


    });

    $('#btn-filter-reset').click(function(evt){
        filterWebId.val('');
        $.each([tableGMSites,tableLexusSites],function() {
            var currentTable = this;

            if (this.hasClass('active')) {

                currentTable.find('table tbody tr').each(function(index){
                    if(index > 0){

                        $(this).removeClass('hidden');
                    }
                });
            }
        });

    });

});