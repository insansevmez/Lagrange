(function() {
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        appendString += '<div class="post"><h1><a href="' + item.url + '">' + item.title + '</h1></a>';
        appendString += '<div class="thumbnail-container"><a href="' + item.url + '"><img src="'+ item.baseurl +'/assets/img/'+item.image+'"></a></div>';
        appendString += '<p>' + item.content.substring(0, 350) + '...<a href="' + item.url + '">Devamı..</a></p>';
        appendString += '<span class="post-date"><i class="fa fa-calendar" aria-hidden="true"> '+item.date+'</i>  - <i class="fa fa-bolt" aria-hidden="true">  '+item.group+'</i></span>';
        
      }

      searchResults.innerHTML = appendString;
    } else {
      //searchResults.innerHTML = '<li>Kayıt bulunamadı</li>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('content');
      this.field('tags');
    });

    for (var key in window.store) { // Add the data to lunr
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'author': window.store[key].author,
        'category': window.store[key].category,
        'content': window.store[key].content,
        'tags': window.store[key].tags
      });

      var results = idx.search(searchTerm); // Get lunr to perform a search
      displaySearchResults(results, window.store); // We'll write this in the next section
    }
  }
})();
