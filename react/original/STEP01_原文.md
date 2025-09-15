# Section Overview

In this session,

we're gonna explore three core concepts

of building React apps.

Components, props and JSX.

So we'll learn how components are the building blocks

of React applications, and how to create

and reuse them using the powerful JSX syntax.

We're also gonna share data

between components using props and learn

about rendering lists, conditional rendering and more.

All while building this first beautiful project.

Along the way, you will start practicing React

on your own by building a developer profile card

using these fundamental skills.

Now okay, so let's go start this React journey right now.

---

# Rendering the Root Component and Strict Mode

Welcome to the Pizza Menu project

that we're going to build throughout this session.

And in this lecture, I actually want to start

to build this project from complete scratch.

And with complete scratch,

I mean that we are going to delete all

of these files that we have here that we don't really need,

and start a project from scratch, as I just said.

So let's close this one and this one

and even the index.HTML

which we will not delete and recreate, but all of these

feel free to ignore them and to delete them.

So delete, and let's start from scratch.

So here we have our first error

and notice that I placed the browser here on one side

and our code editor on the left side

so that we can always see the output at the same time.

So you see that our application is kind of looking

for this file right here,

but of course it doesn't exist anymore

because we just deleted it.

So, let's start from scratch.

And we're going to create our first file

inside of this folder,

and it's going to be called index.js, and it really

needs to be called index.js

because webpack,

which is the module bundler in this project,

expects the entry point to be called index.js.

All right?

But anyway, let's now start by importing

React

from 'react'.

And again, this is just simple JavaScript here.

So importing modules is part of JavaScript,

and specifically since ES6.

Then let's also import

ReactDOM

from

"react-dom/client".

All right?

And as I keep saving, somehow it keeps moving the file here

but nevermind.

So we just imported these two libraries, and again

remember how we imported basically these exact two

same libraries in the pure React lecture.

And in fact, I want to open up that file here

so that we can compare it.

So open,

and then on the desktop, pure React, then index.HTML.

And so remember here we import it, also React

and Reactdom, using these script texts.

But again here, these were installed using NPM

and here we are now importing them into our project

using the import syntax, which is coming directly

from JavaScript.

Next up, let's actually create our App component again.

So function App, and it wouldn't have to be called App

this is just a convention,

right?

What is necessary, is status component

starts with an upper case here.

So now let's return here,

again the same thing that we returned before

which is just <h1>Hello React!</h1>.

And now all we need to do is to render this to the dump.

And so once again

this is going to be similar to what we did here.

So we could even copy paste all of this here into our app

that we already have, but let's write it by hand.

So of course in the future we will not be writing all

of this by hand, but at least once

I want you to write all of this

by hand so that you actually know what is going on here.

All right?

So let's now create a so-called root.

And for that we use the ReactDOM library

on which there is a createRoot method.

And so now we select this root element.

Well not here of course, but in our public folder.

So here you have all this stuff

like this strange URL here.

And again, webpack will take care of all of this

like it will replace this URL right there.

But what we're looking for here is this div with this id.

So id="root".

So we are going to select this element so that

React can render our application inside of this div.

So document.getElementById.

Okay, and then let's do root.render.

And we could also have written it all in one line.

So without storing this here as an intermediary variable

but like this, it's a bit cleaner.

Okay? And then here we place our App,

give it a safe, and there it is.

Hello React!

Which is our nice app component right here.

So this is how we write React from scratch basically.

Now I just want to draw your attention that this is the way

that we render the root so that we basically render

our app in the Dom in React version 18.

So React v18.

But if you're seeing an older code base that is

before React 18, this worked in a different way.

So it looked a little bit different.

So let's just exemplify that here.

And you don't need to write this code here

I just want to quickly show it to you.

So before React 18, we would simply do

React.render

and then place the app in there.

All right?

And another change that we would have to do is

to get rid of this.

So this would be a React 17 app, but with these changes

so with having react-dom/client

and with rendering this way,

we made our app ready for React 18.

So we can now comment this one out,

and I will just leave it here as a reference.

Now, just one final thing that I want to talk

about here is strict mode.

So we can simply activate strict mode by, instead

of directly rendering the app component as a root component.

Wrapping this here into a strict mode component.

So let's write React.StrictMode.

And so this strict mode is basically a component

that is part of React and that we can take from React.

And so you see that automatically

VS code then closes this component.

So let's copy or cut this

from here and place it here, give it a safe.

And so the app is now wrapped inside of this strict mode.

And strict mode is really not a big deal.

The only thing that it does is that during development

it will render all components twice

in order to find certain bugs.

And also React will check

if we're using outdated parts of the React API.

So strict mode is nothing groundbreaking

but it's still a good idea to always activate it

when we develop React applications.

--

# Before We Start Coding: Debugging

From now on,

you will start coding on your own computer

and it's pretty much guaranteed that errors will happen

and that some things simply won't work.

And so, right off the bat,

I want to show you a few techniques

for dealing with these errors and problems.

So this is a really important lecture,

so please don't skip it.

So let's say that you're doing some change here in your code

and save it, and then you want to see the output.

But imagine that for some reason,

your page didn't update here.

So what do you do?

So when it happens, don't panic, but instead,

try out a few solutions, which I will tell you now.

And the first one is to make sure

that the application is actually running.

And believe me or not

this has actually happened to me before.

So I thought the app should be running

and I was doing some updates to the code,

changing something,

and I was wondering why the app was not reloading.

Then at some point,

I noticed that, well,

I actually hadn't even started the app.

And so this is actually something that can happen.

So if you don't have the app running, of course,

so if you didn't use "npm start" like I showed you earlier,

then, well of course your app cannot reload in the browser.

But if you're sure that it is actually running

but still not updating,

then one solution can be to stop the app and restart it.

So here is the tab in the terminal

where I currently have the app running.

And so in order to stop it, we use Control + C.

So on the Mac, that's Control + C

and on Windows it's also just Control + C.

Then on Windows I think it might ask you

if you actually want to stop

and then you can just type 'Y' and hit enter.

So with this, you have it stopped and then you can restart.

So that's then again "npm start"

which should then open up a new tab

and yeah, there we go.

And so

yeah, here it is.

And if I change something now

then it should be reflected immediately.

So, there it is.

And actually it's more common than you might think

that you have to do these kinds of things.

And that's why I really wanted

to include this lecture early on.

And what's also pretty common

is that sometimes all you have to do

is to do a hard reload here in the browser.

So just click this reloading button

because this automatic reload,

so the hot module replacement actually breaks all the time

for some reason.

And so then one of the solutions

is to just hard reload the browser.

Now another good tip that I can give you

is to always keep the terminal open here at all times.

And the same here for the dev tools

in the browser.

Well, it's not...

So inspecting, and then here that's a bit too big.

Yeah, then here, having the console open.

Also there's something called React dev tools

but we will talk about that a little bit later.

So it's good to keep these open

because then in case there are some unexpected errors

they will show up here in this console and also down here.

And also if you have this open,

you can always be sure that the app is running.

Can just maybe make it a little bit smaller

because, well, the window here is so small already,

otherwise, we almost can't see our code.

Now, I was talking about error messages before

and so sometimes these appear when you do something wrong.

So Create-React-App actually has some internal thing

which will automatically display errors right here on top.

So like on top on the window,

and also all of here. We show that to you.

So I will just write something here

which will create an error.

And so indeed we have the error here.

Well actually not here

but sometimes important errors do pop up here.

But we have this overlay over the entire app

which gives us this error message.

And so it's a good idea to then

take a look at this error message

and maybe try to understand what exactly went wrong.

So usually this first part here is not really important

but then here it tells us "adjacent JSX elements

must be wrapped in an enclosing tag.

Did you want a JSX fragment?"

And maybe if you don't really understand this,

you can just take this, copy,

open your new tab and google it.

And so this is now the power of React's huge community

because hundreds, if not thousands, of people

before you have had the same problem and have googled it,

or have like asked a question on Stack Overflow.

And so you will find your answer there.

So this one is a little bit older, I saw earlier.

So in

2016.

Yeah, so you should usually find something a bit more recent

like this one here from 2020.

But yeah, so here we are not trying

to solve a specific problem.

I was just mentioning that it's many times a good idea

to google these error messages right here.

So in this case, it's really not allowed

to return more than one element.

So here we are returning the h1 and the p

and that's not allowed in React, so just delete that

and then the error will disappear.

Another important tip is to always work with ESLint.

So ESLint is enabled by default.

For example, if you do this,

like const x = 'jonas'

and give it a save,

then immediately you get this warning here.

So then you can hover and it will warn you

that x is declared, but its value is never read.

And this is just one of countless examples

and situations in which ESLint can warn you

that you're about to do something

that you're not supposed to.

Because, if you have a variable that you're not using,

it means that probably somewhere else

you declared the wrong variable

that you actually didn't want to,

right?

And by the way, these problems,

they also appear down here in this Problems tab.

So this is also very useful down here.

So whenever you have some issue like this

so these yellow lines under some of your code,

you should probably check out what's going on there.

Now talking here about these tabs down here

sometimes the Prettier extension stops working

for some reason.

And when that happens

it's a good idea to come here to this Output tab.

And then here you can select

one of these processes that is running inside your VS code.

For example, as I was saying, Prettier.

So here it looks as if everything is working fine

but sometimes it will show you an error here

and then you can try to fix that.

And the same is true for ESLint.

So if you notice that ESLint

for some reason stopped working,

you can come here and check out if there is any problem.

So this here even looks as though there is some problem.

Yeah, there is an error here, but well, it still works.

So yeah, we don't need to worry about that in this case.

Okay? But let's come back to our terminal,

which is the one that we want open most of the time.

So, if everything looks correct in your code

and if you did everything that I told you

but still your code is not working,

it probably means that you have some bug in your code

because it is different than the one

that I'm showing you in the video.

And so in that case, the best thing to do

is to open up the final code for each of the projects,

so the one that we downloaded in the beginning

and then simply try to compare that with my code.

And doing so should then enable you

to find the bug that you have in your code.

And speaking of bugs,

actually, I introduced a bug here in this render part here.

So the way that we rendered before React 18

remember is this React.render,

but nowhere we are telling here

where to render the app component.

And so again, we need to select that root element

and actually place that here as a second argument.

So just to fix this here,

but again you are not going to write this yourself

but maybe you will work on an older code base at some point,

which uses an older version of React.

And so then this is how that project will render

the root element into your application.

And by the way,

you can see which React version you're using right here

in the dependencies array.

And so in this case, we are using React 18.2.

Or at least, I am.

So if you're watching this far in the future

then probably some other version has already come out.

But all of this, what we're talking about here

will of course,

apply to probably most of the future versions.

And that's actually it.

So that's the list of tips that I have for you

for dealing with problems that will sooner or later arrive

as you start writing your own React applications,

and even while you follow this course.

---

# Components as Building Blocks

So as I have mentioned a few times already,

React is all about components,

but now let's formally learn what React components are

and why they are so important.

So components are the most fundamental concept in React,

simply because React applications are, in fact,

entirely made out of components.

So when you look at any React app,

there's nothing that is not a component

or at least not inside of some component.

Therefore, I like to say

that components are the building blocks

of any user interface in React.

In fact, basically all React does is to take components

and draw them onto a webpage,

so onto a user interface, or UI for short.

Now that sounds simple,

but it's actually the main job of React.

In more technical terms,

React renders a view for each component,

and all these views together make up the user interface.

So we can also think of a component

as being a piece of the user interface, right?

Now, one key property of components

is that each component has its own data,

JavaScript logic, and appearance.

So basically, each component describes how it works

and what it looks like, which makes them such a great way

of building user interfaces.

And speaking of building user interfaces,

based on what we have just learned,

it makes sense that in React

we build complex UIs like this one

by building multiple components,

and then combining these components like Lego pieces.

So here we can identify components

like a video player, a menu,

this questions list, and also this part

where we can refine the displayed questions.

So those are like the big components,

but we can identify many other smaller components

in this UI as well,

like for example, these filters right here.

And what you can see is that this filter is

inside the refined questions component, right?

So actually one thing that we do all the time is

to place components inside of other components,

or in other words, we nest components inside each other.

So nesting components is a key aspect of using components

in React along with component reusability.

Now, notice how we have three similar questions

in the questions list,

and so we can create one question component,

and then reuse it three times here.

Now, of course, the data for each of them is different,

but we can easily pass different data

into different question components

by using something called props,

which we're gonna talk about later.

So whenever we need some duplication in our UI,

we create a new component,

and we use it as many times as necessary.

So as you can see, one crucial skill

that you will learn throughout this course is

how to break a design like this into its components.

Now, one thing that helps with that

and with analyzing the components that we create

is a component tree like this one.

So this shows the hierarchy

that exists between the components

that make up the user interface,

and it makes it really easy to understand

how all of these components are nested inside each other

and really how they relate to one another.

We can also clearly see relationships between components,

like the refined questions

being the parent component of filters,

or the other way around that filters

is a child component of refined questions.

And we use these terms, so parent and child component,

all the time in React.

And so it's important to understand what they mean.

And so a component tree like this is perfect to understand

these kinds of relationships between components,

and I think that this is all you need

to know about components for now.

We will go really deep into some important concepts

like reusability later, but for now,

let's start to put some of these concepts into practice.

---

# Creating And Reusing a Component

Let's continue building our application

by creating a brand new component

and by taking a first look at reusability.

But first, let's get the starter files for this project

from the files that we downloaded from GitHub.

So right here in the starter folder,

take these three, copy and then go into your project folder

and I will copy them for now here into the public folder.

So we have this folder of pizza images,

we have this starter data and this index.CSS

which we should probably move into this source folder.

So make sure that you have these two files here

after including the starter files.

And now let's come back here

and let's create that brand new component

that I was talking about.

So in React we write new components using functions.

So function, and I'm calling this one pizza

because it will contain some data about a pizza

and then here for now

we have no parameters to this function

and then the function body.

Now in React, there are two important rules

when we write components as functions.

First, the function name needs to start

with an uppercase letter like this

and second, the function needs to return some markup.

So usually in the form of JSX,

but we can't even return nothing, like returning null.

But here, let's just return some H2 element, for example

and then let's just write pizza.

So give it a save, but of course nothing will appear here

in the user interface, and that's

because we're not including this new component anywhere

and even ESLint is warning us about that here.

So this yellow line which says pizza is defined,

but never used.

So again, we're not including this pizza component

into our app component which is the component

that is currently being rendered on the screen.

So we can use our component here just like this.

So pizza

and then we immediately close the element like this.

This however will give us an error.

So right here, which we already saw before

and the reason for this error

is that each component can only return exactly one element,

not two elements as we have here.

So let's wrap this here into a div

and sometimes it can become a bit annoying

that VS Code automatically closes these elements for us,

but anyway, now we get our pizza in the UI.

And so that's because we now nested this pizza component

inside this app component.

And with nesting, I mean that we basically used

or caught this component here inside app.

What's very, very important to notice

is that by nesting, we do not mean

that we write a function inside this other function.

So what we should never do

is to nest the component declaration itself.

So like this, this still works actually,

but it's a very, very bad idea

for reasons that we will learn about later.

So never nest the function declarations,

but always declare all your components in the top level.

So just like this.

So again, when we say nesting components,

what we mean is that we call,

so we include one component into another like this.

Now, okay, so let's now make this pizza component here

just a little bit more interesting

and for that we are going to use our starter data here.

So let's open up data.js

and all we need is for is to select everything, then copy it

and then let's just paste it here.

Okay.

So as you see right now we are doing all the development

of this application in one big file.

While in the real world we divide our code into modules

and then include these modules into one another,

but here I just want to keep it simple

so we're not going to do that yet.

So actually we can then delete this data.js

and close this down.

So for now, we will simply use this here as an example.

So I will now copy, paste, let's say this pizza here

and use that here as the name

and then let's also grab the ingredients.

So let's just copy and paste all of this text

and notice that I'm really only interested in the text.

We don't need, of course, these quotes

because, again, this is just like writing HTML

and there you also don't need quotes, right?

So here, let's create a paragraph

and then immediately you see we get this red underline here

which is because, again,

we are trying to return two elements here

which is not allowed.

Okay, so here what I like to do

is to then move up this line here using a shortcut.

So let's see what that is for you.

So it's this move line up.

So you should probably get used to this shortcut

and this one so where we move lines up and down,

so like this for example,

so that's very, very helpful

and we're gonna do that all the time.

We just need to get rid of this semicolon that we have here,

which was right there.

Okay, so we have some text,

now let's also actually use this image

that we have in the public folder.

So yeah, this one right here.

So remember how I mentioned in the beginning

that all the assets of the app

will go into this public folder because Webpack,

so the module bundler will then basically

automatically get them from there.

And so we can now write an image here.

So again, just like HTML,

and then if we write a path to the image like this,

spinaci.jpg,

then Webpack will automatically get that here

from this folder and let's see if that works.

And indeed, there goes our image.

Now we get these yellow underline here

and that's because an ESLint rule

which says that images always should have an alt prop.

So let's just add that here.

So to make it a little bit more accessible,

let's just put the name of the pizza here

and then ESLint is happy.

So we have this component here

and now let's talk about the idea of reusing this component.

And for now, all we're going to do to reuse this component

is to basically use it several times.

So let's do three times just so you can see

that now this piece of UI, which is the pizza component,

will be included three times.

So three times this delicious spinach pizza.

Nice. Now of course the data here in all of them

is now the same because we didn't customize that data yet,

but we will do that later of course,

when we talk about props.

For now,

I just want you to get this really important concept

that we can call each piece of the UI

or in other words, each component multiple times here

in order to reuse it

and that's a fundamental concept

of writing React applications.

Now, just one final thing here,

and this has nothing to do with code,

is that maybe you have noticed

that we get all these colored lines here in the sidebar

and even down here.

Now the reason for this is that when we create a new project

with Create-React-App,

it will actually automatically set up this project

as a GitHub repo.

That's why you also get all these different colors here

and also here you see all the changes that we have made

to the different files.

So here we deleted some stuff, we modified some stuff,

and here these images are still untracked.

Now, since we're not really going to use GitHub

as we build these small projects,

I actually just want to remove these colored lines here

from the gutter, so from this place,

and for that we can go to our settings

and then just search for diff decorations.

So here the default is all, so let's set it to none.

And so then our editor will look

just a little bit cleaner here,

and we can close down the sidebar

and with this, we finish this lecture

and are ready to move on.

---

# What is JSX?

We have written some pieces of JSX

in this course already but what actually is JSX

and why is it such a big deal in React?

Well, when we first talked about components,

we talked about how a component contains its own data,

logic, and appearance.

And that makes sense, right?

Because if a component is a piece of the user interface,

it means that we must be able to describe exactly

what that component looks like.

And so that's where JSX comes into play.

So, JSX is a declarative syntax that we use

to describe what components look like

and how they work based on their data and logic.

So, it's all about the components appearance.

In practice, this means that each component

must return one block of JSX,

which React will then use to render the component on the UI.

Now, looking at this code,

this JSX looks a lot like HTML, right?

But in fact, JSX is an extension of JavaScript,

which allows us to combine parts of HTML, CSS,

and JavaScript all into one block of code.

So basically, we can write HTML and embed some pieces

of JavaScript where necessary, for example,

to reference some JavaScript variables

and we can even reference other React components

so that we can then combine Nest

and reuse multiple components.

But now, you might be thinking

if React is a JavaScript framework

then how will it understand this HTML looking code?

Well, remember that JSX is just an extension of JavaScript,

which means that there is a simple way

of converting JSX to JavaScript.

This is done by a tool called Babel,

which was automatically included

in our application by Create-React-App.

And the result of this conversion looks something

like this code on the right

where each JSX element was converted

to a React.createElement function call.

And does this look familiar?

Well, I hope it does

because this is exactly what we returned

from the app component in the pure React lecture.

So in that lecture where we couldn't use JSX

because we didn't have that Babel tool.

But anyway, this conversion is necessary

because browsers of course, do not understand JSX.

They only understand HTML.

So behind the scenes, all the JSX that we write is converted

into many nested React.createElement function calls.

And these function calls are what in the end,

create the HTML elements that we see on the screen.

Now, what this means is that we could actually use React

without JSX at all.

So, we could just manually write

these createElement functions instead of JSX

but that doesn't look like a lot of fun, right?

It also makes the code really hard to read

and to understand.

And so, actually, everyone just uses JSX.

Alright, so now that we know what JSX is all about,

let's go back to that first paragraph where I say

that JSX is a declarative syntax.

So, what does it actually mean that JSX is declarative?

Well, before we can understand what declarative means,

we first have to review what imperative means.

So when we try to build UIs using vanilla JavaScript,

we will by default use an imperative approach.

This means that we manually select elements,

traverse the DOM, and attach event handlers to elements.

Then each time something happens in the app

like a click on the button,

we give the browser a step-by-step instructions

on how to mutate those thumb elements

until we reach the desired updated UI.

So in the imperative approach,

we basically tell the browser exactly how to do things.

However, doing this in a complex app

is completely unfeasible

for all the reasons that we have learned about before.

And remember that that's the reason why frameworks

like React exist in the first place

and it's why React chose to use a declarative approach

to building user interfaces.

So, a declarative approach is to simply describe

what the UI should look like at all times,

always based on the current data that's in the component.

And we will soon learn that this data is props and state.

And so again, basically, we use JSX to describe the UI

based on props and state.

So the data that's currently in the component

and all that happens without any DOM manipulation at all.

So, there are no Query selectors,

no ad event listeners, no class list,

no text content properties anywhere to be seen here

because in fact, React is basically a huge abstraction away

from the DOM, so that we, developers

never have to touch the DOM directly.

Instead, we think of the UI as a reflection

of the current data and let React automatically synchronize

the UI with that data.

So in essence, the difference between imperative

and declarative is that in the declarative approach,

we use JSX to tell React what we want to see on the screen

but not how to achieve it step-by-step.

React can figure that out on its own, basically.

And this has many, many advantages

as we will see throughout the course.

---

# Creating More Components

So with our new knowledge about JSX,

let's now create a couple more components

to keep building our application.

But before we do that, this is probably the perfect time

to show you the application as it will look like

after we are finished with this section.

So basically, we have this header here

with the name of a pizzeria.

Then down here we have the menu,

and then basically here we have some kind

of footer letting the user know

that the restaurant is currently open, and this button,

which of course doesn't do anything once we click it.

So, here is like the heart of this application,

which is the display of these six pizzas,

and notice how we already kind of displayed this pizza here.

And so here you see that we are going

to reuse this pizza component six times

in order to print these six pizzas.

All right?

But now, what I want to do in this lecture is

to basically focus more on these bigger layout components.

So, let's create one component

for each of these three big parts.

So, one for the header.

So, a component called Header,

and we can leave this empty for now.

We are just building out here the structure.

Then, one for the menu,

and then one for the footer.

And here, I'm always missing the parentheses,

so that's not good.

Yeah, nice.

And just by the way,

we could of course also write these functions

as function expressions and arrow functions.

So, we could also do const, let's just call it test,

equal function like this.

Or even simpler, it could be an arrow function.

So if you prefer these types of functions,

feel free to use those,

but I always like to use the regular function keywords

as I have been using.

But anyway, let's now return something from here.

And so here is where we write that name of the restaurant,

which is Fast React Pizza Company.

All right, and here we can now use this component instead

of this h1.

And again, we include it here

as if it was just any other HTML element,

and so that's the beauty of JSX.

So, it changed to Fast React Pizza Co. right here now,

and let's next up create a footer.

And here let's actually play around a little bit

with JSX and with create element.

So using the knowledge that we gained

in the previous lecture,

let's instead of immediately returning to JSX,

return a create element call.

So, React.createElement,

just so you can see how

bad it would be to write components this way without JSX.

So we want to return an HTML note, so an HTML element,

named footer.

Then here, the second argument is null

because it is for props,

and then here is the child element.

So here, we just want some text.

Let's say.

Anteriors must actually be a string now.

We're currently open.

And now, of course, we need

to then use the component here in the app.

So that's footer, close it immediately.

And let's check it out down here.

Yeah, there is our footer.

We can see that also here, at least if we had some space.

Yeah, so in the body we have, of course,

our root, where the entire application is rendered.

Then we have this div right here, which is this one.

So coming from the app component,

and then we have here the h1, which is this one here,

and then these three divs, each for one pizza,

and finally the footer that we just created.

So of course, here in the actual HTML

we will no longer see the name of our components, right?

Because once React renders everything into the dom,

it only renders the h1 element itself.

So the dom doesn't know that this h1 is actually coming

from this header component and that these divs,

for example, are actually coming from a pizza component.

This webpage that is now being rendered here

has no idea about any of that.

Okay?

But anyway, going back here to our footer,

let's now just comment this out,

and then return what we actually want to return,

which is, for now, actually the same

but written in a nice way.

So we're currently open,

and now let's actually enter JavaScript mode here.

Why not, just to do some JavaScript in here,

and let's just display the current time.

We actually did that before.

So, just create a new date,

and then .toLocaleTimeString.

All right.

And so down here, we see that right now

it's this time we're currently open.

Nice.

So, this is the power of being able

to combine JavaScript basically right into the HTML.

So, just as we learned in the previous lecture.

Now finally, we have the menu here.

And what do we want in the menu?

Well, let's start by adding an h2 here,

just saying our menu,

and then let's actually place our pizzas here.

So, these pizzas should actually be part of the menu.

So, let's do that.

You can just write pizza, but then of course,

React is not going to be happy about that,

because remember each time that we write one piece of JSX,

that JSX can only have basically one root element.

All right.

So, let's remove all the pizzas.

So, I'm cutting them and place them here.

And now they are gone from here,

because we didn't include the menu yet.

So, let's quickly do that.

And there we go.

So we have the same result as before,

but now our components are even more nested.

So all of this here is the app component,

and then inside the app

we have the menu component nested into it,

and then inside the menu

we have these four pizza components.

And so, now you really start to see this idea

that we built complex user interfaces

by combining small components into bigger ones.

So, we have these really small pizza components,

then we combine a couple of them

into one slightly bigger component,

which is the menu, which we then combine with header

and footer to create the overall big app component.

---

#  JavaScript Logic in Components

Let's now take a quick first look

at writing logic inside of React components.

Now we have already written some JavaScript logic before

but we always did it just inside DJSX that is returned.

So just like here, right?

But since components are just JavaScript functions,

we can of course do any JavaScript in them that we want.

And that code is then simply executed

as soon as the function is caught.

So as soon as the component is initialized.

So for example, here,

we can create any new variable that we want.

Let's say hour, and here I will again create a new date,

and then let's say getHours

and then we can log that to the console.

And now we're going to use that snippet

for the first time that we set up earlier.

So here we can just write cl, hit Enter, and then hour.

So, let's check out our console,

and so here, yeah, we have the number 9.

So that's currently the hour

and now what I want to do here

is to basically display an alert in the app

whether the restaurant is currently open or not.

So, let's define a few more variables for that.

So open hour,

so let's say that the pizzeria actually opens

at 12:00 PM and closes at 10:00 PM

so that's 12 and 22 for the close hour.

So closeHour = 22.

And so now again, we can use any JavaScript in here.

So let's just write a simple ifelse statement saying

that if the hour is greater or equal, the open hour,

and the hour is less or equal the close hour,

then just alert "We're currently open!"

So alert is just a built-in JavaScript function

so that you should be familiar with.

Maybe we'll just use this here as a demonstration

that we can write some simple JavaScript in here.

So alert, "Sorry, we're closed".

And here we need some double quotes like this.

And here we have some bug.

So probably JavaScript wants us

to include the semicolon here.

And there it is.

So "sorry, we are closed",

and that's because right now it is nine in the morning

and you saw that it happened here twice.

And that's because of the strict mode

that I was telling you before.

So in strict mode, our components are usually rendered twice

and so that's why we got that alert twice as well.

Now, if we change the open hour here,

let's say to eight and re-render,

then it says "We are currently open!"

All right, now, this alert function

is actually blocking JavaScript.

And so that's why it runs in the beginning

but nothing else happens.

And so of course this is really not ideal,

and we wouldn't use this in a real app,

but this was just a short demo here anyway.

So let's just comment all of this out

and just to use this code here

because it will actually become useful later.

Let's create a variable here called isOpen.

So that will then simply become a true or false value

depending on whether this condition is true or false.

Let's lock that then to the console, like this.

Wow, what's happening here?

Yeah, that's better.

And you see that right now it's open.

Let's set that back 12th, and there we go.

---

# Separation of Concerns

At this point,

we have used JSX to describe the appearance

of some components

and we have also used some JavaScript inside of them.

And so now that we have a tiny bit

of experience in writing components, I want to take a minute

and go back to the fact that JSX combines

HTML, CSS and JavaScript into one single block of code.

Because you might be wondering,

why did React come up with this idea in the first place?

So why not just keep HTML, CSS and JavaScript

in separate places, like we have always done before?

And this might sound like a trivial question,

something you think is not really relevant at all

but it's actually deeply relevant to understand why

React was completely designed around components.

And let's understand this topic from the very beginning.

So from the rise of interactive single page applications.

So before single page apps, we always had one file for HTML,

one for JavaScript and one for CSS.

So basically, one technology per file.

That was our traditional separation of concerns.

And I'm pretty sure that just like me,

this is how you first learned web development.

However, as pages got more and more interactive,

they became single page applications,

where the JavaScript started to determine the user interface

and the content in general.

Or in other words,

JavaScript became more and more in charge of the HTML.

And we can see that here in this really small code example,

where the content and the presentation of these

HTML elements are really completely determined

by the JavaScript code.

They are in fact tightly coupled together.

So the HTML doesn't even make sense

without the JavaScript here.

Now the details of this code are really not important.

So if you can't read this code, that's no problem at all.

My point here is, that if the JavaScript is in charge

of the HTML anyway, so if the logic and the UI are so

tightly coupled together, then why should we keep them

separated in these different files

and in different code blocks?

Well, the answer to that question

is what gave us React components and JSX.

So the fact that logic and UI are so coupled

in modern web applications, is really the reason why

a React component contains the data, the logic

and the appearance of one piece of the UI.

In fact, it's the fundamental reason

why React is all about components.

And the same is actually also true for

most other modern front-end frameworks.

Now returning to some code,

in this React example we can see how JavaScript

and HTML markup live very happily together

in this one single component.

So this component has some JavaScript logic,

it has JSX and then inside that JSX,

there is yet another block of JavaScript,

which in turns has even more JSX inside of it.

So everything is mixed together

but it all still works really well.

So content and logic are tightly coupled together

and so it makes sense that they are co-located here.

And co-located simply means that things that change together

should be located as close as possible together.

And in the case of React apps, that means that instead

of one technology profile, we have one component profile.

So one component that contains data logic and appearance,

all mixed together.

Now when React and JSX first came out a long time ago,

many, many people just hated the way that JSX looks like.

And they hated that we are throwing separations

of concerns out of the window.

But actually, are we really?

Is there really no separation of concerns in React?

Well, I think that the people who say

that React has no separation of concerns, got it all wrong.

Because React does actually have separation of concerns.

It's just not one concern per file,

as we had traditionally but one concern per component.

So each component is in fact,

only concerned with one piece of the UI.

Then within each of these components,

of course we still have the three concerns of HTML,

CSS and JavaScript all mixed up, as we have been discussing.

So compared to the traditional separation of concerns,

this is a completely new paradigm

that many people were really not used to in the beginning.

But now, many years later,

we all got used to this and it works just great.

So having all the information about a certain component

in one single place,

really does work in an amazing way.

Now right.

So this was a long lecture,

longer than I had expected,

just to arrive at this conclusion

that React does actually have separation of concerns.

Just a different separation of concerns.

But I still hope that you liked how we arrived

at that conclusion, over the course of this video.

Because hopefully, this gave you a lot

of additional fundamental React knowledge.

---

# Styling React Applications

So at this point, we know

that React components can also contain CSS styles.

And so let's now learn about some simple ways

of applying CSS to React applications.

So in React we have many different ways

of styling our components

and React doesn't really care about how we do that.

It doesn't have an opinion about styling.

And the reason for that is that just

as we learned in the very beginning

React is actually more of a library than a framework.

So it doesn't have a preferred way of how we should style

our components and in the end our applications, therefore

we can choose between many different options.

For example, we can use inline styling

we can use external CSS or even SAS files.

We can use CSS modules, styled components, or even Tailwind

CSS is an option to style our components.

Now in this lecture

we will not go into all of these of course

but we will talk about many of them later.

For now, I just want to use inline CSS

and then also later include an external CSS file.

So as you might know, in HTML

we can actually style elements using this style attribute.

So just like this.

And then in HTML we write those styles

in a string like this.

However, in JSX, that's not how it works.

So in JSX, we actually need to define inline styles

using a JavaScript object.

So if we need to write a JavaScript object

we first need to enter JavaScript mode.

So that's what the curly braces are for.

But then we need another set of curly braces.

And so that is again, to now create an object.

And so here we can now define some properties.

So let's say we want to style this text

so this H1 text with a red color.

And so now as I give it a save, there it is,

there it changed.

And so with this, you have the easiest way.

So the most straight forward way to style components in JSX.

So simply using the style attribute that is also

available in HTML.

Now in HTML, we basically never ever use this

and that's because of the separation

of concerns that we talked about in the previous lecture.

So where we always had the CSS

in a separate file and never mixed together with the markup.

But here in React, as we just discovered,

doing that is completely fine and natural.

Let's try another one.

So now font size, which in CSS you would write

like this, right?

So font-size, but in JavaScript

that's not a valid property name.

And therefore all the CSS property names have

been converted basically in JSX to this camel case notation.

So you need to write font size like this.

Let's say 32 pixels.

And so since we're writing an object

then also this value always needs to be a string.

Now, well that didn't change anything.

Maybe that's already the size.

Let's see what happens with 48.

Yeah, so now it's bigger.

And let's try another one. Text transform.

And you see that as always vs code already

shows you here the available options.

So make sure to always write these property values.

Then basically here S strings, because again,

this is in the end just a JavaScript object

and you could even extract this out here.

So just cutting this, let's create a variable here.

Const style, and it could be any variable name of course.

Then let's place that here.

And it all still looks the same.

Great. So this is the easiest way

of adding some styling to individual components.

However, when the application gets just a little bit bigger

it can get out of hand

and can be a lot of work to write our styles like this.

So like creating an object

for each of these components, it's perfectly doable

but you don't see many people doing that in the real world.

Now one thing that we can do is to actually

include an external CSS files just

like we have been doing all the time in our applications.

And so that is the easiest way I would say to

style React applications, which is basically the same

as styling any other webpage.

Now in that case we're not really mixing DCSS concern

with the JavaScript and HTML concerns

in the way that we learned in the last lecture

but that's of course not a problem.

And also we will learn how to do that a little bit later

again, using something called styled components.

But for now, let's take a look at the CSS file

that we included here in the very beginning of this lecture.

And so this is, well

a very pretty standard CSS file with some classes here.

And so now we need to add these class names

to the JSX elements so that these classes then get applied.

So let's go back and before we do any of that,

so before we add the classes

we need to first import this CSS file.

So right now our application has no way

of knowing that the CSS file exists in the project.

So what we need to do here is to simply import that file.

And so once again

it is actually web pack that will take care

of then taking the styles out

of the CSS file and injecting them into our application.

So index dot CSS.

All right.

And you see already things changed here.

So the background color is different

the font family has changed.

Yeah, for now, think that's all.

And we also get this nice yellow border

at the bottom of the page.

So you see that immediately web pack

included these styles now in our application now, okay,

but now let's add the classes.

So you see that we have one container

we have a header, we have menu, and we probably have footer.

Yeah, so just very straightforward.

So here, let's add the class of container

and let me first do it in the wrong way.

So I will just write class as we would do in HTML

but then React will actually warn us.

So you see here, Invalid DOM property class

did you mean class name?

And so this is one of the important rules of JSX.

So in JSX we cannot use class, but instead class name.

Okay?

So this is a common beginner mistake, but now

you have been warned it still does work here somehow

but we are really not supposed to use class in JSX.

Now that's probably because class is already

a reserved keywords in JavaScript.

Okay, but let's keep going here.

So again, let's add last name here of header.

Alright? And now this didn't really change a lot

and that's because we still have this style here applied.

So we probably don't want that.

And so just to keep this here

I will duplicate this one, comment it out

and then I will just make this an empty object.

Well, and that didn't really change a lot

and I know why that is.

It is because here we are actually supposed to

have a header element first.

Alright? And so that class should go there.

So this is a little bit just of semantic HTML right here

or let's say a semantic markup where the header

element is a bit better suited here

than simply having the H-1.

And here we have some problem.

Let's maybe change something here very quickly.

So here we have this 12 rim of width.

Let's change that to four.

So that's a bit better, even though it's not perfect yet

because of course this page is very narrow, but nevermind,

we will fix that in a moment.

Next up here, let's add the class of menu.

And again, that's class name.

And then just a simple string.

So menu.

And here, since we were talking about semantic markup

let's actually use the main tag, so the main HTML element

and then of course we need to close it correctly as well.

Ah, beautiful.

So you see that.

Now we get this nice styling here on the menu.

Okay, next up we have this class name here

which will just be footer.

All right, so let's see what we get here

we have this weird styling applied to these titles

which is not supposed to be happening.

And so let's just make them H3 not H2.

Yep. And so here we have the footer.

Nice. So with this, we actually have some styling applied

to our application right now.

And as I mentioned, we are getting these styles now

from this external CSS style sheet, which remember we

simply imported here using this import syntax

which will make web pack import the styles

into our application.

Then here, remember that we used class name and not class

because class is a reserved keyword in JavaScript already.

And by the way, there are a few more JSX rules like this

which we will talk about a little bit later in this section.

For now, just notice that the styles that we included here

are global styles, so they're not scoped

to each particular component, and that's very easy to show.

For example, we could add the header class also here.

And while that looks kind of the same

let's try something else.

Let's add maybe the footer class also to the header.

Yeah. And again, it doesn't change a lot, but if

we inspect the element here, yeah, so right here, then

of course both of these classes here.

So all of these styles will be applied to this same element

and in the end to the same component.

And so again, each component does not really contain

its own styles but simply uses the global styles

that are in index.CSS.

And this works fine for small apps,

but we will also use something called styled components

later in another project.

And so then we will have CSS that really only belongs

to one single component.

---

# Passing and Receiving Props

It's time to introduce

yet another fundamental React concept, which is props.

And props is essentially

how we pass data between components.

And in particular, from parent components

to child components.

So we can imagine props as being

like a communication channel

between a parent and a child component.

So in practice, what we're going to do,

is to now customize each of these pizza components

that we have right here.

So, remember how we created the pizza component

which has this image, the pizza name, and the ingredients.

But right now all of the pizzas are the same

because, well, we didn't have a way of passing

different data into them to make each of them customized.

But now, as we learn about props,

we will be able to do that.

So, first of all, let's

grab our pizza component

and cut it from here and place it right after the menu,

just so we can see what's happening.

And then let's get rid of this repetition here for now.

So we only want this one pizza component here for now.

Okay, and so now it's time to pass the data

from this parent component here,

which is the menu in this case, to the pizza component.

So what we want to pass is basically this string right here.

So, the link to the image,

then the name of the pizza, and the ingredients.

So to define props, we do it in two steps.

First, we pass the props into the component,

and then second, we receive the props

in the component that we pass them into.

So, here is where we pass those props in.

And we write them just like this.

So, just as if they were normal attributes.

So,

pizza spinaci.

That's the first one.

Then, let's also define a prop for the ingredient.

And by the way, prop simply stands for property.

It's just a short for,

yeah, property.

Okay?

And then finally, let's say the photo or photo name.

And then let's grab this one here.

All right.

And maybe let's also pass in a price.

And for now, I will also pass it as a string

but I will show you something in a minute.

So for now, just write it like this.

Give it a save;

and then Prettier will format everything nicely like this.

And now we need to go to the second step,

which is to actually receive the props here

inside the child component.

So right now, of course, the component has no way of knowing

that these four props have been passed in.

So, the way we do that, is to accept a props parameter

here in this component.

And then for starters, let's just lock this props

to the console; and take a look at what's happening.

And, we already can see something here.

So, this props is basically this object right here;

and it has name, then pizza spinach, which is exactly this.

So, what happened, as React included this pizza component,

it basically called dysfunction in past

in this props object.

And this props object is made out of these four props

that we passed into the component.

And so now we can use this props object

to replace all of these values here.

Now, we need to take these values out of the object;

and therefore, we need JavaScript, right?

So here, this is no longer a string;

but we need to enter JavaScript mode again.

So, props dot photo name is this one.

And here, it is the name of the pizza.

And again, we need JavaScript mode.

So, props dot name.

The same thing down here.

So, props dot name.

And finally, down here, we want props dot ingredients.

Or actually, it's ingredient.

Let's fix that here.

Ingredients and ingredients down here.

Okay.

And of course, now everything still looks the same;

because the data that we had here before,

is exactly the data that we have here.

But now let's actually make some magic happen.

So, let's create another pizza component;

and then, this is where we will see why props are so useful.

So let's create a pizza funghi.

Let's give it some ingredients.

So tomato, let's say also mushrooms.

And this is not important here.

This is just to show you

that we can now fully customize our components.

Next, we can define the price.

And notice that I'm doing it now in a different order.

So here I had first a photo name and the price.

And this is just to show you

that the order in which we pass in the props

is completely irrelevant.

So, photo name is pizzas

slash funghi dot jpg.

Okay? And now we need to immediately close this component

just like before.

And as I save it, watch what happened here.

And there is our second pizza component

now with completely different data.

And so now for the first time, we have reused a component

and configured it in a way that makes each component unique

and display their own data.

Okay? And now let's just improve

this pizza component here a little bit.

So for starters,

in our CSS, we actually have a class name here.

So a class name called pizza.

Okay? And then let's also place these two here,

inside their own div,

so that this data can be displayed at the site of the image.

So just like here in our original.

So this is what we're going for.

So here we have a div,

and then again, I'm using that trick

where I simply push down that line.

And this is already looking a lot nicer.

Let's just finally also add the price here

and I'm doing that as a span.

So props dot price.

And there it is.

But now let's say that we wanted for some reason

to add a number here.

So we wanted to increase all the prices by three, let's say.

But watch what happens when we try this.

So all the prices plus three.

So, what happens, is that

React, or JavaScript, basically simply added the three here

to the end of this number.

And the reason for that

is that here we pass these numbers actually in as a string.

And we can see that also here in this output.

So we do not want a string here.

Instead, we want a number.

And so the way we can achieve that

is by entering again, JavaScript mode.

And so in JavaScript, this is now an actual number.

And so watch what happens.

Indeed, now we have 13;

which is the 10 we had before, plus three.

Okay? Then let's do the same thing here.

And that fixes this.

So, this is very important to notice

that whenever you want to pass in

something that is not a string,

you just use, again, this JavaScript mode basically.

Because, in fact, you can pass in anything as a prop.

So it doesn't have to be a string or a number.

You can pass in a race

or objects or even other React components.

So props is really really powerful

and really one of the most fundamental things in React.

And now to review this concept and to go even a bit further

let's move on to the next lecture.

---

# Props, Immutability, and One-Way Data Flow

So now that we already know what props are

and how we use them in practice, let's quickly review them

and even learn some important additional things about props.

So as we just learned, we use props in React to pass data

from parent components to child components.

So essentially to pass information down the component tree.

This means that essentially we use props to communicate

between parent and child components.

Therefore, props are an essential React tool

to configure and also to customize components.

So we can imagine props as settings that we

can use to make a parent component control how

its child component should look like and how it should work.

So in that regard, props are just

like arguments passed to regular JavaScript functions.

Also, we can pass anything into JavaScript functions, right?

And so the same is actually true for props.

So we can pass any type of value as a prop.

So we can pass single values, array objects, functions

and even other React components, which is a really

powerful technique that we will explore a bit later.

So those are the fundamentals of props in React

but now let's go dig a little bit deeper.

But before we do that, we need to first take a step back.

So at this point of the course, we have already learned

about the components appearance and its logic,

so by writing both JSX

and JavaScript logic inside components.

Now, I've also been saying since the beginning

of the course that React renders a component based

on its current data and that UI will always be kept in sync

with that data, right?

But now it's time to get a bit more specific

about what that data actually is.

So this data that React users to render a component is made

out of props and state

and actually there are even more types of data

but what matters for now are props and state.

Now, state is basically internal component data

that can be updated by the component's logic,

so by the component itself, while props

on the other hand is data that is coming

from the parent component,

so from the outside basically.

So it's the parent component who owns that data

and so therefore it cannot be modified

by the child component.

Instead, props can only be updated

by the parent component itself.

And this brings us to one of the few strict rules

that React gives us, which is that props are immutable.

So they cannot be changed, they are read-only.

And if at any point you feel like you need to mutate props

actually what you need is state

because state is for data that changes over time

as we will learn soon.

But why is that actually?

Why are props immutable in React?

Well, to start, props are just an object.

Therefore, if you change the props object in your component

you would also affect the parent component

because that's just how objects work in JavaScript.

So when you copy an object and mutate the copy,

the original object will also be mutated.

Now, if you change an object that is located

outside of the component function,

that function has then created a so-called side effect.

So in general,

a side effect happens whenever you change some

data that's located outside of the current function.

React, however, is all about pure functions,

so functions without side effects,

at least when it's about a components data.

So components have to be pure in terms of their

props and state, because this allows React to

optimize your application and it avoids some strange

bugs that can appear when you manipulate external data.

And in fact, we can extend this idea of immutability

to React development in general.

So a component should never mutate any data that

we write outside of its function scope

like in this example here.

And now to finish, it's important to understand

that React uses a so-called one-way data flow.

Now, what does that have to do with props?

Well, in simple terms, one-way data flow means that

in React applications, data can only be passed from parent

to child components, which happens by using props.

So in other words, data can flow from parents to children

but never the opposite way.

And therefore we have a one way data flow, so only from top

to bottom of the component tree.

Now, this may sound obvious to you,

but other frameworks such as Angular actually employ

a two-way data flow.

So if you know one of those frameworks already

this might be quite a change for you.

But there is actually a reason or multiple reasons why

React uses a one way data flow like this.

The first is that it makes applications way

more predictable and way easier to understand

for developers because it is just a lot easier

to understand where the data is coming from

if it only flows in one direction.

In a similar vein,

it makes applications way easier to debug,

again because we have way more control over the data

and we understand exactly how that data flows around.

And finally, two-way data binding is usually less efficient

so it's less performant to implement.

Okay, so that sounds great, but you might be wondering,

"What if I actually wanted to pass some data, for example

some state, up to a parent component?"

Well, there is actually a very clever way to do that

but as so often we will learn about that a bit later.

And actually in the next section, to be specific,

so it's not far away.

There are just so many moving pieces

in learning a whole library like React,

that of course you can't learn it all at once,

but trust me, you will get there

and then everything will fall nicely into place at the end.

---

# The Rules of JS

Many beginners get quite confused

when they start using JSX in their own code.

And in fact, JSX can be a bit tricky to understand

and to master.

But that's why I am here by your site,

helping you along the way.

And so let's quickly check out the rules of how JSX works.

Now, there are some general JSX rules

and there are some rules

about how JSX is different from HTML.

And starting with the general rules,

you should know that JSX works essentially just like HTML.

So it has a very similar syntax.

However, we can enter a JavaScript mode

by using curly braces anywhere in a markup

where a value, like text or an attribute is expected.

Now into this JavaScript mode,

we can place any JavaScript expression.

So anything that produces a value.

So we can reference variables, create arrays or objects,

we can loop over array using the map method

or we can use operators,

like the ternary operator,

what's not allowed, our statements.

So in JSX, you cannot use things like an if/else statement,

for loops, a switch or any other statement.

Now, what's super important to understand

is that a piece of JSX produces a JavaScript expression.

Or in other words,

a piece of JSX is just like any other JavaScript expression.

And this makes sense because we already learned

that JSX is simply converted

to a create element function call,

which is in fact also an expression.

Now, this fact has two important implications.

First, it means that we can place other pieces

of JSX inside the curly braces.

So inside the JavaScript note.

And again, this is only possible

because we can put any JavaScript expression

inside those curly braces

and that includes the expressions produced by JSX.

The second implication of the fact

that JSX produces an expression

is that we can write JSX anywhere inside a component.

For example, we can assign a piece of JSX

to a variable like in this code snippet.

We can also use it inside in if/else statement,

pass it into functions and many other things.

Finally, a piece of JSX can only have one root element.

So basically, one parent element.

If you need more than that, for example,

when you need to return two elements from a component,

you can use something called a React Fragment,

which we will talk about later.

Okay, and now let's see the differences

between JSX and regular HTML.

Now, I will actually not go through this entire list here

at this point because these are just some very simple,

straightforward rules,

which are best explored by using code.

But I still wanted to include this list

in this slide here, so that you can keep it

as a reference when you download these slides.

So again, we will encounter these rules

as we keep writing code,

which is exactly what we're gonna do now.

---

# Rendering Lists

Rendering lists is one of the most common things

that we do in basically all React applications.

You will probably do it like 100 times

throughout this course

and so let's now learn how to render lists in React.

But first of all, what do we actually mean

by rendering lists?

Well, basically rendering a list is when we have an array

and we want to create one component

for each element of the array.

So for example, here we have all starter data, remember?

So here we have an array of these objects

where each object is one pizza.

And so as you can imagine,

now we want to basically render this list.

So basically we want to take this array,

and for each of these pizza objects,

we want to automatically create one pizza component here

in our user interface.

So instead of calling or of using here

the pizza component manually one by one,

we want to do it all at once dynamically.

So if we have like four pizzas in the array,

then we want four components to be rendered.

But if we have like six or 10,

then we want 10 components to show up here in our app.

Okay, so let's now learn how to do this.

Now, the beauty of React is that for many things,

all we need really is the JavaScript knowledge

that we already have.

So for example, for rendering lists,

there's nothing new about React that we need to learn.

So it doesn't give us like a list element that we can use

or something like this.

All we need is the JavaScript knowledge

that we already have.

And in this case, all we need is the map method.

So let me show you how after all this talk.

So let's create a new diff here

and later we will convert this to an actual list element

but let's just start out with any element here.

It doesn't really matter which one.

And for starters, let's also comment out this code

right here and maybe you noticed here by the way,

that a comment in JSX is simply again

entering JavaScript mode so with these curly braces

and then this is just a JavaScript comment.

So this is one of the rules of JSX that was actually

in one of the slides

or actually in the only slide in the previous lecture.

So if you read that, then you're already familiar with this.

But anyway, let's now render our pizza list.

Let's remember, yeah, it's called pizza data.

So let's enter JavaScript mode here

and then let's take our pizza data,

which remember is just an array.

And then let's map over it.

So at map, we basically loop over this array

and create a brand new array.

So in this pizza data, each element is a pizza.

So let's do this and what we want in this new array,

so in the new array that will be the result of map

is for each pizza, a pizza component.

And now we can simply pass all of these props

in dynamically here.

Let's first close it like this.

So we can now say pizza. and I think it is name,

but let's check.

Yeah, so we have name, ingredients, price, photo data

and even this other property.

So if I give it a save right now,

we should already see the six components over there

and indeed, beautiful.

There they are.

They're missing here the image and the prices I guess.

But in principle, it's already working.

So you see here that we now get these console.logs here

for each of the pizzas, exactly what the names we have here.

And so now we are effectively already rendering a list.

So a list based on this pizza data.

Now we could keep going here

and basically add another property now

for the photo name for example.

So we can do pizza.photoname and so on and so forth.

But usually this is not how we do it.

Usually what we do is to pass in the entire object

into the more specific component,

so that's pizza in this case,

and then inside of that component, we would then

take the information that we want out of the object.

So let's now change the way we pass props into this pizza

and simply pass pizza and let's maybe say pizza object

just to make it slightly less confusing

and then or JavaScript mode

and then the current pizza object.

All right and now it all breaks here

because we need to adapt, of course, our pizza.

So now here we have props.pizzaobject.photoname, right?

And so let's paste this here everywhere

and here and here and here.

And a bit later we will make our lives a bit easier

with some additional techniques.

But for now, let's roll with this.

And there you have it.

There you have a list of all the pizzas

based on our pizza data array.

Let's just just get rid of this,

and of course, if we now remove something from here,

then that last pizza over there is going to disappear.

You see but let's put it back and yeah, there it is.

Now notice how we have like an error here in the console.

So let's scroll up a little bit and see what we get.

So we have this warning saying that each child

in a list should have a unique key property.

So basically what this means is that each time we render

a list like this.

Where is it?

Yeah so each time we render a list with the map method,

each of the items that gets rendered

needs a unique key property.

So key is basically a prop that is internal to React,

which it needs in order for some performance optimizations

and for now, it's not really important what that means

as we will learn later what exactly this K property is

and what it does.

For now, what matters is that we pass something here

that is unique to each element.

So to each pizza in this case, and that is the name.

So the name in this example is always unique.

So we can use that one as the unique key

and so then the warning here is gone.

Okay now next, what I want to do is to convert this here

from a simple diff to a UL, so an unordered list.

And then each of these pizzas themselves

should be a list element or list item, so an LI.

So it's very important that we write semantic markup

like this, which many courses somehow overlook

but I believe it's quite important.

And here we are also missing an important class name

to finally apply some more styling here,

which is just pizzas

and so this then puts the pizzas like nicely

in this grid and makes this look even nicer.

So I'm really happy here with this design like this.

And it's already starting to look like very familiar

to what we have here, right.

We have just missing this button.

The text here is a bit different, and we have

some special styling here when the pizza is sold out

and so we will actually talk about this here pretty soon.

But for now, let's quickly review what we did

in this lecture

and so that is fundamentally this part right here.

So the goal was to render one pizza element

for each of the objects that are inside

the pizza data array.

And the way we do that in React is by simply using

the map method on this array,

and in case you're not entirely sure

what the map method does, please go back

to the the previous section where I will introduce you

to all the most important array methods

that we use all the time.

And this one here is probably the most important.

So it will create a new array,

and in this array, in each position,

there will be a new pizza component.

And into each of these pizza components,

we pass as a prop the current pizza object, right.

So we then receive that here as a prop, and from there,

we read all the data that we are interested in.

All right, now of course, we could also not even have

this component.

Let me quickly show that to you as well.

So let's copy this

and well then can simply replace it here, paste that there.

And then of course, we need to get rid of all this.

So I'm just replacing all of them at the same time

and please don't follow this code here.

So you don't need to do this.

I just want to show you that we could have done it also

without like the intermediary component.

So all that matters here is that we return some JSX.

So we can directly write a JSX here

but usually what we do is to place that JSX

in another component.

So let's go back and there we go.

Now, you might have thought maybe that here we use

a for each because it sounds a bit more logical.

Like maybe we wanted to render one pizza for each of these

but that wouldn't really work.

Let's try that and you see that then nothing happened.

And so that's because here inside this UL

we actually need some JSX.

And the only way we get that JSX is by creating a new array.

And so that's what MAP does.

So it creates a new array, which will, in this case,

contain these six pizzas.

And so then here we will have this array

with all these pizzas and then React knows

how to render that.

Okay, so very, very important technique.

Make sure that you memorize this

or if you don't want to memorize, don't worry,

because you will do this dozens of time

throughout the course.

---

# Conditional Rendering With &&

Another very important technique

that we use all the time in React development

is conditional rendering.

So in this video, and the next two,

we will talk about three ways of rendering some JSX,

or even an entire component,

based on a condition

and starting in this lecture with the & operator.

So, remember how way back we created this

isOpen variable right here in the footer.

So basically this variable tells us

if currently the restaurant is open,

which happens when the current hour is between 12 and 22.

And so now what we want to do is

to basically only render something here inside of the footer

if the restaurant is currently open.

And so that's what conditional rendering is all about.

So it's basically rendering some piece of the UI,

no matter if that's a piece of JSX,

or if it's an entire component,

based on a certain condition.

And again, in this case,

the condition is simply whether the restaurant

is currently open or not.

So let's actually get rid of all of this.

And then here, since we are going to use JavaScript,

let's enter JavaScript mode

using these curly braces once more.

So, as I mentioned initially in this lecture,

we're going to do conditional rendering

with the & operator

and that works because of short circuiting.

Now, in case you're not sure what short circuiting means,

and how it works with the & operator,

then please go back to the previous section

where I have one entire lecture about that.

But in a nutshell,

if we have some true or some truthy value,

such as isOpen,

and if we then use the & operator,

then the second part of the & operator,

so whatever comes here,

will be returned in case that the condition is true.

So let's just write something very simple here.

Just Open.

So just like this.

And let's check it out.

And indeed, it says open.

And so again, the reason for that

is the way the & operator works.

So isOpen is currently true as we can see

from this console.log here,

and so then, since this is true,

the second part of the & operator will be returned.

Now, let's just change this here

to say that the restaurant opens at 20 hours.

Then, here we get false.

And then down here, well, we basically get nothing.

And so that is the short circuiting in action.

So short circuiting means that if this condition,

so if this value here is false or falsey,

then the second part of the operation

will not even be executed.

So JavaScript will not even look at this

and then nothing is rendered.

So the result here is then true,

which is the result of this,

but the React doesn't actually render true

or false into the DOM.

And so that's why this works.

So let me show that to you actually here very quick.

So if we write false here,

so a Boolean value,

then you see it's not showing up here.

And the same is true for true.

So that's not there.

Okay, let's just write something a bit nicer here like,

"We're open until"

and then here, let's read the closed hour

and then format it just a little bit.

"Come visit us or order online."

And since we're already here,

let's also create this small button that we have down here.

Now, right now here we cannot see anything,

so let's put the open hour back

so that our restaurant is actually open.

Nice.

And now let's wrap this entire thing here into a diff.

So diff with the class name of "order".

Then let's wrap this here

and then create a button with the class name of "btn" order.

And then we get all the styles

from the style sheet that we included at the beginning.

Beautiful.

Now just notice here that we're doing exactly

what we learned in the lecture about the rules of JSX,

and in particular,

we are inside this JavaScript mode here

returning some more JSX,

which is perfectly fine.

As we learned in the end,

this is just a JavaScript expression as well.

And so this is why this thing works.

Nice.

So this is a good use case of conditional rendering.

Let's check out another one.

So, let's say that we only want to render this menu here

in case that we actually have some pizzas.

So first of all,

let's actually get,

yeah, actually it's here.

So basically, we only want to render this list

in case that we have some pizzas.

So to start,

let's actually create a new variable here quickly

which I will call pizzas

and I will set it equal to pizzaData.

And then here, let's use that.

And then let's, pizzas.

And then let's do conditional rendering again.

So our first start in a way that's not really going to work

but let's roll with it for now.

So we can again, do pizzas.

& and &.

Well, then this.

So let's cut that, paste it here,

and there we go.

And so our pizzas are still here

because pizzas is a truthy value.

And so this behavior of the & operator

does not only work for true and false values,

but also for truthy and falsey values.

Now, the problem with this is

that let's say that actually we have no pizzas.

So pizzas equals an empty array.

Well then, it actually appears as though this is empty here.

But if we inspect,

we see that the list itself should still be there.

So you see, we have here the empty list.

so it's empty because of course

we have no pizzas to loop over,

but UL is still here.

So this here is still being rendered.

And that's because an MT array is still a truthy value.

So what we need to do here is to basically check

for the length of this array.

So let's do numPizzas=pizzas.length.

All right.

And so now when there are no pizzas,

then this will become zero,

and so if we check based on this,

then this is now a falsey value.

And so if it's false,

then this here will not get rendered.

So let's see what happens then.

And...

now we get this weird zero.

Hmm, why is that?

Well, it's because of short circuiting again.

So when the & operator short circuits,

it will simply not evaluate this part,

but instead the result of the operation

will become this one.

So, this is zero,

and so therefore that's what we get in the UI.

That didn't happen down here

because as I mentioned,

React will not render true or false value

but it will happily render a zero.

And so that's why we get a zero.

So as a conclusion,

we should never, ever have this here as a number.

So we should always try to have a true

or false condition here.

So let's do this.

If there are more than zero pizzas, do this.

And if not, while then don't render anything.

And so this here is the result that we were looking for.

Let's put it back just to see.

And then our pizzas are actually back.

Nice.

Now because of this behavior here that I just showed you,

so that sometimes a zero can show up in the UI,

many people say that we should actually

never use the & operator to do conditional rendering.

Now I don't really agree with that

because sometimes it's nice to very quickly

do some conditional rendering with this,

but also usually, I do prefer the ternary operator

to do conditional rendering.

And so that operator is up next in the next lecture.

---

# Conditional Rendering With Ternaries

So, let's check out how we can do the same thing

with the ternary operator.

So, instead of the end operator here,

let's now use the ternary operator

to do conditional rendering.

And again, in case you are not familiar

with this ternary operator,

please go check out the previous section

with the review of JavaScript needed for React.

So, the ternary operator has three parts,

and the first part is a condition

and if this condition is true, then the result

of the operation will be this second part of the operator,

which right now is all of this, right?

But then the ternary operator also needs a third part,

which is basically like the else branch.

And so, if we want to reproduce the same thing

we had before, here we can just write no.

So give it a safe and you see we get

exactly the same result as before.

So again, the ternary operator has three parts.

So, first a condition, and if this is true,

then this first branch here will become the result

of the operation.

So, of using the operator.

But if it's false, then this last part here,

so this third part, will become the result.

And so, that's what is rendered then in this case.

Let's check that out and indeed, that's what happens.

Now, the advantage of using the turn operator is that

then we can display some alternative.

So let's write some more JSX here

and let's say, "We're still working on our menu.

Please come back later," for example.

So, then we get this.

So, this is, in some situations,

a bit nicer than simply displaying nothing.

But let's go back and here we go.

So, you might be wondering why we cannot simply use

an if-else statement right here.

Well, the reason is, once again,

because of what we learned in the lecture on the rules

of JSX, which is that inside this JavaScript mode,

we cannot write any JavaScript.

What we need to do here is to write something

that actually produces a value

and an if-else statement does not produce a value.

So, let's just experiment something fictional.

So, let's say we wrote,

"If num pizzas greater than zero then" this.

So let's try that.

But yeah, that's not really going to happen.

And we even get this big error here

and it simply says, "Unexpected token."

Well, that's all it says.

And yeah, the reason here is

that doing this does not produce a value.

And so it's the same as just having this

in the end now, right?

So, the ternary operator, when used like this,

is really nice and I do greatly prefer it

over just the end operator that we were using.

And so let's go back down here and also replace it

in this situation here.

So, let's replace that here.

And then also, let's print an alternative here.

So, another piece of JSX, we're happy to welcome you

between, let's just grab this from here.

So here we have the open hour, okay?

Let's change it again to 20 and yeah, nice.

So, ternary operator is a really important tool

in your React toolbox.

And once again, we are just using JavaScript here.

There's nothing React-specific that you need to learn

or to memorize in order to do conditional rendering.

It's all already part of the JavaScript language.

You just need to know that this is how you use it.

So basically, inside these curly braces

to enter JavaScript mode and then, well then,

you just use the operator just like you would do

in vanilla JavaScript.

---

# Conditional Rendering With Multiple Returns

The third way

in which we can conditionally render some JSX

or some component is by using multiple returns.

So, up until this point, all our components

only ever had exactly one return keyword, right?

But there is nothing stopping us

from adding another return keyword based on some condition.

So, of course each component

still can only return one block of JSX,

but that return can depend on a condition.

So, in other words, we can do for example this.

So, right here, we are outside of JSX,

so we are simply inside the component,

and so here we can write any JavaScript we want.

So, we can now easily use the if keywords

so we can say if is not open, then return,

for example, this message right here.

So, this JSX, so paste that here and that's actually it.

So, if the restaurant is not open

then this will be returned.

But if it is opened, then all of this here is not executed,

and then our normal return will simply be executed.

What's important here is that these two returns

cannot happen at the same time,

but that's right now in short here,

so let's again put it to 20.

And so now we get this, so exactly this message right here.

So, it's not coming from here,

so we could replace this, but I will leave it here,

and I will explain in a second why.

But anyway, now this is actually coming from here,

and we could of course do anything here,

just to make sure it is really coming from there.

And yeah, now the problem in this case

is that we are now no longer rendering

the footer element around this p,

so if we wanted to do the exact same thing,

we would also have to copy the footer here, right?

Otherwise the footer would only be rendered

in case the restaurant is open.

But if not, then no footer would exist.

So, this is actually, in this case,

not what we want all right?

So, usually this early return, like we did here,

is more useful when we want

to render entire components conditionally

but not just some pieces of JSX.

So let's try something else here maybe,

and what I'm looking for is actually this pizza component.

So, remember how the pizza has a property of soldOut.

So we can see that here in the props.

So, each pizza receives this pizza object now as a prop

and then we have soldOut.

So what we can do here as an early return is to say

if props.pizza object.soldOut, then return nothing.

And so with this then the pizza that is sold out

will not appear on the user interface,

and indeed there was one pizza.

So, that's this one here, Pizza Salamino,

and that's no longer here now,

and so that's because here we have this early return.

So that's sometimes a pretty common technique

that we can use, which is to simply return null,

so nothing in case there is a certain condition that's true,

and so in this case, this can be quite useful.

So for now, let's leave this here, even though later,

we will do something even nicer with this property.

So, as a conclusion

of these three lectures on conditional rendering

my recommendation is to use the return operator whenever

you need to return some piece of JSX based on a condition.

So, just for example, like this here.

So, this we are going to use all the time

but also sometimes you just want to do something like this,

so you want to return something entirely different

no matter if that's nothing

or if that's just some other component.

So for example, we could also say here

something that doesn't make any sense

but let's just try this.

So, we could do this.

So in case it's sold out,

we returned the header in this place.

So, again here that makes no sense at all

but that would be a possibility,

although not a very good one.

So, throughout this course you will learn

which of these options is the best

simply by practicing and using them

in different situations over and over again.

---

# Extracting JSX Into a New Component

Now to practice the concept of components

and using props just a little bit more,

let's extract parts of the footer into a new component.

So the JSX here inside the footer component

is getting a little bit too long,

and so I got the idea of taking this part here

and extracting it into its own component.

So let's grab all of this and cut it,

and then we're simply going to create a new component.

So we write function, let's call it order,

and then all we have to do

is to just return that JSX that we just created.

All right, now, Prettier did not format this

because actually our code is wrong now,

because here we don't have anything

as the first value in the ternary operator,

and so let's immediately fix that.

So instead of that JSX that we had here before,

now what we want is to simply render the order component.

So order, and that's actually it.

Now, React is still not happy with us

and that's because down here,

close hour is, of course, no longer defined.

And it makes sense because close hour is only defined here

inside the footer component,

but now the JSX that we had here before is gone

and it is in the order component.

So how do we give this order component access

to this value right here?

And I hope that you guessed

that the answer is by using props.

So as we see here, props is actually also quite similar

to passing arguments into functions.

So all we have to do here is to create a prop.

So let's say open hour,

so we can just give it exactly the same name

as the variable.

So it doesn't have to be like this, but it can.

And so then here, let's receive props as a parameter,

and then we can simply read close hour from there.

And again, this works because we made the prop here

exactly the same name as the variable.

So if it was prop hours, then here, of course,

we would also have to use that, right?

But what matters is that it's working just fine.

Well, actually we are not seeing the result there,

so let's set it back to 12.

And so now, yeah, we're getting the order component

rendered there.

However, we see that here is a problem,

and I notice that's because I actually created a bug.

So here we have close hours,

but what we passed in is actually open hours.

So we're not interested in open but in close.

So this should be close hour, and here, close hour,

and here, also close hour as we had before.

And so now that's fixed, and so that's actually it.

So this is how we take a piece of JSX

when the JSX in a component is getting a little bit too big

and simply extract it into its own component.

And then if that JSX depends on some value

that was in the parent component, so like this close hour,

then we simply pass it in as a prop.

And so this is something that we're going to do all the time

when we build our React applications.

So not always do we have all the components figured out

in the beginning, but instead we start building them,

and then when they get to big, we can decide to extract

part of them into just another component.

And now, since this was the last component

that we're going to create in this project,

I invite you to take a pen and a paper

and to draw out the entire componentry

that we just built here.

So I think that's going to be a nice small exercise

for you to get a better hold

of how all the components in this application work together,

and yeah, really understand the structure

that we built here for this small project.

And then once you're done with that,

you can just simply move on to the next lecture.

---

# Destructuring Props

So now that we know what props are,

let's make our lives a little bit easier

when working with props in practice.

So as we already know,

each time that we pass some props into a component,

that component will then

automatically receive this object of props,

which will contain all the props that we passed in.

And actually, all components receive this props object.

So even here in footer, where we don't pass any props in,

we can define that and we can log it to the console.

So it will be empty then.

So let's see.

Yeah, so it is empty, but it always exists.

Alright, so that just as a side note here.

So what we want to do now is to avoid

having to write this props dot whatever else

all the time in our component.

So wouldn't it be nice

to directly receive this pizza object here

into the component, instead of just the props?

Well, we can actually do that with destructuring.

And again, if destructuring is a strange concept to you,

then please go back to the previous review section.

But anyway, now here,

instead of directly receiving these props,

we can immediately destructure them.

And so here, we can write pizza object,

which needs to match exactly the name of the prop

that's being passed in, so this one here.

And then from there on, all of these props here can go.

So I will select them all here, one after the other,

which I'm doing using the select next occurrence.

So that's this shortcut right here.

So you can just go ahead

and use the shortcut that you see right here for you.

So let's get rid of that.

And this will now create a small problem,

which is that here we are still

trying to lock to the console these props,

but the props object now no longer exists,

because, well, we immediately destructured it right here.

So now if we wanted to take a look at what we receive,

we would have to do it like this.

But the props object itself no longer exists.

But this is really, really nice,

because right now, all we have to do

is to look at this line right here

in order to know which props

this component will actually receive.

So before this, all we had was the generic props.

And then if we wanted to know

what kind of props we will receive here eventually,

we would have to go to the place

where the props are actually passed in.

But now, not anymore.

So now right here in this component definition,

we can immediately see that we will receive a pizza object.

And so that's the second really big advantage

of immediately destructuring props.

So let's do the same down here.

So again, not props,

but exactly the name of the prop that we pass in.

So close hour, and then here we can get rid of that.

And of course,

if we were passing in multiple props, and let's try that.

So let's also pass in the open hour,

and then here, open hour.

And so here, all we have to do is to add open hour then.

So here, let's say we're open

from then open hour,

to this.

Yep, and that worked just fine.

Now we can actually really define anything we want here.

Let's write test.

Let's add that here, for example.

And this will then simply be nothing.

So if we try to destructure a property here

that doesn't exist, it's simply undefined.

So let's get rid of that here.

But this was just to show you.

So from now on, for the rest of the course,

we will always receive props like this here.

Just make sure to never, ever forget the curly braces,

because then of course everything will break.

So that's a common beginner mistake.

And so yeah, you have been warned.

Never forget that,

because only with the curly braces,

we are actually destructuring.

---

# React Fragments

Let's now learn what a React Fragment is

and when exactly we might need one.

So let's actually come here to the final version

of the application so that I can show you

that we are actually still missing something

and that's this sentence right here.

So there's a paragraph of text right here

that I'm just going to copy now

and you can maybe pause the video and type it,

or you can just type something shorter.

So let's for now place that paragraph here,

give it a save, and yeah, then it looks exactly the same.

But now what if we have no pizzas at all?

So in this case,

well, then we actually don't want to show this,

so this sentence right here, we only want this one,

so the one that's coming here

from our conditional rendering.

So let's put that back.

And now what that means is that we only want

to render this paragraph here in this situation.

So let's grab that paragraph and place that here,

because again we want to render this paragraph

and this UL in this case,

but immediately React starts yelling at us.

So JSX expressions must have one parent element.

And so this is exactly what we learned

in the Rules of JSX lecture.

So a piece of JSX, no matter where it is defined

can only have in fact one root element.

And this has happened to us before

and the way we always solve this

was by simply wrapping everything

in a div or some other component, so let's try that.

You don't have to do this.

And this is just to show you

that this will then actually mess up our formatting here.

So this is actually not really what we want.

We do not want to render one element

which contains these two,

but we really want to render these two elements here,

so these two elements in separate

without having one element as a parent of these two, right.

And so this is the case in which we need a React Fragment.

So a React Fragment basically lets us group some elements

without leaving any trace in the HTML tree, so in the DOM.

So it looks like here we need a React Fragment

and that's very easy.

All we have to do is to basically delete everything here

just like this and so this is now a fragment.

So let's save, and then we are back to what we had before.

So now let's then inspect the DOM tree,

as I was saying, just to show you

that actually this didn't create any new element at all.

So here we have the header

and I see we still have that footer class there.

Of course, let's get rid of that.

All right.

So we have our container, then we have the menu,

then we have the h2, so this one, and then exactly,

we have the paragraph and the UL, but in separate,

so not wrapped in anything.

So this is completely invisible here

and it's exactly what we were looking for.

And that's it, that's all a React Fragment is

and it's all that it does.

Now, sometimes we need to add a key to a React Fragment,

so, for example, when we are using it to render a list

and so then we need to actually write it

in a slightly different way.

So first, let's make sure that we have React imported

and we do, so it's right here

and so we can write React.Fragment.

And then down here we need to close that React.Fragment

and so then the result is exactly the same.

But if we need it, then here we could add a key

of just anything.

All right, now we don't need a key,

so we can just go for the short version,

which is of course a lot nicer, all right.

Let's try maybe something else.

Let's say that here, we actually didn't want this container,

so maybe we just needed all our elements

right here directly in the root.

So basically what we wanted in this case

is the app component to return three components,

so these three elements made out of these three components.

And so then that would be very simple.

Now, in our case,

it's of course going to mess up the formatting

because then we are missing the container class,

but just as an example,

this is what it would look like in the end.

So we would have our root

with immediately these three as direct children.

But let's put everything back.

And yeah, I think that's all

that you need to know about React Fragments.

It's a very simple concept,

which basically allows us to have more

than just one element inside a piece of JSX.

---

# Setting Classes and Text Conditionally

 To finish this project let's learn

how to conditionally set some text inside elements

and also how to conditionally set class names.

So if we take one final look at our final project

the only difference is that this pizza here

that is sold out

has this text of sold out instead of the price.

And the whole element here is kind of grayed out.

So just to show that it's not available.

And so let's now do that.

So right now we have this line of code here

which makes it so that is sold out pizza

is not even displayed.

So let's start by getting rid of that.

And so now we are ready to conditionally display some text

and we are going to do it right here.

So the difference between what we did before is that

before we did conditionally render this entire element here

but now that's not what we want.

Now we already know that we want this span element here

but we don't want the content yet.

And so let's now conditionally set that,

and that's very easy.

So once again, we are going to use our ternary operator.

So let's say pizza object

dot sold out,

then the text here should be,

and now what do you think we need here?

Well, it's just a string actually.

So, sold out.

And if not, then we want the pizza's price.

Give it a save and,

yeah, nice, that worked.

Let's just make it uppercase.

It should be handled by the CSS,

but we can also just do it like this now, right?

So let's again appreciate the difference here.

So we're not setting the element conditionally,

which of course we could.

Let's just quickly do that because why not?

So we could say,

if pizza object

not sold out

then display this span with sold out

and if not

then display the span with pizza

dot price.

So the result is going to be exactly the same

as we see down here,

but what we did is fundamentally different.

So here we already know that we want a span element

we just don't know yet the content.

While here, we apparently also don't know yet

what element we want.

Though in both cases we are then using a span.

And so I think it's a lot better to do it like this.

So to conditionally set the text content of an element

this is way cleaner in my opinion.

But just for reference, I will leave this one here as well.

Okay. And now finally, as for the class name,

whenever the pizza is sold out,

we can add the sold out class to the LI,

which will then make it grayed out.

Let me show that to you.

You can simply add it to all of them.

And so then you see this is the result we are going for,

but of course we only want this part here

whenever the pizza is actually sold out.

So let's again use our ternary operator for that.

So this is how we're going to do it.

We will now use instead of a regular string,

a template literal.

So deleting the quote and deleting this.

But now this is actually JavaScript.

So a template literal is JavaScript

therefore let's enter JavaScript mode.

Give it a save.

And so for now, it is exactly what we had before.

But now inside this template literal, we can,

well kind of enter the template literal

JavaScript mode as well in this way.

So remember that it's actually quite similar

the idea then entering JavaScript mode inside of JSX, right?

The difference here that in the template literal

to add some piece of code we also need this one, right?

So this dollar sign.

But then here we can once again

make use of our friend the ternary operator.

So we can say pizza object

sold out.

If yes, then here give us the string of sold out.

But if not, then just an empty string.

And this should be enough.

And yeah, beautiful.

So this is exactly what we were going for.

So let's recap why this worked.

So we have our template literal,

and then here we simply write a JavaScript expression.

And so then with the ternary operator,

we check if this exists and if so.

So if this is true,

then the result of this operator will be sold out.

And so then this entire thing here becomes sold out.

And then the string is exactly what we had before.

So pizza space sold out.

But if this is false,

then we will simply return nothing here.

So then the string is just pizza,

which is well what we have here in all of these cases.

So you see here the class is just pizza

with the space of course that we have here,

but that's no problem at all.

And then here we have pizza sold out.

Great. So this is how we conditionally set

some CSS classes onto elements.

So all without using the classless property

that we would have to use in Vanilla JavaScript.

And for this down here, remember in Vanilla JavaScript

we would have to do some damage manipulation

with the text content property

or inner HTML or something like that.

But here with the declarative nature of JSX and React

everything becomes just a little bit easier

and nicer to work with.

And now just one final detail.

Let's come here to our public folder.

And in the index dot HTML

we will want to set now the title of the document.

So here we have Fast React Pizza Co.

But here it just says default React Up, which is a bit ugly.

So let's say Fast React Pizza Co.

And that's it.

So at this, we actually finished our application

and our very first project.

So congratulations for making it all the way here

until the end of this long section.

And now just to finish this section

we will have a lecture to review everything

that we just learned because it was a lot.

And then finally,

there is another coding challenge waiting for you

just so you can practice again what you learned here

over the last few lectures.

But before going there, I would invite you to once again

check out the entire code that we wrote here together

see how all the components are related

and really check out again

everything that you learned even before checking out

that summary lecture that's going to follow.

And then after that, of course,

watch that lecture to really drive the message home.