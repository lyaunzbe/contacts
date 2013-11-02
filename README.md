Contacts
========

A simple contact list app that has JSON import/export functionality.
No dependencies, just native JS.

## Post Project Write-up ##

I ended up really enjoying this challenge, even though I initially thought that manipulating the DOM with native JS would be tedious and require lots of boilerplate code. In fact, I think it had the opposite effect, and my code came out looking pretty modular and organized. Creating my own utility library to wrap certain native DOM functions and emulating jQuery functionality that was not available to me was paticularly helpful. I wrote a small trigger function and, with a polyfill that allowed me to use CustomEvents, I now had a way to interact across different sections of my application by binding and triggering events. I also decided to use the browser's cookies as a 'database layer', figuring that this was a nice, simple way to persist the contacts data. The amount of storage space is quite small, limited to only 4kb, but considering this method works across all browsers and we are dealing with a single JSON string here, the tradeoff is totally worth it and, I think, a preferable solution to something like localStorage. Another thing to note is that I chose to order the contact list lexicographically and preserve this order when inserting or importing contacts. I didn't actually have too much trouble making everything consistant across browsers. I initially wanted to use a unicode symbol for my logo icon, but realized that there was no consistancy in the way a symbol looks in different browsers at all. I also had some annoying issues with the way IE treats innerHTML, but that wasn't too hard to resolve.

You can also check this app out live on my site:
http://www.benlyaunzon.com/contacts

Cheers!
