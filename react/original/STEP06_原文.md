memo from 140 to 158

# Effects and Data Fetching

Probably 95% of all React apps out there

fetch some kind of data from some API,

making data fetching an essential skill

when building web applications.

Now, one way of fetching data in a React app

is inside an effect

and so that's what this section is all about.

So in this section, we'll continue working

on the usePopcorn project

as we learn all about side effects.

So we're gonna focus on the useEffect Hook,

how and when effects are executed,

and how we can clean effects up.

And loading external data into our applications

finally makes them feel a lot more real-world and alive,

and so let's quickly get started.

# The Component Lifecycle

So, in this section,

we're finally gonna come back

to our USEOPCORN Project.

However, before we go any further,

we just need to look at one more slide here,

where we will quickly learn

about the LIFECYCLE of COMPONENTS,

because this is gonna be highly relevant

for the rest of the section.

And actually, I should say that we're gonna learn

about the LIFECYLE of a COMPONENT INSTANCE,

because it's only an actual physical INSTANCE

of a COMPONENT that can go through a LIFECYCLE.

But as I mentioned earlier,

it's just a bit too much work to always say,

COMPONENT INSTANCE.

And so, for the rest of this lecture,

I will just say COMPONENT most of the time,

which is what everybody else also does.

So no one can always say COMPONENT INSTANCE,

that's just too much work.

But anyway, what does COMPONENT LIFECYCLE actually mean?

Well, the LIFECYCLE of a COMPONENT basically encompasses

the different phases that a specific COMPONENT INSTANCE

can go through over time.

And the first phase in any COMPONENT'S LIFECYCLE

is that a COMPONENT INSTANCE is MOUNTED.

Which is also called the INITIAL RENDER.

So this is when the COMPONENT is rendered

for the very first time,

based on everything that we have learned

in the previous section.

This is also when fresh state and props are created

for the COMPONENT INSTANCE.

And therefore, I like to use the analogy

that the COMPONENT is born in this phase.

Now, once the COMPONENT has been rendered

and is on the screen,

it can be re-rendered an unlimited number of times.

Now, as we learned in the previous section,

a React Application is re-rendered,

whenever there is a State Update, right?

However, back then, we were only talking

about the entire application,

not about one specific COMPONENT INSTANCE.

So in practical terms, a COMPONENT will also

be re-rendered when the props that it receives change,

when its parent COMPONENT re-renders,

or when something called CONTEXT changes.

And more about CONTEXT later.

Now, the RE-RENDER Phase is actually optional,

so it doesn't always happen in all COMPONENTS.

So some COMPONENTS are only mounted and then unmounted,

right away, which actually brings us to the next phase.

So finally, there comes a point in time,

where a COMPONENT INSTANCE is no longer needed.

And so that's when the COMPONENT is unmounted.

And as you can see from that not so subtle emoji,

this is when the COMPONENT basically dies.

So in this step,

the COMPONENT INSTANCE is completely destroyed and removed

from the screen along with its state and props.

And of course,

we have already seen this happening many times

in the applications that we have been building.

So this can happen when users navigate

to a new section or a new page of the app

or when they close the app all together.

Now, of course, a new INSTANCE

of the same COMPONENT can be mounted later,

but this specific INSTANCE is now gone.

So it has been unmounted.

and that's actually it.

So pretty straightforward, right?

Especially, after that deep dive last section.

So why was it even worth learning about this now?

Well, it's important to know

about the COMPONENT LIFECYCLE,

because we can hook into different phases

of this LIFECYCLE.

So we can basically define code to be executed

at these specific points in time,

which can be extremely useful.

And we do so by using the useEffect Hook,

which is the big topic of this section.

# How NOT to Fetch Data in React

Let's now load some data

into a React application for the very first time.

However, in this lecture,

let's start by doing it the wrong way basically,

which is going to be a great learning experience.

So in this section,

we are going to go back to our usePopcorn application

that we have been working on before.

And so let's now grab the project folder

and open it back up in VS code.

All right, now here

let's start by actually duplicating this file

and then I'm gonna rename one of them to app version one.

And so by doing this, we are not going to override the code

that we have written before.

And so you can keep it as a reference.

Now, as we have learned before in the previous section,

we should never update state in render logic, right?

But now in this lecture, let's actually break that rule

so that we can see

why it actually exists in the first place.

And breaking rules like this

is actually a pretty great way of learning Reacts

and also its rules even better.

Now, the idea here is to fetch some movie data

as soon as the app component here

mounts for the very first time,

so as soon as it has its initial render.

So to fetch that data, we use the OMDb API,

which is basically like an open version of IMDB.

Now to get started, you need to get your own API key,

which you can get for free just by clicking here

and then filling out this form.

And so immediately you will then get your free API key.

Now then once you have that, you can just come back here

to the main page so we can see how we can use this API.

So our data requests should simply be sent to this URL.

So just copy that.

And then here, let's fetch the data using the fetch API.

So using the fetch function like this.

Now, right.

Now, in case you're not familiar with the fetch function

and on how to work with asynchronous JavaScript,

then please go back to the beginning of the course

and take a look at the JavaScript review section

where I talk about all that in great length.

But anyway here now of course

you need to place your own key.

And actually I want to do this,

so I want to place this key in a separate variable.

So let's define that out here.

So key and by now, after that long previous section

you know why we should actually define a variable like this

outside the component function.

And the reason for that is that each time

the component gets re-rendered

this entire function here will be executed again.

So basically all the render logic.

And so if this variable definition here

is part of that render logic

it'll also be recreated each time data component renders,

which is in this case, of course, not a big deal

but it's good to already get

into the habit of not doing that.

So when you're just defining a variable like this

that doesn't depend on anything that's inside the component,

then just declare it outside.

Now I'm just getting my own API key,

but of course you should use your own one here.

And now let's go back to the documentation page

where we can see that we can query the API in two ways.

So we can search for an ID or a title

or we can actually search by some query string.

And so that's actually what we will do here.

So here let's use S and then equal.

And then here you can type your favorite movie,

which for me probably is "Interstellar".

Not 100% sure of that, but it's definitely a great one.

Okay.

But anyway, now we need to handle the promise

that the fetch function here returns inside.

And of course here it's then, so inside a then method,

which gets access to the response

and then here we can convert that response

to Json immediately, which will return another promise.

And so we chain on another then

and then here we get access to the data,

which we can then for now log to the console.

And for now, that's actually it.

So let's see what we get here.

Or of course we first need to

actually start our application.

So make sure you are in the right project folder here

and then type npm start.

So that should then open up the new tab here.

And indeed, there it is.

So let's check out our console

and let's just reload quickly.

And indeed you see that React was able

to fetch the data from the API.

So we are just interested in the search here.

And so all the movies here are in fact about "Interstellar",

which means that our query here is already working.

Now as we learned in the previous section,

this data fetching that we're doing right here is actually

introducing a side effect into the component's render logic.

So it is clearly an interaction with the outside world,

which should never be allowed in render logic.

So again, all this code that is here

at the top level of the function is of course

code that will run as the component first mounts

and therefore it is called render logic.

And so again, here we should have no side effects.

I mean, in this example

where we only log something to the console,

it actually appears to work just fine,

but watch what happens if we set some state here.

And to do that

let's actually first get rid of our temporary data here.

So this movie data and watched data

we only used as a template for the previous section,

but now let's get rid of that.

And so as I was just saying,

let's now here actually set state.

So that list of movies that we get from the API

we now want to get it into our movie state.

And so that's at data.search.

Give it a save and beautiful.

So we got some data from the API now showing up in our UI,

but watch what happens when we check out the network tab.

So you see that it's basically running

an infinite number of requests here, so it keeps going

and it never really stops.

So every second our app is firing off

multiple fetch requests to this API,

which of course is a really, really bad idea.

So why do you think that is?

Why do you think all these fetch requests

are being fired off?

Well, the reason is that setting the state here

in the render logic will then immediately

cause the component to re-render itself again.

So that's just how state works, right?

However, as the component is re-rendered,

the function here of course is executed again,

which then will fetch again,

which in turn will set the movies again as well.

And then this whole thing starts over and over again.

So as the state instead the component is re-rendered again,

which then will fetch again,

which will set the movies again.

And so this really is an infinite loop of state setting

and then the component re-rendering.

And so this is the reason why

it is really not allowed to set state in render logic.

So let's quickly set this back here

so that we don't have a million requests here.

And so as we reload, then it stops.

And let's just see another example here quickly.

So let's say we did set watched immediately here

in the top level code to some empty array

and then actually we do get a real error.

I mean, let's reload that.

And yeah, here we are now reloading all the time again

the data from the API.

But what matters here is that

we get the error of too many re-renders.

And so that's now because of this state setting right here.

So if we're really setting the state here in the top level

even without being inside a then handler

then immediately React will complain

that there are too many renders,

which means that we again entered that infinite loop

where updating state will cause a component to re-render,

which will cause the state to be set

and so on into infinity.

So let's of course get rid of that.

Let's reload here.

And so now we are again good.

However, we do actually want to set the state here.

So we do want set movies here,

but without all the problems that we just saw.

And so how can we do that?

Well, that's where we need the use effect hook

which we will learn about in the next lecture.

# useEffect to the Rescue

So let's now learn about the next important tool

in our React toolbox, which is the useEffect hook.

So we already know about the useState hook,

and so now it's time for our second hook,

which is again, the useEffect hook.

Now, the idea of the useEffect hook is to give us a place

where we can safely write side effects like this one.

Just, again, like our data fetching.

But the side effects registered with the useEffect hook

will only be executed after certain renders.

For example, only write after the initial render,

which is exactly what we are looking for in this situation.

Now, we will learn all about what this hook actually is,

but for now, let's just use it in practice.

So just like with useState, we just write useEffect,

and then we also need to make sure

that it has been imported automatically here from React.

So just like useState, again,

this is also a function that is part of React,

and so therefore that we need to import.

Now, the use effect doesn't return anything

so we don't store the result into any variable,

but instead we pass in a function.

And so this function is then called our effect,

and it contains the code that we want to run

as a side effect.

So basically that we want to register as a side effect

to be executed at a certain point in time.

So let's paste that here, but we are actually not done yet,

because now we need to pass in a second argument,

which is the so-called dependency array.

Now, this dependency array is actually

the most confusing part of this hook, and we will, again,

learn all about this throughout this section.

But for now, what you need to do here

is to just pass in this empty array,

which means that the effect that we just specified here

will only run on mount.

So it'll only run when this app component here

renders for the very first time.

And so now, here, let's change this back to setMovies,

give it a safe, and yeah, our movies here

are in the user interface, but even more importantly,

let's check if the problem from before has been solved.

And indeed, now we have no more infinite loops here

and no more infinite requests to our API.

So the problem that we created in the previous lecture

has indeed been fixed.

And so now our effect is only running

as the component mounts.

Great, and so this is basically the very bare bones way

in which we do data fetching in simple React applications

like this one, at least if we want to fetch our data

as soon as the application loads.

Now, in a larger, more real world application,

we may use some external library for data fetching.

But again, in a small application like this one,

this is now a great way to fetch some data on mount,

so when our application first loads.

So let's just quickly recap here.

So we used the useEffect hook to register an effect.

And so that effect is this function right here,

which contains the side effect that we want to register.

And basically, register means that we want this code here

not to run as the component renders,

but actually after it has been painted onto the screen.

And so that's exactly what useEffect does.

So while before, the code was executed

while the component was rendering,

so while the function was being executed,

now this effect will actually be executed after render.

And so that's a lot better.

Then, as a second argument,

we passed this empty array here into useEffect.

And so this means that this effect will only be executed

as the component first mounts.

Okay, and that's actually it.

So this is how we use the useEffect hook in practice

in a simple situation like this.

And so next up, let's now take a bit of a closer look

at this new hook.

# A First Look at Effects

So we just used the used effect hook

for the very first time in order to fetch movie data

as the component mounts.

But what actually is an effect

and how is it different from an event handler function?

Well, let's find out in this video.

And just so we're all on the same page,

let's start by reviewing what a side effect is.

So basically in React,

a side effect is any interaction between a React component

and a world outside that component.

And we can think of a side effect

as some code that actually makes something useful happen.

For example, fetching data from some API.

So what this means is that we actually need

side effects all the time when we build React apps.

Now, we already know that side effects should not happen

during the component render, or in other words

side effects should not be in render logic.

Instead, we can create side effects

in two different places in React.

And the first one is inside event handlers.

And remember that event handlers are simply

functions that are triggered whenever the event

that they are listening to happens.

However, simply reacting to events is sometimes not enough

for what an application needs.

Instead, in some situations, we need to

write some code that will be executed automatically

as the component renders.

And so this is when we can create a so-called effect

by using the useEffect hook.

So by creating an effect

we can basically write code that will run

at different moments of a component instance life cycle.

So when the component mounts, when it re-renders,

or even when it unmounts.

And this is really great

because it opens up a whole new door of possibilities.

Okay, but let's now get just a bit deeper

into how effects work by comparing event handlers

to effects created with the useEffect hook.

And let's go back to the example

of fetching movie data that we have been using.

So fetching movie data is very clearly a side effect

because it's clearly an interaction

with the world outside the component.

Now, there are two different possibilities

of when we might want to create this side effect.

The first possibility is that we might want to

fetch movie data only when a certain event happens.

So in that case, we will

of course just use an event handler function.

So just like we have been doing up until this point

I mean we haven't been using event handlers to fetch data

but we have used them for other stuff.

Now the other possibility

of when to fetch the data would be to do so immediately

after the component mounts,

so after it is first rendered.

And so this is exactly what we did

in the previous lecture when we first used the use event

to specify an effect that was executed right

after the component was painted to the screen.

So we can say that these two pieces

of code produce the exact same result.

So they both fetch data about a movie

but they do so at different moments in time.

So the event handler executes when an event happens

and the effect executes whenever the component first renders

at least in this situation because the exact moment

at which the effect is executed actually depends

on its dependency array

which I shortly mentioned in the last video.

So we can basically use this dependency array to

tell the effect to also run after a component re-renders.

But I won't go deep into this right now

because that's easier to explain with code.

But speaking of the dependency array, this array is just one

of three parts that any effect can have.

So besides the dependency array

we have of course the effect code itself.

And also each effect can return a so-called

cleanup function, which is a function that will be called

before the component re-renders or unmounts.

Now thinking about different moments

of the component lifecycle,

so mounting, re-rendering and unmounting, can be very

helpful to understand how effects work.

However, we should actually not think about life cycles,

but about synchronization.

So the real reason why effects exist is not to run code

at different points of the life cycle, but to

keep a component synchronized with some external system.

So in this example, that would be to keep the component

in sync with the movie data that comes

from some external API.

And if that sounds super confusing, keep in mind

that this is just a first introduction to effects.

We will come back to all this after having used

the useEffect hook a bit more in practice.

But anyway, to finish our comparison here,

as we just learned, we use effects to keep a component

in sync with the external world.

While on the other hand we use event handlers

to React to a certain event

that happened in the user interface.

Now, what's very important to note here is

that event handlers are always the preferred way

of creating side effects.

So whenever possible

we should not overuse the useEffect hook.

So basically everything that can be handled

inside event handlers should be handled there.

# Using an async Function

Let's now convert our effect to an async function

instead of the basic promise handling

that we're doing right now.

So, many times when we need a lot of code

to handle a promise,

it's a lot easier and nicer to just have an async function.

And here, I will just assume

that you already know what async await is.

So we might think that all we need to do

in order to use an async function

is to place the async keyword here,

and then use await inside of it.

However, we immediately get this warning from ESLint

which tells us that effect callbacks

are synchronous to prevent race conditions.

So basically the effect function

that we place into use effect cannot return a promise,

which is what an async function does.

So instead of doing it directly like this,

we just create a new function.

And then we place the async function in there.

So let's call this one fetchMovies.

And then let's of course adapt this function here,

to using the await keyword.

So const res equals await,

and again, I'm assuming that you already know

how all of this works.

So that converting to promises to an async function

is nothing new for you at this point.

So data will be the result

of converting the response to JSON,

which is again, an asynchronous operation.

And then, finally, we can set the movies to data.Search.

So just what we had here.

All right.

But now of course nothing is happening,

because nowhere we are calling this function.

So that's also why this gets this yellow underline here.

So our effect is now this function right here.

But this function, all it's doing right now,

is to define yet another function.

So this async fetchMovies.

And so then at the end, we just call it,

and then it is back to working.

Now here, I just want to extract this here

for now into another variable,

which I'm going to call query.

And this is just temporary here.

Now, okay.

And now what I also want to do is to log our movies here.

So the movies that we received from the API to the console,

just so I can show you something.

Let's first reload to get rid of the arrows there.

And now what I want to do here, again,

is to log our movies to the console.

So, do you think that I can just do this?

So you think that this is going to work?

Well, let's see.

And let's reload to actually see the truer result,

which is an empty array.

So why is this happening?

Well, hopefully you learned in the previous section

that setting state is asynchronous.

So in other words, after the state

has been set here in this line of code,

or actually after we instructed React to set the state,

that doesn't mean that this happens immediately.

So instead, it will happen

after this function here has been called.

And so right here in this line of code, we have stale state

which basically means that we still have the old value

as the state was before.

And in this case, before, it was just the empty array.

So our initial state.

So here we can basically then use data.Search again.

And so, as we reload now, then we get here the output.

Now what I wanted to talk about

is why we always have these two outputs.

So, basically why we have these two requests here happening.

Well, the reason for that is React's strict mode.

So when strict mode is activated in React 18,

our effects will not run only once, but actually twice.

So React will call our effects twice

but only in development.

So when our application is in production,

this will no longer be happening.

And so this is just so that React can identify

if there are any problems with our effects.

So if we come here quickly just to index.JS

and if we remove the strict mode from here,

well then we have this problem.

Let's actually remove the code.

Let's save and let's reload.

And then you see that we only get one output here,

which means that there was only one HTTP request.

So the effect was only called once indeed.

But let's put it back

because this is somehow a bit safer.

Now, okay, and that's it for this video.

Next up, let's make this data fetching here

a bit more complete with a loading state.

# Adding a Loading State

Let's now add a very simple loading indicator

to our application.

So basically, whenever the movie data here

is still being loaded in the background

we want to instead display some kind of loading indicator

right here.

And to show you what I mean,

let's come here to the Network tab,

which is always a good friend

when we're dealing with HTTP requests,

and then let's throttle our network here to a slow 3G

and so then I can easier show you what I mean.

So all of this will now take a lot of time to load

but here you now see this flash

where there is no content basically.

So the movie data was loading but hadn't arrived yet

and so now, again, in the meantime

we want to display some loading indicator

so in order to do that we need some more state.

So a state variable which basically tells our UI

that the data is still being loaded

and then as soon as the data has been loaded,

we want to display then the data

and not that loading indicator anymore.

But anyway, let's simply create that state variable

and usually it is called isLoading.

And so then set isLoading and let's start with false.

Now then let's come here to our effect

into our async function,

and so then right before the fetching actually starts

let's set isLoading to true.

And so this then will indicate our UI

that loading is being happened

and it can then render that indicator over there.

And then when all of this is done,

so let's do it right at the very end.

So this one we don't need anymore.

So here, after everything is finished

we can then set the isLoading state back to false,

and now it's very easy.

So here inside this box

we basically want to say that if isLoading,

then we want to display that indicator

and I will actually create a new component for that,

let's call it Loader, or else display that movie list.

Okay, so creating that loader that's just very simple

we just return a paragraph with the class of Loader

and then here we can say just Loading.

So many times in web applications

you will get like a rotating spinner or something like that,

ah, but you immediately saw that it was already working.

So as I save now the code it will always refetch the data

but let's try it again here manually.

Let's wait for it.

So now it's still the application that's being loaded

so we get this white screen in the meantime,

but now it has started fetching the data

then it displayed that loader, so that new component here

but then as soon as isLoading was set to false

it was time to actually display our movie list.

And so with this, this whole behavior is a bit more natural

and also a bit more real-world

because in all real applications

you always have some indication to the user

that some data is being fetched.

# Handling Errors

So whenever we are doing any data fetching

in any web application

and dealing with asynchronous data,

we always need to assume that something can go wrong.

And so therefore, let's now account

for that situation by handling those errors.

So one of the things that can go wrong

is your users suddenly losing their internet connection.

So let's simulate that here again in our network tab

and let's make sure that we are first on slow 3G.

Then let's reload here, and then

while the movies are loaded, we will click on offline.

So right now,

so you see that now the application

basically never leaves the state.

And also when we come to our console here we see

that we failed to fetch,

which again is because our user basically now

lost their internet connection.

So when that happens, we want to display some kind

of error message here on the screen and not

keep the application in this loading state here forever.

Because like this, the user will think

that the data might eventually arrive

but of course it will not.

Now, reacting to errors like this is actually not built

into the fetch function itself.

And so we have to kind of do that manually.

And so let's try that here in our fetch movies function.

So here on the response object

that we receive from fetch exists one, okay, property.

And so here we can check for that.

So basically if the response is not okay

then we want to throw a new error.

And again, this is pretty standard JavaScript code.

So then let's just say something went wrong

with fetching movies now, okay?

And so now if we throw an error here

we need to wrap all of our code into a try catch block. So,

try and catch

which again is just a normal JavaScript feature.

This one has nothing to do with React.

Okay, and here let's console that error.

That error, okay?

And then let's come back here.

Well, if we load now, then of course nothing will work.

So let's do that trick again where first

we set it to slow 3G,

then let's reload and then let's wait for it.

We set our users back to offline right now.

And so where is it?

Well, it's not actually anywhere here,

but well, that's not really important anyway.

So let's actually just log error dot message.

So this is the property of the error

where this string here will get saved into

but then what we're actually interested in,

is to get this message here onto the screen.

So basically displaying it right here instead of loading.

So that means that we need another piece of state.

So basically a piece of state indicating

whether we currently have an error or not.

So const error

and set error.

And so here, this one is actually not a bullion,

but it's truly the error message.

Okay, so here

let's then set the error

to actually that message.

And again, error dot message is basically

this string that we passed into the error

and error is the error itself

as it was passed into this catch block.

And again, that is just basic JavaScript.

All right,

and then let's do some conditional rendering here

to basically get the error here

onto the screen whenever there exists one.

Now, okay, and let's start

by creating a new error component here

or maybe let's call it error message.

And it will receive a prop

with some message that it will then display on the screen.

So let's return again a paragraph this time

with the class name of error, which,

as always, I already included into my CSS file.

Then here let's maybe add some small emoji here,

like this one.

So showing there was some kind of problem.

And then here we simply display that message.

So this is a very simple presentational component.

Remember that?

Okay. Now here in our conditional rendering

basically what we want to do is

that when it's no longer loading

then we want to display this movie list

but only if there was no error.

So basically here we now would have to nest another ternary

inside this ternary, but that makes for really ugly coat.

And so let's do something else instead.

So let's comment out this entire part.

Or well, only this one.

So the box of course we still need,

but then let's do is loading.

And if there's no error

then display this movies list right here.

Now if there is an error

then display the error message component

with the error or I think it's called message.

So with the message prop set to error.

And here of course, it needs to be

that the data is not loading and there is no error.

And finally, we also need to account

of course for the is loading state.

So if it is loading, then just display our loader.

So here the situation is indeed a little bit tricky

with all these different states that we have

and with all the conditional rendering, but well

these are now three mutually exclusive conditions.

So it is either loading or it is not loading

and there is no error or there is an error.

So only one of these three here

can be true at the same time.

And so that's very important

so that we don't display multiple

of these components at the same time by mistake.

So let's give it a save and let's try again.

So back to our 3G

and then I will set it to offline very soon.

Let's wait for it.

And there it is.

So we get our error message correctly displayed here.

However, there's still some problem

because the loading state is still set to true

and in fact that's actually correct.

So as soon as the error here is thrown,

this rest of the code is no longer evaluated.

And so therefore is loading is never set to fault.

So our application will keep thinking

that the data is still being loaded.

So again, the problem is

that after this error is being thrown

then React will basically never see

this piece of code here,

where the loading state is reset.

So instead of doing that here

let's attach a finally block here.

So this block of code here will basically always be executed

at the very end.

Okay? And as an alternative

we could have kept the code here and also pasted it here,

but that would've created a duplication of code.

So with this, it's going to be a lot better.

Now, I will not try this yet here

because actually I want to handle another kind of error

which is not really an error,

but also situation where we want to display a message

which is the situation

in which we cannot find any movie for the search Query.

So let's say the Query is like this one here

and of course the API will not find anything.

So let's remove all throttling,

and well, what happens here?

Well, basically the length cannot be read of undefined.

And so the problem here is that the data

that comes back from the API now,

is apparently undefined.

So let's take a look at that.

So just at data here, and let's try that again.

And so indeed, we no longer have the search property here,

so we no longer have data dot search.

And so what's happening then is that data search

is being set to undefined,

and therefore we get this other error here.

So as I was saying in the very beginning

we always need to handle

all these different situations that can go wrong.

And when we are working with data fetching

there's always a lot of things that can go wrong.

So working with data is a lot of work

but it's also essential in most

if not all web applications.

But anyway, here we can now use this response

to our advantage,

in order to throw another error in this situation.

So we can say that data dot response,

and actually, this now needs to be here

after we already have the data.

So in this case, if data responds is equal faults

and so for some reason the API here responds

with the string of faults and not a bullion

but while this still works, so in this case, let's

also throw a new error and let's simply say

movie not found.

Alright, and beautiful.

Let's just reload.

And then here we get this log.

So that's this console dot error coming from here.

And then indeed we get our error message also displayed

on the UI.

So this one was maybe a little bit trickier.

So let's just quickly recap.

So what we did was to implement another state variable,

this time, specific for the error

so that whenever some error occurred

we could store the error message in there

and then display it in the UI as soon as an error occurred.

Now, as soon as an error did occur, which is

in this situation, and in this one we threw a new error,

and then we caught that error

inside the catch block of this try-catch.

And so this is a standard way

of catching errors in JavaScript.

And so in this situation, we then set the error state

to the message of the error that we specified here.

Then finally, we used of course, that state variable

in order to render something on the screen conditionally.

And so that was right here.

So this part here is maybe a bit confusing.

And so make sure that after this video you just

analyze exactly what's happening here and that,

in fact these three conditions here are mutually exclusive.

So only one of them will ever be true.

Okay? And I think that for now this is enough

for error handling in this application.

So that's always a very,

very important part that many people overlook.

But it is of course essential

to deal with these kind of situations.

# The useEffect Dependency Array

So, I have mentioned

the use effect dependency array a few times already,

but we don't know yet what it actually does

and how it works.

So, let's change that in this lecture.

So, as we saw at the beginning of this section,

by default in effect will run after each and every render.

However, that's almost never what we want.

But, the good news is

that we can change this default behavior

by passing a dependency array into the useEffect hook

as a second argument,

but why does use effect actually need

an array of dependencies, you might ask?

Well, the reason is that without this array,

React doesn't know when to actually run the effect.

But, if we do specify the effect dependencies

by passing in the dependency array,

the effect will be executed each time

that one of the dependencies changes.

And, we will come back to why this is so amazing

in the next slide.

But, for now, this is all you need to know.

Now, what exactly are those dependencies?

Well, effect dependencies are state variables

and props that are used inside the effect.

And, the rule is that each

and every one of those state variables and props

must be included in the dependency array.

But, let's take a look at an example

to understand what I'm talking about.

And, the code here is really not important.

What matters is that the effect uses the title prop

and the user rating state.

We can clearly see at the top of the code

that title is indeed a prop

and that user rating is indeed a APs of state.

Therefore, both of them must be included

in the dependency array.

So, the effect function depends on these variables

to do its work,

and therefore we need to tell React about them.

Otherwise, if the title or the user rating changes,

React will not know about this change,

and, therefore, it won't be able to re-execute

the effect code.

And, this will then lead to a bug called stale closure.

And, we will talk about what a stale closure is

and also about some more rules for the dependency array

in a later more advanced section.

But, for now, let's actually understand

why the dependency array is so important

for the useEffect hook.

So, I like to think of the useEffect hook

as an event listener that is listening

for one or more dependencies to change.

And, when one of the dependencies does change,

use effect will simply execute the effect again.

So, a bit like a regular event listener,

but for effects.

But, let's go back to our previous example

where we had the title and user rating dependencies

in the array.

So, whenever the title or the user rating changes,

React will execute the effect again.

So, it will run the code one more time,

which will in turn update the document title.

So, the website title that we see in a browser tab.

So, essentially, effects react to updates

to state and props that are used inside the effect,

because, again, those are the effects' dependencies.

So, in a way, effects are reactive,

just like React reacts to state updates

by re-rendering the UI.

And, this is extremely useful and powerful,

as we will see throughout the rest of the course.

But, all this only works if we correctly specify

the dependency array.

Okay, but now let's remember how I said

in the very first lecture about effects,

that effects are used to keep a component synchronized

with some external system.

So, some system that lives outside of our React based code.

And, if we think about it,

that's exactly what is happening here.

So, the state and props of our component

are now in fact synchronized with an external system,

which is, in this case, the title of the document.

Now, updating the title in some other way

will, of course, not magically update the title

or user rating.

So, the synchronization only works in one way,

but that's not really the point.

The same actually happens with state updates

and we still say that the UI is in sync with state.

So, the point is that use effect

truly is a synchronization mechanism,

so a mechanism to synchronize effects

with the state of the application.

And, you will discover this

each time that you're going to use an effect.

And, so let's go explore this a little bit further.

So, as we just learned, whenever a dependency changes,

the effect is executed again.

But, now, let's remember that dependencies

are always state or props.

And, what happens to a component each time that its state

or props are updated?

Well, that's right.

The component will re-render.

This means that effects

and the life cycle of a component instance

are deeply interconnected.

That's why when the useEffect hook was first introduced,

many people thought that it was a life cycle hook

rather than a hook for synchronizing the component

with a side effect.

Now, the conclusion and the big takeaway from this

is that we can use the dependency array

in order to run effects

whenever the component renders or re-renders.

So, in a way, the useEffect hook

is actually about synchronization

and about the component life cycle.

Okay, and so with this knowledge,

let's look at the three different types of dependency arrays

that we can specify

and also how they affect both synchronization

and life cycle.

So, when we have multiple dependencies

like in this first example, variables X, Y, and Z,

it means that the effect synchronizes with X, Y, and Z.

Now, in terms of the life cycle,

it means that the effect will run on the initial render

and also on each re-render triggered by updating

one of the dependencies X, Y, or Z.

So, again, just to make this crystal clear,

the effect will be executed each time

the component instance is being re-rendered

by an update to X, Y, or Z.

But, if some other piece of state or prop is updated,

then this particular effect will not be executed.

Now, if we have an empty dependency array,

that means that the effect synchronizes

with no state or props,

and therefore it will only run on mount.

In other words, if an effect has no dependencies,

it doesn't use any values that are relevant

for rendering the component.

And, so, therefore, it's safe to be executed only once.

Finally, if we have no array at all,

we already know that the effect will run on every render,

which is usually a really bad idea and not what we want.

Now, if the effect runs on every render,

that basically means that the effect

synchronizes with everything.

So, essentially every state and every prop in the component

will be dependencies in this case.

And, now, to finish,

let's look at when exactly effects are executed

during the render and commit process.

Now, I mentioned in the first lecture on effects

that effects are executed after render.

And, while that's not wrong, it's also not the full story.

So, let's look at a timeline of events that happen

as components render and re-render.

And, I found this extremely useful

when I first learned about the useEffect hook myself.

And, so I think that you will benefit from this as well.

So, as we already know,

the whole process starts with mounting

the component instance,

in this case an instance of movie details.

After that, the result of rendering

is committed to the dom,

and finally the dom changes are painted onto the screen

by the browser.

So, this is just what we learned in the previous section,

but where do effects come into play here?

Well, effects are actually only executed

after the browser has painted the component instance

on the screen.

So, not immediately after render,

as you might have thought initially.

That's why we say that effects run asynchronously

after the render has already been painted to the screen.

And, the reasons why effect work this way

is that effects may contain long-running processes,

such as fetching data.

So, in a situation like that,

if React would execute the effect

before the browser paints a new screen,

it would block this entire process,

and users would see an old version of the component

for way too long.

And, of course, that would be very undesirable.

Now, one important consequence of the fact

that effects do not run during render

is that if an effect sets state,

then a second additional render

will be required to display the UI correctly.

And, so this is one of the reasons

why you shouldn't overuse effects.

Okay, but moving on now,

let's say that the title was initially set to Interstellar,

but then it changes to Interstellar Wars.

And, since this title is a prop,

it means that the component will re-render,

and the dom changes will be committed

and painted to the screen again.

Now, since title is part

of the dependency array of this effect,

the effect will be executed again at this point.

So, just as we learned in the last slide.

And, this whole process can of course be repeated

over and over again

until this movie details instance

finally unmounts and disappears from the screen.

Now, you might notice that there is actually a hole

between the commit and browser paint, right?

And, the reason is that, in React,

there's actually another type of effect

called a layout effect.

So, the only difference between a regular effect

and a layout effect is that the layout effect runs

before the browser actually paints the new screen.

But, we almost never need this.

And, so the React team actually discourages

the use of this use layout effect hook.

I simply mentioned this here

so that you know that this also exists.

And, actually, there are even two more holds

in this timeline.

But, we will talk about these mystery steps

by the end of the section.

So, stay tuned for that.

# Synchronizing Queries With Movie Data

Let's now put some of the things

that we just learned in the previous lecture into practice

and also magically synchronize our search query

with the movie search results.

And I actually want to start this lecture

with a couple of experiments.

And to do that, let's first do a couple of changes here.

First, let's set this back to "Interstellar."

And I also want to rename this variable here to tempQuery.

And that's because now we actually want to get

the query state that right now lives here inside search

into the app, so into its parent component.

So let's cut this from here

and we will then later pass in both of these back in.

So query and setQuery.

Okay, so we're basically lifting this state up

because we will need it here inside the app component.

So now let's pass those props in

so that Query equals Query

and setQuery is of course set.

Well, not error.

setQuery.

Apparently I wrote the name of the movie wrong here.

"Interstellar."

And then also let's get rid of this console dot log here.

Okay, let's reload just to clean this up.

And now let's do those experiments that I was talking about.

So basically I want to write a couple of effects here

and then I want you to guess

in which order they will be executed.

At least that's gonna be your first experiment.

So let's write one effect.

And then as always, we need to specify a function.

And this one will log to the console, the string A.

All right, then let's get another one.

And notice how this one doesn't have a dependency array.

Well, let's actually add it to this one,

but the second one here won't have any.

So this one will just log the string B.

And then finally,

I will simply do a console.log right here in the top level.

Okay, and now without running this code, let's try to guess

in which order these three strings here

will appear in the console.

So have you thought about it?

Well, I will now save

and then we will discuss the results.

Okay, and actually we have a lot of renders here,

a lot of results, but that's because the application

has rendered and re-rendered a couple of times.

And so then we got all these logs.

And also keep in mind that these effects actually run twice.

But what matters here

is that first we got C, then A, and then B.

So why did we get C first

even though it appears later here in the code?

Well, the reason is that as we just discussed before,

effects actually only run after the browser paint

while the render logic itself runs,

well, as the name says, during render.

And so then it makes sense that of course

this console.log here is executed first,

so during the render of this component.

And then we have A and B,

which comes from these two effects.

And so A is rendered first

simply because it appears first in the code.

Okay, now let's actually clear the console.

And now what I'm going to do is to type something here.

And so let's see what happens then.

And we get some more outputs.

So we get C and B.

So is this what you were expecting?

Well, let's again analyze what just happened here.

So we updated this state here, which is the query state

and as a result, the component was re-rendered.

And then just like before, this code here was executed

and so therefore we see the letter C first

and then after that we also have a B log.

And so that is this effect here

which has no dependency array,

which, remember, basically means

that this effect is synchronized with everything

and so therefore it needs to run on every render,

while this other effect here,

this first effect is synchronized with no variables at all,

which is the meaning of this empty array.

And therefore this effect was not executed

as the component was re-rendered with the query state.

Okay, so now we can change here the strings

and we can actually say that this here is during render.

This here is after every render,

and this is after the initial render.

Okay.

And of course, this is only for you to keep

as a reference here just so we are understanding

what's actually happening.

So now let's do another one.

So one final experiment here

which will be yet another effect.

Let's call this one D now.

And here in the dependency array,

we will have the query state.

So give it a save,

and now watch what happens when I type here.

So you see that this one here

during render, of course, always gets executed.

Then this one here, after every render as well,

and still not this one, but we now have this other effect

which is synchronized with the query state variable.

And so this query just changed

and therefore this effect was executed and logged D.

And if we keep doing this

then D keeps getting logged to the console,

while if we changed some of these other states here,

then we would not get D logged here.

So we cannot really simulate that here now

but you can still trust me on that one.

But anyway, let's now use what we just did here

to our actual advantage in the application.

So I will now

just comment these out and reload here.

And so now the time has come

where we actually want to use the query from here

right inside this URL where we fetch the movies.

So basically we want to fetch movies

based on the search query right here.

So instead of the temporary query,

let's now use query here, give it a save.

But of course, like this, it is not going to work.

So as we change this here to something

nothing is going to happen.

And why is that?

Well, it's because this effect

is not yet synchronized with the query state.

So we are using this state variable inside the effect

but the effect doesn't know yet

that it will have to rerun each time

that a query state changes.

And so to fix that, we need to include that query

here in the dependency array.

And actually you see already that React is complaining.

So here as we hover,

we see that this hook has a missing dependency.

So this error or this warning actually is really,

really helpful so that we never forget

to correctly declare the dependencies of this effect.

And so as we give it a save now,

let's again reload, and here now we get this error

that the movie is not found, which is because our query

by default is just this empty string.

But if we try now, let's say test,

then, well, it still doesn't work.

So let's come again to our network tab.

So let's just check out

if actually the HTTP request has been correctly made.

And so by doing this, you're also learning

about these very important developer tools here.

Okay, so here we see some new HTTP requests

and as we click here, we actually do see a response.

So there is something there

but somehow our movies are still not being shown here.

And I think I know the reason for that

which is that we are never resetting the error state.

So at some point we had some error here

but now we no longer have an error,

but at no point in the application

we are actually resetting it.

So we need to also do that here in the finally,

or actually better yet,

we should do it right here at the very beginning.

So basically, always before we start fetching for data,

we reset the error.

So set error,

and then back to the empty string.

Give it a save, and now we get some results for test.

Okay, and then as we delete this

then we are back to "Movie not found."

The same for "inter" for some reason, and then "stellar."

And now we get some movie here, it's not the same as before.

And the reason for that is something called a race condition

but at least something is working here.

So if I write this a bit slower, then it works just fine.

And of course this works with any other movie

as long as for now you type slow enough.

Now I want to fix this problem

that when we have no search query here

then it tells us "Movie not found,"

which is not really true.

I mean, it is true because the API actually searched

for a movie with an empty string.

But in a situation where we have no query

we actually don't even want to search, right?

And so let's do that here in our effect.

And actually let's do it

before we even call this function here.

So we can say if there is no query.length,

so it's going to be zero in this situation,

then simply set to Movies back to an empty array.

So basically then removing all the movies

from the user interface,

then let's also reset the error

back to nothing and then return.

And so in this situation then the fetchMovies function

will not even be caught.

And here we can actually go even further.

So we can say, like if the query length is less than three,

then it's not even worth searching as well.

So it doesn't even make sense to have

a query just like this, right?

So there's no movies really called like that.

So going back again to our network tab,

if we just type like this,

you see that no new fetch requests were made.

But now if I keep writing,

so now we have more than three characters,

then we had our first HTTP request to the API,

then we got these results, and if I type again

then you see we got another one.

And now when I delete all this

then it simply goes back to empty.

So we deleted all the movies from our state, basically.

Okay, and so with this,

we have the basic functionality already implemented.

So let's recap what we just did here

and what is going to happen

whenever we type a new query here.

So the query is of course a piece of state, right?

So that is pretty obvious.

And so we are referencing that query variable

a couple of times inside our effect here, right?

And so therefore, we then included this query variable

also in the dependency array of this effect.

And so now our use effect hook

is basically like an event handler

that is listening for the query to change.

And so then when it changes

the entire effect is executed again, which in our case means

that a new request is gonna be made to our movies API.

So again, this effect that we just wrote here

basically reacts to an update to this state variable,

which makes the entire effect basically reactive,

so reactive to that state.

But at the same time, our effect will also be still executed

during the initial render.

Just right now, that is the empty string,

which we just basically told our effect to ignore.

So let's write another amazing movie here.

And so as we save this now, and so as our application

first loads, it will immediately fetch the data right here.

And so indeed, as we just learned in the previous lecture,

this effect basically now runs on the initial render

and whenever the state variable here updates.

So it is synchronized with this variable here.

And as you see, this is really, really powerful

and can be used in all kinds of situations.

So make sure that you really understand

everything that we just did here,

as this was a really, really important lecture.

And then let's move on to the next video

where we will finally have the ability

to select one of these movies

so that we can then load some additional details

here into the right side.

So that's gonna be really, really fun.

And so I hope to see you there soon.

# Selecting a Movie

Let's keep working on our application

and allow users to select a movie

so that they can see some details about it.

So checking our demo app,

what we want to do now again is to add the ability

to select a movie like this.

And so then our app will load some additional data

about that movie and display it here.

And then we can also go back by clicking on this button,

which will then close that movie.

All right.

So basically that is adding some more dynamics

to the application.

And so what that means once again

is that we need a new piece of state.

And so that state will basically store

which movie has been selected here.

Now the selection itself, so updating the state,

will happen here in this box on the left side, right?

But the displaying of the movie happens here

on the right side, so in this box.

So this box will also need to know about the selected ID.

And so this means that this new piece of state,

so the selected ID state, will have to live here

in the parent component, so right in app.

So, selectedId

and setSelectedId,

useState,

and we are going to start with null.

And here it's, of course, Selected.

Then here, let's get rid of this,

which we don't need anymore.

And now you might be wondering why here we are only going

to store the ID and not the entire movie object itself.

Well, the reason for that is that the movies

that we get here from the search are very limited.

So we only get the data really about the title, the year,

and the poster here.

While here on the right side,

we will want all kinds of details

that are not included in this first search.

So there will have to be another API call.

And we can see that here when we click,

it loads the movie again.

And so only then all of these details here are fetched.

And this fetch here,

so this movie will be fetched based on the ID

that we got here in this array.

So let's take a look at that quickly.

So it's very important

that you understand how we actually built this application.

So it's not just about the React concepts themselves

but also about the logic of how we build an application.

So I think that's also pretty important.

So let's see.

So taking a close look at our results,

each of the objects has the poster,

the title, the type, the year, and the ID.

And again it's based on this ID

that we then will search for details.

And actually let's copy this ID here,

and I will temporarily use that here.

All right.

So just so we can see what happens

when we actually have a selected movie.

Then we no longer need this,

and now let's create a new component.

And so that component will then be displayed

if there is a selected ID.

So basically that's like a selected movie.

So movie list, movie, let's do it right here,

function SelectedMovie.

And this one will get as an input,

as you can guess, the selectedId.

So here let's for now just return a div

with the class name of detail.

And then for now, all we are going to do

is to display that selected ID in there.

All right.

And now going back up here into our JSX,

here on the right side, we now want to display not this,

but instead that component that we just created

in case that there is a selected ID.

So let's wrap all of this into a JavaScript mode block,

and then let's do a ternary operator.

So all we have to do is to say

if there is a selectedId, then display MovieDetail.

I'm not sure why that's not appearing here.

Maybe I gave it some other name.

Ah, SelectedMovie.

Well, actually I wanted to call it MovieDetail

or MovieDetails even.

So that makes a bit more sense, I think.

Yeah, so MovieDetails.

And then we pass in the selectedId.

Okay.

And if not, then that's where we want to display these two.

However, this is not going to work, so let's see.

And indeed, once again,

it's because here we have a piece of JSX,

so all this, which has basically two root elements.

So it doesn't have just one single parent element,

which, remember, is always necessary in a piece of JSX.

And so this is yet another great use case of a fragment

because, of course, we don't want

to create like a new div element

or something like that around these two.

So, just like this.

And again the reason for that is here

as the third part of the ternary operator,

we needed a new piece of JSX,

which cannot have two elements as the root element.

And so we just created one root element with the fragment.

Okay.

So now we can indeed see this ID that we passed in,

so the SelectedId,

but, of course, we don't want this to be hard-coded.

So let's set it back to null,

and then this will disappear.

Indeed.

And so the final step, as always, is to update the state.

So where are we going to do that?

Well, basically as the user clicks one

of these movie objects

or actually movie components.

So let's go to the movie component then,

and let's do that here with the trick

where we hover and then command or control + click.

So, movie list, and then right here on the movie on the li,

we can attach the onClick handler.

However, we don't have access to any function here yet,

so let's first go back and create that function.

So let's do that, well, maybe before the effect.

Okay, so let's do that here.

So this is just what we have done many times before,

which is in the component that owns the state,

we write some event handler functions that we then pass down

to some child component to update the state in the parent.

So here I will call it handleSelectMovie.

And so then this will pass in a movie ID.

Set selected ID to that ID.

And so we could also have simply

passed down the setSelectedId,

but I think like this,

it is a little bit cleaner in some situations.

All right.

So it's cleaner in my view

because like this, we give it a really clear name,

and so then we know exactly what's happening.

Ah, of course, we didn't pass it yet into the movie.

So that movie is inside MovieList.

And so we need to pass it there first.

So here we are going to need a little bit of prop drilling,

but if it's just one level,

then that's not a big deal at all.

So let's call this here onSelectMovie,

will be handleSelectMovie.

And then let's just grab this, move to our movie list.

Then we accept that prop here

and pass it right into the movie,

so just like we have have been doing so many times

except that here and then here,

we need to create a brand-new function,

remember, not just calling a function.

Okay, and then we pass in the movie.imdbID.

So we can see that right from here.

So in each of the movie objects,

the ID has this name right here.

Okay, give it a save, and now let's see what happens.

So we click here.

Then we get this ID.

Then we get another one.

And then here we get this,

which is exactly the same as this one.

So, this is working great.

The only thing I noticed

is that here we don't have these styles, which here we have.

Let me just see if we are missing,

if we are missing some styles here.

And apparently this list here

also needs the list of movies class.

So I forgot that one earlier.

And yeah, so now as we hover over each of these movies,

we get this nice highlighting.

Okay, and now just to finish,

let's quickly add the ability

to also close basically the movie detail,

which is simply to set the selected ID back to null.

So, let's create that function as well,

so handleCloseMovie.

And this one doesn't need anything

because all it will do is to set the selected ID to null.

Okay.

And then, of course, we need to pass this function

into the movie detail.

So right here, onCloseMovie.

And then let's grab that, move there,

pass it in.

And now let's just create a button here.

And this one has the class of btn-back

and onClick.

Well, it's simply onCloseMovie.

And so since in this case we are not passing

in any ID here or anything,

there's no need to create a new function.

So, of course, we could do this,

which would be exactly the same thing,

but that doesn't make sense in this case

because, again, there's no need

to pass anything into this function.

So let's just do this.

But, of course, we also need some content into that button.

So let's use this HTML entity, which means left arrow.

And there we go.

So if we click this, then we go back to what we had before.

Now finally, we could also implement

that when we click here again,

that it will also close the movie.

So, of course, if we click on one of the other ones,

then we see the ID here change.

But if we click on the same again,

we could also make it so that the movie then closes.

And so let's do that to finish this lecture.

So going back here, that's not too hard.

So right here, we can simply do a ternary operator.

So basically we can ask if the ID is equal

to the current one, then set the new selected ID to null.

So this means that we will now set the new state

based on the current one.

So let's just use the callback,

so selectedId,

and then we just say id equal to the already selectedId.

And if so, set the new one to null

and, otherwise, to the passed in ID.

So let's try that.

And if I click again, ah, then it closes.

Beautiful.

And so with this, we are now ready to, in the next lecture,

actually fetch the movie that corresponds

to the selected ID here.

# Loading Movie Details

So let's now load movie details

about individual movies.

So essentially whenever this movie details component here

is going to mount, we will want to fetch the movie

corresponding to the selected ID.

So basically loading the currently selected movie.

So since we want to do that each time

that this component mounts,

that means that we will want a use effect.

So our effect function.

And then as I just said

we want this to happen each time the component renders.

And so that's simply the empty dependency array.

Now, okay, and now we want an async function.

And so well that's actually right async.

So async function

and let's call this one,

"Get movie details", okay?

And now let's actually come here to our API documentation.

And so now here what we want to do is to search by ID.

So here the parameter is now this I

which will receive exactly this type of IMDB ID

that we have been working with.

So let's actually grab the fetch from here

because it's very similar.

So basically just this,

and let's place it right here.

And so now this is why we hatch the key in a separate value

because here we of course need that key again.

Now, here it is I and then it is here, the selected ID.

Now, all right now you see that VS code.

And yes, lin are already complaining here

but we will for now not give them what they want basically.

So we first want to see what's going to happen.

So then let's grab the data here from the response

and of course await this data.

And then for now, let's just log it to the console, okay?

And this should already be working at this point

so let's reload.

And nothing happens, of course.

I mean VS code is even telling me about it by saying

that I didn't call the function there.

So let's try that again.

And immediately, actually it loaded my movie here.

So we see that this time we actually get all this data

about the movie, which again,

we didn't get simply here

when we searched for the movies, okay?

But now we want to get some of this data here

into our visible user interface.

So in a visible part of the component.

And so how do we do that?

Well, as always, we need a new piece of state.

So movie and set movie,

and here the default will now be an empty object

because an object is exactly

what we got back here from this API call.

And so now instead of logging that to the console

let's just do set movie to the data.

All right.

And so now we should be ready to use

that data here in our JSX.

So actually let's destructure now the object

because I really don't like these variable names here

all uppercase.

I have no idea why they did it this way.

So we will basically now the structure data

out of this movie.

So the title.

We will call title in our own code.

Then we will want the year,

which is simply called year.

We will want the poster,

we want the runtime,

we want the IMDB rating as well.

So this one is actually correct.

We want the plot,

the released date,

so released like this.

The actors array,

the director,

and finally also the genre of the movie.

Now, okay, so we have all these variables

which you see we haven't used yet.

Let's just use them here in

our rendering logic just so I can see you.

What's going to happen?

So maybe the title and the year.

And so let's reload.

Let's select this one.

And then you see that first we get undefined,

undefined and then after a second

we get the indeed the title and the year.

So why is that?

Well, here in the very beginning

of course when the component is initially mounted

then the movie is still this empty object here.

And so then title and year read

from that empty object are simply undefined.

So then this effect here starts and it gets the movie

and will then store it into our movie state.

And so then the component is rerendered.

And then of course this object is no longer empty.

And so then the rendering logic here will read all

of this data out of the object.

And so then we successfully log that

to the console over here all but anyway

let's now actually use this right in our JSX here.

So let's start with a header element.

So not a component, but really an element.

And in there we have an image,

which is the poster and then the alt image

or the alt tech actually.

So poster of the movie.

So this is a template literal

so it works a bit differently.

So what's the problem here now?

Ah, of course I didn't close the image.

Next we have a div with the class of details overview.

And so envious code, we can actually just type dot

and then the class name,

then hit tab and well that should actually

then create a div with that class.

So that has always worked for some reason.

Now that's not working.

So let's just do it manually then.

So H two for the title.

And here we are typing a lot of JSX.

And if you don't want to do that

then you can just get the code here

from the final files of this lecture.

So here we want to run time.

All right, released is not defined.

Re oh, well I didn't type that correctly.

Now that's already starting to look like something there.

Yeah, let's keep going here.

Next up we have the genre and then also the rating.

So here we're going to have like a star emoji.

And then here basically just the IMDB rating.

That's actually right, that there IMDB rating.

Yeah, that's looking really nice.

So that's the header part here.

And so now let's do a section element like this.

So a paragraph.

And in there I want some emphasized text,

which is going to be the movie plot.

Then staring the actors.

So this is just a string

And then just directed by the director.

All right, and there we go.

Nice. We still have the selected ID here

which we now no longer need.

All right, and now there's just one thing missing.

So if you come here,

you see that we have this rating component

and does this look familiar to you?

Well, we spent like an hour or more building that

so hopefully this is still familiar to you.

And so let's actually now grab

that star rating component that we built earlier.

So let's write star rating.

And I thought that it would actually get

automatically imported

but let's then do it manually.

So I think it should be right here in the same folder.

Yeah, so import star rating from, and then star rating.

Okay, now here we need the dot for the relative file.

And there it is.

Now it is a bit too big.

And also we want 10 stars, not just five.

So on IMDB, if you know the site.

then you know that their movies are rated from one to 10.

That's also why we have here the 8.8.

So here we can now use that API basically

that we built for this component.

So that's max rating to 10.

And then the size of 24, let's say.

So that's half the size by default I think.

And then let's also place this

into a div vertical class name of rating.

Okay, beautiful.

Now of course for now,

this rating is not being stored anyway or anywhere.

And so if we reload now and then of course it is gone.

But for now,

the component here is working pretty nice, isn't it?

But watch what happens

if I now try to select another movie here.

So let's say this one.

So nothing happened right now.

If I close this and then open up the second one here

for example, then you see that it's working fine.

But again, if I now click on another one,

then we got the same problem our component here

is not updating.

So why do you think that is?

What might be happening here?

Well, we told our effect here to load the movie

data whenever the component first mounts, right?

However, when we click here on one of these other movies

this component is actually not mount again.

So the initial render will not happen again

because the component is already mounted.

And the reason for that is the one that we learned

in the previous section, it is because this component here

so the movie detail component is rendered

in exactly the same place in a component tree.

And so as we click here on another movie

simply another prop will be passed into the component

but the component itself will not be destroyed.

It will stay in the component tree.

And so the only thing that is changing as we click on one

of the other movies is the ID prop that is being passed in.

So the selected ID prop

that's the only thing that is changing.

And so therefore, right now

this effect here will not run again because again,

it is only running when the component mounts

which really only happens once.

Now of course, if I close this and then go to another one

then the component has been unmounted first

and then it is mounting again.

And so therefore then it is going to work.

So how do we solve this?

Well, the answer lies again

right here in the dependency array.

So here, if we now pass in the selected ID

which is the prop that changes,

then let's see what happens.

So you saw that now it did actually work.

And so the reason is that now as the selected ID

prop changes, then the effect will indeed be executed again

because remember, this dependency array is a little bit like

an event listener that is listening

for one of the dependencies to change.

And so now as we click on another movie

this prop here will change.

And so yeah,

our effect is then executed again,

which gives us exactly the functionality

that we were looking for.

So that's really great and really powerful

and it's therefore also really important to

understand how exactly this dependency array works.

And now just one final thing

which is that watch what happens when I click

on one of the other movies actually here

well probably you cannot really see it because

you can't really see when I click,

but there is a visible delay between the click

and something changing here.

And so of course that's because in the background

the movie needs to be fetched.

So just like before,

what we want now is a quick loading indicator

just to let the user know that something is happening.

And so let's do that exactly as before.

So we create a new is loading state

and then set is loading and we start with faults.

And then immediately before we start fetching

we set is loading to true.

And as soon as it is done,

we set it back to faults.

So just as simple as this.

And by the way, in this time here

we are not handling errors

but you could do that just like we did in the beginning.

So if you want,

you can just go ahead and copy that basically.

But here, in order to save some time

I will just ignore the possibility of there being an error.

But anyway, let's now use that loading state.

And so let's do it right here.

So inside the details,

so we always want to return this div here

but if we are still loading,

so it's loading.

Then we want to now use again our loader components.

So a reusable component but if not,

then we want the header and the section.

And immediately you see the problem once again,

which is that this piece of JSX

has two root elements basically.

So it's the header and dissection,

which is not possible.

And so let's close that.

And actually here we need the JavaScript mode.

And yeah,

so you see the loading indicator there is very short

but of course if our network was just a little bit slower

then it makes a lot of sense

to have that loading indicator right there.

Great, so this was another very important part

of our application, and we did it pretty fast

because some parts were just the repetition of before

and we also wrote a lot of JSX here.

But yeah, of course the main part is here

the effect and understanding how the dependency array works.

So make sure to really get that.

And then let's move on

and actually make this rating here work

so that we can add a movie to our watch list.

# Adding a Watched Movie

Let's now make our watched movies list work,

and let's do it all in one go.

So this is gonna be a long one,

and so let's quickly get started.

And let's actually get started by quickly recapping

what this watched list actually is.

So remember how we already have this watched state here,

which right now is this empty array,

but it used to be this tempWatchedData.

So let's close this here.

And so you see that then we had these two movies

with a few details, with the user rating

and then also this summary right here.

Now, of course we will start from zero here,

and then we can add each of the movies here to our list.

So they will then appear over there.

So we already have the list component.

So it should be somewhere down here.

So we have the watched summary,

we have the watched movie list,

and we have the watched movie itself.

So each of these movies needs the poster, the title,

the rating, the user rating, and the runtime.

So basically we need to create a brand-new object

for each of these movies

and then pass each of these objects here

into this watched array.

So actually let's start by creating that function

with which we can add a new item to that array.

So let's call it handleAddWatch.

Then we get a movie.

Let's call this watched.

And then let's do it as always.

So we call setWatched,

and then we get the current watched movies array,

and then we create a brand-new one based on that one,

so based on all the elements of that array,

and then the brand-new movie object.

Okay, and now we just need to pass that in,

so again as a prop.

And you see that this component is getting really big,

and the same for this entire file.

So if you want, feel free to split up this file

into multiple files, so one component per file.

But anyway, I will just keep working here.

And so let's pass that function

that we just created here as onAddWatched,

handleAddWatched.

So we're passing that into MovieDetails

because, again, that is where we will actually have

the button to add the movie to the watched list.

So it will be right here.

And so then here in this component, we set the state.

It will get updated in the parent,

and from there it goes back here into the statistics

and then into this list, of course.

Okay, but now let's then move to the MovieDetails component

and let's add a button right here,

so under this rating.

So here let's say button

with the className of btn-add

and then Add to list.

Now, here of course, we need our event handler,

and let's actually create another event handler right here

which will then call the one

that we passed into the component,

because here we actually need to do a lot of stuff.

So function handleAdd.

And so, again, this one will then eventually call

that function that we passed here as a prop.

So that was onAddWatched.

So again, in the end, we will call that function here,

which, remember, needs a new movie object as the input.

So newMovie, basically.

So like a new watched movie.

So let's create that object here.

Let's actually call it newWatchedMovie,

just so we understand what we are doing here.

So this movie object will also need an IMDB rating,

and here we can simply use the one

that is currently selected.

So the currently selected ID is

of course the IMDB rating of that movie

that we are going to add.

Then remember we also need the title, of course,

of the movie, the year, the poster,

the IMDB rating.

And here we actually need to convert that to a number.

And the reason for that is that the rating needs

to be a number so that we can then do the statistics here,

so calculating the averages.

So let's just use the number function on the IMDB rating.

And finally, we also need the runtime.

Now, if we take a look at one of the movies,

you you see that the runtime includes the minutes here.

And so again, with this,

we can then later not do any calculations.

So we need to basically split that,

so runtime.split

by an empty string, which will just get us that first part.

And then from there, we can just take that first part,

and then we just convert everything

to a number again.

Now, here we get some problem.

It's because we have a duplicate key.

That's because here, of course, it is the imdbID.

So thanks ESLint here for letting me know.

That was a pretty big problem, actually.

So let's see if this already works at this point.

So maybe it does, maybe it doesn't, but let's see.

Let's see our console.

So there are a lot of moving pieces here, so let's check.

So let's add this to our list.

And we didn't get any error,

so let's go back to see our list, and there it is.

I mean, there are still some problems here,

but something did work, so that's great.

Now, I think it is because down here,

we are using some of these properties

with their uppercase letters here.

So this should be title, and title like this.

And, yeah, beautiful.

The only thing that we are missing here is the stars.

And so that's actually what we're gonna take care of next.

So let's go back here.

And I just remembered that actually there is something else.

So let's say we also want to add this one.

So we add it to the list, but then nothing happens.

So I think that as we click here,

we should probably close this movie

and then basically go back.

And so then we can immediately see the new movie

that has been added.

So that's not too difficult

because we already have a function for that.

So it's this handleCloseMovie.

And so this is the function

that we now want to call here as well

as soon as a new movie is added there to that list.

So into MovieDetails.

Ah, we already have the function there.

Well, that's very convenient.

And, yeah, of course we do have it

because of this button here.

Okay, but anyway,

yeah, here it is.

So after adding a movie,

we then want to immediately also close the movie.

Okay, let's add this.

And so there it is again.

Now, you immediately see that there is a problem

because we already have the movie on the list,

but we will take care of that a little bit later.

For now, let's take care of the user rating here.

So let's maybe just reload, which will clear our list.

And, yeah.

So basically we want to be able

to get this rating here from the user,

and then as we add to the list,

that should be the rating that should be added here

to this new watched movie, right?

Or in other words, we now need the state that we have here,

like this nine rating.

We need it outside the StarRating component

and inside our MovieDetails component.

So how do we do that?

Well, remember that we actually created a way

of getting that state outside the component

by adding in a function.

So we defined the onSetRating prop.

And so into this, we can pass a state, set, or function.

So then we need that state, set, or function.

So let's create yet another piece of state here

for that rating.

So userRating

and setUserRating.

So useState, and here let's just start at an empty string.

Okay.

Now, for some reason we are already using this somewhere.

Well, not really.

So I was saying that because it wasn't

with the yellow underline.

But anyway, let's get the setUserRating

and then pass it here into our StarRating component.

Then let's reload.

Then let's open up this.

Give a rating.

And if we now check in here in our component.

So this we haven't done in a long time,

but, again, this is really helpful.

So here we have...

Ah, that reset everything.

Sometimes that happens when you click.

But anyway, here in our MovieDetails,

we see all the props, like the selected ID and the state.

So here we have, of course, the MovieObject

that has been loading.

Then we have the is loading state

and finally the current rating.

So as we click here now, you see that this changes,

and so therefore that means that now we have the state

inside our MovieDetails component.

Of course, it's also still inside the StarRating.

So here we have the same.

So of course now that changes to 10,

but now it also changed to 10 in MovieDetails.

All right, so that's really helpful.

And so now we can just add that new state

right here to that object, so userRating.

And now as we have this userRating,

we only want to allow a movie to be added to the list

if the user actually gave it a rating.

So let's translate that requirement into code.

And so what I just said is basically this.

So if userRating is greater than zero,

then display the button.

So let's reload that here manually.

Okay, and so now the button is gone.

But then as soon as I click here, the button will appear.

And now I add it, and there it is.

So there is our eight.

Now, I haven't watched any of these other ones.

Let's just give it something.

And then indeed, we get this movie with the IMDB rating

and with my own rating.

And so then the average between these two

is actually correctly calculated with 5 1/2.

Great.

Now, next up we need to ensure

that I cannot just add this movie here

as many times as I want.

So of course, I can keep going,

and I can keep going over and over again.

So now I have the exact same movie here three times

in my list, and that should not be allowed.

So basically when we come here to this component,

we want to check if this movie is already in the list.

And if it is,

then we don't want to display any of this here.

So then we can no longer rate it,

and it should then simply display the rating

that we already gave.

All right.

Now, does that maybe sound like something

that you might want to try on your own?

I know it sounds probably a bit scary,

but I think you could actually do it.

So if you are up to speed

with how the data flows through this application,

I think you will be able to do this.

So maybe take a minute or two now,

and then I see you back here once you are done with that.

All right, so maybe you tried it.

And if not, that's also absolutely no problem.

So what we need to do is to now pass the watched array

into that component, right?

So that is right here.

So the watched array, we simply pass it as a prop.

And so then with that, we can check for each of these movies

if it is already part of the watched list.

Okay, so let's calculate that here.

So a new piece of derived state,

which is isWatched.

So what we need to do now is to basically check

if the watched array that we need

to accept here still as a prop.

So we need to check if this array of objects

includes the array that is currently selected.

So let's do that, so watched.

And let's first transform this simply into array of IDs.

So we grab all the movies,

and then we simply take out the movie.imdbDB.

So let's just lock that to the console here,

just to make sure.

All right.

Let's check that.

Somehow it's taking a lot of time here.

So right now we have nothing on the watched list.

So let's add a couple of movies there.

All right, and for some reason,

we are getting undefined here.

Ah, but I see that's because here it should be imdbID.

And indeed, now it works.

So we have this array now, and so now all we need to do is

to check whether this array

includes the currently selected ID.

All right, and now based on that,

we will basically display this entire thing here,

so all of this.

So let's say if isWatched...

Well, let's start with if it's not watched,

then display what we have here.

And if not, then let's just create another paragraph here.

You rated this movie.

And then we can also later calculate

or derive the rating that we actually gave.

Now, here we need to return yet again

a piece of JSX with a fragment.

So just like this.

And, yeah, so here is where we then place that paragraph.

So working with JSX, as you see,

can always be a bit confusing.

And even after you have done it for years,

it can still take a little bit of time.

All right, and now you see you rated this movie.

And the same with this one,

but this one we haven't rated, so it not on our list.

So only these two.

And so for all the other ones, we can still rate them.

So we tried the third one,

and so now as we click on that again,

then you see that we can longer add it to the list.

So that option is now gone.

And so we fixed that problem.

Now all we have left to do is

to then place the current rating there.

So let's again derive that from the watched array.

So let's say const watchedUserrating.

And then let's take watched.find.

So we will just find the movie

where the movie.imdbID

is equal to the selected ID.

And then if that exists.

And so here we are now using optional chaining

because there might be

actually no movie already in the list.

So if we haven't watched a movie,

then here this find method will return nothing.

So here then we need optional chaining

so that userRating is only taken from that object

in case it actually exists.

All right, so again pretty standard JavaScript right here,

but if that's confusing, then, yeah.

As I said many times, I have a review section

for all the stuff right at the beginning of the course.

So watchedUserRating.

And, yeah, here we go.

You rated this movie seven.

Maybe let's add some nice emoji here once again.

So the star, where is it?

Okay, and so with this, we are now almost, almost done.

So our list works almost the same way as before.

So you see now it is here.

And our "Inception," for example, has the eight,

which is also had here.

And all the other ones have the seven.

Okay, and now the only thing that is left to do

is the ability to also remove movies from the list.

So that's the only thing that is here in the demo app,

but which we do not have yet.

So this button right here where we click,

and it will then remove it from the list.

All right, so let's go again back up here

where the state actually lives.

And then let's add the function

for handleDeleteWatched.

So then here let's pass in the ID,

and then here we do it just like we always do.

So we use the current watched movies array,

and then we filter out the one that we no longer want.

So we get the current movie,

and then if movie.imdb.ID

is different from the passed in ID,

then that movie will stay basically in the array.

But if it's the same, then that movie will be filtered out,

so it will be deleted basically.

And so now let's pass in this function into the list here.

So that is the WatchedMoviesList.

So the movies, so these movies right here,

they are inside the WatchedMoviesList,

and so therefore we need to pass this function into there

so that we can then pass it

into each of these movie components right there.

So onDeleteWatched

is handleDeleteWatched.

And let's move there,

so onDeleteWatched.

And then let's immediately pass that down

into the child component,

so onDeleteWatched is onDeleteWatched.

Okay, and then let's go there.

Ah, that's right here, onDeleteWatched.

And don't worry if it's taking you a lot longer

to process all of this, so to write all the code.

That's just completely normal, of course.

When I built this app here for the first time,

it also took me a few hours to build this,

so it was not nearly as fast as right now.

But of course, here we cannot take like 30 hours

(chuckles) just to build one small application, right?

But anyway, here let's now create this button.

We need to give it the class of btn-delete

and then onClick.

And don't forget it needs to be a function,

not a function call, so onDeleteWatched.

And then all we have to do is to pass in the ID.

So once again, that's movie.imdbID.

And that should be it.

So you see that the buttons are here, and let's see.

Yes, that works, and our statistics get updated.

Now here we have still this weird thing

where JavaScript is like really bad at math.

Or actually this time it looks

like it's not even JavaScript's fault.

But let's just fix that

because that looks just like really bad.

So we should be able to just append

a toFixed here, hopefully.

Yeah, that's a lot better.

Let's do the same here for the rating, toFixed.

So the two here is the number of decimal points basically

that we are allowing.

Yeah, but anyway, that's actually it.

So you see our stats updates in real time, of course,

and now everything is back to zero.

All right, so as I said in the beginning,

it was a long lecture, but we also got a lot of stuff done.

Now, I'm aware that we moved a lot of, like, data

up and down the tree

and the same for some handler functions,

and so please again just make sure

that you really understand what we just did here.

And with that, I think our component tree

can really help you out a lot.

So just analyze all the props

that all these components receive,

how the state changes over time.

And so all of that will really help you out

in becoming a better React developer

because, as I mentioned many times before,

you will also have to learn

to work with other developers' code.

And so then these skills of really analyzing the code

and the data flow will become very handy.

# Adding a New Effect: Changing Page Title

In this video, let's change the page title

in the browser to the movie that we are currently watching.

So to show you, let's, again, come to our demo here.

And so watch what happens here to the browser tab title

as I click on one of the movies.

So you see that now, the title of the page is equal

to the movie that we are currently checking out.

And if I then click on another one,

then, of course, that changes to the new movie.

All right, and so let's do the same thing

in our application as well.

Now, to start, as we see, the initial title

of the page is actually usePopcorn.

So the name of the application and not just React app.

So let's come into our public folder and in index.html,

let's just change the title here to usePopcorn,

give it a save, and then immediately, it changed up here.

Okay, but anyway, let's now actually try

to implement changing the title

to the currently watched movie.

So how are we going to do that?

Well, changing the page title in the browser,

so outside here of the application, is a side effect

because we are very clearly going

to interact with the outside world,

so basically with the world outside

of our React application.

And so again, this is then considered a side effect.

So what this means is that we will want

to register a side effect using, again, the useEffect hook.

Now, where exactly are we going to do that?

So in which component are we going to use useEffect,

or in other words, in which component

do we actually want to register the side effect?

Well, thinking about it, we want this title here to change

as soon as we click on one of these movies,

which will then trigger the movie details component here

to mount, and so it's in exactly that situation

where we want to change the browser title here.

And so that component is where we want that effect.

So let's come to movie detail.

And yeah, so this is the component.

And so let's simply add another effect here.

So we should always use different effects

for different things.

So basically, that each effect has only one purpose,

so it only does one thing.

So this will be our effect,

and then we want to run that effect on mount.

Okay, and now it's very easy.

So we can just change the title of the page in the browser

by setting document.title.

And for now, let's just use something else here.

And you see that actually, it already changed

to TEST right here, but let's just reload.

And so then it goes back to usePopcorn

and then when I click, it changed to TEST.

Nice.

So that's already working, but of course,

we now want the actual title there.

So let's use a template literal

and then I will just write Movie

and then the actual title of the movie.

Give it a save and immediately,

we get Inception here and here in the title.

But again, let's just reload.

And you see that now, it actually says undefined.

So why is that? That looks very weird, right?

But let's think about it because after we do that,

it will actually make sense.

So our effect here will right now only be executed

as the component first mounts, right?

Now, at that point, so when the component first mounts,

what is the title going to be?

And remember how actually, we already inspected

that earlier, but let's just do that again.

So logging to the console, here, we notice,

well, actually, we don't notice anything,

so let's just reload, then clear this, then click.

And so you see that initially, the title is undefined,

which is because in the beginning,

this movie object is still empty,

and only after the movie actually arrives

from the API, the component will re-render

and then we have the correct title

that is then logged to the console.

So moving back to our effect, basically, what happens here

is that again, in the beginning, the title is undefined.

And so since this effect only runs exactly once,

when the component mounts,

it will just stay undefined forever.

So when the component re-renders

with the correct movie object and the correct title,

our effect will right now not react to that.

So it will not be re-executed.

Now, luckily for us, we already know how to fix that, right?

So we just have to include this title variable here

in the dependency array.

And so then, if we give it a save,

then you see that it actually changed to the correct title.

Let's just try that again.

So first, we get undefined and then we get Inception

which, again, is because now, our effect

is basically listening for this variable to change.

And when it does change, then our effect is executed again.

Now, there's just one problem,

which is that we actually don't want

to see the undefined here in the beginning.

So we don't want temporarily to be our movie set

to undefined, but we can simply fix that by writing,

if there is no title, then just return.

So try that again and yeah, that's fixed now.

Now, also because we did this here,

so we specified the title, we can now move to another movie,

and it will then automatically change the title up here

which, if we hadn't done this,

this actually wouldn't happen.

So let's just remove it just so I can show you.

And...

Well, now, actually, we never see anything

because we have this early return here.

So let's try that again.

Okay, and now again, as I click another one,

we see that the title stays at undefined.

So this component here has re-rendered

and so the title has changed, but of course,

our effect did not react to that.

And again, that's because we are missing

this critical dependency in the dependency array.

But now with this, it does actually work.

Great, there's just one final problem,

which is that, when we go back, then you see

that the movie actually stays here in the title.

So let's do another one, then, of course, it is correct.

But again, if we go back, then the title will stay here.

So it will not go back to just usePopcorn

as we would probably want.

So it doesn't make any sense that now here,

we still have the Inception movie

while we are no longer seeing that movie.

So how could we change that?

I mean, nowhere in our code we are actually telling React

to go back to the usePopcorn title, right?

And right now, we actually don't know how to do that yet

because for that, we will first need to learn

about the concept of cleaning up.

And so let's do that right in the next lecture.

# The useEffect Cleanup Function

So the third part

of an effect is the cleanup function.

And so let's now come back to the timeline

that we have looked at before,

and the holes that we have left in it.

So remember that after the last effect run,

the title of the page in the browser tab was set

to Interstellar Wars, right?

However, once we unmounted the movie details component,

we would probably like the title to return

to the original text, which was simply usePopcorn,

so just the name of the application.

But how could we do that?

How can we ensure that the page title stays synchronized

with the application,

even after the component has disappeared?

Well, basically what we need is a way to execute some code

as the component unmounts.

And we can do exactly that

by returning a so-called cleanup function from the effect.

And in this case, that's simply a function

that sets the title back to usePopcorn.

All right, but you see that we still have another hole here

in the timeline, and that's because the cleanup function

that we return from the effect is actually also executed

on re-renders,

so right before the next effect is executed again.

So let's recap this important new information

that we just learned.

So the cleanup function is a function

that we can return from an effect,

and I say it can because the cleanup function is optional,

so we don't have to return one from the effect.

Now the cleanup function will run on two occasions.

First, it runs before the effect is executed again,

in order to clean up the results

of the previous side effect.

It also runs right

after the component instance has unmounted,

in order to give us the opportunity to reset the side effect

that we created, if that's necessary.

So remember that we have the dependency array,

in order to run code whenever the component mounts

or re-renders.

And now with the cleanup function, we also have a way

to run some code whenever the component unmounts.

And so with this,

we have the entire component life cycle covered.

Now you might be wondering,

when do we actually need a cleanup function?

Well, basically we need a cleanup function

whenever the side effect keeps happening

after the component has been re-rendered or unmounted.

For example, you might be doing an HTTP request

in your effect.

Now if the component is re-rendered

while the first request is still running,

a new second request would be fired off, right?

And so this might then create a bug called a race condition.

And therefore it's a good idea to cancel the request

in a cleanup function whenever the component re-renders

or unmounts.

And of course, there are many other examples.

So when you subscribe to some API service,

you should cancel the subscription.

When you start a timer,

you should stop the timer in the cleanup function.

Or if you add an event listener,

you should clean up by removing it.

Okay, and now to finish,

let me give you one more important rule about effects,

which is that each effect should only do one thing.

So if you need to create multiple effects

in your components, which is completely normal,

just use multiple useEffect hooks.

This not only makes each effect much easier to understand,

but it also makes effects easier

to clean up using a cleanup function.

And with that being said, let's return to our application.

# Cleaning Up the Title

So with our knowledge

about the cleanup function, we can now very easily

solve the problem that we still have with our page title.

So remember that we need a cleanup function.

Whenever the side effect that we introduced

in the effect keeps happening after the component

has already been unmounted.

And so that is actually exactly our case here.

So indeed, we no longer have the inception movie here

but the side effect is still happening.

So the title is still showing that old movie

that we had selected before.

And so the cleanup function is of course

the perfect solution for this case.

So a cleanup function,

remember is simply a function that we return from an effect.

And so let's specify a function here

and then return it from the effect function.

And here all we want to do is to basically reset

the document.title to its original form.

So that's usePopcorn, and this is all we have to do.

So let's reload.

Let's select our movie,

then indeed we get a title but as we go back,

or title also goes back to usePopcorn.

Great, and so this is actually all the code

that we have to write to solve this problem.

But let's just do a quick experiment

just so I can show you something.

So let's look to the console here.

Also in this situation,

clean up effect for movie and then the title.

And here we keep getting these random errors

which is because one of these images here cannot be found.

So that's a bit annoying, but let's just ignore that.

So let's reload, clear the console here,

then select one of the movies

and now as I go back we already know that this function here

will get executed.

And so again that's because this component here

will be unmounted and so that's when the cleanup function

of the effect will get executed.

So our title will change.

And let's see what is locked to the console.

So we get cleanup effect for movie "Inception."

Now, it might seem obvious that we get the name here

but if we think about it,

it actually might seem a bit strange, right?

Because as we learned in the previous lecture

this cleanup function here will actually run

after the component has already unmounted.

And so if that's the case then how will the function

actually remember this title here?

So again, this function here runs only after the component

has already disappeared from our componentry

and so all the state including the movie object

has been destroyed.

But still our function here remembers the title.

So how is that?

Well, it's because of a very important concept

in JavaScript called a closure.

So basically a closure in JavaScript

means that a function will always remember all the variables

that were present at the time

and the place data function was created.

So in the case of our cleanup function here,

it was created by the time this effect

first was created here.

And so by that time the title

was actually defined as "Inception."

So in this case, the movie that we were seeing before.

So it was "Inception" at the time this function was created.

And so therefore we say that dysfunction closed

over the title variable

and will therefore remember it in the future.

So in this case, even after the component

has already unmounted, okay.

So that was just a bit of a theoretical explanation

of what happens behind the scenes.

But I think it's pretty important to understand this idea

of closures because it is really a crucial part

of how effects work in React,

and therefore we will actually

also come back to this issue a bit later.

But anyway, I also want to show you

that the cleanup function runs between renderers.

So basically after each we render.

So if we click here, on some movie

and then we click on another one

let's say this one here,

then you see that the cleanup function

actually run again for this movie.

And so that happened right after the re-render, right?

Let's just clean this to watch that again.

So as I click here, there will be a re-render

and so again, then the previous effect was cleaned up

with the previous movie that we had selected before.

# Cleaning Up Data Fetching

Next up, we also need to clean up

our data fetching.

Because right now, we're actually creating way too many

HTTP requests as we search for movies.

And to show you what I mean by that,

let's make our window here a bit bigger.

Let's come to our network tab again.

Let's add some throttling here

and then make sure that you're here, in the fetch tab only.

Then let's clear all the requests that had been made before.

And then I will just very quickly search for a movie here.

All right.

And so here we can now see all the requests

that have been made.

So basically we see

that we made one request for each keystroke.

So it started here, then in or whatever, then incept

and all the way until the final word.

Now the problem with that is,

that this created all these different requests

that were basically happening at the same time.

And that has two problems.

First of all, having so many requests at the same time

will slow each of them down.

And second, this means that we will end up downloading

way too much data.

Because we're actually not even interested

in the data for all of these other queries.

But still, they were downloaded here.

Now in this case, it's very, very little data.

So that's not going to have any impact.

But in another application,

this might actually become a problem.

And so let's now learn how we can clean up,

basically our fetch requests,

so that, as soon as a new request is fired off,

the previous one will stop.

So it will get canceled.

And actually, I forgot to mention the third big problem

with having all of these requests

happening at the same time,

which is, imagine that actually, for example,

this request here would take a little bit longer

than the other ones.

So if this request here would be the last one to arrive,

let's say this one,

well here we then get the response if we click.

But anyway, again, let's imagine that this request,

for some reason, took a lot longer than all the other ones.

And so then this one would be the last one to arrive.

And so in that case, it would be the movies or the results

from this request that would be stored in our state

and that would be rendered in our UI.

Which is of course not what we want.

We always want exactly the last request of all

to be the one that matters, right?

So all these other ones, again,

we are not interested in them.

But if one of them takes longer than the rest,

then that one will actually become

the one that we see in our UI.

And this is actually a pretty common problem,

which even has the name of a race condition.

Because all these requests here are basically racing

with one another, seeing which one arrives first.

And so let's now fix that issue back in our code.

And the way that we will do this,

is by using a native browser API,

which is the abort controller.

And we will then use that abort controller

in our clean up function.

So the first step for using the abort controller,

is to actually create one.

So let's define a new variable, called controller.

And then we use, new abort controller.

And again, this is actually a browser API.

So this has nothing to do with React

but with the browser itself.

So just like the fetch function right here.

Okay.

Then here, in order to connect the abort controller

with the fetch function,

we pass in a second argument,

where we define an object with the signal property.

And so there we pass in controller.signal.

So it's not really important to understand exactly

how this abort controller works.

This is basically just following a recipe.

Okay.

So we have our abort controller

and we connected it with our fetch.

And so now in the cleanup function,

so a function that we return from here,

we can then actually

say controller.abort.

All right.

And that's actually it.

So let's see that this works in practice.

And then we will understand what is happening here.

And we will also do some minor fixes.

So let's make this big again, so we can see.

And reload the entire thing.

And immediately you see a small problem here.

But for now, let's ignore that.

And again, search for a movie.

Okay.

Now here we have a different types.

So we have this fetch and a fetch redirect, for some reason.

But we are only interested in the fetches here.

And immediately you see that all these other ones

which are not the last one, got canceled, right?

And so we can also see that now we no longer have

all these different requests happening at the same time.

So this one here started basically

and then immediately as the next one started,

this one was finished, so it was canceled.

This thing keeps popping up, makes it hard to explain.

And yeah, then finally,

the last one that we were actually interested in,

was of course not canceled.

So this one then went all the way until the end.

All right.

But here we can very clearly see

that there is basically only one request happening

at a time, until it then got canceled by the next one.

So let's just see why this is actually working.

So each time that there is a new keystroke here,

the component gets re-rendered, right.

And as we already know,

between each of these re-renders, this function here,

so the cleanup function, will get called.

And so what that means, is that each time

that there is a new keystroke, so a new re-render,

our controller will abort the current fetch request.

And so that is exactly what we want, right.

So we want to cancel the current request each time

that a new one comes in.

And so that is exactly the point in time

in which our cleanup function gets called.

And so again, the cleanup function is a perfect place

for doing this kind of work between renders.

Now the problem with this is,

that as soon as a request get canceled,

JavaScript actually sees that as an error.

And so that's why we then get the error here.

So basically this fetch request, as it is canceled,

it'll throw an error, which will then immediately go

here into our catch block, where the error is set.

And so that's why we can also see the errors down here.

So saying that the user aborted a request,

which is exactly what we have here.

However, this is not really an error

here in our application.

And so we want to ignore that.

So what we can do in order to do that

is to say, if error.name

is different from

abort error, only then we actually want to set the error.

And this works because the error that is thrown here,

so this object that we then get access to,

will have the name property set to abort error.

And then here we use that to our advantage, to again,

basically ignore these errors that are of this type.

And so only if they're not,

we set the error to the one that we are interested in.

Now to make this work here,

actually, we need to also set the error

to an empty string, after the movies have been set.

So we basically set the error to an empty string,

here at the beginning and at the end as well.

Okay.

And so let's try that now.

And we are still doing that throttling,

that's why it took so much time here.

But anyway, let's just again clean this here.

And, so now we never got that error

so we still got all our requests here, canceled.

And so, no more race conditions

and no more unnecessary data being fetched.

And so, if at some point in the future,

you are going to do your own HTP requests

in an effect like this, make sure to always clean up

after your fetch requests,

in case that you have a situation

where many requests can be fired off very rapidly,

one after another.

Which is exactly the situation that we have here.

So here, when we click on one of the movies

and the data gets fetched,

then usually we will not have so many requests

one after another.

Unless we click, like really fast

between these movies right here.

But that's usually not going to happen.

And so therefore, there's no need to clean up

the fetch that we're doing here

in this movie details component.

# One More Effect: Listening to a Keypress

Let's now implement a new small feature

which will require us to listen globally

to a keypress event.

So let's check out what that feature is in our demo.

And so basically it's very simple.

When we open up a movie here to see the details,

instead of clicking here on this button to go back,

we want to now implement a feature

that the user can also just click on the Escape key.

So you can't see that,

but I'm doing it now.

And so with this,

the movie detail was then closed.

And so again, for that,

we basically need to globally listen to that keypress event.

So let's get to work.

And the way in which we can react

to a keypress event in the entire app

is basically by simply attaching an event listener

to the entire document.

So let's do that here, right in the App component.

And so since this is clearly a side effect

because we will be directly touching the DOM,

we need another effect.

So just to show you that we are indeed in the App component.

And so let's create that effect right here.

So useEffect,

then our effect function,

and then as always,

we start by saying basically

that this effect should run on mount.

And so now all we need to do

is to write document.addEventListener,

which, remember, is simply a DOM function,

so we are really doing basically now some DOM manipulation.

And so we are stepping really outside of React here,

which is the reason why the React team

also calls the useEffect hook here an escape hatch.

So basically a way of escaping

having to write all the code using the React way.

Okay.

But anyway, here let's now listen for the keydown event,

and then as our callback function here,

we just pass in a function

which receives the event.

And now we can simply say if the event.code,

which is basically the code of the keypress,

so if that is equal Escape,

then we will want to call our handleCloseMovie function.

So we already have that functionality

and so all we have to do

is to call that function right here.

And let's also just, for some experiment,

log something to the console.

So just like this.

And let's reload here,

but let's first actually come back to our network

and disable any throttling.

So let's reload,

then let's open up a movie,

and then let's see what happens when I hit the Escape key.

And indeed, the movie here was closed

and we also got our closing logged to the console.

But watch what happens right now

as I hit the Escape key again.

So you see we get closing again,

and actually even twice.

But again, that's simply because in strict mode

these effects here are running twice.

So again, as I keep hitting the Escape key,

we see here by this log

that actually this callback function here,

so the event listener,

is still listening for the keydown event

and it will then execute this function

each time that the keypress happens,

which is, however, not really what we want in this situation

because we actually don't even have a movie opened here.

So basically what we want instead

is to only attach this event listener here to the document

whenever we actually have the movie details in our tree,

so whenever that component instance is actually mounted.

So that's easy enough,

we just cut the effect from here.

And so after all,

we want it in our MovieDetails component.

All right.

I just started to place it there

so that we could understand why we actually need it here.

And now here, of course,

this function is called onCloseMovie,

which, again, we had already passed

into this component right here.

Now, here you see that actually ESLint is complaining

and the reason for that

is that we must actually include this function here

also in our dependency array.

So that doesn't seem to make a lot of sense,

but we will later learn why that is.

So again, when React tells us

that we need to include something here in the array,

we actually must do that.

Otherwise, there might be some consequences

that we do not want.

And so, again, whenever you see some warning here

coming from ESLint about a missing dependency,

you must include that in the array.

So otherwise, React says that you are lying

about your dependencies

and that, of course, we don't want.

But anyway,

let's not try to hit the Escape key again

while the MovieDetails component is not mounted.

And so now we didn't get that console.log,

and so therefore, now this function is, of course,

not being executed.

But as I open up the movie and then I hit the key again,

then you see that we get the closing log,

and of course, the movie has closed.

Okay, let's do that again.

And notice how now we are getting even more

of these logs here.

And let's clean that and do that again,

and a few more times.

And so you see that we get dozens of these logs here

saying closing,

which don't really seem to make much sense.

So if we reload the page and then do that again,

then we are back to only having these two logs,

which again, come because the effect is executed twice.

But now if I close another movie,

then all of a sudden we get three logs.

And so it seems

like these are basically accumulating, right?

So the reason for that is that, actually,

each time that a new MovieDetails component mounts,

a new event listener is added to the document,

so basically always an additional one

to the ones that we already have.

So again, each time that this effect here is executed,

it'll basically add one more event listener to the document.

And so if we open up 10 movies and then close them all,

we will end up with 10 of the same event listeners

attached to the document,

which, of course, is not what we want.

And so what this means

is that here we also need to clean up our event listeners,

or in other words, we need to return a function here

which will call

or which will execute document.removeEventListener.

So basically,

as soon as the MovieDetails component unmounts,

the event listener will then, again, be removed

from the document,

and so then we will avoid having so many event listeners

in our DOM,

which might become a memory problem in a larger application

with hundreds or thousands of event listeners.

So again, in this small app, of course,

this wouldn't be a problem,

but this is just to teach you,

so to prepare you for the real life later.

Now here, the function that we pass in,

so the one that we want to remove,

must be exactly the same as here in the addEventListener.

And so we cannot simply copy and paste

this function right here.

So it must be, again, the same.

And so let's cut it from here

and create a brand-new function here.

Let's just give it a name of callback.

And then let's use that here and here.

Give it a save.

Let's reload here.

Okay.

I hit Escape.

And let's try it a couple more times.

And you see that now we only get one closing

each time that I hit the Escape key,

or in other words,

actually our event listener is only executed exactly once,

which was exactly the goal of our cleanup function here.

Great.

So this is how we handle keypress events

in a React application.

So again, we need to basically step out of the React way

and back into classical DOM stuff.

And so for that, we need an effect.

So we specify our effect,

we listen for the event,

and each time that the component unmounts,

or even each time that it re-renders,

we will then remove the old event listener

from the document.

All right.

And this is actually going to be the last lecture

of this section.

And so let's clean up the application here a little bit

before we leave this section,

even though we will actually keep working on it

in the next one,

but still, let's do some stuff here now,

which is to, for example, remove all of these redundant

and unnecessary console.logs.

We also have some other cleanup here like this.

So this one we don't need,

but maybe let's just comment this one out

because this was nice for the explanation of the closure,

remember?

And then, of course, also when we open up the app,

of course we don't want to display search results

for a predefined movie,

so in this case for the "Inception" movie.

So let's remove that from state

and simply start with no search term at all.

All right.

Then here we should probably not log these errors

here as console.error,

but as a console.log.

And also when the error is an abort error,

we don't even need to log anything

because, again, for us,

those are actually not really errors.

And finally, let's now search for a movie here.

So "Interstellar", for example.

All right.

So I selected the movie

and now let's say that I search for something else.

And so in this situation,

I think that it would be best

to close the current movie here.

So whenever there is a new search,

we simply want to close the movie.

And so that's pretty simple.

We just have to, before we fetch the movie,

simply call handleCloseMovie.

And so with this,

let's see.

So we open up this one and then let's search.

Let's see what actually turns up for Jonas.

Something about the Jonas Brothers.

Yeah, but anyway,

you saw that as I did a new search,

then the movie here actually disappeared,

and the same now again.

Okay.

Now, as we load the application right now,

so on the initial render of the entire app,

we notice that right now we are no longer fetching any data,

right?

So we are only fetching data as a result

of searching here for movies in the search bar,

so basically only as a response to this event.

And so therefore,

we could now actually transform

this useEffect that we have here

into a regular event handler function,

because remember, that is actually the preferred way

of handling events in React.

And again, this is actually now more of an event handler

than anything else, right?

So again, if you think about that,

then maybe you come to the same conclusion

that maybe this shouldn't be an effect anymore

and really an event handler function.

So if you want,

you can go ahead and convert that,

but it's also not really necessary

because the main point of this section here was to learn

about the useEffect hook.

And in many situations,

we do actually want to start fetching on mount.

And so in those situations,

this is still a perfectly valid way of doing that,

at least in small applications like this one.

But anyway, with this,

we wrap up the section,

and so now all there's left to do is, as always,

a nice coding challenge

so that you can practice on your own.

# CHALLENGE #1: Currency Converter

```jsx
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [fromCur, setFromCur] = useState("EUR");
  const [toCur, setToCur] = useState("USD");
  const [converted, setConverted] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function convert() {
        setIsLoading(true);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
        );
        const data = await res.json();
        setConverted(data.rates[toCur]);
        setIsLoading(false);
      }

      if (fromCur === toCur) return setConverted(amount);
      convert();
    },
    [amount, fromCur, toCur]
  );

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        disabled={isLoading}
      />
      <select
        value={fromCur}
        onChange={(e) => setFromCur(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCur}
        onChange={(e) => setToCur(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>
        {converted} {toCur}
      </p>
    </div>
  );
}
```

Welcome to the next coding challenge.

And in this one, we will build this very simple

currency conversion tool.

So here we can input some amount of money

that we want to convert from one currency to another.

So let's say for example, we want to convert 100 euro,

so the input currency to the output currency,

which is US dollars right now.

And so you see that the converted value is $107.17.

And this conversion here is actually done by an API

which contains real time currency conversion data.

And so by the time you're watching this,

the value here will most likely look different.

And of course we can also change the currencies.

So let's say we want to convert from US dollar to euro,

so the other way around.

And then 100 euros or actually $100 is just €93.

Now right.

So this is the task for this lecture.

And as always, we are starting

from some very simple starter file.

So here I already have, basically the HTML skeleton

laid out for you, here in the app component.

And so your task now, is to first transform

these elements here into controlled input elements.

So just like we have done before.

And then after that, I want you to use an effect,

like we did in this section,

in order to actually do an API call to this URL here,

which will then do the actual conversion.

So here, again,

is the URL of the API that we're going to use.

So your fetch request will be made to this URL right here.

And then you can replace the amount,

the from currency and the to currency.

And if you want to get more information about this API,

you can just go to this link right here.

Alright.

And so as you see here in the demo,

the conversion is made each time

that one of these three fields here updates.

So if I delete something here,

then immediately the value is updated here

with a new value, coming from the API.

And the same if we change here to some other currency.

So this is going to be a bit similar

to what we did throughout this section.

And so take a few minutes now

and I'll see you back here once you are finished,

so that you can then check out if your solution is correct

and what you could have done maybe differently.

Okay.

So I hope that you had a great time

with building this calculator

and that you had some success with it.

So if your calculator works,

then you are already done with this video here.

But in any case,

I will of course now implement my own solution here.

And I will just start

by making these three elements here, controlled elements.

So let's create some pieces of state.

So amount and set amount.

And of course, you could have called them any other thing.

So that's not really important.

And let's actually start with one here.

So that's const.

And then here,

let's do the from currency

and set from currency.

And here the default is going to be euro.

And then let's do the same for the other currency.

So to currency and set to currency.

And so here let's use by default, US dollar.

And now we just need to wire all that up

here with these elements.

So the value should be the amount.

And then on change, we do,

set amount is equal to e.target.value

but we should not forget to actually convert this

to a number.

Because otherwise we get a string

and that we cannot really convert.

Well probably we could, actually because we will

then plug it here into a string later.

But yeah, it's nicer to have it all

in the correct data format here.

But anyway, this now is the from currency.

And then

on change will be,

set from currency,

again, e.target.value.

Okay.

And now I will just copy the same thing

here to the other select element.

So to currency and

set to currency.

And here we are missing this closing brackets.

And yeah, that's it for the controlled elements.

And so let's now get to work on the effect.

So use effect

and then passing in our effect function, as always.

And then let's initially run this on component mount.

So we will do an HTTP request

to this URL right here.

And therefore, we will need a fetch function

which returns a promise.

And therefore, we now need an async function.

And since the effect function itself cannot be async,

let's create another one in here.

So async function

and calling it simply, convert.

And then, later we will simply call that function in here.

Okay.

And now let's do the actual conversion itself.

So we will do our fetch request to this URL

right here.

So let's grab that.

And then of course we need to replace all these values here

in this template, literally.

So amount.

Here we have the from currency.

And then finally, we have also, the

to currency.

And so this will, remember, return a promise.

And so let's await that promise

and store it in a variable called, response.

And then from there, let's also await the data itself.

So await by converting the response to Jason.

And then let's start by simply logging that to the console.

So checking out the data,

so that we know which format it has.

And immediately we see down here, that we get a result.

And so that means that our effect is already working

with the default data that we gave it here.

So here then, we can see that inside the rates object,

we have the USD property, which is our to currency.

And so that's the converted value right here.

So let's try to read that value.

So that's inside, data.rates.

And now we need to dynamically read the property from there.

So in this case, that's USD

but of course we cannot hard code that.

Because if our to currency would be euros,

then here we would have euros.

And so we can simply read the property,

by doing it like this.

And so there is our number.

And so instead of logging it to the console,

we now want to have it appear on the screen right here.

So as always, what we need, is a new piece of state.

And set converted.

And so just like before,

as soon as the data arrives, we will update the state,

which will then update our user interface

and show us the converted value.

Here let's start with nothing.

And yeah, simply replacing this console.log with set

converted, give it a save and nothing happened.

But it should happen as we reload the page.

Well actually not and well of course,

the reason is that down here we still hard coded the output.

So here now we want to read converted

and then we can even write the to currency here as well.

So we have 1.0717

US dollars.

Great.

So that's working just fine.

But what if we change something here?

So now I update this to 100

but you see that nothing is happening.

And if you remember everything we just learned

throughout this section,

this is going to make total sense to you.

Because as we type a new number here,

we will update the state that is inside the app component.

And therefore we will re-render this component.

However, our effect right now,

only runs on the initial render.

So we don't have anything here in our dependency array.

And so React has no way of knowing

that it should also rerun this effect right now.

And so, let's change that.

So let's basically give our dependency array

all the values that our effect in fact depends on.

And so those are, amount, the from currency

and the to currency.

So each time one of these three changes,

then our effect here should basically synchronize

with any of those.

So amount, from currency

and to currency.

And again here I like to use the analogy,

that this dependency array is essentially

like listening for one of these three variables to change.

And then each time that happens,

it will just re-execute our effect again.

And so this means that really,

our effect is now synchronized to these three variables.

Great.

And so, as we type here,

you see that the value actually updates.

Now you do see maybe,

that it takes some time for the update to happen.

Let's maybe click here.

And notice that the change wasn't immediate.

And if you have a slower internet connection,

then maybe for you it will take even longer.

And so that's of course

because our application needs to make this API call

and only after that, the state is updated.

So only then we get our results, which we can display here.

So to tell the user about that,

we again need our loading state.

So let's do that.

And notice how here we are just ignoring errors.

So if something goes wrong,

then we are not accounting for that situation right here.

But this is just a challenge to make the effect work.

So set is loading to true.

And of course, first I need to create

this new piece of state.

So is loading and set is loading.

And we start with false.

And then before the fetch happens, we set it to true.

And once we are done, we set it to false again.

So set is loading

back to false.

But now where do we actually use, this is loading state?

So we could of course, again display some loader here.

So something like a text displaying loading.

But instead, what I want to do here,

is to basically disable these three fields.

And so that then has the purpose

of showing the user that something is happening.

And also, besides that, it then prevents the user

from typing in anything else

and creating multiple HTTP requests at the same time.

So let's do that.

And this we haven't done before, actually.

But in all of these input elements,

we can specify the disabled prop.

Which again, is standard HTML.

And so disabled basically takes a true or false.

So if we set it just to true here,

then you see that it gets like, grayed out

and then we cannot do anything with it.

Now of course,

we don't want it to always be true but instead,

we want it to be disabled, when is loading, is true.

Okay.

And we will do this many other times

throughout the course.

So this is a pretty common thing to do actually.

Okay.

And this one as well.

And now watch what happens when I click.

So very shortly, these three got disabled,

which shows the user that indeed, something is happening.

So that the data is being loaded in the background.

Now there's just one final thing that I want to do,

which is, what happens when these two are the same.

And in fact, we even get an error in this situation.

Because the API is not made for the case

that we are converting from one currency to the same one.

So let's fix that and that's not too hard.

So before we do any of this, we can check

if the from currency is the same as the to currency.

And so in that case,

then we basically do not want to run the convert function.

So let's do that down here.

So outside of this function and before even calling it.

So we just say,

if from

Cur is equal

to the to currency,

then return and also set the converted value

to the amount.

Which is simply because the converted value will be the same

as the amount, if the currency is the same, right.

So let's try that here.

I'm just reloading to getting rid of those errors.

And then let's see.

And there we go.

So now one euro is one euro.

And we didn't even have to call the API for this conversion

because it is in fact not really a conversion.

Okay.

And that's it, I think.

Now remember that we ignored errors here,

so we didn't handle them at all.

But you should never do that in the real world.

So that's just something that I wanted to mention here.

But since this is just a learning exercise,

that's no big deal.

But anyway, with this, we finish yet another section.

So congratulations on the great progress

that you have been making up until this point.

And now, after you hopefully review everything

we just learned in this section,

I'll see you right in the next one,

where we will dive even deeper

into the topic of React hooks.
