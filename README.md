Neighborhood Map Project
Frontend Nanodegree
#Introduction
This app's function is to create a map where we predefined markers around a selected area. I have chosen New Zealand as my area and marked tourist spots as my point of interests because I am planning to have a vacation there one of these days

#Getting Started
**Prepare your files.** I have prepared a standard file folder setup where I separate my files according to js, css, img on their own respective folders.

**Prepare boilerplate HTML code.** Started with a standard html lines of code to kickoff the coding madness.

**Initiate your Git.** I created a local repo on my comp and initiated git on my project folder. Made my initial commit and connected my local to my github account.

#Setup the Map
The first thing I did is to make sure that map appears. I practiced by not relying on the examples that I have made. Instead, I will be referring to the documentation that Google made on their MAP API documentation page. Followed the instructions and replicated their basic example on my project. The code and documentation can be found in this [link](https://developers.google.com/maps/documentation/javascript/tutorial).

#Making the List
I figured that it would be great to make the list function on top of the map and work my way through the rest of the details later. Research the tourist spots in New Zealand and started with them as my points or items on my list for my vacation.

##Reviewed my KnockoutJ
**Making the data editble.** This basically makes accessing your javascript data very easy. It starts with taging your values on your AppViewModel with a knockoutjs function `ko.observable("value"). And in your html, you can easily bind them by adding `data-bind="value"` within your attribute.
```html
<p>First name: <input data-bind="value: firstName"/></p>
<p>Last name: <input data-bind="value: lastName"/></p>
```
```javascript
this.firstName = ko.observable("Bert");
this.lastName = ko.observable("Bertington");
```

**Working with Lists and Collections.**
