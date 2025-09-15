memo from 159 to 173

# Custom Hooks, Refs, and More State

In this section we're gonna dive even deeper

into React Hooks.

So I like to say that Hooks are easy to learn

in the beginning, but hard to really master.

However, a really solid understanding of Hooks is crucial

for all React developers.

That's why over the next few videos

we'll understand the rules of Hooks and why they exist.

Learn even more about the useState Hook,

explore the useRef Hook,

and even create our own React Hooks.

Now, we won't revisit the useEffect Hook yet,

because we will inspect it even further at a later point.

But anyway, let's get back to work

and finish building this project.

# React Hooks and Their Rules

We have already used a few different React hooks

at this point of the course, but we have never

really learned what a React hook actually is

and how they work.

And so let's now do that in this lecture.

So React hooks are essentially special functions

that are built into React and which allow us

to basically hook into some of React's internal mechanisms,

or in other words, hooks are basically APIs

that expose some internal React functionality,

such as creating and accessing state from the fiber tree,

or registering side effects in the fiber tree, as well.

So again, the fiber tree is somewhere deep inside React,

and usually not accessible to us at all.

But using the useState or the useEffect hook,

we can essentially hook into that internal mechanism.

Now, hooks also allow us to manually select

in-store dom notes access context,

and many, many other things.

Now, what all hooks have in common is that they all start

with the word "use," in order to make it easy for us,

and for React to distinguish hooks

from other regular functions.

And in fact, we can even create our own so-called

custom hooks, which will also start with the word "use."

And this is actually one of the greatest things

about hooks in general, because custom hooks

give us developers an easy way of reusing non-visual logic.

So logic that is not about the UI.

Now, you might be aware of this or not,

but there was a time when we had to use components based

on JavaScript classes if we wanted to give components state

and access to the component life cycle.

However, this came with a few problems,

which led the React team to introduce hooks.

And so now with hooks, our components based

on functions can have their own state,

and also run side effects.

And so this was a huge step forward for React,

and made it even more popular than it already was.

Now we only used two hooks so far,

but React actually comes with almost 20 built-in hooks.

And so let's get a quick overview of them here.

So useState and useEffect are, of course,

some of the most important hooks,

and therefore the most used ones,

along with useReducer and useContext,

that we will actually study pretty soon.

Then we have this huge list of some less used hooks,

but where some of them are actually still quite important,

like useRef, useCallback and useMemo.

So some of these are actually worth learning,

but others are a bit more obscure, I would say.

And so they are not part of the curriculum of this course.

And finally, there are a few hooks that are intended

only for library authors.

And so of course, we will also not bother looking at those.

Now, in order for hooks to actually work as intended,

there are two very simple rules of hooks

that we must follow.

The first rule is that hooks can only be called

at the top level in practice.

This means that we cannot call hooks inside conditionals,

like if statements, and also not inside loops

or functions nested inside the component.

We can also not call hooks after an early return,

because that's also similar to a condition.

But why?

Why is this such an important rule?

Well, it's because hooks only work if they are always called

in the exact same order, which can only be insured

if we only call them at the top level.

And we will look at this in more detail in the next slide.

And now the second rule is actually a bit simpler.

All it says is that hooks can only be called

from React functions.

In practice, this means that hooks can only be called

from function components or from custom hooks,

but not from regular functions or even class components.

Now, the great news is that you actually won't have to worry

about these rules at all if you're using a linter,

because these two rules are automatically enforced

by React's ESLint rules.

So you really won't be allowed to break these rules,

even if you try, like we will in the next video.

So if you want, you can actually just forget about the rules

and finish the video right here.

But if you're curious about the deeper reason

why React needs rule number one, then let's move on

to the final slide of this lecture.

So let's now try to answer the question of

why do hooks need to be called in the same order

on every render?

And let's actually start from the very beginning,

based on all the knowledge that we already have

at this point.

So remember that whenever an application is rendered,

React creates a tree of React elements,

also called the virtual dom.

On the initial render, React also builds a fiber tree

out of the virtual dom, where each element is a fiber.

Now, each of these fibers contains a lot of stuff,

like the received props, a list of work,

and crucially for us, a linked list of all the hooks

that were used in the component instance.

So to understand how hooks work behind the scenes,

let's build ourselves a linked list of used hooks,

based on this hypothetical code example.

And I say hypothetical,

because this code actually doesn't work.

And can you spot why that is?

That's right.

This code actually violates the first rule of hooks,

because it conditionally defines state here.

But by breaking this rule, we will understand why hooks rely

on the order in which they were called.

And speaking of this order, our list will be built based

on the call order of the used hooks.

So first this useState call, then another useState call.

And then finally this useEffect call.

So this is our list of hooks

but it's not a linked list yet.

But what does linked actually mean?

Well, it means that the first list element

contains a reference to the second element,

which in turn, has a link to the third list element.

So all the list elements are linked together,

which is actually a common data structure

in computer science.

But anyway, moving back to our code example,

let's now imagine that a re-render happened,

because state A was updated from 23 to 7,

but this now creates a huge problem.

Notice how state B was only created initially

because the condition A equaled 23 was true, right?

However, after this re-render, the condition is now false,

which means that this useState hook would not be called.

And so state B would then no longer exist

in this linked list of hooks after the render.

But what the problem with that, you might ask?

Well, the problem is that the first hook is still pointing

to the original second hook, so to state B,

but that link is now broken.

So state A is now linking to a hook that no longer exists,

and nothing is pointing to the effect of Z,

meaning that a linked list has been destroyed.

It works this way because fibers

are not recreated on every render.

And so this list is also not recreated.

So if one of the hooks just disappears from the list,

then the order of the list will get completely broken.

So in conclusion, if we conditionally use the hook,

like we did here, that will completely mess up the list

of hooks between renders, which will leave React confused

and unable to correctly track all the hooks that were used.

And so this is the reason why hooks need to be called

in the same order on every single render.

And the only way in which we can assure that

is by only calling hooks at the top level,

which is exactly what the first rule of hooks says.

So following this rule, the code and the list of hooks

would look just like this,

so without any conditionals in the code,

and with the list of hooks always in the same order.

Now of course, this opens up the question

of why even bother having this linked list,

if it requires this strange rule to exist.

Well, the big reason is that a linked list,

which relies on the hook call order,

is the simplest way to associate each hook with its value.

So basically, the order in which the hook is called

uniquely identifies the hook.

For example, React knows that hook number one

has a state of 23, and that hook number two

has a state of empty string.

So the value is associated with the call order.

And this is very convenient because by using the call order,

we developers don't have to manually assign names

to each hook, which would create multiple problems

that we don't need to get into at this point.

Alright, so I hope that you didn't mind

yet another deep dive into some of React's internals.

I personally find these really interesting and fascinating,

which is why I keep getting excited

to share this stuff with you.

But now it's time to get back into writing some code.

# The Rules of Hooks in Practice

Let's now actually break the main rule

of hooks that we just learned about,

which is that hooks can only be called at the top level.

And here I still have the Used Popcorn app open

both in VS Code and in the browser

and so that's because we will keep working on this app

in this section.

And so if for some reason you closed the application,

then make sure to just open it up again here.

Now, just like before, I will again duplicate this file here

and then I'm gonna copy, or actually I'm gonna call it V2

and so again, with this,

we then can keep our previous versions of the code

and let's actually get rid now of this dummy data.

Just like this and also of this comment.

So cleaning up the code a little bit.

But now let's break some rules here,

which as I mentioned before, is always a great way

of learning why the rules exist in the first place.

So coming here to our movie details component,

this is where we will now write some code

to break that rule.

But let's actually start by again searching

for some movies here.

And then I will open this one up so that we can check out

the hooks that we actually have right now

in this component.

So in the dev tools, check out the movie details component

which is this one,

and so down here we have the list of hooks that we just saw

in the previous lecture.

To make this even bigger

and so indeed you see that the hooks are actually numbered.

So in fact, each of the hooks is identified by React

by their order number, not some name or anything like that,

but really only the number.

So this first hook here is exactly this movie.

Then we have the is loading state, which is currently false.

Then we have the user rating, which is this one

and then we have our three effects.

All right, so the three effects down here, okay.

Now if we did call a hook outside of the top level,

so basically if we called a hook conditionally,

that would mess up this entire order here

and so that's where we would then run into problems

and that's exactly what we want to do now.

So let's experiment here

and let's say if the IMDB rating is greater than eight,

then we want to create two new variables called IsTop

and SetIsTop and then equals use state set to true.

Now, as we save this, VS Code will immediately complain

and tell us that here we are not allowed to use

Use State conditionally, okay.

But we can actually disable this ESLint rule.

So just write this comment here ESLint-disable

just like this and then it should work.

I mean, at least here in VS Code,

we no longer get the problems that we had before.

So let's reload here,

then let's again search for "Interstellar."

Okay and now I will first select this one here,

which has a rating that is not greater than eight.

And well here we already have some problem.

Ah, it's because this actually must be after

the restructuring.

So of course at this point, the IMDB rating variable

is not even defined yet.

So let's just try that again.

And again, let's select this one here.

And so for now, we don't have any problems.

So let's again check out the state here

or the list of hooks and so indeed we have our six hooks,

so the same three states as before and the three effects.

So that's because the rating in this case is just 1.7

and so then this used state here was not called.

But now let's check out what happens

with "Interstellar" when the rating is greater than eight.

So as we click,

well, our application immediately stops working.

So let's come here to the console

and then React immediately tells us that it has detected

the change in the order of hooks called in this component.

So it tells here actually some helpful information.

So in the previous render there were three used data hooks

and then the number four was an effect.

So this effect right here was hook number four

before in the previous render

and that previous render actually happened after we clicked

on the movie but while the movie data

had not been fetched yet.

So at that point the IMDB rating here was still undefined

and so then this used data hook was not called.

But then as soon as the data arrived,

the IMDB rating was indeed greater than eight

and so then React called use state here

and so then on the next render,

the fourth hook was no longer the use effect

but this state right here.

And so therefore, now clearly we can see

that our linked list of hooks is different.

And so React is not happy about that at all.

So let's, of course, turn this off

and then it should go back to working.

So this one is pretty obvious that we shouldn't use it

and also as you saw, ESLint immediately warned us

of that problem that we were creating.

However, in certain situations,

you might not have ESLint installed and so in those cases,

you really need to be very careful.

Now one more subtle thing that can happen

is an early return.

So if we say, if IMDB rating greater than eight,

then let's immediately return some JSX here.

Let's say greatest ever.

And so if we do the same thing as before, "Interstellar",

then here the IMDB rating is less than eight.

But as we click here,

then we run into exactly the same problem.

Now this time the error message doesn't contain

the previous list of hooks, but still it tells us

that this time fewer hooks were actually rendered

and so that's because right now we only have the movie

and so these three states, but then the effects,

so the three effects that we had,

they are now no longer created.

So instead of the six hooks, we now only have three hooks

and so therefore, this again creates a big problem

because like this, we cannot guarantee that all the hooks

are always called in the same order.

So be very careful of that

and so now after this small experiment,

you know what these error messages here mean

and so hopefully you enjoyed this small experiment.

Let's just turn this off.

And also let's remove this line right here

because of course we want ESLint to work

so that it can warn us before we create a bug like this.

# More Details of useState

Let's now look

at the super important useState hook again

and review some important details

that we have already talked about as well.

So we have been using the useState hook

since almost the beginning of the course

because this is in fact the most important hook in React.

So we have used it in many different ways

and we know pretty much how it works at this point.

However, I want to again, review some important parts of it

and I want to draw your attention

to one very important detail, which is the fact

that these initial values that we pass into useState

only really matter on the initial render.

So let's see an example of that and let's say,

that we actually wanted something like this here to work.

So we wanted a piece of state called isTop

which is true if the imdbRating is greater than eight.

Now, we cannot do this as we already learned

in the previous lecture, but we might think that this works.

So basically doing this, so imdp greater than eight.

So let's see if that works actually.

And let's then log this state to the console.

Okay.

Let's search for a movie, as always,

and then let's wait for it.

And we see that this log here coming from line 266

which is this one here, is indeed false

even though the rating here is actually greater than eight.

And if we take a look at our list of hooks

then we also see that this one is set to false.

So why is that?

Well, it is because of the reason

that I just mentioned before

which is the fact that whatever we pass into useState

is the initial state.

And React will only look at this initial state

on the initial render.

So when the component first mounts.

However, when the component first mounts here

the IMDB rating will still be undefined.

And so this year is then false.

And so it will stay false forever

because nowhere we update the state

and on the second render,

so when we then finally get the movie data,

this will not be executed again.

And so therefore, again, it will stay false forever.

Now, one way of fixing this would be to use a useEffect.

So if we did useEffect passing in a function

and then we wanted to run this effect

each time that the IMDB rating updates.

And so each time that does happen

then we want to call setIsTop

and then we can do imdbRating greater than eight.

And so in this case, this should then work.

And let's see. And indeed now it is true.

And if we take a look again here at our...

Yeah, at our different hooks,

we see that now indeed isTop is true.

So our fourth hook here.

And so that is simply because of this useEffect.

Now of course, in this situation

we shouldn't even use a piece of state in the first place.

So if this here was the functionality that we really wanted

then what we should do is derived state.

So we shouldn't create a real state with the useState hook

but instead we should just do const isTop

and then simply imdbRating greater than eight.

So let's comment all of this here out, give it a save.

And if we then log that again to the console

you see that this simple code works seamlessly.

So let's wait for a here.

Cleaning our console. And so it is true.

And so that's because this variable here

is of course, regenerated

each time that the function here is executed.

So after each render.

And so this is the power

and one of the great advantages of derived state,

which is that it updates

basically as the component gets re-rendered.

And this is really as simple as it can get, right?

So this is pretty important to understand

so that the initial state value here

is only been looked at by React in the very beginning.

So only on component mount.

So never forget that.

And now I want to come back to this function right here

to give you yet another example

or another proof that updating state really is asynchronous

and that we need to use a colic function to update state

in certain situations.

So let's say that when we add a new movie

to our watch list right here

we want it to display the average of the rating that we gave

and the rating that is coming from IMDB.

So we want that to be displayed right here

instead of closing the movie immediately.

So let's first of all here remove this part

and then let's create a new piece of state.

Because if we want to display something on the screen,

well, then we need a new piece of state.

So let's call this avgRating and setAvgRating.

And useState, and let's just set it to zero.

And then we want to render that here.

Really somewhere, it doesn't really matter

because we will remove this here in a minute anyway.

So this is just to give you another demonstration

of updating state asynchronously.

So where is that function? Here it is.

Okay, and so now here we should see the zero.

And I used the value of zero here

and not the current IMDB rating because again,

this will just be undefined in the beginning.

And so there's no need to place that there. All right?

But then as we click on this button here

then this function here is executed.

And so let's then actually set that state.

So setAvgRating, and let's say

that first we wanted to set it

to the actual current IMDB rating, which is a string.

So let's convert that to a number. So IMDB rating.

And now watch what happens if we log this to the console

or maybe even if we alert this.

So then it becomes really visible.

So avgRating.

So let's see.

And so the avgRating should now be 8.6

because we set it to IMDB rating, which is 8.6.

So watch what happens. Well, it is still zero.

And so that's again,

because the state is set asynchronously here.

Or in other words, we do not get access to the updated state

right after doing that.

So right after we call the state updating function.

So only once React is done processing this event handler

it will then update all the state and re-render the UI.

All right. But anyway, let's now do another one.

So setAvgRating.

And so let's now attempt to calculate the average.

So taking imdbRating.

Or actually we want the avgRating.

So avgRating plus the userRating and then divided by two.

So let's see, let's delete this here.

And let's use 10 this time.

And then we get a wrong average here.

So our average is not correctly being calculated.

So this five here is really just 10 divided by two.

So the reason for that is that here

the avgRating is still at zero.

And so then zero plus 10 divided by two is indeed the five.

But why is the avgRating still at zero here

even though we have updated it before?

And by now you already know the answer.

So it's asynchronous state setting,

which means that at this point here

the avgRating has not been set yet.

So it's still at zero,

which is the initial value right here.

And so because of that,

we say that the avgRating state is stale at this point.

So we have stale state right here.

But luckily for us, we already know how to solve this,

which is by passing in a callback function.

And so that callback will get access to the current value.

And so let's again call that avgRating,

but of course, it could be called anything.

So let's try one more time.

Again 10. And beautiful.

So now we get the correct average. Nice.

So this time what happened

was that the average was again set to the imdbRating,

so the 8.6, but then in the next line here

we already got access to that new value.

And then here the 8.6 plus the 10

gave us the correct, the average.

And again here, this could be really called anything

and it would always work in the exact same way.

So if we do that again, then yeah, we will still get 9.3.

And so that's because this is simply the name

of the argument of the callback function

that React will pass into the function.

So it will simply pass the current state value

into the function.

But we can then of course give it any name that we want.

But let's put it back.

And indeed, let's actually remove all of this

that we just wrote.

So this was just yet another experiment

but I hope that it was a helpful one.

So here...

Actually no, I thought I saw some error there.

So let's put it back.

And so now the application should work just like before.

All right, and now there's just one final thing to learn

about the useState hook,

which is that besides using a callback like this

to update state, we can also use a callback

to initialize state.

And so let's learn how to do that in the next lecture.

# Initializing State With a Callback (Lazy Initial State)

In this lecture

we're finally going to build a brand new feature for our app

which is to persist the watch list in local storage.

So right now, if we have some movies here in our watch list

and if we then reload the page, then you see

that of course our movies are going to be gone.

So they're not persisted, so they're not stored anywhere.

And so that's why in this lecture

we will now use local storage to store

this watched data information in the browser.

So we're going to do this in two parts.

First, each time that the watch list state is updated

we will update the local storage.

So we will store that data into local storage

and then each time that the application loads

so when the app component first mounts

we will read that data from local storage

and store it into the watched state.

So let's do that starting with the first part

which is to store the watched movies here

into local storage each time that they are updated.

And we can actually do that in two different ways

or in two different places.

So the first option is to store that data

into local storage each time

that a new movie is actually added.

So basically right here in this event handler function

that is responsible for adding new movies to the watch list.

So each time that happens

we can then store the new watch list into local storage.

So that's the first option.

And the second option is to simply do it in an effect.

And so let's actually do both of them

starting here in this event handler function.

Now by the way, if you're not familiar with local storage

it's basically just a very simple key value pair storage

that is available in the browser

and where we can store some data for each domain.

So basically the data that we store

in local storage now will only be available

through exactly this URL right here,

not for example in this other one.

Alright? And the way we use local storage

is simply calling local storage

which is a function available in all browsers.

And then we set item,

then we pass in the name of the key

so basically the name of the data that we want to store

and then second, the actual data.

Now here, we cannot simply use the watched array

like this because it has just been updated here.

And so as we already know

this updating happens in an asynchronous way.

And so therefore right here, this is still stale state.

So it's basically still the old version

before a new movie has been added.

And so we need to basically do the same thing as here.

So we need to build a new array based on the watched

so the current state plus the new movie.

And then finally, we need to convert all of this

into a string because in local storage,

we can only store key value pairs

where the value is a string.

And so let's use the built-in JSON.stringify.

Now alright? And this should now actually work.

Let's try some different movies now here.

So let's try this one

which is actually one of my all time favorite movies.

So let's add that to the list

and maybe another one now, right?

And so now we have our two movies in the list,

but of course if we reload the page now

they will not magically appear back in the UI,

but we can still check if they have been stored

into local storage.

So in the DevTools again

we just come here to application.

And then here on the left side

you should have this local storage thing.

And so indeed here we see that our array

of watched movies has indeed been stored into local storage.

Great. So that's working.

But as I was saying

we can also do it right inside in effect.

So instead of doing it here in the event handler function,

and we will actually do it in an effect

instead of here in this event handler function

because later in the section we will want to make

this storing data into local storage, reusable.

So let's just comment this out

and then let's come down here and create a new effect.

So you see that I like to have always the states

here in the beginning of the components.

Then the event handler functions

which update some of the state.

And then in the end, the effects.

So let's create a new effect with the function,

and then as we were just saying, we want this effect

to run each time Dev to watched movies are updated.

And so then here we can very easily, let's just

grab this first part here, or actually all of it.

So let's paste that here.

And now we don't have to create any new array

because this effect here will only run after the movies

have already been updated.

So after watched is already the new state.

And so we can then simply use that here.

All right, let's reload.

And we see that our local storage has already been updated

and that's because this effect here

run when the component was first mounted.

And so at this point the watched state is by default

still this empty array.

And so then React set that here to the empty array.

So let's just try, oh, that's not correct.

And for some reason here

the loading state is no longer working

but let's take a look at that later.

So as we add new movies to the list now

we should see our local storage being updated.

Nice, so that part is working

and so now we need to take care of the second part

which is to read this data back

into the application as soon as the app component mounts.

So the component that owns this watched state.

Now how can we do that?

Well, we might think that we should use another effect

in order to get the data from local storage

on the initial render

and then store that data in the watched state.

However, there is actually a better way.

And so let me show that to you.

So let's deactivate this watched state here

and maybe let's move it down here and then duplicate it

because we still need this state of course.

So what we're going to do now is to,

instead of just passing in a value

is to pass in a callback function.

And so that's because the useState hook

also accepts a callback function instead

of just a single value.

And so we can then initialize the state

with whatever value this callback function will return.

And so let's try that out.

So let's pass in a function here.

So creating a brand new function.

And so then let's create a new variable

let's say storage, value,

and then we can just read from local storage

with the get item method.

So get item and then the key that we used before

to store the data in local storage.

So that's this key right here.

And so then we just need to return this value.

And so again, React will then call this function here

on the initial render and we'll use

whatever value is returned from this function

as the initial value of the state.

And this function here actually needs to be a pure function

and it cannot receive any arguments.

So passing arguments here is not going to work.

So just a very simple pure function that returns something

and that something will be used by React

as the initial state.

And also just like the values that we pass in,

React will only consider this function here

on the initial render.

So this function is only executed once on the initial render

and is simply ignored on subsequent re-renders.

Now, apparently there is some problem here

so let's check that out.

So watched map is not a function

and I actually saw that coming because

right now the local storage here is a string.

So remember that we stored the data

as a string by doing JSON.stringify

and then when we get the data back

we need to convert it back by doing JSON.parse.

Alright and beautiful.

So here, the movie that we added to our watch list before

is now indeed back in our watch list

after reloading the page.

So we successfully stored the data

in local storage and retrieved it as the application loads.

So our callback function here is doing its job.

And so this creates a much better experience for the user.

So whenever the initial value of the use data

depends on some sort of computation

we should always pass in a function like this.

So function that React can execute on its initial render.

So we should not call a function inside useState.

So we should not do this, okay?

So this is very different.

Here we are calling a function, not passing a function in.

And so this we should not do

because even though React would ignore the value of this

it would still call this function on every render

which is not good.

So never do this and instead pass in a function

that React can then call later.

Now okay, now let's again go back to our application

tap here, because now we want to see what happens

when we delete a movie from here,

and you see that it actually automatically got removed

here from the local storage as well.

So why is that?

Well, it's because thanks to our effect here

we have effectively synchronized the watched state

with our local storage.

So when the watched state changes,

our local storage changes as well.

And so this is a great advantage

of having used the useEffect hook

instead of setting local stage right here

in the event handler, because if we had done it

like this here, then we would also have to manually

set the local storage here as we deleted a movie.

So here we would then also have to do the exact same thing

and use all this here as the new local storage.

But so now since we have basically synchronized

the two of them, we no longer need to do that.

Alright, now let's just see what happens

when we reload the page and everything's working fine.

Let's just do one more test,

add a few more movies to our list.

Of course, this is a 10, not some other value.

Now, okay, now I see we are getting some errors here

but maybe that was ah,

that's because of the image not loading.

And now when I reload, ah, beautiful!

Both our movies are still in the list.

So we learned here yet another way of using

the useState hook.

So now we know that besides passing in a single value

we can also pass in a callback function.

So this all can be a little bit confusing

with all these different options that we have.

And so in the next lecture, we will basically

summarize everything that we know about the useState hook

since that is such an important talk in React development.

# useState Summary

Let's quickly summarize

everything that we know about the useState Hook

in one single slide

so that you can keep it as a handy reference.

So we use the useState Hook to first create state

and then the set a function

that results from creating state to update state.

Now, we can create a state variable in the simple way

which is what we do most of the time

but we can also create state based on a callback function.

So whenever the initial state depends on some computation

for example, reading data from local storage,

we can pass in a callback function like this

instead of just a single value,

and this process is sometimes called lazy evaluation.

Now this callback function

is only called on the initial render of the component

so on subsequent re-renders it will simply be ignored.

Also, this callback needs to fulfill two requirements.

First, it must be a pure function,

and second it should require no arguments in order to work.

And that's actually it,

that's how we create state variables using useState.

And now about updating state,

we can again update state in a simple way

just by passing a single value

into the returned setter function as the next state.

So in this example the next state would be 1000.

On the other hand, in many situations

we actually want to update state based on the current state

for example, increasing a counter by one.

So if that's the case we can give the setter function

a callback function like this,

so a function that is pure and returns the next state

based on the current state.

And this is, in my opinion,

the preferred way of updating state whenever it makes sense.

Now, one important rule to keep in mind about updating state

is that you should never mutate objects or arrays.

Instead, you must create a new object or a new array

which incorporates the changes that you want to make

and then pass that new object into the setter function.

And we have done that multiple times already,

but I just wanted to mention this

here in the summary lecture as well.

Okay, so in conclusion,

both for creating and for updating state

we have both a simple way

and a way that requires a callback function

so this can be a little bit confusing,

which is why I decided to create this overview.

So I hope that this makes everything crystal clear

and that you have now mastered the useState Hook

once and for all.

# How NOT to Select DOM Elements in React

So, with the topic of useState now behind us,

let's turn our focus on something called refs.

And so, in this lecture, let's manually select a dom element

so that you see why we actually need refs in React.

So, as an experiment,

let's try to automatically give this input element, here,

focus each time that the Search component mounts.

So, basically, each time the application mounts,

we will automatically focus on this input field.

Okay.

And, in order to do that,

we actually need to select this element.

And so let's try to do that

with the tools that we already have.

So we come here into our Search component,

which is where that input field is located.

And so, then, we can basically use a useEffect

and then manually select this dom element right here.

So let's try that out.

And then let's execute this effect

as soon as this component mounts.

So let's create some element

by simply doing document.querySelector,

and then we can just use the className

that is already here on the element,

so .search.

Okay, just to see if this works,

let's log this to the console.

And you see that, indeed, there is our input field.

And so now what we can do is to just say el,

so just this element,

and then call the focus method on that.

And so this is just some straightforward,

typical dom manipulation.

Okay.

And so now, if we load the application,

and so you see, as the application first loaded,

this input field automatically got focused,

so our code here is basically doing its job.

However, as we learned at the very beginning,

React is all about being declarative.

And so manually selecting a dom element like this

is not really the React way of doing things.

So it's not in line with the rest of our React code.

So, in React, we really don't want

to manually add event listeners, like this,

and also having to add classes or IDs

just for the purpose of selecting is not really nice.

And, again, not really the React way of doing things.

So here we already had the className, of course,

but if we didn't,

then we would have to now add that className or ID here

to then use it in the effect to select the element.

Also, if for some reason we would need some dependency here,

for example,

if this code should rerun each time the query changes,

then that would mean

that we would select the element here over and over again,

which is also not ideal.

Okay, and so, to solve all these problems

and to make the action

of selecting an elements more declarative,

such as everything else in React,

we need the concept of refs.

And so that's what we're going to learn about

in the next video.

# Introducing Another Hook: useRef

It's time to introduce yet another React hook.

And this time is the useRef hook.

And, fortunately for us,

this is one of the easiest hooks of all.

And so let's now take a look.

So we use the useRef hook to create something called a ref,

but what actually is a ref?

Well, ref stands for reference,

and essentially,

it's like a box into which we can put any data

that we want to be preserved between renders.

Now, in technical terms, when we use useRef,

React will give us an object

with a mutable current property,

and we can then write any data into this current property

and, of course, also read from it.

In this small example, the current property was first set

to the initial value of 23,

and we then changed it to 1000.

So, as you can see,

this current property is actually mutable,

so unlike everything else in React.

But what's really special about the refs

is that they are persisted across renders,

so their current property value

stays the same between multiple renders,

so just like state.

And this gives us two big use cases for refs.

First, as we just said, we can use refs to create variables

that will stay the same between renders.

And useful examples of this

are preserving the previous state

or storing the ID of a setTimeout function.

Now the second use case is actually far more important,

which is to select and store DOM elements.

So this is what we attempted to do in the last lecture

and which actually brought us to this lecture.

So, just like the ID of a setTimeout,

a DOM element is also a piece of data

that we want to store and preserve across renders.

And so refs are perfect for this.

Now refs are usually for data

that is not rendered individual output of the component.

So usually refs only appear in event handlers or effects,

but not in the JSX.

Now, of course, we can use refs inside JSX 2,

but usually that's not the place for them.

If you need data that participates

in the visual output of the component,

that's usually a good sign

that you actually need state and not a ref.

And, speaking of state, just like with state,

you are not allowed to write

or to read the current property in render logic

as that would create an undesirable side effect.

Instead, we usually perform these mutations

inside a useEffect hook.

Okay, now, I've hinted a couple of times

at all the similarities between refs and state,

which is because these two are in fact quite similar.

So let's now analyze what they have in common

and what's different between them.

So, in a way, we can say that refs are like state

but with less powers.

So what they have in common

is that they are both persisted across renders.

So the component remembers these values

even after re-rendering.

The big difference is that updating state

will actually cause the component to re-render,

while updating refs does not.

So the big takeaway from this

is that we use state when we want to store data

that should re-render the component

and refs for data that should

only be remembered by the component over time,

but never re-render it.

And this is basically, also,

what we already learned back in the lecture

on the "Fundamentals of state management."

So, remember, that this diagram is taken from that lecture.

Now, back then, we didn't know what a ref was,

but now we do.

Now, going back to the examples of preserving previous state

and storing the ID of a setTimeout,

these are pieces of data

that we want React to remember between renders,

but we don't want them to re-render the UI

whenever we update them,

and so that's why we use refs for this kind of data.

So this is the main distinction between state and refs,

but there are also some minor ones.

So, as we also just learned,

state is immutable, but refs are not.

Also state is updated asynchronously,

which means that we cannot use the new state

immediately after updating it;

with refs, on the other hand, updates are not asynchronous,

and so we can actually read a new current property

immediately after updating it.

Basically, just like any other regular JavaScript object.

Okay, and that does it for this video.

So see you back in VS Code.

# Refs to Select DOM Elements

So let's not do the same thing

that we did before

which was to automatically focus on the input element

but this time using a ref.

And so let's start

by getting rid of this way of doing things.

And so again, let's now use a ref instead.

So using a ref with a DOM element happens in three steps.

First of all, we create the ref.

And so for that we use the useRef hook

as we just learned before.

So we just write useRef

and then we need to again make sure

that it is now correctly imported from React.

Okay, so let's go back.

So we call the useRef hook

and then here we pass in the initial value

that we want to be in that current property

that we just talked about.

Now in this case,

when we work with a DOM element

that is usually just null.

Now all right.

And so this will simply return a ref

that we can give any name to.

And so let's now store this

into a variable called inputElement

because that's what we will want to store inside this ref.

So we have our ref.

And now as a second step,

let's actually come to the element that we want to select.

And so all we have to do is to use the ref prop

and then we just pass in the ref that we just created,

so that's inputEl.

And so now these two are basically connected

in a declarative way.

So there's no need to manually do some Query selection

like this here.

So all we are doing is to tell React

that the ref that will contain this input element here

should be, well, this input element ref that we created.

And so now in order to use this ref in the third step,

we can use again the useEffect hook.

So a new function that simply runs on mount.

So we need to use an effect in order to use a ref

that contains a DOM element like this one

because the ref only gets added to this DOM element here

after the DOM has already loaded.

And so therefore we can only access it in effect

which also runs after the DOM has been loaded.

So this is the perfect place for using a ref

that contains a DOM element.

And so now if we want to do the same thing as before,

we just use our input element.

And then remember that we need to read the current property

which is basically like that box

where whatever we store in the ref will get stored.

So inputElement.current.

And so this here is now really the DOM element itself.

And so this is where we can then call the focused method on.

And just to show you,

we can also lock this to the console of course.

So inputElement.current,

give it a Save,

and let's manually reload here.

And so you see that just like before,

our input field got automatically focused

and also the DOM element itself

was rendered here to the console.

And so again,

this means that we successfully connected the ref

that we created here with this DOM element.

So simply by passing this ref into the ref prop.

And so then in a use effect after the DOM has been loaded,

we can use this DOM element inside the ref.current property.

All right, but now I actually want to do something

a little bit more interesting.

So to show you the new feature

that we now want to implement,

let's come to our demo here.

And now when I'm anywhere in the application,

I will hit the Enter key.

So I just did that

and then automatically this input field got focused.

And so that's a really nice feature

so that we can very easily search for movies.

So let's say that I had just searched for this movie

then I took a look at this one,

and now at a certain point,

again, I hit the Return key.

So the Enter key.

So you see that selected the field

and it also removed all the search Query text

that was still in there.

So let's implement that.

And so for that,

the first thing that we need to do

is to listen for that key press event.

And in fact, we already did something similar before.

So in the movie detail,

we already listened here to the keydown event.

Now in this case,

we do actually need to manually select here this document

and then add an event listener there.

So there we cannot use a ref

but that's just the way that things work in React.

So let's do that.

So document.addeEventListener.

And then on the keydown event.

And here let's actually again,

specify a callback function

which we will then create here

and we need to call it callback

and it gets access to the event object.

And let's place that here.

And so the reason why we placed this

in a separate callback function

was so that we could clean up after our event.

So return,

and let's use an arrow function here now,

make it a bit shorter,

addEventListener,

keydown,

and then the callback.

Okay.

But now of course this will work on any key press.

So whenever any key is pressed,

it will call this callback function

and then our element will get focused.

But we only want that to happen

when the Enter key is pressed.

So let's say E.code needs to be equal,

Enter,

and it really needs to be uppercase here.

And so in that situation,

then focus here on the input field.

So let's see if that works.

I'm going to hit the Enter key now

and yeah, beautiful.

But now let's say that I already had

searched here for something.

And so if I hit the Return key now,

then of course it will simply focus here

but it will not delete the text yet.

But that's very easy to solve.

We just say setQuery

which we already get access to here in this component.

So we just set that to an empty string.

And so that should now work as I hit the Enter key again.

And indeed there it is.

There's just one final problem,

which is let's say that I'm writing this

and then I hit the Enter key again

and so this will then delete the text that we have.

So basically we don't want all of this here to happen

when the element is already focused,

so when it's already active.

But luckily for us

we can easily check which element is currently active

thanks to the document.activeElement property.

And so thanks to that we can say

if document.activeElement

which again is the element that is currently being focused.

So if that is equal to our input element,

so inputEl.current then just return.

So in this case,

basically just don't do anything.

Now all right, so let's try that again.

So that just works fine.

But then if I write something and hit Enter,

well then actually that still doesn't work

so let's try to reload our page maybe that will fix it.

So let's try that again.

So here it still works.

And now ah,

now it's actually fixed.

And with this

we actually finish building this small feature.

So it was just a minor feature

but it was very helpful to understand

how we use refs to select DOM elements in the React way.

Now there's just one small thing that I'm noticing here

which is that React is complaining

about a missing dependency.

And so yeah, this is once again really helpful

because it tells us immediately what we have to do.

So here we have to also place the setQuery function.

And so that's because the setQuery function

is indeed a prop to this component.

And so therefore,

since we are using it here in the effect

we then need to declare it in the dependency array.

Now dysfunction is not really ever going to change

but React still needs this to be here

in the dependency array.

# Refs to Persist Data Between Renders

So after using a ref to select a dumb element

in the previous lecture, let's now focus

on the other use case of refs

which is to simply give us a variable that is persisted

across renders without triggering a re-render.

So let's just search for some movie here.

For example, this amazing classic "Back to the Future".

And so now let's say that behind the scenes

of this application, we want to count how many times

the user selects a different rating.

So for example, let's say first I rate this three,

then seven, and then nine.

So this means that it took me a long time to decide

between the right rating of this movie.

And so let's say that

in our application we somehow wanted to register that.

Now I said behind the scenes

because we actually don't want this data to show up

on the screen.

So basically we don't want

like a counter anywhere here in the app

which tells us how many times the user has clicked here.

So again, it should happen behind the scenes.

And so this time what we need is a variable

that is persisted between renders

but that does not cause a re-render when it is updated.

And so a ref is a perfect use case for this.

So let's then come here to the movie details component

and let's create ourselves a new ref.

And I like to do that right here after the states.

So let's call this one here, countRef,

and then again use ref.

And then just like with useState here we pass

in the initial value of that variable.

And so in the beginning, the count is of course at zero.

All right?

And so now the idea is

that each time the user gives a new rating,

so by clicking here on one of the stars

this countRef ref should get updated so that then

when the user actually adds the movie to the list,

we can then add that here to the new watched movie object

so that we can then finally store that value somewhere.

So that count that we're going to create here

but first let's not take care of actually updating the ref.

And the way we do that is again, using a useEffect,

because remember that we are not allowed to mutate the ref

in render logic.

So instead we need to use a useEffect.

Okay, and when do we want to update the ref?

Well, each time that the user rates the movie again.

And so that's each time

that this piece of state here updates.

Okay.

And so now all we want to do is to take our account ref

and then manually mutate the current property.

So we can say that countRef dot current

should be equal countRef dot current plus one.

Okay.

And actually this updating here should only

happen when there already is a rating

because the effect will also run on mount

and so then it will already add plus one here

even without the user having rated.

So let's just say if there is a user rating

which in the beginning is not

because it'll still be this empty string.

Okay.

So again here we imperatively,

basically updated this variable.

So with a ref, we don't have a set function

but instead we simply mutate the current property

which is in the ref.

And so that's why we say

that a ref is basically like a box that can hold any value.

So we could, for example, also,

instead of just storing the count here,

store all the different ratings that the user has given

in an array.

So that would also be perfectly possible.

But anyway, let's then now come here

to the function where the new movie is actually added

to the watch list.

And here,

let's then create a new property countRatingDecisions.

And so this should then be equal

to the countRef dot the current property now, right?

And that's it.

So this should now already be working.

So let's test it out here.

Let's just make sure to reload.

All right.

So let's count how many times we click here.

So let's say first we think the movie is a seven

then maybe, ah, maybe it's a nine

but then we think even better.

And then we come to the conclusion

that it's actually an eight.

So we decided three times here.

And so let's now add this to the list.

Now in order to check out if this actually worked,

let's come here to our app.

So where we have our state so that

in there we can then see if the value was correctly set,

because of course we are not rendering

that new value anywhere here.

So here it is.

And indeed, countRatingDecisions was was set to three,

which are exactly the three times

that we clicked on a different rating.

Nice.

So let's just recap what we did here

and why this works.

So we created this ref here where we want

to store the amount of clicks that happened on the rating

before the movie is added,

but we don't want to render that information

onto the user interface.

Or in other words, we do not want to create a re-render.

And so that's why a ref is perfect for this.

So then each time the user rating was updated,

the component was re-rendered.

And so then after that re-render, this effect was executed

which means that after the rating had been updated,

then our ref would be updated as well.

So we would update the current property

to simply adding one.

So we can actually make this a bit simpler.

So just like this, or even,

could even do this.

So this works just in the exact same way.

And so then we just used the countRef dot current property

later down here whenever we create a new object

to be added to our list.

Now of course, if we tried to do the same thing

with a regular variable, then that wouldn't work.

So let's try that also.

Let's say count.

So just count equal zero.

And then, so let's just do the same thing here.

So if user rating, then count plus plus.

And then here we also need to add count

which for a ref we do not.

And then let's just add that count here.

So then we will see that this doesn't work.

So let's reload.

Let's empty this entire thing.

Okay, so clicking 1, 2, 3, 4 times now,

add to the list.

And then again we come here to the state.

So once again, really, really helpful

to have these dev tools.

And then we see that we have four countRatingDecisions,

but the count here is only at one.

And so this one is basically just the last click

that happened.

So the let variable, which is just a simple variable,

is of course reset after every re-render.

So it's always going back to zero.

And so then when the last click happened

that zero was here, increase to one

and then that count was added to the object.

So in conclusion, this normal variable is not persistent

across renders, and it doesn't trigger a re-render.

On the other extreme,

we have state which does both of these things.

So triggers a re-render and it is persistent.

And then in the middle we have a ref

which is indeed persisted across renders

but it does not trigger a re-render when updated.

And so that's why we normally don't use a ref

in the JSX output.

All right.

So this was really just to drive home the message

how refs are different

from both states and also from normal variables.

Okay.

Now, we still have some problem.

We still have to count.

Ah, here it is.

So forgot to delete this one.

Okay, and later on we will even see some other

more real world use cases of refs, for example,

storing the ID of a timer to stop it.

But for now, I hope that this use case

of a ref also made sense to you.

And we don't use refs all the time

but it's still good to know how they work

and to keep them in the back of your mind.

# What are Custom Hooks? When to Create One?

Welcome back.

So, the last part of this section is all about custom hooks.

And so let's start by understanding what custom hooks are

and when to create one.

Now, custom hooks are all about reusability.

And in React, we have basically two types

of things that we can reuse.

A piece of UI or a piece of logic.

That's it.

That's all the things that we can reuse.

Now, if we want to reuse a piece of UI,

we already know that we use a component.

On the other hand, if you want to reuse logic in React,

you first need to ask the question,

does the logic that I want to reuse have any hooks?

If not, all you need is a regular function,

which can live either inside or outside of your component.

However, if the logic does contain any React hook,

you cannot just extract the logic into a regular function.

Instead, what you need to create is a custom hook.

So basically, custom hooks allow us to reuse stateful logic

among multiple components

and actually not only stateful logic

but really any logic that contains one or more React hooks.

So we can say

that custom hooks allow us to reuse non-visual logic,

which is a more generic term.

Now, just like regular functions or components or effect,

one hook should only have one purpose.

So it should only do one specific, well-defined thing.

So the idea is not to simply put all the hooks

of a component into a custom hook and call it a day.

No.

The idea is to make custom hooks reusable and portable

so that you can even use them

in completely different projects.

And actually, now that we have had hooks

for so many years in React, developers have started

to share their custom hooks with the world.

And so, there are now lots of custom hook libraries

that you can download from NPM and use in your projects.

Now, since custom hooks are made out of regular React hooks,

the rules of hooks that we learned about before still apply

to them as well.

Okay, but now, let's look at an actual custom hook

so that we can learn just a bit more about them.

So first, a custom hook is really just

a JavaScript function, so it can receive and return any data

that is relevant to this custom hook.

In fact, it's very common to return

an object or an array from a custom hook.

And notice how this is different from components,

which are also just regular JavaScript functions

but which can only receive props

and always have to return some JSX.

Now, the difference between regular functions

and custom hooks is that custom hooks

need to use one or more React hooks.

So this custom hook here, for example

uses two-use state and one-use effect hook to abstract

a simple fetch functionality into this custom hook.

And finally, in order for us

and React to recognize dysfunction as an actual hook,

the function name needs to start with the word use.

So, just like all the built-in React hooks.

So in this example, that's use fetch.

And this is really not optional.

So you need to give the function a name, starting with use.

Otherwise, it's gonna be just a regular function

in the eyes of React. Now, right.

And that's all the theory

that you need to know about custom hooks.

And so, let's now go build ourselves some custom hooks

for the rest of this section.

# Creating our First Custom Hook: useMovies

As our first custom hook,

let's start with a hook called useMovies.

So there are basically two strategies to decide

if we want to create a new custom hook.

So the first one

is that we want to reuse some part of our non-visual logic,

so just as we learned in the previous lecture.

And the second factor might be

that we simply want to extract a huge part of our component

out into some custom hook.

And so that's actually what we will do in this lecture.

So we will take this useEffect here,

which fetches our movie data,

and we will extract it into a hook called useMovies.

And so then we get rid of all of this code

here in our component.

And of course, if we wanted,

we could then later reuse this hook in some other project.

Okay, so in this lecture,

I will show you how we can extract all the stateful logic

that belongs together

into a nice and well-packaged custom hook.

So let's do that.

And actually for that,

I will create a brand new file here in our source,

and I'll then call it useMovies.js.

Okay, and from here, we will export a function,

which is going to be our custom hook

called exactly useMovies.

Okay, and notice that here,

I'm not doing an export default, but a named export.

And so that's kind of a strategy that I like to use,

so using default exports for components like this one here

and using named exports for custom hooks.

Now, that's not really mandatory,

but that's just the way I like to do it.

So you could, of course, also do a default export here.

Okay, and so let's start

by extracting these useEffect here,

so this huge thing,

and then we will notice

that we will need a lot more stuff than just this

here in this function.

Okay, so give it a save, and immediately,

we see that we are missing all of these state variables.

So in this case, these state setError functions.

And so that's because fetching the movies

requires a lot more than just this effect.

So notice how we actually also need

multiple state variables.

So the movies, isLoading, and error,

all of them are necessary

to make the functionality of fetching movies work.

And so, let's also extract them from here

and paste them where they're unnecessary.

Okay, and then we just have some problems with importing,

so import useState

and useEffect from React.

Okay, so that's looking already better,

but we still have some missing information right here.

So we're missing the key and we're missing the query.

So to fix that, we can simply accept the query here,

for example, as a parameter to our function.

And so now, remember that this really is a function.

This is not a component.

And so here, we don't accept props,

but really we accept arguments like this.

So even though our custom hook is not yet going to work,

let's already call it, so useMovies.

And so then again,

VS Code will automatically import this for us.

So now you have this line of code here

which again imports the custom hook that we just created.

And notice how it's using here at a curly braces,

meaning that this is a named export at a named import.

But anyway, now here we are calling our new custom hook.

And so let's pass the query in.

All right,

now we're not saving anything to a variable here just yet,

because for now, our custom hook is not returning anything.

And so let's actually change that.

So what exactly should we actually return

from this custom hook?

Well, basically, we want to return everything

that we need here in the app.

So basically,

all the variables that somewhere in our JSX are necessary.

And so that's basically exactly the three pieces of state

that we just removed from here.

So it's the movies, the error, and the isLoading state,

because again, we will need these somewhere here in our JSX.

So we have movies, we have isLoading, and we have error.

And so again, we, of course,

now need access to these variables right here as well.

And so that's basically what we will want

this custom hook to return.

And so, let's return them from here.

So I think that's the correct place, yeah.

So right after the useEffect, we will return,

and we will place them all into one object.

So it could be an array as well,

but it's very common to just return an object

especially when we have so many different things,

like movies, isLoading, and error.

All right, now here we actually have a problem now

with this handleCloseMovie.

So let's comment this out for now.

And now there's only one thing that we are missing here,

which is this key.

And so let's grab this, so copying it

and then pasting that here as well.

So it could also have passed this in

as an argument into the function,

but I think that the key itself

really should be part of this file here,

because it is tightly coupled also to the movie URL.

And so if we passed in the key,

then we should probably also pass in the URL,

but that we don't want.

So we want to make this as reusable as possible.

Okay, and so now, all we have to do is to then, here,

basically get the data that is returned

and destructure them here into their own variables again,

so that's movies, isLoading, and error.

And so that's actually it.

So again,

here we are returning these three pieces of information,

so these state variables

that we are going to need outside of this custom hook.

And so, basically, then this returns an object,

which we then immediately destructure right here.

And so then,

as far as the app component here is concerned,

having this is exactly the same as having all the code

that we had here in the component before.

And so if we give this a save and try this now,

then you see that it's working just like before.

The only difference right now

is that when we select a movie here

and then we search for another one, let's say test,

then this one here is not closed.

And so that's because we are no longer calling

handleCloseMovie.

So what should we do about it?

Well, we can just leave it as it is right now,

so in order to make this really reusable,

or we could also accept a callback function

that the user of this custom hook can pass in if they want,

and then we can call that at the very beginning.

And so this is a way of customizing this custom hook

a little bit more.

So we can think of this argument here,

again, a bit like the public API of this custom hook,

so just like we can think of props

as the custom API of a component.

So a custom hook like this can also be created by someone

and then consumed by someone else.

And so that's the whole point of creating reusable pieces

of stateful logic, okay?

And so, well, let's remove that from here.

And just to make this a bit more clear,

we can call this at the very beginning of our effect.

So we can say callback,

and then we only want to call it if it actually exists.

And so we can basically do optional chaining

on calling a function as well.

So that's just like this,

or actually the other way around, so like this.

And so now this function will only be called

if it actually exists.

So without this optional training part here,

we would first have to check if it does exist,

and then we would call it.

So if we now try this again,

since we didn't pass in any callback yet,

this will then work without problems.

So you see no problems there.

But now we can actually pass in that callback,

which is handleCloseMovie,

and we can use this function here

before it is actually defined.

Because remember, that in JavaScript,

function declarations like this are hoisted.

And so that's one of the big reasons

why I don't like to do this,

what many people do these days,

so writing an arrow function like this.

So if I did this, then I couldn't do it like this.

I would first have to create a function,

but like this, that's not necessary,

and so, one of the reasons

why I always prefer function declarations.

Okay, let's try this again.

So let's open some movie,

and beautiful!

So now the currently open movie is immediately closed

as the search query here changes.

Great, so with this,

we really cleaned up our app component here.

So we only have this small effect here left,

but we will actually also take care of that in the future.

And now let's just quickly recap what we did here.

So basically, we took all the logic that belongs together

to search for movies

and simply placed it here into this custom hook.

And notice that we used four hooks to achieve that result,

so one useEffect and three useStates.

And that's important, because remember,

a custom hook actually needs to use at least one React hook,

otherwise, it's just irregular function, right?

So we took all the logic that belongs together,

packed it here into this one function,

and then returned everything that is necessary for the app

to keep working in exactly the same way as before.

Now here we just need to probably also add the callback

to the dependency array.

But then you see we have this infinite reload here of error.

Now, fixing this is too difficult for us at this point.

So I actually didn't think of this,

because I hadn't even prepared this lecture here before.

So let's actually go back,

remove that from the dependency array.

But since we should really not lie

about our dependencies in the array,

let's then remove the entire ability to do this.

So I will just comment this out,

take away the callback, and here as well.

So then the custom hook will not work

exactly the way as it did before,

but that's not a big deal here.

So we are just learning,

so we just wanted to learn

how we can extract this non-visual logic into a custom hook

like we just did.

And to practice this a little bit more,

we will do a few more in the next few lectures.

# Creating useLocalStorageState

In this lecture,

we're going to create a new custom hook

called useLocalStorageState.

Which, basically, will behave

exactly like the useState hook,

but where the state actually gets stored in local storage.

And so with that hook,

we will then be able to replace this code right here.

So this state,

which gets the initial value from useState

or from local storage actually,

plus this part right here

which is responsible for storing the state in local storage.

Okay.

So, right in our source folder

let's create a new file for use

Local

Storage

State.

Now okay, so export, and then again

useLocal

Storage

State.

Now, some people would probably

just call this useLocalStorage,

but I want to make it really clear

that the idea of this hook

is to work in the exact same way

as the useState hook.

So, of course, here we're missing the function keyword.

But now let's come back here,

and in order for us to know

how we should design our hook,

let's first call it.

So, as I mentioned,

I want this hook to work basically

the same way as the useState hook.

And so it should also return an array of the state.

So let's call it watched again,

and off a setter function,

so setWatched.

And then,

we'll use localStorageState.

and, again, make sure that it is correctly imported.

And then, we want to pass in the initial state,

which, remember, for the watched array was simply

this empty array.

Right.

And so let's now comment out this,

and actually before I will copy it

and then comment it out.

All right.

So let's then come back here to our hook.

And so first of all, we can specify the parameter.

So the parameter here is basically the initial state.

Okay.

And now, I will paste in what we just had there before,

which is this state.

So, let's import useState here.

Import

useState

from React.

And now, here I want to give these variables here

some more generic names

because remember that the idea of this hook here

is to easily reuse it in other projects.

So let's just call this value here and then

setValue.

All right.

Now, right now we simply have a custom hook,

which sets some state

and reads the state from local storage.

But that's not super helpful yet

because, of course, we also need to update the state

in local storage.

So, we also need to get this useEffect right here.

So, let's cut that from here,

and let's actually delete all of this as well.

And then let's paste this here.

And, of course, we will have to rename then these things.

So, this is now no longer watched

but just our generic value,

right?

And then here, we need to also import useEffect.

Now, there's still one big problem here,

which is that we have this key here, hard coded.

So of course, again,

this needs to be reusable and generic.

and so therefore,

we need to allow the user to pass in

the name of the key.

So this is not 100% similar to useState anymore,

but this is really necessary, otherwise this cannot work.

All right.

Then here, we also need to pass in the key

because our effect here depends on that variable.

Now, okay.

And now, to return,

we simply return an array,

which has the value

and setValue.

And so then, it works exactly like the useState hook.

So here, we already destructured that result.

So that array, again, into the state variable and

into the state setter.

Now here, we just need to pass in that key.

So that's watched.

And as I save this, actually,

immediately our watched list is back,

which means that this custom hook is fully working already.

But let's just go back and do some fixes here

because in the very beginning,

if we had no local state at all yet.

So let's simulate that.

Here in the application tab.

So let's remove this.

And so now, this doesn't really exist,

and so then we should get some problem.

So here in the console.

Now, of course, we have these problems

because now our watch list is basically null.

And so then, our app somewhere

is trying to call the map method on that.

And so, we need to fix this,

and we do this by actually using null, the initial state,

which, up until this point, we actually have used nowhere.

So we passed it in,

but we haven't reused it anywhere.

So, what we need to do now is to check

if this stored value here actually exists

because right now it doesn't.

So, we can easily check that.

So, this will then be this null

that we can see here.

So, yeah, there it is.

And so, we need to say here, basically,

if there is a stored value,

then return this

and otherwise then return the initial state.

Which, in this case,

is going to be that empty array.

So, let's get rid of this.

Let's reload.

And so then, as we come back here to the application,

we will see that, indeed, now we have an empty array.

So that's our initial state that was stored

into local storage because of this useEffect, right?

So, remember that whatever this function here returns

will be the initial state value

of this useState hook.

And so then, at the very beginning

value becomes this empty array.

And then, as this effect here is executed,

after the re-render,

that value is already that empty array.

And so that's what is then stored

here into our local storage.

Okay.

So, that's again it.

So, what we did, again,

was to take all the code that belonged together

and placed it into yet another hook.

And in this case, we made it so

that this hook looks as close as possible

to the useState hook.

So, we also pass in some initial state,

and then we get back a state variable

and the updated function as always.

But thanks to our special custom hook,

now these work a bit different.

So, this piece of state here can be read

from local storage as the component first mounts.

While the setter function

will not only update the state itself,

but it will also update the local storage.

And so, we coded all this functionality right here

in this reusable custom hook.

Let's just test this one more time.

So being sure that it works.

Yeah. But here it appears.

And as we reload, then there it is.

So, great.

Just to make sure that you understood what happened here.

And if you want,

it might even be a good exercise

to put all the code back,

and then do it all again on your own.

But, anyway, if you don't feel like doing that

then let's just move on to the next lecture where

we will create just one more custom hook.

# Creating useKey

To finish this section,

let's now create another custom hook called UseKey

which will abstract the functionality

of attaching and removing an event handler for a key press.

So, here, in the movie details component,

we have that functionality that if we open a movie

and then hit the escape key on our keyboard,

then it'll close the movie.

And so, we implemented that using a use effect hook.

So, this one right here.

And so, since this is using a React hook,

we can abstract this into its own custom hook

because actually we do something very similar

to focus here on the search bar.

So, again, when I'm here and I hit the enter key,

then that will automatically focus this.

And so, that is using basically some similar functionality.

And so, it's a good idea to abstract this functionality

into a custom hook and then reuse that in both these places.

So, let's copy this code here.

So, just copy

and then let's create another file for another custom hook.

So, this one is called useKey.js.

And by the way, I forgot to mention earlier

that I actually also created a copy called app version 3

before we started extracting all the custom hooks.

So, basically that we can keep our code

before those custom hooks were implemented.

Okay.

But anyway, let's now export

the function called use key.

Okay, then let's just paste this here

and import use effect from React.

Okay.

And so, now, what do we actually need

as inputs to this custom hook?

Well, this one is actually the easiest one of all

because this one doesn't need to return anything.

And all we need is to know what should happen.

So, basically we need a callback function here

and we also need the user of this custom hook

to tell us on which key

the effect here should actually be executed.

So, not the effect but the callback that they will pass in.

So, we want the key,

for example, in this case here,

that would be the escape key.

So, here, instead of escape,

we will have just a key

and then we want some callback for an action.

So, just like this.

And then instead of calling of course, on close movie,

we just call the action that the user passed in.

Then here we also need the key.

And so, again, never lie to React about your dependencies,

and always make sure to include every single variable

that is used here into your effect.

Now, okay.

Now, here we just need one small fix, so to say

because the user might pass in this key

like in different formats.

So, they might write,

escape like this, or maybe all in lower case,

or maybe by mistake they write like this.

And so, what we should do here

is to just transform this key that they pass in

to lowercase,

and then also, the code that we get

from the event to lowercase as well

so that we can then correctly compare them.

And that's a pretty normal thing to do

when we compare strings.

And so, this showed at this point already be working.

So, let's come back here and then let's use usekey.

So, again, make sure that the file was correctly imported,

and if it didn't, then go ahead

and do this line of code yourself now.

And so, here, we now need to pass in the key.

So, that's in this case, the escape key.

So, we want to replace this effect right here.

And so, that's again the escape key

and the action will be on close movie.

So, this function right here

with the difference that of course,

now we do not call the function,

but instead, we will allow React to call this function

at a later point.

So, basically when this event happens

and the key is the escape key.

So, this whole functionality is now inside that function.

And so, just to make sure, let's reload.

Let's open up some movie, hit the escape key and nice.

So, our custom hook is working,

and so let's now immediately reuse it

in this search component.

So, where is that?

And of course, if I were

writing this application for myself,

I would've long divided this file into multiple components.

So, this is the last one

we will have one big file with everything.

But anyway, let's now again, use usekey here.

And so, this time, the key that we are looking for

is the enter key like this.

But now, as for the callback function,

this is actually a little bit more tricky

because watch at what we have here as the callback function.

So, we have all this where this part here, of course

is already in the custom hook.

So, where it compares the press key

with the key that we're interested in here.

So, basically, this action here

is corresponding to this part.

So, we could pass in a callback function like this

only with these two pieces

but then we would miss out on this part.

So, we also need to include that there.

So, this would then be like cutting it from here

and pasting it here,

which would not alter the functionality of this code at all.

And so, let's do the same thing here.

So, basically, what we have here

should now be just the callback function here.

All right.

And so, then we can get rid of all this year once again.

And also of this comment,

since we also have this in that other file that I stored.

And so, let's see if this works again.

So, hitting the enter key.

And yes, that works just as well.

So, here, the callback function.

So, this action, as we called it in our hook

is a little bit different.

So, a bit longer than before.

But all it does is to just describe

what we want to happen when the enter key is pressed.

Nice.

So, with this, we finished this part about custom hooks

and actually we finished this entire application.

So, we are done with this app.

Let's just see why there are some problems here.

Let's reload that.

Okay.

So, that was from something else.

But anyway, we finished now this application

and this section as well.

And so, just like always,

all there's left to do

is one more coding challenge

where you will now practice to build

your own custom hook on your own.

So, don't skip that video

because it's pretty important

that you start getting into the habit

of writing these hooks on your own.

# CHALLENGE #1: useGeolocate

```jsx
import { useState } from "react";

function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}

export default function App() {
  const {
    isLoading,
    position: { lat, lng },
    error,
    getPosition
  } = useGeolocation();

  const [countClicks, setCountClicks] = useState(0);

  function handleClick() {
    setCountClicks((count) => count + 1);
    getPosition();
  }

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        Get my position
      </button>

      {isLoading && <p>Loading position...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && lat && lng && (
        <p>
          Your GPS position:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
          >
            {lat}, {lng}
          </a>
        </p>
      )}

      <p>You requested position {countClicks} times</p>
    </div>
  );
}
```

 In this challenge

let's practice creating a custom hook based on some code

that is already working.

So here we have a very simple application

which all it does is to get your position

using geolocation as soon as you click on this button.

So when you click here, your browser will then automatically

ask for your permission and then when you allow,

it will give you your GPS position

and the link which you can click

and which will bring you to the OpenStreetMap application

on your location, okay.

Also, the app then clicks how many times

you have requested your position

and so if I click here again,

then it changes to 2 and it loads again, okay.

And as I was saying in the beginning,

I already have all of this code working here

in your starter file.

So the application, again, is already working just fine

and you can of course check out all the JSX code

that I wrote here, but what matters is this other code,

so all of this here, outside of the JSX return.

So my task for you now is to extract this logic

into a custom hook called "useGeolocation,"

and then use that custom hook

to make this component work again,

so working in the exact same way as before.

Now, I want you to think about the fact that a custom hook

should be as reusable as possible

and so of course I want you to write a useGeolocation hook

that you could then use in any other app

that you'll ever build.

So if we think about this, then maybe those future apps

where you might need this custom hook,

they don't want to count how many times we have clicked

on the button here, right?

And so this state right here might not really be relevant

to this custom hook,

so this custom hook should really only contain the logic

that is about getting the position from geolocation

and so that's what I want you to think about

while you are doing this exercise.

So again, basically make sure to not include

this state here, which indicates how many times the button

has been clicked, so that's a small additional challenge,

but I'm sure you can do it.

And again, the goal is to then have the application

in the end look and work exactly as it is working right now,

so take all the time that you need

and then I see you back here with my quick solution.

So let's get to work

and so let's grab all the logic that is related

to the geolocation, so that's all the state

and also this event handler here

except for this counter here

and for now also accept this part here,

although that is debatable,

but let's just comment this out for now.

So let's grab all this code right here,

cut it, and then paste it here,

but of course now we will need to adjust a few things

and the first one is that, of course,

now this counting logic here is no longer part

of getPosition, so let's cut that from here

and paste it into some function here.

So let's say handleClick,

and then let's do that here

and so then here we will actually call that other function

because inside handleClick is where we will then

update the CountClicks state

and also actually get the position.

So let's save for now, but of course we are now missing

all of these variables here

and so just like we did previously,

we now need to return all those variables from our hook,

so that is actually pretty easy.

So let's just return an object,

so it isLoading with position with the error

and then also with the getPosition function, all right.

And then we see here we have no longer

any yellow underlinings,

all we have now yellow is this function

because we are not using it anywhere, so let's change that.

So useGeolocation and then this will, of course,

return an object with these names here,

and so let's just copy that, that's a bit easier,

so we will destructure all of that right here

into these four variables.

Now, you could also have done this destructuring here

right here inside useGeolocation

and then instead of returning the position,

you could have returned the latitude

and the longitude separately,

but here I just returned all of them at once

and we can now actually do nested destructuring.

So we can also immediately destructure the position

right here, so lat and lng and they're called this way

because here we are constructing that position object

with these exact property names.

Okay, then we don't need this anymore and then here,

all we have to do is to also call getPosition

and with this we should be good to go,

so let's just reload here

and there we go.

So the state updating works here and here as well

and of course our link is also still working, nice.

So that's actually already it, so this was a fast one,

but also a very important challenge

which hopefully made it even more clear

how we create our own custom hooks.

So basically we take all the non-visual logic,

so all the logic that contains some React hooks,

and which is relevant to a certain thing

and so in this case, that thing is to use geolocation.

So then we took these three state variables

and also this event handler function

and then returned off that from here and used it here.

And so then we encapsulated all of those states

and all the logic inside this custom hook,

then of course, this state we left outside

which then forced us to do a couple of changes here

in the event handler for the button,

but all that is pretty simple.

And so I hope that you had some fun with this

and that you're now ready to move to the section

that is coming up next.

So see you there.