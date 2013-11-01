// Native domReady check
document.addEventListener('DOMContentLoaded',function(){
  ContactList.init();

  Sidebar.on('.add-contact', 'click', 'newContact');
  ContactList.on('#contact-list', 'newContact', 'insertContact');
  ContactList.on('.import', 'click', 'importJSON');
  ContactList.on('.export', 'click', 'exportJSON');
})