memo from 59 to 91

# Starting a New Project: The "Far Away" Travel List

In the second part of this section,

let's now build our first project

that has some real interactivity.

And so let's get straight to it.

And by now you know the drill.

So if you're on Windows, open up your command prompt.

If you're on a Mac, open your terminal, please.

And then as always, navigate to the folder

where you want to create your project.

So that's my desktop.

And then in there, run NPX, create-react-app.

And then please specify version number five here.

And then finally the name of the project,

which is going to be travel-list.

Then hit enter, and then let create-react-app do its thing.

And in the meantime, I will give you a quick tour

of the app that we're going to build.

So this is the Far Away app

which is a simple travel list where we can add

all the items that we need for our next trip.

So for example, let's say we need two boarding passes

that we really cannot forget,

and then we can hit enter or click here.

And then that item gets added here to the list.

And also you see that down here we have these statistics

that just got updated.

So that's already some interactivity right there

but of course we can do more.

So for example, let's say we don't need

the charger anymore for some reason,

so we can just click there and it's gone.

We also can mark these items as completed,

so basically as packed.

So let's say we already packed that one and that one,

and then down here it says we already packed two

which is 50%, but there is even more.

So we can also sort by these three things here.

So input order or by description or by the packed status.

And so then the packed items here, they appear at the end.

And finally, maybe once we are back from our trip

and want to prepare our next one,

we can just clear the entire list at once.

So it then asks us if we are sure, and yes, we are.

And indeed then our list becomes completely empty

and that's it.

So I think this is a really nice little project

for us to learn some more interactivity,

and it has all these nice but simple features

that we are going to build.

And on top of that,

I also really like this nice design here.

It's a bit retro, which I think really fits

the vibe of this application.

And now before we start writing any code,

let's actually take a look at how

we can break up this entire design into components.

So this first big yellow part,

I think we can call this the logo of the application.

And so we're going to create one component

called logo just for this part.

Then next up, we clearly have some form here

and so that's where we are going to put these elements.

So yet another component.

Next, then we have this entire list

which I think can be called the PackingList.

And then in there each of these items

is well just called an item.

We could call it a Packing item maybe,

but we'll see once we get to the code.

Finally, down here we have this other area

which I think we can just call Stats or statistics.

So this is how we are going to break up

this user interface into components.

And we will talk a lot more about how we actually do this

so how we arrive at these different components.

But that's not the focus of this application.

Here, we just want to work a little bit more with state,

with events, and also learn

about how we can handle form submissions.

So if that sounds fun, then let's quickly move on

to the next lecture and start implementing this layout.

# Building the Layout

So with our project now installed,

let's start by building the static layout

of the application.

And as always, let's start by getting

these starter files

which in this case is just this CSS file.

So of course that we don't have to write any styles

ourselves.

Then place that here into source.

Now there will already be one

so just replace that

and since we're already here

we can get rid of all

the junk that we don't need.

So all of these,

so in the end

we just have app.js, index.CSS, and index.js.

Okay. Then just renaming

this here once again.

And then let's drag and drop it

onto the VS code icon.

Okay, so here we already have our files.

As always, we need to clean this one here

because we are importing some files that

we no longer have basically.

But that's it.

And once again, if you feel like it

you can actually delete all of this

and write the code yourself

just to practice how we can set

up this React app

from complete scratch.

But I will just leave this here

because in the end

when you build your own applications

you will always just leave

this here as well.

You're not always gonna write everything from scratch

but here actually you want to delete everything

and start from scratch.

So export

default

function app.

So this is usually always

the same as well here.

So you always have your app parent component

which will include all the other components.

And let's actually start with these other components.

So just the components

that we talked about

in the previous lecture.

So that's function,

Logo.

And now I will just quickly duplicate

this code here

just to make this a little bit faster.

So packing list.

And we also have our stats.

So these are the four big components

that we identified

in the last lecture,

remember that?

And so let's now write a little bit

of JSX for each of them

starting with the Logo.

So the logo is many times an image,

but in this case

we will just have a primary heading

and we will say far away.

And then let's add some emoji here.

Now the way we write emojis

on the Mac is by hitting

control command space bar.

And on windows, the shortcut is Windows

plus period.

So like this,

so the windows key and then plus this dot.

Alright, then here, let's use a palm tree.

So this one here

and then a bag.

Just like this.

And in case you can't get

these emojis to work

you can always just copy them

from the final files of this project.

Or you can of course just ignore them as well.

So these are just to make the design

a little bit nicer.

Okay, that's enough for the logo.

So we will just write some very simple

starter JSX here

for each component

as we are scaffolding basically this layout.

So here, let's just return

a div with the class of add-form.

And again, you can of course

explore the CSS file

and see all the CSS that I wrote

for these class names

that we are going to import here.

So in here later we will have

these form elements

like the select box,

the input box, and that button.

But for now we will just write the text.

So what do you need

for your trip?

And here we also had some emoji,

let's add that as well.

And it's actually already down here.

Okay.

And notice how eslint is complaining

that we are not using these variables here.

But of course we will do that soon

by including all of them here

in the global parent component.

So here in this app.

But again, let's leave that for later.

So we do that in the end.

For now, we just write the static part

of all the components.

And this one is the list.

So again, just like a placeholder there.

And let's make this one here

a footer element.

So remember how the stats is really

at the bottom of the page,

and so a footer seems like a good fit here.

So let's write You have

and then here in the end we will have a number.

So let's just use an X for now

items on your list

and you already packed

and then again, an X,

which is X percent of the total.

Then here we also had

some emoji

Like this other bag here.

And yeah,

I think this one was also formatted.

So let's use emphasize here.

So em.

And now with that,

let's come here to our app component

and use all of them here in our layout.

And if you want,

you can actually pass the video here

and do that as a challenge.

So just create one div element

with the class of app

and then include the four components

in there if you'd like.

So this

is how you do that.

So with the class of app

and then one by one,

one after the other

we just include them here.

So first a logo,

then the form.

So actually exactly

in the way that we define them in our code.

And by the way, in more real apps,

and also a bit later in the course,

we will start placing

each of these components here

into one individual file.

So we will then have one file called app js

for this component, one called logo js for this one

and so on and so forth.

But here, since we are still learning

I think it's easier to build all of them here

in the same file

because otherwise we are jumping

around all the times

through these files.

And so that then makes everything

a lot more confusing

especially when we get

into topics such as child to parent communication.

But yeah, more about that very soon.

So to finish the stats

and that's it.

So no component

is yellow here anymore

and so that means that we didn't forget any.

And yeah, with this we are done.

So let's open up our integrated terminal

like this.

And we are already in the correct folder.

So npm start

and let's wait for it.

Beautiful.

Well here it seems

we missed some class.

Let's make this smaller again.

All right.

And so this footer here needs the

class of stats.

Yeah, wonderful.

So this is what it's supposed to look like

and it looks exactly like our demo.

Well, except of course for these details right here

which we will take care of

starting in the next lecture.

So next up, we will start rendering

some static items here.

So we will not yet dynamically

add new items to the list

but we will render some static items

from an array here in the UI.

# Rendering the Items List

Remember how I said earlier how rendering lists is one

of the most common tasks in React development?

Well, this application is no exception.

And so let's now render the list of pecking items.

And first of all, let's go to our CSS file

because that's again where I pasted

this array of initial items.

So let's grab that.

We can also close index.js

and I will paste it here at the very top.

So you see that we have once again

an array with a few objects, and in this case

each object describes one item to be packed.

So each of them has an ID, a description, quantity,

NT OD packed property

which tells us whether this one has been packed or not.

So based on this

we will then display the item a little bit differently.

So here, well here we don't have any.

So here in the demo app.

So you see right now it's not packed, but if it is packed

then you see it is like strike through.

Now okay, so let's now take these items here and

render them as a list into our UI.

So as the name says

we're going to do that in the packing list.

So first of all, let's again use semantic HTML

and convert this diff into a UL.

So into a unordered list.

All right?

And then immediately here we enter JavaScript mode

because remember how we render lists in React?

Well, we simply use the map method that we already know

on the array.

So initial items, and later on we will, of course

then when we make this dynamic, use another array here.

But again, for now here, we just want to render something

so just to make this work.

Okay?

Then inside the map method

each of the elements will be, let's say an item.

All right? And then for each item

what we want to render is an item component.

So let's immediately write that here

and we will then create the item component in a minute.

So item, and then we passed in as a prop, the entire item.

So item and then item again, let's close this here.

So you see we have a lot of items here.

So the name of the component, the name of the prop,

and then here the object itself

which, remember, is the argument

of this callback function in each iteration over this array.

So nothing new here at this point, I hope.

So, a gift is a safe, but of course item is not defined.

So let's quickly take care of that.

And now here we need to accept the props, right?

So we can do it like this, remember, but even better

we can immediately destructure this

and then give it the name here

of the prop that we passed in, which is item.

And again, it could be anything.

It could be object like O, B, G, or X or anything.

But yeah, it's easier to just call it item here

because that's what it is.

It's just a packing item, so to say.

So here, this item should be now an LI element.

So a list item, because that's usually what direct children

of the UI or of the UL element should be.

And then just to start, just to see if it's working

let's simply render, I think it's called description.

Yes, that's it.

We'll just copy that actually.

So item dot description, give it a safe.

And there it is.

So we have passports and socks.

Now the styling here is a little bit off.

And the reason for that is

that here I actually did a mistake in the HTML.

So here let's actually create a diff, and then

it's this diff that is supposed to have the list class.

All right?

And the reason for that is that later on

we will have another element in here for these filters.

So we will have a diff for these two things down here.

All right.

So of course for me, that's easy to see now

because I already built the app beforehand.

But once you start building your apps on your own

there will be a lot more back and forth

which of course I cannot do here in this course

because then it will take just forever.

Okay, but anyway, let's now add some more here.

So we don't just want a description

we also want this icon here for the leading.

And later we will want this checkbox

but let's leave that for later actually.

So here, let's create a spin element.

So for the text, let's grab that, paste that here.

And then we also want the item dot.

Let's see, it's the item dot quantity exactly.

So item dot quantity.

And notice how sometimes prettier creates like

these empty strings here in our JSX

so many times this is not necessary.

So just get rid of that.

And now finally, we need delete button.

And for now, we won't attach any event handler here

but we will just place an icon here in the form of an emoji.

So maybe like that.

So this X right here.

And again, if you can't make this work

then you can just write the X like this or also like this.

So that would work as well.

Alright, so this has now been rendered here based

off this list.

And if we duplicate this and add something else here

like a charger, one charger, then there it is.

Now to finish, let's just mark one of them as packed.

Make this one true

so that we can add some additional styling here.

So we want to basically have some strike through there.

So that's simple stuff.

So let's come here to the item.

And here we will now conditionally add some styling.

So instead of conditionally adding a class here

I want to conditionally simply add some style.

So let's write style

and then it immediately enters JavaScript mode.

But now I will not immediately write the object

of CSS properties.

Instead, let's actually use the ary operator to

decide which object the style should actually receive.

So if item is packed, and here we don't really

need a condition because this is already a bullion.

So if it is packed

then we want an object which will contain some CSS

for the strike through, but if not,

so if the item is not packed,

then we will want to return this empty object.

And so then no styles are going to be applied.

So the CSS property that we're looking for

is called text decoration

and let's set it to line through like this.

And that worked quite nice.

All right, so let's try another one just for fun.

And yeah, immediately you see

that it gets strike through as well.

So this was yet another way

of using the turnaround operator to conditionally

set some style here.

So you see that we have a lot of freedom in React,

and again we simply use the JavaScript tools

that we already have for this kind of stuff.

# Building a Form and Handling Submissions

One of the most important things

that we do on the web

is to interact with web applications through forms.

So forms are fundamental in web applications.

And so let's now start learning

how to work with forms in React.

And first off, when we build forms in React,

we use the normal HTML form element.

So we have a form, and then here,

let's add the select, the input, and the button.

So just looking at the demo here in HTML,

this is a select element, this is an input element.

And this is just a regular button.

Now here, we need to change that as well.

And there is a setting in VS code that will make it so,

that as I update this one,

the closing tag also gets updated.

But I will find that out after this video,

and then I will let you know.

But anyway, let's now create that, select element.

And now here, we want to create a bunch of numbers.

So inside the select, we create one option with the value.

And here let's use again JavaScript mode.

So in order to pass an actual number one,

and not the string of one,

let's just duplicate this a few times,

because we will actually not use this.

So you don't need to write this code, if you don't want to.

So this is just to show you what we will do instead,

in a minute here.

Let's just create that input first, after type text.

And let's also include a placeholder here.

And again, this is just normal HTML,

what we're doing here right now.

Finally a button with add.

Now okay, beautiful.

So that looks just like here, or very similar.

So here we have the one, two, three.

So these three values.

But here in the real app, we have 20.

So of course,

we don't want to write these 20 options over there by hand,

right?

So instead what we do is to, inside of JavaScript,

we will create an array with the numbers from one to 20,

and then we will loop over that array,

and basically create a list of option elements.

So let's do that, and we will use a nice trick,

which is called array.from.

And it's not really important how this function works.

So let's just follow this here.

And actually, we will do this all the time in React.

So this trick is actually quite important.

So as a first parameter here,

we can pass in an object with a length property,

and set that to 20.

So that will then create an empty array with 20 elements.

And then as a second part,

we can pass in basically something like a map function.

So that will receive as a first argument,

the current value, and as a second argument, the index.

And so here, we are only interested in that index,

because we will now return that index,

which starts at zero plus one.

And so then we get an array, which goes from one to 20.

And if we want it,

we could just grab this piece of code right here,

and run it inside of our console, make it a bit bigger.

And yeah, indeed we are missing the key somewhere there,

but nevermind, we will fix that in a minute.

And so indeed here, we get that array from one to 20.

All right.

And now all we need to do, is to again use the map method,

and loop over this

to create our list of these option elements.

So again, specifying the value,

and now that value is simply numb and we need the key.

And that key is also numb.

So remember how that when we render a list,

we need to give each of the elements a unique key.

So the number here is of course, unique.

And then here also numb.

So give that a safe,

which makes this a little bit more legible.

And so this option

is basically just exactly what we had before here manually.

But now we create that dynamically here,

automatically from zero to 20.

So there it is.

So since we were speaking of this key here,

let's also go to this list and fix the key there.

So right here where we have that map,

we need to also pass in the key.

So that key again needs to be something unique.

And what is unique here is this ID property,

not yet material, that's user three.

And so now these IDs are unique.

And so those are the ones, we are going to use.

So usually when we get an array of objects,

each of these objects should have an id.

So that's then the perfect candidate

for using here as a key.

And again,

we will learn later exactly what this key is,

and why it's so important.

But without it, React will always complain.

Alright, after reloading it, it is gone.

And so let's go back to our form,

and the form is actually already complete at this point.

And so let's now talk about events.

So basically, what we want to happen

is when we click on this button here,

we want this form to be submitted.

And so we can then React to this form submission

with an event handler.

So let's do what I just said.

First, let's actually create the event handler.

And we will do that just like before,

right in the component function.

So here we create another function,

and this one is typically called handleSubmit.

All right?

And now all we need to do

is to listen for that submit event.

So how do you think we do that?

Well, we go right here to this form,

and then we add onSubmit.

And then all we need to do

is to pass in the handleSubmit function

that we just created.

And again, really, really important to understand

is that we don't call the function here.

So we don't do this.

Instead React, we'll call the function for us

as soon as the onSubmit event happens.

Now, when exactly is that submit event going to happen?

Well simply as soon as we click here on this button.

But for now, of course nothing is happening,

because we don't have any logic in our handler function yet.

Now another way in which a form can be submitted

is by hitting the enter key,

while we are here in the submit.

So when I'm here and I hit enter,

then you see that the form got submitted actually.

So maybe you saw that there was a brief flash of reloading,

and that's just a normal behavior of forms in HTML.

So that has nothing to do with React.

Now let's just do this one more time, so I can show you.

So writing test, and then submitting, watch what happens.

So as I told you before,

there was like a brief flash,

and then the page actually reloaded.

And so the text that we got here is gone.

Now remember

that whole conversation about the single page application.

Where I mentioned that in a single page application,

like we want to build with React,

we usually can submit a form without the page reloading.

So in other words, what we want

is for this page not to reload.

And so we need to disable this default behavior of HTML.

So the way we do that is to accept the event here.

And then here, we can use event.preventDefault.

And again, this is normal JavaScript right here.

So if you're used to working with forms

in Vanilla JavaScript,

then you probably have seen this before.

So let's see what happens now when we submit,

yeah then nothing happens.

So that's actually exactly what we want now.

We want no reload.

So we want to stay here on the same page.

So building a single page application.

Now what's with this E here actually, how does it get here?

Well as soon as the submit event happens,

React will call this handleSubmit function.

And when it does so,

it will pass into the function, the event object.

So an object with all the information

about the current event.

So again, that's very similar

to what happens already in Vanilla JavaScript.

So here we could also basically write this.

So this would be exactly the same,

but it's then a bit more obvious what happens.

So here this function gets the event,

and then we call handleSubmit with that event.

But that's kind of redundant.

So let's remove that.

So let's just quickly recap what we did here,

which was actually not a lot,

but it's still important to understand what happened here.

So first of all, we just created a, or form elements,

and then the important part

is that we are listening now for the submit event,

that happens on the form.

And that event happens on the form

as soon as we click this button,

or as soon as we hit enter

while we are in this input element.

And again, that is just some normal behavior of HTML.

Now we could also not listen to the submit event,

and instead listen for on click right here.

So we could do like this, net end for example,

create a function, handleClick.

So instead of handleSubmit.

So that would also work,

but it would only work on the click of the button.

So that would then not work, when we hit enter while here.

But we do actually want that.

And so let's instead, listen for the submit event.

And by doing so, we are leveraging the power of HTML forms.

Now the next question

is how do we actually get this data from the form

into this event handler, right?

Because of course the goal

is to do something with this data.

So with this quantity and with this item description.

Well there are multiple ways of doing so.

So we could get that data right from the event object.

So let's just see,

we could like log this event to the console.

So let's see what happens.

So here we get this synthetic base event,

and we will talk about

what this synthetic event is a bit later.

But you see that here we get the target.

So basically the element on which the event was fired.

And then there we have, for example,

the input on which we can see the value.

So test is exactly what we have here, right?

However in React, we usually don't do this.

Instead, we use something called controlled elements.

But that's a topic for a whole new video.

And so let's now take a break and come back in a second.

# Controlled Elements

Let's now learn about yet another

fundamental React concept which is controlled elements.

So let's take a look what they are

and how we use controlled elements

when working with forms in React.

So to start, what we need to understand is that by default

these input fields like this input and also this select

they maintain their own state inside the DOM.

So basically inside the HTML element itself.

Now this makes it hard to read their values

and it also leaves this state right here in the DOM

which for many reasons is not ideal.

So in React, we usually like to keep all this state

in just one central place.

So inside the React application and not inside the DOM.

And so in order to do that we use a technique

called controlled elements.

And so with this technique

it is React who controls and owns the state

of these input fields and no longer the DOM.

So since we want to now keep this data

inside the application, what that means

is that we need some state, right?

Because that form data of course changes over time

and we also want to maintain our application

in sync with it.

So in order to implement the controlled elements technique,

we follow three steps.

First we create a piece of state.

So let's start with that

and we will start here with this actual input element.

So with this text field right there.

So that field is for the item description.

And so we call it description.

And then as always, the setter function is set description.

And so then we use the use state hook.

So the use state function.

And then just like before, when VS code shows us

this auto completion here

make sure to click here or to hit enter

because that will then automatically include

so it will import this use state hook into this file.

So it will automatically include this line of code

and then for some reason that didn't work in your VS code

then make sure to just write this out by hand.

Now the default value

for this description can just be an empty string like this.

And so now we finished the first step of this technique.

So we have our piece of state

and now we use that state as a value of the input field.

So we come down here

to the input that we want React to control

and then we specify the value

which again is just a normal HTML field, alright?

So even in HTML you can use value

and then set it to something.

So we could also do just this.

Alright? But now we don't want that.

But instead we want our description.

Give it a save and there we go.

Let's just reload to get rid of this.

Yeah, here we get another warning

and it's already telling us the third step

that we need to take.

But for now, let's just see what happens if for example

here we write now test.

So you see now our input field has the value of our state.

Okay and now for the final step,

we of course now need to somehow connect this state

with the value that we are actually going to type there

right, because now the state will simply always stay empty

even if we type something here.

So React is now controlling this element

and always sets it to the description.

But the description right now always stays

at this empty string.

And so no matter what we do,

right now we cannot change this.

So what we need to do is to also on the same element

listen for the change event.

So that's using the on change prop.

And then here let's just define an inline function.

And this function receives the event that was fired off.

So in this case the change event.

And then here, let's just type the code

and I will explain what actually is happening here.

So set description, e.target.value.

All right and now if we type here,

first let's reload again,

now that we type here, it works.

And to make this even more visual

let's come back here to our dev tools.

And then here in the form,

we need even more space.

So you see that we have our state of test

and if we write here,

then notice how that state down there is updating

so we can write anything.

And then basically it will get synchronized

with this state that we have in our application.

And so now it is in fact React that owns the state

and that is controlling the state.

But now back here to this line of code.

So basically, whenever we type something in this field

the change event is fired off and we can react

to that event here with this on change event handler.

And so here we pass in the function

and the function as always receives the event.

And then on the event we read target

and e.target is basically this entire element.

And then this element.value is exactly

the text that we wrote.

And just to make this a bit more visual

'cause I know that this can a bit tricky to understand

so I want to make sure that you get it.

So let's log to the console, also this e.target maybe.

So as I delete now, this will fire off the change event.

And so then here we get e.target.

So as I hover it, you see that e.target

is the entire element indeed.

So watch what happens when I set

or when I log e.target.value.

So immediately that character that I just typed

was logged here to the console and not just the character,

but actually the entire value.

So now I write another one

and then now we get t then test and then test.

And so it is this value that each time

that we write something,

we set as the new state of the description, all right?

So just to drive this home,

each time that we type here, we set the state again.

So we set it to the string that is currently

in this input field, which will then re-render this view.

So this entire form here actually.

And so then that new state

of description will get placed there as the value.

So we always need both the value

and the change here on the input element.

Let's get rid of these curly braces here.

Yeah, just like this.

And just to see if we actually understood this

we now need to do the exact same thing

with the select element.

And if you want, you can actually pause the video

and try that as a challenge now.

So did you try that?

Well, if not, that's no problem at all

'cause we only did this once, so I understand

that it's still quite fresh and maybe confusing.

But anyway, we now also need to control this

select input element right here.

So that's going to be the quantity.

So let's call that state quantity.

And the setter function is set quantity.

And then again, use state and here the default value

we want it to be one, let's just say five for now

just so we see the effect in the UI.

Okay? So that's the first step.

Now the second step is to then define the value.

And so in this moment

React then starts controlling this element.

So value of quantity, well, what was that?

And you see, immediately we get this five.

Again with this, it's easier to see with our dev tools.

And yeah, so that's the five.

But of course if we change this now

then nothing will happen.

And so the reason for that is the same as before

because this value is now coming from our quantity state.

The DOM is no longer in charge of this value now,

the only thing that we now have to do

is to give this the ability to change itself.

So to basically update the state

each time that we change this value here.

So that's again using the on change handler.

And this function gets the current event.

And here we now do the exact same thing.

So we set quantity

based on e.target.value,

and by the way, this value is coming directly

from the option so right from here.

So that's why we need to set the value

here inside of each option.

Just to make sure, let's give it a save.

And there we go.

So you see it changed here and it also changed here.

Maybe you cannot really see this

as it's right at the bottom, but yeah, here is the 10.

Now what we can see immediately is that this is

a string while in the beginning when we first load the app,

let's try that, we get the five but without the quotes.

So now this is actually not a string, it's still a number.

And that's because we set the default here as a number.

But then as soon as we change this

for example to something, then here we get this string.

And so the reason for that is that here

e.target.value is always a string.

So before we place this value into the state

let's first convert it to a number.

And we can do that in a few different ways.

We can use the trick of using a plus

or we can be a bit more explicit,

for example using the number function.

So I prefer to doing it like this

which makes the code a bit more readable.

So give it a save and now

let's see, yeah, now we get a number

and of course still when we write here

that will also update the state down here.

And this was actually an excellent demo

to show you how useful really these dev tools are

because they allowed us to immediately spot

that we didn't have a number here by the string.

And so with this, we prevented a potential bug in our code.

Great, so hopefully you got that

so you understood exactly how that works.

So just to quickly recap,

the technique of controlled elements

basically consists of three steps.

So we define a piece of state, like this description here

then we use that piece of state

on the element that we want to control.

So we basically force the element to always take the value

of this state variable.

And then finally, of course

we need to update that state variable.

And we do so here with the on change handler

where we then set the description

to the current value of that input field.

And so with this, it is now this component.

So basically it's React who is in charge

of the state and really of the entire element.

And so that's the reason why this technique

is called controlled element.

Great. So that should be clear now.

And so let's now go ahead

and just quickly use these values here.

For example, we can create a new item object

so a description, quantity,

also we have the packed state in each of these items.

And by default of course the items should not be packed.

So let's set it to false here.

And then we also need an ID.

Now we could use some library here to generate that ID

but let's do it quick and dirty here, just with date.now.

So that should just work here in this case.

And then for now, we will just log it to the console.

Alright, let's go to our console, reload, all of this.

And actually let's also set it to one

which is the default that makes most sense.

So let's say that we need 10 shirts.

So hit enter and beautiful.

So we got our data here from the state

and it contains the description

it contains the quantity right here.

And then these other data that we just defined.

So some random ID and also this packed state set to false.

So with this we learned how we get now this data

out of the form.

Now just to finish, let's tweak

or handle submit function a little bit.

For example, when this happens, so when we submit the form

without any item, then still this works.

But the description is simply set to an empty string

which is already filed here.

However, we don't want this to happen.

So when there's no description here

then we shouldn't even be able to submit the form.

So that's simple enough.

We can just add like a guard clause here.

So we can say if there is no description,

then return immediately.

So basically then nothing's going to happen.

And again, this is some normal JavaScript,

nothing to do with React.

So you see nothing happens now, but if so

then we get our object.

And now finally, usually when we submit a form

then afterwards, once that submission is done

the form should go back to its initial state.

So let's also do that.

And for that we can simply use our setter functions, right?

And so that's the beauty

of React being in charge of the form

because now all we have to do is to update the state

and then this enables React to automatically keep this state

in sync with these form elements.

So basically that's the whole idea

of the controlled elements.

It's to allow React to keep our component state

in sync with the state of these dumb form elements.

But anyway, let's now do what I just said.

So setting the description back to its initial state

and set the quantity also back to its initial state.

So let's try that one more time.

And beautiful.

So that worked really, really nicely.

So this form is now a lot more real world.

It's back to its initial state.

And then down here we get the data.

But now what do we do with this data?

So at some point we will want to actually render

this new object here into the user interface.

So right here into this packing list, right?

So how do you think we will do that?

So how can we get this new state?

So basically this new object that we just created

into this list.

And just as a reminder, this list,

well, it's even easier to see in the componentry.

So we have the form, and here is the list.

So we want to get the data from this form

into this packing list right here.

So do you think that we could do that with props?

Well, not really, right?

Because these are sibling components.

The form is not a parent component of the packing list

and therefore we cannot pass props from form

into the packing list, right?

So because data can only flow down the tree

but not up or sideways.

So that was one of the important things

that we learned about props, remember that?

So therefore, if we cannot use props in a simple way

we need to find another solution.

And so this is where we really need to start

thinking more about state and state management.

But since this is so important as a React developer,

I created an entire separate section

about thinking in React and that section is up next.

So what we're gonna do now is to take a break

in this application and finish this section

with a brief summary and a challenge to consolidate

our knowledge about how to use state in React.

And then after that, we will come back

here to this application

and then we will really make it work.

So then we will be able to pass data

basically from the form into the list.

So that's going to be a lot of fun.

So make sure to finish this section

and then right afterwards,

let's keep going with this application.

# State vs. Props

A very common beginner question

or sometimes even an interview question is this,

what's the difference between state and props?

Well, we actually already learned almost everything

to answer that question,

but let's still make the difference between state

and props crystal clear in this lecture,

which will also serve

as a nice summary to this entire section.

So as we already know, state is internal data.

So data that is owned

by the component in which it is declared,

and we can see that nicely

in this small example with two components.

Now, on the other hand, props is external data.

So data that is owned by the parent component,

and you can think of props as function parameters.

So as a communication channel between parent

and child components where parents

can pass data into children.

State on the other hand can be thought of

as the component's memory

because it can hold data over time,

so across multiple re-renders.

Now state can be updated by the component itself

and as we already know, this will then

cause the component to be re-rendered by React.

Therefore, we use this mechanism

of state to make components interactive.

On the other side props work very differently.

They are read only, so they cannot be modified

by the component that is receiving them.

However, and this is something

that we haven't learned before,

when the child component receives new updated props,

that will actually also cause the component to re-render,

and let's actually analyze that here in this code example.

So one of the props that was passed to question

is called "Up Votes",

and that up votes variable is actually state

and the parent component, right?

It's created using the useState Hook

and therefore up votes is in fact state.

Now if this piece of state is updated, of course

the question component who owns the state

will be re-rendered,

but it makes sense that the child component

who basically receives that state as props,

should also be re-rendered right?

Because how else would the button component

be kept in sync with the state that it received as a prop?

So in conclusion, whenever a piece of state is passed

as a prop, when that state updates,

both components are re-rendered.

So both the component owning the state

and the component receiving the state as a prop,

and so this is a very important connection between state

and props that you should keep in mind.

Now finally, while state is used by developers

to make components interactive,

props are used to give the parent component

the ability to configure their child components.

So basically props can be seen

as settings in child components,

which the parent component can define as they wish,

and that's it.

So if you ever get asked the difference

between state and props in a job interview,

I sure hope that you're going to nail it.

# EXERCISE #1: Flashcards

From my experience,

it's not super hard to understand how state works in React.

But it can actually be quite tricky

to understand how exactly to use it

in practice in different situations.

But the thing is, that this is the number one skill

that you need to have as a React developer.

And that's why I decided to create this extra exercise

that we're going to build together now

to give you more situations

and more opportunities to practice.

So let's go.

And here is the exercise that we're going to build.

And it's actually a small project even.

So this is a flashcard project

where a flashcard is basically a question on one side

and then, when you click it,

you get the answer on the other side.

So imagine that you can rotate each of these cards here,

which is what many people use to study.

So if I click here now again,

then it'll basically turn the card around again.

If I click here, then it opens this one.

And while this is open and I click on another one,

then you see that one closes and this one opens.

All right.

So this is gonna be a small, fun exercise

which maybe looks very complex to you right now,

but actually all we need is one piece of state

to control all of this.

Now I added a starter file to the link of this lecture.

So that's this code sandbox here.

And so here we already have an array with all the questions.

And once again, that's an array of objects.

All right.

And so what we're going to build

is this flashcards right here.

So all you have to do is to fork now with this code sandbox

or you can just also copy paste this entire code

into your own code editor on your computer.

So that's your choice.

But what I will do is to now fork this,

which will basically create a copy in my own code sandbox.

All right.

And so let's get started.

And the first part is to actually render out

these different flashcards like this.

So basically only the front part

which contains all the questions.

So you'll see that each one has an idea,

a question, and an answer.

But of course, by default, only the questions are visible.

So we already know how to render lists.

We just enter JavaScript mode,

then we take our questions array and map over it.

So each of them is a question.

And then here we can render some JSX.

Now, many times what we do here

is to create an extra component.

So just like we did in the far away travel list app

that we're currently building, but we don't have to.

So we can also just return some JSX here.

And so that's what we're going to do now.

So just another div.

And then in there a paragraph with the question.

So that's question.question actually, and that's all.

Close that and close the div as well.

And there we have it.

Now what's missing here, is the class name of...

flashcards.

So as you see, I already created some CSS.

So if you copy the code into your own computer,

then make sure to also copy the contents of this style.css.

Okay, now we see that here we have some problems

which are related to the key.

Exactly, so each one needs a unique key.

And so, well, we can just put that here.

So key, and then let's use question.id

because these are unique values,

and as you know, each element that we render here

inside the map, so as a list, needs a unique key.

So if I reload now, then these errors will be gone.

Okay, so we have now our static parts all built out.

Now what we need to do is something to happen

whenever we click on one of these components here,

or actually, each of these elements.

So how are we going to do this?

Well, as I said initially,

all we need is actually one piece of state

and that piece of state will keep track

of which question ID is currently the active question.

And if that sounds confusing, then let's just write a code.

So let's call this the selected ID

and then setSelectedId.

useState.

And then, here we will want to start with null,

because by default we want none of the questions

to be open in the beginning,

so to be selected in the beginning.

And so that's what null is for.

So null is basically just nothing.

So now here we need to import useState from React.

All right.

And now let's remember the three steps of using state,

which I like to always come back to

because I think this makes it a bit more helpful

to understand how we should approach this.

So the first step is to define the state variable,

which we already did.

Second is to then use that state variable,

and third is to update it.

So as for the second point, let's now do that.

So let's use the selected ID here for something.

But well this time this is a bit tricky, right?

Like what do we actually need the selected ID for?

Well let's maybe make it easier

by instead of using null here, using one of these.

So one of the actual IDs.

So 9103.

So if this is the state.

So let's imagine that we just clicked on this one here,

how to give components memory.

Let's say that we just clicked here

and so that this is then the state.

So how do we want to use this state?

Well basically here, instead of displaying the question,

we want to display the answer.

So we can do that.

We can say question.id equals the selectedId

and if it is, display question.answer.

And if not, well then of course the question.question.

And so now here, we actually this time got the answer.

So that's the useState hook.

And so that's already working.

So let's do the same thing for the styling because here,

actually this gets like with this red background

and so we can use a class that I created for that

and edit here to this div.

So let's do something similar then.

So className, enter JavaScript mode,

and then we do the same thing.

So if the current question.id is equal to the selectedId

then here the class name should be selected.

And if not, then nothing.

And there we go.

So beautiful.

Just make sure that you actually understand

what is going on here.

So as we loop over this array here,

each of these elements is one of these divs, right?

And in each of these divs we have access

to the current question object,

and then each of them has one ID.

And so what we can then do is to compare that ID

with the selected ID.

So the one that we have currently selected.

And if that is the same, then well it's just what

we have written here.

So if it is the selected question,

so if the selected ID is equal to the one

that is in the object, then simply display the answer.

And otherwise, in all other cases,

well then display the question itself.

So not the answer.

All right.

And now, let's set it back to null.

And now, all we have to do is to set the state.

So that's the third step.

So when do we want to update the state?

It's whenever we click here,

so in one of these divs.

And so that's where we place the onClick handler.

So as you see,it doesn't even have to be a button

or anything like that.

Okay? And now what we are going to do is to

create a function here.

Just to make our code a bit easier to understand.

So let's call it handle click.

So for now just the name of the function.

So here we need to now then pass in that function

right? However, that is not really enough

because well, here we will now call set selected ID,

but as the name says

we now actually need the ID of the question that

should become the selected question, right?

And so what this means is that this function

needs to receive that ID so that we can then set it here.

So now we need to call this handle click function.

With that I'd.

So simply enough question.id.

But don't make the mistake of thinking

that this is finished.

And actually React already gave us here an error.

So remember that here we need to pass

in an actual function and not a function call

like we have here.

So this is calling handle, click immediately.

That's not what we want.

We want to pass in a function so that React can

then call the function as soon as the event happens.

And test should already be enough, at least for now.

So that worked great!

And as I click on another one, then of course this one

becomes the active one.

And let's check out the React dev tools

because Code Sandbox actually also

has the React tools integrated.

So when we come here to the app, or actually flashcards,

notice that the state is now 9103,

which is exactly this idea.

When we click here, it becomes,

That should've updated,

but apparently it doesn't work that great.

So yeah, well maybe, nevermind,

let's just close this down again.

What matters is that it is working at least kind of

because watch what happens when I click here again.

So nothing happens, of course, because, well

because here we are simply passing in that id

and then we are setting that ID as the selected ID.

So just as expected.

But as we see here, as we click again

it actually closes the card again.

So this functionality we already have of

changing between cards

but when we click on it that we don't have yet.

So let's do that.

And it's not too hard.

Basically what we want to do here is to set this ID

based on a condition.

So we want to say if the question ID

is different from the currently selected one

then the result here should be the id.

And if not, well then set it back to now.

Now here there's some problem.

Ah, yeah, I have one equal too much.

All right.

So again, if the question ID is different

from the already selected ID, then set the ID.

And so that's exactly this behavior, right?

But if not, so basically if the question ID

is already equal to the selected ID

then set it back to null.

And so with null, then none of them will be active.

And yeah, that works and I think it makes sense as well.

So this usage of state here was quite a

bit different from what we had before.

And so that's why I decided again

to include this exercise here by the end of this section.

So please make sure to study exactly what is happening here.

And then after that, I think you are ready

for the final coding challenge of this section.

app.js

```js
import "./styles.css";
import { useState } from "react";

export default function App() {
  return (
    <div className="App">
      <FlashCards />
    </div>
  );
}

const questions = [
  {
    id: 3457,
    question: "What language is React based on?",
    answer: "JavaScript",
  },
  {
    id: 7336,
    question: "What are the building blocks of React apps?",
    answer: "Components",
  },
  {
    id: 8832,
    question: "What's the name of the syntax we use to describe a UI in React?",
    answer: "JSX",
  },
  {
    id: 1297,
    question: "How to pass data from parent to child components?",
    answer: "Props",
  },
  {
    id: 9103,
    question: "How to give components memory?",
    answer: "useState hook",
  },
  {
    id: 2002,
    question:
      "What do we call an input element that is completely synchronised with state?",
    answer: "Controlled element",
  },
];

function FlashCards() {
  const [selectedId, setSelectedId] = useState(null);

  function handleClick(id) {
    setSelectedId(id !== selectedId ? id : null);
  }

  return (
    <div className="flashcards">
      {questions.map((question) => (
        <div
          key={question.id}
          onClick={() => handleClick(question.id)}
          className={question.id === selectedId ? "selected" : ""}
        >
          <p>
            {question.id === selectedId ? question.answer : question.question}
          </p>
        </div>
      ))}
    </div>
  );
}
```

index.js

```js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

style.css

```css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  padding: 20px;
}

.flashcards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.flashcards div {
  border: 1px solid #e7e7e7;
  background-color: #f7f7f7;
  border-radius: 7px;
  aspect-ratio: 2 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  cursor: pointer;
}

div.selected {
  border: 1px solid #e03131;
  background-color: #e03131;
  color: #fff;
  font-weight: bold;
}
```

# CHALLENGE #2: Date Counter (v2)

Let's wrap up this section

by continuing to work on the date counter challenge

that we started earlier.

So in this part two of the challenge,

we will upgrade the date counter that we built before.

So, we can still click here on these buttons

to move forward in the date,

but now we can also directly go to a date

by defining a count here.

So for example, 1000 days from now is,

well, this one here,

or 10,000 or 100,000,

and you can keep going as you wish.

So let's put it back to 1.

So that is the upgrade here for the counter,

and the step is also different.

So instead of these buttons that we had before

so similar to these ones,

we now have this slider.

And so now if we click here,

we move up this seven here,

but the seven was now defined using this nice slider.

And this slider is actually just another type of

HTML input element,

but I will show you that here in a minute.

Finally, what we also have is that we can reset.

So when we click Reset,

it goes back to 0 here and back to 1 in the step.

And this button is only visible

when one of these two changes.

So let's go back and let's do that.

So here I still have to code from the previous challenge,

and what I'm going to do now is to fork this.

So this will basically create a copy out of that other one,

and so now I can keep writing the code here

without changing the initial one.

So what I wanted to quickly show you here is that slider.

So, we can use the input.

So as I said, this is now an input

and the type is of range.

And then we set a minimum value,

you can set that to 0,

and a max value to 10.

Let's see.

And there we go.

So now this is of course an uncontrolled element now.

So right now, React is not in charge

of controlling this value.

And so what you need to do, as you can imagine,

is now make this input element a controlled element

and then also this one right here.

So with this, you'll practice what we just learned

a little bit earlier, right?

And in case you have any doubt,

you can just go back to that lecture

and check out the code that you wrote there.

So, let me just show you here the result

so you know what you have to build.

So good luck with this challenge,

and I see you back here in a few minutes once you are ready.

All right, let's now quickly supercharge

basically our counter component.

So most of the things are actually not going to change here.

So we already have the step state.

All we have to do is to connect it now

so with this input element.

So the value of this element should be of course

controlled by that step state.

And then, we need the onChange handler

just like before.

So we get the current event

and then we set the step based on that event,

so event.target.value.

And then we can get rid here off this button.

And let's see.

Yeah, that works already.

And indeed, well,

that doesn't really work, does it?

So it is adding the 10 as a string.

So we have a bug in our code.

So the problem as you can see

is that this value here is taken as a string.

So that's actually the problem that we had before

and that we detected using the React DevTools.

And in fact, the DevTools are also available here

so we could see the same thing here.

So the state is 10,

so 10 is a string.

So we just do what we did before,

which is to convert this value to a number

before we then place it into the state.

So let's reload that here.

Take some time,

and let's set it to something.

And that's working now.

And you see here that we have,

well, that's not correct really for some reason,

but what matters is that here it's actually working.

So, maybe the integration here in CodeSandbox

is not as good.

But yeah, nevermind,

what matters is that this part is working already.

And now all we have to do is to create

an input element here as well.

So that should also not be so hard.

So we no longer need this span,

but instead we will use an input

of the type text,

the value here is count,

and then onChange.

Basically we want almost the same thing as before.

So we get the current event

and then setCount,

and then this time we're not going to forget

the conversion part.

So we convert

to a number e.target.value.

And now all we need to do

is to close down this element,

give it a safe.

And yeah, this all looks correct to me.

Let's see.

Something's happening here,

let's close down the React Tools maybe.

Yeah, anyway, let's just reload here just to be sure.

So this works.

And now if we input a value here, yeah, nice.

So that's really, really nice.

So with this, we have a bit more control over the component

and we can calculate dates from now, which is quite helpful.

But yeah, let's just review quickly what we did here.

So these two input elements

are now controlled elements

for the same reason that we already saw before.

So we have a piece of state

and we then connect that piece of state,

for example here, the step, with the input element.

So we force this input field to take the value

of the step piece of state.

But that alone is of course not enough

because with that, we would not be able to then change

here the value.

And so we then need to handle the event

of actually trying to change,

so of sliding here basically,

so each time we slide the change event is fired off.

And so then each time that happens,

we want to set a step

with the current value of the element.

So that's e.target.value.

Nice. And finally, the only thing that's missing

is that reset, so that button right here.

So let's then create a button down here.

Let's create another div where we place that button into.

So Reset, close that,

and close the div.

So we want something to happen on the click,

so we use the onClick prop.

And now here, let's actually do this as a separate function

because here we will need to set two pieces of state.

So let's call this handleReset.

Now that does of course not exist

so we get this complaint,

so let's fix that handleReset.

And so what's going to happen here?

Well, all we have to do is to set these two

back to their initial state using their setter functions.

So, setCount will go back to 0,

and the step will go back to 1.

So, yeah, that works.

The only thing that's different between

the demo that I showed you

is that we should not display this Reset button

when there's actually nothing to reset.

So basically, what we want to do

is to conditionally render this part here.

So let's wrap it into a JavaScript block.

And then we can say,

if count is equal to zero,

or if step

is different than one.

So count different from 0,

or step different from 1.

So 0 is the default for count

and 1 is the default for step.

And so if one of these defaults is different,

then we want to conditionally render this part.

So for that, we can again use the end operator,

or maybe just, why not,

lets this time use the ternary operator.

So in this case,

maybe we should just put a parenthesis around this.

So just to make sure that this is one condition

that gets evaluated first.

So in this case, render this,

and else, render nothing.

All right.

So as soon as we change this, we get a button,

or as soon as we change this, the same.

Beautiful. So that's exactly what we wanted to build.

And so we are finished with the challenge

and we are finished with the section.

And so let's waste no time

and let's keep working on the far away list

right in the next lecture of the next section.

app.js

```js
import { useState } from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  function handleReset() {
    setCount(0);
    setStep(1);
  }

  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  return (
    <div>
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
        <span>Step: {step}</span>
      </div>

      <div>
        <button onClick={() => setCount((c) => c - step)}>-</button>
        <input
          type="text"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <button onClick={() => setCount((c) => c + step)}>+</button>
      </div>

      <p>
        <span>
          {count === 0
            ? "Today is "
            : count > 0
            ? `${count} days from today is `
            : `${Math.abs(count)} days ago was `}
        </span>
        <span>{date.toDateString()}</span>
      </p>

      {count !== 0 || step !== 1 ? (
        <div>
          <button onClick={handleReset}>Reset</button>
        </div>
      ) : null}
    </div>
  );
}
```

index.js

```js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

style.css

```css
.App {
  font-family: sans-serif;
  text-align: center;
}
```

# What is "Thinking in React"?

Let's start the section

by discovering what thinking in React is actually all about.

So as you might have noticed by now,

building React applications

requires a completely new mindset

because it's just very different from building applications

with vanilla JavaScript.

So to build React apps,

you not only need to learn how to work

with the React API in practice

like with all the different functions like you state

but you also need to be able to think in React.

So you need to basically enter the React mindset.

Now, once you have both of these skills,

you will have mastered React

and you will be well on your way

to building professional React applications.

Now, what does thinking in React actually mean?

Well, while you're building an application,

thinking in React means

that you have a very good mental model

of how and when to use all the React tools

like components, state, props, general data flow, effects,

and many more.

It's also about always thinking

in terms of state transitions

rather than in element mutations as we have learned before.

Now, you can also view thinking in React as a whole process

which can help us build apps in a more structured way.

And the first step in this process

is to break the desired UI into components

and establish how these components are related

to one another,

so to establish the component tree.

This also includes thinking about reusability

and composability of components.

After that, we can start by building a static version

of the application.

So without any state and interactivity,

and this is great

because by doing this,

we do most of the coding upfront

before having to worry about state and interactivity.

That part comes next,

so in step three where we think about state.

So here we decide when we need state,

what types of state we need

and where to place each piece of state.

Then finally, we think about establishing how data flows

through the application.

This includes thinking about one-way data flow,

child-to-parent communication,

and the way global state should be accessed.

So these points, three and four,

is what we collectively call state management,

which is the main focus of this section.

Now, of course, this is not a rigid process

that we always need to follow to the letter.

In practice, there's always a lot of back and forth

between these different steps

and things are never this linear,

but it's still good to have a process like this

as an overall guideline.

Okay, now, once you really know how to think in React,

you'll be able to answer questions like

how to break up my UI design into components,

how to make some of my components truly reusable,

or how to assemble a user interface

from reusable components.

Now, we also think a lot about state,

like what pieces of state do I need

for the interactivity that I want

and where to then place each of these states,

or in other words,

what component should actually own each piece of state,

or what types of state can or should I use,

and in more general terms,

how to make my data flow through the application.

Now, as you might have noticed,

we already started to talk about some of these topics before

but I still wanted to have one section

where I really focus on some of these skills

so that you can start getting more and more

into the React mindset.

Now, of course, you will only really master these skills

through practice and writing code,

and lucky for you, we will do lots of that in this course.

But we will also take a bit of a theoretical approach

from time to time just like in this video,

because I believe that it's really, really important

that I teach you these things

besides just the React API itself.

And by doing so,

I make this course really as good as possible for you

and in my opinion, way better

than all the other React courses out there.

But anyway, let's now move on

to looking at the fundamentals of state management.

# Fundamentals of State Management

We learned before that state

is the most important concept in React.

Therefore, managing state is the most important aspect

when it comes to thinking in React.

And so let's now talk

about the fundamentals of state management in React.

So as you already know, we can use the useState function

to create multiple pieces of state in order to track data

that changes over the life cycle of an application.

Here we have many examples of state

in the Udemy application that you are familiar with.

And if you want, you can pause the video

and quickly analyze this.

Now, all this looks like a bit of a mess, right?

Like how do we know

that we even need all of these pieces of state?

And how do we know where exactly to place them

inside the code?

Well, that's where state management comes into play.

Now, state management can be defined

in different ways by different people.

But I like to think of state management

as deciding when we need to create new pieces of state,

what types of state we need,

where to place each piece of state inside our code base,

and also how all the data should flow through the app.

And to summarize all this,

I like to use the analogy that state management

is basically giving each piece of state

a home within our code base.

Now, up until this point, in our small apps,

we never had to worry about state management at all.

We simply placed each state

in a component that needed it and that's it.

But as an application grows, the need to find the right home

for each piece of state start to become really important,

no matter if that home is the component

where we first need that state,

some parent component or even global state.

And speaking of global state,

let's actually analyze the difference

between the big two types of state that exist in React,

global state and local state.

Now, this will only become more important to us later on,

but let's still start learning about this

inside this Thinking About State section.

So in React, each piece of state

is either local state or global state.

So local state is state that is only needed in one component

or any few different components,

like child or sibling components.

We simply create a piece of local state

using the useState function inside a certain component.

And that piece of state is then only accessible

to that exact component and maybe to its child components

if we pass the state using props.

Now going back to our Udemy app,

an example of local state

might be the input text in the search bar.

So probably only that component

needs to know about this data.

And therefore, this is local state,

so state local to that search bar component.

Now about global state,

this is state that many different components

in the app might need access to.

Therefore, when we define state as being global,

that piece of state will become accessible

to every single component in the entire app.

It's shared between all components,

and therefore, we can also call this shared state.

In practice, we can define global state

using React's Context API

or also an external global state management library

like Redux that you might have heard of.

Now, in this Udemy app,

one piece of global state is the shopping cart.

So that piece of data is used all over the place here.

So all these components need access

to the shopping cart state,

and therefore, it makes sense that this is global state.

Now, this distinction between local

and global state will matter more in large applications.

So in the app we're building right now,

we won't have any truly global state,

and we're actually gonna keep using just local state,

doing parts one and two of this course.

And in fact, one important guideline in state management

is to always start with local state

and only move to global state if you really truly need it.

And we will learn all about this

in part three and four of the course.

But for now, let's take a look at how to decide

when we actually need state and where we should place it.

So this slide will basically be a flow chart

that will help you take those decisions,

so again, about when to create state and where to place it.

So it all starts with you realizing

that you need to store some data.

Now when this happens, the first question to ask is,

will this data change at some point in time?

And if the answer is no,

then all you need is a regular variable,

so probably a const variable.

However, if the data does need to change in the future,

the next question is, it is possible to compute

or to calculate this new data

from an existing piece of state or props?

If that's the case, then you should derive the state.

So basically calculate it

based on an already existing state or prop.

And this is a pretty important concept,

so there is a separate lecture

on derived state later in the section.

However, most of the time you cannot derive state.

And so in that case, you need to ask yourself

whether updating the state should re-render the component.

Now, we have already learned before that updating state

always re-renders a component,

but there is actually something called a Ref

which persists data over time like regular state,

but does not re-render a component.

So it's basically a special type of state

that we will look at later.

Now, most of the time you actually do want state

to re-render the component.

And so what you do is to create a new piece of state

using the useState function,

and you then place that new piece of state

into the component that you are currently building.

And so that's the always start with local state guideline

that we talked about in the previous slide.

And with this, we have completed

the decision process of when to create state.

So again, most of the time you will just create

a new piece of state using the useState Hook,

but there are also all these other cases.

And so it's important that you are aware

of when to create each of them.

But anyway, let's now focus

on where to place each new piece of state.

So if the state variable that we just created

is only used by the current component,

then simply leave it in that component, and you're done.

So that's the end of the process right there.

However, the state variable might also be necessary

for a child component.

And in that case, simply pass the state down

into the child component by using props.

So easy enough, right?

Now, if the state variable is also necessary

for one or a few sibling components

or even for a parent component of your current component,

it's time to move that state

to the first common parent component.

And in React, this is what we call lifting state up.

And this is another one of those super important topics

which we will actually start using in practice

in the next video.

Now finally, the state variable might be needed

in even more than just a few siblings,

so it might be necessary

all over the place in the componentry.

And what does that sound like to you?

Well, that's right, that sounds just like global state.

But since we won't need global state for some time,

we will complete this diagram once we reach

the global state management lectures.

All right, so I hope that this diagram will be useful

once you start building your own small apps

or even throughout the rest of the course.

Now, I know that this look super confusing

and like a lot of work for now,

but it will become really intuitive over time.

So at some point, you will just automatically

and intuitively know when to create a piece of state,

you will know when to derive state from existing state,

and you will intuitively know when to lift state up.

But this flow chart can still be quite helpful

in the beginning.

# Thinking About State and Lifting State Up

Welcome back to the Far Away application

that we started building in the previous section.

And now, let's add some important state to the app

and then also, lift that state up.

But before we start doing that,

let's recap where we left off

at the end of the previous section.

So, remember how we made our form here

with these two controlled elements?

So, the state of these two elements

is controlled here inside the form component

with the description and the quantity state.

Then, whenever this form here is submitted,

the submit event will fire off.

And so then, we are handling that submit event here

using the onSubmit prop with the handleSubmit function.

So, this function right here.

Then, if there is a description,

we create this new item object

which, right now, we are only logging to the console.

So, let's try that.

And so you see, we got an object

with a description, the quantity,

the packed status set to false by default

and some random ID right here.

Now, okay?

But again, right now,

we are only logging this piece of information.

So, this new object here to the console.

But now, let's do actually something else.

So we want to store this information somewhere

and to help us with that,

we can actually use the flow chart

that we just looked at in the previous lecture.

So, we already know

that we want to store some piece of information.

Now, will that data,

so that information change at some point in the future?

Well, yes.

It definitely will each time that we add a new item

to the items list.

Now, can that data be computed from existing state or props?

Well, no. It cannot.

So therefore, we cannot derive state.

Then the next question in our flow chart

is whether this new data

should actually re-render the component

whenever it is updated.

And the answer to that question is a resounding yes.

And so therefore, as we already expected,

the result of this first part of the flow chart

is that we need to create a new piece of state

in the component that we are currently building.

And so with this,

we finished the first half here of the flow chart

which is about when to create a new piece of state.

Now back here in our code, let's actually do that.

So, let's create a new state variable called items.

And then, as always, we have our setter function,

in this case, called setItems.

And so then, useState.

And now what do you think will be the default value

for this state variable?

Well, remember that these items here

are basically the packing items

that are displayed here in the UI.

And so this, remember, is an array

and therefore, our initial state for the items

is just an empty array.

So, when we open up a new packing list...

So, when we open up this app for the first time,

of course, we don't want to have any items.

And so, that's what the empty array here basically is.

Okay?

And so now, let's actually use

the setItems function here

to add our new items to the items array.

And actually, let's do that in a separate function

and let's call that handleAddItems

and this function will receive a new item object

which it will then add to the items array.

So, let's actually immediately call the function here.

So here, we will call handleAddItems

and then, with the new item that we just create.

So, for example, with an item,

that looks just like this.

So, that's what we pass in here.

And now again, it's time to use setItems

to update or items array.

And this new items array

will basically be the current items array,

plus, the new item added to the end.

And so what this means

is that the new state depends on the current state,

and therefore, here we now need to pass in

a callback function.

So, not just a single value.

So, let's call the current state here

in this call back items.

Now then, here, let's see what we need to do.

So, remember that in React,

we are not allowed to mutate state.

So, we cannot do this.

So, we can not simply push the new item

into the items array

because with that, we would be mutating.

So, we would be changing this item's array right here.

And again, that's really not allowed in React.

So, React is all about immutability.

And so, the solution here

is to create a brand new array

which contains all the current items, plus, the new one.

So, let's return a new array

and then, in there, we simply spread the current items

and then we add another item

which is simply called item.

So, the item that we are receiving here.

Now, if this looks strange to you

then please go back

to the review of essential JavaScript section

where I have a couple of videos

on how to work with array in a immutable way.

So basically, how to add new items,

how to update

and how to delete items from an array

without mutating the original.

So, in React,

that's something that we need to do all the time.

And so, again, if you're not sure how that works

then please go back to that section

because from now on,

I will simply assume that you know how to do this.

Now, okay?

So, this is already done.

So, we now have a way of adding new items to the state.

So, let's immediately test that here.

So, let's use now 10 test items.

And so we are still logging them to the console

but now, I want to draw your attention

here again to the dev tools,

and in particular, of course, to the form component

that we are working with now.

And so down here, we already have our state

which already has this new item that we just created.

Nice.

So, let's do another one for, like, boarding passes.

And you see, immediately, it got also added

to our items array.

So, our updating logic here is working just fine.

But of course, this state is now nowhere being displayed

in the UI yet.

Right?

So, we are not using this items variable

anywhere in our JSX yet.

And the reason for that

is that actually, we do not need these items

in this current component.

The only goal of the form component

is to add new items to this array,

but not to render it.

Instead, remember that who renders these items

is actually the packing list component.

So, that's this one here, right?

But with this, we now created ourselves a problem.

So, let's take a closer look here at the component tree.

So, right now, our item state

is here inside the form component, right?

And so, this is where we update the state.

However, we need the state itself.

So, we need this item state variable

here in the packing list

because again, this is where it should actually be rendered

onto the UI.

And so now, how do we get this state from the form

to the packing list?

Well, we cannot pass it as a prop

because the form is not a parent component of packing list,

it is simply a sibling component.

But data can only flow down the tree.

It cannot flow up the tree or sideways.

So therefore, we cannot simply pass these items

to the packing list via props.

Instead, we now need to use a technique

that I mentioned before,

which is to lift up state.

So, what we're going to do now

is to take this state here,

so this line of code,

and we will move it to the closest common parent component.

So, which one is that?

Well, it's simply the app component, right?

So, this component is both, a parent of the form

and of the packing list

which are the two components which need this state.

So, again, let's grab this

and let's move to our app

and at the state right there.

And then, of course, we get these errors here

because setItems is no longer defined in the form.

So, let's fix that in a minute.

But I want to start by now passing the items

here into the packing list.

So, we define a new prop called items

into which we pass the items array.

All right?

Then let's come to the packing list

and accept that prop there.

So remember,

we can immediately destructure the props object here.

And then, instead of the initial items,

we will now finally render the actual items.

And with this,

we have now used the items state in our JSX.

Right?

And now let's take care here

of this handleAddItems function.

So actually, I will grab this entire function

and move it here.

And so now, all we have to do

in order to enable the form to update the state

is to pass in this handleAddItems function.

So, let's do that.

Let's create a new prop

and kind of a convention is to call this now onAddItems,

handleAddItems.

So, we could of course call it

the exact same prop name here.

So, we could create a prop called handleAddItems

and then pass it to function with the same name,

but it's kind of a convention for it to be like this.

So, it then becomes a bit more readable,

like onAddItems, call handleAddItems,

if that makes sense.

And then here, let's accept that.

onAddItems.

And finally, here we now need to call, of course,

the function with this prop.

So, with this prop name.

onAddItems.

And with this, we fixed all the errors that we had

but probably what we just did here is quite a bit confusing.

So, let me first now add a new item here

just to see if it works

and then I will explain what's actually happening

a bit better.

So, let's see.

And there it is.

So, we created a new item here.

It was then added into the item state

which now lives in the app.

Let's check that.

Yep, that's right.

Here it is.

And so then, that state got passed down here

into the packing list

which received it as a props

and we can see that right here also in the dev tools.

So, here we now have the items as a prop

and then, of course, that gets rendered to the UI.

Let's try another one.

And immediately, it got added here to the,

well, to this state right here

which was then passed down into the packing list.

And now about updating the state,

this is what happened.

So, we now have our handleAddItems function

right here in the app,

which is exactly where the piece of state also lives.

So, where we have the home of the items state.

And so all the logic about updating that state

is here in the same component.

However, it is the form that is actually responsible

for creating new items.

And so, therefore, we need to give this component,

so this form component here,

access to a function that can update the state.

And so, that function is handleAddItems.

So, as I mentioned before,

we can actually pass anything as a prop.

And so, that includes functions.

So, here we pass in handleAddItems as a prop

and we call that prop onAddItems,

which of course, again,

could also be called handleAddItems

which some people prefer,

but many times, you will see this convention.

So then, we come here, destructure the props

and then we call that function

whenever the form is submitted.

And that's it.

So, this is how we lift up state.

So, basically what that means

is that whenever multiple sibling components

need access to the same state,

we move that piece of state up

to the first common parent component,

which again, in our case here, was the up component.

All right?

And we will actually review this one more time

in the next lecture.

But for now, let's move back to our flow chart

and quickly complete it.

So basically, we will just review what we just did

and then see how we would have arrived at that solution

here with the flow chart.

So, the new state that we created,

was it only used in the initial component?

So, only used in a form?

No, it was not.

So, then we move here

and we ask ourselves,

is the state also needed by a child component?

And again, the answer is no.

Because instead, it was needed by a sibling component.

And so therefore,

that is how we lifted state up

to the first common parent.

All right?

So, make sure to take another look

at the code that we just wrote

and then, in the next video,

we will take an even closer look

at this concept of lifting up state.

# Reviewing "Lifting Up State"

So we just created

an important piece of state

and lifted it up to a parent component

that is common to both components

that need to use or to update that state, right?

However, this whole idea

might still be a bit confusing

because in fact, it can seem quite counterintuitive.

And so let's now look at another example

and some diagrams to really understand

how lifting up state works

and why it's so important.

And as an example,

let's use the checkout part

of the Udemy interface

that we have seen in a previous lecture.

And let's say that we started

by building this promotions component

where the user can input coupon codes

that will then be added

to a list of applied coupons.

So that sounds like we need

a piece of state called coupons right here, right?

So that coupon state is now local

to the promotions component

along with a set coupons function

coming from use state.

Now next we set out to build the total component

but here we quickly realize

that the total component

also needs access to the coupon state.

Otherwise, without knowing which coupons have been applied,

how would the total component know

what discounts to apply

and what price to display?

And so here we encounter a problem.

How do we give the total component access

to the coupon state?

Because in React, we have one-way data flow.

So data can only flow down

from parents to children

but not sideways to sibling components.

Therefore, we cannot simply pass

the coupons data as props

to the total component.

That's just not possible.

And so we need a way

of sharing state with other components

that are further up

or sideways in the component tree.

But luckily for us,

we already did exactly that

in the last lecture

with the item state by lifting it up.

And so we already know that lifting up state

is the technique that will solve this problem.

But what does that mean

and how exactly does it work?

Well, lifting state up simply means

to place some state in a component

that is a parent of both components

that need the piece of state in question.

So in this example,

we would remove the coupon state from promotions

and place it in the checkout component.

And just like this,

we have lifted state up

to the closest common parent

of both total and promotions.

And now giving both these components access

to the state is as easy

as passing it down using props and that's it.

So by lifting state up,

we have just successfully shared

one piece of state with multiple components

in different positions in the component tree,

which is something that we need to do

all the time in React apps.

And so it's really important

that you get used to this pattern and remember,

that we need this pattern in the first place

as a direct consequence of React one-way data flow.

But anyway, all this now seems to be working

just fine at this point.

But now what happens

when we want to add a new coupon

to the coupon state?

Or in other words,

what happens when the user inputs

a new coupon and clicks on the apply button?

Well, we want to update the coupon state, right?

But how do we do that now?

Because after lifting this state up,

it now lives in the parent component

so not in the promotions component anymore.

Promotions only receive this data via props

but as you know, we cannot mutate props.

So that's one of the hard rules of React.

So what we're asking here is

if we have one-way data flow,

so if data can only flow from parents to children,

then how can the child component promotions update

the state that lives in the parent component, checkout?

Well, actually the solution is quite simple.

All we have to do

is to also pass the set coupons function

down as a prop to the components

who need to update the state.

And so now that we have

the set coupons function in promotions,

once a new coupon is added,

we can simply use set coupons to update the state

that lives in the parent component.

And this is actually exactly

what we also did in the previous lecture

with the difference that

we didn't directly pass set items,

but a function that uses set items

to update the items,

which is essentially the same thing.

But anyway, we can call this technique

of passing down a setter function,

child-to-parent communication

or also inverse data flow.

Inverse because usually data only flows down

but here we basically have a trick

that allows us to basically

have the data flowing up as well.

Now of course, this is not truly flowing up

but this workaround of passing down the setter function

and use it to update the parent state

is pretty close to actually

having data flowing up the tree.

Now, when I first learned

about this technique years ago,

it actually took me quite some time

to wrap my head around this whole idea

because this can actually be quite confusing.

And so that's why I created an extra lecture

with all these diagrams for you

hoping that you will have an easier time

understanding child-to-parent communication.

But that's enough talk.

Let's now go back to our code

and use this in practice a few more times.

# Deleting an Item: More Child-to-Parent Communication!

So we just learned what

Child-To-Parent Communication means.

And so let's now do some more of it

in order to delete items from our list.

So the idea here is that whenever we click

on one of these crosses here next to an item,

it will then delete the item from the state

and therefore from the user interface.

Now since this click here will happen

inside the item component...

So remember each of them is actually an item component.

And so the click to delete,

so on each of these crosses,

will happen inside of the item.

But the state actually lives in the app.

So in the parent component.

And therefore this is another case

of Child-To-Parent Communication.

So let's now go back here to our app

which is where our state lives.

And then all we're going to do is to create

a new function right here called handleDeleteItem.

Now, in order to delete an item, we need to know

which item it actually is that should be deleted.

So in order to do that...

So to tell this function which item it is,

we will pass in the ID whenever we later call dysfunction.

So remember that each of these items here has an ID,

and so we can then use that ID to remove

the corresponding object from the items array.

Now about the delete operation itself,

we will of course delete the item from the user

interface by updating state.

So we call setItems.

And now here in setItems, we need the new array

after the item has been deleted.

Now once again this new items array

will be based on the current one.

And so we need a callback function which receives

the current item as its input.

And so now let's say items.filter

which will loop over the array and in each iteration

it will get access to the items object.

And so now, basically, all we want to do is to filter out

the item that has the ID that we got here, right?

So item.id is different from the ID.

So the ID that we pass in.

So whenever this condition here is true,

the item will end up in the new array.

So of the array of the items that have not been deleted.

But when this is false, so when item.id is equal the ID,

then that element will no longer be part of the final array.

And so that's how we remove,

so how we delete elements from arrays.

And once again, if this is strange, please go back

to the section where I review essential JavaScript concepts.

So there I teach in detail about how this works.

And now all we have to do is to call dysfunction

whenever the click here happens.

So how do we get that there?

Well, we now need to pass the function

as a prop also into the packing list.

So into the packing list

because the items are called inside the packing list.

So onDeleteItem,

and so I'm using the same naming convention

as before where I call the prop on the lead item

and then pass in the function, handleDeleteItem.

And so now let's receive this prop here

inside the packing list.

So we already have items.

So let's add this one here to the list.

And again, this is so helpful because

now we know immediately what props

the packing list will receive.

And then remember that the click

actually happens here on this button.

So inside the item component.

And so here we also will need access to this prop.

Therefore we now need to pass it in

along the item right here.

So onDeleteItem = onDeleteItem.

And so we're basically passing now this prop

through the packing list into the item.

So it moves here from app to packing list

and then to each of these items.

So packing list itself doesn't really need it,

but of course, this is the only place

where we can receive it.

Because we cannot pass it directly from app to item, right?

So that would not be possible.

Okay. And now here

we use the onClick prop

and then we specify or handler function.

Now if we do just this, onDeleteItem,

then this is not going to work.

So let's see why.

So let's test this here.

And so you see that nothing happens.

So we can see that here also in app

when we try to log the ID.

And so now you will see that, well nothing happens.

Because what we get in here instead of an ID, is this event.

So what's going on here?

Well, when we simply specify the function here like this,

then React will call the function as the event happens,

and it does so by passing in the event object.

So we actually used this to our advantage in the form,

so right here where we then received the event.

But right now we do not want to receive the event,

but instead the ID of the current item.

And so we need to create a new function here,

and then we pass in the current ID.

So item.id.

And once more, it's really important

that you don't forget this.

Because otherwise React

will just immediately call the function

which is not what we want.

We want a function here really, so that React

can then call this function only when the event happens.

And this is actually it.

So this should do the job.

Let's see.

And beautiful.

So that's gone.

You see here also the ID that we locked to the console.

And so it was based on that ID that the new

items array was set.

So the state was updated,

which forced React to rerender the component,

or in other words, to rerender the component's view,

so to be a bit more specific.

So let's try that again.

And yeah, then we cleaned everything.

Now, let's also since we're already here,

get rid of these initial items

because now we are getting this ESLint warning

that this is never used.

So again, really helpful here from ESLint.

And yeah, just by the way,

we could of course also have used

these initial items here as our initial state.

And so then whenever we would reload,

well, not this.

So whenever we would reload here,

then we would get these three as a default.

So they would then get added into our state

and then everything would work the same.

So we could also delete them here and as we reloaded,

then they would be back.

But that's not what we want.

So let's just get rid of all this.

Beautiful.

And now all we have to do here for the final operation

is to implement this functionality.

So where we click here,

and then it will mark the item as packed.

So that's going to be our topic for the next lecture.

# Updating an Item: Complex Immutable Data Operation

Next up, let's take care of updating items

by toggling their packed status.

So basically that's the functionality

that I showed you by the end of the previous lecture.

So this is what we want to implement in our app now.

And so to start we actually need

to create those check boxes there.

So right now we don't even have that checkbox.

And so let's go here to our item.

And before the span, let's now add an input of the type...

And here we want a string.

So of the type checkbox.

So that's something.

So we can actually already

toggle this one here on and off now,

but of course it's not going to do anything.

So basically we want to also transform

this element right here into a controlled element.

And remember, a controlled element means

that the element has the value defined by some state

and it also has an event handler

which listens for the change

and updates the state accordingly.

So let's do those two things.

And first, the value will be given

by the item.checked status.

And so this checked here is always a true or false value.

And so that is exactly the type of value

that we need to pass into the value of a checkbox.

And actually here it should be packed and not checked

which maybe you had already noticed.

But anyway, now let's keep going here.

And so now next up we need to add on change handler.

So we need to listen for the change event,

which basically happens

each time that we click here on the checkbox.

Now here for now,

let's actually specify just an empty function.

So a function that doesn't do anything.

And here we're missing this.

All right.

And so the reason for that is that of course

this function here

that we are eventually going to specify here

is going to change the packed value of the item state.

And so that function will once again be placed

where the state actually lives, so inside of app.

And then we will pass it down using a prop

just like we did with on delete item.

So this is something similar.

So instead of deleting an item,

we will simply now update one item.

And so again, that update happens

each time that we click here on the checkbox.

So let's now write that function here.

So function, and again, starting with the handle keyword,

and then toggle item.

And that's because here

we will only toggle the packed property.

So not allow anyone to update the entire object

but only really to change the value of that packed property.

So in order to know which object we actually need to change

we need to again pass in the ID.

And so then let's again set the items.

And then we need to pass in a new array

which, just like before, will depend on the current array.

So we have our callback function here.

And so now in order

to update one of the objects in the array,

we will simply loop over the entire items array

using the map property

which will then in the end return a brand new array

with the same length of the initial items array.

But one of the objects

will then, of course, have been updated.

So in the iteration, each of the elements is called an item.

And then here is what we're gonna do.

So whenever the item has the ID

that is equal to the ID that we passed in,

so which means that this is the object

that we want to actually update,

then we create a brand new object based on the current item,

and then we set packed to the opposite of packed,

so of item.packed.

And that's it.

And if else, so for all the other objects,

we will simply return the current item.

And just once again,

I want to emphasize that I covered exactly

that this is how we update an object in an array

in great depth, in the section where we review

essential JavaScript for React.

So please go there in case that this looks strange.

But for everyone else, let's just keep going here.

And now also add this function here into the packing list

so that the packing list can then add it into the item.

So we use, once again, the props

basically as a communication channel here.

So on toggle items, handle toggle item.

So on toggle item right here.

And now let's just copy this,

add it here to the list of props, exactly like this.

And then we pass it into the item itself.

Let's do that here.

All right.

And finally we receive it here.

So again, we need to use the packing list here

as an intermediary step in order to reach the item itself.

And so now here we can then replace this empty function

with calling on toggle item

with, just like before, the current ID,

so that we actually know

which is the object that we need to change.

All right and that's actually it,

or at least it should be.

So let's see if that works.

So one socks, let's say one shirt and one charger.

And now as we click here, yeah, beautiful.

So it updates our checkbox

and you see that it also updates here these strikethrough.

So that's coming exactly here from when the item is packed.

And the same of course, works for all the other ones

because if we click on this one

then the item.ID will be another one

and so therefore then this function here

receives another value

which will then update another object.

And the deleting here of course, also works.

And so, we are done with building

these two operations that we can perform on items.

So toggling their packed status and deleting them.

Now before moving on,

please just make sure to review the code that we wrote here.

So just to make sure that you understand, basically,

everything that's happening here,

why we are doing it this way,

and the way we then pass in these functions as props

all the way down

until the components that actually need them.

So this is, again, child-to-parent communication

which is something that we're going to use all the time.

And so make sure that you really understand this concept

as well as lifting up state

until you move on to the next lecture

which is going to be about derived state.

# Derived State

Another aspect that I mentioned

in the state management lecture

was derived state.

Sounds complicated but it's actually pretty straightforward.

So, essentially, derived state is simply state

that is computed from another existing piece of state

or also from props.

But let's look at some actual code.

So, here we have three pieces of state

as we can see by the three use state function calls.

However, if we analyze these states,

it actually doesn't make much sense that all of them exist

because numItems and totalPrice depend entirely on the cart.

So numItems is simply the number of items in the cart

and totalPrice is the sum of all the prices in the cart.

And so, all the data for these two pieces of state

is actually already in the cart,

so there's no need

to create these additional state variables,

and doing so is actually quite problematic,

first, because now we have to keep all these states in sync.

So, we need to be careful to always update them together.

So, in this situation, whenever we update the cart,

we will also need to manually update the number of items

and the total price,

otherwise our states would get out of sync.

But updating these three states separately

creates a second problem

because that will then re-render the component three times

which is absolutely unnecessary in this example.

Instead, we can simply derive the numItems

and totalPrice state from the cart

and therefore solve all these problems

because the cart already contains

all the data that we need.

So here, we simply calculate numItems as the cart length

and totalPrice as the sum of all prices

and store them in regular variables.

There is no used date required here

which will cause no unnecessary re-renders.

The cart state acts as a single source of truth

for these related pieces of state,

making sure that everything will always stay in sync.

And this works because updating the cart

will re-render the component

which means that the function is called again.

And, so then, as all the code is executed, again,

numItems and totalPrice will also, automatically,

get recalculated.

Now, of course, most of the time, we cannot derive state

but whenever you have a situation like this one,

where one state can easily be computed from another,

always prefer derived state.

So, don't create two state variables

if you actually only need one.

That's a very common beginner mistake,

but now, you will be able to avoid it.

# Calculating Statistics as Derived State

Of course, let's now use the idea

of derived state in practice.

And in particular

we now want to calculate our statistics here.

So calculating the number of items on the list,

how many we already have packed

and then the percentage of that.

Now, if we think about these numbers,

for example, the number of items in the list,

that number can be directly computed

from the items array itself, right?

And so derived state is perfect for this,

but before we use derived state

I will show you how not to do this.

So the way we should not do it is to use state.

So let's say we created a piece of state called numItems

and then setNumItems.

And by the way,

you don't need to write this code right here, all right.

So this is just to show you how not to do it.

So initially we start with 0 items.

Now the problem with this is, as I said before,

is that we now have to also update this piece of state.

So whenever, for example,

one new item is added, besides setting the items,

we also need to make sure to increase this number here.

So setNumItems and then the number and then num plus 1.

So with this, we would ensure that these two pieces of state

stay in sync, but that's of course a lot of additional work

that we might forget to do

and also it can cause multiple re-renders

where at least one of them here is unnecessary.

Now in React 18, these should be batched.

So these two should happen at the same time,

but more about that later.

But in any case, this is a terrible idea.

So instead we can just define a new variable

called also numItems, but we can simply derive it

so we can calculate it based on the items array.

So that simply items.length

and so this works because as soon as the items are updated,

so as soon as this piece of state is updated,

the component will re-render.

And when the component re-renders

that means that the function here is called again.

And therefore then this piece of code here will run again.

And so if a new item has been added then now the item state.

So this array is different

and therefore the length will also be different.

Now this numItems variable,

we actually don't need it right here in the app component,

but in the stats component.

So this one right here.

So we have two options now.

The first one is to keep numItems here

and pass it as a prop into stats,

but I think what makes more sense

is to actually calculate this state here.

So this derived state inside the stats itself.

Also because we will actually calculate three values

and so if we were to calculate them here

then we would have to pass three props

which doesn't make a lot of sense.

So let's just cut that from here

and paste it here into the items.

Well, actually no, that's not correct.

Want to paste it right here.

But now as soon as I save this, we will get an error, right.

And so the reason for that is

that now of course we don't know,

so this stats component doesn't know anything

about what this items is.

So we now have another component that needs the item state.

So we just pass it down as a prop.

Just like we passed it also into the packing list.

Now of course, we need to accept that prop down here

and so this solves the problem.

And so here we can now already use that value.

So you have numItems on your list

and so yeah, indeed, right now that's zero,

but if I add some socks here and maybe a shirt

then you see as soon as we add new items here,

the array grows

and so then this number here also gets updated.

So watch what happens when I hit enter

and immediately this changed from 2 to 3.

Let's just quickly remove those console.logs there.

So that's much better

and so now let's derive our other pieces of state.

So of course this one here,

so the ones that are already packed

and the percentage both depend on the items themselves.

So number of packed is simply the items array filtered

by the items that are already packed.

So item.packed.

So that's a new array

and so then we can take the length of that one.

So you have already packed number of packed

and so that immediately becomes 0,

but then when we mark one of them as packed.

Ah, beautiful.

So two, and then all of them.

Great.

And now finally just the percentage

which should be pretty easy.

So that's just a number of packed

divided by the number of items times 100

and then let's grab all of that and round it.

So Math.round

and so here then we can replace that.

Nice, that also works.

And now it hits 100%.

And in that case, so whenever we have 100%

I would like to display an entirely different message here.

So telling them basically that they are done.

So watch what happens here in the demo.

Yeah, that's it.

So let's write that here

and so for that, we need some more conditional rendering.

So actually we will just conditionally define what is here

inside this em element.

So let's enter our JavaScript mode

and say that whenever the percentage is equal to 100

then the content should be this string right here,

"You got everything! Ready to go."

Now let's add a plane emoji here as well

and now else

and so let's move that here.

And so now instead of this text that we had here,

we now need a string.

And so let's make a template literal here

and then we need to add of course, these.

And in case we didn't want to create this template literal,

we could of course also have simply rendered one em

for each of these cases.

Now, this looks not correct,

maybe it's because of this right here.

Yeah, but it looks at as though it works

even though we are in the wrong app.

Ah, but here we already have our correct message.

Let's uncheck one of those

and now you have three items on your list.

Great.

Now let's remove this one and this one as well.

And so now we have already packed zero

and also in this case

I want to display something else as well.

So also another message.

So if this is the case,

if there are not even any items in the array,

then it's not even necessary actually

to perform all these calculations

because they will just be zero anyway.

So what I want to do now here is to show you a good use case

of an early return as conditional rendering.

So what we're going to do is to say

if there is no items.length,

then simply return.

So that's return a paragraph with the class of footer

and then here also an em

and then start adding some items to your packing list

and again, some nice emoji here, like this rocket.

And so now let's reload this here

so that we then have no items.

And so yeah, here we go.

Now here the class name is not footer, but stats.

So basically the same as here.

And so yeah, then we got this.

So this text that we defined right here, so this paragraph,

and again that's because in this case

it doesn't even make sense to then do these calculations.

So if there are no elements anyway in the array

then don't even bother with all of this here.

Now in this case, of course

it would've been no problem to still do these calculations

as they are not a lot of work

and we could then have some conditional rendering in here.

But this was just to show you

that the option of an early return is sometimes also nice.

So it's also quite legible here if you ask me.

So when you arrive at this component

maybe you have never seen it before

because one of your coworkers wrote it,

then you can right away see that if there are no items,

well then just return this

and in all other cases then perform the rest of the logic

of the component.

Great. So hopefully that made sense

and so next up, let's see another use case of derived state

which will be to implement this sorting functionality here.

So that will make this application look even more real life

and so I think this is going to be really fun.

# Sorting Items

Let's add a new feature to our application

which is to allow users to sort the items

by three different criteria.

So basically we will build this select box criteria

and then from there the user can choose which

of these criteria they want to sort the list by.

So something that's very common in most web applications.

And so let's now build a very simple version of that.

So we will do this here

right in the packing list component,

because if we were to create a new component just for this,

then we would add a little bit

of extra work with lifting some more state up.

And I want to keep it simple here

and not to confuse you even further.

And so yeah, it's no problem to just do it right here

in the packing list right after this div right here.

Or actually let's do it right here

after this unordered list.

So let's create a div with the class name

that I already created called actions,

because here we will have that select element

and later also a button to clear the entire list.

So inside the select element, as always

we need the option element,

which should have different values.

And so then later based on these values here

we will calculate the ordered list.

So the first one is based on input.

And so these are just some strings that we are making

up here.

So input is basically by the input order.

Then well let's write that here first.

So sort by the input order.

So by the order in which these items were actually placed

into the list.

Next up we want to sort by description.

So sort by description.

So basically alphabetically.

And then finally, let's also do, which is very nice

by the packed status.

So sort by packed status.

Nice.

So there it is.

Looks great.

And so now let's see how we can actually implement this.

So first of all, of course we need to know

inside the component, so inside our React application,

what the currently selected element here is.

And so for that we will once again transform this here

into a controlled element.

So for that we need our three steps.

So first of all, we create a new piece of state.

Let's call this one sortBy and setSortBy, useState.

And now our default will be the very first one here.

So we want that by default, they are sorted by input.

And so this input here is exactly this string

that we defined here

but it could also be description or packed.

And so now let's use that state here as the value.

So sortBy.

And up here, I used packed instead

then we should already see that reflected in the UI.

So you see that here we now have, by default,

sort by packed status

because now I used this string.

Now React is complaining and that's

because we are missing the third part

which is to now attach the unchanged event tender

so that we can then set the date based

on whatever the user selected there.

So onChange

and this function here will automatically receive the event

and then we can setSortBy

by using event dot target dot value.

So at some point you will get really used

to writing this kind

of thing here and it will become second nature.

So this is like a recipe that we always need to follow

and it always works in the exact same way really.

So let's see.

And yeah, that works nice.

And if we check out our component here, then we,

first of all need more space,

and then you see down here, we now have the sorts by status

inside or state inside our component.

Great.

And so now we can work with this.

So how do we now get React?

So how do we get our application to display the items here

sorted by whatever criteria we selected?

Well, basically we will just create a new items

which is then sorted by that criteria.

So we are not going to manipulate the original items array.

That state should stay unchanged.

Instead, we will now use again, derived state

because sorting one array can of course be computed based

on that initial array.

That makes total sense, right?

So once again, we will not create a new state variable here

because that's totally unnecessary.

We will simply create a new variable, and here,

actually a let variable.

So sorted items and we're using a let

so that now we can simply do a couple

of simple if statements.

So if sortBy is equal to input, then this is the default,

right?

And so then in this case,

we can simply say that sorted items should be just equal

to the original items.

So this is wrong here of course.

So again, in this case,

the sorted items are just equal to the items themselves.

So the ones that we receive as a prop here.

And so now of course in the end,

we need to use these sorted items and that's right here.

So from now on,

instead of rendering the original items array

we will always render the sorted items.

All right.

And let's just put some here, socks, a charger.

So these are quite easy to write.

Yeah, right now only this one here works.

So if I do this now,

then we get an error because sorted items is then just

this empty variable that React doesn't know how to render.

So well now I will have to write everything again here.

So socks, a shirt, and a charger.

All right, and now let's write one if

for the other two cases.

So if or sort by change is, that's a description,

then we will want to sort our items actually.

So sortedItems will then become items.

And now first we use slice.

Because with this we basically take a copy

of the array and that's very important

because the sort method is a mutating method.

And so if we didn't do this

then the items would actually get sorted as well.

So we don't want that.

So we use slice dot sort.

And now here I will just write the code because again,

I already explained exactly how this method works

in the review of JavaScript section.

Now in this case, since we want to sort alphabetically,

we can use the localCompare method.

So we want to take a, which is basically one object

of the array, and then we want to take the description

of that, which is one of the properties of each object.

And then since this is a string, we can call localCompare.

And then here we simply pass in another string

which is b dot description.

All right.

So this is going to work, hopefully at least.

And then finally, let's also add the code for our last case

which is by packed.

And so something very similar here

sortedItems is going to be equal to items

Taking a copy dot sort .

And then a and b which are basically two objects

of the array which are being compared.

And then since we want to order by the packed status

which is a bullion,

we need to first convert that to a number.

So a dot packed minus number b dot packed,

and that's it.

So let's try this out.

So by description, you see that now it's alphabetically

so C, S, S,

and then finally by the packed status.

So right now all of them are unpacked.

So let's click, and you see that then it moves to the end.

And the same thing right here.

Then if I remove it, it will move back here.

Great.

And of course we also have our default

which is the input order,

which is also the same that happens whenever we are

in the packed status and we have none of them packed in.

Great.

So that's just amazing.

We just implemented this simple feature

but also a very common feature simply

by using the power of derived state.

So again, we didn't create any new piece

of state for the sorted items.

The only state that we need is the sortBy state.

So that React actually has at all times the value

of this input field right here.

And then based on that, we simply create this derived state

of sorted items, which then

in the end is what we render onto the user interface.

And with this, the only thing that we have left

to do is to add this button here to clear the list.

And so that's the task of the next video.

# Clearing the List

Let's now make our application feature complete

by adding a button to clear up the entire list at once.

And so, to do that, let's come down here,

and after the select,

we're going to add a simple button.

So, not like that,

but button, "Clear list."

So there it is.

And now, as always,

we need to add the onClick event handler,

and then we need a function

that basically deletes all of these elements here at once.

Now, I think that this might be a nice challenge for you,

so creating that function that deletes everything,

and then passing that function down to this component

and adding it here onto the button.

So that shouldn't be all too hard.

And so, please go ahead and pause the video right now.

So try this on your own really,

as this is a really nice learning experience.

And then I see you back here in a minute, or five,

once you are finished with that task.

Okay.

So, I will create a function

close to all the other functions.

So we have handleAddItems, Delete, and Toggle.

And so, we simply add just another one.

So handleClearList,

which doesn't need anything really.

And then, all we need to do here

is to simply say,

"Set items back to the original value,"

which was of course this empty array.

And that's it.

So that's almost too simple.

But now we just need to connect this function to the button.

So, that button is in the packing list.

So that's where we pass this into a prop.

So onClearList

will be handleClearList.

And so now let's get that.

So this packing list really receives a lot of props.

And,

so then here,

the onClick prop.

And here we don't even need to create a new function.

All we have to do is to pass this one in.

So onClearList.

Give it a save, and that should be it.

So clear list and yes, everything is gone.

Great.

So, I'm hoping that you did this as well.

And now just one more thing here,

is that here in this demo app,

is that here we prevent the user

from accidentally deleting everything.

So here, when they click on clear list,

first we get if we want to delete all the items,

and only then if we click on okay,

everything will get deleted.

So you see, now it is empty.

So let's quickly do the same thing here.

And that's pretty easy

because that's just a standard dumb function.

So that's a function that's not really part of JavaScript,

but it's part of the web API.

But anyway, here we can create some variable.

Let's say confirmed.

And then that confirmed will be defined

by window.confirm.

So here we can then pass in any string.

So that's going to be the the message

that the user will see.

So "Are you sure you want to delete all items?"

And then when the user clicks on "Okay"

confirmed will become true,

and in the case they click "Cancel,"

then it will be false.

And so now we can do this conditionally.

So we just say if confirmed

then set items to the empty array.

Just to make sure, let's reload

and shorts and a charger,

and now when I clear the list,

then, yes, we got to confirm and it works beautifully.

Now maybe you got a little bit annoyed

at all the scrolling that we had to do here now lately

because our components were getting bigger and bigger.

So whenever we wanted like to pass in something here

then we had to scroll all the way down here

to then accept, for example, these props right here.

And so that's why I said

in the very beginning

that in real world applications

we usually have one component per file.

And so in the next lecture I will show you a trick

of how we can basically divide this one file

into multiple files.

So one file per component.

# Moving Components Into Separate Files

So let's now split up our App.js file

into multiple component files.

And this will just be a very simple exercise

of taking each of these components

and placing them into their own file.

So you can even do that on your own if you want.

But anyway, let's just grab this code here,

cut it,

and then create a new file inside source.

So inside the source folder, create Logo.js

which is the name of this component, right?

All right, but now of course,

we also have to export this function from here.

And remember that in JavaScript,

we can export in two ways.

So we can have named exports,

which would simply be this.

So with this, we would create an export called logo

which we would then have to import

with exactly that name

into the other file,

so into the file where we need it.

But usually, in React apps,

what we do is to use a default export.

So export default, just like this.

And then of course, now if we try to reload this,

we will get an error that, well, not this one.

Yeah, right here.

So we see that the logo is not defined.

And so of course,

that's because now we have to import it right here.

So import.

And here, actually we can use any name that we want.

So because we used a default export.

But of course, we will still call it logo here.

So import logo from,

and then simply the path to that file.

And yes.

And again, we could indeed change the name here to X,

for example, and then here as well,

give it a save

and you see that it still works.

But again, this is of course not advisable.

This is just to show you how named

and how default exports work.

All right, now let's take the next one.

And by the way, the first one here

will of course, stay in this file

because it is called app.

And this file is also already called App.js.

So let's grab the next one here.

Okay, cut it,

new file, Form.js,

paste it here,

and then again, export default.

Coming back here,

then we need to import form from

just like this.

Now here we will still get an error

because we haven't imported useState

in that other component.

So let's quickly grab this line of code here,

move into the form

which is where we are using useState,

and then we also need to import that hook.

So this useState function here into this file.

Of course because this file here does use that function.

So it's not enough

to just include it one time anywhere in the code.

You really have to include the parts of React

that you need in each single component file.

So let's close this one and this one.

And now that we have done it two times manually,

it's actually time to do it automatically.

So let's again select all of this.

We can even click this triangle here

to collapse the function.

And so then we can select all of it

and then right click here,

and then click on refactor.

And so now here, this gives us the option

to move this function into a new file.

So let's click that.

And you see that a brand new file

with the name of packing list was created.

So VS Code automatically took this function here

and then created a new file

with this exact same name.

And it also automatically imported

all the parts that we need inside this function.

So we have useState and we also have item.

Well, this actually doesn't make a lot of sense

at this point

because the item is still here.

So that's actually not ideal,

but we will fix that in a moment.

So what matters here for now

is that VS Code automatically created this new file,

placed this new component here

and also exported it.

Now it's actually using a named export.

So you can see here

that it's importing it in this other way.

So this is how you do a named import.

But again, we usually in React development,

do default exports.

But of course, the other way is also perfectly fine.

I will just change it here.

Export default.

And then here, I need to change the way I import it.

So getting rid of these curly braces.

And now let's also create a new component

for this item here.

So let's just remove this export.

Select everything, refactor,

and move to a new file.

So again, item was created

and here we need to actually write export default,

give it a save,

and now we need to change that

in the packing list

because now this component is no longer in app,

but inside,

well, inside of Item.js.

And it's again, a default export.

So we need to import it,

basically as a default import.

All right, so this small thing here happened

because we first exported the packing list

which depended on the item.

But yeah, in any case,

usually we do this immediately.

So usually when we build some app,

we do immediately create a new file

for when we need a new component.

So let's do that one final time.

So stats, let's change it again to export default

just to stay consistent,

and then fix it here as well.

And with this,

we now have one component per file

which makes our component here

a little bit easier to manage.

So then there's not so much scrolling up and down,

but instead,

well, we can develop basically each component

in isolation in its separate file.

Now taking it one step further,

we can also move each of the components

into a new components folder.

So components,

and then let's select all of them actually.

So everything except for index.js

which is not a component

and our CSS file.

Grab them here.

And now we only have one problem

which is the app file cannot be found here in index.js.

So here we need to now fix this path

to components/App.

And with this, we are finished.

So all the other files still work the same,

or actually this one here.

So here the imports still work

because all the components are still

in the same folder as App.js.

And with this,

we actually finished this project.

So once again, congratulations

for finishing your first, a bit more real React project.

So a project that actually does something.

So I think this was a really great practice project,

quite straightforward,

but it had all the most important fundamentals

that you needed to know at this stage.

Now, of course,

this is not a real world application,

but in large scale apps,

you actually have many smaller parts

in which you will need exactly these skills.

And so everything

that you are learning here is really, really important.

It will lay the foundation

so that later you can build those large

and real world applications.

Now next up in this section,

we have a nice exercise

where together we're going to build an accordion component.

And then I just want to show you

one other very important part of React.

So that's gonna be the children prop.

And so yeah, stay tuned for that.

# EXERCISE #1: Accordion Component (v1)

It's now time for another exercise

so that together we can practice state management

and Thinking in React in general a little bit more.

So together we will build this very simple

accordion component where we can open and close

each of these items of the accordion here.

So when it's closed and we click, it opens.

And when it's open and we click, it basically closes again.

And each of these items has the title

or actually the number here,

the title and then the text itself.

So this is here a question, and this is an answer basically.

And so we have some starter files again

which I have linked in this lecture.

And the starter files are this array

of frequently asked questions

and then also this CSS styles right here.

So as always, you have two options.

You can do it in your own VS code.

So then just go here and copy all the relevant starter data.

Or of course you can fork

now this code sandbox.

So basically in order to create your own one.

And so now I have created a new one out of the other one

and so I can safely change this one.

So let's go back here to see what we have to build.

And basically the entire thing here

is the accordion component

and then each of them is one accordion item.

And so let's start

by actually building these items themselves.

And remember that each one gets a number,

a title, and some text.

So the accordion component

has actually already been created.

And so now next, let's create the accordion item.

Okay.

So remember that each item gets a number.

It gets a title and the text.

And so let's immediately write that here

basically as the props that we will receive.

And so then we can immediately build with these.

So just like before, we will start

by building a static version of the app.

So in this case of these two components.

And then later we add state

to the mix in order to actually make the component dynamic.

So here we will return a div element

and this div has the class name

that's coming from the CSS that I provided of item.

Then we can immediately close that.

And so then we have one paragraph for the number.

So that's class name number.

And then here let's actually immediately use

again this prop that we will receive

as soon as we start including this component here anywhere

but we can already use that prop as if it already existed.

So class name, then let's say text.

And again here the same thing

that's immediately used, the prop.

And then finally this one here for the icon.

And by icon I mean this minus and plus right here.

So see how it toggles between plus and minus.

And for now, let's start with a minus there

but we will change that later.

And finally, we then have a div

which will contain the content itself.

So basically the text.

So here the class name is content box

and then this again is where the actual text goes.

And I see that here I have a mistake

because this is actually for the title

so I'm not sure why I called that text.

So the class.

But yeah, nevermind.

Okay.

And now here in this accordion all we need to do

is to loop over this array of objects like we always do.

And then for each of the objects

we want to render one of these items.

And actually to make this a bit more reusable

let's accept some generic data here basically.

And so then here we pass that data in

and as the data we use DFAQs.

And so then we could reuse the same accordion

with different arrays.

Okay, this one here should have the class name of accordion.

And then here is where the mapping will happen.

So that's data.map.

And then for each of these elements

and we could also call them frequently asked question

but let's just go for the generic element.

And so as we said before

we want to render one accordion item for each of them.

And what do we want to pass in there?

Well, the title will be at element.title

so that's this one here.

And then also the text coming from that same object,

so element.text.

And now we also want the number.

So this one here should automatically be

number one, two and three.

So we can do that very easily

by using the index that is also passed in the map.

And that's very easy to do because the callback here

in the map actually also gets past the current index.

So besides the current element

it also gets the current index.

So as a second argument, so let's call that I.

And so then we can pass in as numb simply I.

And that's it.

All right, so we have something here.

Let's just make this a bit smaller.

Well, not all of it.

Let's maybe close down the side bar.

Yeah, that's a lot better.

We can make it a bit smaller even.

And so let's compare.

So here we actually have like 01

and then also the textile looks a bit different.

So let's see.

But yeah, the class names all look correct

but now let's just quickly take care of the numbers here.

So here we want to have 01, 02, and 03.

So let's do some magic here.

Let's say if the number is less than nine

then here please place a zero

and the number plus one.

But if not, so right here, then it's just number plus one.

Okay, that looks much better.

And then here, let's just change this one to title.

So that should work.

And yeah, and with this let's go back to the original

because now we need to start thinking about state.

So remember how we can open and close

each of these boxes here individually,

which basically means that each of these boxes

holds their own state.

So whenever we click here, you see that the UI changes.

So that's the most fundamental thing

that we need to think about whenever the UI changes.

So whenever there is some update here happening in the UI

it means that we need a piece of state.

Now, each of these items here operates

completely independently from the other ones.

So if I open this one here

nothing happens to the other two.

So I can open all of them at the same time

or I can have all of them close, meaning that

again, each of them really operates in an independent way

which means that each of them must hold their own state.

So again, that's because this one can be open

but this one as well.

And so what that means is that we should now define

a state variable in each of these items.

So that's right here.

And so then we use our friend, we use state.

So let's call our state variable is open, and set is open.

So we use state which was then automatically imported.

So this one right here, make sure you have that.

And then by default it will be fault.

So by default, we want each box to be closed.

So we declared our state variable, and now let's use it.

So that's the same three step process as always.

We define it, we use it, and then we update it.

So basically what we want to do when is open is false.

So when this is closed is to not display

this content box down here.

Or in other words

we want some conditional rendering of this part.

So let's place it into the JavaScript mode

and then let's say is open

and then conditional rendering like this.

Now, in this case here also this should be a plus

not a minus.

And so let's also come here

and say is open

then show the minus,

and if not then please show the plus.

Close the JavaScript mode.

And so with this, we have the pluses showing.

All right, now all we need to happen is that

of course when we click here, the box should actually open.

So you see that with the CSS style

I applied this hint cursor here to the entire div,

so to the entire element.

And so this is where we then want to listen

for the click event.

So right here on this div.

So let's say on click,

and then here we will pass in a function

called handle toggle.

And so let's go define that function.

So just like before, we just define an outside function

with the keywords of handle here, which is totally optional

but it makes it easy to understand

that this is a function that will be used

as an event handler.

And so now here let's use set is open

and then we take the current one.

So we can just call it current if we want.

Of course we can also call it is open.

Yeah, anything works.

And then we just want to do the opposite.

Alright, so that didn't work yet.

Maybe let's just reload here, that is sometimes necessary.

And yes, that works.

And if I close again, it closes, beautiful.

Now here we have some errors

and that's just because of the key prop.

So here we need to pass in a unique key prop

and we could now actually use I, which is unique actually.

So it's this 01 and two coming from the array iteration.

But it's better to not rely on that

and instead use something that's truly unique.

So that's for example, the title of each element.

Close this one here, and indeed it works on all of them.

There's just one small detail missing

which is that when this is open,

we get this green border here

and all the text becomes green.

So that's just one special class that gets added

to the item whenever it is open.

So on the item that's right here.

So again we want to add a second class here

in case that it is open.

And so for that we need some more conditional

rendering basically, in this case of classes.

So here we now need to construct a template string

or a template literal, which already has the item string

and then here based on a condition,

so based on it's open

we either want to add open or nothing.

And that's it.

And that works.

Well this kind of didn't become green for some reason.

Let's check out our CSS here maybe.

Maybe there's something that I didn't do right.

Yeah, so here it should be title.

Yes, beautiful.

And with this, we actually finished this accordion

at least for now.

So later in this section there is the second part

of this exercise where we will make it a bit more realistic

where only one of these three

can be opened at the same time.

app.js

```js
import { useState } from "react";
import "./styles.css";

const faqs = [
  {
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus.",
  },
  {
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus.",
  },
  {
    title: "Do you ship to countries outside the EU?",
    text: "Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!",
  },
];

export default function App() {
  return (
    <div>
      <Accordion data={faqs} />
    </div>
  );
}

function Accordion({ data }) {
  return (
    <div className="accordion">
      {data.map((el, i) => (
        <AccordionItem title={el.title} text={el.text} num={i} key={el.title} />
      ))}
    </div>
  );
}

function AccordionItem({ num, title, text }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <div className={`item ${isOpen ? "open" : ""}`} onClick={handleToggle}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>

      {isOpen && <div className="content-box">{text}</div>}
    </div>
  );
}
```

index.js

```js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

styles.css

```css
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  color: #343a40;
  line-height: 1;
}

.accordion {
  width: 700px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.item {
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
  padding-right: 48px;
  cursor: pointer;
  border-top: 4px solid #fff;
  border-bottom: 4px solid #fff;

  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: 24px;
  row-gap: 32px;
  align-items: center;
}

.number {
  font-size: 24px;
  font-weight: 500;
  color: #ced4da;
}

.title,
.icon {
  font-size: 24px;
  font-weight: 500;
}

.content-box {
  grid-column: 2 / -1;
  padding-bottom: 16px;
  line-height: 1.6;
}

.content-box ul {
  color: #868e96;
  margin-left: 16px;
  margin-top: 16px;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* OPEN STATE */
.open {
  border-top: 4px solid #087f5b;
}

.open .number,
.open .title {
  color: #087f5b;
}
```

# The "children" Prop: Making a Reusable Button

So, moving on now, it's time to learn about

yet another fundamental concept that we use

all the time in React development.

And that is, "The Children Prop."

So we have finished this project right here,

and so we can basically finish this with control C.

And so now if we reload, you immediately see

that the connection has been lost, or you could also

simply have closed this VS Code window right here.

Okay? And now what I want to do in this lecture

and the next one as I introduce you to the children prop,

is to use the steps component that we built before.

So let's go back to the steps folder

and open it up in VS Code.

And again, you can do that in any way that you wish.

Now, I will now actually duplicate this file.

So this App.js in which we are working, I will copy

and then paste so that we can keep the first version

of the code that we wrote.

So calling this one, app version one.

And so now we can continue the work here in this file.

All right, so let's here come to the terminal

and then write, NPM start,

so that our project opens up again here in the browser.

All right, yeah, remember how we had actually

included the steps component here twice.

So let's remove or comment out one of them.

And so yeah, it's gone.

And as always, it's important to keep the console open

and maybe also the components tree.

But for now, let's stay on the console.

Okay, so the idea of this lecture

is to create a reusable button that we can use

instead of these two ones here.

And I want to add an emoji to these buttons here as well.

So let's take a look at where they are.

Yeah, so these two buttons here,

again, I now want to create a reusable button

that we use instead of these two.

So let's do that.

And we start by using the knowledge that we already have.

So let's say, function button.

And then all this will do

is to return a button element.

Which would also have this style here

and an onClick event handler.

So let's just copy these two here.

And also let's place some text here for now.

And so now the idea is

that we can pass in the background color,

the color, this onClick handler here, and the text as props.

So basically we want to accept some props here

for the text color.

So let's actually call that, text color.

So text color, background color,

the onClick handler, and also the text.

And so then here, let's use that button actually.

So before we keep working on the button

let's include it here immediately.

Let's right away delete this one.

Until we use our component

that we are building right now.

So let's say text color

should be this one here.

Or actually that's the background color, of course.

So BG color.

Then the text color,

this one should be FFF for white.

And then also the onClick prop.

And here we want to specify the handle previous function.

All right, then we close.

And also the text.

So here, this one said, previous.

And so now let's come to our button down here

and let's use these values here instead

of the hard-coded values.

So here, background color should be

the BG prop that we received.

And this one should be the text color

that we receive as a prop.

Then here we want onClick.

And here instead of just this generic text, we want,

again the text that we receive as a prop.

So let's give it a save, maybe reload even.

And, you see, as we use this button

it still works and looks exactly the same as before.

So let's then do the same thing with this one here.

So that's just copy and pasting this one

and then changing the onClick handler to, handle next.

And here, next.

Let's delete this button.

And so now with this

we have exactly the same functionality as we had before,

but we extracted these buttons that we had here

into a reusable button component

which right now accepts the text color, the background,

the onClick handler, and the text.

So passing all this data here as props

into this component should be pretty clear at this point.

So hopefully you understood exactly how that works

in previous lectures.

But anyway, let's now say that we also want to add an emoji.

So that's easy enough.

We just accept that here as a prop.

So, emoji.

And then let's add that here before the text.

And let's actually create a span element for this emoji.

So we create a span,

and then in there we put our emoji and then the text.

Okay, and then let's actually pass that emoji in.

And then let's here, maybe search for finger,

because I want this one here, for previous,

and then one finger pointing in the opposite direction

for next.

So that's this one.

Okay, give it a save and yeah, that worked nice.

So we have our emojis and our text,

and it works exactly as we specified our button down here.

But now let's say that I wanted this emoji here to be

on this left side, but the other emoji on the right side,

so that it would say next

and then pointing right to the right side.

So with this we kind of have a problem

because we already have so many props.

And so do you think that we should add yet another prop

basically for this direction?

Well, maybe not.

Maybe it's getting a little bit too crazy here

with all these props.

And we could keep adding more and more

to customize this button even more.

But I think at this point we should not add, for example,

this one here, like for the direction,

or for the side of the emoji,

and instead make use of the children prop that I mentioned

at the beginning of the video.

So instead of passing in this side here, this emoji,

and the text, which are basically the content

here of this button element,

what if we could simply pass the content

right into the button as well?

Or in other words, what if we could pass simply some JSX

into the component and then the component could use that JSX

and simply display it?

Well, we can actually do that in React.

So let's come up here, and notice how up until this point

all our components have always been self-closing.

So we never had, like this,

and then any content, and then closed the element.

So we never had this before, but in fact,

we can do exactly this.

So just like we do with HTML elements

where we have an opening tag,

then some content, and then a closing tag,

we can do exactly the same with React components.

So here, of course, I don't want that gibberish,

let's just put it back for now.

But basically what we want is to now here

write that span with the emoji.

So this one, and then, previous.

So this is exactly what we want

as the content of this button.

And if we were writing the button as a simple HTML button

this is what we would write.

So that's actually exactly what we did right down here

inside this button.

And so again,

we can do exactly the same thing with our React components.

So then we no longer need this, and this,

and let's then do the same thing here.

And so now comes that part

where we can very easily change the direction

or the side of the emoji, because we can simply write, next.

And then we put our emoji in the JSX on the right side.

So easy, right?

Well, I forgot to close our button here.

Okay. And now of course you don't see

any content here anymore,

because we no longer are passing in the text and the emoji.

And so now it's time to fix this.

So basically now it is time to give the button element

access to whatever content we wrote

into the opening tag and the closing tag.

And so that's where, finally,

the children prop comes into play.

So, the children prop is a prop that each React component

automatically receives.

And the value of the children prop is exactly

what is between the opening

and the closing tag of the component.

So let's remove all of this,

and then we simply need to write, children.

And so this really is a predefined keyword inside React.

And so as a final step, we can remove all of this

and simply use the children here.

Give it a save.

And there we go.

Beautiful.

So we have exactly what we set out to build.

We have the emoji here on the left side,

and here on the right side.

And of course we could do anything here.

So we could have even more emojis, even more elements.

And yeah, we could do really whatever we wanted.

Because, this content here of this element

would simply be passed as the children prop into the button.

And then here we use that children prop

and display all that content right here

inside this HTML button.

And with this, we just gained a brand new

and really, really important tool

that is used all the time in React.

It's actually one of its most useful features, I would say.

And the reason for that

is that it allows us to make our components truly reusable.

So with this children prop, I am now able to pass

whatever content I want into this button element.

And the button component doesn't even need to know

what content this is going to be.

All it does is to take the children,

so all the content and all the JSX that we just passed in,

and will simply then render it inside this button component.

And so because of that, we can think of the children prop

as a hole that can be filled by us passing in the content

into that component.

And if for some reason this seems strange, and don't worry,

we will use this children prop all the time,

all the way until the end of the course.

And now just to finish,

let's quickly recap what we just did here.

So, by using the children prop in the button component,

we basically left an empty hole

right in the component that we could then fill

with any JSX markup that the component receives as children.

But then the question is, how do we pass in these children?

Well, when we include the button component in some JSX,

instead of immediately closing the element,

we can write some more JSX into that element.

So just like we can write any HTML markup

inside other HTML elements, right?

So just like an HTML,

we can write anything that we want between the opening

and the closing tag of the component that we are using.

So, in this example, this piece of JSX creates the elements

that are then the children of the button component,

and they will then be accessible inside that button

as props.children.

So that's why we say it is the children prop.

So, basically, by defining child elements like this,

we are passing them into the button

just like we can pass in any other prop.

The difference is in the way

in which we specify other props.

So, the more regular props, and this one.

So by passing in content

between the opening and the closing tag of an element

we basically fill the hole that we left

in the component by using props.children

in the JSX of that button, so of that button component.

So, if we think about this,

the children prop is really an ideal way

of making reusable and configurable components.

Especially when it comes to the content of the component.

So for example, let's say that we wanted to create

a second, similar button,

but with some other emojis and text.

Well, now that we know about the children prop,

that is really easy.

All we have to do is to pass in some different JSX

and then the button gets completely different content.

And this technique is really, really useful

for building generic components that do not know

about their content before actually being used.

Like, for example, a model window, a generic slider,

or simply a generic button like the one that we just built.

So, again, this button component had absolutely no idea

about the content that it was receiving,

and therefore about the content that it was displaying.

And so this is really amazing

to create generic and reusable components.

So using the children prop like this

is really an extremely powerful technique

that you will need to master as you learn React.

But we will use this over and over again.

And so there will be plenty of time to practice,

and actually starting right in the next video.

# More Reusability With the "children" Prop

Let's now build another reusable component

by leveraging the children prop once again.

And this time, let's say that we wanted

a component to display a message.

And so that message will always be this paragraph element.

It will also always contain this step here.

For example: in an H three element,

and then it will contain in an H three element.

So like this and then it will contain

something that we pass in.

So, some content such as this message right here.

So, let's once again, use the children prop

in order to create such a component.

So this component, I'm going to call "The Step Message."

So, step message.

And then I will for now, just copy this.

So, copy all of this.

And so as I said we want basically

always to display the current step,

and then here whatever content that we get.

So we need to receive two props here.

First is this step.

And then again, the children prop.

Which each component, remember,

automatically receives as soon

as we pass in some content between the opening

and the closing tag when we call.

So, when we use the component.

So, now we got the step, and then right after that step

let's simply display whatever children that we receive.

So, this part here is then that empty hole

that we talked about in the last lecture.

And this empty hole can then of course be filled

with whatever we pass in.

And again, whatever we pass in

between the opening and the closing tag of step message.

So, here in the button

that hole was basically all the content of the button.

So, the button here only displays

exactly what was passed in.

But here we will also, in addition,

always display this part.

So, the H three with the step itself.

Okay, and now let's...

Where is that?

Ah, yeah.

So, let's now replace this message right here

with a step message.

Now the step, of course,

we have to pass in just like any other prop.

Not span, step.

Okay.

And now here between the opening and closing tag

we basically define the children prop.

So this here will then become the children prop.

And if you get rid of all this,

then let's see what happens.

Well, nothing really happened.

Ah, of course.

I mean, we didn't really return anything here.

So we just wrote some JSX, but we didn't return it.

We also get some warning here

that the H three cannot be inside of a P.

So, let's then replace this P just with a div.

Give it a save.

And there it is.

Beautiful. So it always displays the current step.

And of course the message that we had before.

Because we passed that in right here,

into that is exactly what we had before as well.

And now of course, we could reuse this anywhere we wanted.

So let's say that here after the steps,

we wanted somewhere else in the app

also to have a step message.

Let's say step number one.

And then here, maybe the content is pass in content.

Let's do another paragraph with some emoji here.

Does not matter at all what we have here.

And so then here we have step one like this,

and we can do as many as we want.

So let's copy paste that.

Let's say for example, step two,

read children prop,

and then maybe some other emoji.

Give it a save.

And so now we have again created a reusable component here

that we can use anywhere in our application,

and give it any content that we want.

And it will always, as you see,

display this step here with the number that we gave it,

and then whatever content that we passed into it.

So into the component itself.

Let's come back here.

And here, I just thought that

maybe we could use our button again.

So, why not?

And then it makes even more sense to have these

different props because now we can

basically customize them in a different way.

So, let's say here we wanted a different background color

and a different text color.

These should be strings like this.

Ah, and we're missing the on click event handler.

And so here, let's just define an inline function.

And the emphasis is again, on defining a function.

So here we need to pass in a function, not call a function.

Let's just alert something here.

It doesn't really matter.

So let's say, "Learn How To,"

and then we can just use this here.

Just so that it's related to each of the steps.

So we opened the button, then we have the closing tag,

and now we can pass whatever we want in here.

And of course, this thing that we pass

can also just be regular text.

So give it a save.

And there is our button.

It still works.

So, we are successfully passing in the on click handler.

And then using it.

The styling looks a little bit off,

but I guess that's because I styled those one here.

Well, let's see, actually.

Just to make sure there's nothing wrong.

Now, in fact, these buttons get these styles

because they are a children of some element

with the buttons class.

Now right? But that doesn't really matter.

We could, of course, wrap this

in a div with the class of buttons that might work,

or maybe that will then mess up some other styling.

Well, that didn't really work.

But also because it's buttons. Yeah, nice.

That looks better actually.

And so with this, we can see that we were

really able to customize, once again, our button here.

Some parts with normal props like these three,

and then the content itself here with the children prop.

So, if we always just want to pass in a string

this could, of course, also be a normal prop.

But since sometimes we want some other content

like here with some actual JSX, like this span element here.

Well, then we should really take advantage

of the children prop.

And now to really drive this message home

so that you really understand how to work

with this important children prop.

Let's go back to our accordion component exercise

and use it there as well.

# EXERCISE #2: Accordion Component (v2)

Let's now take everything that we learned

throughout this section in order to make the accordion

that we started building earlier a bit better

and a bit more real world.

And here it is.

So just like before, when I click on one of the items,

then it'll open, but when I click on another one,

then only this one stays open

and all the other ones are closed.

So basically, what this means is that now each of the items

no longer controls whether they are open or not.

Instead, it is now the accordion

who knows which of the items are opened,

and then only that item, basically, is allowed to be open.

So for example, if item number three is the one

that's currently opened, then number one, two, and 23

need to be closed.

So again, all of these items here need to know

which is the currently open item, and so that means

that we now need to move our state from the item

onto here, the accordion.

Now, I still have the code here from part one

of the exercise, and to let me know, fork this,

so I can basically leave the other part unchanged.

But you can totally also work on top of version one,

so then you only have that one.

So let's now remove this piece of state, because again,

now each item no longer controls whether it is open or not.

And then we get a bunch of errors,

but that's not a problem.

For now, at least.

So here, let's now create that piece of state

I was talking about, which will be current open.

And so here we will store the number of the item

that is currently open.

Set is open use state, and we will start with null,

so then none of them will be open in the beginning.

So again, this curOpen state variable will basically

hold the number, so this number right here,

of the item dead is currently open.

And so then we pass that curOpen into the accordion item,

and then from there, it can calculate

whether it is currently open or not.

So let's do that.

Let's pass curOpen in.

So we use a prop called curOpen to pass that in,

and then we also need to pass this setter function in

so that then, down here in the item, we can set

the current item to the one that has been clicked.

And here, let's use the convention we used before,

which is to start with the on prefix.

So let's say onOpen, setIsOpen.

And now here, let's then receive those props.

So, curOpen and onOpen.

Here, let's for now just comment this out

to get rid of this error right there.

And then here, as I was saying, we can basically calculate

whether this item is currently opened or not.

So we can say, again, isOpen,

so bringing back the variable name from before,

and then if the number, so if the number of this item

is equal to the currently open one.

So in that case, isOpen will be true,

and then it will be, well, displayed as open.

So let's change this here from null to one.

And so, that works.

So remember that this one add one,

and so this is zero, one, and two.

So if I said two, then that one is open,

and then with zero, the first one is open.

Great! So, we created a state variable,

we used it in the UI, this time by passing it

into the item, and then using it to compute

whether the item is currently the open one or if it's not.

All right, let's set this back to no,

because of course, now we want to update the state

by clicking on each of these.

So that's right here, so let's get rid of all that,

and then let's use our onOpen function.

And here it's very simple.

All we want to do is to pass in the number.

So for example, if we are here in item number one,

then when we click, onOpen will run with number one.

And remember that onOpen is basically set isOpen,

which should be called set current open.

All right, so we run it with number one,

and so then the state curOpen becomes one,

and then what happens down here again

is that one is equal to one, and so then that item

will become open and all the other ones will stay closed.

For example, this one here, item zero.

Well, item zero is different than one,

so isOpen is false.

And that works beautifully.

Great! And I know this can be pretty confusing,

because we're passing states up and down,

but this is basically just the idea of lifting up state.

So before we had the state right here in each item,

but then suddenly, all of them need to know

about the current state, and so therefore we can say

that we lifted state up to the closest parent.

All right, so after this exercise is done,

please take some time to analyze the data flow here

in great detail.

I'm just moving a bit faster here because we already learned

about all of this and this is just an exercise.

Okay? Now, next up, what I want to do is to use

our knowledge about the children prop.

So instead of passing the text in here, like this,

it's actually a lot nicer to define the text

basically as content.

So let's pass that text in here, so el.text,

and let's close this.

And indeed, now the text is temporarily gone.

So we no longer need this prop here,

but we need the children prop, which I'd like to add

either to the end or to the beginning of this list.

And then here, that's no longer text, but children.

Yeah, that works great.

And with this, we are a lot more flexible

when it comes to the kind of content

that should be displayed in each of the items.

So let's add one manually here.

So that's where that 23 comes from in the demo

that I showed you earlier.

So outside this loop, let's now create just one,

one test one here, test one,

and this would actually be a string, I guess.

The number, let's say 22.

Here, let's again repeat the title.

And as for the content, let's just come here and copy this.

You can write it by hand if you want,

or you can just write, really, whatever you want.

So just wrapping this here in a P, this one in a UL.

At each of these here, simply one LI.

So just, I mean, this is not really necessary.

This is just to show you.

Okay. And so, if we click here now, you see that we are able

to pass in this entire JSX as the content.

And so that's, again, thanks to the children prop.

So here, of course, we only have text, but yeah,

here we have this entire piece of HTML, basically.

And of course, our entire functionality here

of the accordion still works just like before,

so we can only have one of them open at the same time.

Now, there's just one small thing missing,

which is that when we click here, on an open one,

it doesn't close, right?

So probably you can see that for yourself,

and so what we need to do now is to basically

set the state to null whenever it is opened already.

So when we click here and it is already open,

then the new state, so the new current open,

should become null, and only otherwise

it should be the number.

And so that will fix it, indeed.

Great! So, that exercise is finished as well,

and I hope you found it useful.

And now, as I said before,

please take some time to analyze the code

and the data flow right here in this component.

And then, once you're done, you are ready

for the mandatory coding challenge in this section.

app.js

```js
import { useState } from "react";
import "./styles.css";

const faqs = [
  {
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus.",
  },
  {
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus.",
  },
  {
    title: "Do you ship to countries outside the EU?",
    text: "Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!",
  },
];

export default function App() {
  return (
    <div>
      <Accordion data={faqs} />
    </div>
  );
}

function Accordion({ data }) {
  const [curOpen, setCurOpen] = useState(null);

  return (
    <div className="accordion">
      {data.map((el, i) => (
        <AccordionItem
          curOpen={curOpen}
          onOpen={setCurOpen}
          title={el.title}
          num={i}
          key={el.title}
        >
          {el.text}
        </AccordionItem>
      ))}

      <AccordionItem
        curOpen={curOpen}
        onOpen={setCurOpen}
        title="Test 1"
        num={22}
        key="test 1"
      >
        <p>Allows React developers to:</p>
        <ul>
          <li>Break up UI into components</li>
          <li>Make components reusuable</li>
          <li>Place state efficiently</li>
        </ul>
      </AccordionItem>
    </div>
  );
}

function AccordionItem({ num, title, curOpen, onOpen, children }) {
  const isOpen = num === curOpen;

  function handleToggle() {
    onOpen(isOpen ? null : num);
  }

  return (
    <div className={`item ${isOpen ? "open" : ""}`} onClick={handleToggle}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>

      {isOpen && <div className="content-box">{children}</div>}
    </div>
  );
}
```

index.js

```js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

styles.css

```css
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  color: #343a40;
  line-height: 1;
}

.accordion {
  width: 700px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.item {
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
  padding-right: 48px;
  cursor: pointer;
  border-top: 4px solid #fff;
  border-bottom: 4px solid #fff;

  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: 24px;
  row-gap: 32px;
  align-items: center;
}

.number {
  font-size: 24px;
  font-weight: 500;
  color: #ced4da;
}

.title,
.icon {
  font-size: 24px;
  font-weight: 500;
}

.content-box {
  grid-column: 2 / -1;
  padding-bottom: 16px;
  line-height: 1.6;
}

.content-box ul {
  color: #868e96;
  margin-left: 16px;
  margin-top: 16px;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* OPEN STATE */
.open {
  border-top: 4px solid #087f5b;
}

.open .number,
.open .title {
  color: #087f5b;
}
```

# CHALLENGE #1: Tip Calculator

Let's once again finish a section

with a nice coding challenge,

so that we can practice everything that we learned

in the section.

And I can't stress enough

how important these challenges are.

So please, please don't skip this video right now.

So we are going to build this very simple tip calculator.

So here you can input how much the bill was.

So let's say $100.

And then you can say how satisfied or dissatisfied

you were with the service and your friend.

So let's say that two people were out for dinner,

and then basically together you decide

how much the tip should be.

So for example, if you say it was good, that can be 10%,

but your friend says 0%.

And so then the average between the two of you is 5%

which is indeed these $5 here.

And so the final bill is $105,

which is 100 plus the $5 tip.

And of course if your friend found it absolutely amazing,

then here the average between the two of you is 15

and therefore it is a $15 tip.

And as you change the value here,

of course, it keeps updating down here.

You also have this Reset button that you can click

which will set everything back to the initial values.

Now as you build this, I want you to create

one separate component for each of these pieces.

So this one here should be one component.

For example, it can be called the bill input.

Then you should have one component for this,

for example called select percentage

and then reuse that component here again.

So with some different text

but it should be the same component.

Then here you have some output component

for displaying this text

and then a reset component just for this button.

Okay?

Now these three inputs here,

they are of course controlled elements.

And so you can start by adding their state value

into the component itself.

But you will soon notice that you actually need

this state in the parent component

because you will need it to calculate

this output right here.

So then you'll have to use the technique

of lifting state up.

And so hopefully you remember all the logic

of how that works and why we have to do that.

And in case there is still some doubt,

you can always go back and check out the lectures

where we talked about lifting up state.

and of course all the other things

that you need here in this challenge.

So, I'm aware that this challenge is not super easy

but that's what many students actually want.

So last time I asked the large majority

wanted really hard challenges.

So this is not really hard I think

but it can be a bit challenging.

So it's not just 100% straightforward.

Therefore if you run into any issues,

that's no problem at all.

So just write the part that you can

and then the rest, watch my solution.

That's 100% fine.

The most important part is that you start writing

at least some code and that you try it on your own.

And that's enough talk.

I see you here in 5 or 10 or whatever time that you need.

All right, so we have a lot of code to write

so let's get straight into it.

So I will start with a function called TipCalculator

which we will then call basically right here.

So we need no styles for this app at all.

So that's why I didn't provide any CSS starter files.

Okay, let's close down the sidebar here

and then let's start by writing out all our components.

So the next one is called BillInput.

Then let's create SelectPercentage.

And of course your component names here

can be completely different.

Then we have function Output.

And finally for Reset.

All right, now let's build them out one by one.

And we can actually start here in the TipCalculator

because all that's going to happen here

is that I will basically include all the other ones.

So let's just create a div here.

Then I will want the BillInput.

I will want two SelectPercentages.

And of course, we will later on then

pass the props into here.

I'm just, again, building the static parts

without any data at all.

So then we will have the Output

and we will have our Reset button.

Okay, let's start with this one.

Okay.

Then I will place this one into a label.

How much was the bill?

And then finally we have our first input

of the type text.

And let's add a placeholder as well,

which is always nice.

And so yeah, here we got already some,

well, something on the UI,

was just thinking of getting rid this class.

And so then we get rid

of basically all the styling altogether.

Can just come here to this CSS if we want.

And just like this.

Just to make the font family a bit nicer on the eyes.

But anyway, here, let's again return a div

and then we have a select element.

And as you already know, then inside the select

we have our different options.

So zero is for Dissatisfied,

which is 0%.

Then let's just copy this or a few times.

5, 10, and 20.

It was okay, is 5%,

then it was good is 10%,

and then 20% is for absolutely amazing.

Now, we also want some text here

and so we could pass that here in as a prop,

but I believe it's a lot nicer

to write it right here directly.

So how did you like the service?

Then close that.

And so basically including the content

between the opening and the closing tag.

How did your friend,

friend like the service?

All right.

And now I hope you remember how we get this text here.

So this content into select percentage.

And that's right, it gets automatically passed

in here as the children prop.

So let's create a paragraph or maybe a label

with exactly that.

There you go.

That looks a lot better.

So let's move on here.

Return, and here we will have an h3,

You pay X,

which is some dollars.

Let's say $A, plus,

$B for the tip.

So just some placeholders here for now

because we are building, still, the static version.

Now, finally here, a button that says Reset.

Now, okay, so that took us some time

just to build the static part

and now let's add some state.

And the best way to start is to create one piece of state

for each of these three controlled elements

that we need here.

Now as I started by saying in the very beginning,

you could have started by creating local state

right here in the component.

So basically like we learned before.

However, you would then quickly discover

that you need this input value here.

For example, right here in the TipCalculator component

because it's here where you will later calculate

this tip value right here, so that you can then display it,

so you can pass it into Output and then render it there.

Therefore, I will actually, basically,

immediately lift that state up and not even write it

in the BillInput.

So bill and setBill are equal to useState

and for some reason, sometimes, this doesn't really work

with the importing.

So then let's do it manually, useState from react.

Nice.

And actually here let's start with an empty string.

Okay.

And then we need to pass both of them in

because of course we will want to update that state

each time that the change event is fired here on the input.

Remember that?

So that's just how controlled elements work.

It's always the same recipe, always the same thing,

no matter if the state lives

right in this component or in another parent component.

But the idea is the same as you will see again in a minute.

So let's pass in a prop called Bill with the value of bill.

And then let's again use our on prefix.

So onSetBill will be setBill.

But of course it will be just as valid

to pass in prop with exactly this name.

So here we receive bill and onSetBill

and let's then use these values here.

So the value of this input field should be bill.

And when it changes,

then we want to basically set the bill

based on e.target.value

and we need to convert that whole thing to a number.

Now, okay.

Now unfortunately the dev tools don't work

as we experienced a few times already,

but in order to see it,

we can actually pass it in here into the output.

So bill is bill,

because remember how we actually display

that bill value right here.

So that's exactly this 80 right there.

So let's then receive it here.

So that's this first value right here.

So let's see.

That, yeah, that works beautifully.

So just like any normal controlled component

or controlled element

with the difference that the state

doesn't live in the component itself,

but in the parent component.

And now let's use the exact same logic

for these select percentage components.

So let's create two pieces of state, one for each of them.

So that's going to be percentage1

and setPercentange1

and the default here is zero.

And then let's just copy-paste.

And so this one here will take the value of percentage1.

So the percentage prop that this one will receive

will be equal to the percentage1 state,

while this other one, so this one also gets

a percentage prop of course,

but here the value will be given by this other state.

And so with this, we can use the same component

to set these two different state values.

Okay, and now, also the onSelect handler.

And this one will be setPercentage1,

while again here onSelect will be

setPercentage2.

All right.

Then down here we can receive them besides the children.

So the percentage and onSelect.

And so now all we have to do is value

is equal to the percentage that we receive,

and then onChange

and then onSelect.

So we can immediately convert to a number,

e.target.value.

It's always the same recipe.

So now we will not be able to immediately see a tier

but it seems to be working,

both of them.

Alright, and so now we have all our state that we need.

And so based on this, we now can already calculate the tip.

So how do we do that?

Should we create a new piece of state for the tip here?

Well, there is actually no need

and it makes no sense to do so

because the tip can be completely calculated

from the bill and the percentages.

And so we are in the presence of derived state.

So the tip is simply the bill

times the average of the two percentages.

So that's percentage1 plus percentage2,

divided by two,

and then the whole thing divided by 100.

Because here the percentages are these actual values.

So between 0 and 100

but then we need to calculate them between zero and one

because, well, that's how we calculate percentages.

And here, I don't really agree with this parenthesis here.

Let's place that right here.

So this we calculate the average percentage

and convert it to number between zero and one.

And then simply by multiplying it with the bill,

we get the amount of the tip.

And so now we are ready to also pass that here

into the output.

I mean here we receive it to pass it.

It's actually here.

So tip equal tip.

And so, can already display that here.

And then here it's as simple as adding the two together.

So let's say 100.

And one was dissatisfied,

the other one was amazing.

And so the average is 10%, which is exactly those $10.

Yep, then it becomes 20,

which together makes 120,

just make the dollar sign there.

And so yeah, this seems to be working just fine.

All we have to do now is to make this Reset button work.

But that is fortunately very simple.

So function handleReset.

And here all we need to do is really to set

all of the values

back to those initial states.

So setPercentage1 back to zero.

And here the same thing.

And then we just pass it right here.

So onReset should become handleReset like this.

And then of course the onClick event handler, onReset.

And let's see, and beautiful.

So everything back to normal.

And now what we should do is to not display

the button and this output

whenever there is actually no tip.

So then it makes no sense to display that, right?

So these two things right here.

So let's wrap them into the JavaScript mode

and then let's say bill greater than zero &&.

Now here we get a problem because we have one piece of JSX

which has basically two top-level elements

which is not allowed.

So there can only be one parent element.

And so once again, our fragment here is a very nice option.

We don't need these, give it a save.

And yeah, now they're gone.

And as soon as we start riding here, we have a tip value,

then we can see the output there in the button.

Great, and that's actually it.

So I believe the hard part here

was to have all the state living in the TipCalculator,

but then having these two components here,

needing that state and also updating that state.

So there's a lot of state passing around,

here with all of these props.

Yeah, and then also here, the tip itself.

So realizing that this indeed needs to be derived state.

'Cause otherwise you would have to calculate this tip

all over the place in order to keep it in sync

with the bill and these both percentages.

So that would be a lot of work.

And instead by having it as derived state

each time that the component rerenders

as the state is updated, this value will be calculated again

and can then also be rendered here onto the UI.

Great, but that's enough talk,

the video is running long enough already.

And so yeah, I just hope that you did

at least part of this coding challenge.

And any questions that you have, just post them in the Q&A,

along with your solution if you'd like.

So it's always nice to see different approaches

resulting in the same working application.

And with this, we then actually reach the end

of the section, but also of part one, basically.

All we have to do, if you want,

is now a complete practice project that is coming up next.

So it's a really cool project once again

and so I highly encourage you to not skip it

and meet me there as soon as possible.

app.js

```js
import "./styles.css";
import { useState } from "react";

export default function App() {
  return (
    <div>
      <TipCalculator />
    </div>
  );
}

function TipCalculator() {
  const [bill, setBill] = useState("");
  const [percentage1, setPercentage1] = useState(0);
  const [percentage2, setPercentage2] = useState(0);

  const tip = bill * ((percentage1 + percentage2) / 2 / 100);

  function handleReset() {
    setBill("");
    setPercentage1(0);
    setPercentage2(0);
  }

  return (
    <div>
      <BillInput bill={bill} onSetBill={setBill} />
      <SelectPercentage percentage={percentage1} onSelect={setPercentage1}>
        サービスはいかがでしたか？
      </SelectPercentage>
      <SelectPercentage percentage={percentage2} onSelect={setPercentage2}>
        ご友人のサービスの評価はいかがでしたか？
      </SelectPercentage>

      {bill > 0 && (
        <>
          <Output bill={bill} tip={tip} />
          <Reset onReset={handleReset} />
        </>
      )}
    </div>
  );
}

function BillInput({ bill, onSetBill }) {
  return (
    <div>
      <label>お会計はいくらでしたか?</label>
      <input
        type="text"
        placeholder="Bill value"
        value={bill}
        onChange={(e) => onSetBill(Number(e.target.value))}
      />
    </div>
  );
}

function SelectPercentage({ children, percentage, onSelect }) {
  return (
    <div>
      <label>{children}</label>
      <select
        value={percentage}
        onChange={(e) => onSelect(Number(e.target.value))}
      >
        <option value="0">不満 (0%)</option>
        <option value="5">普通 (5%)</option>
        <option value="10">良かった (10%)</option>
        <option value="20">とても良かった (20%)</option>
      </select>
    </div>
  );
}

function Output({ bill, tip }) {
  return (
    <h3>
      You pay ${bill + tip} (${bill} + ${tip} tip)
    </h3>
  );
}

function Reset({ onReset }) {
  return <button onClick={onReset}>Reset</button>;
}
```

index.js

```js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

styles.css

```css
body {
  font-family: sans-serif;
}
```
