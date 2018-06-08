<!-- Reference the jQueryUI theme's stylesheet on the Google CDN. Here we're using the "Start" theme --> 
<link  type="text/css" rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/start/jquery-ui.css" /> 
<!-- Reference jQuery on the Google CDN --> 
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.1.min.js"></script>
<!-- Reference jQueryUI on the Google CDN --> 
<script type="text/javascript" src="//code.jquery.com/ui/1.11.2/jquery-ui.min.js"></script> 

<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.min.js"></script> 

<script type="text/javascript">
     jQuery(document).ready(function($) {

        var webPartTitles = ["Events","Documents"];
        HillbillyTabs(webPartTitles);

    });


    function HillbillyTabs(webPartTitles)
    {
       
        for(index in webPartTitles)
            {
                var title = webPartTitles[index];
              
                    $("span[role='heading']").each(function()
                    {
                        if($(this).text() == title)
                        {
							$("#HillbillyTabs").append('<li onclick="window.dispatchEvent(new Event(\'resize\'));"><a href="#Tab'+index+'" id="TabHead'+index+'">'+
								title+'</a></li>').after('<div id="Tab'+index+'"></div>');
							
							var webPart = $(this).closest("div.ControlZone");
							
							$("#Tab" + index).append((webPart));
                            
                        };
                    });
                }
        $("#tabsContainer").tabs();
	}
</script>
<div id="tabsContainer"><ul id="HillbillyTabs"></ul></div>