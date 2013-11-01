Sidebar = (function() {

  // Regexp validation for phone/names.
  var patterns = {
    phone: /(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *x(\d+))?\b/,
    name: /^[a-z ,.'-]+$/i
  }

  // Sanitize input data
  var sanitize = function(data){
    if(!patterns.name.test(data.first_name) || !patterns.name.test(data.last_name)){
      alert('Sorry, the first or last name you have entered is not valid.');
      return null;
    }else if(!patterns.phone.test(data.phone)){
      alert('Sorry, the phone number you have entered is not valid.');
      return null;
    }
    return data;
  }

  return {
    // Generates a JSON representation of the new contact.
    newContact: function(){

      var data = sanitize({ 
        first_name: $('input[name="first_name"]').value.trim(),
        last_name: $('input[name="last_name"]').value.trim(),
        phone: $('input[name="phone_number"]').value.trim()
      });

      // If the data has passed sanitization, sent it off to the contact list
      // for creation.
      if(data){
        // Reset input fields
        $('input[name="first_name"]').value = '';
        $('input[name="last_name"]').value = '';
        $('input[name="phone_number"]').value = '';
        // Trigger newContact custom event, which is handled in ContactList
        trigger($('#contact-list'), 'newContact', data);
      }
    },
    
    //Event binder
    on: function(src, type, f){
      $(src).addEventListener(type, this[f]);
    }
  };
})();