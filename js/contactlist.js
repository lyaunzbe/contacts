ContactList = (function() {

  var contacts = [];

  var eventTracker;

  // Populates an html template with data and returns a corresponding
  // DocumentFragment.
  var contactTemplate = function(data){
    var html = '<li> \
                  <div class="name"> \
                    <span class="last_name">'+data.last_name+ ',</span> \
                    <span class="first_name">'+data.first_name+'</span> \
                  </div> \
                  <span class="phone">'+data.phone+'</span><br>\
                  <span class="remove-contact">Remove</button></span>', 
        template = createFrag(html);

    return template;
  }

  // Finds the index to insert that will also preserve order.
  var findIndex = function(element, array, start, end) {
    for(var i = 0; i < array.length; i++){
      x = element.localeCompare(array[i].last_name);
      if(x < 1) return i;
    }
    return i;
  }

  // General render function for contacts
  var render = function(data, ctx){
    // Clears the current list
    $('#contact-list').innerHTML = '';
    var ul = doc.createElement('ul');

    // If the data is populated, pass each element through the template
    // and render. Then bind the remove buttons.
    if(data.length){
      for(var i = 0; i < data.length; i++){
          var element = contactTemplate(data[i]);
          ul.appendChild(element);
      }
      $('#contact-list').appendChild(ul);
      // Bind the remove buttons
      ctx.on('.remove-contact', 'click', 'removeContact');
    }
  }

  // Render function for event log dash
  var renderEventTracker = function(ctx){
    for (var key in ctx.eventTracker) {
      if (ctx.eventTracker.hasOwnProperty(key)) {
        $('.dash .'+key).innerHTML = ctx.eventTracker[key];
      }
    }
  }


  return {
    // Logs and renders event tracker
    logEvent : function(e){
      // Increment
      this.eventTracker[e] += 1;
      // Set total contacts
      this.eventTracker['tc'] = this.contacts.length;
      // Render
      renderEventTracker(this);
    },


    // Inserts a new contact
    insertContact : function(e) {
      // Find the insertion index that will perserve order
      var index = findIndex(e.detail.last_name, this.contacts);
      // Insert
      this.contacts.splice(index,0,e.detail);
      // Render
      render(this.contacts, this);
      // Persist data
      createCookie('contacts',this.contacts,360);
      // Log event
      this.logEvent('ca');
    },

    // Removes a contact
    removeContact: function(e) {
      var index = 0,
          child = e.target.parentNode;

      // Walk up the DOM to figure out the index of the removed element
      while( (child = child.previousSibling) != null ) 
        index++;
  
      // Remove
      this.contacts.splice(index,1);
      // Render
      render(this.contacts, this);
      // Persist 
      createCookie('contacts',this.contacts,360);
      // Log event
      this.logEvent('cr');
    },

    // Imports JSON, provided it is valid
    importJSON: function(e) {
      // Wrap in try/catch, in case invalid json is given
      try{
        // Extract from textarea and parse string -> JSON
        var json = JSON.parse($('.json').value);
        // Sort in lexicographic order
        this.contacts = json.contacts.sort(function(a, b){
          return a.last_name.localeCompare(b.last_name);
        });
        // Render
        render(this.contacts, this);
        // Persist
        createCookie('contacts',this.contacts,360);
        // Log event
        this.logEvent('i');
      }catch(err){
        alert('Sorry, the JSON you have tried to import is not valid.')
      }
    },

    // Exports a JSON representation of the contact list
    exportJSON: function(e) {
      // Convert contacts into JSON string
      var json = JSON.stringify({contacts : this.contacts}, null, '  ');
      // Inject string into textarea
      $('.json').value = json;
      // Log event
      this.logEvent('e');
    },

    // Initializer function. 
    init: function() {
      // Fetch stored data, if it exists
      this.contacts = readCookie('contacts') || [];
      // Render
      render(this.contacts, this);
      // Initialize event tracker
      this.eventTracker = {
        'tc' : this.contacts.length,
        'ca' : 0,
        'cr' : 0,
        'e'  : 0,
        'i'  : 0,
      };
      // Render event tracker
      renderEventTracker(this);
    },

    // Event binder
    on: function(src, type, f) {
      // Make sure the src element actually exists
      if($(src)){
        // Two cases: $(src) is either a single element or an array of elements
        if(!$(src).length){
          $(src).addEventListener(type, this[f].bind(this));
        }else{
          var elements = $(src);
          for(var i = 0; i < elements.length; i++){
            elements[i].addEventListener(type, this[f].bind(this));
          }
        }
      }
    }
  }
})();