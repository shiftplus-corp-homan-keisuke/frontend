memo from 104 to 121

# Introduction to Part 2

Now, instead of moving on to Part 2 right away,

it's essential that you go explore

the fundamentals that you just learned on your own.

So you really need to build a few small projects yourself

and try out a few different things.

So this self-learning is a crucial part of your journey

and now is the perfect time to do so,

but then once you feel quite comfortable with the basics

a lot of new and interesting topics await you here

in this Part 2.

So over the next few sections

you'll learn how React actually works behind the scenes

and build this really nice usePopcorn project.

This application will teach you

all about building UIs and layouts, setting up effects,

fetching data, creating custom hooks and so much more.

So things are about to become a lot more real-world

and I'm really excited to show it all to you right now.

# Section Overview

Welcome to the second section

on how to think in React.

This time we'll learn how to think about components,

component composition and component reusability.

So we're gonna build this beautiful new project

over the next few sections.

In this section, we lay the foundation of the project

by learning deeply about how to split a user interface

into components, what type of components we can use,

and then how to implement it all in React.

We'll also build a simple app layout for the first time

using the power of composition.

And all these are already intermediate React topics

but still absolutely fundamental for any React developer.

So if that sounds like fun, then let's get started.

# Setting Up the "usePopcorn" Project

It's time to set up our next project.

So we're building a lot of projects, here,

which is exactly what you need

to become the React developer that you want to be.

And, by now, you already know the drill,

so just fire up your terminal,

or your command prompt if you are on Windows,

and then simply navigate to the folder

that you want to build your next project in.

Then type npx create-react-app

at version number five please.

And then the name of the app, which is usepopcorn.

So what might that be?

That's a bit of a strange name.

So let's, actually, check it out right now.

So this is the usePopcorn app,

and if you want, you can go explore it right now

on your own at usepopcorn.netlify.app.

So it's called usePopcorn

because this application is all about movies

and maybe you see that this prefix, here, of the name

is this keyword of use

and that reminds you maybe of the useState name.

So the name of the useState hook.

And so that's because we will build this project

over this section and even to other sections,

and it is going to be all about hooks, basically.

And so that's a hint to that, here, right in the name.

But anyway, here in the search bar,

we can now search for movies.

So let's say one of my all-time favorite movies

called Inception,

and this is now loading these movies here from a real API.

So we're doing some real data fetching here.

Then we can click on any of these movies,

which will then take us to this display overview here.

Then we can rate the movie.

So you see that we have this nice rating component,

and this one is definitely a 10.

Then it asks us

if we want to add the movie to our watchlist.

And as we say yes, then you see that the movie

has, indeed, been added to our watchlist here.

Let's say we also saw this one here, maybe it was a seven.

Then let's also add it to our list.

And you see now we have both of them.

And up here we have some statistics about our watchlist.

We can also delete movies from here.

So, maybe later,

I remembered that I didn't actually watch this one,

so let's get rid of it.

And, yeah, so another thing is that, when we click here,

on a movie that we already rated before,

then you see that here it no longer displays

that rating component but our actual rating,

then we can always go back by clicking here

or we can also just hit the Escape key.

So that also works.

So that's another small feature right there.

And, yeah, that's actually it.

So a very small application,

but, again, with real data fetching.

So that's going to be something really nice

that we're going to do for the first time.

So this app, here,

might feel already a little bit more real because of that.

Now, as I said,

we will build this throughout three sections.

And so, in this first section,

we'll only work with static data yet.

So this list of movies here is not yet coming from an API.

It's just an array of objects

as we have been working with before.

The only thing that works here already is at the state here,

so we can like collapse these two lists here

and we can also already write something here

into this search bar.

But, besides that, in this section,

we are more concerned about the component part.

So, basically, creating this layout that we see here

and also talking a bit about component reusability

and component composition.

And, with that being said,

let's actually move on to the next lecture

where we will learn a bit more

about how to think about components.

# How to Split a UI Into Components

So we're back in a section

about thinking in React,

which is all about state, data flow, and components.

We already talked about state management in detail,

and so now it's time to talk more about components.

Now, when it comes to components,

the important questions that we need to ask ourselves are,

how do we split up a UI into components,

and when should we actually create new components?

So let's try to answer these questions in this video.

And one way in which we can start answering those questions

is by looking at component size.

So we can classify every component based on its size,

which means that we can place every component

on this axis of component size.

On one side, we have really small components,

and on the other extreme, we have huge components.

At many times, none of these extremes are ideal.

So imagine that we wanted to build this simple card.

One way of doing it would be to create

just one huge component for the entire card.

However, that would create a whole set of problems.

First, there is way too much stuff

going on in this component,

so it has way too many responsibilities.

So components are just like JavaScript functions,

in the sense that if a function

does too many different things,

we should break it up into multiple functions.

And so the same applies to React components.

Now, another way in which it becomes apparent

that a component is too large

is when it needs to receive too many props

in order to work properly.

So for example, if we need like 10 or 15 props

to properly configure a certain component,

that component is probably way too big,

and should be split up.

So in general,

these two problems make it very hard to reuse the component,

which is one of the big advantages

of components in the first place.

Also, huge components generally contain a lot of code

that might be complex and intertwined,

which ultimately makes the whole component

hard to understand and to use.

Now, does this mean that we should do the opposite

and create many small components like this one?

Well, most of the time,

that would probably be a terrible idea as well.

If we would build a UI or an entire app in this way,

we would end up with hundreds

if not thousands of mini-components.

This, of course, would create a code base

that is super confusing to navigate and to understand,

and it would be way too abstracted.

And if you're not familiar with the term abstraction,

in programming, it basically means to create something new

in order to hide the implementation details of that thing.

For example, when we create a button component,

the user of that component might have no idea

how the button actually does what it does,

because the implementation details

are hidden behind this abstraction,

so behind this component.

So in a way,

each new component that we create is an abstraction.

Now, if both ends of the spectrum,

so both really small and huge components,

have these problems, then what should we do?

Well, most of the time,

the goal is to create components

that strike the right balance

between being too specific and too broad,

or in other words,

between being too small and being too big.

Now, these problems that we identified here,

like components having too many responsibilities

and being hard to reuse,

can help us understand

how we should actually split a UI into components.

So using the same example as before,

first we had this with just one huge component,

and then we had a lot of small components,

and both these ways of splitting up the UI

are far from ideal

for all the reasons that we have talked about.

So instead, what we want is something like this.

So here we have a more logical separation

of the content into different components,

and some of these components

are probably even gonna be reusable,

like the heart button or the SUPERHOST label.

Also, each of these components

has a well-defined responsibility,

like displaying the price or the rating,

and they're also not overly complex.

Okay, and so from this,

we can now derive a couple of criteria that we can use

to split a user interface into components.

First, when we decide which components

we need to implement a certain UI,

it's important that these components

create a logical separation of the content,

or even of the layout of a page.

We should also strive to make

some of these components reusable

and ensure that each component has a single,

well-defined responsibility.

Finally, there's one even more subjective criterion,

which is your personal coding style.

So some people work better with smaller components,

and some people just prefer larger components,

and therefore, you need to create components

in a way that works best for you

so that you can stay as productive as possible.

All right, but now let's actually dig a bit deeper

into all these different criteria.

So what I want to do in this slide

is to give you something like a framework

that will help you create new components

from bigger components.

So the idea is that, when you're creating a new component,

and you're in doubt about what the component should include,

just start with a relatively big component,

but not a huge component,

and then split that bigger component into smaller components

as it becomes necessary.

But naturally, you will now ask,

when does it actually become necessary

to split big components into multiple small ones?

Well, that's where the four criteria come into play again.

so logical separation of content, reusability,

the responsibilities and complexity of the component,

and your personal coding style.

Now, of course, if you already know that you need

a small and reusable component, such as a button,

you can just skip all this and simply create a component.

But otherwise, you can just start big,

and don't need to focus on reusability

and complexity at the very beginning.

At some point, however,

you do need to worry about these topics,

and so let's analyze them one by one,

starting with logical separation.

So if, after writing your big component,

you feel like the component contains some piece of code,

or of the layout, that don't really belong together,

then that means that it's probably a good idea

to create a new component.

Now, about reusability,

if it's possible to reuse a part of your big component,

and if you actually want or need to reuse that part,

then you should take that code

and extract it into a new component.

Another sign that you should probably extract

part of your component into a new one

is that your component is doing

way too many different things,

or that it's relying onto many props.

So if your big component

has too many pieces of state or effects,

or if the code is way too complex or too confusing,

it might be once again

time to create a new, smaller component.

And finally, as I said in the previous slide,

it's important that you feel productive

when working with your components.

So if you prefer smaller functions or components,

just split up big components into smaller ones.

But on the other hand, if you prefer big components,

that's also totally fine.

It's all up to you, because remember, in the end,

these are all just guidelines and best practices

that will become intuitive over time,

and by then, building your components

will become second nature to you.

But as you start out right now,

it's great to have guidelines like this to help you out.

And speaking of guidelines,

I actually have a few more general guidelines for you.

So first off, you need to be aware

that creating a new component creates a new abstraction.

And we talked about abstractions

a bit earlier in this lecture, right?

Now, abstractions have a cost,

because having more abstractions requires more mental energy

to think about different components

and to switch back and forth between components.

So try not to create new components

too early if you can avoid it.

Next, it's important that you name a component

according to what it does or what it displays.

And don't be afraid of using long component names.

That's completely normal in React development.

Now, what's even more important

is that you never, ever declare

a new component inside another component,

and we will learn the reason for that in the next section.

What you can do instead

when you have some related components

is to co-locate these related components

inside the same file.

Finally,

and going back to our initial topic of component size,

it's completely normal that an application

has components of many different sizes,

including some very small ones and some huge ones.

So even though we said in the beginning

that very small components have some problems,

of course, we always need some small components

like these in any application,

because they're highly reusable

and have very low complexity,

which is sometimes exactly what we need.

Most apps will also have a few huge components

that are not meant to be reused.

For example, we might have a huge page component

which contains the layout of the entire app or a page,

and that might very well be a fairly complex component

which is not meant to be reused.

So in situations like this, don't worry about reusability

or about needing to split this component up.

And speaking of reusability, as you can see from this,

we can say that, as a general rule,

the reusability range is pretty similar to the size range.

So generally speaking,

the smaller components are, the more reusable they will be.

And of course, as components get bigger,

they will become less reusable.

But again, that's no problem at all for some components.

So not all components are meant to be reusable.

But anyway, finally,

we have all these medium-sized components as well,

which all have different degrees of size,

reusability, responsibility, and complexity.

So in the end,

our application will have many different components

across the entire spectrum,

and that's completely normal and natural.

And now, let's go back to coding,

and break up a huge component into many small ones,

using all the concepts that we have just learned about.

# Splitting Components in Practice

So let's now split one huge components

into many small ones using the framework

that we just learned about.

Now, as always, to start

we need to get our starter files here from this folder.

So let's wrap these two

and then let's move back to our project folder.

And as always, I'm renaming it.

And then let's paste the new files right in here

into the source folder.

And then we need to replace these

and just get rid of some of this garbage that we have here.

All right, so as always

we just end up with index.js

index.CSS, and app.js.

Then we just grab all this and open it in VS code as always.

Close down this one.

And yeah, then we need to clean up this file here.

And so this is always a little bit of tedious work

but we just have to do it.

And actually that's already done.

You can take a look here at the CSS if you'd like

because there's actually a lot

of it to make this application here work

so to style that application.

But what matters most to us is of course this app.js.

So here we have this array of objects

that I talked about in the previous lecture here.

Then we have another array of objects

which is for this watch list.

And then here we have that huge component

that I was talking about.

So it has all this JSX inside.

So basically all of this

the entire application is now inside

of one component.

To prove that to you,

let's actually start this application here

because this one here is of course still the demo.

So let's open up our integrated terminal

that's slightly too big, and then NPM start.

So that should then open up a new tab in here.

And there it is.

So make this even smaller.

And yeah, so there is step up

and as I was saying in the first lecture

it does work here in terms of collecting these two lists

also writing something in here.

So all of that is working

and it's all working within this one huge component.

And so I thought that it was a nice exercise to

basically pretend that we're working on some team

and that one of our team members created this huge component

and now it's our task to take it and split it up

into small components that make it easy to work

with and well, which isn't this huge mess.

So let's use the framework that we learned

about in the previous lecture to do that.

So let's take a look at our JSX here,

and if you want,

you can of course pause the video and do that on your own

because there is a lot to unpack here.

So we have this nav bar here.

So this entire thing here is this nav element

and then we have this main part,

which is all of this.

Then inside the nav we have this box here

for this left side, which contains this list.

And then we have another box

on the right side which contains all of this

but we will take care of that later.

So for now, let's basically split up all

of this here into the NEF bar and into this main part.

So I think to start,

that's the best logical separation of the content

which is remember the first criteria that we talked about.

So those were logical, separation of content.

Second, reusability.

Third, responsibilities in complexity.

And fourth, the personal coding style.

So this here and the main content here

they really don't belong together.

And so that's a good idea then to create a component

for each of them.

So I'm cutting this code here

and I will actually now create these components here on top

otherwise I have to scroll too much.

So let's write function, NAF bar

and then return simply this, give it a safe.

And now it's complaining here.

So we now need to also move the state here

into this other component.

So this one here is depending on query and set query.

And so therefore we need to move that state right there.

And so actually having all the state here

was another great indicator

that this component here had way too many responsibilities.

So we have five pieces of state

and then these three derived states.

So that's way too much.

So let's just cut this here,

paste that here,

and here we also need the movies,

but I'll for now just replace this here with an X.

Okay, so now the nav bar is gone

because of course we haven't yet included it here.

And so let's do that.

And now, or up looks just like before.

And so now let's then grab all this other code,

all of this.

Cut it and put it into yet another component.

And this one, let's actually call it main.

And as we save it, it'll now complain

that it needs all of these states here.

So for now, let's just grab everything

and paste that here now, right?

And then well,

we just have to include of course,

that main right here.

And then after doing that,

the app should look just like before.

Well, for some reason it isn't

but let's see that in a minute.

For now, I will just take this component here.

Actually back to the top.

So just here.

Now let's open up our console.

Maybe we have some errors here that we're not catching

but well actually no.

Ah, but I think I know.

And the reason is that here we are not returning

so we were not returning any JSX.

And so then of course,

we couldn't have any JSX here in the UI.

Great, so let's keep going

and let's look again at our NAF bar.

So our NAF bar is now a lot simpler than before

but it's still doing a lot

of different things here, I would say.

So we are displaying a logo.

We have this input field

and we have the number of results here.

Now, in a way, all of this does actually belong together

because well together they form this nav bar.

So we could definitely argue

that this is okay like this.

But on the other hand,

it still takes some work to actually figure out

what this component here is doing

and maybe we even might want to reuse some parts of it.

So for example, this search bar,

which is basically this.

We might want to reuse it all over the place

in the application

At least if the app grew a bit bigger in the future.

And so let's at least grab this part here

and extract it into its own component.

So I'm cutting that.

And then let's create a function simply called search

then return that JSX.

And of course, we will then need this state

and we will want to include that here,

give it a save,

and then it looks exactly like before.

Okay?

But now something happened here that I personally

really don't like, which is to have one piece of JSX

which mixes like these native HTML elements

with our custom components.

So we have this div,

we have this P,

but then in the middle we have like our own search.

So that I think looks really ugly

and I really don't like that.

I think it's quite confusing.

And so let's actually also extract the logo

and the number results.

And so then we make this component here really nice

and clean and end up with these three components here

where each of them has its own responsibility.

So let's create the logo.

So we will end up here with a few small

and reusable components if we'd like.

So we have our logo and then let's say num results

function, num results.

Not right.

This doesn't look quite correct.

And yeah, now all we have to do is to include them here

And then num results.

And this looks a lot nicer.

So as soon as we look at on nav bar component,

we can immediately see ah

it contains a logo,

a search, and the num results.

And from there, if we were interested

we could then really drill down

into each of these components if we needed to.

And of course if we wanted,

we could even keep going.

So we could now create like one component here

for the icon and one for the title so to say.

But that would then be that situation

in which we would end up

with like hundreds of many components

which really isn't worth it.

So this is more than enough.

This logo is doing just one thing

so it has one responsibility already

which is basically to display this logo,

which is all this.

So there's absolutely no need to break it down even further.

So this is perfect like this.

So the nav bar is now finished

and we are ready to break up the main component,

of course a lot more as well.

So looking at our first criterion

which is the logical separation of content

we clearly have no clear separation right now.

So we have one component that has all of this.

And so the first visual division

that I would make here is to create one component

for this box and one for the right one here.

And so let's do just that.

Take this box and then let's move down here

and create the list box.

All right, and I'm calling it the list box.

And now we can see, so again

I'm calling this component here, "The list box".

Because in there is where we will have

this list of movies here.

So let's now grab the state that is missing here.

So set open one and the movies.

So cutting that from here and placing it here.

Alright?

Now, of course when you build your own apps in the future

then you will not build one huge component like this.

This is just an exercise so that we can apply

what we learned before,

but again, never build such a huge component like this

because there's really no need to then have all the work

of splitting that huge component up

like we are doing right now.

But I think that, yeah, for learning

this is fun and absolutely no problem.

So let's grab this other box as well

and place it into the watched box.

So function watched box.

Alright, let's grab all the states that we need here.

And let's also already include both the boxes here.

So that's the list box and the watched box.

So basically exactly the code that we had here

before now split up into these two components

placing the state there and it's not appearing

but that's because once again I forgot to return here.

Nice, so let's keep going

because I still think that this is way too big.

So just looking at this code, it looks quite confusing.

You cannot immediately understand what this

component here is doing.

It has like this button here,

which does something.

And then we have all of this code down here.

And so now what I want to do is to extract this

code here into its own list component

which will then have only one responsibility

which is to simply display well the list of movies.

So let's grab this, cut it from here,

and place it right here.

So movie list and I keep forgetting to return.

And then here we also need that movies state

and yeah, here all we need to do

is to include that movie list.

Nice, and this is still working.

Yes, and so we're doing a great job here.

So this component is now a lot easier to understand here

if you ask me.

So we have one button

and then if that button is open,

we show the movie list.

Nice, so getting better and better.

And I just want to mention that

in the real world we would probably have one file

for each of these components.

So something I said already many times ago

or many times before

but I still wanted to just mention that here.

So we now have this movie list component right here

and for many people this would now be enough.

But if it comes down to my personal coding style

or my personal preference,

I would actually like to still extract

this list element here into its own movie.

And we have actually done that many times before already

in this application where we had one component for the list

which would then simply loop over some array

and then display one component for each element.

And so now I will do exactly the same here.

So again, this is now a bit more of my personal preference

but I think that it's actually quite a sensible thing to do

because then here we have the mapping over the array here

isolated in this one component and have then one component

which is really only about the movie and nothing else.

And again, I keep forgetting to return here.

And yeah, let's then use that movie here.

And what will happen is that we will pass the current movie.

So this one here that's coming

from the map as a prop into that component.

We will also need this key no longer here,

but now here.

And finally accept that prop right here.

We give it a safe, we have no error.

And so let's keep going.

So I think we are quite finished here with this left part.

And so let's go over here.

Now here we can already see that it's a bit more complex

because here we have not only the list

but also like this summary of the list.

But let's see what we actually have there.

So it's inside this watch box.

And of course we can also start seeing our components

tree right here, which is always nice.

So I always like to do that actually.

And so it's coming together here quite nicely.

Maybe it doesn't even have to be this big

then we can see a bit better.

And so yeah, this is exactly what we have been building.

And now all we have to do is to also break up

this watched box a bit better.

So let's take care of that.

And first up I will do that division

that I just mentioned earlier.

So we have this list here and also this summary.

So let's grab that summary here.

And so that's basically this div

with the class name of summary.

So I'm cutting that.

And then let's just create function,

watched summary

And then returning this.

So now this code here actually depends on a few things.

So all of these variables,

so let's see what they are.

So that's these variables right here,

plus the watched.

Now we could pass all of these three here individually

or actually the four of them.

So watched plus these three here.

So we could pass them in

into the watched box component that we just created.

But actually if we take a look at them,

all of them simply depends on the watched state.

And so what we're going to do is to grab this

and pass this watched list.

So that array right here as a prop

Okay, moving there, pasting that here.

Ah, and of course we need to accept that prompt in here

and now React is happy again.

So again, what we did is that these three pieces here

are derived state and they are derived

from this watched array right here.

And so we simply passed the watched array

into this component and then yeah,

just moved these three here

of course, also into this component.

And so we did that instead of leaving this year

in the parent component and passing all of them one by one.

But this code here clearly belongs in this component.

So it's clearly part of the responsibility

of watched summary to calculate its own statistics.

And if all it needs to do that,

is this watched array.

Well then we are happy to provide it

with exactly that array.

But moving on, let's now create another list

which is here for this watched.

So this watched movies list,

so cut that as well.

So let's call this one here,

"The watch list".

And of course we could have also called it

"The watched movie list".

And let's actually do that.

So remember how I said that we should not be afraid

of long component names?

And so I think that this is a bit better actually.

Now here we will need that watched array.

So that piece of state that we have up here, right?

But let's first give it a safe and then see that error

And well, nothing really happened here.

Well first of all,

we have a bug here and it's a big one,

which is that we are here including

the same component inside itself.

So we are including watch box inside watch box.

So this was by mistake,

probably you have noticed this as I was typing.

So here of course it needs to be the watched summary

which is a component that we were talking about before

but still nothing is happening.

So let's try to reload here.

But now we have like this infinite loop

so maybe we have some errors, but yeah

I think the best thing to do is to actually

quit the application altogether

and then just try to restart.

So let's wait for it and yeah,

let's close the old one.

And now we get that error that we had before.

So before I fix that,

or actually let's pass it in already here,

but I still wanted to say that it's really,

really important

that you do not call the component inside of itself.

So again, I was calling watch box in here.

And so the problem was

that this then created an infinite loop

of the component calling itself.

And so that's why when I was reloading the application

React here wasn't really reacting.

So the application wasn't really able to then render itself.

And again, because of that infinite loop.

So never do what I just did here by mistake.

But anyway, we now passed the watched array here

into this watched movies list.

And so here we just need to receive that,

give it a save,

and then we are back to normal.

Let's quickly get our console back.

And yeah, so this is the list that we have.

And now just one more component where just like before

I will extract the list item into its own component.

So grabbing all of this,

let's create the watched movie here.

We already know that we need to accept the movie.

And here, remember, it's very important

that we place the corrupt name

into these curly braces because we are in fact

just distracting the props object, right?

And so then here

all we have to do is to write watched movie pass

in the movie prop.

And yeah, we also need this key right here.

And with this we should be done and we are indeed.

So the app works and looks just like before

but we now divided this application

into its logical components.

So components that have a logical separation

of the content that might be reusable

and that have the right number

of responsibilities and of complexity.

# Component Categories

Now that we have created

a few different components,

let's quickly talk about different component categories

that naturally emerge in most React code bases.

So most of your components will naturally fall

into one of three categories,

stateless or presentational components,

stateful components or structural components.

And I say naturally

because we shouldn't force our components

into one of these categories.

Now, these are all still normal React components

in our code, so just like the ones

that we have been writing.

But we can categorize them in this way

when we think about components.

There are also other categories that could be used,

but I think that these make the most sense.

So starting with stateless or presentational components,

as the name says, these don't have any state.

Usually, they are components that receive some props

and then they simply present that data

or even some other content,

and therefore the name presentational.

Many times these are quite small components,

such as the logo, num results

and movie components in our current app.

Next, stateful components are simply components

that do have state.

Now, just because these components have state,

that doesn't mean that they can't be highly reusable.

For example, the search component that we built

does have state and we could reuse this input

as many times as we wanted throughout the app.

Now finally, you can think of structural components

as pages, layouts, or screens of the application,

which are oftentimes the result

of composing many smaller components together.

And more about composition later in this section.

So these structural components can be large

and non reusable components, but they don't have to.

Structural components are sometimes quite small too.

What matters is that they are responsible

for providing some sort of structure

to applications such as pages or layouts.

Therefore, these components might not be present

in really small apps,

but you will definitely have a few structural components

as your app grows bigger and bigger.

# Prop Drilling

Now we left a small problem

in one of the components that we just created earlier.

And so let's now go fix that problem, and in the process,

discover the problem of prop drilling.

But before we go do that,

I just want to very quickly review the previous lecture

by classifying each of our components

into one of the categories that we just looked at.

So I think that clearly both the App

and the NavBar component here are structural components.

So they're only responsible for the structure

or for the layout of the application.

And the same can also be set of this Main component here.

So those are for providing structure.

Then the logo here

is clearly a presentational component,

so it doesn't have any state,

and so therefore it's stateless.

And it simply presents some content here.

Then the Search is, of course, a stateful component.

Then NumResults is just a presentational component here.

Main we already talked about.

Then we have the ListBox,

which clearly is a stateful component,

and the same for the MovieList and for the WatchedBox.

So those are all stateful components,

while the Movie simply receives this prop right here

and then presents that data in the user interface.

And so Movie here is just a stateless

or presentational component.

Then we have this one here,

which is also a presentational component,

and the same for this one,

so WatchedMoviesList and WatchedMovie.

All right, and that's actually it.

I just wanted to quickly categorize each of them,

but now let's move on

to that problem that I mentioned in the very beginning.

And that is that right now

here we are not dynamically calculating

the number of results.

So we are not basically taking the list of movies

and reading how many there are, and then displaying it here.

So that's what we want to do.

But yeah, now we only have this X.

So what we need, basically,

is to get access to the movies state

right here in NumResults.

Now, where does that state live right now?

Well, it's here inside of MovieList,

so right here.

So, again, it's here, but we also need it here

in NumResults.

So what's the solution to that?

And I really hope you already know at this point.

Well, the solution is to lift the state up

to the closest parent component.

And what parent is that?

Well, it's the App component, right?

So it's not the NavBar,

because, of course, that's not a parent of MovieList.

And so it is really the App component.

So what we need to do

is to cut this from here

and place it right back into the App component.

All right?

And now we need to pass it down as a prop

to where we need it.

And so this is where the problem of prop drilling

will come into play.

So, again, we need now this state

in order to make this work again inside of the MovieList.

But this MovieList is really deeply nested

inside this component tree, right?

So it has these two parent components,

which now will also need to receive that state as a prop.

But instead of talking, let's actually do this.

So movies={movies}.

So now we have the movies array inside Main,

so let's go there.

And we need to receive it here,

and then we need to pass it here

right into the WatchedBox

or actually into the ListBox.

So movies={movies},

or actually here, yeah

it's not main, of course, it's movies.

Okay, so now we got it inside the Main,

and now we got it inside the ListBox.

So let's come here and do it all again.

So accepting it here

and then passing it here.

So movies={movies}.

And so what we are doing right now

is what we call prop drilling.

So now we finally accept it here, and then it works again.

So basically prop drilling means

that we need to pass some prop

through several nested child components

in order to get that data into some deeply nested component,

which in this case is this one.

So we had to pass this movies prop here first into the Main,

then, well, from the Main into the ListBox,

and then from the ListBox into the MovieList.

And so all these components,

they didn't actually even need this prop.

All they needed this for

was to then pass it down even further the tree.

And so we end up with a lot of props

that are really not needed at all.

All they are needed for

is to pass the data down even further

into our component tree.

So this is what prop drilling is.

And you saw that it is not a lot of fun,

and it could be even worse, of course,

if the data was nested even deeper into the tree.

So this was just like three levels deep,

but it could be like 5 or 10 levels.

And so then it would become a little bit out of control.

So we will look at ways of fixing prop drilling

a bit later in this section,

but, for now, let's finally also make this prop,

so this movies data,

available right here where we also need it.

So right here.

So movies={movies}.

So now we have to do some prop drilling again,

because here we need to again accept this prop,

but we don't need it here.

All we need it for is to pass it down again.

But here it's not so bad,

because it's really just one level.

Okay, and now, finally, movies.length.

And so ta-da, we got three results.

Nice. So this works.

And what we just did here

is a perfectly valid solution

to make the application work, of course.

But, as I mentioned,

what we did was some so-called prop drilling,

which is not always the best solution,

especially if we need

to pass that prop down really, really deep into the tree.

And so in the next lecture,

we will take a look

at one of the possible solutions to this problem,

which is component composition.

# Component Composition

As we keep learning about components

in this section there is one essential principle that we

really need to focus on now, which is component composition.

Now, in order to talk about component composition,

we first need to take a look

at what happens when we simply use

or include a component in another component in JSX.

So let's say that we have this model component

that we want to reuse, and also this success component

which simply renders the message well done.

And then we just use the success component

inside the modal component like this.

And this sort of thing is exactly what we have been doing

with our components most of the time, right?

So we just use them inside of other components.

However, when it comes to re-usability

this creates a big problem.

That's because right now the success component

really is inside of modal.

They're deeply linked together

in the JSX right now, and therefore

we cannot reuse this modal component to display some

other message inside of it, for example, an error message.

But as you can imagine, in order to solve this, we now bring

in the technique of component composition where

we can compose the model and success components together.

So here we have our modal component again, but

with a fundamental difference.

So this component does not include a predefined component

but instead it accepts children with the children prop.

So just like we have learned before, so

if we get our success component again, we can now basically

just pass it into the modal by placing it

between the opening and closing tags when we use modal.

And if you need a minute to analyze this code a bit better

feel free to just pass the video right now

because I want you to really grasp the fundamental

difference here.

So in the first example, the success component is really

tied to the model.

And so that model might as well be called a success model

because we can't use it for anything else anymore.

But with component composition, we simply passed the success

component right into the model and composed them together

in this way.

And again, this works thanks to the children prop.

Now, of course, we could have passed in any other component

which makes the model component highly reusable.

So essentially when we do component composition,

we leave this hole or this empty slot in the component

ready to be filled with any other component that we want.

So let's say that later we needed another model window

somewhere else in the app,

but one that renders this error message.

Well, that's pretty easy now.

We just used the model component again

but this time we pass in the error component as a children.

And with this, we have also successfully

composed these two components together as well.

So formally component composition is the technique

of combining different components by using the children prop

or by explicitly defining components as props.

Now we use composition

for two big reasons or in two important situations.

First, when we want to create highly reusable

and flexible components such as the modal window

or really a million other reusable components

that we can think of.

And we do this really all the time.

Now, the second situation in which we can use composition is

in order to fix a prop drilling problem

like the one that we found in the previous video.

And this is actually great for creating layouts

as we will do in the next video.

Just keep in mind once again

that this is only possible because components

do not need to know their children in advance

which allows us to leave these empty slots inside

of them in the form of the children prop.

And with that being said, let's return to our project.

# Fixing Prop Drilling With Composition (And Building a Layout)

So let's now use component composition

in order to fix the prop drilling problem that we

have just encountered before.

And in the process, we will also find a way better solution

to building layouts in React applications.

And let's start by fixing the easy prop drilling problem

which is the one where we pass the movies prop

into the NavBar, and then from the NavBar

we pass it here into the NumResults.

So here we only have one level of prop drilling.

Now you might be wondering how can we

use component composition in order to solve this problem?

Well, what if we could use

the NumResults component right here

in the app component instead of in the NavBar?

Then we wouldn't have to pass

in this movie's prop into the NavBar, right?

Which would then fix that prop drilling problem.

So we can actually do that with component composition.

So let me show you how.

So here, instead of accepting the movies,

let's accept children.

And so this is then that empty slot that we talked

about in the previous lecture.

And so now here in the NavBar,

instead of closing it right here

let's have a opening tag and a closing tag.

And then between these two, we can just grab this,

place that here,

and then just include those children.

And that's it actually.

So give it a safe, the app looks exactly the same as before

but we have eliminated the prop drilling problem, right?

Because now we are using NumResults right here

in the component where the state actually lives.

So the movies state in this case.

And so then we can pass it directly

into the component right here

which is the one that actually needs it.

So NumResults is not an intermediary component

just like NavBar was before.

And so of course then here we can finally

and terminally remove it.

And so this then really shows that the prop drilling

has been eliminated and all by using component composition

where we now basically composed the NavBar together

with these three other components here.

So these three is what are becoming the children

of the NavBar.

And so here again, we then accept those children

and simply display them here.

We could also say, for example, that we do not

need to display or to include the logo right here.

So we could, for example, cut it here and place it here

and then it works just exactly the same as before.

So this logo here is just completely stateless anyway,

and it's not really relevant to the app.

And so we could say that it should always be a part

of the NavBar, but maybe these two here can be optional.

So with this, we can very easily later say that, well

maybe we don't need a search here, so remove it.

And there you go.

We didn't even have to touch the NavBar at all.

All we had to do was to come

into our application where we now have an easier way

of seeing basically the overall layout of the application.

Let's, of course, put it back.

And then let's fix the worst problem of prop drilling

that we also have, which is here for this movies list.

So let's do the same with the main component here.

And here remember that we actually need

to pass the movies prop through several layers.

So we pass it from app into main into here, the ListBox.

And so we can remove again, all these intermediary steps.

So here in the main, let's no longer accept the movies

and instead accept children.

So then let's remove the WatchedBox from here

or actually the ListBox,

or actually why not both of them?

So let's cut them from here,

say children

and then we can do the same thing as before.

So here now we get rid of this,

let's close it.

And then just place these two here

and we can then no longer pass the movies

into the main element or the main component

because that one no longer needs it.

I mean, as you know,

it never even needed it in the first place.

It only needed it to pass it further down the tree

but now the tree is basically built in a different way.

And so then again, this component no longer needs that prop.

Nice. And so actually we can keep going.

So we can just do exactly the same thing here

to the ListBox

because that ListBox also doesn't need the movies really.

It's also just passing it down.

And so let's remove it.

So let's grab this, cut it from here.

So this will now become the empty slot here

inside this ListBox component.

So remove that,

do the same thing as before.

Of course, we need to close it here.

And while that's taking a bit too long

let's manually reload here, and still that's not working.

But yeah, the code should be correct.

Let me just remove this from here now

and I will simply close the app and run it again.

So it's the second time we needed to do this

in this section so far, but sometimes that can happen.

Well, apparently this is not the solution this time.

So let's see if we have some error here.

And actually, yeah, sometimes it's a good idea

as I said right in the beginning of the course

to actually read the errors here.

So it says objects are not valid as a React child.

So let's go back to our movie list or or to the ListBox.

Actually, we're just the one that we just did something in.

And yeah, the problem is actually right here.

So here we were basically creating a new object

which is not necessary.

All we need to do here is to really conditionally

render this children prop.

So give it a safe.

And there we go.

Just reload again to get rid of the errors.

And that's it.

So now we are essentially directly passing the movies

prop right here into the movies list from the app component.

So as I just said, we are in the app component.

And now thanks to all this composition here

we can pass the movies directly

into the movies list, which is

in fact the only component that does actually need it.

Not this one, not this one, but only this one.

And of course also this one.

Great. So this is actually a really,

really nice way of building layouts in React applications.

So just by looking at the return JSX from the app component

we can nicely see the entire layout

and also basically the entire componentry.

So what we have here is indeed very similar

to what we can observe right here.

So we have the app which has the NavBar

which in turn has the search and NumResults.

And we have the main, which has the ListBox,

it has the WatchedBox,

and then that one also has some stuff in it.

So here we didn't do the component composition yet

but we will do very soon.

For now, I want to take a break here

and I want you to analyze this code

on your own for a few minutes.

So really understand the deep difference between the code

that we had before and the code that we have right now.

And if necessary, you can also re-watch the previous lecture

in which I explained exactly what is happening as well.

So again, please take now five or 10 minutes to do that

and then let's move on to the next video.

# Using Composition to Make a Reusable Box

So we used composition

in order to solve a prop drilling problem

and to build our layout in a way nicer way.

And so now let's use it to build a reusable box component.

So we already converted the list box component here

to use the children prop

in order to then basically fill that slot, so that hole

with this component that we pass in as a child component.

And so now we could go ahead

and do the exact same thing with the watched box.

So let's actually go there.

So watched box and it's right here.

However, if we take a look at this component right here

it is very, very similar to that other box.

So to that list box.

So basically both of them have this state here of isOpen

then they have a div with the class of box,

and then they have this button

which is also exactly the same.

And in the end,

they will render their children conditionally.

So based on the isOpen state.

So again, if we go here

we will see that it is basically exactly the same.

This one here has this watched state,

but we can easily move that somewhere else.

So what I'm saying is that both the watched box

and the movie box have this same state here.

Basically they have this same class name, this same button

and then they render something conditionally

based on the open state.

And so this is an amazing candidate

to create a reusable component.

So let's do that

and let's do it separately actually of the other ones.

And I will simply call it box.

Let me, just to make this a bit easier,

cut this one and paste it close to the other one.

And then we can see how similar they actually are.

And you know what?

I will actually not create a new one,

but I will immediately convert this one here

because the list box is basically already what we want.

So let's just re-call it box.

Then here we no longer need,

like this name here of isOpen1,

and setIsOpen1.

Let's change that here, change that here, and here.

And that's already it.

So we no longer need this watched box.

So let's completely comment that one out.

And so, let's now use this box

here inside of this list box that we're using.

So box right here, let's remove that one for now.

And box here as well.

And well for some, ah, I had the wrong one here open still.

So just to make sure, let's reload.

And so this part still looks exactly the same as before.

And so now we can use this reusable box.

And simply pass in that content

that we passed before into the watched box.

Which is basically this, right?

So copy that and let's paste that here.

And now we get the problem, which I was saying before.

Which is that this watched array here now needs to be moved

onto this component.

So this state that we had before can no longer live here,

but it couldn't anyway, as we will see in a future section.

So we would have to place this here anyway.

So yeah, this fixes the problem.

And we shouldn't even need this right here.

And so there we go.

We just created ourselves a reusable box component.

And the state now works, of course, still in both.

And so we didn't have to rewrite that same state logic

and the same button here in both of these lists

because again, they were basically exactly the same.

And so what we did, again, was to create this reusable box

and in there allow for any children to be passed in.

So we created like this empty hole here

ready to receive any components that we want

which in this case is the movies list.

And in this case it's the watched summary

and the watched list.

So here we have just one children component

and here we have two.

But no matter what,

our box always works for all of these situations.

And so again, all of this logic here,

so this button here with setting the open state

could just be reused in this way.

And on top of that, as a bonus

we made our application tree here

even more explicit in the app component.

So now it really is very clear what exactly is happening

in the application.

Just by looking at this one component,

we can immediately see the entire structure

of the application.

Which is really, really helpful.

So this is really great.

And we're moving

into some more intermediate React territory.

But that makes complete sense

because we are already in part two,

which is exactly for intermediate React.

So it's great that at this point

we are already able to do something like this,

which is already way closer

to how real world React applications look like.

So really, really keep this technique

of component composition in mind.

Both for building better layouts, for solving prop drilling

and also for creating reusable components like this one.

So hopefully you saw how powerful this is.

And so as you start writing your own code,

be on the watch out for whenever you can do this.

So whenever you can create some reusable components

in your own code using this amazing technique.

# Passing Elements as Props (Alternative to children)

In the lecture about component composition,

I said that we can use the children prop

for composition or an explicitly defined prop.

And so let's now quickly explore that second option.

So instead of using the children prop in a component

and then passing in a component like this,

we can use an explicit prop as an alternative.

So let me show you what I mean

by first commenting out all of this.

And then we can go to the box component.

So down here, and now instead of accepting children here,

let's say we accept something called element,

and it can really be called anything.

So just L or really whatever.

And so now we can go back up here

and include the box in the old way.

So closing it immediately

but then we can specify the element prop.

And now here we can then

do exactly what we had here.

So let's copy that and paste it,

give it a save and that worked.

So now we have our movie list like here

and it was passed into the box component

as an explicit prop.

In this case, a prop called element.

So before what we had here

is that we were basically implicitly passing

in this component into the box,

and then we read it there

with the children prop.

But here we now basically pass it in more explicitly.

So we really say that we have an element prop

and then we place whatever

we want to pass in right here,

so right into the element prop.

And this pattern is used in some library,

for example, in React Router.

And so this is why I thought

it might be interesting

to show this to you right now.

And of course we can do the same

with the other box here.

So simply saying element and then this.

Now here, basically we are passing

in a brand new piece of JSX.

And so here we now actually need a fragment.

Give it a save and there we go.

So the app now looks exactly the same as before

but we basically passed in an element

or multiple elements here

instead of using the children prop.

But the result is exactly the same.

And under the hood, inside React,

it should also be basically exactly the same.

So this can be a viable pattern

in case you need to pass in multiple elements

and give them separate names.

So that would be a perfectly fine use case

for using something like an element prop

or really any other prop with any other name

instead of the implicit children prop.

But in our case,

let's go back to what we had before

because I think it looks a lot nicer actually

and it's also clearly the preferred way

of doing this inside React.

So this was really just to show you.

So I will just delete this entire code

and put this one here back,

and then let's go to the box

and fix it there as well.

And by the way,

let me show you a very nice trick in VS code

which is that if you hover over any component here

and then hit command on the Mac

or control on Windows,

we can actually go right

to the definition of the function.

So in this case, of the component,

so I'm hovering box here

then I hit the command key, click,

and then I immediately move there.

And what's even nicer is that

if we do the same down here,

so again, hitting the command or the control key,

then we go right back up.

Well, in this case,

somehow it doesn't work,

but usually it should.

But yeah, what matters is that we can move

from where the component is called

into the place where it is actually defined.

And so now let's change element back to children.

And then we have just what we had before.

So this was really just to show you

an alternative way of using component composition

without the children prop.

But again, using children is by far

the preferred way of doing things.

# Building a Reusable Star Rating Component

Let's now take a break

from building our project and build a small reusable,

and flexible, star rating component.

So what we want to build is a component like this one.

So it displays multiple stars

and then as we hover over them

it displays the currently selected rating

here, on the right side.

So as you see, as we hover over the stars,

it always shows the currently selected number of stars.

And if we click here, then that number stays fixed.

And if we then click again,

because this movie is definitely a 10,

then of course we can also change that rating.

Now, okay, now we will develop this component here

in complete isolation.

So outside of this current application,

so that we could reuse it anywhere we wanted,

and also make it really flexible

by allowing for different props.

For example,

here we can rate between zero and 10 right now,

but we will make it so that the user of the component

can choose what number of stars they want to display.

And that's just one of the things that we will do.

But anyway, let's now come here to our project

and then let's create a brand new component file here.

So, star rating and then export default function

and then the name of the component.

So star rating, and for now, we won't accept any props here.

We will leave that for later.

And now let's just return something here.

And now what I want to do,

is to actually come to the index, the js file,

and then no longer import the app here, for now,

and also not the CSS file,

because, again, this component should be completely reusable

and so it shouldn't depend on any external CSS files.

So instead, what I want to do now

is to import that star rating

and you see that VS code

automatically wrote our import statement here.

And if for some reason your VS code didn't help you

with this auto complete

then just make sure to type exactly this.

Then finally,

we also need to remove this one here, temporarily,

and, instead, include our star rating here.

And I'm doing it like this

just so that we don't have to create a brand new project

just for building this one component.

So for now we will just use this project

that we already have

instead of creating a new Create-React-App.

But anyway, let's give it a save now.

And now here you see that, hello, that's coming from here.

So from the star rating.

So let's close the app, and the sidebar,

and then let's get started.

So starting with the JSX here.

So just with the structure,

we see that we have basically two main elements.

So we have one container for all these stars

and we have then, like this message here,

so the current rating on the right side.

So inside our diff,

let's place another diff for those stars,

and then one paragraph for that message.

So for now, let me just place a number here and here.

For the stars,

we want to dynamically generate these star elements.

So instead of writing them by hand, one by one

because that's the only way

in which we could sometimes have five stars

in other situations, 10 stars or really any other number.

So let's use the technique that we used before

in the faraway app.

So entering JavaScript mode

and then we can write, array.from.

And here we can then specify an object

with the length property

and let's set it here to five, initially.

And so this then creates an empty array

with five elements

that we can then immediately loop over

by passing in a function.

So like a map function, here as the second argument.

So in this function

we are not interested in the elements themselves.

Let's just use a placeholder variable.

But we are interested here in the number.

All right,

and now here we can just render anything.

Let's just do a span element for now,

but later we will place the stars in here.

So let's just write S for star.

And then here the number,

and actually this should be S plus one

because I, of course, is zero based here.

Okay, and this should already be something.

And indeed we see star 1, 2, 3, 4, and 5.

Which of course, again, are just placeholders for now.

Here we have some error, which probably, yeah,

it's because of that key prop.

So let's add that key here.

Well, actually we don't

because this is just temporary anyway.

Now, okay, so now let's define some styles here.

And remember how I said initially

that we cannot depend on any external CSS file

or CSS classes

and, therefore, we need to define all our styles in line.

So, let's do that starting here with the parent element.

And so here we now need to specify an object,

and why not actually do that here

as a separate object outside.

So let's write containerStyle.

Then let's set the display property to flex.

So to place the two elements side by side, then align items.

Let's set that one to center,

which will align the items vertically.

And then let's also specify a gap of 16 pixels.

Okay, and now here we can just specify that,

give it a save,

and that looks already a bit better.

And now we can do even better

which is to take this entire object

which will never change.

And it doesn't depend on anything

that is here in the component.

And we can place it completely outside of the component.

And by doing so,

this object here will not have to be regenerated

by JavaScript each time that this component here rerenders

because, otherwise, each time that a component does rerender

dysfunction will get called again.

And so then this object would also get regenerated again.

And so that's not necessary.

And so we can just place it outside here.

Now, next, let's also create some styles

for the other container.

So this container here with the stars.

So let's say starContainerStyle.

So let's also do display flex

and then give it a gap here of just four pixels for now.

All right.

And finally, just some styling here for the text.

So text style, let's say lineHeight.

Yeah, I was trying to write some actual CSS,

but in JSX, remember we need to write our property names

camel cased.

So not a line-height, but lineHeight like this.

Let's also specify a margin of zero.

And here, let's actually say one.

So this probably won't change a lot yet,

but it's going to be important later.

So style,

okay, and now to finish,

let's do what I said right in the very beginning,

which is to basically allow the user of this component

to set the maximum amount of stars.

So the maximum rating.

So coming back here, let's say,

that as the user of this component

I wanted to pass in the max rating, for example, as five.

Now, then maybe I wanted to use this component

at some other place in my application,

but here I wanted 10 stars.

But now as we reload, of course,

both of these components will only have five stars.

Cause we hard coded that value here in our rating.

So what we need to do

is to now accept that prop here,

max rating, and then use that right here.

And so this is why we had to use this trick here

instead of manually writing the number of stars.

So instead of writing one element here per star,

and so if I save this now,

you see that indeed we get now 10 stars here, great.

But now what if someone used this component

without specifying the max rating property?

So since we're building a highly reusable component,

we need to account for all these situations

because we will never know

who is actually going to use this component

and what props they will specify.

So we need to account that this might happen.

So in this case, we have a problem

because then, well we have exactly no stars.

So what we need to do is to set a default value

for the rating.

So how do we do that?

Well, we can actually leverage the power of destructuring

in JavaScript because whenever we destructure an object,

we can actually set a default value as we do so.

So here we are actually destructuring the props object.

And so if max rating doesn't exist,

we can set a default simply by writing this.

And so if we save this now,

then we are back to having our five stars by default.

And so this is a very common way of setting default props

in React applications.

We will do this all the time as we go through the course.

# Creating the Stars

Next up, let's actually create the stars

and make the component dynamic by reacting to a click event.

So let's create a brand new component here,

so function Star,

because the JSX code here

is actually going to be a bit complex.

But for now, we will want to return just the icon itself.

So I actually already included that icon hidden here

in the CSS file.

So if you scroll all the way down here,

you will find some code, here it is.

And so let's grab all of this comment,

so all the way until the end,

cut it from here,

and paste it down here.

Then we can close the sidebar and this one.

And so here, we have the star icon as an SVG.

So let's start here with the full star,

so just this SVG,

copy that and paste it here,

and then let's use that star here.

So instead of this, we will simply include the star.

And then let's also define the key prop.,

and let's simply use i,

so the current index, which is not ideal,

but at least then React doesn't complain anymore.

Give it a save, and nothing is happening here.

Let's try that again, and let's inspect what we have here.

So I was not expecting this,

so we have indeed our stars here,

but they appear to not have any height.

And so let's try to fix that right here.

So I will just wrap this SVG into a span element.

Let's cut it from here, place it at the end,

and then I will again define some style object out here.

So let's say const starStyle equals,

so width, let's say, 48 pixels.

And let's do the same for the height.

Let's give it a display of block property as well

and setting the cursor to a pointer

so that they behave a bit like a button.

And so then we should also define the role property here

for accessibility.

So this is just HTML for accessibility,

it has nothing to do with React.

Okay, and then our starStyle.

And there we go.

So now we have all nice stars.

Now they might be a bit too big here,

but we will later allow the user to set the size.

I'm just noticing

that we have maybe enough space between them,

and so let's remove this gap right here.

Great, now let's actually make our component dynamic,

meaning that whenever we click on one of these stars,

we then want to display the current rating

here in this paragraph element.

So since we now want the UI to re-render based on an event,

so we want something to happen on the screen, we need state.

So let's create a new state variable called rating,

of course, by using useState.

And by default, let's set it to 0.

Okay, next, let's use that state.

So as a second step, we include the rating prop right here.

And so then we see 0.

While that's maybe not so ideal,

because if the rating is still 0,

that simply doesn't mean

that the user hasn't basically rated yet,

so they haven't done anything.

And so here, let's say that we either want the rating

or an empty string.

And so thanks to short circuiting,

we will then move here to the second part of the operator

whenever this is a falsy value.

But of course, if we had 1 here,

then we would see that 1.

Now maybe just to clear the confusion a bit,

let's remove these other two star ratings here,

so working with just one.

And so where do we now need to listen for the click events?

So, basically, when the user clicks here,

then the rating should become 1.

If they click here, then it should become 2, 3, 4, and 5.

So what this means

is that we need to listen for the click event

on each of these stars.

So let's start by defining a onClick prop here,

which we will then later receive inside the star.

So here we will now define a function

which will actually set the rating.

So let's say setRating,

and then whatever the current index is, plus 1,

because remember that array indexes start at 0,

but our rating should start at 1.

Okay, so now, of course, nothing will happen right now,

because we actually need to listen for that event

on an HTML element,

so like a JSX element.

So what that means

is that here we need to now accept that onClick handler,

so this function that we defined right here,

and then use the onClick prop right here

to then actually listen for the event and react to it.

And if this is a bit confusing,

then let's maybe change the name here

from onClick to onRate.

And so then it becomes really obvious

that this is actually our own prop.

So this is our own handler function,

and we could, of course, even have created that separately.

So onClick should be onRate.

And so this is basically

what we have been doing all the time,

which is to pass an event handler function

from the component that owns the state, so this one,

right into a component

that wants to actually update that state.

So in this case, that's star.

So we can make that even more explicit if we want.

So we can say function handleRate or handleRating maybe,

and then here we accept a rating,

and all we do is then setRating,

well, to that rating that we receive.

And then here we can use that handle rating function.

And so with this, we created a similar pattern

to what we have done all the time.

So creating a handler function

in the component that owns the state

and then passing that handler function

into some other child component

which will actually update the state.

Now here we are actually passing this function here,

so not just this one,

because here we need to fix the value of the rating

that we want to be set for each star.

Okay, that was a lot of explanation,

let's just reload here.

And now as I click,

you see that the state does indeed update.

All right, so that's already working.

And yeah, if this was a bit difficult for you to understand,

then you can, as always, just pause the video here

and analyze the code on your own.

So what we did here is actually a bit similar

to what we did in previous exercises.

For example, I think, in the accordion exercise,

we did something very similar.

Okay, and now to finish,

what I want to do

is to display only the amount of stars

equal to the rating in full

and all the other stars empty,

so just like here.

So here, if I click on the 5,

then you see that 5 stars are full

and the other ones are empty.

And so here, let's now quickly do exactly the same thing.

So we already have that other empty star right here.

And so now we want to basically conditionally render

either the full or the empty star.

So let's grab this here,

let's cut it, actually.

And then here, let's enter JavaScript mode.

So we will want to have a prop here for the star

that says if this star is full.

So we will take care of that later.

But for now, let's just say, if the star is full,

then render this part, so that SVG element,

and if not, then render this one.

All right, and so now, of course, full is undefined

because we are not passing it in,

and therefore, all of the stars are empty right now.

So how do we define whether a star is full or not?

Well, it's actually pretty simple.

So full should basically be a true or false value, right?

That's why this conditional rendering here works.

So again, when full is true, then this one will be rendered.

And if it's false, than the empty star.

So here we just want to now write a condition basically

that will always be either true or false.

So all we have to do is to say,

"Is the current rating greater or equal i + 1?"

Which is always the rating

for the currently generated star.

And you see, that immediately, that worked here.

Great, so let's again see why this actually works.

So it all starts with this i variable right here.

And so this comes from the index of the empty array

that we create here with the length of maxRating.

So we create that array

and then we immediately loop over it.

And so then the first star that we create has the number 0.

So this one is star 0, 1, 2, 3, and 4.

We then use that index in order to handle our rating.

So if we click on the very first star here,

it will be 0 + 1, and so it becomes 1.

If we click on the third star here,

well, then here the index is 2,

and then 2 plus 1 makes 3.

And so then the rating, as we see, is set to 3.

And then in order to determine

whether a star is full or not,

all we need to do is to compare the currently set rating

to the index of the current star.

So here the index is 0 + 1.

So here it's 1, here it's 2,

here it's 3, 4, and 5.

And so right now, our rating is 3.

And so here, of course, that 3 is greater than 1.

Here, it's greater than 2.

Here it's greater or equal 3, and so it's still true,

but then here,

it's, of course, false.

So 3 is not greater or equal 4,

and therefore, this one here is then not full.

So this condition will return false,

which will then make the star being rendered as empty.

Okay, so hopefully, that made sense.

And indeed, our component is now already almost working.

All that is missing

is this functionality of hovering the stars.

And so let's take care of that in the next lecture.

# Handling Hover Events

Let's now handle the event of users

hovering over our stars.

So basically the functionality that we're looking

for is this one.

So whenever we hover over these stars

we get like a temporary rating here exactly

with the number of stars that are currently being hovered.

So here we have nine, well, here we have three

but it is completely independent

from the rating that is actually set right now.

So the rating is set to five, but again

whenever we hover over some other number of stars

then that temporarily changes to that rating now, right?

So what that means is that now we need a brand new piece

of state to basically store that temporary rating.

And again, that makes sense

because something should happen on the screen.

So the component should re-render whenever

there is some hover event.

That's how we then get that new rating in there.

So let's say,

(keyboard clicking)

for example, temp rating

which stands for temporary, and then set

temp rating.

And we start at zero.

And of course the rating itself should also start at zero.

Now, right.

Now, in order to actually handle that hover event,

let's go down here onto our star.

So into our star component.

And then where we handle the click

is where we also handle the hover.

Now, there's not really a hover event

but instead we have on mouse enter.

So let's just do some console log lock here for now.

So that's one of them.

And then we have mouse leave.

So we basically need to handle these two separately.

(keyboard clicking)

Okay, just so that we can quickly see.

So I entered basically this element, and then it said enter.

And immediately afterwards it said leave.

So let's see again.

And indeed, each time that we enter or leave,

well we get our log down there.

And so now all we have to do is to update that

temp rating state that we just created

in each of these situations.

So let's pass in then two handler functions here

into the star, just like we did for the on rate.

So let's call this one here on hover in.

And the prop name here is different again

from the event name, just to avoid some confusion here.

So we could also call this prop on mouse Enter again,

but then it might be a bit confusing and you might think

that the event is actually handled right here

on the star component, which of course is not possible.

So the event always needs to be handled

on a JSX element itself.

So like an HTML element such as a span.

Now Okay.

And now all we have to do here is to basically

set the temp rating to the rating of the current star.

So that's again, I plus one, right?

And then on hover out, we set it back to the initial value.

So temp rating back to zero.

So here we need to change the name.

So of course this is with an upper case R.

And now all we need to do is to accept these two props here

and wire everything together.

So, on hover in

on hover out.

Alright? And so then here

we of course want to now call these functions.

And here

on hover out.

And now finally

we need to actually display this rating in the UI.

So you see here right now that it's still yellow

which means that we haven't used it anywhere.

So let's, for now, replace this rating with the temp rating.

And then let's see,

and yeah, that's already working.

So see how that value was there shortly.

We had the three,

then here the four, the five

and so on and so forth.

So that's working great.

The only part that is not working

is that the stars are not getting full.

And so let's quickly fix that

here inside this condition here.

So here we can say that if there is a temp rating.

So if there is a temporary rating

then do the same thing,

but with that temp rating.

So then temp rating, greater or equal I plus one.

But if not, well then we just do what we had before.

And so this should fix that and yeah, beautiful.

So that works great.

And if we click here,

well then the number disappears,

but the stars stay the same.

And so that's because now we have the rating set.

And then, so here in this full prop

we enter the second branch,

which then just like before

sets these four stars here, two full.

Now all we have to do here is to place another

or here and say basically

if there is no temp rating, then display the current rating.

And if that also doesn't exist

well then we get the empty string.

So indeed, we now get four.

If we click again, we get five.

But as we hover, we get the temporary rating.

So just like we wanted

and just like this component here works as well.

So this looks really nice, really real world actually

and it wasn't that much work.

All we had to do is some tricks

with these two rating states.

And then handling all of these different events.

So basically handling the click, the mouse enter

and the mouse leave.

And the result, if you ask me,

is even a bit magical here.

So I really, really like this effect that we created here.

Okay.

And so that's the main functionality already implemented.

But now let's make the component really

really flexible by allowing a couple of props.

So we will learn all about that in the next lecture

and then we will come back here

and create the API basically of this component.

# Props as a Component API

When we build a reusable component,

like the one we are currently building,

we should carefully think

about what props the component needs.

So let's now shortly look at how to think about props.

So, first of all, as we start working on our components,

we should get into the mindset

that any component is always created by someone,

and always consumed by someone.

Now, when you're working on your own,

the component creator and consumer,

is, of course, the same person.

But if you're on a team,

those might very well be different developers.

But in any case, it's always a good idea

to think in terms of there being a creator

and a consumer of a component,

so, different entities, even if it's just yourself.

So, basically, the creator

is the person building a component,

and defining what props the component can accept.

While the consumer uses the component

somewhere in the application,

by specifying values for the props.

Now, the reason for the separation

between creator and consumer,

even if you're just working on your own,

is that if we have this mindset,

we can think of the component's props

as the public API of the component.

So, as a component creator,

when we choose what props

the consumer is allowed to pass in,

we are essentially defining

the public interface of our component.

And, at the same time, we are choosing

how much complexity of the component

we want to expose to the consumer of the API.

Because, in the end,

a component is basically just an abstraction.

So, we are encapsulating a part of the UI

and the associated logic into a component,

and allow consumers

to interact with that component via props.

And that's it.

That's basically what creating a new component is.

But, anyway, when we decide about

what props to allow in a component,

we need to find a good balance on how strict we want to be.

So about how many props we want to enable for configuration.

For example, let's say

we're building a weather component,

so a component that simply displays the weather.

We could make it extremely simple,

for example, only allowing one prop.

So, for the location

for which the consumer wants the weather.

Now, this might be perfectly fine,

but it might also make the component not flexible enough,

or maybe even straight out, useless for the consumer.

On the other hand,

we could allow props for the URL of the weather data,

the number of days,

whether it should be daily or hourly,

how many days, which temperature to unit,

what data should be displayed, and so on.

I could think of really 20 other props here.

But the point is that exposing so many props,

might make the component

way too hard to use for the consumer,

because we're exposing too much complexity.

And speaking of complexity,

you'll end up with very complex code,

if you want to allow so many props.

So, when deciding on the right API for your components,

try to strike the right balance

between too little and too many props,

and a balance that works well,

for both the creator,

and the consumer of the component,

based on the project's needs.

Now, if for some reason

you really need to expose so many props,

make sure to at least provide

some good default values for many of them.

Okay, and as always, this will come to you with practice,

but I thought that it was quite important

to get you into this mindset

of distinguishing between component creators and consumers.

And so with that, we're ready to put this into practice.

# Improving Reusability With Props

Okay, so let's now make

our component really flexible and reusable

by defining a nice public API for consumers to use it.

So right now, our component is quite unflexible

and, therefore, not really reusable.

So, it might maybe be useful

in one very specific case

where we want the component to look and behave

exactly like this, but it won't be useful

for many other consumers.

So, if we imagine that we want to reuse this component

in many other applications,

or maybe even publish it to NPM to share it

with all React developers around the world,

then they will probably not find this component

very useful right now.

So those developers, or in other words, those consumers,

they will probably want to define things like

the colors of these stars

or maybe the sizes of the stars and the text

in order to basically make this component fit

into their own applications.

And so, what we're gonna do now is to try to define

a good public API for this component

just as we learned before.

And so, by doing that, we will try to find that balance

of using too few props and using too little props

so that the component also doesn't get way too complex.

So, let's get to work, and let's actually start

with those two simple things that I just mentioned,

so the color and the size.

So, let's just write it here,

color

and size.

And as I mentioned also in the last lecture,

it's a good idea to provide default values.

So, we already learned that we can do that

by providing the default values during destructuring.

So, just like we did with the max rating.

And so, let's say that our default color

will be this yellow of fcc419,

and the default size,

let's make it the number of 48.

Okay, and now, let's use these props in our component,

so, to basically accept the color and then change the stars

and the text to fit that color.

And the same for the size.

So, I want to start with the text.

And so, now I actually need to take this object here

back into the component because now we will specify

some properties which will depend on the props.

And so the props are, of course, only accessible

inside the component.

So, then this object will have to live

inside the component as well.

So, the color property will be set to color,

and so, we can actually just do it like this.

And if we give this to save,

then you see the text does indeed turn yellow.

Now, it might be a bit small,

and so, let's now also use the size,

and so, let's use a template literal

and then use the size that we received as a prop

and set the pixels to that.

Well, that's (laughs) maybe a bit too large.

Let's try to divide this, for example, by 1.5

and that looks a bit nicer.

All right?

And now we should also use these values here,

of course, for the stars themselves.

So, to do that, we will also now place this style object

inside the star, and then we need

these values also here.

So, the color and the

size, and so, of course, then we need to pass them

in here as props.

So color

and color

and size

and size.

And so, then here, we can,

again, create a template literal,

get the size, and then pixels.

Let's do the same for the height.

And here, nothing changed because

we already had 48 here,

and now finally, the color is actually defined

right in the svgelements.

So here, we have to fill and a stroke of black,

which is the reason why these are currently black.

But if we change that here,

like this,

so color,

then you see that they just turned yellow.

Now, of course, this other one isn't yellow yet

because, well, it is still at black,

so let's change that here as well.

Okay,

beautiful.

So, that's already a lot nicer than before.

Let's just call another component here,

and let's define

some other size here.

Let's say 24.

And so here we have a much smaller component

but which still works in the same way.

And, of course, we can also specify the color,

let's say red,

and so, with this we just made our component

a lot more flexible.

So, if someone wants to use this component in an application

where the main color is red,

then they can now easily change all of this to red.

Now, sometimes consumers or users of the component

want to have even more control over the styling.

So, sometimes it's a good idea to allow users

to pass in a class name.

So, for example, a class name with the name of test,

just in this case,

which will then come from some CSS file in the application

where this component is being used.

So right now, we don't have any class like this,

but this is just really for testing purposes.

So, then here, we need to

accept the class name,

and by default, it will just be an empty class name,

and then, we just edit here to the overall container.

So class name

and then, class name like this.

So, for example, if the user wants to somehow change

the font style, they can do that right inside

this class name that they pass in,

and so, that class name will then be added here.

It will then change the font family of our component.

Now, another thing that I sometimes see on the web

when we have a component like this

is that instead of just displaying the rating number,

is that they display, like, some message

according to the rating.

So, in order to do that, we could pass in an array,

and let's actually do that here.

So, we could pass in an array of messages,

for example saying

that the first value is terrible,

the second one is

bad.

Then we have, okay,

good,

well, as a string, and then amazing.

And so, now we can display these five values here,

so these strings, instead of the numbers.

So that's another nice touch

that we can give our component here.

So then we accept that prop here,

and by default, let's make it an empty array.

So really, really important to always give default values.

And so, now here, we can use those values.

However, we want, of course, to only use that messages array

in case that there actually are some elements in there.

And also the number of elements should be correct.

So, for example, if we allow for a rating

between one and five, but then we only have three elements

in the array, then that doesn't make a lot of sense.

So, this wouldn't work.

And so, here, what we can do

is to just check if messages.length

is equal to the maxRating.

And if that is the case, then that means

that a messages array was passed in.

And if not, then we just do exactly what we had before.

But in this case, let's then just display the messages

at position

rating-1

in order to convert back to zero-based index.

And of course, we should also consider the temporary rating.

So let's actually just copy what we have here,

or maybe not, (laughs) okay.

It's not that similar.

So let's come here and say

if there is a tempRating,

then use

tempRating-1,

and if not, then just use the regular rating, -1.

So again, if this looks confusing,

then just make sure to pause the video

and analyze that code, but this is just normal JavaScript

at this point.

But anyway, as you see, this works great now.

So, one star means terrible, bad,

then it starts to become, okay, good,

and finally amazing.

And, of course, it also works

with the not temporary rating,

so at the fixed rating.

While here at this other component

where the messages array is empty,

so that's the default here,

so here it's empty, and so, therefore,

we are still displaying just the number.

Great, and let's keep going because there is still

at least one important thing missing

and that is to allow the consumer to set a default rating.

Okay, so that's not very hard.

So, let's say, for example,

that the user wants to start with a default of three,

defaultRating

should be three.

So, the consumer might want to specify a prop like this.

And so, let's now

then add that prop here

and give it a default value.

Now, by default, the rating should be zero,

which is exactly why that's what we put here, right?

And so, the default rating

should be just that, zero.

But of course, now we need to use this defaultRating,

and we will use it right here instead of that zero.

So basically, we will initialize our rating state

with whatever default rating comes into the prop.

And if that prop is not specified,

then that's simply exactly the zero that we had before.

Now, maybe you heard or read that we should never initialize

state from props.

However, this is only true if you want the state variable

to stay in sync with that passed in props,

or in other words, if you want the state value

to update in case that the prop value is also updated.

However, that is clearly not the case here.

So, we are really only using this defaultRating here

basically as seed data,

so really just as the initial state,

and we don't care whether this value here

maybe changes somewhere else in the application,

so outside this component.

And, therefore, this is perfectly fine and normal to do.

All right, so it's really no problem to initialize

your state based on a prop.

So I just wanted to address this point

because I could already hear some people complaining

about this.

So this was more relevant in the old days of React

before we had hooks, but now,

that's really no longer a problem.

But anyway, as we save this now,

you see that immediately we see the three ratings,

or the three stars, as the default here.

And, of course, if this was one or two,

then that's what we will see there.

And so, again, that's just because we are now using

this number two as the initial state value of our rating.

All right, and now we could keep going here, of course,

and add a lot more different props,

so, allowing for a lot more configuration.

For example, we could say that

we want the colors here to change according to the rating,

or we could allow for some different spacing

between the stars.

We could also allow the consumer to specify on

which site this text label here appears.

So maybe they want it on the left or at the top

or at the bottom here,

but that might be going a bit too far here

and maybe specifying too many props

and adding too much complexity.

So I think that what we have here right now

is more than enough, except for one important thing

that we are still missing right now.

And that thing is the fact that the consumer

might actually need this rating state

outside of this component.

And to exemplify this, let's come again back here.

And what I want to do now, just temporarily,

is to create a new component right here, let's call it Test,

and so, this component

is, then, the one that will include the star rating.

And let's say the color in this case is blue.

Why not?

And then let's also include that down here.

And you will see why I'm doing this in this way in a minute.

Now, okay, so here we have another one and the blue one,

but now let's say that for some reason,

they also really needed

to display this rating

somewhere in their user interface.

So, for example, they might have a paragraph

saying, "This movie

"was rated

"X stars."

So, here, that's actually already used a maxRating of 10.

And so, now what they want to happen is that whatever rating

we specify here should then be displayed right here

in the user interface.

So, now it should say here that the movie was rated

seven stars.

So, how will they do this right now?

So, they basically need access to the state,

so to this rating state that we have inside the component

but right here, so inside of the test component.

So, what they need is some state.

So, let's say, "movieRating,"

and setMovieRating,

and then useState,

and let's again set it to zero.

And then here, let's use

that movie rating.

But of course, this now will not change at all

when we rate the movie right here.

So, we need a way to update this state here

whenever the state inside this component is updated as well.

So how do we do that?

Well, basically, we want to give the consumer

of this component the ability to pass in a set function.

So, basically, we want them to allow to specify

an onSetRating

handler.

And so, in this case, what this component wants to pass in

is simply this function right here.

Okay, so let's now specify, then, this prop here.

So you want to accept this very important prop right here.

And this one by default doesn't need any

default value

now, right?

And now, it's very simple.

All we have to do here is, on the handle rating,

is to not only set the internal rating,

but also to basically set the external rating.

So, we can now just say onSetRating.

also set that external rating.

And with this, we now gave the outside test component,

basically, the ability to get access to that internal state

right inside this component.

Okay, and now, if we change this here,

you see that it did, indeed, get updated to seven.

So, this additional configuration,

so this final prop that we updated here,

or that we actually added here to our component,

was really, really important

because without this, this component would really just be

presentational in the end.

I mean, it contains some state internally,

but from the perspective of the test component,

we couldn't really touch that state in any way.

And, therefore, we couldn't use that state

inside this component, which then, again,

wouldn't make this component really useful.

Okay, so this was the final prop that we edit,

and as I said, we could keep going

and get really crazy here

with our configuration options.

And you could, of course, if you wanted,

allow some other things such as the ones

that I have mentioned earlier.

But we will just leave it as this because I think this,

right now, is a pretty good balance.

Now, there's just one final thing that we need to do here

in our component, which is to prevent the user,

basically, to pass in some values that we do not want.

So here, for example, this shouldn't be a string, right?

'Cause, well, (laughs) then this wouldn't work at all.

So we need to make sure that this is actually a number here.

And so, let's look at something called prop types

in the next lecture.

# PropTypes

To finish this component, let's now

add type checking to the components props using proptypes.

So with proptypes, we can basically specify the type

of value that we expect the consumer

of the component to pass in for each of the props.

For example, we can define that this max rating

here really must be a number and nothing else.

And this is what we call type checking.

So again, checking each type of the prop

and specifying what type they need to have.

Now, if you really care about this, you should actually just

use TypeScript instead of JavaScript.

Now I will show you how to use react built

in proptypes because it actually does make a lot

of sense for this reusable component,

but I will not do this in the rest

of the course for all the components that we're gonna build

because that just takes too much time

and also developers these days don't really do this anymore.

Again, if this is really important for your app,

you can just use TypeScript instead of JavaScript

which is what many teams

and many developers started doing again instead

of using proptypes.

But anyway, let's now actually use proptypes

and for that we import the proptypes object

from the proptypes package.

So there's no need to install this proptypes package here

in this case because Create-React-App already comes

with this package pre-installed.

But we do need to import it here.

So just as we did here, because it is actually

a separate package from React itself.

Now, okay. And now in order to do the type checking,

let's use our component.

So that's star rating.

And then on this component

we specify the proptypes property.

And here it's important that we write it with a lower case.

So proptypes net then here we then assign

those proptypes an object.

So, again, we imported proptypes here with the capital P

but the property name here is with this lowercase p.

Okay. And now here for each of the props,

we can specify the type.

So let's say max rating.

And so that's exactly the name

of the prop that we have here.

And then now we actually use that proptypes object

that we imported in the very beginning.

And so now all we need to do is to use one

of the validators that is inside this object.

So here we can simply say proptypes.number, and that's it.

So let's say that here we import this star rating

and instead of specifying a number, we specify a string.

And so then here we get this problem or this warning here

which says invalid prop of max rating.

And that's because it has the type

of string instead of the expected number.

And it is these warnings right here that will then

allow other developers to catch bugs like this

because, I mean, no one would specify this here on purpose

but by mistake, we might end up here with a string.

So, for example, also this could happen.

So we could specify five here, but as a string

and then we would still get the same problem.

Now, the code does actually work with this here somehow.

So JavaScript is somehow able to coerce the types

into a number.

But, again, here we get this warning

because we really should specify this not as a string,

but as a number.

And so then, of course, this disappears.

Now, we can also chain the is required property here

which just as the name says

will then make this prop required.

So somewhere here, we probably have one without.

Yeah, so this one doesn't have the max rating.

And then immediately we get this warning down here.

All right, but in our case, we actually

have some default values

for all of our props already defined.

And so it doesn't make sense then to mark

any of them as required.

So by default, you shouldn't use this one.

So instead just use default values

for all or most of your props.

But, anyway, now let's keep going

and let's make this really complete.

So the default rating should also be a number.

Then the color should be a string.

And so we basically have one of these validators here

for all the types that we can imagine.

So this one is also a number.

Then we have the messages.

And so here we have PropTypes.array.

Let's see what else we have.

So we also have the class name, which is a string.

So here I wrote the wrong one.

So always use the uppercase proptypes.

And now finally, the onset rating prop.

So proptypes and this one is a func,

which stands for function.

Okay. And besides these two, we also have .boo

which stands for a boolean.

So if it's a true or false value,

and we also have object.

So in this case, we have none of these.

And so this one is just a function.

Okay. And that's actually all that we have to do.

And as you see here, adding proptypes is also a nice way

of documenting our components because this type

definition right here makes it really obvious what kind

of data we are expecting.

But as I said in the very beginning,

I will not start using this in all components from now on.

So this was mostly just to show you

that you can use this yourself

in case that you have some component like this

which you want to make highly reusable

across multiple applications

or even just inside one application.

And if at the same time you don't want to switch

to TypeScript, but in any case with this,

we finished our reusable component,

and we also reached the end of this section.

All we have left to do is one final coding challenge

to practice what we just learned here in the section.

# CHALLENGE #1: Text Expander Component

## starter

```jsx
export default function App() {
  return (
    <div>
      <TextExpander>
        Space travel is the ultimate adventure! Imagine soaring past the stars
        and exploring new worlds. It's the stuff of dreams and science fiction,
        but believe it or not, space travel is a real thing. Humans and robots
        are constantly venturing out into the cosmos to uncover its secrets and
        push the boundaries of what's possible.
      </TextExpander>

      <TextExpander
        collapsedNumWords={20}
        expandButtonText="Show text"
        collapseButtonText="Collapse text"
        buttonColor="#ff6622"
      >
        Space travel requires some seriously amazing technology and
        collaboration between countries, private companies, and international
        space organizations. And while it's not always easy (or cheap), the
        results are out of this world. Think about the first time humans stepped
        foot on the moon or when rovers were sent to roam around on Mars.
      </TextExpander>

      <TextExpander expanded={true} className="box">
        Space missions have given us incredible insights into our universe and
        have inspired future generations to keep reaching for the stars. Space
        travel is a pretty cool thing to think about. Who knows what we'll
        discover next!
      </TextExpander>
    </div>
  );
}

function TextExpander() {
  return <div>TODO</div>;
}
```

Welcome to another coding challenge

and I hope that you really are finding these useful.

And, if you do,

then it's now time to build a reusable

text expander component.

So, here, I have three of these text expander components

that we are going to build.

So, a text expander is basically

when we have some part of a text,

and then we have this kind of button here

that when we click it

will reveal the entirety of the text,

and then when we click it again,

it will go back to hiding it.

So, this one here is basically one

of the text expander components

and then here we have another one.

And, immediately, you see that this one has by default,

a lot more text.

And, then this button here has some different text

than this one

and also a different color.

But, then when we click it,

the behavior is exactly the same.

Then, finally, we have another one,

and you see that this one has some different styling

and also by default it is open.

And, so then when we click here, it will close.

So, let's go here to the starter code,

which as always I have attached as a link to this lecture.

And, if for some reason

you don't want to build this challenge here on Code Sandbox,

just copy paste the code from here

and also from the CSS file.

So, that's not a lot,

but we will still need that.

Alright, so, here,

I already have the three components included inside the app.

And, the component itself right now only renders this to-do,

and so, yeah, this here is your to-do,

so to build this expander right here.

Now, by including these three text expanders here,

I'm already giving you a hint into what the public API

of this reusable component will look like,

because here we already used many of these props.

And, so from this,

you can kind of imagine what each of them does

in order to achieve the three results that we saw here.

So, the challenge for you is to now actually go ahead

and implement this text expander

using everything that we have learned up until this point.

And, if for some reason this is a bit difficult,

then just imagine this as a collaboration

between you and me basically.

So, you build as much as you can on your own,

and then if you can't move on anymore at some point,

you simply watch the rest of the video

where I will then basically help you

completing this component.

And, if you want, you can of course

also go crazy with this one

and include even a lot more props

than just the ones that you see here.

So, you can...

Yeah, really do a lot of customization here if you want.

But, of course,

it's also more than enough to just do what we have here.

So, this is a really nice exercise,

which I hope you will complete, or at least part of it,

and then I see you back here with my implementation.

Okay, and let's get to work.

And, I will immediately start

by copying all these corrupt names here.

So, selecting them one by one, then copy,

and then I will just receive them here,

then, of course, just some commas,

and then we can get to work.

And, in fact, we are actually missing one,

which is basically just the text here.

So, of course, inside of the expander,

we need access to the text.

Now, this text is between the opening and the closing tag.

And, so what that means is that this is the children

of this component,

so it's gonna be inside the children prop.

So, to start, we can actually immediately render that here,

just so we see that this works.

And, indeed, here we get the three pieces of text

that we have right here.

Great, so we already have part of the output,

but, of course, we also want that button.

So, let's do that.

And, here, let's immediately allow the user

to pass in a class name.

So, in this last one here,

the user passes in this box class name.

And, so here we then accept that.

And, so then let's edit right here.

So, class name equals class name like this.

And, so this is exactly what we also did

in our reusable star rating component, right?

Now, in that example,

we didn't actually have a class name,

but now we have.

And, so immediately you see that this third one here

got this different styling.

Okay, now let's place this text here inside a span,

so that then we can add the button.

Alright, and now the text of the button

can actually be customized.

So, that is what we have the prop

of the collapse button text for.

So, let's get that, place that here,

and then we have some error.

So, let's see what's happening.

Now, we're not closing the span,

so that doesn't look too good.

And, so here we already have one button.

Now, here then we have this like kind of very small button,

which doesn't have any text.

And, so that's because only this second text expander

is actually passing in the text

for the collapse button text property.

And, so that's because this text here,

so this label of the button,

is different from the default.

So, if we take a look here,

then you see that, by default,

this one and this one display the text "show more".

And, so then this one here is different

and it says "show text".

So, yeah, this one here is show text.

And, here it is actually expand.

Okay, so expand button text should be by default show more.

And, so now here we have show more,

then this one that's different, show text,

and then again show more right here.

But, now, of course, we want something to happen

when we click on this button.

So, we want only parts of the text here to be visible.

So, we need some state, right?

So, let's call this is expanded

and set is expanded.

Use state.

And, then, by default, let's make it false.

So, by default, the text should not be expanded,

so we only want to see a small piece of the text, alright?

And, just make sure

that your use date was correctly imported.

Okay, and now let's use this is expanded state

in order to calculate or to compute the text

that we actually want to display here.

So, let's do that in a separate variable

and let's call it the display text.

So, if it is expanded,

so if expanded is true,

then we want all the text to be shown.

And, so that's then the children, right?

So, children is that text.

That's why we placed that here in the beginning, right?

But, if not, then we want something else.

So, let's just write test there just to experiment.

And, then we will, of course,

replace the children here with that display text.

And, so, by default,

now all three of them have this test here,

which is this part.

And, so, again,

that's because, by default,

this expanded is false.

Now, actually, if we take a look

at one of these components here,

then this last one will have the prop

of extended equals true.

So, right here, I don't have that.

So, I have this one,

but in the starter file that you will see,

I will not have this one,

but instead expanded.

Okay, so, again, in the starter file that I had here,

I had a mistake.

So, we had the wrong prop here,

and it's that we want an expanded prop,

and not this one.

So, here it's not button in line, but expanded.

But, in the code that you see,

this will already have been fixed.

So, the meaning of this expanded prop

is that if it is set to true,

then, by default, the component here will be expanded.

And, so that's exactly this third situation right here.

So, if we reload this one here,

then you see that the third text expander

is by default already expanded.

Okay, and so that's because expanded is set to true.

So, here, let's now actually not use false,

but really get this initial state from expanded.

And, so then we can set expanded to false by default.

And, so this is very similar what we also did

in our star rating component.

So, there we also set the initial state

based on one of the props, right?

So, by default, we now have this last one here

already opened.

And, so this one shows the entire text,

while these ones here for now only show test.

Now, another thing is that,

in this case that the text is expanded,

here, the text,

so the label of this button should be different.

So, it should be show less by default.

And, so let's do that here again as a default prop.

So, show less.

And, so, then here,

let's conditionally display that text.

So if is expanded,

then show the collapse button text,

and, if not, then show the expand button text.

And, so now it says show less.

And, so this other component here

will then show collapse text instead of show less.

So, because it passes in this special prop

that we have defined here.

And, if all of these props here

and all these default values here

look very confusing to you,

well, that's just because we are really trying

to make this component here very flexible and reusable,

so just like we did with our star rating component

When we build our normal components in applications,

we will not do this, right?

We will then usually have the text directly in here,

for example, instead of relying on the props

and on default values of those props.

But, again, here we are striving for maximum reusability.

But, anyway, let's now finally actually

make this button work.

So, specifying the on click prop.

Here, we just need a function,

and then let's say set is expanded,

and then the new state will be based on the current state,

so we use the callback function here,

and, instead of writing the entire word,

let's just say exp, which stands for expanded,

and then we just toggle that here.

Now, that's it.

So, let's see.

And, indeed, as we click there, the text is now hidden.

And, if we click on one of these,

then it will show the text.

And, again, it will then hide it.

Great, now, next up,

let's take care of not displaying the test here,

but instead displaying some actual part of the text.

Now, notice how here we have this prop,

which says collapsed number of words.

And, so here let's again specify a default,

which is 20.

But, of course, it could also be any other value.

So, the idea here is that, by default,

when the text is collapsed,

it will only display exactly this number of words.

So, only 20 words.

But, then you have, for example,

this component here,

which shows more words.

So, 20, this one should then actually be 10,

so that this one here shows in fact more words.

So, by default, only 10 words should be displayed.

So, let's do that.

So, this is just some standard string

and array manipulation.

So, we can simply split this string by the empty space,

which will then give us an array,

and then we can slice,

or, in other words, we can take all the elements from zero

all the way to collapsed number of words.

So, by default, we take the first 10 words,

so from zero to 10,

and now this is still an array,

and so we need to put it back to being a string.

And, then, we also want to add at the end these three dots.

Okay, and we could have used a template literal for this,

but we can also just add them here at the end like this.

So, that works the same way.

And, so, as we click here, it shows all of them them,

and otherwise it just shows exactly one, two, three, four,

five, six, seven, eight, nine, 10 words,

plus these three dots.

Beautiful.

So, that is already working.

Now, all we have to do is to take care

of the styling of this button.

So, let's again specify an object here.

Let's say button style.

And, then, background, set it to none,

also no border.

And, again, this is necessary,

because we want this component here

to be 100% reusable and standalone.

So, it cannot depend on any external styles.

So, let's also set a cursor to pointer.

Let's give it some margin on the left side of four pixels

or let's say six.

And, finally, we also want to give it a text color.

And, so this is where this button color prop

comes into play.

So, let's grab that and place that here.

And, now, all we have to do is to assign this here

to the style prop.

So, style, button style,

give it a save,

and beautiful.

So, now this button looks more like text,

but it is still missing some color.

So, let's by default add some blue color here,

which is 1F09cd.

Alright, and there we go.

So, the second one again is personalizing

not only these two texts here on the button,

but also the color and the number of words.

And, so that's why this one here looks quite different.

And, then, again,

this one here has this special styling here

that's coming right from our CSS file

in the form of this box class.

Great, so this is working,

and, in fact we are now basically finished.

So, this text expander component is now highly reusability

and it hides all the complexity from the user,

so from the consumer of this component,

which again is really nice and really important.

So, as the developer of this component,

then we chose the public API, basically,

and therefore allowed the user

to customize it to their needs.

And, as always, we could have gone really crazy here,

and, for example, allow the user

to place this button here in different places

like below, or on the left side,

or, here, right at the very beginning.

We could have allowed some more styling here

of the entire component.

Or, we could also allow the user to specify

whether they want to see these three dots here or not.

But, again, that's just not necessary,

because, with this, we found a nice balance.

So, this is the interface that we chose.
