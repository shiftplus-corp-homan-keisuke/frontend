memo from 56 to 67

# Section Overview

In this one, we will keep exploring fundamental React topics

and finally make our components do something.

So we will make components interactive now.

So to do that, we will start learning

how to handle events in React and how to update

the user interface using the extremely important concept

of state.

We'll also start building our next project

where we're gonna focus on state and on building forms

in the React way using controlled elements.

By the end of the section we'll summarize everything

we have learned about props and state,

both in theory and in practice

by building a really nice small flashcards application.

So, once again, a super essential and foundational section

for you and so let's move on right away.

# Let's Build a Steps Component

So, in this section,

we will start to learn about events and state

by building a very simple components

where we can navigate through a few steps.

And so let's now, in this lecture,

start by building out the static part of that component.

Now, in order to build that component,

we will actually create a brand new project

using Create-React-App.

So if you're on Windows,

go ahead and open up your command prompt.

And if you're on a Mac, then just open your terminal.

And remember that in the terminal,

you're always in a folder.

So you can see what folder that is here

in your command prompt.

And then from there, just navigate to the folder

where you want to create your new projects.

And for me, that is, again, the desktop.

So remember that you can see all the folders

that you can navigate to from here.

So I am here in this home folder, basically.

And so I can navigate to any one of these.

And so that's what I'm going to do with cd.

And just by the way, again, on Windows

that's dir instead of ls.

But anyway, I will now navigate to the desktop.

And so now here, let's create our new project.

So that's npx Create-React-App and now here,

remember to lock in the version number five

just so we are all building the same thing here.

So using the same versions.

And then I will simply name this project here, steps.

So then hit enter

and then Create-React-App is doing its thing.

And in the meantime, let's actually check out the component

that we are going to build.

So that's this one right here.

So it's basically this component where we have

these three steps.

And as I said in the beginning, we can basically navigate

through them by clicking here on these buttons.

So when we click next, we go to step number two.

And so then we get apply to jobs.

So first we had learn react, then apply to jobs

and then invest all your new income.

So we can click this buttons here

so we have some interactivity here

and we can then also close and open up this component again.

All right, so again, in this lecture, we will start

by building out the static part of this component.

So just the component basically without any interactivity.

So just writing the JSX.

But anyway, Create-React-App has now finished.

I will just quickly again rename the folder here

and then let's drag and drop it here onto VS code.

And as always, you can also open it right here.

Okay, so let's clean up our starter files a little bit.

And in fact, I will delete almost everything here.

So we will just leave app.js and index.js

so all of them can go to the trash.

And now let's open up index.js.

Now, this time we will actually not write all

of this here again by hand

because now you already know how that works.

And so we can basically keep the code here

that Create-React-App put there for us.

We just need to get rid of this part

and also of this import.

Now we also got rid of the index.css file.

So this import right now doesn't work

but I do actually have a CSS file in the starter files.

So let's open up the files that we downloaded

in the beginning.

Then here in the steps starter files, we have these two.

So let's copy them.

And then in steps, let's place them here in the source.

And then let's also just move this vanilla.HTML

into the public.

So we're going to check out later what that is.

Okay, then going back here

notice how we are importing this app from this file app.js.

And so that's this one.

But here, let's clean everything.

And let's once again start from scratch

by creating a new component.

And as always, that component will be the app component.

So function app and so you see that usually we use

a component called app as the root component

of our application.

So basically as the component that is the parent component

of all the other components.

Let's just return something here.

Hello React.

And finally all we have to do is to export this function

from here.

So export default, so that now index.js can import it here

and render it into the dom.

So just again, like we wrote before by hand

but now we will just leave the code here.

Of course, we don't always have to do everything manually.

Now let's come here to our integrated VS code terminal.

So just by clicking here, and as you see

this is already automatically in our project folder

or at least it should be.

So now there's no need to navigate anywhere.

All we need to do to start a project is to run NPM start.

So this will then automatically open up a new browser tab.

And yeah, here it is.

So this is the content of our app.js.

Alright, just giving ourselves a bit more space here.

And so you notice that the file name here

app.js is exactly the name of the component.

And so this is going to be a pattern

that we will see throughout the course.

But anyway, let's not together write the JSX here

so that we end up with something like this again

just without the interactivity.

So we actually start with a div

that has the class name of steps.

And if you're interested in the CSS, then of course

make sure to check out the CSS file that we just included.

And now this div here has three child elements

so it has a div with the class of numbers.

And so here we will have these numbers.

1, 2, 3.

And now to make this a bit faster, I will just

duplicate the code here, which as I explained to you before

we can simply do with this command here.

So copy line down, I think I actually personalized

this command right here.

So for you, it's probably another one, but you

should see which one it is right here.

And if you want, you can also personalize all your shortcuts

right here.

Okay. But anyway, let's now move on to the next one.

And here we actually want a paragraph,

so a paragraph with the class name of message.

Let's just use a placeholder for now.

And then finally a div again for the buttons.

So here we then will have one button element.

Let's see.

Yeah, this first one says previous

and then another one which says next.

So here basically we have the numbers

then the message and the buttons.

And so what we have here is already looking

pretty close to that.

Now the buttons here are not purple like in the demo

and that's because we will later have another button

which should not have that background color.

And so let's add those stylings here directly

to the two buttons.

And so with this, we can then also practice again

how we add styles to some individual JSX elements.

So remember that we do that by passing in basically

the style prop into this element.

So then we enter JavaScript mode

and then here we can define our object of styles.

So background color

and here the color is 7950F2.

And also the text color, let's set it to white,

which is FFF, and it needs to be a string of course,

since again, this is just a JavaScript object.

Now, in case you're wondering why these colors

are so nicely highlighted, that's simply because I have

this extension called color highlight.

So a very popular one with 5 million installs.

And so if you want to replicate the way this looks

then you can just also install that.

But here, let's just copy all of this

to make it faster.

Next.

And yeah, that's looking pretty close.

All we are missing now is the highlight here

of the current step.

So here we are in step number one, and therefore

it's now highlighted with this purple color.

And for that we have yet another class name.

So class of active now okay, now finally, let's also

add the message here.

And those messages are actually in the CSS file

that I provided for you.

So I placed this JavaScript object here as a comment.

And so let's paste that out here outside of the component.

So this data doesn't depend on anything

that is inside the component.

And so it should be located outside

because otherwise each time that dysfunction here

is executed, this data, so this array will be created again

but we will learn all about that a bit later, of course.

So when objects are created

and when these functions are executed and so on.

So right now we are only learning really

how we use these react features

but not yet how they work behind the scenes.

So the mechanics of react are still a bit hidden to us.

We are only just learning how we use the different features.

So now we need this message here basically.

So the first element of the array right here

but we're not going to just copy it, right?

So we want to read it dynamically.

And so let's hear inside this component, define a variable

which will tell us which step we are currently in.

So let's do const step and let's just set it to one.

And by the way, it is this step here

that we will want to update later

as we click on these buttons.

But for now we are just building here the static part.

So we are just manually setting it to one.

So then let's write step and then the number of the step

and then let's read the value out of the array.

So that's messages at position step.

And we need to minus one here

because of course the array is zero based.

Alright? Ah, beautiful.

So if we now manually change it here to two

then that will then change the message here.

But what didn't change is that this step number two

was not marked as active.

So basically we need to now set the styles here

on these elements conditionally.

So if we just add the class name active to all of them

then they would always be active

but that's not what we want.

So we need to basically determine this string here

based on a condition.

So just like we learned in the previous section.

So let's enter JavaScript mode

so that we can write a template literal.

And so here we will then produce either active or nothing.

So let's enter the JavaScript mode basically

of the template, literal.

And then let's just ask if the step is greater or equal one.

And if so, then the result of the operation

should be the string of active.

And if not, well then just nothing.

So you see that this one here already became purple.

And so that's of course because two is greater than one.

Right let's add this to all of them.

But then here, of course we need to adapt and yeah,

nice, that's working.

So if we had number three

then all three of them would become active.

All right?

And let's just quickly check this out.

So you see now this one has the class of active

and these ones still have the class attribute

because we specified it here

but then there is no string to it.

So that's basically just this empty string that we return

in these two cases.

Great. So that's the static part of the application.

But of course, we want to now navigate here

by clicking on these buttons

so not changing manually here, this step variable, right?

And so that means that it's now time to learn

how we can handle the click events on these buttons.

And so that's what the next lecture

is going to be all about.

# Handling Events the React Way

Handling events in React

is actually pretty straightforward

and so let's now learn how it's done.

So, as you can imagine,

we are not going to use the addEventListener here

because that is the imperative way of building UIs.

But here in React we use a more declarative approach.

So we do not manually select DOM elements,

and so therefore, we do also not use addEventListener.

Instead we use something similar

to the HTML inline event listener.

So instead in React we do something very similar

to the HTML inline event listener.

So basically we will directly listen

for the event right on the element where they will happen.

So right here on the button, for example, we can use the

onClick prop, and then we simply specify a function here.

So, the "Click" is the event name

and then we always prefix it with the "on".

And then we need to write it in camel case.

While in inline HTML

we would write it like this.

So like this, and then specifying a string.

So no camel case,

but this is not HTML it is JSX

and so it's slightly different

just as we learned before in the lecture

about the rules on JSX.

So, again, we will pass in here now a function

and that function will then be executed

whenever there is a click happening on this DOM element.

So in this case, on this button right here.

So, let's create a quick arrow function here.

And all I'm going to do now is to alert

something,

let's say "Previous", and this should already be working.

So if I click here now,

then yes, we get the alert

that is saying "Previous".

and we can do the same thing on the other button.

And here we say "Next".

And so of course then here we will get a different message.

And that's essentially it.

So this is how we handle events The React way.

no addEventListeners,

but instead we specify an event listener function

directly on the element using, in this case,

the onClick prop.

But it could be any other event as well,

So we can specify another event handler.

So let's use the onMouseEnter.

And so now here again, we need to specify a function

and it's really, really important to understand

that it is not a function call, but really a function.

So we cannot simply write,

alert,

"TEST", for example

because watch what happens now as I save.

So you see, immediately we got this "TEST" right here,

and not when a hover over the button.

So why is that?

Well, basically,

as soon as React initializes this component,

so when it first calls this app function,

it'll then see this code.

And so here we are calling alert

and so then, that's exactly what it does.

React will read this code

and then here it finds this function call.

And so it will immediately call this function.

But again, that's not what we want.

We want to basically define a callback function

which will be called at a later time.

And that later time is in this case

when the mouse enters this element.

So you see that now nothing happened,

but as soon as the mouse hovers here,

then this function is called.

So this function is called and, then we get our alert.

So again, very, very important, do not call a function here

but really specify a function value.

Somehow we got that again here,

but nevermind.

So this was just a test anyway, let's get rid of this.

This was just to show you that we can listen, of course,

to more than just a click event.

Now usually

we do not directly define the event handler function

right here in the onClick prop,

but instead we create a separate function

and then pass that function in here.

So let's do that now.

And, so usually we create those event handler functions

right here in the component.

So that's something new that we haven't done before,

but that's perfectly fine.

We can define any functions that we want

here, right inside the component body.

And let's call this one handlePrevious,

And this handle part here in the event handler function

is pretty standard in React development.

So you will see this all the time,

and so then you know immediately that this function

is an event handler function

that is probably being used somewhere

in the JSX of that component.

In this case, it's going to be used right here.

So, handlePrevious.

And what we want to do here, again for now,

is just to alert "Previous".

So if we click here now, that's going to work still.

Great. And once again, really, really important to notice

that here, we are just passing in the function value.

So we are not calling it,

because if we were calling it,

then again, we would immediately see that "Previous".

So React would then immediately run this code here

as it sees it.

All right.

But like this, we are only passing in the function.

Or of course, we could also do this.

But of course, that's very redundant.

So now we are back to just having a function here, right?

It's just a function that calls another one,

so that's not very effective.

But sometimes we will have to do something similar.

But for now, this is the way that makes sense.

And so let's now quickly create another one.

So again, this is usually the way we do it.

So creating a function which starts with handle,

and then we simply pass that function here

into the onClick prop or any other prop that we can use

to handle some other event.

All right, just to make sure that it works,

and indeed it does.

Great. So, this is how we handle events typically in React.

But of course,

now we actually want something meaningful to happen here.

And in particular,

we want to basically change this step value here, right?

And for that, we need something called state.

Now, we have touched on state many times already

but now it's time to really learn what state is

and then how we can use it in practice.

# What is State in React?

So we learned how to use event handlers,

but, now, we want them

to actually do something useful, right?

So we want to make the component interactive.

And for that,

as I have mentioned already, we need state.

Now, without a doubt,

state is the most important concept in React.

So everything basically revolves around state in React.

And, so we will keep learning about state

throughout the entire course.

Therefore, let's start with an overview

of what exactly you will learn about state

while going through this course.

First, we will learn what state actually is,

what it does, and why we need it,

which is what this section is all about.

Then, we need to learn how to actually use state in practice

using the useState or useReducer hooks,

the Context API, or even external tools like Redux.

We will also need to deeply understand

how to think about state in React.

And, so these are topics for future sections.

Okay, and with this out of the way,

we're now ready to learn what state actually is.

So, we have learned

how to pass data into a component by using props,

which, remember, is data

that's coming from outside the component.

But what if a component needs to actually hold its own data,

and also hold it over time?

Also, what if we actually want to make our app interactive

changing the UI as a result of an action?

Well, that's where, finally, state comes into play.

So state is basically data

that a component can hold over time,

and we use it for information

that a component needs to remember throughout its lifecycle.

Therefore, we can think of state

as being the memory of a component.

So that can be quite a helpful analogy I think.

Now, examples of state can be simple things

like a notification count,

the text content of an input field,

or the active tab in a tab component.

It can also be a bit more complex data,

for example, the content of a shopping cart.

Now, what all these pieces of state have in common

is that in the application,

the user can easily change these values.

For example, when they read a notification,

the count will go down by one,

or when they click on another tab,

that tab will become active.

And, therefore, each of these components

needs to be able to hold this data over time,

so over the lifecycle of the application.

And for that reason,

each of these pieces of information is a piece of state.

And notice how I use the term piece of state here,

because just the term state itself

is more of a general term.

So a piece of state, or a state variable,

is just one single actual variable in the component

that we can define in our code.

On the other hand,

the term state itself is more about the entire state

that the component is in,

like the entire condition at a certain point in time.

So, basically, the general term state

is all the pieces of state together.

And if this sounds confusing, don't worry,

these are just some minor differences in terminology.

In practice, we usually use the terms state,

piece of state, and state variable quite interchangeably.

But anyway, let's now move on

to the most important aspect of state,

which is the fact that updating state triggers React

to re-render the component.

So, again, whenever we update

a piece of state in a component,

this will make React re-render that component

in the user interface.

So it will create a new updated view for that component.

And a component's view is basically just the component

visually rendered on the screen,

so in the user interface.

Now, up until this point,

I have always just used the generic term user interface,

but now, we are actually talking about a single component.

And when one single component is rendered,

we call that a view.

And, so all the views combined together

then make up the final user interface.

Now, do you remember this small diagram

that we saw right at the beginning of the course

when we first talked about how React

automatically keeps data in sync with the UI?

Well, state is how React does that.

So state is how React keeps the user interface

in sync with data.

We change the state, we change the UI.

So, summarizing, state allows developers

to do two important things.

First, state allows us to update the component's view

by re-rendering the component.

So it gives us a way to change part of the UI.

Second, state allows developers to persist local variables

between multiple renders and re-renders.

So, if you think about this, state is basically a tool.

And, in fact, it's the most powerful tool

that we have in the world of React.

So, understanding how a state works and what it does,

so understanding the mechanics of state,

will unlock the power of React development for you.

But, before we go understand the mechanics of state,

let's actually first go back to our code

and use this powerful tool in practice for the first time.

# Creating a State Variable With useState

So now that we know what state is

let's try to implement it in our small project.

And just as a quick reminder,

what we want to happen

is that when we click this next and this previous button

we basically want the step to change.

So the step here is currently set to one,

but we want this step variable basically to be dynamic.

And so for that,

we now need to add a new piece of state to our component.

So let's get rid of this

and add that new piece of state.

So in order to use state in practice in a component,

we do it in three steps.

First, we add a new state variable,

then we use it in a code and usually in JSX.

And third, we then update the piece of state

in some event handler.

And so let's start with the first step

which is to actually create the state variable.

And we do so using the use state function

that React provides to us.

So that's use state,

and if now I hit enter on my keyboard

as this use state here is selected

in the VS code auto complete,

VS code will automatically import

the use state function from React.

So this line of code right here.

Now if for some reason that didn't happen

in your code editor,

then make sure that you import the use state function

from React in that way.

So the use state function is a function,

and so it takes an argument,

and the argument that we need to specify here

is the default value of this state variable.

So that's in our case step number one, right.

Now this use state function here

will return an array.

And so actually let's just call it array for now

and then log it to the console.

So just so you see.

And so yeah, now step is no longer defined.

Let's just put that back for a minute.

Step equals one, and then open up our console here.

So this is the array.

And so you see it has two values here.

So this first value, so this number one,

is the default value that we want for our state.

So this one here.

And then the second one is a function

that we can use to update our state variable.

So what we usually do

is to then immediately destructure this array right here.

So first we have step, which again is this first right here.

And so this will be our state variable itself.

And then second, again, we have the function.

And so this one we usually call set

and then the name of the state variable.

So set step in this case.

Now we can get rid of this.

And if we now reload,

we see that our app is already using that piece of state,

so that step variable, because this is exactly

the variable name that we had before.

So we are already using the step in our JSX here,

and here, and also here for this class name.

Okay, so we have completed the first step

of defining the state variable

using the use state function,

and the second step in which we use the state variable,

so this step piece of state in our code.

And so now the third step is to actually update the state

in an event handler.

So let's get rid of this alert

which was just a placeholder.

Or actually let's start with this one.

So at the next one.

So, now it's time to use this set step function here.

So we use set step to update the step state variable.

And so what do we want the step to be?

Well, basically just the current step plus one, right?

So when we click the next button, the step should go one up.

And so that's the current step plus one.

And so now we are ready to test this.

So let's see,

and yeah, that works.

So our component is now dynamic and so congratulations,

you just unlocked the power of state and the power of React.

So what happened here as we clicked on this button

was that the handle next event handle function was caught,

and this event handler then updated the step state.

And so then React automatically rendered

this new component view for us.

So that's just amazing.

Now let's go back here,

and implement also the handle previous function.

And here we basically want the opposite.

So set step, and then step minus one.

So let's see,

and yeah, that works.

However, right now we have a small bug in our app

because watch what happens when I keep clicking here.

So you see step zero and step minus one and so on.

And the same here.

So if I keep going, then of course we have no more elements

in our array to show.

So the array only has three elements.

And so step five or anything below step zero

doesn't make any sense.

And so here in the handler function,

we can simply add a condition in order to prevent that.

So let's just say if the step is greater than one

only then set this step,

and then, here something similar.

So if the step is less than three.

So let's see, let's reload this.

And so now if I click next, so right now the step is three,

so this one here is no longer true.

And so now then this part should not be executed,

and indeed, that works.

So we fixed that small bug

and now our component is working just as we want it.

Great.

Now just a few more things

about the creation of the state variable here.

So first of all, this use state function here

is what we call a hook in React.

And we can identify hooks

because they start with this use keyword here.

So all the React functions that start with use like this,

for example, use effect or use reducer,

and of course, this use state, are React hooks.

And we will learn in detail

what a React hook is a bit later.

But for now, what you need to know

is that we can only call hooks

like use state, on the top level of the function.

So of this component function right here.

So only here is it allowed to call use state

not inside an if statement,

or inside another function, or inside a loop.

So for example, we could not do this.

So immediately React would then tell us

that the use state hook was caught in a function

that is not a React function component.

So we can only do that right here.

So also not in an if statement.

So let's say if true for example,

then let's see, and again, you see immediately

that we get this error saying

that use state was caught conditionally,

and before it actually gets to this dramatic error here,

we can even see in this overlay in VS code

that React hook was caught conditionally.

And this one here is coming from ESLint by the way.

And that's why it was so important

to set up ESLint in the beginning.

Okay.

But anyway, let's remove all of this.

And now the other important thing about state

is that we should really only update state

using this setter function right here.

So not manually.

Now, just to finish, I just noticed that here

we actually don't need this when we use our step here.

So there is no need for a template literal here

because here we are not really creating a new string.

We are just basically outputting a new string

based here on this turnery operator.

But anyway,

we now have this nice dynamic component

all without the imperative dom manipulations

that we need in vanilla JavaScript.

# Don't Set State Manually!

By the end of the last lecture,

I said that we should only update state using

the setter function, but don't just trust me on that.

So, instead, let's actually explore this and break React.

So, just to see what happens when we try

to update state manually.

Now, right now we have this step state here,

defined as a const variable

and so we would not be able to even change it.

So, let's change this to a let

and so then we can actually break this.

So, let's say the tier in handle next,

instead of updating the state in the correct way,

we would do it like this.

So, step equal step plus one.

That would be a perfectly normal way

of updating a variable defined with let, right?

And so right now, this is a let variable,

so a variable that we can update.

And so again, this would be a perfectly normal way

of updating variables in JavaScript.

But let's see what now happens when we click this button.

Well, simply nothing happens.

So, we don't get any error from React,

but simply nothing happens.

And so, the reason for that is that React has no way

of knowing that this is actually trying to update the state.

So, React has no magic way of knowing

that this here is the state variable

and that this operation is basically updating it.

So again, React doesn't know about that

and that's why React provided us

with this setter function here, which is a functional way

of updating the state value, but without mutating it.

Because here we are directly mutating now

this step variable, right?

But React is all about immutability.

And so, therefore, we can only update the state using

the tools that React gives us.

So, in this case, this set step function.

And so this setter function is actually tied

to this state variable right here.

So, when we use this functional way of updating the state,

then React does know that this is the state variable

that should be updated, okay?

So never do this mistake, just always use const

and always use the setter function, okay?

Now, another way in which this could happen,

which might be a little bit less obvious,

is when we use an object or an array for state.

So, let's just do a quick experiment here.

So, let's just say test, for example, and then use state.

And here as a default, we pass in an object.

And let's give it some property of name.

Now, notice that here in the destructuring,

I only took out the state variable itself.

So, I don't even have the setter function now.

And so here, let's say that I wanted to update this name.

Well, let's first actually also print it here.

So, test.name.

So, then we get Jonas there.

And then here, we might think that this

is how we update that state.

So test.name.

And now let's use Fred, for example.

So, just some other name and yeah,

watch what happens when I click next now.

And that did actually work.

So, mutating the object like this did actually trigger

a new re-render of the component view.

However, mutating objects like this is a really,

really bad practice.

So, React really doesn't want you to do this

and that's because sometimes, in more complex situations,

this actually won't work.

And in general, it's really just a bad practice

of mutating objects like this,

especially in a framework like React,

which is all about immutability

and functional state updates.

So, never do this.

So, if you really wanted to update this object here,

we would again create a setter function here.

So, not creating, but basically taking this setter function

out of the result of use state.

And then here we would call that setter function

and then pass in the complete new object.

So, the name should now be Fred.

So, it's back to what we had before now.

And now, if we click next, that still updates the name

to Fred, but it does so in the correct way.

So, always treat state as immutable in React.

So, as something that you cannot change directly,

but that you can only change using the tools

that React gives us.

So, using the state setter function.

# The Mechanics of State

Okay, so we have just seen the power of state

by using the useState function,

but now let's get a better understanding

of how exactly state works in React.

And let's start from a fundamental React principle

that we have already discussed earlier.

So remember how we learned that in React

we do not manipulate the DOM directly

when we want to update a component's view, right?

So React is declarative, not imperative,

and so we never touch the DOM in our code.

But if that's the case,

then this leads us to the question of,

how do we update the component on the screen

whenever some data changes

or whenever we need to respond to some event like a click?

Now, we already know

that the answer to this question is state,

but here we are trying to derive it from first principles.

So anyway, to answer that question,

we need to understand another fundamental React principle,

which is the fact that React updates a component view

by re-rendering that entire component

whenever the underlying data changes.

Now, as soon as we will reach the section

about how React works behind the scenes,

we will learn exactly what actually happens

inside React when a component re-renders.

But for now, just know that re-rendering basically means

that React calls the component function again,

so each time the component is rendered.

So conceptually we can imagine this as React

removing the entire view and replacing it

with a new one each time a re-render needs to happen.

But again, we will learn exactly what happens later.

Now, React preserves the component state

throughout re-renders,

and so even though a component can be rendered

and re-rendered time and time again,

the state will not be reset

unless the component disappears from the UI entirely,

which is what we call unmounting.

Now speaking of state, it is when state is updated

that a component is automatically re-rendered.

So let's imagine that there is an event handler in the view,

for example, on a button that the user can click.

So the moment that button is clicked,

we can update a piece of state in our component

using the set function coming from the useState hook.

So just like we did in the last lecture, right?

Then when React sees that the state has been changed,

it'll automatically re-render the component,

which will result in an updated view for this component.

Or as a more real example,

we can look at the simple advice app

that we built right in the first lecture of the course.

So in that application,

each time we click the get advice button,

a new piece of advice is fetched from the API.

Then when that data arrives,

we store the data in the advice state variable,

so we update the advice state.

So let's imagine

that the new advice is quality beats quantity.

React will notice the state change

and re-render the component.

So it will remove the old one

and display a new updated component view on the screen.

And with this, I hope that the mechanics

of state in React are now really clear to you.

So the conclusion of all this is that as React developers,

whenever we want to update a component view,

we update its state.

And so React will then react to that update

and do its thing.

And in fact, this whole mechanism is so fundamental to React

that it's actually the reason

why React is called React in the first place.

So on a high level, moving from the component level

to the application level now, React reacts to state changes

by re-rendering the user interface.

That's the main thing that it does.

And therefore it was decided to call this library React.

And with this we have come full circle

from the first lecture about why frameworks exist.

There we learned that frameworks exist

to keep UI in sync with data.

And so now we have learned a bit better how React does that.

# Adding Another Piece of State

To practice state a little bit more,

let's now implement the open and close functionality

for our component.

So looking at the demo here,

what we want to implement now is this functionality

that when we click this button here,

then this part of the component disappears,

and then when we click it again, then it is back.

So since this is something that changes on the screen,

that means that we need a new piece of state.

Let's first comment out this other state that we have here

so that we create it for our experiment.

I will not completely delete it,

just to keep it as a reference here.

But anyway, let's now create a new piece of state.

So this is going to be called isOpen,

and then again the convention for the setter

is to call it set

and then the name of the state, so setIsOpen,

so equal useState,

and by default, our component should be open,

therefore, we pass in value of true.

So isOpen starts as true,

and so that's then our default state value

for the isOpen state.

So that's the first part of using state.

The second one is to then actually use the state variable

in our code.

So what do we want to achieve with this state variable?

Well, whenever it is true, we want this here to show.

And if it's false, we don't want this to show.

And whenever it's false, we don't want this to show.

So what this means is that we need conditional rendering.

So let's do that.

Now we cannot wrap all of this here

into JavaScript mode now,

but let's still try.

So I selected all of it

and then I will open the curly braces

to enter JavaScript mode.

But this will not really work

because this can only be done inside some element.

So for example, we would need a div here.

And so then here, close it.

However, React is still not happy.

So what do we have here?

Ah, test is not defined.

So that's because we just removed

this piece of state here from before,

so let's just comment this out and give it a save.

And again, we first needed to create

this div element here outside,

basically to start our JSX.

And so then inside that JSX

is where we can enter the JavaScript mode.

And we need this JavaScript mode here

because now we will use our isOpen.

And then as for the conditional rendering,

let's simply use the end operator,

give it a save, and that's already it.

So whenever this is true,

then this second part here will be returned.

And when it's false, then only false will be returned.

So that's just what we learned in the previous section.

All right.

Now since this is true, nothing happens here,

so this is still visible, but if we were to set it to false,

then our component should disappear.

Yeah, so it's gone.

And therefore what this means is that this is working.

So let's set it back to true,

and with this, we finish the second part of using state.

And now the third part of using state

is to actually update the state.

So for that, we need our button here in the corner

and for that, we need to write some more JSX.

So let's do that here.

So button with a className of close

and then here, we can use an HTML entity of times

which will basically write an X.

There we go.

And now we need our event handler.

So for that, let's again use the onClick prop,

so to directly attach the event handler onto this element.

And this time just to show you,

let me actually create a function in line here.

So instead of creating a handle function out here

like these two,

I will now define the function directly here.

So just to show you that sometimes this is also what we do

especially when we have some very simple logic.

So we need to create a new function,

and now what do we want to do here?

Well, we want to update the isOpen state.

So set isOpen,

and then again, we need to pass in the new state,

so the updated state.

And what should that be?

Well, it should always be the opposite of the current state.

So if this open is true, it should become false,

and if it's false, it should become true.

And the way we do that is by using the not operator.

So again, that's just common and standard JavaScript.

Okay, and this should now already work.

So let's just reload here to get rid of that error.

And yes, beautiful.

That's working nice.

So our view is updated, so it's re-rendered.

And so then after that re-render,

isOpen is no longer true,

but it's false.

Therefore, then this entire part here of JSX

is no longer rendered, right?

But then when we click again,

this function here is called again,

which will then switch isOpen to the other state.

So from false to true, in this case.

And so updating this piece of state

will then cause React to re-render the component.

This time with isOpen to true.

So when React then sees this piece of code, isOpen is true,

and therefore this JSX is then returned.

And so with this,

we update the view right here in our application.

Great.

Now what I want you to notice about this is that...

Let's change the state here.

So again, with this here, we change the step state,

which right now is at number 2.

And now if we toggle this state,

so if we change this state and change it again,

you see that React did indeed remember the state of the step

even though we did re-render this component multiple times

in between, right?

So if we set it to 3, and then again,

I can open and I can close, which means that this component,

so this view here has been reordered two times,

still it will remember this other piece of state.

So the 3 is still here.

And so that's why we say

that state is like a memory of the component.

It can hold this information over time

even though we render and re-render it over and over again.

Great.

So with this, I hope you start seeing

how we can use state in different situations

and for different things in practice.

Now, just one small thing that we could change here,

and this has nothing to do with state,

is that we actually don't want to return

just one element here.

So we want to return basically both,

this part here and the button.

And so this means

that this is a great use case for a React fragment here.

So before I do that, let's just inspect.

And so indeed, we have our root

which is basically everything,

so the entire app.

And then in there, we have this div, which is this one.

But again, let's say we don't want that.

Let's say, we just want to have the button

and then this steps div.

So let's remove this from here and from here.

And so now we have remember a fragment.

So that's like the root of this JSX element here

which will then disappear in the DOM.

So if we take a look now,

then we only have this button and the step div.

So again, whenever you are in a situation like this,

so what you need a piece of JSX to return two elements,

then the fragment is great for that.

# React Developer Tools

As web developers, we rely a lot

on Developer Tools.

So things like the Console

or the Element Inspect panel in our browser.

And so since tools are so helpful for developers

the React team built dev tools specific for React

which can be extremely helpful when working with State.

And so since we're working with State now,

let's go check them out.

And actually since the beginning, we got this message here

in our Console telling us to download these dev tools.

So you can open up your Console

and then here you will find the link

to the place in the React documentation where

we then can find the link to the dev tools.

So here is the link

for the Chrome Web Store and then for the other browsers.

But since we're using Google Chrome

this is the one that we want.

And if for some reason this link here didn't appear

in your Console, you can just Google,

"chrome react dev tools".

So yeah, that's going to be this first one.

And so then once you're on this page or on this one

which is the same, you can just download this extension

and install it in your Google Chrome.

Now, I cannot do this because I'm on a Guest window

so let me quickly fix that.

And so now here in this window I can actually

use these dev tools, as well.

So hopefully you installed the tool.

So just like any other Chrome extension.

And then once you did, down here

once you have these developer tools here already open,

you'll see one tab which appears here

or actually two which are coming from the React dev tools.

So that's this Component tab and this Profiler tab.

And since we're going to use this all the time

we can even drag, well actually not.

Now we can like drag it here to the beginning where

it will then stay.

Now here it says loading React Element Tree,

which should be fast.

So let's try that again.

And actually it only worked for me after closing

and reopening my browser.

So if you see the same error message that I had previously

down here, then please go ahead and do the same now.

But so now everything is working.

And so let's take a look at these dev tools and

in particular of this Component part of the dev tools.

Because again, there's another part which is this Profiler

but we will come back to that a bit later.

So Components, basically, as the name says, is

for showing a component tree.

Now, right now we only have one component, so only

the app component, and so then this

is the only one that we can see here.

But if we had more, then all of them

would be showing up down here

and we could see our entire component tree.

So I will show you this again once we have that.

The point here now is that we can take a look

at all the State that is inside each component.

To make this even a bit bigger here so you can actually see.

Well, that's maybe too big,

or I can also make the entire window bigger.

So just like this.

So you see here that first, we have this props

which is for all the props that the component

that is currently selected is receiving.

And in this case, we, of course,

are receiving no props, so nothing there.

But then here is the interesting part.

So here we then have a list of all the hooks.

And so here we have these two entries

one for each State hook that we used.

So remember that we created the State with use State

and these use functions are hooks;

therefore, they are here in the list of hooks.

But anyway, what's interesting is that we can now

manipulate these values down here to experiment with them.

For example, when we have a bullion value

we here get this checkbox, and so then we can toggle it

which will then also toggle the value here.

So from true to false.

So basically we can do the same thing as in the UI

but here with the dev tools.

So that's very useful and it's a bit similar

to what we also can do with CSS here in the Element tab.

So here we can do similar things.

So this was inspired by that.

And then of course here we can also change this date.

So we can go from one to three directly, or of course

we can also try

with values that we usually cannot access from the UI.

So by clicking these buttons, we cannot set the state to 10,

for example, but maybe for some reason we need

to see what the UI looks like with 10.

And so then we can come here to the dev tools

and set it to this.

Now, again, this is just a small demo example.

So here that wouldn't be important.

But in bigger and large scale applications

this might be necessary from time to time.

And so this is very, very important to keep in

mind that you can use the dev tools for this kind of thing.

So that's one thing.

And as I mentioned earlier

it's also very useful to be able to see the

entire component tree right here because

when we have many, many files in a project and dozens

or even hundreds of components in our app maybe,

then it can become quickly out of hand

and we can lose sight which components are where.

And so then a component tree can become very handy.

So instead of drawing that manually

we just come here and there it is.

Okay, and that's for now all I had to tell you

about these dev tools.

Very handy.

Make sure that you install them and we will come

back to them in future lectures, for sure.

# Updating State Based on Current State

It's very common that we update

a state variable based on the current value of that state.

And so, let's now learn how to best do that.

And in fact, we are updating state based on

the current state all the time here.

So here, for example, in said step, we take the current step

and then subtract one.

And here, the same.

So, here we take the current is open state

and toggle it, basically.

And so, this is what I mean with updating state based

on the current state.

Now, the way we are doing it right now

is working just fine, right?

So, our app works fine, but now let's imagine that

after a few months, we come back to this app

and then we want to change something.

So, let's say that we want this handle next function here

to actually move forward twice.

So, let's say that we want to set the step state twice.

So, there's nothing stopping us from doing that.

So, we can do this once and duplicate it.

So, this is perfectly fine.

We can call the same function twice.

But what? What happens now?

So, what do you think is going to happen

when I click next now?

So, in theory, it should take the step,

which is currently one, at one, so two,

and then here it should do the same

from two to three, right?

But again, watch what happens.

So, it only updated the state once.

Now, we will go into detail why exactly this happens.

But for now, what I need you to know is

that we should not update state based

on the current state like this.

So, the way that we have been doing it.

Instead, what we should do is to pass

in a callback function here.

So instead of a value, we pass a function,

which will receive as the argument,

the current value of the state.

So, let's remove this here and let's create a function,

and I will just create a simple arrow function here.

And so as I was saying, this will receive, as an input,

the current value of the state.

Now, there are multiple conventions on how

to call this argument.

So, we could again call it step,

but this might then be a bit confusing.

We can call it the current step, for example, or just S.

And so this is what I'm going to do now.

So, just an abbreviation.

And so then, here we can do S minus one, just like before.

And so this will now work the exact same way, right?

So, the view here was updated in the same way as before,

but this is a little bit more correct,

because if we do this here,

so again, receiving the current step as an input,

which we just call S, but it could be called anything.

And so then here we return that current step plus one

and the same here, plus one.

And so if we run this again, then it works.

So then, it is updating the state twice.

So, it started at one, then, therefore,

this callback here received the value of one,

and then one plus one was two.

And then here in the next state up,

that updated value is already passed here

into this callback.

And so then we have two plus one, which makes three.

Now, here we actually do not want this, of course,

so we just want to move forwards by one.

But in order to be safe for future updates,

it's a good idea to always use a callback like this

when we want to update state based on the current value

of that state.

So, let's do the same here.

So again, here we are also doing the same.

So, we are also setting this open state based

on the current one.

So, let's just call it S and then toggle that now, right?

And that works beautifully.

Now, when we're not setting state based

on the current state, then of course we can just pass

in the value as normal.

So, just like we did here, for example.

So, that also happens sometimes.

And so in that case, we need no callback.

Then, we just pass in the new state value,

as we do here, and as we also had here previously.

So again, in many situations, that would work just fine.

So, before we only had the S minus one here

and nothing else and so that worked as well.

But in order to be safe for future updates

or for working with coworkers, it's best to update the state

in a more safe way like this.

And so from now on, I will do this each time

that we update the state based on the current value

of the state.

# More Thoughts About State + State Guidelines

As we finish this first dive into state,

I want to share a few more important thoughts,

or ideas, about state, as well as some practical guidelines.

So, first of all,

there is one important technical detail

that you should be aware of, and this might seem obvious

but it's still worth mentioning.

So, what I'm talking about

is the fact that each component

really has, and manages, its own state.

So, even if we render the same component multiple times

on one page, each of these component instances

will operate independently from all the other ones.

So, in this example, the three counter components

all start with a piece of state called "Score,"

which is set initially to zero.

Then, if one of the buttons is clicked,

that increases the score by one for each click,

but only in that component.

The state in all the other components stays the same.

So, again, if we change the state in one of the components,

that won't affect the other components at all.

And so, the same thing, of course,

is going to happen when we click one of the other buttons,

or even when one of the components is removed

from the UI entirely.

So, state really is isolated inside of each component.

Now, if we analyze everything that we just learned

about state, we can come to the conclusion

that we can basically think of the entire application view,

so, the entire user interface, as a function of state.

Or, in other words, the entire UI

is always a representation of all the current states

in all components.

And, taking this idea even one step further,

a React application is fundamentally all about

changing state over time, and of course,

also, correctly displaying that state at all times.

And this is really what the declarative approach

to building user interfaces is all about.

So, instead of viewing a UI as explicit DOM manipulations,

with state, we now view a UI

as a reflection of data changing over time.

And, as you know by now, we describe

that reflection of data using state,

event handlers, and JSX.

So, we describe the UI, React does the rest.

Now, this might all sound a bit

philosophical at this point in your journey,

but trust me, as you become more and more experienced

in building React apps and working with state,

you will truly and deeply understand everything

I just said here.

Now, okay, and now to finish,

let me give you a few guidelines

on how to use state in practice.

So, practical guidelines is always

what students like the most,

and here, this also kind of serves as a summary

of state in general.

And these guidelines are for you to keep as a reference,

so, there is a lot of text here

that I will just quickly go over now.

So, first of all, you should create

a new state variable for any data

that a component should keep track of over time.

And the easy way of figuring this out

is to think of variables that need to change

at some point in the future.

So, if you're used to building apps in Vanilla JavaScript,

those would be variables defined

with "let" or with "var," or also an array, or object,

that you mutate over the applications lifecycle.

So, in React, you use state for those.

Another way of figuring out when you need state is this.

Whenever you want something in a component

to be dynamic, create a piece of state

related to that "thing," and then update the state

when the "thing" should change,

or, in other words, when you need it to be dynamic.

Now, since this "thing" is a bit abstract,

let's think of a modal window

that can be either open or closed.

So, for a modal window, we can create a state variable

called, "isOpen," that will keep track

of whether the model is currently open or not.

Then, when "isOpen" is true, we display the window

on the screen, and if it's false, we hide it.

Simple, right?

So, whenever you want to change

the way a component looks like,

or the data that it displays,

just update its state, which you usually do

inside an event handler function.

Now, when you're actually building your components,

it's gonna be useful to always imagine the components view,

so the component rendered on the screen, as a reflection

of state changing and evolving over time.

Finally, there is one common mistake

that many beginners make, which is to use state

for every single variable that you need in a component,

but that's really not necessary.

So, do not use state for variables

that should not trigger a re-render, okay?

Because that will just cause unnecessary re-renders

which can cause performance issues.

So, it's very common to need

some variables that are not state.

And so for those, you can just use

regular variables defined with "const."

But, we will come back to this in the next section.

All right, so this is my first set of guidelines

about state, which should be more than enough for now.

So, if you truly internalize these,

then building React applications in the future

should be a lot easier for you.

And, I say this because I really believe

that mastering state is the most difficult part

of learning React, but once you overcome this hurdle

and truly internalize when you need state

and how it all works,

it will unlock React development for you.

And so, that's why I spent so much time here

showing you how state works.

# A Vanilla JavaScript Implementation

So to finish up this part, I want to once again

do a quick comparison of the React code that we just wrote

with an equivalent Vanilla JavaScript implementation

of the same app.

And this Vanilla JavaScript implementation I actually

gave you at the beginning of this section.

So we placed it right in the public folder.

So let's now open that up and open it here on the site.

Okay, so again, the Vanilla JavaScript implementation is

inside an HTML file, where here we have first the HTML

and then separated the JavaScript.

So this HTML might look familiar

as it is quite similar of course to this JSX.

The only thing we don't have here is the button

to open and close the component.

So I didn't include that part.

But anyway here then starts our script

so we have the same messages

and then here we have to manually select all

of these DOM elements based

on the classes that we gave them.

Then next we have this let variable here with a step

which we will then update

down here in these event handler functions.

So here we took the elements that we selected manually

and used add event listener on them.

We have a similar logic inside of these event

handlers to basically update the step variable.

So when we go back, the step goes minus one

and when we go forward, the step goes plus one.

So this is a bit similar to what we have here.

So these event handlers, but the big difference is

that here all we have to do is to just update the state.

And so then React will keep the UI in sync.

Where here we first update the state variable

and then we have to call this function

which does the DOM manipulation.

So here inside of the update UI values function

we need to now manually update the DOM

and keep it in sync with this step state

because of course as soon as we click these buttons here

if all we did was to update this value

then nothing would happen in the UI.

So after doing that, we need to then

call this function here.

Or of course we could also just have all

of this code here, but since we need the same code here

I just place it into this function.

So then here

we manually update the text content of the message.

While here in the JSX, it is simply declared

right in the markup.

So here we have imperative code that tells JavaScript

step by step what it needs to do.

So update the text content,

then set the class list,

set this class list, and set this class list.

So set the class to active

in case that the step is currently active.

While here, that's all just declared in the JSX.

We don't tell React to do anything,

we just write that here the step

should be equal to the current step

and that here the active class

should be inside the class name

if the step is greater equal one,

but we don't need the imperative DOM manipulation

that we have here.

So we talked about this now many times

and so I think that this is enough set at this point,

but of course it would be a good idea

for you to keep comparing now, these two implementations.

There's just one small thing that I want to do here

which is going back to the previous lecture

where I told you that each component has

and manages its own state.

So what I want to do now is to prove that to you in code.

So let's actually take all of this code

and place it into a new component,

which we will call step.

Or actually let's call this component here Step.

Then we don't have to do so much copy pasting.

Then let's remove this

and actually call it steps

now, right.

And now here we do our app again.

So export

default

function

app

and then this app

will basically include two steps.

So let's say here we have a diff

and then we want to have

the steps two time.

Now just a few more changes we need to do.

So now since we have two components on the same page

let's actually

return a diff ear so that the button

and then these steps are all in the same place.

And then just one quick change in the CSS please.

So down here in the close

let's just remove this line of code.

All right, let's close that.

Put it here on the side.

And then as you reload, you will see

that now we have two steps on the page.

So we successfully reused our steps component.

So this is now no longer the app.

Again, it is steps, and we can nicely see that here

in the React dev tools.

So now we have a bit of a bigger component tree.

So we have app and then it has two child components.

So, but what I wanted to show you is that

as we change the state in this one, for example

the state here will stay the same.

And so even though both of them are steps component

the state in each of them is completely isolated.

So of course I can also close this one,

and this one stays open.

And we can obviously also see that down here

in the dev tools

with a bit more space even.

Yeah. So the first steps here

the state is three, and it is visible.

So that's this true here.

While the second one, the state is one

and it is not visible.

Okay, so that was just a small and quick demonstration.

And so now that we have used state a couple of times here

it's time for you to practice state

on your own in the upcoming coding challenge.
