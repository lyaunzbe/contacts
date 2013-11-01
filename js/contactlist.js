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
                  <span class="phone">'+data.phone+'</span>\
                  <span class="remove-contact">Remove</button></span>';

    var template = createFrag(html);
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
    $('#contact-list ul').innerHTML = null;

    if(data.length){
      for(var i = 0; i < data.length; i++){
          var element = contactTemplate(data[i]);
          console.log(element);
          $('#contact-list ul').appendChild(element);
      }
      // Bind the remove buttons
      ctx.on('.remove-contact', 'click', 'removeContact');
    }
  }

  var renderEventTracker = function(ctx){
    console.log(ctx.eventTracker);
    for (var key in ctx.eventTracker) {
      if (ctx.eventTracker.hasOwnProperty(key)) {
        $('.dash .'+key).innerHTML = ctx.eventTracker[key];
      }
    }
  }


  return {
    // Logs and renders event tracker
    logEvent : function(e){
      this.eventTracker[e] += 1;
      this.eventTracker['tc'] = this.contacts.length;
      renderEventTracker(this);
    },


    // Inserts a new contact
    insertContact : function(e) {
      console.log(this);
      // Write binary insertion sort http://jeffreystedfast.blogspot.com/2007/02/binary-insertion-sort.html
      // for () {

      // };
      var index = findIndex(e.detail.last_name, this.contacts);
      console.log(index);
      this.contacts.splice(index,0,e.detail);

      render(this.contacts, this);


      console.log(this.contacts);

      createCookie('contacts',this.contacts,360)

      this.logEvent('ca');
    },

    // Removes a contact
    removeContact: function(e) {
      console.log(e);
      var index = 0,
          child = e.target.parentNode;

      while( (child = child.previousSibling) != null ) 
        index++;

      this.contacts.splice(index,1);

      render(this.contacts, this);

      createCookie('contacts',this.contacts,360);

      this.logEvent('cr');
    },

    // Imports JSON, provided it is valid
    importJSON: function(e) {
      try{
        var json = JSON.parse($('.json').value);
        this.contacts = json.contacts;
        
        render(this.contacts, this);

        createCookie('contacts',this.contacts,360);

        this.logEvent('i');

      }catch(err){
        alert('Sorry, the JSON you have tried to import is not valid.')

      }

    },

    // Exports a JSON representation of the contact list
    exportJSON: function(e) {
      console.log(e);
      var json = JSON.stringify({contacts : this.contacts}, null, '  ');
      $('.json').value = json;
      this.logEvent('e');

    },

    // Initializer function. 
    init: function() {
      this.contacts = readCookie('contacts') || [];

      render(this.contacts, this);

      console.log(this.contacts);
      this.eventTracker = {
        'tc' : this.contacts.length,
        'ca' : 0,
        'cr' : 0,
        'e' : 0,
        'i' : 0,
      };
      renderEventTracker(this);

    },

    // Event binder
    on: function(src, type, f) {
      if($(src)){

        if(!$(src).length){
          $(src).addEventListener(type, this[f].bind(this));
        }else{
          var elements = $(src);
          for(var i = 0; i < elements.length; i++){
            console.log(elements[i]);
            elements[i].addEventListener(type, this[f].bind(this));
          }
        }
      }
    }
  }
})();