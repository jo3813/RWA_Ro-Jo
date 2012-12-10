function listPosts(data) {
	var output='<ul data-role="listview" data-filter="true">';
	$.each(data.posts,function(key,val) {
	
		var tempDiv = document.createElement("tempDiv");
		tempDiv.innerHTML = val.excerpt;
		$("a",tempDiv).remove();
		var excerpt = tempDiv.innerHTML;	
	
		output += '<li>';
		output += '<a href="#blogpost" onclick="showPost(' + val.id + ')">';
		output += '<h3>' + val.title + '</h3>';
		
		output += (val.thumbnail) ?
			'<img src="' + val.thumbnail + '" alt="' + val.title + '" />':
			'<img src="images/viewsourcelogo.png" alt="View Source Logo" />';
		output += '<p>' + excerpt + '</p>';
		output += '</a>';
		output += '</li>';
	}); // go through each post
	output+='</ul>';
	$('#postlist').html(output);
} // lists all the posts


function showPost(id) {
	$.getJSON('http://www.itbasketeam.blogspot.com/?json=get_post&post_id=' + id + '&callback=?', function(data) {
		var output='';
		output += '<h3>' + data.post.title + '</h3>';
		output += data.post.content;
		$('#mypost').html(output);
	}); //get JSON Data for Stories
} //showPost

//Youtube
function listVideos(data) {
	console.log(data);
	
	var output ='';
	for ( var i=0; i<data.feed.entry.length; i++) {

		var title = data.feed.entry[i].title.$t;
		var thumbnail = data.feed.entry[i].media$group.media$thumbnail[0].url;
		var description = data.feed.entry[i].media$group.media$description.$t;
		var id = data.feed.entry[i].id.$t.substring(38);
		
		var blocktype = ((i % 2)===1) ? 'b': 'a';
		
		output += '<div class="ui-block-' + blocktype + '">';

		output += '<a href="#videoplayer" data-transition="fade" onclick="playVideo(\'' +  id +'\',\'' + title + '\',\'' + escape(description) + '\')">';
		output += '<h3 class="movietitle">' + title + '</h3>';
		output += '<img src="' + thumbnail + '" alt="' + title + '" />';
		output +="</a>";
		output +="</div>";
	}
	
	$('#videolist').html(output);
}

function playVideo(id, title, description) {
	var output ='<iframe src="http://www.youtube.com/embed/'+ id +'?wmode=transparent&amp;HD=0&amp;rel=0&amp;showinfo=0&amp;controls=1&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>';
	output += '<h3>' + title + '</h3>';
	output += '<p>' + unescape(description) + '</p>';
	$('#myplayer').html(output);
}

// Flickr
function jsonFlickrFeed(data) {
	console.log(data);
	var output='';
	
	for (var i = 0; i < data.items.length; i++) {
		var title = data.items[i].title;
		var link = data.items[i].media.m.substring(0, 56);
		var blocktype =
			((i%3)===2) ? 'c':
			((i%3)===1) ? 'b':
			'a';
		output += '<div class="ui-block-' + blocktype + '">';
		// link to showphoto, onclick call showphoto and pass link and title
		output += '<a href="#showphoto" data-transition="fade"onclick="showPhoto(\'' + link +'\',\'' + title + '\')">';
		output += '<img src="' + link + '_q.jpg" alt="' + title + '" />';
		output += '</a>';
		output += '</div>';
	} // go through each photo
	$('#photolist').html(output);
} //jsonFlickrFeed

function showPhoto(link, title) {
	var output='<a href="#photos" data-transition="fade">';
	output += '<img src="' + link + '_b.jpg" alt="' + title +'" />';
	output += '</a>';
	$('#myphoto').html(output);
}

// Google Map
var mapdata = { destination: new google.maps.LatLng(53.405106, -6.378039) };

$('#map').live("pageinit", function() {

     $('#map').live("pageshow", function() {
                $('#map_square').gmap('refresh');
				$("#map_square").width($(document).width());  
        $("#map_square").height(  
            $(window).height()   
            - $("div.ui-footer").outerHeight()   
            - $("div.ui-header").outerHeight()  
        );  
       });

    $('#map_square').gmap(
        { 
		  'zoom' : 12,
		  'center' : mapdata.destination, 
          'mapTypeControl' : false,
          'navigationControl' : false,
          'streetViewControl' : false
        })
        .bind('init', function(evt, map) {
            $('#map_square').gmap('addMarker',
                { 'position': mapdata.destination,
                  'animation' : google.maps.Animation.DROP
 }).click(function() {
		$('#map_square').gmap('openInfoWindow', {'content': ' <h3>ITB</h3>'+
					'<p>Institute of technology Blanchardstown</p>'+
					'<img src="./images/itb2.jpg" width="80" height="60" hspace="10" border="1" alt="Thumbnail 0" id="Img0" />'}, this);                                                                                                                                                                                                            
        });
		
		});
     $('#map').live("pageshow", function() {
                $('#map_square').gmap('refresh');
        });
     $('#map').live("pageinit", function() {
                $('#map_square').gmap({'center': mapdata.destination});
        });
 });
 
// <--- Directions --->
 //briefly display the provided message to the user in a fading message box
 function fadingMsg (locMsg) {
    $("<div class='ui-overlay-shadow ui-body-e ui-corner-all fading-msg'>" + locMsg + "</div>")
    .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 100 })
    .appendTo( $.mobile.pageContainer )
    .delay( 2200 )
    .fadeOut( 1000, function(){
        $(this).remove();
   });
}

//Create the map then make 'displayDirections' request

$('#directions').live("pageinit", function() {

    $('#directions').live("pageshow", function() {
                $('#map_dir').gmap('refresh');
				$("#map_dir").width($(document).width());  

       });

    $('#map_dir').gmap(
        { 
		  'zoom' : 12,
		  'center' : mapdata.destination, 
          'mapTypeControl' : true,
          'navigationControl' : true,
          'streetViewControl' : false
        })
		.bind('init', function() {
        $('.refresh').trigger('tap');        
    });
        
		$('#directions').live("pageshow", function() {
		$('#map_dir').gmap('refresh');
});
		
		// Request display of directions, requires jquery.ui.map.services.js
var toggleval = true; // used for test case: static locations


             //START: Tracking location with device geolocation
    if ( navigator.geolocation ) { 
        fadingMsg('Using device geolocation to get current position.');


        navigator.geolocation.getCurrentPosition  ( 
            function(position )  {
                $('#map_dir').gmap('displayDirections', 
                { 'origin' : new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
                  'destination' : mapdata.destination, 'travelMode' : google.maps.DirectionsTravelMode.DRIVING},
                { 'panel' : document.getElementById('dir_panel')},
                      function (result, status) {
                          if (status === 'OK') {
                              var center = result.routes[0].bounds.getCenter();
                              $('#map_dir').gmap('option', 'center', center);
                              $('#map_dir').gmap('refresh')
                          } else {
                              alert('Unable to get route');
                          }
                      }
                   );         
                }, 
                function(){ 
                    alert('Unable to get location');
                    $.mobile.changePage($('#directions'), {   }); 
				}, { enableHighAccuracy: true } ); 
                
            } else {
                alert('Unable to get location.');
            }           
    //END: Tracking location with device geolocation
    $(this).removeClass($.mobile.activeBtnClass);
    return false;
});



// Go to map page to see instruction detail (zoom) on map page
$('#dir_panel').live("tap", function() {
    $.mobile.changePage($('#directions'), {});
});

// Briefly show hint on using instruction tap/zoom
$('#directions').live("pageshow", function() {
    fadingMsg("Tap any instruction<br/>to see details on map");
});

function listTweets(data) {
	console.log(data);
	var output = '<ul data-role="listview" data-theme="a">';
	// use jQuery each function because don't need to use a grid
	$.each(data, function(key, val) {
		var text = data[key].text;
		var thumbnail = data[key].user.profile_image_url;
		var name = data[key].user.name;
		
		output += '<li>';
		output += '<img src="' + thumbnail +'" alt="Photo of ' + name + '">';
		output += '<div>' + text + '</div>';
		output += '</li>';		
	}); //go through each tweet
	output += '</ul>';
	$('#tweetlist').html(output);
}

function showrecentposts(json) {
  // start a loop
  // in this loop we get the entry from the feed and parse it
  for (var i = 0; i < numposts; i++) {
    // get entry i from feed
    var entry = json.feed.entry[i];
    // get the posttitle
    var posttitle = entry.title.$t;
    // get the post url
    // check all links for the link with rel = alternate
    var posturl;
    if (i == json.feed.entry.length) break;
    for (var k = 0; k < entry.link.length; k++) {
      if (entry.link[k].rel == 'alternate') {
        posturl = entry.link[k].href;
        break;
      }
    }
    // get the postdate, take only the first 10 characters
    var postdate = entry.published.$t.substring(0,10);
    // get the post author
    var postauthor = entry.author[0].name.$t;
    // get the postcontent
    // if the Blogger-feed is set to FULL, then the content is in the content-field
    // if the Blogger-feed is set to SHORT, then the content is in the summary-field
    if ("content" in entry) {
      var postcontent = entry.content.$t;}
    else
    if ("summary" in entry) {
      var postcontent = entry.summary.$t;}
    else var postcontent = "";
    // strip off all html-tags
    var re = /<\S[^>]*>/g; 
    postcontent = postcontent.replace(re, "");
    // reduce postcontent to numchar characters
    if (postcontent.length > numchars) postcontent = postcontent.substring(0,numchars);
    // display the results
    document.write('<br>');
    document.write('Entry #' + i + '<br>');
    document.write('Post title    : '+ posttitle + '<br>');
    document.write('Post url      : '+ posturl + '<br>');
    document.write('Post author   : '+ postauthor + '<br>');
    document.write('Postdate      : '+ postdate + '<br>');
    document.write('Postcontent   : '+ postcontent + '<br>');
    document.write('<br>');
  }
}
