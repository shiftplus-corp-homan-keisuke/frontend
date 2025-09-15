memo from 122 to 139

# How React Works Behind the Scenes

Welcome to probably

the most challenging section in this course

but also one of the most exciting ones

and most rewarding ones.

So, up until this point, we have only focused

on how React concepts and features work in practice,

but now it's time to understand

how things actually work internally,

inside React, behind the scenes.

So, just like my other courses,

this course also includes a really deep dive,

which most students absolutely love.

Because this information you're about to learn

will not only make you a much better

and more confident React developer,

but it will also allow you to ace

the most common React interview questions

with all the confidence that you need

in order to nail that job.

And I would go as far as saying

that this knowledge will actually put you

right in the top 5% of all React developers.

Now, again, this section is quite intense,

and it should probably be

in the advanced part of the course,

but since there is so much important stuff

that we need to talk about before moving on,

I decided to place it right here.

If at some point it becomes a bit too much

or if you become bored,

please watch at least the final lecture of the section

where I'm briefly going to summarize everything we covered.

So that video really is a must watch.

But, anyway, without further ado,

let's dive right in and uncover how React works.

# Project Setup and Walkthrough

Now before we go learn

about how React works behind the scenes,

let's quickly set up and walk through a small demo project

that we're gonna need in a few lectures of this section.

Now, this time around, we will do things a bit differently.

So we will not create a new project using Create-React-App.

Instead, in the starter files,

I already basically have that entire project

for you to copy.

So open up the starter files,

and then here in this folder called how-react-works,

let's copy this entire starter folder.

So copy all of this right into the folder

where we are building our project

and so then simply call it how-react-works.

So you see that here we actually have the source folder,

we have the public folder,

and also these other files

that are always automatically created by Create-React-App.

But again, this time we are not doing that

because, well, everything has been done already for us.

And so now all we have to do is to take this folder,

open it up in VS Code, like this,

and then we need to install all the packages.

So the node modules folder,

which is the folder where all the NPM packages are installed

is, of course, not here.

So all the libraries like React, ReactDOM, and so on,

they are not here.

So we need to install them,

but that's fortunately very easy.

So let's open up our terminal here.

Ah, it's here in View.

And, oh, that's really small here.

And as always, make sure that you are in the correct folder.

And then all we have to do is to say npm install,

or npm i for short.

So hit Enter, and then this will install all the packages

that are necessary for this Create-React-Application.

So it will get this information

here from this package.json file.

Okay, and we see that it's already done,

and so we can now start this project.

So just write npm start.

And then in my case here, it's asking me

if I want to run the app on another port.

And so that's because I already had something

running here on 3000.

So that's basically the demo project.

But let's close that for now, actually.

So just inspecting this,

and then let's open up our app.js file as always.

So this time around, in this section,

I gave you this already started project

so that you can now get the experience

of looking at a project

where someone already started writing some code.

So that's exactly what we have here.

So some code here has already been written

and so you can now pretend

that basically some other developer on your team wrote this.

So it's extremely important

that you'll be able to understand other developer's code,

especially when you work on a team

as a professional React developer someday.

And so, before we now start the section,

I just want us to quickly walk through this code here

so I can explain you how it works on a high level.

And then by doing so,

you can see how we can effectively read code

that we didn't write ourselves.

So let's start in the app component here,

and all that one does is to include the tabbed component.

And it passes the content in there

which is simply this array of objects here.

So, pretty standard.

Then the tabbed component has some state variable here

which indicates the current tab.

So it seems like this is a number.

And then down here, we can see that the active tab state

is used to render this tab content component

using as the content, the content array,

at the position of the currently active tab.

So this at here is basically modern JavaScript

which is the same as this here,

so basically reading something out of an array,

and that array, again, is this content array up here.

So for example, if the state here was two,

then the content here in the tab would be zero, one, two,

so it would be this object right here.

All right, let's just put this back here

to this more modern form.

And then let's check out

what this tab content here actually is.

And it's also always a good idea

to take a look at the component tree.

And so, let's make this here bigger.

And so, indeed, we have the app, we have tabbed,

and then we have the tab content in there.

And of course, we also have these four tabs,

but we will leave them for a bit later.

So in here, in the tab content, let's see what we have.

So we get the tabbed item,

which is basically the content that we're going to use here.

So we can double-click on that

and then we see where it has been used.

So we see that we use item.summary and item.details.

Then we also see that we have two state variables here,

so that's showDetails and setShowDetails.

And again, by double-clicking,

VS Code will then highlight all of them.

So here, we can see that we're doing

some conditional rendering with this showDetails.

And so, yeah, by default this is true.

And then only in that case,

we are displaying the item details.

And then we change that state down here

where we have setShowDetails in this button.

And so, this here is exactly that button.

So if we click that, then here, the text disappears.

So this paragraph right here disappears.

Right, then we also have these two buttons down here

but we see that they have no event handler attached.

So if we click here, then nothing happens.

Then, finally we also have those hearts here,

and that's why we have this second state of likes.

So you see that likes is indeed used here.

And then this button here has the handleInc function,

so this first one here,

while the second button again has no handler.

So here, nothing happens.

But here, each time we click,

basically one like is added there.

And so that's because of the handleInc function.

So what this one does

is simply take the current likes and adding one,

and then setting that as the new likes state.

Now notice how here we didn't use a callback function

in order to set state based on the current state,

but more about that later.

So I think this component here is pretty clear.

And so, let's now go back here

and see what these tabs here actually are.

So here we have these four tabs

and notice how we are actually writing them

one by one manually

and not looping over some array.

So our array has these three elements here.

And so the first three elements...

So these three are for those three objects

and then we have another one where the number is three.

But let's take a look at that a bit later.

So here we have the num as a prop,

we have the active tab, and we have the onClick prop.

And as onClick, we are simply passing

the setActiveTab state setter function.

Now let's go here into the tab and see what happens there.

So basically, a tab is just a button,

so it's these buttons right here.

And what happens when we click on this button

is that the onClick function is called

with the current number.

So let's then actually go back

to where these props are passed

so that we can understand what the onClick

and the num actually are.

So onClick is setActiveTab,

and num are these numbers here.

And so basically, when we click on this first tab,

it means that the active tab will get set to zero.

And the same down here.

So when we click on this tab right here,

then the active tab will get set to one,

which is exactly what we have here.

Then based on this date, as I explained in the beginning,

we see that the TabContent will be rendered,

at least if that value is less or equal to.

So if it's greater than two, which happens in this case,

then the different content will be displayed.

So let's check that out.

And so this one is simply this one div

which has a simple h4.

Okay, so again, basically,

the goal of this other tab right here is just to display

this DifferentContent component right here.

So let's see that in action.

And so, indeed, when we click on Tab 2,

you see that the content here changed.

And so the title here and the text

are exactly what we have here in this second object.

And then the same here,

so here we now have the third object,

so the title and the text.

And finally the last one is for,

well, for that different content.

And you saw that down here,

actually, the component tree changed.

Now, right, and here,

if we wrote any other number, like zero,

then, of course, you see that the number changed here.

So that is always the number, plus one,

and we get then the very first object.

So now it says, "React as a library for building UIs,"

so just like here.

And also both of them are now marked active,

which also happens inside that tab component.

But of course, let's put it back to two.

And with this, I think it is pretty clear

what this very small demo application does.

But before you move on to the next lecture,

make sure that you take some more time

to analyze this code on your own

so that you truly understand what exactly is happening here.

# Components, Instances, and Elements

Let's start this section

with the conceptual difference between React components,

Component instances, and React elements.

Knowing about this difference will hopefully

make it a bit more clear what actually happens

with your components as you use them.

And also this is a pretty common interview question.

And so this topic is definitely worth learning about.

And let's begin by taking another look at components.

So components are what we write

in order to describe a piece of the user interface.

And the component is just a regular JavaScript function,

but it's a function that returns React elements.

So it returns an element tree.

And we usually write these elements using the JSX syntax.

Now a component is a generic description of the UI.

So we can essentially think of a component as a blueprint

or a template, and it's out of this one blueprint

or template that React then creates one

or multiple component instances.

Now, React does this each time that we use the component

somewhere in our code.

For example, the tap component that we saw

in the last slide is used, so it is included three times

in this app component.

And so therefore, three instances of tap are placed

in a component tree.

So in our actual application.

Behind the scenes, this happens

because React will call the tap function three times.

So one time for each instance.

So we can say that an instance is like the actual

physical manifestation of a component living

in our componentry.

While the component itself is really just a function

that we wrote before being called.

And actually, it's each instance

that holds its own state and props

and that also has its own life cycle.

So basically, a component instance can be born,

it can live for some time until it will eventually die.

So it's a bit like a living organism really.

Now in practice, we many times just use the terms component

and component instance interchangeably.

For example, we just say component life cycle

and not component instance life cycle.

And we also say that a UI is made up of components,

not of component instances,

even though instances

would technically be more accurate.

Okay, so just keep that in mind in the future

when you read documentation

or some stack overflow post or something like that.

But anyway, as React executes the code

in each of these instances,

each of them will return one or more React elements.

So as we learned when we first talked

about JSX behind the scenes, JSX will actually get converted

to multiple React.createElement function calls.

Then as React calls these create element functions

the result will be a React element.

So a React element is basically the result

of using a component in our code.

It's simply a big immutable JavaScript object

that React keeps in memory.

And we will take a look at this later in our account.

But what is this object actually?

Well, a React element basically contains all the information

that is necessary in order to create DOM elements

for the current component instance.

And so it's this React element that will eventually

be converted to actual DOM elements,

and then painted onto the screen by the browser.

So based on all this, the DOM elements are the actual, final

and visual representation

of the components instance in the browser.

And again, it's not React elements

that are rendered to the DOM.

React elements just live

inside the React app and have nothing to do with the DOM.

They are simply converted to DOM elements

when they are painted on the screen in this final step.

Okay, so this is the journey

from writing a single component to using it multiple times

in our code as a blueprint all the way

until it's converted to a React element,

and then rendered as HTML elements into the DOM.

So I hope you found this interesting and useful,

and if you did, then let's move on to the next video,

and take a look at all this in code.

# Instances and Elements in Practice

So as promised, let's now shortly look

at component instances and React elements in our code.

So what I want to do in this lecture is just a couple

of quick experiments to show you some interesting things.

So first off, we can actually look

at a component instance simply

by using the component and logging it to the console.

So let's try that out.

So actually right out here we can write JSX like this.

So, let's use the different component

or the different content component

because this one doesn't have any state.

And all right, and if we run this

then we should see something in the console.

And indeed, there it is.

So as soon as React sees this right here,

it will internally call the different content function

and will then return this React element.

So just like we learned in the previous video.

So let's take a quick look at this

and while this is not really interesting, we can see

that the type here is of different content.

And so that's exactly the name of the component right here.

We can also see that we didn't pass in any props

but which we actually could.

So let's just do test equals 23.

and so then we should see that right here.

So now in the second one, and indeed there it is.

So again, this is what React internally use

to then later create our dumb elements.

Now if you're wondering what this weird dollar dollar type

of thing here is, well this is simply a security feature

that React has implemented in order to protect us

against cross-site scripting attacks.

So, notice how this is a symbol and symbols are one

of the JavaScript primitives, which cannot be transmitted

via JSON, or in other words, this means that a symbol

like this cannot come from an API call.

So if some hacker would try to send us a fake React

element from that API, then React would not see

this type of as a symbol.

Again, because symbols cannot be transmitted via JSON.

And so then React would not include that fake React element

into the dumb so protecting us against that kind of attack.

All right, but anyway, let's come back here

and try something else.

So, if React calls are component internally

when it renders them, so just as it did here in this

previous line, then maybe you have wondered,

why don't we just call components directly?

So why should we write it like this when

we could also write different content like this?

So, basically calling the function ourselves.

Well, there is really nothing stopping us from doing so.

So if we save this, then we actually get a result as well.

Let's just reload here so that we only get

these two outputs.

So one output from here and one from here.

So you see that even here in this case,

we still got a React element like this.

However, it is a very different one.

So this one no longer has the type of different content

and instead it is a diff which is basically

just the content of that component.

So this diff here is now the type of this React element

and we can also see that because the props include

the class name of "tab-content".

So what this means is that right now, React does

no longer see this as a component instance,

and instead it just sees the raw React element,

which is really not what we want.

So, when we write, or actually when we use a component,

we want React to see the component instance

and not the raw output element like this one.

So never do this, what we did right here,

and let's actually demonstrate this one more time,

but now inside the component here.

So after all this, let's enter JavaScript mode here

and then let's just call or actually tab content.

This time, let's call tab content

and we can pass in props just like this.

So we pass in an object and then item,

and then let's say content at zero.

And well, we got some errors here, but let's try to reload.

And now this somehow works.

So you see that actually

we got a second tab content rendered down here.

So, it looks like this works, right?

Well, not so fast.

Let's check out our component tree here again.

We need some more space.

And so now you see that we still only have one

tab content here in our component tree.

And so this happened exactly because of what I explained

before, which is that when we call a component directly

like this, then React no longer sees it

as a component instance.

Now we can also see that the state

that this component manages is actually now

inside the parent state or the parent component.

So, if we check out the tabbed component here,

you see that it has the normal state that it had before

which is this active tab

but it also has some other hooks here which come

from tab content.

So these two are the two hooks that are inside

this component, but they don't really belong here.

So we actually want them to be inside tab content

and not inside, well not here inside the tabbed component.

So what this means again, is that this is here

not really a component because it cannot even manage

its own state at this point.

So, for all these reasons, you should never ever do

what we just did here because this will create

multiple problems such as violating the rules of hooks

that we will talk about later.

So instead, as you already know,

always render it inside the JSX.

So just like this.

And so here we just use the component.

So, basically this blueprint like we have always been doing.

And so then React calls the component

and actually recognizes this as a component instance.

Alright, so let's reload here again

and then we are back to normal.

Alright, and here we can see one of those examples

that we talked about in the previous lecture.

So, we wrote one tab component here.

So this is like the blueprint

but then we have four component instances,

each with its own state and its own props.

# How Rendering Works: Overview

We are now ready

to finally learn about how exactly React renders

our applications behind the scenes.

Now there is so much to learn here

that I split up this lecture into three parts.

So it's this video and the next two ones.

This one serves more as an overview

and then in the next two videos,

we're gonna go really deep

into some React internals.

And let's start with just a small recap

so that we're all on the same page.

So as we build our applications,

what we're really doing

is building a bunch of components.

We then use these components inside other components

as many times as we want

which will cause React to create one

or more component instances of each component.

So these are basically

the actual physical components

that live in our application

and holds state and props.

Now, as React calls each component instance,

each JSX will produce a bunch

of React dot create element function calls

which in turn will produce a React element

for each component instance.

And so this React element

will ultimately be transformed

to DOM elements and displayed

as a user interface on the screen.

So we have a pretty good understanding

of the initial part of this process,

so of transforming components to React elements.

However, what we don't understand yet

is the second part of the process,

so how these React elements actually end up

in the DOM and displayed on the screen.

Well, luckily for us,

that is exactly what this series

of lectures is all about.

So in this lecture,

we're gonna have a quick overview

of each of the phases involved in displaying

our components onto the screen.

Then we're gonna zoom into each of these phases

to learn how the entire process

works internally behind the scenes.

So this process that we're about to study

is started by React each time

that a new render is triggered,

most of the time by updating state

somewhere in the application.

So state changes trigger renders

and so it makes sense

that the next phase is the render phase.

In this phase, React calls our component functions

and figures out how it should update the DOM,

so in order to reflect

the latest state changes.

However, it does actually not update

the DOM in this phase.

And so Reacts definition of render

is very different from what

we usually think of as a render,

which can be quite confusing.

So again, in React, rendering is not

about updating the DOM

or displaying elements on the screen.

Rendering only happens internally inside of React

and so it does not produce any visual changes.

Now, in all the previous sections,

I have always used the term rendering

with the meaning of displaying elements on the screen

because that was just easy to understand

and it just made sense, right?

However, as we just learned,

the rendering that I used to mean

is really this render plus the next phase.

And speaking of that next phase,

once React knows how to update a DOM,

it does so in the commit phase.

So in this phase,

new elements might be placed in the DOM

and already existing elements might get updated

or deleted in order to correctly reflect

the current state of the application.

So it's really this commit phase that is responsible

for what we traditionally call rendering,

not the render phase, okay?

Then finally, the browser will notice

that the DOM has been updated

and so it repaints the screen.

Now this has nothing to do with React anymore

but it's still worth mentioning

that it's this final step that actually produces

the visual change that users see on their screens.

All right, so let's now zoom

into each of these different steps,

starting with the triggering of a render.

So there are only two ways

in which a render can be triggered.

The first one is

the very first time the application runs

which is what we call the initial render.

And the second one is a state update happening

in one or more component instances

somewhere in the application

which is what we call a re-render.

And it's important to note

that the render process really is triggered

for the entire application,

not just for one single component.

Now that doesn't mean

that the entire DOM is updated

because remember, in React,

rendering is only about calling the component functions

and figuring out what needs to change in the DOM later.

Now again, this might seem confusing now

because earlier in the course,

I made it seem as though React

only re-renders the component

where the state update happened.

But that's because we were learning

how React works in practice.

And in fact, when we look at what happens in practice,

it looks as if only

the updated component is re-rendered.

But now we are learning

how React actually works behind the scenes.

And so now we know that React looks

at the entire tree whenever a render happens.

Finally, I just want to mention

that a render is actually not triggered immediately

after a state update happens.

Instead, it's scheduled for when

the JavaScript engine basically

has some free time on its hands.

But this difference is usually

just a few milliseconds

that we won't notice.

There are also some situations

like multiple sets state calls

in the same function where renders will be batched

as we will explore a bit later.

So this is how renders are triggered

which is the easy part.

What follows is the hard part,

which is the actual rendering.

And so let's learn all about that in the next video.

# How Rendering Works: The Render Phase

Welcome back to probably the most complicated

and most confusing lecture of the entire course.

But I don't say this to scare you

because this might also be the most interesting

and fascinating lecture of the course.

Now, if you don't immediately understand 100%

of what I'm gonna teach you here, that's absolutely fine.

So don't stress about it at all.

Again, you can use React without knowing any of this stuff

but if you have a curious mind

and feel the need to understand how React does what it does,

then this video is for you.

Now, before we even start, let's first go back

to where we first learned about the mechanics of state.

Remember this diagram?

Well, back then I told you

that we can conceptually imagine this

as a new view being rendered on the screen, so into the DOM.

However, now we know that this was technically not true

because rendering is not about the screen or the DOM

or the view, it's just about calling component functions.

I also told you that whenever there is a re-render,

React discards the old component view

and replaces it with a brand new one.

However, that's also technically not true.

So the DOM will actually not be updated

for the entire component instance.

So if those things are not true, then let's now learn

what happens instead and how rendering actually works.

So, in the previous lecture we talked

about how renders are triggered.

In this lecture, we're gonna learn all about

how renders are actually performed in the render phase.

So, at the beginning of the render phase

React will go through the entire component tree,

take all the component instances that triggered a re-render

and actually render them, which simply means

to call the corresponding component functions

that we have written in our code.

This will create updated React elements

which altogether make up the so-called virtual DOM.

And this is a term that you might have heard before

and so let's dig a little bit deeper now

into what the virtual DOM actually is.

So on the initial render, React will

take the entire component tree and transform it

into one big React element which will

basically be a React element tree like this one.

And this is what we call the virtual DOM.

So, the virtual DOM is just a tree

of all React elements created

from all instances in the component tree.

And it's relatively cheap and fast to create a tree

like this, even if we need many iterations of it

because in the end it's just a JavaScript object.

Now, virtual DOM is probably the most hyped

and most used term when people describe

what React is and how it works.

But if we think about it, if the virtual DOM

is just the simple object,

it's actually not such a big deal, right?

And that's why the React team has really

downplayed the meaning of this name.

And the official documentation actually no longer

mentioned the term virtual DOM anywhere.

But I'm still using this term here

because everyone still uses it and also

because it just sounds a bit nicer than React element tree.

Also, some people confuse the term with the shadow DOM,

even though it has nothing to do

with the virtual DOM in React.

So the shadow DOM is actually just a browser technology

that is used in stuff like web components.

But anyway, let's now suppose

that there is gonna be a state update in component D,

which will of course trigger a re-render.

That means that React will call the function

of component D again and place the new React element

in a new React element tree.

So, in a new virtual DOM.

But now comes the very important part, which is this.

Whenever React renders a component,

that render will cause all of its child components

to be rendered as well.

And that happens no matter if the props

that we passed down have changed or not.

So again, if the updated components

returns one or more other components,

those nested components will be re-rendered as well,

all the way down the component tree.

This means that if you update the highest component

in a component tree, in this example component A,

then the entire application will actually be re-rendered.

Now, this may sound crazy, but React uses this strategy

because it doesn't know beforehand whether an update

in a component will affect the child components or not.

And so by default, React prefers to play it safe

and just render everything.

Also, keep in mind once again that this does not mean

that the entire DOM is updated.

It's just a virtual DOM that will be recreated

which is really not a big problem

in small or medium sized applications.

Okay, so with this, we now know what

this new virtual DOM here means

and so let's keep moving forward.

So what happens next is that

this new virtual DOM that was created

after the state update will get reconciled

with the current so-called Fiber tree

as it exists before the state update.

Now this reconciliation is done in React's reconciler

which is called Fiber.

Now that's why we have a Fiber tree.

Then the results of this reconciliation process

is gonna be an updated Fiber tree,

so a tree that will eventually be used to write to the DOM.

So this is a high level overview

of the inputs and the outputs of reconciliation,

but, of course, now we need to understand

what reconciliation is and how it works.

So, you might be wondering why do we even need stuff

like the virtual DOM, a reconciler and those Fiber trees?

Why not simply update the entire DOM

whenever state changes somewhere in the app?

Well, the answer is simple.

Remember how we said that creating the virtual DOM

so the React element tree for the entire app is cheap

and fast because it's just a JavaScript object?

Well, writing to the DOM is not cheap and fast.

It would be extremely inefficient

and wasteful to always write the entire virtual DOM

to the actual DOM each time that a render was triggered.

Also, usually when the state changes somewhere in the app

only a small portion of the DOM needs

to be updated and the rest of the DOM

that is already present can be reused.

Now, of course, on the initial render

there is no way around creating the entire DOM from scratch

but from there on, doing so doesn't make sense anymore.

So imagine that you have a complex app like udemy.com

and when you click on some button there

then showModal is set to true,

which in turn will then trigger a modal to be shown.

So in this situation, only the DOM elements

for that modal need to be inserted into the DOM

and the rest of the DOM should just stay the same.

And so that's what React tries to do.

Whenever a render is triggered,

React will try to be as efficient as possible

by reusing as much of the existing DOM tree as possible.

But that leads us to the next question.

So how does React actually do that?

How does it know what changed

from one render to the next one?

Well, that's where a process

called reconciliation comes into play.

So reconciliation is basically deciding exactly

which DOM elements need to be inserted, deleted

or updated in order to reflect the latest state changes.

So the result of the reconciliation process

is gonna be a list of DOM operations that are necessary

to update the current DOM with a new state.

Now, reconciliation is processed by a reconciler

and we can say that the reconciler

really is the engine of React.

It's like the heart of React.

So it's this reconciler that allows us

to never touch the DOM directly

and instead simply tell React what the next snapshot

of the UI should look like based on state.

And as I mentioned before, the current reconciler

in React is called Fiber, and this is how it works.

So, during the initial render of the application

Fiber takes the entire React element tree,

so the virtual DOM, and based on it

builds yet another tree which is the Fiber tree.

The Fiber tree is a special internal tree where

for each component instance and DOM element in the app,

there is one so-called Fiber.

Now, what's special about this tree

is that unlike React elements in the virtual DOM,

Fibers are not recreated on every render.

So the Fiber tree is never destroyed.

Instead, it's a mutable data structure

and once it has been created during the initial render,

it's simply mutated over and over again

in future reconciliation steps.

And this makes Fibers the perfect place for keeping track

of things like the current component state, props,

side effects, list of used hooks and more.

So the actual state and props of any component instance

that we see on the screen are internally stored

inside the corresponding Fiber in the Fiber tree.

Now, each Fiber also contains a queue of work to do

like updating state, updating refs,

running registered side effects,

performing DOM updates and so on.

This is why a Fiber is also defined as a unit of work.

Now, if we take a quick look at the Fiber tree

we will see that the Fibers are arranged in a different way

than the elements in the React element tree.

So instead of a normal parent-child relationship,

each first child has a link to its parent

and all the other children then have a link

to their previous sibling.

And this kind of structure is called a linked list

and it makes it easier for React to process the work

that is associated with each Fiber.

We also see that both trees include not only React elements

or components, but also regular DOM elements,

such as the h3 and button elements in this example.

So both trees really are a complete representation

of the entire DOM structure, not just of React components.

Now going back to the idea that Fibers are units of work,

one extremely important characteristic

of the Fiber reconciler is that work

can be performed asynchronously.

This means that the rendering process

which is what the reconciler does, can be split into chunks,

some tasks can be prioritized over others

and work can be paused, reused,

or thrown away if not valid anymore.

Just keep in mind

that all this happens automatically behind the scenes.

It's completely invisible to us developers.

There are, however, also some practical uses

of this asynchronous rendering

because it enables modern so-called concurrent features

like Suspense or transitions starting in React 18.

It also allows the rendering process

to pause and resume later so that

it won't block the browser's JavaScript engine

with two long renders, which can be problematic

for performance in large applications.

And again, this is only possible

because the render phase does not produce

any visible output to the DOM yet.

Okay, so at this point we know

what the Fiber reconciler is and how the Fiber tree works

but now it's time to talk about what Fiber actually does

which is the reconciliation process.

And the best way to explain how reconciliation works

is by using a practical example.

So let's take the virtual DOM

and the corresponding Fiber tree from the last slide

which corresponds to this piece of code right here.

So in the app component, there is a piece

of state called showModal, which is currently set to true

and you can pause the video here to analyze it

but it's not really necessary.

So let's say now that the state is updated to false.

This will then trigger a re-render

which will create a new virtual DOM.

And in this tree, the modal

and all its children are actually gone

because they are no longer displayed

when showModal is not true.

Also, all remaining React elements are yellow,

meaning that all of them were re-rendered.

And do you remember why that is?

That's right.

It's because all children of a re-rendered element

are re-rendered as well,

as we just learned a few minutes ago.

But anyway, this new virtual DOM now needs

to be reconciled with the current Fiber tree,

which will then result in this updated tree

which internally is called the work in progress tree.

So whenever reconciliation needs to happen,

Fiber walks through the entire tree step by step

and analyzes exactly what needs to change

between the current Fiber tree

and the updated Fiber tree based on the new virtual DOM.

And this process of comparing elements step-by-step

based on their position in the tree is called diffing

and we will explore exactly how diffing works

a bit later in the section

because that's actually pretty important in practice.

But anyway, let's quickly analyze our updated Fiber tree

where I marked new work that is related to DOM mutations.

So first, the Btn component has some new text

and so the work that will need to be done

in this Fiber is a DOM update.

So in this case, swapping text from height to rate.

Then we have the Modal, Overlay, h3 and button.

So these were in the current Fiber tree

but are no longer in the virtual DOM

and therefore they are marked as DOM deletions.

Finally, we have the interesting case

of the video component.

So this component was re-rendered because it's a child

of the app component, but it actually didn't change.

And so as a result of reconciliation,

the DOM will not be updated in this case.

Now, once this process is over, all these DOM mutations

will be placed into a list called the list of effects

which will be used in the next phase,

so in a commit phase, to actually mutate the DOM.

Now, what I showed you here was actually still

a bit oversimplified, if you can believe that,

but I think that this is more than enough

for you to understand how this process works.

Okay, so that was quite a deep dive, but now we're back here

in the high level overview of the render phase.

So we learned that the results of the reconciliation process

is a second updated Fiber tree, plus basically a list

of DOM updates that need to be performed in the next phase.

So React still hasn't written anything to the DOM yet

but it has figured out this so-called list of effects.

So this is the final result of the render phase

as it includes the DOM operations that will finally be made

in the commit phase, which is the topic of our next video.

So if you don't want to break the flow,

then let's move on there right now.

# How Rendering Works: The Commit Phase

Welcome back to part three

of How Rendering Works Behind the Scenes.

So we just finished learning about the render phase

which resulted in a list of DOM updates

and this list will now get used in the commit phase.

Now, technically speaking, the current work in progress

fiber tree also goes into this commit phase,

but let's keep it simple here.

So these are more conceptual diagrams

so that we can understand what is happening,

not a 100% accurate description

of the algorithms inside React, all right?

But anyway, as you know by now,

the commit phase is where React finally writes to the DOM,

so it inserts, deletes and updates DOM elements.

You'll sometimes also read

that React flushes updates to the DOM in this phase.

So basically, React goes through the effects list

that was created during rendering,

and applies them one by one to the actual DOM elements

that were in the already existing DOM tree.

Now riding to the DOM happens all in one go.

So we say that the commit phase is synchronous

unlike the rendering phase, which can be paused.

So committing cannot be interrupted.

Now this is necessary so that the DOM

never shows partial results

which ensures that the UI always stays consistent.

In fact, that's the whole point of dividing

the entire process into the render phase

and the commit phase in the first place.

It's so that rendering can be paused, resumed, and discarded

and the results of all that rendering

can then be flushed to the DOM in one go.

Then once the commit phase is completed,

the work in progress fiber tree becomes

the current tree for the next render cycle.

That's because, remember, fiber trees are never discarded

and never recreated from scratch.

Instead, they are reused

in order to save precious rendering time.

And with that, we close up the commit phase.

The browser will then notice that the DOM has been changed,

and as a result, it will repaint the screen

whenever it has some idle time.

So this is where these DOM updates are finally made visible

to the user in the form of an updated user interface.

Now, I'm not gonna go into how this phase works

because this is really more

about how browsers work internally, and not React.

However, there's still one more thing

that we need to talk about.

So the browser paint face that we just mentioned

is of course performed

by whatever browser the user is using.

And the render phase is obviously performed

by the React Library.

But what about the commit phase?

We would think that it's also done by React, right?

But actually that's not true.

It's actually a separate library that writes to the DOM,

and it's called React DOM.

So not very creative, but that's just what it's called.

So in fact, React itself does never touch the DOM,

and it actually has no idea where the result

of the render phase will actually be committed and painted.

So React only does the render phase

but not the commit phase.

And the reason for that is

that React itself was designed to be used independently

from the platform where elements will actually be shown,

and therefore React can be used

with many different so-called hosts.

Now up until this point, we have only ever thought

of React in conjunction with a DOM

because we usually use it to build web application.

And in 90% of the cases,

that's actually what we do with React.

But the truth is

that React is used with other hosts as well.

For example, we can actually build

native mobile applications for iOS and Android

using React Native, or we can build videos with React

using a package called Remotion.

And we can even create all kinds of documents

like Word or PDF documents, Figma designs

and many more, using different so-called renderers.

Now, if we think about this,

Renderer is actually a pretty terrible name

because according to React's own terminology,

Renderers do not render,

but they commit the results of the render phase.

But I think that this Renderer name

comes from a time before React divided

the render and the commit phase into two separate phases.

And so they chose this term of Renderer

because it fits with the common sense

definition of rendering.

But anyway, in all these situations,

the results of the render phase

is not really a list of DOM updates,

but a list of updates of whatever elements

are used in the host that's being used.

So the term virtual DOM, then,

also doesn't really make much sense

when we look at it from this angle,

which is just one more reason why the React team prefers

the more accurate name of React Elementary.

Now, all these details are of course

not really that important.

What I want you to retain from this slide

is that the React Library is not the one responsible

for writing to the DOM,

because the DOM is just one of many hosts

to which React apps can be committed,

so to which they can be output, basically.

And for each of these hosts

we have a different package that we can use.

And that's why in our index.js file,

we always import both React and React DOM, right?

And so now you know the exact reason why we have to do that.

All right, so after looking at all these phases

in so much detail, let's do a quick recap here

and summarize everything that we have learned.

So the whole process of rendering

and displaying a React application on the screen

starts with a trigger, which can either be

the initial render of the app or, a state update

in one of the component instances.

This then triggers the render phase

which does not produce any visual output.

So this phase starts by rendering all component instances

that need a re-render.

And rendering in React simply means

to call the components functions.

This will create one or more updated React elements

which will be placed in a new virtual DOM,

which is actually simply a tree of React elements.

Now, what's really important to remember

about this process is that rendering a component

will cause all of its child components

to be rendered as well,

no matter if props changed or not.

This is because React doesn't know

whether children have been affected

by the parent re-rendering or not.

Now, next up, this new virtual DOM needs to be reconciled

with the current fiber tree.

So with the representation of the elementary

before the state update.

This is necessary because it would be slow and inefficient

to destroy and rebuild the entire DOM tree

each time that something on the screen must be updated.

Instead, reconciliation tries to reuse as much of the DOM

as possible by finding the smallest number

of DOM updates that reflect

the latest state update on the screen.

Now this reconciliation process is done

using a reconciler called Fiber,

which works with immutable data structure

called the fiber tree.

And in this tree, for each React element and DOM element,

there is a fiber, and this fiber holds

the actual component state, props, and a queue of work.

After reconciliation, this queue of work will contain

the DOM updates that are needed for that element.

Now the computation of these DOM updates is performed

by a diffing algorithm, which step by step compares

the elements in the new virtual DOM

with the elements in the current fiber tree,

so to see what has changed.

So the final result of the render phase,

so basically of this reconciliation and diffing process,

is a second updated fiber tree

as well as a list of all necessary DOM updates.

Now, it's important to note

that the render face is asynchronous

so fiber can prioritize and split work into chunks

and pause and resume some work later.

And this is necessary for concurrent features

and also to prevent the JavaScript engine to be blocked

by complex render processes.

But anyway, the output of the render phase,

so the list of DOM updates, will finally actually be written

to the DOM in the commit phase.

So in this phase, a so-called renderer like React DOM

will insert, delete, and update DOM elements

so that we end up with an updated DOM

that reflects the new state of the application.

And unlike the render phase,

the commit phase is actually synchronous.

So all the DOM updates are performed in one go

in order to ensure a consistent UI over time.

Now finally, once the browser realizes

that the DOM has been updated, it starts a new browser paint

in order to visually update

the user interface on the screen.

Okay, and there you have it.

This is how, in a nutshell,

we go from updated React elements all the way

to an updated DOM and user interface on the screen.

So it sure was a really long process

but I hope that you have learned a lot along the way

and that it wasn't too overwhelming.

And again, keep in mind that you can build React apps

without being aware that most of these things even exist.

Now, some of these things do have practical implications

and also implications for performance

but we will talk about those later.

For now, just take a breath

as this was probably the hardest part of the entire course,

so good job of sticking with it to the end.

And let me know what you think

of the series of lectures in the Q and A.

# How Diffing Works

In the lecture about the render phase,

we left out one critical piece,

which was the diffing algorithm that is part

of the reconciliation process.

So we mentioned diffing back then

but we didn't really go into how diffing works.

And since that's really important, let's do that now.

So diffing is first

of all based on two fundamental assumptions.

The first one is that two elements

of different types will produce different trees.

The second assumption is that elements with a stable key,

so a key that is consistent over time,

will stay the same across renders.

Now these assumptions may seem pretty obvious

especially the first assumption

but they allow the algorithm to be orders

of magnitude faster going, for example,

from a billion operations per a thousand processed elements

to just a thousand operations.

Now remember that diffing is comparing elements step-by-step

between two renders based on their position in the tree.

And there are basically two different situations

that need to be considered.

First, having two different elements at the same position

in the tree between two renders

and second having the same element

at the same position in the tree.

So those are the only two situations that matter.

And so let's now start with the first situation.

So let's say that

at some point an application is re-rendered,

and in the diffing process,

we find that an element has changed

in a certain position of the tree.

Now here we're actually not looking at a tree

but at the JSX code, which leads to that tree because I find

that it's a bit easier to understand this way.

But anyway, in the case

of a DOM element changing like this, changing simply means

that the type of the element has changed

like in this example from a div to a header.

So in a situation like this, React will assume

that the element itself plus all its children

are no longer valid.

Therefore, all these elements will actually be destroyed

and removed from the DOM.

And that also includes their state, which is really

important to remember.

So as we see in this example, both the diff element

and the search bar component will be removed from the DOM

and will then be rebuilt as a header with a brand

new search bar component instance as the child.

So if the child elements stays the same across renders,

the tree will actually get rebuilt,

but it gets rebuilt with brand new elements.

And so if there were any components with state

that state will not be recovered.

So this effectively resets state

and this has huge implications

for the way that React applications work in practice.

And that's why we will see some examples

of this behavior in the next lecture.

Now, everything we just learned works the exact same way

for React elements, so basically for component instances

as we can see in this second example.

So here the search bar component changed

to a profile menu component

and therefore the search bar is again completely destroyed

including its date and removed from the DOM.

Okay, so this is the first situation.

The second situation is when between two renders

we have the exact same element

at the same position in the tree.

And this one is actually way more straightforward.

So if after a render, an element

at a certain position in the tree is the same as before,

like in these examples right here,

the element will simply be kept in the DOM.

And that includes all child elements

and more importantly, the components state.

Now this may sound pretty obvious

but it actually has some important implications in practice.

So again, the same element at the same position

in the tree stays the same and preserves state, and it works

like this for DOM elements and for React elements as well.

Now, looking at these examples

we actually see that something has changed.

However, it was not the element type that has changed

but simply the class name attribute in the diff

and the weight prop in the search power component.

And so what React is gonna do is to simply

mutate the DOM element attributes.

And in the case of React elements

it'll pass in the new props, but that's it.

So React tries to be as efficient as possible

and so the DOM elements themselves will stay the same.

They're not removed from the DOM, and even more importantly

the state will not be destroyed.

Now sometimes we actually don't want this standard behavior

but instead to create a brand new component instance

with new state.

And so that's where the key prop comes into play

as we will learn about after seeing these rules

that we just learned about in action.

# Diffing Rules in Practice

In this lecture,

I just want to quickly demonstrate

the diffing rules that we just learned in our project,

so that you can see that they actually

do have a practical effect in the real world.

So let's start by examining a bit better

what happens as we use this tab component.

So again, here we have this button that when we click,

we'll hide that paragraph, right?

And also when we click here,

then we update the state and the likes number increases.

So that's what happens in this tab.

But now, watch what happens when we go to another tab.

So you see that the text is still hidden

and the number of likes is still at four.

So what this means is that the state

of this tab component instance has been preserved.

Now, if we hadn't learned about this

in the previous section,

then this would look really strange, right?

Because we would expect that whenever we go to a new tab,

that the state would be reset.

But that's not what happens.

So as we click around here, the only thing that happens

is that this title here is changed.

I mean, this text down here also changes

but it stays invisible.

So here the text changed,

and the state again stayed the same,

and the same here for the number of likes.

So what is actually happening?

Well, basically each time that we click

on one of these tabs,

the tab component down here is re-rendered.

However, as we can see down here in this component tree

as we keep clicking around,

we see that the tabContent component instance

always stays in the exact same position in the tree.

And so with this, we are now in the situation

that we learned in the previous lecture,

where we have the same element.

So in this case, the same component in the same position.

And so because of that,

the state is preserved across renders.

So just like we learned before.

So again, as we keep clicking around these tabs here,

this component instance here is actually not destroyed.

So it stays in the DOM

and the only thing that changes

is the props that it receives.

So of course, the props will change.

So where is that?

Right here?

So you see that now as I click here,

then of course, down here the prop will have changed.

But that's the only thing that changes.

So the state, again, remains completely unchanged.

But what if we now click on this tab number four?

So as we can see in our code, in this case,

so when the tab num is three,

actually this DifferentContent component

will be rendered, right?

And so let's see what's going to happen.

So we have number four here and we have the text closed.

So now we click here.

And immediately we see that we get

a completely different component instance right here.

So it's still in the same position of the tree

but it's no longer tab content, but different content.

And so now when I go back, watch what happens.

So now the state has actually been reset.

And so that's because the tab content

that we had here before has been completely destroyed

and removed from the DOM in the meantime.

So while we were at the different content,

and so that's why I placed this string here

which says that this is a different tab

and so it resets state.

And so indeed, if we keep going here, maybe we hide this.

Then again, when we go here, and we go back,

then the state has been reset.

Because again, in the meantime,

this component here has disappeared and with it it's state.

So this is a direct consequence of the diffing rules

that we just learned about.

And so this means that these rules are very important

actually in practice.

So you can see the situation happening all the time.

And actually, we saw the exact same thing

in or it, and split application.

But don't worry about that for now

because we will come back to that app,

actually in a few lectures from now.

Now sometimes of course, we do not want this behavior.

So actually, just as I was saying

in the last lecture as well.

So for example, let's say I hide the details here

but then, I actually expect that when I go to a new tab

that it starts again with the default,

so with this opened again.

So again, usually this is not what we want.

And so let's take a look at how we can solve this

in the next video.

# The Key Prop

Remember how I mentioned the key prop

when we talked about how the diffing algorithm works.

And so, let's not take some time

to look at the key prop in detail

in order to learn what it does and when we need to use it.

So, the key prop is a special prop

that we can use to tell the differing algorithm

that a certain element is unique.

And this works for both DOM elements and React elements.

So in practice, this means that we can give

each component instance a unique identification,

which will allow React to distinguish

between multiple instances of the same component type.

Now that's all great, but why do we actually need this?

Well, remember that the second assumption

of the diffing algorithm

is that whenever an element has a stable key,

so a key that stays the same across renders,

the element will be kept in the DOM,

even if the position in the tree has changed.

And this is the whole reason why we should use the key prop

in lists as we have already done

so many times throughout the course.

And so, in the next slide,

you will finally learn why we need to do that.

On the other hand, when the key

of a certain element changes between renders,

the element will be destroyed and a new one will be created

in its place, even if the elements positioned

in the tree is exactly the same as before.

And so this is great to reset state,

which is the second big use case of the key prop.

But let's go back to the first big use case of the key prop,

which is to use keys in lists.

And let's start by considering this example without keys.

So here, we have a list with two question items,

which clearly have no key prop

but let's see what happens when we add a new item

to the top of the list.

Well, the two list items that we already had are clearly

still the same, but they will now appear

at different positions in the React Elementary.

They're no longer the first and second children

but now they are the second and the third children.

So, we basically have the same elements

but at different positions in the tree.

And so according to the differing rules

that we learned earlier, these two DOM elements

will be removed from the DOM and then immediately recreated

at their new positions.

And this is obviously bet for performance because removing

and rebuilding the same dumb element is just wasted work,

right? But the thing is that React

doesn't know that this is wasted work.

Of course, we developers intuitively know

that these two elements are actually the same as before

but React has no way of knowing that.

But what if we could actually change that?

Well, that's where keys come into play because remember,

a key allows us developers to uniquely identify an element

so we can give React that information

that it doesn't have on its own.

And so now when we add a new item to the top of the list,

the two original elements are of course,

still in different positions of the tree

but they do have a stable key.

So, a key that stays the same across renders.

So that's q1 and q2 in this case.

And so according to the differing rules,

these two elements will now be kept in the dump

even though their position in the tree is different.

So, they will not be destroyed.

Entry result will be a bit more of a performant UI.

Now of course, you won't really notice this difference

on small lists, but it will make a huge difference

when you have a really big list with thousands of elements,

which can actually happen in some applications.

So in summary, always use the key prop

when you have multiple child elements of the same type.

So just like the question elements in this example

and you already knew that you should do that because well,

otherwise, React will complain and give us a warning

but now, you hopefully understand exactly

why you need to do it.

Alright, so we looked at the use case for a stable key.

And so now let's look at the use case for a changing key,

which is used to reset state in component instances.

Now here, we don't need a big code example

because we will do this in practice in the next lecture.

But let me just show you what I mean by resetting state.

So, let's say we have this question, inside question box

and we pass in this object as a prop.

Now the question component instance has an answer state,

which right now is set to React allows us

to build apps faster.

But now, let's imagine that the question changes

to this one.

So, we still have the same element at the same position

in the tree.

All that changed was the question prop.

So, what do you think will happen to the state in this case?

Well, let's remember one of the diffing rules, which says

that if we have the same element at the same position

in the tree, the DOM element and its state will be kept.

Therefore, what's gonna happen is that the state of question

will be preserved.

So, it will still show the answer

that was in the component state before.

But that answer is

of course completely irrelevant to this new question, right?

So, it doesn't make any sense to keep this state

around here.

So basically, what we need is a way to reset this state.

And as you can guess,

this is where the key prop comes into play once again.

So now, we have a key of q23

in this first question, which allows React

to uniquely identify this component instance.

Then when a new question appears,

we can give it a different key.

And so by doing this, we tell React

that this should be a different component instance

and therefore, it should create a brand new DOM element.

And the result of doing this

is that the state will be reset,

which is exactly what we need in the situation

in order to make this small app work in a logical way.

So, whenever you find yourself

in a position where you need to reset state,

just make sure that you give the element a key

and that the key changes across renderers.

Now, this actually is necessary very often

but you will sometimes find yourself in this situation.

And so when this happens,

it's very important to know that this is the solution.

Okay.

And to make this even more clear now,

let's go back to our small project.

# Resetting State With the Key Prop

So let's now use

what we just learned about the key prop to our advantage

and fix our tabbed component.

So, as we have just explored previously,

as we change the state here in this tab component,

that state will be preserved as we re-render that component.

And so, again, that's because this component

is exactly of the same type as before,

so it stays the same element between renders,

and it also stays in the exact same place

in the component tree.

And so, therefore, its state is not reset.

It is only reset when we change

to a different component type here.

So now that's different content and then change back.

So now, in the meantime, our state was lost.

But if we do this and then change here,

then the state is preserved across renders.

Now, as we were saying also before,

this is usually not what we want.

And so, let's now use the key prop to change this.

And actually, it is extremely easy.

All we have to do is to give this tab content here

a different key for each of the tabs, basically.

So then each time that this tab content component here

is re-rendered, it'll get a different key.

And so then React will see it

as a unique component instance.

And therefore, then the old one will be destroyed,

and the state will be reset.

So just as we just learned in the previous lecture.

And so let's do that.

So let's give it a key that will change between renders.

So something unique here.

So, let's take

the content object again

at the current position,

and then let's, for example, take the summary.

All right.

So, here we do not have like a unique ID,

but we can see that the summary is always different.

And so, as soon as the tab content component

will be re-rendered,

then not only this item here will change

but also the key.

And so we are then in that situation

where the key changes across renders.

And again, that will then reset our state.

So let's hide this here.

Let's improve our likes.

And then let's go to another tab.

And beautiful.

So you see that our component state has indeed been reset.

And again, that's just because

React now views this as a completely different instance

of tab content.

And we can see that here

because now our dev tools display this key.

And when we move here, then we get another one.

And so, yeah, this is exactly how React

now makes each of these tab contents here unique

and distinguishes between them.

Yeah.

So this is really nice, really helpful.

And so you really need to understand what just happened here

and then keep it in mind for future situations.

So I actually still remember personally when I first learned

about the power of the key prop here.

So this was actually a key learning moment for me.

So it was really eye-opening.

And so I hope I could provide

the same experience here for you.

So this key prop here, it looks very simple

but it can make a huge difference.

And so let's now actually also use this key prop

in the eat and split up that we built before.

So let's do that in the next video.

# Using the Key Prop to Fix Our Eat-'N-Split App

So, as I was just saying

let's now go back to our Eat-'N-Split app

to fix one problem that we have left in that application.

So, let's come to our desktop

and then grab the project folder and open it in VS Code.

Okay, and so now we have two VS Code windows open,

and we will also start two React apps at the same time.

So, let's just write npm start,

hit enter, and then it will ask you

to use another port instead.

And so, that's simply because you're already running

one app here in this other port, and of course,

each one can only have one app running.

So, just hit enter or Y

as you reached this step, and then you will see

your application pop up right here.

Let's get a bit more space,

and then, let me show you the problem

that we actually left here.

So, let's say that we typed some values in here,

and then, we moved to another friend.

So, here we have exactly the same problem as before.

So, as we select another friend,

the only thing that changes is really the props

that is being passed here into this component.

So, let's check out the name of that component

as I don't remember it.

So,

yeah, it's this FormSplitBill.

So this one receives the selectedfriend object,

but as you see here, as we change,

nothing changes in the dumbtree.

And so, across these re-renders,

exactly the same component is rendered in exactly

the same position of the tree.

So, just like before.

And so, therefore, the state is not reset across renders,

but also just like before,

this is not the behavior that we would expect

in this application, right?

So, if suddenly we move from one friend to the other one,

we would certainly expect that the bill value here

should be reset.

So how can we do that?

Well, let's see where we are using this form SplitBill.

So, that should be somewhere here in the app probably.

So,

yeah, here it is.

And so, now we basically need to make

each component instance here unique

so that each time that it is rendered

with a new friend, React will see this

as a completely new component instance.

And as you already know, the way we do that

is by providing a key

that will actually change across the re-renders.

So here we can use the selectedfriend.id,

I guess.

So let's just see if they actually have an ID,

and, yeah, they have.

So, we could also use the name here, really.

So, those are also different, but the ID is really

a unique identifier.

So let's see.

So we are at Sarah, and so, therefore,

let's see down here.

So, here we see that the key now is 933 whatever.

And so, let's move to another friend.

And there we go.

So we fixed our problem

because now, the component instance has another key,

and so, therefore it is a completely unique instance

right now.

Great, and that's actually it.

So that's all we have to do here.

So let's close this one.

And let's also close this.

So we are finished.

We are back in our project that we were working on before.

And so, yeah, there's nothing left to do.

And so, let's move on right to the next lecture.

# Rules for Render Logic: Pure Components

In order for the rendering process to work

in the way that we just learned before,

our render logic needs to follow some simple rules.

So, let's look at these rules in this lecture

but first of all, what actually is render logic?

Well, in order to understand that,

let's actually take a look at the two types

of logic that we can write in React components.

So, that's render logic and event handler functions.

So, render logic is basically all the code that lifts

at the top level of your component functions

and that participates in describing how the view

of a certain component instance should look like.

So in this code example, there is a lot of render logic.

So we have these two lines of code at a top level

and then also the return block where our component returns

it's JSX.

So these describe exactly how the component

will be displayed on the screen.

However, if we look closely, we can identify

yet another piece of render logic here, even though

this code is actually inside a function.

So as you can see in the return block, the code there

is actually calling this createList function.

And therefore, that logic also participates

in describing the component view.

And so, it's also render logic.

So basically, render logic is all the code

that is executed as soon as the component is rendered.

So each time that the function is called.

Now moving on to event handler functions,

those are very easy to identify.

So, they're basically pieces of code that are executed

as a consequence of the event that the handler

is listening to.

So in our example, we have this line of code

that essentially registered handle new answer

for the change event and therefore handle new answer

is our event handle function.

And this is of course nothing new at this point.

So we have done this many times in the course, right?

But it's still important to differentiate

between these two types of logic

because they do actually do fundamentally different things.

So while render logic is code that renders the component,

event handlers contain code that actually does things.

So basically code that makes things happen

in the application.

So, event handlers contain things like state updates,

HTTP requests, reading input fields, page navigation,

and many more.

So all things that basically change

and manipulate the application in some way.

Now why is this all so important?

Well, it's important because React requires

that components are pure when it comes to render logic

in order for everything to work as expected.

But what does pure actually mean?

To answer that, let's have a quick refresher

on functional programming principles,

which are quite important in React in general.

And let's start with side effects.

So, a side effect happens whenever a function depends

on any data that is

outside the function scope, or even more importantly

whenever a function modifies data that is outside its scope.

And I like to think as a side effect

as a functions interaction with the outside world.

For example, this function is mutating an outside object.

And so this is clearly a side effect.

Other examples of side effects are HTTP requests,

riding to the DOM, setting timers and more.

The other important functional concept is pure functions,

which are basically functions without side effects.

So basically, these are functions that do not change

any variable outside their scope.

Also, when we give a pure function the same input,

it'll always return the same output.

For example, this function is clearly a pure function

because if we give it the same argument r,

it'll always give us the area

of the circle based on that r value.

So the output only depends on the inputs,

which makes this function predictable.

This other function right here on the other hand

is completely unpredictable

because it returns a string that contains a date

and that date changes every second.

So in this case, even

if we give the function the same input,

the output will always be different

because the date will always be different

and therefore, this is an impure function.

And the same is true for the second function.

So notice how this function mutates an outside variable,

which of course makes this function impure as well.

Now, calling functions impure makes it sound

as if side effects are somehow bad

but that's actually not true.

So, side effects are not bad in themselves.

In fact, if we think about it,

any program can only be useful if it has some interaction

with the outside world at some point, right?

Like a web application that never affects any data

or never writes to the DOM is just completely useless.

However, in order to make useful and bug-free applications,

we need to know when and how to create side effects,

which brings us back to React

and its rules for render logic.

And essentially, there's just one big rule,

which is that components must be pure functions

when it comes to render logic.

This means that if we give a certain component instance

the same props, so the same input,

then the component should always return

the exact same output in the form of JSX.

In practice, this means that render logic

is not allowed to produce any side effects.

So in other words, the logic that runs

at the top level and is responsible

for rendering the component should have no interaction

with the outside world.

This means that render logic is not allowed

to perform network requests to create timers

or to directly work with the DOM API.

For example, listening to events using at event listener.

Now, according to what we learned previously,

render logic must also not mutate objects

or variables that are outside the scope

of the component function.

And this is actually the reason why we cannot mutate props,

which remember is one of the hard rules of React.

And so now you know why that rule exists.

It's because doing so would be a side effect

and side effects are not allowed.

Finally, we really cannot update state

or refs in render logic.

And updating state in render logic would actually create

an infinite loop, which is why we can never do that.

State updates are technically not side effects

but it's still important for them to be on this list.

Now, there are other side effects that are technically

not allowed as well, but that we create all the time

like using console.log or creating random numbers.

So these are clearly interactions with the outside world

but they don't seem to do any harm.

And so we can safely keep doing them.

Alright, but now you might be wondering if all this stuff

is not allowed, then how will I ever be able

to make an API call to fetch some data?

Well, keep in mind that these side effects

are only forbidden inside render logic.

This means that you have other options

for running your side effects.

First of all, we saw earlier that event handler functions

are not render logic and therefore, side effects

are allowed and actually encouraged

to be used inside these functions.

And second, if we need to create a side effect as soon

as the component function is first executed,

we can register that side effect

using a special hook called useEffect.

But we will learn all about that in the next section.

For now, let's move on to another super important topic,

which is state update batching.

# Rules for Render Logic: Pure Components

So we have dived really deep

into some aspects of the render phase,

like the rules for render logic, and how the key prop works.

But now let's take one step back,

and go back to one very important aspect

of the first triggering phase,

which is the fact that state updates are batched.

So in that first lecture about how rendering works,

we had this sentence, which says

that renders are not triggered immediately.

And so in this lecture I want to focus on this part

which says that there is also batching

of multiple setState calls.

Now, as always, the easiest way of explaining

difficult concepts is by using a small code example.

So here we have three pieces of state,

defined using the useState hook,

and we also have a button in the user interface.

Then whenever there is a click on the button,

the event handler function named reset is called.

In this function, the three pieces of state,

answer, best, and solved,

are basically reverted back to their original state

and therefore, this function is called reset.

Now, actually this is the part

that interests us in this lecture.

And so let's now focus only on the event handler function.

Now what I want to do here is to analyze

how these three pieces of state

are actually updated behind the scenes.

So we might think that, as React sees

the set answer function call,

it would update the state to the empty string as requested,

and then trigger a re-render, and the commit phase,

then it would move on to the next line,

and to the same thing again,

and finally do the entire thing

one more time for the third state update.

So intuitively, we would think that,

if there are three state variables

being updated in this event handler,

then React would re-render three times, right?

However, this is actually not how it works.

So this is not how React updates multiple pieces of state

in the same event handler function.

Instead, these state updates will actually get batched

into just one state update for the entire event handler.

So updating multiple pieces of state

won't immediately cause a re-render for each update.

Instead, all pieces of state inside the event handler

are updated in one go.

So they are batched, and only then

will React trigger one single render and commit.

And conceptually, it makes sense that React works this way,

because if we're updating these pieces of state together,

it probably means that they should just represent

one new view, and therefore,

React only updates the screen once.

So if these date updates belong together,

it really wouldn't make much sense

to update the screen three times.

Doing so would also create two wasted renders,

because we're not interested in the first two renders,

only the final one, which already contains

all the three state updates.

Therefore, the fact that React

automatically batches state updates in this way

is yet another performance optimization

that React gives us out of the box.

Now, batching state updates is extremely useful,

but it can also have surprising results.

So let's turn our attention to this line of code now,

where we reference the answer state variable

right after updating it.

So what do you think will be the value

of this variable at this point?

Well, let's try to think about this.

So remember, that component state is stored

in the fiber tree during the render phase.

Now, at this point in the code,

the render phase has not happened yet.

So React is still reading the function line by line

to figure out what state needs to be updated,

but it hasn't actually updated the state yet,

and it also hasn't re-rendered yet.

That's the whole point of batching state updates

in the first place, right?

So what this means is that, at this point of the code,

the answer variable will still hold the current state.

So the state before the update,

even though we already told React to update it.

So at this point we say that our state is stale,

meaning that the state is no longer fresh and updated,

because in fact, a state update will only be reflected

in the state variable after the re-render.

And so for this reason, we say that updating state in React

is asynchronous, and again, it is asynchronous

because React does not give us the updated state variable

immediately after the set answer call,

but only after the re-render has happened.

Now, the same thing is also true

whenever there is only one piece of state being updated.

So no matter how many state variables are being updated,

the updated state is only available

after the re-render, not immediately.

Now, sometimes we actually do need the new value

immediately after updating it, and in the case,

that we need the new value

in order to update the same state again.

Or in other words, if we need to update state based

on a previous state update in the same event handler,

we can pass a callback function into the set state function

instead of a single value.

And we have actually done this in practice

all the time, right?

Now, so far, we have only talked about batching

in event handler functions, like our reset function.

That's because before React 18,

React only did automatic batching in event handlers,

but not in situations that happen

after a browser event has already happened.

However, there are certain very important situations

in which we do need to update state,

long after a browser event, like a click, has happened.

Examples of that are timeouts and promises,

for instance, we might want to run our reset function

only a second after a click event,

or we might want to run it after some data has been fetched.

So it would be nice to also have automatic batching

in those situations to improve performance, right?

Well, that's actually one of the important features

that React 18 gave us.

So before React 18, if this reset function

was called by a timeout, or by a promise,

state updates inside the function would not be batched.

Instead, in these situations, React would actually

update the state variables one by one, and therefore,

in this case, render three times.

Now another case is handling native events using DOM methods

such as addEventListener, where state updates

also used to not be batched, but now they are.

So again, if you're using the latest React version,

you will now get automatic batching all the time,

everywhere in your code.

And if, for some reason, you are working

with an older version of React, maybe at your work,

it's important that you know that batching used to work

in a different way before version 18.

Now, there are also some extremely rare situations

in which automatic batching can be problematic.

So if you ever find yourself in a situation like that,

you can just wrap the problematic state update

in a ReactDOM.flushSync function,

and React will then exclude that update from batching.

But you will most likely never need this.

I'm just mentioning this here,

so that you know that it exists.

Now, okay, and that's it about state update batching.

It turned out to be a bit longer than I thought,

but as always, there is just

so much interesting stuff to learn,

and so I hope that you don't mind at all.

But in any case, let's quickly go to the next video,

so I can show you some of this in practice.

# State Update Batching in Practice

All right, so let's move back to our project,

and see how React batches state updates in practice

and how this state updating is in fact asynchronous.

So let's come down here to our TabContent component,

and then let's play around a little bit with the states

that we have here.

And first of all, I want to now implement the functionality

of this undo button here.

So this undo will basically undo

or reset the two states that we have here.

So this one, and this one.

So let's write a simple function handleUndo.

And then what it does is setShowDetails back to true,

and set the likes back to zero.

And then let's use that handler right here.

So easy enough, handleUndo.

And yeah, that works great.

So as we just learned in the previous lecture,

inside of this event handler function here,

these two state updates are batched.

So they will only cause one component re-render.

Now how can we actually prove that?

Well, one simple way is to lock something

to the console here.

So let's say render.

And so then each time that the component gets re-rendered,

and so then each time this console.log will log render

to the console.

So let's see.

Let's first get rid of these other ones that we had here.

So here there are, and okay.

Now nevermind this one here that is a bit more grayed out.

This is coming from somewhere else.

So only this one render here is important.

So this first render string here

comes from the initial render of this TabContent component.

And if we go to another tab, then we get another one,

because of course, then this component here is updated.

Now, okay.

Now let's remove this, so that we start empty,

or actually we will see a few more.

So each time that we click here,

the component function gets rendered,

and so then the console.log is executed.

And so this is actually a really nice way of proving

that rendering is calling the component function.

Now, all right?

But now let's empty this.

And then as I click this button here,

we should only see one render here,

which would then mean that these two state updates

were batched.

So let's see.

And indeed, we only get one here.

Great.

Now let's also see that the state updating is asynchronous.

So basically, if I try to access the number of likes here

right after updating the state, then what happens?

So first I need to of course increase a little bit,

then let's clean this.

And as I reset, well, we get five,

which might be surprising.

But if you paid good attention in the previous lecture,

then this will actually no longer come as a surprise to you.

So the reason that here we get five is that the state

is in fact actually only updated after the re-rendering,

or basically during the re-rendering,

but not immediately after we call dysfunction.

So that's impossible.

And therefore, here we still get that old likes state,

which again is still at five.

Then now it is of course at zero,

because now the re-rendering has already happened.

Now, by the way, what do you think will happen,

so what do you think will get rendered

if we click the undo button again?

So let's clear this.

And so let's see what happens.

So I click this now, and you see that no render

was logged to the console.

So why do you think that is?

Why was the component instance not re-rendered this time?

Well, it's because both of the state values

were already at their default basically.

So details was already true and likes was already zero.

And so then as we attempted to update the state,

both of them were actually not updated.

And again, that's because the new state

was equal to the current state.

And so in that situation,

React will not even try to attempt to update the state,

and then of course, it will also not re-render

the component instance.

And so that's why, well, nothing happens.

So as we keep clicking here, of course,

the console.log keeps getting executed,

but again, the component itself is not re-rendered.

Okay, but let's move on here,

and let's implement this next button here.

So here I have these three pluses,

which means that when I click here,

I actually want like a super like,

so this should then improve by three.

So let's create a function for that.

And I will just copy this one.

And let's call it TripleInc.

And then I'll just duplicate this here.

And then let's come down here,

onClick and then handleTripleInc.

Okay, let's go back to our function,

because this will become very important.

So what do you think is going to happen

when I click here now?

Again, let's close.

So what do you think will happen

to the state here in particular?

So let's see.

And well, it only increased once,

so not three times as we might expect.

But were we actually really expecting

that it would increase three times?

I mean with what we already know,

we should know that this here could never work.

So let's see why that is.

So right here at the beginning of dysfunction

likes was zero, right?

And so then here, setLikes would be zero

plus 1 equals 1, right?

So this one is pretty clear, but then what in the next line?

So what is the value of likes here in this line?

Well, it is actually still zero.

And so that's because the state update

is once again, asynchronous.

So we do not get access to the new state value

after this line of code right here.

And so this is exactly what happens down here.

So here, the state is now stale,

so as we learned in the previous lecture as well.

So we can very easily see that here again

with this console.log.

So if I click again, and actually I want the other one.

So this one here, well then you see that it became two,

which is exactly the value that we had before.

And so here it was 2 plus 1 made this new 3.

But here, it was still 2, and here as well,

and here as well.

So how could we make this work

if we really wanted to update the state

three times like here?

I mean, of course, we could just do this,

but this is not the point here.

So we are trying to learn how we could do this right here

in another way.

So actually, we have been doing that all along.

So all the time, whenever we were updating state

based on the current state,

we would use a callback function instead of just a value.

So we also talked about that in the previous lecture.

And so now the time came where we really learn

why we have been doing it with the callback function

all the time.

So let's remove this here or comment it out.

And then let's do it the right way.

So setLikes, and now we pass in the callback function.

And then as you already know,

the first argument here is the current value of the state,

and then we just return the new one.

And again here, likes could be called anything.

Okay, let's do this three times, and then let's reload.

And now, yeah, now it works.

So this is the trick that changes the way

this state is updated.

So here in the callback function,

we do actually get access to the latest updated state.

So initially likes was zero, and then it returned 1.

And so then in the next call here,

this likes in this callback function will be 1.

And so then we can update it

to another one, and to another one.

Beautiful.

And so this is the reason why I've been telling you

that each time that we set state based on the previous state

or based on the current state,

we should always, always use a callback function

like this here.

Now you might be wondering like why should we do that here?

I mean, it works perfectly fine, right?

And you're right about that.

It works perfectly fine,

but we never know what other developers

might do with our functions,

or even what we might do later ourselves.

So let's say that at some point,

we want to change how this function works,

and then without thinking about it, we just do this.

And so then we go back to this not working as expected.

So now we want to increase the likes by 2,

but it will still only increase by 1, right?

Or another situation, maybe, let's comment this one out.

So maybe, here we could think

that we could just call this function here three times.

Or maybe some other developer might think that.

And so then they would get surprised when they see

that this is actually not working, right?

And so again, you should always,

always use the callback function,

because then you are always safe for whatever change

your code goes through in the future.

So with this, it will now work,

but of course, we need to write the correct variable name.

So yeah, now it does work.

So even if you then use the function somewhere else,

by doing this, you are safeguarded about well,

any changes that might occur in the future.

All right.

And now to finish, let's just prove

that automatic batching now works in React 18

even outside of event handlers.

So here we have this button that should undo,

so it should reset our state two seconds later.

Well, that's easy enough.

Let's just create a function called handleUndoLater.

And this function will simply set a timeout,

and then after two seconds, it'll call handleUndo.

So after 2000 milliseconds.

And so what this will do is to schedule

this handleUndo function to be executed two seconds

after this function here was called.

And so then, handleUndo is no longer really

an event handler function.

It's just any function that simply gets called

at a later time.

So that's just what setTimeout does.

So let's then wire that up here with the onClick prop.

So handleUndoLater.

All right.

Let's just then set our state.

Let's clean up here.

And then I just clicked, and let's wait.

And indeed, two seconds later, our state was updated.

And indeed, our component was only rendered once,

which is proved here by this single render string.

Great.

So again, this proves that in React 18

batching happens not only inside event handlers,

but also inside a set timeout.

And the same is true for promises and other situations.

Now, just to really make sure,

and you don't have to do this,

but I like to play around with this stuff.

So what I want to do now is to render this using React 17.

So I will comment this one out, and comment this one, okay?

And then here we need to also change here from here.

And so now this is basically back

to being a React 17 application.

And that's exactly what it says here in this warning.

So until you switch to the new API,

your app will behave as if it's running React 17.

But right now, that's actually exactly what we want.

So now we get some error here, but yeah.

So let's do some state updating here.

Then I will clean and watch what happens

when I click this button now.

So let's wait.

And now we got two re-renders.

And so this does actually prove that before React 18,

automatic batching was not happening inside a setTimeout.

So that's really curious,

but of course, let's now put it back.

All right.

So this was just to show you

that there really is a difference,

so that React 18, well really changed this.

So again, now we should be back to only one.

Yeah, there we go.

Okay, and this is actually all I had to show you here.

So this was a bit longer than expected,

but we did to a lot of stuff here.

So after you do a quick recap of everything we just do here,

or that we did here, actually,

then let's go to the next lecture.

# How Events Work in React

Let's now leave the topics of rendering and state,

and turn towards another essential part

of React applications that we haven't

really talked about yet, and that's events.

So in this lecture, we will learn how React handles events,

and how they work behind the scenes,

but let's start with a quick refresher

on how event propagation and event delegation

work in the DOM,

because this is important to understand how React works,

and also, because I believe that many people

don't have a good grasp on how events

actually work in the browser.

So let's consider this tree of DOM elements,

and note that this really is a DOM tree,

so not a fiber tree or a React element tree.

And now, let's say that some event happens,

like a click on one of the three buttons,

and so here is what's gonna happen in the browser.

As soon as the event fires,

a new event object will be created,

but it will not be created where the click

actually happened.

Instead, the object will be created

at the root of the document,

so at the very top of the tree.

From there, the event will then travel down the entire tree

during the so-called capturing phase,

all the way, until it reaches the target element,

and the target element is simply the element

on which the event was actually first triggered.

So at the target, we can choose to handle the event

by placing an event handler function on that element,

which usually is exactly what we do.

Then immediately after the target element has been reached,

the event object travels all the way back up the entire tree

during the so-called bubbling phase.

Now, there are two very important things

to understand about this process.

The first is that during the capturing and bubbling phase,

the event really goes through every single child

and parent element one by one.

In fact, it's if the event originated

or happened in each of these DOM elements.

The second important thing is that by default,

event handlers listen to events

not only on the target element,

but also during the bubbling phase,

so if we put these two things together,

it means that every single event handler in a parent element

will also be executed during the bubbling phase

as long as it's also listening for the same type of event.

For example, if we edit another click event handler

to the header element,

then during this whole process,

both the handlers at the target and the header element

would be executed when the click happens.

Now, sometimes we actually don't want this behavior,

and so in that case, we can prevent the event

from bubbling up any further simply by calling

the stopPropagation method on the event object,

and this works in vanilla JavaScript, and also in React,

but it's actually very rarely necessary,

so only use this if there really is no other solution.

Okay, so this is essentially how events work in the browser.

Now, the fact that events bubble like this

allows developers to implement a very common

and very useful technique called event delegation.

So with event delegation, we can handle events

for multiple elements in one central place,

which is one of the parent elements.

So imagine that instead of three buttons,

there would be like, 1,000 buttons.

Now, if we wanted to handle events on all of them,

each button would have to have its own copy

of the event handler function,

which could become problematic

for the app's performance and memory usage.

So instead, by using event delegation,

we can simply add just one handler function

to the first parent element of these buttons.

Then when a click happens on one of the buttons,

the event will bubble up to the options div in this example

where we can then use the events target property

in order to check whether the event originated

from one of the buttons or not,

and if it did, we can then handle the event

in this central event handler function.

Now, if you took my JavaScript course,

then you will already know how to do this in practice,

because in fact, we do this all the time

in vanilla JavaScript applications.

However, in React apps, it's actually not so common

for us to use this technique,

but that might leave you wondering,

if this is actually not important in React,

then why are we even talking about this?

Well, for two reasons.

First, because sometimes you find some strange behaviors

related to events in your applications,

which might actually have to do with event bubbling,

and so as a good React developer,

you always want to understand exactly what's going on

in order to fix these problems,

and the second reason is that this is actually

what React does behind the scenes with our events,

and so let's take a look at that.

So let's consider this same DOM tree,

and let's say again that we want to attach

an event handler to one of the buttons,

or even to some other DOM element,

and this is what that would look like in React code.

So we would simply use the onClick prop

to listen for click events, and then pass it a function.

So that's really easy, right?

Now, if we think about how React

actually registers these event handlers behind the scenes,

we might believe that it would look something like this.

So React might select a button,

and then add the event handler to that element,

so that sounds pretty logical, right?

However, this is actually not what React does internally.

Instead, what React actually does is to register this

and all other event handler functions

to the root DOM container,

and that root container is simply the DOM element

in which the React app is displayed.

So if we use the default of Create React App,

that's usually the div element with an ID set to route.

So again, instead of selecting the button

where we actually placed our event handler,

we can imagine that React selects the route element,

and then adds all our event handlers to that element,

and I say imagine, because the way React

does all this behind the scenes is actually

a lot more complex than this,

but that's not really worth diving into here.

The only thing that's worth knowing

is that React physically registers

one event handler function per event type,

and it does so at the root note of the fiber tree

during the render phase.

So if we have multiple onClick handlers in our code,

React we'll actually somehow bundle them all together

and just add one big onClick handler

to the root node of the fiber tree,

and so this is yet another important function

of the fiber tree,

but anyway, what this means is that behind the scenes,

React actually performs event delegation

for all events in our applications.

So we can say that React delegates all events

to the root DOM container,

because that's where they will actually get handled,

not in the place where we thought we registered them,

and so this works exactly how we just learned

in the previous slide.

So again, whenever a click happens on the button,

a new event object is fired off,

which will then travel down the DOM tree

until it reaches the target element.

From there, the event will bubble back up.

Then as soon as the event reaches the root container

where React registered all our handlers,

the event will actually finally get handled

according to whatever handlers match the event

and the target element.

And finally, once that's all done,

the event, of course, continues bubbling up

until it disappears into nowhere,

and the beauty of this is that it all happens automatically

and invisibly just to make our React apps

yet a little bit more performant.

Now, just one small detail that I want you to notice

is that it's really the DOM tree that matters here,

not the component tree.

So just because one component is a child

of another component,

that doesn't mean that the same is true

in the displayed DOM tree.

So just keep that in mind when thinking

about bubbling in React applications.

All right, so we talked a lot about events

and event objects,

and so now, let's finish by taking a look

at how these event objects actually work behind the scenes.

So whenever we declare an event handler like this one,

React gives us access to the event object

that was created, just like in vanilla JavaScript.

However, in React, this event object is actually different.

So in vanilla JavaScript, we simply get access

to the native DOM event object, for example,

pointer event, mouse event, keyboard event, and many others.

React, on the other hand, will give us something

called a synthetic event,

which is basically a thin wrapper

around the DOM'S native event object,

and by wrapper we simply mean that synthetic events

are pretty similar to native event objects,

but they just add or change some functionalities

on top of them.

So these synthetic events have the same interface

as native event objects,

and that includes the important methods,

stopPropagation, and preventDefault.

What's special about synthetic events though,

and one of the reasons why the React team

decided to implement them is the fact

that they fix some browser inconsistencies,

making it so that events work in the exact same way

in all browsers.

The React team also decided that all

of the most important synthetic events actually bubble,

including the focus, blur, and change events,

which usually do not bubble.

The only exception here is the scroll event,

which does also not bubble in React.

Okay, and now to finish, I want to quickly mention

some differences between how event handlers work

in React and vanilla JavaScript.

The first one is that in React, the prop name

to attach an event handler are named using camelCase,

so something like onClick with an upper case C.

In HTML, on the other hand,

it would be onclick, all lower case,

and if we used an addEventListener in vanilla JavaScript,

the event would simply be called click,

so without the on prefix.

Now, in vanilla JavaScript,

whenever we want to stop the default behavior

of the browser in response to an event,

we can return faults from the event handler function,

and the big example of that is the browser

automatically reloading the page when we submit a form.

However, if we would attempt to return faults

in a React event handler, that would simply not work.

So in React, the only way to prevent the browser's default

behavior is to call preventDefault

on the synthetic event object.

And finally, in the rare event that you need

to handle an event in the capturing phase

rather than in the bubbling phase,

you can simply attach Capture to the event handler name,

for example, onClickCapture instead of just onClick,

but most likely, you will never use this,

so just keep this somewhere in the back of your mind.

All right, so what we just learned in this slide

is basically everything that you need to know in practice

in order to successfully work with events in React.

The rest all happens invisibly behind the scenes,

but I hope that you also found the rest

of the lecture interesting,

and that it gave you even more confidence

in working with events in your applications.

# Libraries vs. Frameworks & The React Ecosystem

All right.

And now to finish off this section

let's talk about something entirely different.

So this lecture is not really

about how React works behind the scenes,

but more about what React actually is,

which is a library.

So for future React developers like you

it's important to understand what it means

that React itself is a library and not a framework.

And so let's now learn about the differences,

as well as the React ecosystem.

And to understand the difference

between a framework and a library,

let's start with an analogy.

So imagine that you want to make your own sushi

for the first time,

just like I did recently for the first time as well.

So, you have two choices about how you want to do it.

The first option is to just buy one

of those all in one sushi kits,

which will come with all the ingredients that you need

and so then you don't have to buy anything separately.

All you have to do is to assemble these ingredients

into your sushi.

However, there is also a downside to this

because now you are stuck with the ingredients

that are included in the kit that you bought.

So if you find out

that you don't like one of these ingredients,

then you still have to use it anyway.

Now, instead of getting an all in one kit,

you also have to option to buying

all the ingredients separately.

And so this will give you complete freedom

to choose only the best ingredients

and the ones that you like the most.

On the other hand,

all this freedom can give you decision fatigue

because now for each ingredient

you need to research which brand is the best option

and then you also have to go buy each

of the products separately.

And even worse,

if one of your selected brands changes or is no longer sold

then you need to start the whole process over.

Now, okay,

but probably at this point you're wondering,

"Why is he going on and on about sushi?"

Well, the reason is

that this analogy actually translates beautifully

into the difference between building a web application

using a framework or using a library.

So we could actually just replace the images here

and call it a day.

So, we could describe Angular, Vue, or Svelte, for example

as the all-in one kit

and React as buying separate ingredients.

And the pros and cons of building a web up

with each of these approaches

are basically exactly the same

as in making sushi at home.

Okay, but actually, let's now replace these terms

with their actual definitions

and actually learn what's the difference

between a framework and a library.

So, in the world of JavaScript

a framework is basically a complete structure

that includes everything that you need

in order to build a complete large scale application.

We can say that frameworks

like Angular are batteries included

because they include stuff like routing, styling,

HTTP requests for management,

and more all out of the box.

Now, the downside of this is that you're stuck

with the framework's tools and conventions

even if you don't like or agree with them.

However, that's actually not always bad.

And so this is not a real downside for some developers.

Now, on the other hand,

we have JavaScript libraries,

which are basically pieces of code

that developers share for other developers to use.

And the prime example here is of course, React,

which is what we call a view library,

view because all React does is to draw components

onto a user interface,

so onto a so-called view.

Now, if you want to build

a large scale single page application,

you will need to include many external third party libraries

for things like routing, styling, HTTP requests, and so on.

So all these functionalities are not part of React itself

unlike what happens with Angular and other frameworks.

And so this is how this notion

that React is a library ties into the analogy

of buying separate ingredients to make sushi.

Because to build a React app,

we have to choose all these separate libraries.

Now, don't get me wrong here.

We can actually build React apps with just React itself.

So, without using any libraries,

but that only makes sense for small apps

or while we are still learning React.

Now, being able to choose multiple libraries

in order to build your application

offers you incredible freedom

because you can choose exactly

the ones that you like the most.

And also every app will have different requirements.

And so each app will require a different combination

of libraries.

And so including all of them

in a framework might not even be necessary.

However, on the other hand,

the implication of this is that as a React developer,

you need to be able to find

and download all the right libraries

for your specific application.

And of course, on top of that

you then need to learn how to use these libraries

and even stay up to date with them over time.

But don't worry, it's actually not as bad as it may sound.

So, if you follow this course until the end

you will have a very good understanding

of the most important libraries that we usually include

into most React projects,

which leads me actually to the next point,

which is React's huge third party library ecosystem.

So, React's huge popularity has led to a really,

really large ecosystem of libraries that we can include

in our React projects for different needs like routing

for single page applications, making http requests,

managing remote server state,

managing global application state,

styling, managing forms, animations and transitions,

and even entire UI component libraries.

Now, I will not go over all of them here one by one

because that just takes too much time

and you can also just research them if you need.

So instead, I will show you which ones I consider

the most important libraries

and so these are the ones that we will use later

in the course.

So things like React Router, React Query,

Redux, styled components, or Tailwind.

Now, many React developers actually do feel overwhelmed

by having to take so many decisions and choosing

between so many third party libraries.

And so this fact, among some other reasons,

has led to the development

of multiple opinionated React frameworks

such as Nextjs, Remix or Gatsby.

So, Nextjs or Remix are React frameworks

because they are actually built on top of React.

So they basically extend React's functionality

and they are opinionated because other developers basically

included their own opinions into how to handle stuff

like routing, state management,

or styling into these frameworks.

So, where in a traditional React app,

we have to make decisions about what libraries to include

in an app built with a React framework.

Some of these important decisions

have already been taken away from you, the developer.

And so this makes project development much easier

and much faster,

and it can also lead

to a better overall developer experience.

Now, different frameworks specialize in different aspects,

but all of them offload much of the setup work from you.

Also, all of them offer many other advantages

besides just being opinionated,

such as server side rendering

or static site generation.

In fact, we can even describe many of these frameworks

as full stack React frameworks

because they include so many features

that we can actually build full stack apps with them,

all while using React as the base layer.

But anyway,

this is just a brief overview of React frameworks.

We will learn a lot more about this

in the last part of the course

where we will actually build a very large project

using Nextjs.

Now, this will not be included in the course at launch time,

but I will include it at a later point.

But at this point, I just wanted to let you know

that these frameworks exist

because of course we can only learn about them

once we really master React itself

and also its most important third party libraries.

# Section Summary: Practical Takeaways

Welcome to the last lecture

of this section.

And it was a long

and complicated section, I know.

But hopefully, you enjoyed learning

about all these internal workings of React

as much as I did.

And now, to finish,

I thought it was a great idea

to summarize the key learnings

that you should retain from this section.

Now, this is not a summary

of everything that we learned

but only the practical takeaways and conclusions

that you will actually need

to know in practice

as you build your own React apps

and this is necessary

because I've mentioned multiple times

that you actually don't need

to know all this complicated stuff

about how React works behind the scenes

but you do need to know

the practical implications of it.

And so in this lecture is where I gathered

all those practical implications

in the form of text slides that you can save

and read in the future.

But anyway, let's now move on

to our first point,

which is that a component is basically

like a blueprint for a piece of UI

that will eventually exist on the screen.

When we then use a component,

React creates a component instance,

which is like an actual physical manifestation

of a component, which contains props,

state, effects, and more.

So following the analogy of the blueprint,

the component is like a blueprint for a house

and the component instances

are like the actual houses

that have been built from that blueprint.

Finally, a component instance when rendered,

will return a React element.

Okay, so let's now move on to rendering.

So in React, rendering only means

calling component functions

and calculating what dumb elements need

to be inserted, deleted, or updated later.

So rendering has nothing to do

with actually writing.

So with actually updating the DOM.

Writing to the DOM is actually called

committing in the React language.

So what I want you to remember here

is that each time a component instance

is rendered and re-rendered,

the function is simply called again.

But what actually triggers a render to happen?

Well, as you should probably know already,

only the initial app render

and state updates can cause a render

which will happen for the entire application.

So even though it might look

as if only one single component is rendered,

the process is actually executed for all components.

Now, when a component instance

does get re-rendered, all its children

will get re-rendered as well.

Now, this doesn't mean that all children

will get updated in the DOM

because thanks to reconciliation,

React will check which elements

have actually changed between the two renders.

Now, one of the main parts of this reconciliation

that I just mentioned is diffing.

So diffing is how React decides

which dumb elements need to be added

or modified later.

Now, if between two renders,

a certain React element stays

at the same position in the elementary,

the corresponding DOM element

and the component state

will simply stay the same.

So the DOM will not be modified in this case

which is a huge win for performance.

However, if the element did change

to a different position in the tree

or if it changed

to a different element type altogether,

then the DOM element

and the corresponding state will be destroyed.

So they will basically be reset.

Now, one cool thing about the diffing algorithm

is the fact that we can actually influence it

by giving elements a key prop,

which then allows React to distinguish

between multiple component instances

of the same component type.

So when the key on a certain element

stays the same across renders,

the element is kept in the DOM

even if it appears

at a different position in the tree.

And so this is the reason why

we need to use keys in lists

because it will prevent unnecessary recreations

of elements in the DOM.

Now, on the other hand,

when we change the key between renders,

the DOM element will be destroyed and rebuilt.

And so this is a very nice trick

that we can use in order to reset state,

which is sometimes necessary as we saw

in two practical examples in this section.

Next, we have one very important rule

that you must never ever forget

which is that you should never declare

a new component inside another component.

That's because doing so will recreate

that nested component every time

the parent component re-renders

so that nested component

would always be a new variable basically.

And so this means that React

would always see the nested component

as a brand new component,

and therefore reset its state each time

that the parent's state is updated.

Now, the reason why this happens

is not the important part,

but what matters is that

you should always, always declare.

So you should write new components

at the top level of a file,

never inside another component.

Now, the logic that is responsible

for creating DOM elements

so basically logic that produces JSX

is called render logic

and this render logic is not allowed

to produce any side effects.

So render logic can have no API calls,

no timers, no object or variable mutations,

and no state updates.

The only place where side effects are allowed

is inside event handlers and inside useEffect.

Okay, now, after all this rendering,

it's time to finally update the DOM,

which happens in the commit phase.

However, it's actually not React

that does this committing

but a so-called renderer called ReactDOM.

That's why we always need

to include both these libraries

in a React web application project.

We can also use other renderers

to use React on different platforms.

For example, to build mobile

or native applications with React native.

All right, and now,

for the rest of this last slide,

let's leave the topics related to rendering behind

and quickly talk about state and events.

So when we have multiple state updates

inside an event handler function,

all these state updates will be batched.

So basically, they will happen all at once

and this is super important because it means

that multiple related state updates

will only create one re-render which,

once again, is great for performance.

And since React 18, automatic batching

even happens inside timeouts,

promises, and native event handlers.

Now, one super important practical implication of this

is that we cannot access a state variable

immediately after we update it

which is why we say

that state updates are asynchronous.

Next up, when we use events

inside event handler functions,

we get access to a so-called synthetic event object,

not the browser's native object.

So the React team created synthetic events

so that events work the exact same way

across all browsers

and the main difference between synthetic

and native events is that

most synthetic events do actually bubble

and that includes the focus, blur,

and change events, which do usually not bubble

as native browser events.

The only exception here is the scroll event.

Okay, and now, finally,

let's remember that React is a library

and not a framework.

This means that you can basically assemble

your applications using your favorite

or the community's favorite third-party libraries

and this is great for flexibility

and creative freedom.

The downside of this freedom is that

there is an basically infinite amount

of libraries that you can choose from.

And so you need to first find and then learn

all these additional libraries that you need.

However, that's not that big of a problem

because you will learn

about the most commonly used libraries

in the main projects of this course.

All right, and there you have it.

So this is essentially what I need you to remember

from this section going forward.

And again, I hope that you found this section

as interesting as I did.

But no matter if you did or not,

please leave your comments about it

in the Q and A section.

And now, maybe take some time

to basically recover from all this new material

and all these new concepts that you learned.

And then once you're done,

I'll see you in the next section.