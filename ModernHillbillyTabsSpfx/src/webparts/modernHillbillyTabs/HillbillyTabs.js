$.fn.HillbillyTabsModern = function (options)
{
     var opt = $.extend({}, {
		isClassic: false
    }, options);

    for(var index in opt.tabData)
    {
        var thislabel = opt.tabData[index].TabName;
        var theseTabs = opt.tabData[index].WebParts.split(";#");
        for (var index2 in theseTabs)
        {
            var title = theseTabs[index2];
            if (index2 == 0)
            {
                $("ul."+opt.tabClass).append('<li><a href="#Tab'+ opt.tabClass + index+'" >'+
                thislabel+'</a></li>').after('<div id="Tab' + opt.tabClass + index + '"></div>');
            }    
            MoveWebPart(title,"#Tab" + opt.tabClass + index);

        }
    }
    $("ul."+opt.tabClass).click(function()
    {
        //trigger a resize on tab click so that content renders properly
        window.dispatchEvent(new Event('resize'));
    });
    $("div."+opt.tabClass).tabs();

    function MoveWebPart(title,contentDiv)
    {
        var found = false;
        $("span[role='heading']").each(function()
        {
            if($(this).text() == title)
            {
                found = true;
                var webPart = $(this).closest("div.ControlZone");
                $(contentDiv).append(webPart);
            };
        });
        if(!found)
        {
            //I hate this, but delay if the web part hasn't been rendered yet and try again
            setTimeout(function(){MoveWebPart(title,contentDiv)},500);
        }
    }
}