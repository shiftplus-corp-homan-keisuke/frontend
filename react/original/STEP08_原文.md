memo from 186 to 202

# The Advance useReducer Hook

where we'll dive deep into the advanced useReducer hook.

This special hook gives us another powerful way

of managing state, and since state is super important

in React, useReducer is a super important hook,

and it's also important to master it

in order to later understand Redux.

So that's why I dedicated an entire section

to the useReducer hook.

Now, this section does run pretty long,

but that's because we're gonna use useReducer

to build this entire new project.

Reinforcing all the other skills

that you have already learned so far.

So if you're looking to save some time,

you only need to watch, like the first five or six videos

in this section.

At with that being said, let's now jump right in.

# Yet Another Hook: useReducer

Let's start this section by getting

a first high level overview of

how to use the usereducer hook in practice

over this lecture and the next one.

And as always, it is time to create yet another project.

So let's move to our folder

and then let's run NPX Create-React-App at version five.

And then the app that we're going to build in this section

is gonna be called React Quiz.

Now, right?

And now let's wait until Create-React-App

finishes installing all the packages that we need.

Okay, and now it's time for our usual cleanup.

So first I'm gonna rename this here.

So we're already in our 10th project.

And now let's get rid of all this stuff here as always.

Okay, then getting our starters from here.

And this time we have five starter files

so I think that might be a record.

Then yes, replace the CSS file

and then let's just drag and drop our folder onto VS code.

And then as always,

let's also delete all the stuff we don't need from here

and the rest is okay.

So we need the Up component

and we need to include the CSS file

which as always, is part of the starter files right here.

So let's start by opening up the app file

and the date count file,

which we will need soon.

And then here, let's delete everything

and start the app component from scratch.

So export default function app.

And then here let's just create a div.

And in this div I will immediately call the

DateCounter component.

So DateCounter

and then I need to import that

from DateCounter.

So let's take a look.

So opening up our integrated terminal

and then NPM start.

And so this is what you should see

if you successfully started your application.

So let's also close the app

because in these first two lectures,

we will only be working with a DateCounter.

So this DateCounter is identical to what we implemented

in one of the previous challenges.

So basically here as we click on one of these values,

it will then increase the date.

We can also update that number here

and you see that then it also increases the date

and we can change the value on this slider,

which is basically the step.

So if we then click here,

it increments by whatever the step value is here.

Now, okay.

And so what we're going to do now

is to basically replace these two usestate hooks

with Usereducer hooks.

So it's very important that you understand

exactly what this code here does and how it works.

And so in case you didn't do the challenge

or don't really remember,

then please take a few minutes now

to really check out this code.

So all the event handlers that we have here

and how they update these two states

and how the states interact with one another.

So only proceed in this lecture

once you are really sure how everything works here.

Now, okay, but anyway,

let's now finally talk about the usereducer hook.

So the usereducer hook is basically

a more advanced and more complex way of managing state

instead of the usestate hook.

Now the usereducer hook works with

a so-called reducer function,

which is a pure function

that will always take in the previous state

and the so-called action as an argument

and will then return the next state.

But instead of talking about it, let's actually use it.

And I will start by replacing

this first count state right here.

So let's write again, count,

and then dispatch

and I will explain what these mean here in a minute.

And so then usereducer.

And so this hook takes in not only the initial state,

but also the reducer function that I was just talking about.

So let's already write that here

and I will then create dysfunction in a minute.

So that's the first argument.

And the second argument is again the initial state.

And so that's again zero.

So let's then comment out this state

and then let's create outside of the component,

that reducer function.

So that's just function reducer.

And so as I was saying, this reducer function

takes as the arguments, the current state and an action.

And so the first thing that we're going to do

is to just lock these two to the console.

Now, okay.

Now here we got a couple of errors.

So let's just comment out all of this code here.

So we actually no longer need any of this.

And then we also need to include

the usereducer hook into our application.

Okay, let's maybe reload here.

And there we go.

Okay, so we have our reducer function

but when does this function actually get called?

Well, that's where this dispatch here

actually comes into play.

So we see that the usereducer hook

does return the current state,

so just like the used state hook.

But then instead of also returning a state updating function

the reusereducer hook returns as a second thing,

this dispatch function.

And so this dispatch function

can also be used to update the state.

It just works in a slightly different way.

So let's just call this function right here.

And then let's pass in the number one.

And actually let's do that in the increment event handler.

So the one that is going to be called

when we click here on this button.

So let's actually click on this button

and here we get our output.

Let's make this a bit bigger.

And so the output that we get,

so the console dot log from here is zero and one.

Meaning that the state is zero and the action is one.

So why is that?

Well, it is because the reducer function

gets access to the current state

as I was saying in the beginning,

which right now is zero.

So it's this initial state.

And then it also gets access to the action,

which right now is simply this one

that we passed into the dispatch function.

So this is basically going to become the action

in the reducer.

And so the idea of the reducer

is to take these two things,

so the current state plus the action,

and based on that, return the next state.

And so let's do that.

So all we want to do is to return the state

plus the action in this case.

And so whatever we return here

will then become the new state.

And so this means that right now

our value here should become one.

Let's just reload.

And there we go.

So our state was indeed successfully updated.

Now when we click here,

of course nothing's going to happen,

but let's fix that.

So let's then again call the dispatch function,

which in the terms of usereducer,

we call dispatching an action.

So here we will dispatch an action of minus one.

And so then that minus one will get added

to the current state,

which will then decrease the value.

And so that works just fine.

Great. Now at this point, this isn't really useful, is it?

I mean, we had to do a lot of additional work

to get the same functionality as just this, right?

But trust me, it will get a lot more useful

as we keep going here.

So next up, let's think about how we can set the state

because remember when we type some number here,

we actually want the state to update to that number.

So that's what we have here in the defined count.

However, this is not going to work really in the same way

that we have been doing.

So here if we just dispatch

E dot target dot value,

then that will simply be added to the current state, right?

So let's write something here

and I will now write a zero so that we then have 10 here.

But then as I wrote the zero,

it actually added that to the state

because well, here we are just adding the action

to the current state.

And so if I now write another zero,

that will just get added to the state

that is already here as well.

So that's not at all what we want.

And so therefore now it's time

to actually start thinking about actions here.

So basically in this case, we have three actions.

We have decreasing the count, we have increasing it,

and we have setting it.

And so we should actually name these actions.

So what we're going to do is to not just pass in this value,

but an object which contains the action

as well as this value.

So let's write type

and then let's call this Dec for Decreasing

and then Payload and then set it to one.

Now, okay.

So this object is what we now call an action

when we work with reducer functions.

And in theory, this object here

could have any shape that we wanted.

But it is kind of a standard to always just have

the type property and the payload property.

So actually not playload, but really payload.

So this is the standard that you will always see

when using the usereducer hook.

And the same is actually true later in Redux.

So in case you heard of that.

So let's do the same thing here as well.

So type.

This one will be Inc and then the payload here

will just be one.

Okay? And so now here, instead of just doing this,

we now need to account for these different types.

So let's say if the action dot type is Inc,

well then, return the current state

plus action dot payload.

Then if it is decrease, then minus.

And if the action dot type is set count,

which we will create later,

well then actually,

simply return action dot payload.

But let's experiment now with this

so that it makes more sense.

So let's reload.

And first of all, let's see if this works now.

And beautiful.

So really nice.

And now here, let's dispatch also.

Actually an action object with a type of set count.

And then here the payload

will be whatever value is typed into this field.

And so now this actually works.

So whatever value I type here now

is this E dot target dot value.

And this will become the payload in this action right here.

And so then we dispatch this action to our reducer.

And so then that action contains that value.

So this 700 right here and the type.

And so then based on that type,

we decide that the next state should become

exactly that value.

So that 700 in this case.

And if all this sounds and looks really confusing,

then please don't worry at this point.

So now we are only getting like a overview

of how all this works in practice

but I will explain you exactly what the usereducer hook is,

how it really works, and yeah,

we will have some nice diagrams

and hopefully by then all of this will make a lot of sense.

Now, just to finish here,

let's think a little bit more about this.

So actually, is there a need to pass in the payload

right here and right here?

Well, not really,

because the reducer should actually know itself

what happens when we want to decrease, right?

So decreasing and increasing is really just

adding or subtracting one.

And so we should add that logic here

directly in our reducer.

So our reducer should know by himself or by itself

how to perform these types of actions.

And so then we can remove the payload from here

and make it a little bit easier to dispatch this action.

So the payload property here is optional.

And of course here in this case, we still need it.

So we basically still need to pass our reducer,

this value here.

Cause otherwise of course,

it would've no way of setting the next state.

Now, okay, and so this still works.

And with this, we finished the first part

of transforming this count state here

from a simple use state to a usereducer.

And so let's quickly recap what happened here.

So this new hook takes in

not only the initial state which was zero,

but also a reducer function

which will always get access to the current state

and the action that we pass into the dispatch function.

So where does this dispatch function come from?

Well, it is one of the things that usereducer returns.

So this returns always the current state,

which here we decided to call Count.

And then it also returns the dispatch function,

which we can then use to dispatch actions like this one.

So the convention is

to dispatch actions that contain a type,

and then optionally also a payload,

with the goal to pass in some value into the reducer.

And so then our reducer function

takes the current state

and it takes all the information

that is contained in the action

in order to compute the next state.

So usually based on the action type,

the reducer then takes some kind of decision.

For example, if it's Inc, so increment,

then it simply adds one.

If it's decrement,

then it subtracts one from the current state.

And if it's set count,

then it will simply set the new state

as the value that came in as the payload.

And so those values are returned.

And so this returned value

is what will become the next state.

And so then as always,

the component is re-rendered and DUI is updated as well.

Okay, so hopefully this made a bit of sense,

but if not,

well we will have lots of opportunities to practice this

throughout this section and the rest of the course.

Next up, we will also incorporate this step here

into our reducer.

And so let's do that in the next video right away.

# Managing Related Pieces of State

So let's now also incorporate the step state

into the Reducer that we have been building.

So usually we use Reducers

when we have some more complex state to manage.

So not just one single value as we have been doing here.

So what this means is that usually

the state is going to be an object

and not just one single value.

So let's now comment out this here as well,

and then let's define an object called initial state.

And this again is a pretty common name.

And so here let's define our count as zero

and then the step as one.

So exactly the same default values that we had before.

And then here we will now pass in that initial state

instead of just the zero.

And then here now our state will no longer be called count,

but, well, let's call it "Just state".

And we could also immediately destructure

that state object error, but let's do that here.

So let's say count and step destructuring from state.

And so now again, we have this function here

that we had before, which now no longer exist.

Okay.

And now also what we have here is not

going to make a lot of sense anymore.

And so let's just go back

for now to our console.log here.

Also don't need this anymore.

And so let's just quickly reload and click on one

of these buttons here, which will then dispatch an action.

And here we have our first problem.

For some reason, maybe we actually need to return something

from there, but let's just try that again.

Yeah, so that doesn't really work.

So let's just try to return some object from there.

So you maybe don't have to even do this.

So this is just to avoid that error.

And so yeah, now that works.

So all I wanted to do here is to now show you the state

and the action again.

So the state that we now get in the Reducer is the same

as this initial step that we passed into use Reducer.

And so then we need to return an object with the same shape.

So it also contains the count and the step.

And so let's now adapt our Reducer function here for that.

Now actually it is very common to use a switch

statement inside of a Reducer function like this.

So instead of multiple ifs,

we just do usually a switch.

And the value that we want to evaluate is

of course the action type.

And then we just do one case

for well all the possible cases that we can have.

So what do we want to return

in the case that the action type is decreased?

Well, before we were just returning the state plus one

but now we can no longer do that.

So now we need to return an object

with this shape, remember?

So how do we do that?

Well, first of all,

let's set the count based on state.count plus one

and then we also need to set the step.

But instead of writing it out explicitly,

what we do is to spread

out the entire current state object here.

And then with this part here,

we basically override the count property there.

And so this is exactly the way that we have been

updating objects in the past as well.

So basically creating a brand new object

which contains all the information of the previous object

and then whatever we want to override.

Now here I'm getting this warning

because we need also a default.

And so here in case we basically get an action

that is not recognized by our switch

we just throw a new error which says unknown action.

Well, this is still not happy,

but well, let's just keep going here for now.

So don't really see what the problem there is.

So let's do the other case as well.

So to increment is minus one

and the error is still not disappearing.

But the reason for that is

that here we are already returning

and so then this code here would be unreachable.

Okay, and finally we have this other set count case.

So here I'm basically just converting the code

that we already had into a switch statement

and also to returning an object

with the shape again of count and step.

All right, so spreading out the state

and then the count will be equal to action payload.

Okay, so for now, this is going to work exactly

the same way as before,

except that I did switch here.

So here it is, the plus and here the minus.

So let's, yeah, now that works.

And if I type here, then that also updates the state.

Great, and now let's actually do the same thing here

for the step.

So here we now also want to dispatch an action

with a type of set step, right?

And the payload is going to be exactly the same.

So again, we convert to a number E target value, okay?

So set step.

And so now here we need to then add a new case for that.

And so in this case, we want to return the entire state

and set the step this time to action.payload.

So that's state, let's reload.

And yeah, beautiful.

That works.

And so now the only thing that we have to do is to

actually take this step here

into account when we increase and decrease here.

So that's easy enough.

So that's just state step.

And then here of course the same thing.

And so now this should become two, yes

eight and so on and so forth.

Now, okay, let's just get rid of this here.

And well, up until this point

maybe all of this still doesn't seem so interesting.

So everything that we did so far could easily

have been achieved with the use data hooks as well, right?

But now let's actually do something different.

Also, get rid of these here.

Okay, so as I was saying,

let's do something different.

So which is this reset function.

So what we did before was to simply take the two

state setters and then call both of them

but now we can do one big state transition

which does all that at the same time.

And so that's going to be one

of the huge advantages of the use Reducer hook.

So especially of course

if we had even more states than just these two.

So let me show what I mean in practice.

So here we can just dispatch an action

with a type, for example, reset.

And here we don't need to pass any data into the Reducer

and therefore we don't need to specify the payload

because we can do that right inside the Reducer function.

So let's then add that case here as well.

So reset.

And so then here

all we need to do is to return a new object

where the count is reset to zero

and to step is reset to one.

And so here we can essentially update these two pieces

of state at the same time,

and we can do even better.

Let's cut this from here.

So this can actually live outside that.

Then here we can just return the initial state.

All right.

And so if I click on reset,

then bam, there we go.

So our entire state just got reset to its initial state.

So all in one go just with one dispatch right here.

So all we're doing here actually

in these event handlers is to just dispatch.

And so we could just move all

of these dispatches then here,

right into the JSX.

So that would actually make a lot of sense

but I won't do that right now.

But yeah, we could just replace all these event handlers

that we have here because all of them

all they do is to dispatch actions, the logic itself.

So the real logic of what they do is now all centralized

in this one Reducer function.

And so that is the beauty

and the big advantage of the Reducer function.

So basically we have all the possible state

updates that can happen

in our application in this one central place here.

And so this makes it really easy to understand

the entire application without having to go

into all the different components

and all the different functions.

I mean, of course here we only have one component

and it's all really simple

but maybe you can start seeing how nice this can be

in a bigger application.

And in fact, we will see that in action

once we start building the big application for this section.

But all these advantages will become more clear later on.

For now in these two lectures.

I just wanted to focus

on the mechanics of the use Reducer hooks.

So really how it works

and especially how this Reducer function here works.

But I know that this all looks very confusing right now

because I perfectly remember how I felt when I first learned

about this quite complex hook.

But since we are in the advanced React part

now it's time to learn about these more difficult things.

But anyway, in the next lecture we will have

some nice diagrams that will really illustrate the flow

of the data and of the state here.

And so stay tuned for that.

# Managing State With useReducer

So we just learned how to use the useReducer hook

to centralize all the state updating logic

in one central place, which is the reducer function.

So let's now dive deeper into the concept of reducers

and how and why they can make our applications

a lot better in certain situations.

So up until this point,

we have been using the useState hook

to manage all our state, right?

However, as components and state updates

become more complex, using useState to manage all state

is, in certain situations, not enough.

For example, some components have a lot of state variables

and also a lot of state updates

that are spread across multiple event handlers

all over the component or maybe even multiple components.

And so this can quickly become overwhelming

and hard to manage.

It's also very common that multiple state updates

need to happen at the same time

so as a reaction to the same event.

For example, when we want to start a game,

we might have to set the score to zero,

set an is playing status and start a timer.

And finally, many times updating one piece of state

depends on one or more other pieces of state,

which can also become challenging

when there is a lot of state.

And so in all these cases, useReducer can really help.

So these are the problems that reducers try to solve

and so let's now see how.

So first of all, useReducer is an alternative way

of setting and managing state,

which is ideal for complex state

and for related pieces of state.

Now, we already used useReducer in the last two lectures

and this is what that looked like.

So we call useReducer

with a reducer function and its initial state

and it returns a state and a dispatch function.

So starting from the beginning, when we use useReducer,

we usually store related pieces of state

in a state object that is returned from the useReducer hook.

Now, it could also be a primitive value

but usually, we use objects.

Now, as we already know, useReducer needs something called

a reducer function in order to work.

So this function is where we place all the logic

that will be responsible for updating the state

and moving all state updating logic from event handlers

into this one central place allows us

to completely decouple state logic from the component itself

which makes our components so much cleaner

and so much more readable.

So when we manage state with useReducer,

it's ultimately this reducer function

that will be updating the state object.

So in a way.

it's a bit like the setState function in useState

but with superpowers.

Now in practice, the reducer is simply a function

that takes in the current state and an action,

and based on those values, returns the next state,

so the updated state.

Now, keep in mind that state is immutable in React.

This means that the reducer

is not allowed to mutate the state,

and in fact, no side effects are allowed

in the reducer at all.

So a reducer must be a pure function

that always returns a new state.

And again, based on the current state

and the received action.

And speaking of the action, the action is simply an object

that describes how state should be updated.

It usually contains an action type and a so-called payload

which is basically input data.

And it's based on this action type and payload

that the reducer will then determine

how exactly to create the next state.

And now the final piece of the puzzle is this.

How do we actually trigger a state update?

Well, that's where the dispatch function comes into play.

So useReducer will return a so-called dispatch function

which is a function that we can use

to trigger state updates.

So instead of using setState to update state,

we now use the dispatch function in order to send an action

from the event handler

where we're calling dispatch to the reducer.

And as we already know,

the reducer will then use this action

to compute the next state.

Okay, so these are all the pieces that need to fit together

in order to effectively use the useReducer hook.

So an action object, a dispatch function, a reducer,

and a state object.

But now let's also look at the diagram

to really see how all of these pieces actually fit together

in order to update state.

So let's say

that we're in an event handler in some component

and we now need to update some state.

So what do we do? Well, that's right.

We call the dispatch function

that we got back from useReducer

in order to dispatch an action to the reducer.

And this action, as we learned before,

is an object that contains information for the reducer.

So information about how the reducer

should update the state.

In this case, the action type is updateDay

and the payload is 23, which probably means that the reducer

will set the day state to 23.

Now, the object doesn't need to have this exact shape

with a type in the payload, but it's a standard

that has been adopted by most developers.

Now basically, the reducer takes in this action

together with the current state

and it will then return a brand new state object

which we usually call the next state

in the context of reducers.

And as always with state,

updating state will then trigger a re-render

of the component instance.

Now, if you're wondering why the reducer function

is actually called a reducer,

the answer is that it's because it follows

the exact same idea as the array reduce method.

So just like the reduce method

accumulates all array values into one single value,

the React reducer accumulates all actions

into one single state over time.

Okay now, behind the scenes,

the dispatch function has access to the reducer

because we passed it into the useReducer hook, right?

So dispatch is really coordinating this whole thing

and also giving the reducer access to the current state.

And now to understand this even better,

let's compare the mechanism of useReducer

with a much simpler useState mechanism.

So when we use useState, we get back a setter function

and let's just call it setState.

And then when we want to update state,

we just passed the new updated state value that we want

and React will simply update the state

which in turn will trigger the re-render.

So it's a lot simpler and more straightforward

than useReducer, but since useReducer solves the problems

that we saw earlier in this lecture,

it's a great choice in many situations,

even though it's a bit more complicated to set up.

But we will talk more about the big advantages of useReducer

and also when to use it later in the section.

Now, I understand that this whole idea

of dispatching actions and writing reducers

is super confusing in the beginning.

I know because I do remember

how confused I was back in the day.

And so let me show you now a really helpful analogy

that made all this really clear to me

when I first learned about this.

So imagine that you needed to take $5,000

out of your bank account for some reason.

Now, since this is a large amount,

you can't just do it from an ATM,

so you need to go physically to a bank.

Now, once you are at the bank,

how do you actually get those $5,000?

Do you walk straight into the bank's vault,

grab the cash, and then go home?

Well, I don't think so, right?

That's usually not how it works.

How it does work is that you go into the bank

and there you'll find a person sitting at a desk

ready to assist you.

Now, when you arrive at the bank,

you already know how much cash you want to withdraw

and from what account number.

And so you walk right to the person

and tell them that you would like to withdraw $5,000

from account 923577 for example.

What happens then is that usually the person

will type something into his computer,

check if you actually have the cash in your account,

and if so, he goes to the bank's vault,

and gets the money to finally hand it over to you.

It's your money after all, right?

But note the big difference between this real version

and the previous version of the story

where you just grabbed the cash yourself.

In this real version, you told the person what to do

and how to do it and he then got the money

for you on your behalf,

and so you didn't take the money directly yourself.

And that's a huge difference.

So does this maybe start to sound familiar?

Well, I hope it does.

And so let's now bring this analogy back to useReducer

and identify what each of these pieces represents

in the useReducer mechanism.

And let's start with the most important thing, the state.

So what do you think the state is in this analogy?

Well, the state is represented by the bank's vault

because this is where the relevant data, so the money,

is stored and also updated.

So the vault is what needs to be updated,

and so that's our state.

Nice, so with that out of the way,

let's think about how the money is taken from the vault.

So about how state is actually updated.

So starting from the beginning,

what do you think the customer going to the bank

represents in this analogy?

Well, the customer going to the bank

and requesting the money is clearly the dispatcher

because it is who is requesting the state update, right?

And they're doing so by going to the person

and requesting to withdraw the $5,000.

So what is the reducer here and what is the action?

Well, the reducer is going to be

the person working at the bank

because that's the one who actually makes the update.

In this case, it's the one who goes to the vault

to get your money.

But how does the person know how much money to take

and from what account?

They know because you told him so

exactly in your request message.

And so that request message is clearly the action.

In this example, the action can be modeled like this.

With the action type being withdraw

and the payload being the data about the withdrawal

that you want to make.

So summarizing, you went into the bank

with a clear action in mind,

you then dispatched that action to the reducer,

so to the person working there who took the action,

and followed the instructions

to take the right amount of money from your account.

So from state.

he then gave you your money finishing this cycle.

So you did not go directly into the vault

and took your money.

Instead, you had the person, as a middleman,

who knows a lot better than you

how to perform different actions on the vault.

So he knows how to deposit, how to withdraw,

how to open and close an account,

how to request a loan, and more.

And he does all this

without you having to worry about the details.

So exactly like a reducer function,

which also decouples and abstracts

all the state updating logic away from you, so that you

can have clean and easy to understand components.

Okay, so I hope that this now made the relationship

between dispatcher, reducer, action, and state crystal clear

and you will get plenty of opportunities

throughout this section to practice all this.

# The "React Quiz" App

Let's start building a brand new app

that will hopefully show you how extremely helpful

the useReducer Hook can be.

And so this is the application that we are going to build

and it's called "The React Quiz."

So as the name says, this is basically a very simple quiz

about some React concepts.

So this starts by actually loading

the questions from a fake API.

And so at this point, we have received those 50 questions,

and so then we can start the quiz right here.

So here then, we have the question

with the four different options,

and up here, we can see our progress

and the number of points that we have won so far.

So here then, we can of course click on the correct option.

In this case, React is the most popular framework.

And so then immediately, it is marked as correct.

And also, the next button here appears

so that we can move to the next one.

And now this time, let's choose a wrong option.

And so of course, the correct one

is still marked here as correct.

Now of course, I will not go through the entire quiz here,

but we will see what the end result,

so when we reach the end of the quiz, looks like.

Now, just notice that here, we also have a timer running,

and so when this timer finishes,

then we automatically lose or we actually finish

the quiz by then automatically

and we only get the points that we have gathered

up until that point.

So all the state that we see here on the screen,

so which question was selected, the number of points,

which question we are right now, the timer,

and really, all the state is just managed

by one big reducer,

because that's what this section is all about, right?

Now, in this lecture, all I want to do

is to just set up here the app skeleton.

So basically, just setting up the structure

with the header and the app itself.

And so then in the next lecture,

we can start fetching the questions

and start building the application.

So we no longer need this component here.

And instead, let's come back to App.

And here, we then remove that date counter.

Okay.

So our parent div here will have the class name of app,

and then inside that app, we will have a header.

So basically, this part here with the logo

and the name of the application.

Now, as I said in one of the previous sections,

we will now start to actually create one file per component,

so making this project development a bit more real world.

Now, in case of the header,

I actually already created that component for us.

So it's just this very simple component

that doesn't even have any logic or any state

and it doesn't even accept props.

So it's just a very simple presentational component

that has the image,

so the logo and the title.

And so let's include that here,

just like this.

And of course, we then need to import that component

from that file.

So in the current folder, and then header.

And there we go.

So there we have our header and then, here below that,

we will have basically the main content.

And so for that main content,

let's create a main component.

And before we do that, I will just write the markup here.

So let's say that we want a main element

with the class actually of main as well.

And then for example, let's say we want a paragraph

with the progress, let's say 1 or 15.

So this is just some dummy content here.

And then, the question itself.

All right, so let's say that we just have this,

but we want it to be not inside the main HTML element here,

but instead, we want it to be inside its own component,

so that then here, our app component stays nice and clean.

So just having like different components,

but not these elements with their class names.

So let's then create a new file with a new component.

So this one will be called Main.js,

because Main will be the name of the component.

And now let's actually, for the first time,

use that snippet that I gave you

at the very beginning of the course.

So remember that.

Let's come here to the user snippets

and then it should be one of these.

Yeah, so the snippet that I mean is the RFC snippet.

And if, for some reason, you didn't add this

to your own snippets at the beginning of the course,

then you can just maybe copy the code from here

or you can go back to that setup lecture

at the beginning of the course,

because again, we will now use that snippet

and it will be extremely handy.

So all we have to write is RFC, hit Enter, and bam,

it creates a brand new component for us,

even with the name of the file.

So it got the name here from the file

and then it accordingly named the component.

And so now all we have to do

is to change, right here, our markup.

Now here, we want to change from a div to a main element.

And so remember how many times it was quite annoying

that we had to change this opening tag and the closing tag.

And so to fix that, let's install this extension right here.

So Auto Rename Tag.

So I already have it installed,

but just go ahead and do that.

And so then when I change this div to Main,

then you see that both of them change at the same time.

So here, the class name again of Main.

And now here, what will we place as the content?

Well, basically here, we want this content to stay

in this component,

so we want to just pass it into the main.

And so for that, we use the children prop.

Remember?

So basically doing component composition here.

And we have done this multiple times already at this point,

so this should be nothing new.

And so with this, all we have to do is to replace

this right here with Main.

And again, it then automatically replaced the tier.

And then all we have to do is import Main from Main.

Now, alright, now it looks the same here,

but now we have a bit of a better structure

and also, I think the component tree

is a lot more complete like this.

Well, actually this hasn't updated yet.

Yeah, so then also in the tree,

we can see that we have the app,

a header and a main part.

# Loading Questions from a Fake API

Okay, so let's now set up a fake API

on a fake web server

and then use that to load the questions data

into our application.

So this time, we're not going to use a real API,

because I created these questions myself,

and so then there's no API with that.

But I still want to basically pretend

that we are loading these questions from somewhere.

And so therefore, we can create a fake API

using an npm package called json-server.

So let's come here to our terminal.

Create a new tab, basically, here.

So with this, we keep this process here running,

so the one that is running our app.

And then here, we have another terminal.

Just make sure that we are in the correct folder.

And then let's do npm install json-server.

And in the meantime, I'm going to get some data here

from the starter data that I forgot to include

at the beginning of this section.

So when you copied the files,

you probably already got this questions.json.

But again, I did forget, actually,

to place this file here earlier.

So let's come here into react-quiz and paste this file here.

Or actually, what I want to do

is to create a new folder out here.

So let's call this folder data.

And please, make the same thing here in your file structure.

So creating a new file there,

and then let's move this questions.json file in there.

Okay, so make sure you have that file in that folder.

And in the meantime, this finished running the installation.

And now what we need to do next

in order to be able to call that package,

so to run the json-server command,

we need to add a new npm script here to this file.

So these npm scripts that we have right here

are basically the commands that we write here.

So each time that we write npm start, we are able to do that

because, here, this start command exists.

All right, and so let's now create our own npm script here

with the name of server.

And so what should happen here, then,

is that we want to call,

so we want to basically run the json-server package,

and we want to watch a certain file.

And so that file is going to be our questions data.

And actually, let's take a look at that data here.

So basically, it is just one object

with the questions property.

And then that property has one array.

And so then the array is our usual array of objects.

So each object, then, has a question, the options,

the correct one, and the number of points.

And so this is the file that we now want to watch,

so basically, to create an API from.

And so we just do data, which is the folder,

and then questions.json.

And finally, we also need to specify the port.

Let's say 8000.

And that should be enough to get us going.

So let's do npm run server.

So here, we need to run keywords.

It's not just npm server, but npm run server.

Okay, and so now we should have our API running.

But somehow, I see that, here, it's port 3000.

So here, it's probably all lowercase.

So give that a save.

Close that here.

So it was running, basically, before at the same URL,

so in the same port as our React application.

So let's reload that.

Let's retry this.

And yeah, now it is running on port 8000.

And so we can just copy this URL, change this to 8000,

and, well, then we should see our data here.

But apparently, there was some problem.

So let's see.

Well, now it thinks that it is already in use.

So let's maybe quit our other npm process here as well

and then run npm start again.

And then here, let's run npm run server.

Okay, that's still not working,

so we can just change to any other port.

So this doesn't really matter.

So if, for you, it worked like this,

then just go with that one and change the 8000 to 9000.

And actually, we also need to then add questions,

which is basically the endpoint we are creating here.

And it is called questions

because that is the name here of this field.

So if it was called like this,

then here, we would have to add these two as well.

So now this no longer works,

and our data would be here in this URL.

But of course, that doesn't make a lot of sense,

so let's just use this.

And also, you'll notice

that this is actually just the array.

So here, we see the array is exactly this one.

So let's now grab this URL

and then fetch it into our application.

So we want to load that data on mount.

And so for that, let's use our friend the useEffect hook.

And as I mentioned, let's just run it on mount.

So here, we want to fetch now from this URL.

And here, let's actually not even bother

with an async function.

But let's just use the then method to handle this promise.

So this will give us a response

that we need to convert to JSON,

which will then, in turn, return another promise.

So we chain another then handler there.

And so this should then give us our data.

For now, let's just log that to the console, then.

And also, let's catch a possible error here

by also logging it to the console.

Let's do console.error here.

And just like this.

Okay, so let's actually try that.

So let's reload, come to our console,

and beautiful.

Here is our data.

But now, of course, we will at one point

need to display that data here in the UI.

And so for that, we are going to need state.

And as you can imagine, we will now use the useReducer hook

to create that state.

So let's do that.

So here, we will get the state object

and the dispatch function, remember?

And then we use our useReducer hook,

which was an edit here to the imports.

And here, we passed the initial state,

which we don't have yet,

but we will create this object in a second.

And actually, first, we pass in the reducer function,

which we also don't have yet.

And so let's create both of them

outside, here, of this component.

So initialState and the reducer,

which will take in, remember, the current state

and the action that was dispatched.

Okay.

And now let's start by creating our initialState.

And here, let's create questions,

which, by default, will just be an empty array.

Now, besides this, what we also want is the loading state,

so to tell the user that questions are being fetched.

However, this time around, we will do it in a different way.

So we will not create the isLoading state as always.

But instead, we will this time have a status state.

And so this status will basically be a string

of the current status of the application

that will change throughout time.

So in the beginning,

our application will be in the loading state.

But throughout time,

we will be able to be in different states.

So let me write them right here immediately.

So we can be in loading state.

We can be in an error state.

We can be in a ready state

once the data has arrived and we are ready to start a quiz.

We can be in an active state

once the quiz is actually running.

And we can be in a finished state once the quiz is finished.

Okay.

And so this is a bit of a nicer way

of handling all these different statuses

that the application can be in.

So instead of having isLoading or isError

or isReady or isActive states, we just have the status.

And then inside the status,

we then tell the application what is currently going on.

So this has nothing to do with useReducer.

It's just another technique.

But anyway, let's now come here to our reducer function.

And then let's again set up that switch statement

that we already saw earlier.

So this is now basically a recipe

that you will always follow, which is always the same,

so at least the setup here.

So we switch the action.type.

So we basically want to test for different types.

And let's start with the case of dataReceived.

So this will be the action that we're going to dispatch

right here as soon as we actually have the data,

so right here.

And actually, let's do that first.

So here, we will now no longer log the data to the console.

But instead, we will dispatch an action to the reducer.

And let's create our common usual event here,

so that's simply with the type.

And so that's the dataReceived type,

which we can also think of, of an event.

So basically, it's like, here,

we are now creating this dataReceived event,

which our reducer will then, basically, respond to.

So that's the first part.

And now here we also need a payload

because we want to actually send some data,

so send some information to the reducer

so that the reducer can then use this

to compute the next state.

And so here, that payload will be the data

that we just received.

Okay.

And so here, then, remember,

we need to return a new state object.

And so we will grab all the current state.

And then we will set questions

to the data that we just received.

So that's action.payload.

But what is really great about this

is that we can now set this other piece of state

that is related to the question or to questions,

and that is the status.

So the status and the questions, many times,

will change at the same time.

And so that's why having a reducer is so useful

because now we can, here, in the same place,

also set the status to ready.

So basically, we updated these two state variables,

so these two pieces of state,

all in one go, in this one dispatch.

So just by dispatching this one event right here,

we updated both the questions and the status.

And so we say that we transitioned to a new state

by simply dispatching this simple event here.

Okay, but anyway, let's also create, then, our default case.

And so here, we will, just like before,

throw a new error saying that the action is unknown.

So give this a save, and let's see what happens.

So we are no longer logging to the console,

but we should now have those questions in our state already.

So we can't see it on the UI yet,

but let's take a look at our dev tools.

And yeah.

We have our questions in the state,

and the status has also successfully been changed to ready.

So we transitioned to this new state

where we changed these two properties of our state object.

So that's working great.

And now let's just create another event here, basically,

for the case there is an error.

So case dataFailed, for example,

that's just one possible name.

And so here, let's again return the entire state,

and then we simply set the status here to error.

And so then, later on, we will use,

of course, the status to display different things

here in our UI, in the JSX.

So when there is an error, we will display that error.

And if we are ready, so if the status is ready,

then we will display the questions.

All right, but now let's actually dispatch that action.

So the type is, this time, dataFailed.

And here, actually, let's not pass in any payload

because we're not really interested in the error

that we're going to receive.

So all we will do is tell our state

that now the status is an error.

So just to test this,

let's quit the process here, where we load the data.

So with Control+C, we can finish this.

And so now, we can no longer fetch data

from that endpoint, of course.

And so we see that we get some error already.

And also, here, we see that the status has been set

to error.

So that's also working, but of course,

let's go back to having our API work.

And so if we load now again,

then we have our questions here in the state.

Now, okay, so we did a lot of things,

so let's just quickly recap all that we did.

So we installed the json-server package

to create, basically, this fake API.

And then we created our npm script,

in this case, called server, to then run that package

and then watch the file

where we actually have this questions data as an array,

so this array right here.

And so then here, inside our application,

we use the useEffect hook to fetch that data

on the initial render.

Then, to store that data in state,

this time, we used the useReducer hook.

And so then we created the initial state object

and the reducer.

So that's pretty standard stuff.

So we have the questions array, and we have a status.

And of course, as we keep building the application,

we will add a lot more information here.

So we will add, like, three or four more pieces of state,

but for now, we are just working with these two.

And so then, as soon as our data is successfully fetched,

we dispatch the action here, where we tell our reducer

that the type of the action is dataReceived.

And then as the payload, we pass in the actual data.

And so then our reducer receives that action

and handles it right here, in this case,

where we then assign the payload,

so the data that we received from the API

onto the questions array.

But that's not all, because at the same time,

we now were able to set our status to ready here,

all in one go,

so just with the call of one dispatch function.

Now, the advantage of this reducer is,

of course, not really clear yet

because we only have these two cases yet

and only these two state variables.

But it will become really clear and really helpful

as we go through this section.

# Handling Loading, Error, and Ready Status

So, with our reducer now in place,

it's time to handle the different status

that the application can have.

So, remember that at the beginning,

our application is in the loading status.

So, that's how it starts.

And then when we receive some data,

the status change to ready.

And so, that's when we will then want to display

the list of questions.

And also, there can be an error.

And so, then the status changes to error.

And so now, we want to display different UIs

for these three situations.

And all of these situations will be always displayed

inside this main component right here.

So, let's get rid of this.

And now we will conditionally display some components.

And so, here, we can use state.status

but that's maybe a bit too much work.

And so, let's actually destructure our state object.

Now, we could do that outside.

So, creating these variables here

but we can do it on the fly.

So, basically right here with nested destructuring

so we can have the questions

and the status state destructured right here.

And so, now, state of course no longer exists

but we have status.

And so, now, we can just check,

for example, if it is loading.

And if it is, then we want to display something.

Now, in this case, we want to show a loader

and I actually also already have that loader component here.

So, it's again, a very simple presentational component.

And so, there was no need to create it from scratch.

So, it doesn't even receive any props.

And the same thing also for the error component.

So, exactly the same thing,

doesn't receive props, has no state.

And so, I thought we could save some minutes

and not write them manually here in the video.

So, here, if this status is loading,

we want to display that loading component.

And let's include that here

but just duplicate this line.

And actually it's called loader.

And then let's also already import the error.

So, here that is loader.

And then we have some problem here.

State is not defined.

But while I'm using state nowhere,

maybe let's just try to reload

and that fixes it.

Okay.

And now we can just do the same thing again

because these different status

are of course, mutually exclusive.

So, we don't need any turneries or even nested turneries.

So, only this one or this one

or one of the next ones will be true.

And yeah.

So, we can just use the end here.

All right.

But here, let's use the error

and let's already try this out.

So, let's see if we briefly see the loading.

And we saw, but it was very short.

So, just to make sure, let's do some throttling here.

So, make our app a little bit slower.

This can be a bit smaller.

Yeah, there we go.

So, there we are loading our questions.

And now, let's also pretend

that we have no network connection

so that we are offline.

And so then, when we reload,

well then of course, the entire page doesn't work.

So, that experiment actually doesn't really work.

But so, to check the error state here,

let's again quit our fake API

and so, then we should see some error.

And indeed.

Now here, this dispatch was called with this event type here

which then set our status to error.

And so, therefore, then we got this error component.

But of course, let's restart our server.

And so, then,

it should be back to working.

Yes.

Okay.

And we have another state or status that we can handle

which is the ready status.

So, ready basically means that the questions have arrived

and that we are ready to start the quiz.

So, status ready,

and here we will want to create yet another component.

So, let's just check that out.

So, here in the demo,

and this actually is what we want to show

in the very beginning.

So, when the app is ready.

So, when we load the app,

you briefly saw the loading indicator there flash,

and then this here is the start screen.

So, just with this text, number of questions,

and then a button to start.

So, very simple stuff.

So, let's create a new file here for that component

and I'm gonna call it

the startscreen.js.

And then again, using that snippet rfc,

which by the way, stands for React Functional Component.

And so here, let's place some texts.

So, starting with welcome to the React quiz like this

and then a paragraph with the number of questions.

Let's just place an X for now

To test your React mastery.

And then this diff should actually have

the class name of start.

And here, let's use an h3 instead.

And then finally, also that button which says let's start.

Okay.

So, that's enough for now.

And then let's indeed include that right here.

So, start and then here VS code.

This time actually suggests the import for us.

So you can see that here by the path name to the file.

And so, if we click that,

then that import is nicely automatically added.

So, if we save this now, then here we go.

So, we basically reacted or we handled

to that ready status there.

Now, what we want here is actually the number of questions.

And so, that's basically the length

of the questions array right here.

So, the questions array has the length of 15

and so, 15 is what we want to see there.

So, where do we calculate that value?

Should we maybe place it here also into our state object?

Well, that's actually not necessary.

So, just like we have always been doing,

we can just calculate derived state

right here in the app component

because in fact, this is just derived state

because we can simply calculate it

from the question array itself.

So, let's just do num questions is just equal to questions.

So, it should be questions here.

Let's see.

Yeah, it's questions everywhere.

So, just questions.length.

And of course, we could also pass the entire array

into this component, but there's really no need to.

And also, we will need this in other places.

So, let's pass the number of questions

equal two number of questions,

so then we can receive that here.

So, destructuring and then num questions.

And finally, num questions here as well.

And beautiful.

Now we get 15 questions

like this.

And now, all we need to do

is to add some more class names here,

which is the btn and btn ui class.

And as always, feel free to check those out in the CSS file.

Okay.

And so, with this,

we actually fulfilled our goal for this lecture.

And so, in the next one, we will then finally start

our game or our quiz by clicking here.

# Starting a New Quiz

Now, it's time to implement the functionality

of starting a new quiz.

So, how are we going to do that?

Well, after we click here on this button,

we basically want to display the first question

here inside this main component.

So, basically, right here,

and since we have been using this status state here

to basically decide what will be rendered in the main,

all we have to do now is to change that status

to something else and then display that question here.

And let's actually start with that.

So, let's say if the status was active,

then here, we want to display the question component.

So, that component doesn't exist yet,

and so, let's create it.

So, yet another component file here, let's close that

and then our nice snippet again.

So, here, I will just write question for now

and then of course, we need to import that.

Okay. Well, that's not correct, but yeah, now, it is.

So, here, remember, that active is one

of the five different status that the application can have.

And so, now, we are here basically handling

that active state.

So, right here.

So, again, we are using this different status to decide

what will be displayed here in this main part of the app.

And it's a bit like a flow as well.

So, first, the status is loading, then we display this.

In case there was an error, then we display this.

But if everything went well,

well, then we display the next one.

And then once the user collects here,

then we display the next one.

So, this question right here.

But now, the question is

how do we actually set this status to active?

Or in other words, how do we now start the game?

Well, all we have to do is to create basically

a new action type here in our reducer,

which will set the status to start or to active actually.

So, let's create a new action type here

and let's call this one start.

And so, here, we want to return a new state as always,

which is comprised of the current state

anti-status set to active.

All right. And so, now, it's very easy.

We just have to dispatch an action from this button here

with the action type of start that we just created.

So, we're going to do that here.

So, here we will want to dispatch that action.

And so therefore, we now need access

to that dispatch function.

So, it needs to be a prop.

And so, let's pass that here into the start screen.

And so, as you see,

we are basically passing the dispatch function around,

just like before we were passing around

event handler functions or the set state functions, right?

So, if we were still using new state,

then we would now probably create

some new event handler here

and then we would pass that event handler

into the start screen.

But now, we don't need to do any of that anymore

because we are handling all the state transitions

in the reducer.

And then all we do is to pass

the dispatcher functions around because then it's very easy.

All we have to do here is to then call

that dispatch function with the action

that we want to dispatch.

So, creating a new function here as always

and then dispatch and the type of the event

will be as we just defined earlier start.

And this should actually be enough.

So, if we click here now, then the question component

should be displayed instead of this.

So, let's see, and bam, there it is.

So, here, we finished this component and so,

actually, we finished what we wanted to do in this lecture.

So, we're going to leave the actual displaying

of the question for the next one.

# Displaying Questions

So let's now render

and display the current question.

So of course, we will not render all the questions

at the same time here, but instead, one by one.

And so therefore, we need a way of knowing

which the current question is.

So basically, we need some way of keeping track

which question is the current one.

And so let's add a new piece of state

to our initial state here.

And we could call this the current, or the current index,

but I would like to just call it index.

And this index starts at zero

because we will use this index here

to take a certain question object

out of the questions array.

And so the first element of this questions array

is element number zero,

therefore, our index starts at zero.

And so then in the future, at some point,

if we want to display the next question,

we can already imagine that we will do that

by changing this index.

So then in the future, when we change that index

from zero to one,

that should display the next question.

So it should then re-render the screen,

and therefore, this needs to be a state variable.

So that's the reasoning

behind why we need this variable right here,

or this piece of state,

and also why it needs to be state in the first place.

And again, it's because it needs to re-render the screen

once it is updated.

But anyway, let's now take this index

to pass in the right question object

into our question component.

So this component will, of course,

need access to that current question.

And as we just said, that will be questions,

so the array at the current position, which is index.

Now here, that is not available

because we haven't yet destructured this index

out of the state.

But there we go.

And now let's go to this component.

And just like before, if I hit the command key

and then click here,

it will automatically go to that component,

even if it is in another file.

So here, let's now receive that question.

And then let's display it.

Well, first, let's even take a look

at the shape of this object,

so that we actually know what we are dealing with.

So let's come to the console,

and as we click here, that should appear.

So inside the question,

we have the question property,

so that's what we want to use first.

So here we have basically question.question.

And so with this,

we get the question already here in the UI.

Great.

But then we also have this array of the options.

And so next, we will want to loop over this array,

and, of course, display these options as well.

Now, this time, I will not use an ordered list for that

because we will not have list elements,

but actual buttons.

So here, let's call this the options.

And so then here we loop over

question.options,

and then .map.

So here, each of them is a question,

or actually, it is an option.

And so then for each of them,

what I want to do is to return a button

with the class name of btn

and btn-option.

Okay and then, as for the text,

it should simply be the option itself

because as we see, this is just a simple string.

So each of the options is just the string

and so that's already looking great.

Let's just see what we have here.

Ah, of course, we are missing the key property

so very important for optimization

as we have already learned at this point.

So the options are unique

and therefore, we can use each of them as a key.

So as we reload, then let's start.

And there is our first question together with the options.

Nice.

Now here, actually,

I would like to split this component in two.

So whenever there is a list like this,

I personally prefer to have a smaller component

in a situation like this.

So based on the logical separation

of the content of this component,

I would say that we can now split this component.

So let's grab this entire part

and let's create a new component.

And actually, we are creating so many components,

that it is a common practice

to create a new folder called components.

And so this is where we then create our components.

So let's do this one right here

and then I will later put all the other ones there as well.

So options.js,

and then our snippet again.

And here we already have the JSX,

so let's place that there.

Now here, this is missing the question,

but let's, first of all, place all the other components

into this components folder.

So that's app, the date counter,

error, header,

loader, main question,

and start screen.

So we already have a lot of components here

and so let's place them all in there.

Now of course, we will have a problem

in the index.js file

because it is still trying to read the app component

from the same folder as before.

But so now it's in the components folder,

so we need to change that here,

but then all the other will still work

because we are importing them here inside app.js.

And so here we are importing them from the same folder

and so that's why this still works.

All right, but anyway,

coming back here to our options,

here we now need to receive the question.

And so then of course, we need to pass it in there

so we need to even import that here.

So options

and then with the current question

and then just importing that here.

So import options from,

and again, it's the same folder.

And let's test.

And there we go.

Now, of course, when we click here now, nothing happens.

And so that's what we will take care of in the next video.

# Handling New Answers

Now, in this lecture,

we are going to implement the logic

for handling a newAnswer.

And to understand what that means,

let's check out our demo project here

and then let's give a newAnswer.

So a newAnswer is basically when we click

on one of these options here.

So let's do that.

And you see that basically three things happened.

So first, the correct and the wrong answers are displayed.

Second, the points that we got were updated.

And third, the next button was displayed down here.

So basically, when we click on one of these options,

we need to re-render the screen.

And so once again, that means

that we need a new piece of state.

And so that state should basically store

which of the options was selected.

So in other words, which was the answer?

So answer zero, one, two or three.

So basically, the answer is just going

to be the index number of this option here.

So let's come back to our App.js

and add yet another piece of state to our initial state.

So let's just call that answer.

And in the beginning, it will be null.

So there will be no answer initially.

And so that makes sense, right?

And now next, let's then create an action

in our reducer to update that answer.

So let's do that, well, after this one here.

So let's keep them in order.

And here, let's call this one newAnswer.

So then later, we will dispatch a new action

with a newAnswer type, right?

And so here, let's return as always the state

and then the answer will get set to the action.payload.

So very simple stuff.

And so now we need to go here

into our question or actually into these options

because here is where the click on the button will happen.

So here is where we will now need to dispatch a new action.

So that means that we need to pass the dispatch function

into questions or into question actually.

So dispatch and then the dispatch function.

And we will also need the answer that we gave.

So this one we need so that we can then display

if the answer that was given was correct or not.

So painting it basically with one of these colors.

And again, we need to de-structure this first here.

So we need our answer.

Yeah, so dispatch and answer,

so let's grab them here and then passing them in here.

So a bit of prop drilling, you can maybe identify here

but that's not a big deal if it's like just this one level.

So then accepting these two props here and there we go.

Now we can from here, dispatch the action.

So onClick.

So dispatch and the type

of this event, well, let's see, I don't remember.

So that's newAnswer.

And the payload should then be the answer that was given.

So newAnswer and the payload again is the answer.

Now, what is the answer?

Well, remember how we said earlier

that the answer is basically the index of the option.

So in this case that would be here, index number one, right?

And the reason for that is that the correct option

is also marked using these same indexes.

So I just want to show you that because I think

that besides learning the React part, it's also important

that you learn how to build applications basically.

Now here, our app changed to a different state,

so the finished state, but nevermind.

So what I was saying is that the correct option here

is also using these indexes.

And so indeed here the correct option is React.

And so that's index number one.

All right, so then how do we get the current index here?

Well, we can just get it here

as the second argument of the map method.

So that's just how this method works

where the first option is the current element of the array

and the second argument is the current index.

And so this is all we need.

So let's check that.

Let's click maybe here this time.

And so then when we come to our state,

we should have the answer of two.

And well, where is that?

It's not really anywhere.

So let's reload.

Maybe I forgot to reload the application.

Let's try that again.

Ah, and apparently I did.

So now we got the answer right here.

Nice.

And so next up,

let's then do some formatting based on this answer.

And so that's why these options here received

that answer prop.

So that stayed right here.

So what we're going to do

is to basically change the class names here conditionally.

So let's create a template literal, and then first of all,

let's create a class for the selected option.

So here, let's say

if the current index is equal to the answer,

then add the answer class and otherwise don't add anything.

So when we're doing conditional CSS,

we should always use the turnary operator

so that in the opposite case, so in this third branch here,

then we return no string at all.

And so you saw that here,

the question that we selected

actually got this special class

where it moved a bit to the right

and if we selected this one,

well, then that one would get that special class.

So that's the first thing.

And now we also then basically need to paint them

in the right color depending

if the option is the correct option or not.

So let's again enter here the JavaScript mode.

And then let's say

if the current index is equal to question.correctOption,

then at the class correct and otherwise, wrong.

And beautiful.

So that's working.

And again, let's just check our state here

so we see what's going on.

So again, each of these options

or of these questions actually has the correct option

as a property here.

So that's number one here.

And so number one in this case here,

so in this option is equal to the index

and so therefore, it was then marked as correct

and all the other ones as wrong.

Okay?

And now we can actually click multiple times here

but of course, that should not be allowed.

So once the user clicks on one of these options,

then it should be locked in.

And so we then can no longer click.

And so let's just disable the button with the disabled prop.

And then here, basically we want to know

if there was an answer.

So any answer at all would then disable this button.

So since we know that the initial state

of the answer is null,

we can just check if the answer is not null.

So if it's not null means that there was an answer

and then we want to disable the buttons.

So let's try that again.

Ah, but we have some problem here.

So all our options are already painted, so that's very bad

because it gives away the correct option here.

And so actually what we did here was not really correct.

So basically classifying each of them as correct and wrong.

We only want that to happen if there was an answer at all.

So basically in this situation, so we need to reuse that.

So let's just place that in a special variable.

Let's say hasAnswered.

Okay, and then let's use that here.

And here as well.

Now here, this will become a bit confusing,

so use a turnary and then another one.

So we have nested turnaries, which is pretty ugly,

so we could actually do this outside as well

but let's just keep it like this.

So it is readable if you understand the logic behind this.

And so it looks as though now it is correct.

So let's select something here.

And yeah, now we cannot click on the other ones.

And also everything is marked in the correct way.

So we selected this one.

So this one got the special class, but it is wrong.

So it's then yellow and only this one is blue

because it is correct.

So it has the correct class then.

Great, so we took care of one of the three things

that should happen.

So again, the correct answers should be displayed.

Then the user's score should be updated

and the next button down here should be displayed.

So let's now quickly take care of the second part.

So basically that the user's score should be updated.

So that is something that needs to again update

on the screen, which means

that we need yet another state variable.

So let's call this points and user starts at zero.

Okay, and now where do we update these points?

Well, it makes sense that it is exactly

in the same place where we received the newAnswer.

So right here, we will also update the points.

So how are we going to do that?

Because, of course, the points should only be awarded

if the answer was correct.

So we need to first figure out

which is the current question.

Then if the answer is correct and only then,

we want to add the points to the current points.

So that sounds confusing.

So let's just do it.

So first of all, let's figure out

which is the current question

because we actually don't have that stored in the state.

So we only know the index, but not the question itself.

So let's grab state.questions at state.index.

And so here really we are leveraging the current state

that we get into the reducer to compute the next state.

So really relying on that current state.

So with this, we know which is the current question.

And so now we can then check

if the current question is equal to the received answer.

So that received answer is again action.payload.

And now let's check

if it is equal to question.correctOption again.

So this property that we have used

before already here, right?

So if that is the case,

then we want to add some points to the current points.

And so that is state.points plus something.

Let's just do one for now

and otherwise, the points will just stay the same.

So then we will just return again state.points.

Okay, now here we are adding one for now

but that is not what we want to add in the end

because notice again how each of our questions object.

Actually no, let's give a lot more space.

So each of them has this points property,

which is because each of them actually

has a different points value.

So the easier ones only give 10 points,

but then if they are more difficult,

well, it's maybe this one.

Well, not really.

So there are some hard ones.

Yeah, like this one.

So this one adds 30 points

and so we need to get actually that value.

So that is at the current question.points.

All right, so I understand

that this here might seem a bit confusing

but this is really just understanding what kind

of data we have and then working with that data.

And also you notice that here we now have

for the first time quite a more complex state updating logic

in our reducer.

And this is perfectly fine and actually encouraged.

So whenever it's possible,

we should try to put as much of the logic

for calculating the next state right into the reducer.

So it's better for this logic here to be in the reducer

than in the place where the event is actually first handled.

So basically, we could probably

also do this calculation right here

in the option where we handle the event

but that would go against the logic of the useReducer hook.

So it's much better to do it like this.

All right, so this should be working.

Let's check it.

So we know that this question is worth 10 points.

And so if we select the correct one, then you notice

that our points have indeed been updated to 10,

so that's zero plus 10.

And if we select the wrong one,

then our points stay at zero.

Great.

So, of course, we will later then display these points

in the UI.

But let's leave that for a bit later

because next up, we need to take care

of displaying the next button and handling the logic

of actually moving to that next question.

So basically, when we finish here,

then we want to click and go to the next one.

And so that is what we will do in the next video.

# Moving to the Next Question

So, now we have the simple task

of moving to the next question

as soon as an answer has been given.

So, as soon as the user clicks on one of these options,

we want a button down here to appear that we can click.

And so then we will move automatically to the next question.

Now, as we have discussed before,

moving to the next question,

basically means increasing this index here, right?

Because it is based on this index

that the current question is being read and then displayed.

So, that's what we do right here.

So we're passing in the questions object

that corresponds to the current index.

And so, let's now, here,

create yet another possible action in our reducer.

Now let's call this one just nextQuestion.

So, here, we will just return the current state,

and all we want to change is the index property

which will be set to state.index + 1,

and that should be it.

At least for now.

And so now, we need to create actually that button.

So, besides the question,

we want to then display the button.

And so that's actually always display a button component,

but that button component will then only render

the button element itself if there has been an answer.

So we could also do it the other way around,

and do the conditional rendering right here.

But instead, we're going to do that conditional rendering

inside the button.

So we will allow this next button to basically decide

if it wants to render itself or not.

And so, since we want to dispatch an action from there,

we need to pass that in.

And so, now of course, we need to create this component.

But before we do that,

here we have a problem because we need a fragment now.

Okay.

And now, as I was saying,

we need to create this new component right here.

Okay.

And then let's already receive the dispatch function,

but we also need the answer.

And so that's because of what I was saying earlier.

So that we want this component here to allow

if it wants to render the button or not,

in case there has been an answer.

So let's pass in also the current answer.

And of course, we then need to import

also this component here.

So just duplicate that.

And yeah, I think that should be it.

So let's go back here and accept that answer prop.

So doing an early return,

we can say if the answer is null,

which remember, means that there has been no answer,

then just return nothing here.

So just return null.

And otherwise, then we actually create a button.

So here, we say next,

and the class name should be btn and btn-ui.

And then finally, the onClick handler

will be a new function.

And then of course we dispatch a new action.

And so remember, this one is the one we just created

which is next question.

And for this state transition that this will trigger,

our reducer doesn't need any data,

and therefore there is no payload here necessary.

Okay.

And let's see if this works.

So let's start and let's click.

And indeed, there is our button.

And so let's now test.

And yeah, it moved forward to the next question,

but we still have a problem,

which is that our answer has not been reset.

And so, therefore, we are still showing

the previously given reply.

So that's easy to fix.

But what matters, is that we can now actually move

through these different questions.

So let's then just quickly fix that problem.

And so, all we need to do is to again,

come to our central place

where all these state updating takes place.

So, what should we do here?

Well, we just need to set the answer back to null,

and that will fix it.

And once again, we can really see here in action,

how all these different state variables

closely belong together.

And so the useReducer Hook, really was the perfect solution

for managing our state in this application.

But anyway, let's now again, test this,

and yeah, that fixes it.

So let's try another one here.

And this one is components,

just to see if our points are correctly updating.

Yeah, and they are.

So now we have 30 points,

which is 10 points for each question

that we just successfully answered.

And speaking of these points,

we now actually want to display them up here,

so the current points out of all the possible points,

together with the progress that we have been doing.

So basically displaying this part right here.

So, don't wait and let's move together

right to the next video to do that.

# Displaying Progress

So let's continue building our application

and display the progress

that the user has been making in the quiz.

So basically what we want to show is this right here.

So the current question out of the number of questions

and the current points out of the number of points.

And then also this nice progress bar.

So basically what we want to do is to,

besides the question and the next button,

also display a progress component.

And let's actually first go build that component.

So a new file,

just calling it "Progress",

and then scaffold our new component like this.

And then let's get to work.

Now here, let's actually use a more semantic header element,

so a header inside the main part.

So that's perfectly semantic,

and so I think it's a good element to use here.

And let's give it the class name of "progress", okay?

And let's start with one paragraph

for each of these sites right there.

So here we need the current question.

So remember that is the index.

And then let's place it inside these strong tech.

So just write it again, that's easier

then to copy and paste that.

And then here we also need the number of questions.

So these things we will need to receive as props.

And this of course is called index, not just I.

So index, numQuestions, I believe it is called.

And so let's already try this out.

So Progress, and I'm selecting this one here

from the list again because

here this shows me that this will then automatically

import the component into this page,

so into this file.

So we need again, the index and we need

the number of questions.

Okay, so let's see.

And yeah, we already have something.

Let's just start from scratch.

And so now we see that we have question zero here.

And so that's, of course, because the index is zero based,

but our users don't know that.

So it looks a lot nicer if we just start at one, right?

The next up we want the current points.

And again let's make them bold.

So that's points that then out of all the possible points.

So that will basically be the sum

of all the points of all the questions.

However, we don't have that value yet.

And so, well, let's go compute it.

Let's just write an X here,

take the points so that we can correctly

display our component.

So points...

Apparently we haven't destructured that yet,

but it should be in our state

because I remember how we updated it earlier.

And, yeah, now it is zero.

Okay, and now let's get the maximum amount of points

that the user can make.

And so that again is derived state,

because we can just compute that from the questions array.

So let's say

maxPossiblePoints = questions.reduce,

because we want to reduce this into just one single value.

And so here the callback always gets the previous value

and the current value in the array.

So that's the first argument.

And then the second argument is the initial value.

And so now all we need to do is to add the previous value.

So the one that starts at zero

with the cur.points.

So just a normal regular reducer right here.

So that should be nothing strange for you at this point.

And so let's then pass that in

and copy that

and then replace our X right here.

So let's see,

and beautiful.

The only thing that we are missing is...

Well here we now need to restart

because this one times out after a few minutes.

So we also want this progress bar here

that keeps going as soon as we complete more questions.

So you see that it keeps going.

And this element is actually a progress bar.

So this one is a new one,

or at least one that I haven't really used before.

And so here we can define the max value that this can take.

And here it makes sense

that this is the number of questions.

So it will go basically from zero to 15 in this case.

And then we can also define the current value.

So this is basically like an input element.

And so here we are making it a controlled element in a way.

Even though we cannot really set the state

on the progress bar.

But anyway, here the current value

will be the current index.

And here it's actually the index, not index plus one

because we actually want this to start empty.

So when we come here,

we want it to be empty at the beginning.

And so let's see.

Let's click here.

And now you see that it didn't really move.

It will only move once we click here.

So then it moved here to one.

So if we inspect this element, we will see

that the max is 15, of course, and the value is one.

So we can change that here just to see, for example,

this is what it would look like with 10,

and then with 15 it would be completely full.

But anyway, the behavior here is slightly different

because here when we click,

then it immediately moves to the next one.

So right after we click.

So somehow, basically this detects if there is an answer.

And if so, it then immediately moves this value forward.

So let's implement that here.

So we can just pass in the answer,

And then I will show you a very nice trick that we can use.

So we can convert to a number the bullion that will result

from checking again if there is an answer or not.

So doing this.

So basically what this does is that

if there is no answer, then this is false.

And so then number will convert that fault to a zero.

But if there is an answer, then this will of course be true,

and then that true will be converted to one.

And so then we add one to the index.

So let's see.

And well, that's already at one here.

Ah, but that's because I didn't pass in the answer.

So right now the answer is then undefined,

and undefined is different from null.

And so that then gives already one.

So of course we also need to pass the answer as a prop,

but this will then fix it.

So as you see, it's just completely normal

that these unexpected small mistakes happen.

But in any case, now that's fixed.

And so this is what we were looking for.

So it keeps going forward all the way until the end

which I will not do now

as that takes just a bit too much time.

But anyway, with this

we successfully finished the task that we had

for this lecture.

So let's close this one, we don't need anymore.

Nor this one or this one.

And so with this, let's now move forward.

# Finishing a Quiz

Our next task is to implement the functionality

of actually finishing the quiz.

So after the user has given an answer to the last question,

we no longer want to display all of this here

inside the main component,

but instead we will want our application

to move into a finished status,

so that then we can display like a finish screen here.

So in the beginning we have a start screen,

so when the application is ready.

Then while it is active,

we show the progress, question, and next button.

And then when the user is actually finished,

we will have the status set to finished.

And so let's handle that state here,

that status state,

even though we don't have any button yet, or so,

that will trigger the status to become finished.

But let's implement this anyway.

So we want, or actually let's create the component first.

So "FinishScreen.js."

And then here, let's return a paragraph that says,

"You scored" and then the score.

And let's actually wrap this into a strong tag.

And then out of all the maximum amount of points,

so that's "maxPossiblePoints."

And then let's also calculate a percentage.

So let's do that outside here.

So as a derived state, basically.

So let's say that's the "points"

divided by the "maxPossiblePoints" times 100.

So let's take that and use it here.

So let's round that down, then percentage, now okay.

But of course our code is complaining

that none of this exists, because, of course,

we will have to receive this as props.

Okay, so now our component is happy,

but of course it's not yet being displayed

because we need to include it here.

So finish screen,

just make sure that it got automatically imported.

I'm not sure it did.

Yeah, actually it didn't.

So let's try that again.

Yeah, just like this.

So we pass in the "points"

and the "maxPossiblePoints," as well.

Now, okay, but as I mentioned earlier, nowhere in our code

we can make the status change to finished.

But just to test this, let's do that here.

And so that's one of the great advantages

of having these dev tools.

So right here we can change any value

that we want, for example, to finished.

And so then we see that we got the component

that we just created.

Here, we're just missing the "className" of "result."

So that looks a lot better with the percentage sign as well.

And then later we will also include like an emoji here.

But let's leave that for a little bit later

because for now, we actually want to trigger

the status to become finished.

So when should that happen?

So let's just restart here.

And now let's go to one of the last questions.

And again, I will simply change the index now here,

let's say to 13.

And so with this, we are almost on the last question.

So let's just reply anything here.

Next again.

And so now we are on the last question, right?

So with the index of 14.

So, when we select anything here now,

what's going to happen once we click here,

the index will just go to 16, or to 15 actually,

and then we will have no question to display.

And so it is in this situation

where we actually want this button here

to not go to the next index,

but instead to change the status here to finished, okay?

And so that's what we will implement next.

So, as I click here now again, then we get an error,

because there is no question with that index.

All right. And so let's go here to our "NextButton"

and say that actually we only want to return

this kind of button that dispatches the next question event

if a certain condition is met.

And so that condition is that the index

is less than the number of questions.

So for that we will then, of course,

have to pass that in here.

And here it's actually minus one,

because the index is zero-based, but the number is not.

Okay, so let's pass in the index and the "numQuestions."

So there we receive them,

and here is where we pass them in.

So "numQuestions" equals "numQuestions" and then the index.

So you see there is a lot of props

being passed around in this application,

but we will actually learn a nice solution to this problem.

So it's not really a problem, but we can make it a bit nicer

with some tools that we will learn about later.

But anyway, let's just simulate this again.

And so if we now go to the index of 14,

then as we finish we should no longer see that button there.

And that's right.

So this time we cannot move forward.

And so with that, we prevented that bug that we saw earlier.

But now, we then of course need another button.

So, let's say then

if the index is equal to the number of questions minus one,

so that's our 14 in this case.

So in this case, we say "finish."

And then here we will want to dispatch something else.

So let's say an event called "finish."

So let's then add, or basically handle,

that right here in our reducer.

So "finish."

And this one is going to be quite simple,

again, at least for now, because here all we do for now

is to set the status to "finished."

So, let's reload here again.

So I really don't feel like going through

the whole quiz manually.

And so let's just type 14, click on anything,

and yeah, here we got our "finish" button.

And so now as we click here, yeah, beautiful.

So our status changed to "finished,"

and we got, of course, the finished screen right here.

Okay, let's just make the screen a little bit nicer

with some emoji here,

which will express, basically, how well the user did.

So let's create a let variable here.

So I think I'm doing that for the first time in this course,

but that's just because we will now have

a lot of conditions here,

and so this is the easiest way of doing that.

So basically, according to different values

of the percentage,

we will now assign a different value to the emoji.

So giving it a different emoji.

So here, let's go for a medal like this.

Then we can say "else if,"

or actually, since these will be mutually exclusive,

we don't even have to do that.

So just a normal "if" is good enough.

So greater/equal 80 - and here, if you don't want to spend

the time doing this you can just fast forward a little bit -

but less than 100, then our emoji,

let's see,

let's use the party emoji this time.

And let's just do a couple few more.

So if it's more than 50 and less than 80,

and then if it's greater than zero, but less than 50.

And finally, let's do one if the user fails

all of the questions.

So let's use a face palm for this one.

Then here, let's just use like a thinking emoji.

Well not there.

And then here, let's just use,

well not use a happy face, for example,

just this one here.

And so then let's just include that right here.

So that looks a little bit better,

gives the user like an immediate feedback.

Great. So this works really great right now.

There's just one more feature

that I actually want to implement,

which is a high score.

So if the user does the quiz and then they score 100 points,

but then the next time they do it again,

then they score 200,

then we want to store that 200 as the high score.

And so if they then do it for a third time,

but then they score, let's say 150,

then the 200 stays as the high score.

And so we want to also display that here as a paragraph.

So use the "className" of "highscore,"

and then let's just write here between parenthesis

that the high score is, for now, "X points."

And then here, let's actually return a fragment,

because we don't want to pollute our markup here

with some unnecessary diffs. Okay.

So when, and where, and how, is the best way

of calculating this high score?

Well, I think that the best place to do so

is exactly when the user finishes the game.

And so that is right here in this finish event, right?

So when this happens, the game finishes.

And so here we can perfectly fine calculate the high score.

So this is another piece of state, because, of course,

we need it to be remembered across re-renders.

So here we also start at zero, and yeah,

then let's update the high score as the game finishes.

So we can just do "state.points,"

which are the current points at the end of the game,

and then we can compare that to the current high score.

And so if it is greater than the current high score,

then here we want to assign that new value

to the high score.

So then that's going to become "state.points."

But otherwise, tier actually is the question mark.

But otherwise, then the high score

will simply stay at "state.highscore."

So let's manually reload

so that our state gets that new high score.

And I will now manually set it to, let's say, 20.

And then let's start our game.

Let's just do a few of them here

just so we get more points.

So now we already have 30 points,

and so let's then move on to the last one.

So we skipped all of them,

so hopefully our users don't do this,

but yeah, let's now just click anyone.

Oh, that wasn't even on purpose.

But anyway, we have 30 points.

The high score is 20, and so let's see what happens.

And you saw that the high score

got indeed updated to 50 because, of course,

those 50 were more than the current high score.

Okay, so let's get that out here.

So destructuring out of the state

so that we can then pass it into the finish screen.

So "highscore" will be equal to "highscore"

and then let's write that here as well.

So, "highscore," and then accepting it here, "highscore."

But now I'm not going to test that again

because we can be pretty sure that it works.

Now here we now have one final thing,

which is this button to restart the quiz.

So right now we are still missing that.

So again, I'm not going to show that,

but so basically in the end,

we will want to have one button to start the quiz over.

And so that is what we will implement in the next video,

where we are then almost done with the application.

# Restarting a Quiz

So after a quick break,

let's now finally build the simple feature

that allows a user to restart a quiz.

And with our reducer that we already have in place,

this is almost too easy now.

So we have updated related pieces of state so many times

in this section so far that I think

that you could actually implement this on your own.

So this entire feature

you might be able to just build it on your own now.

I think that might be a really nice challenge.

Just add a button here with the same classes

as I think this one here

or at least the same classes as this one.

So basically it's just the same thing here

and then you just create a new action

and then basically reset this date there.

So that should not be too hard.

And so please do that now

and meet me back here once you are finished.

So I hope that was fun.

So I will just now copy and paste this button here.

So place it right underneath this one right here.

And then of course we need access

to the dispatch function.

Here the text will be restart quiz.

And then here, let's dispatch an action

with a type of restart.

So very creative.

All right, and going back to our reducer, case restart.

And so here we could now do this in two different ways.

So we could define all the variables that we want to reset

to their initial state.

So just like this, for example,

setting the score back to zero

and basically doing all of this here

because actually we want to restore all of them

except for the questions array.

So this one we don't want to re-fetch of course.

And well, probably we also want

to reset this one here to ready

but these other ones, they should become

exactly the values that we have right here.

So let's try to do this.

So we expand the entire initial state back here

and then we just add the questions back in.

So we say questions is equal state.questions

so that we don't lose them.

And then finally the status should become ready.

But again, you could just as well have done this.

So return the entire state,

then override like the points back to zero,

the high score back to zero,

the index back to zero as well.

And there was just one more, which was it?

The answer back to null, answer back to null.

And of course the status to ready.

So both of these work, I just prefer this one here

because it's a bit more explicit

that we basically want to reset

to something similar to the initial state.

So this was really easy, wasn't it?

And so I actually really, really like this pattern.

So it makes the state logic that we have here, all of it,

so decoupled from all the different components.

And this is especially helpful when we later come back

to the code and want to understand what is happening.

So then all we will have to do is

to basically read through these cases,

and by that we can then understand what happens

in our application and how the state transitions.

So even without understanding much of the application

just by reading the reducer, we will know

that some data might be received, that it might fail,

that something will start, that there can be a new answer,

that there can be a next question and so on.

So again, just from reading the reducer

and so because of this,

our state updates are really a lot more declarative.

So we just map these different actions here

to the state transitions that we then write out right here.

So really, really amazing pattern, but I will talk more

about that again by the end of the course

when we summarize everything that we learned here.

So now let's actually just test this.

So let's start and then I will cheat again and going back

or actually going forward automatically to index number 14.

Then let's click here.

Oh, actually this is the demo version.

So that is then really cheating, right?

Because that's already working.

So yeah, again, 14.

And so we have just 20 points.

So I guess we won't beat the high score or actually we will

because of course it's also reset to zero.

And so here we didn't have the same as before

but now we can restart the quiz.

So let's see.

And dispatch is not a function.

Nice, so we didn't pass it in, I guess.

So of course we need that here.

So let's do it all again.

And if you want, you can of course go

through the entire quiz, which I really hope you do.

That's why I added 15 questions to it

so that you can practice a little bit.

But anyway, let's now click here and nice.

So the questions remain the same

but everything else is reset.

Great, so that was actually it.

So we finished that part as well.

All we have to do now is to get this timer here to run.

So when this timer runs out, then basically the quiz stops.

So you see here that it keeps updating.

So let's set it like to five seconds.

So we see what happens here at the end.

So let's wait for it.

And so then you see

that it automatically moves to the finished screen.

And so let's now implement this functionality

in our own application.

# Setting Up a Timer With useEffect

Welcome to the last lecture of this project.

And in this one we're going to use our old friend

use effect to implement a timer feature.

And this new feature will play really nicely

with the reducer that we already have.

So when the game is going to start

the timer will also start, and once the timer reaches zero

we will have the game stop

by setting the status to finished again.

So we will be able to model this behavior really beautifully

with our reducer.

So let's start by creating a timer component

which will display the current time that is remaining

and that will actually also start the timer

in the beginning.

So that component should be right here at the bottom.

So I mean at the bottom here of our UI

so basically down here besides this button.

So what we want is actually for these two components

to be inside a footer.

So we will want a timer,

so the component that we will build next.

And then we want,

again these two inside a footer HTML element.

Now this is ugly like this, so as you already know

I really don't like to see it this way.

And so let's just quickly create ourselves

a footer component.

And so all this will do is to return a footer element

which will then contain the children that we pass in.

Alright, so doing some more component composition here.

And of course we could also just call both the timer

and the next button in here,

but then we would have to pass all the props in here

just to then pass them into these other components.

And so that's not really necessary.

So footer.

And let's also create the timer immediately here.

And then let's just return the timer string for now

so that we can then include so import these two components

into our application here.

So the timer and the footer.

So that's all the components we are going to build.

And as you see, there are a lot of them,

so I like to keep them a bit separated

from the other imports.

But anyway, let's now see what we get.

And so here we have our timer basically.

So it's not really a timer yet

but so let's now change that.

So first of all, it needs the class of timer.

And then let's pretend that here we have just some time

so just so we can see something.

So this already looks a bit nicer.

Now okay, and so here, let's now again use

the useEffect hook to create a side effect on mount.

So as this component here mounts

we basically want to initialize the timer

and we are doing that right here.

So we are starting the timer here in this component

because this timer component will mount

as soon as the game starts.

So of course we couldn't start the timer

in the app component here

because then the timer will start running

as soon as the entire application mounts

but that's not what we want.

So we have to place this effect

into one of the components that mounts as the game starts.

I mean there would of course be ways around that

but I think it makes just sense also

that this effect is here in this timer component.

But anyway, how do we actually create a timer in JavaScript?

Well, first of all, this of course

needs to be a function here

but then we will now use the set interval function.

And so this function will simply run

the function that we pass in here,

every couple of milliseconds which we can also define.

So let's pass in our function,

which could also be an arrow function here by the way,

but let's just do it like this.

So for now, we want to lock to the console

the string of tick once per second.

And so that's every 1000 milliseconds.

Now this will already have started a timer now.

So if we come here to the console,

then you see that every second

while now we actually get two ticks here.

But that's again because the effects run twice

in development mode.

So this wouldn't be happening in production

but now it does.

But of course what we want to do here

is not to lock something to the console,

but instead we want now some value.

So we will want some state value

that we can then decrease every second.

So let's take out this console dot lock here for now

and reload our page so that we don't create

any additional work for the page.

And then let's come here again to our state

and add one final piece of state.

And so that is going to be the seconds remaining.

And we could do it also the other way around.

So we could start at zero and then add one every second

until we reach a certain number.

But here instead we will start at some number.

So for now, let's just say 10 seconds

and then we will remove one second every second.

And once that reaches zero

so once there are no more seconds remaining

then we will finish the game.

So let's now implement what I explained.

And so once again

we will just leverage our reducer here again.

And add one final event here

and this one I'm going to call it tick.

So because like a clock, this will happen every second.

So this is the event that we are going to dispatch

here in this function.

And why not actually do it immediately here

since we are already here?

Let's dispatch the event with the type of tick.

Then we need to give this access to the dispatch function.

Interior is not dispatch event.

And now VS Code is complaining

or actually ESLint because dispatch is now a dependency.

So let's edit then if React needs it.

And so now of course, don't forget to pass it in,

not like we did in the previous lecture.

And now we are ready to model here

our state transition again.

So we want all the state,

and then we want seconds remaining

to be equals state dot second remaining minus one.

So as I said a minute ago

we will simply subtract one second every second.

And now let's also pass that into the timer

so that it can display this value.

So seconds remaining here, taking it out of the state

and then seconds remaining here.

And then of course

we also need to accept that as a prop here.

And yeah, then place that right here.

And with this we should be good to go.

So let's see.

And yeah, that's working great.

Now of course for now we are still allowing this

to go below zero and so let's fix that next.

So basically we now want to check every second

if this has reached zero,

and if it has then we will finish our game.

So exactly like we have been saying in the very beginning.

So this feature fits now really, really nicely

into the entire state structure that we already have.

So we can just now use again the status

and then we can check if state dot seconds remaining

is equal zero.

And if it is, then here we return finished

and otherwise it just stays the same.

So that's then state dot status again.

So this right here is the entire heart of this feature.

So basically allowing us to check

if the seconds came to zero.

And so if they did reach zero

then we just set our status to finished

which will then trigger the entire game to stop

and to then of course render this finished screen

instead of what we have here in the active state.

So let's reload.

And let's see.

So that's why we used a small number

so that we can see immediately if this works

and it does, great.

And even if we restart the quiz

then it starts again at the value that we had before.

So that is because here when we restart

we just took the entire initial state here again.

Remember that, but maybe you notice something here

when we restart the quiz.

So let's try that again and see how fast this goes now.

And if we do, again, it will be even faster.

Actually, we don't even have to start a quiz

that this moves now to the finish screen.

So clearly something is going wrong,

so notice how fast this goes.

And the reason for that

is that our timer actually does never stop right now.

So we have no cleanup function.

And so therefore our timer here

will keep running even after this component has unmounted.

So that of course, we need to fix.

And so this is an amazing use case for the cleanup function.

So what we need to do is to store the idea of the timer

that gets returned from this method.

And so we can then use it in the cleanup function

that we return from here.

So to clear an interval,

we basically just have to pass in the ID

of the timer that we started with set interval.

So every single set interval timer will return a unique ID.

And so we can then again use that to clear,

so to cancel that timer.

And so now this will run between renders

and even more importantly

after this component is unmounted

and so then the timer will really actually stop.

So what we had before

was that each time we restarted our quiz,

a new timer got added.

And so then we had many timers running at the same time

which were all dispatching this action.

And so then our time was going down

really really fast because of that,

but this should fix it.

So let's try that.

And actually now we are only going down

one second at a time.

And there we go.

So that was expected, but now let's see again

if the timer has the same speed as before,

and yeah, it does.

And so it means that this cleanup function here

is indeed working.

Now notice how here we are getting all of these renders

or actually all of these console logs

and that's because of course now the entire application

so all the components will re-render every single second.

So let's just quickly review what we learned before

and that is that as one component re-renders

all its child components will re-render as well.

So our state lives here in this global app component

and so therefore as our state re-renders

so will re-render all of these child components.

And so that is of course also true

here for the question component that does this render here

which will then create this lock here every single second.

So let's just quickly clean that up right here.

And so this could become a performance issue

in a really large application

with like a thousand components.

So in that case, you probably shouldn't have

your most parent component re-rendering every single second.

But in this case, this is really not a problem.

Now, of course, our 10 seconds that we have here

are not nearly enough, right?

And so what we want to do now

is to calculate the amount of seconds

from the number of questions that we have.

So let's do that.

So our seconds remaining start at 10,

but again we want to know,

calculate it from the number of questions.

However, we don't know that number

at the very beginning, right?

And so let's just set this to null

and instead calculate this number here as we start the game.

So at this point when this action is dispatched

we will already have the questions array.

And so then here we can calculate those seconds remaining.

So let's say state dot questions dot length,

so the amount of questions

and then maybe 30 seconds per question.

Now, we shouldn't actually place

like a magic number like this here.

So instead we should always create a constant out there

for a value like this.

Otherwise it will be really weird

and unclear to suddenly see a 30 in here.

So let's create a constant

that will be called seconds per question,

and it's kind of a convention to have these upper case.

So secs per question equals 30.

Okay? So that should work now.

And yeah, now we have plenty of time I think

to complete the quiz, which again, I hope you will do

or maybe you already have done

here outside of one of these videos.

But now to finish, let's then also form at this

a little bit nicer.

So for example, separating the minutes from the seconds.

So let's create a minutes variable here.

So let's do math dot floor.

And so then we just divide the seconds by 60.

And so this here will give us the amount of minutes

and then we round that down with math dot floor

so that we can then, besides the minutes,

also display the seconds.

And so this will be seconds remaining,

and then the reminder of dividing that by 60.

So that's again, just pretty standard stuff.

And then here, let's display that.

So minutes and seconds,

give it a save.

And now this doesn't look really nice

because ideally we also want like trailing zero there

in some situations.

So not now, but if it is less than 10,

but that's pretty easy as well.

So minutes less than 10,

and if so then just place a zero there.

And so there it is.

And well then the same thing for the seconds.

So seconds.

And right now that's not the case,

but we will maybe see it in a second

or in a in 20 seconds, actually.

But yeah, we probably don't have to wait for that

because actually with this we finished our application

so it's feature complete.

Now the only thing that we might do is to fix our title.

So let's come here and call this,

"The React Quiz."

And there it is. Beautiful.

And now we really are finished with this application.

So congratulations, you just added

one more really nice React application to your portfolio.

So I hope this was a fun one.

I sure really liked to develop this one with you.

So we learned a lot about reducers and to useReducer Hook,

but also, again we learned some more

about React development in general.

And you could take this project even further if you wanted.

So I have at least three ideas

for features that could be implemented.

So first of all, in the start screen right here

we could do different kinds of stuff.

For example allowing the user

to only select a certain number of questions,

or also to allow the user to filter

for the difficulty of questions.

Now, another thing that we could do

is to upload the high score of the quiz

to our fake API as well.

And then as we reload the application later

that could then re fetch the high score

and place it back in our state

so that we don't lose that value.

And finally, another idea that I had

is that we could store all the answers

here in some array instead of just the current answer

like we do right now.

And so by doing that,

the user could then go back and forth in time

and review their answers like that.

So if you want you can have some more fun with this project,

and if you do please make sure to share some GitHub link

or something like that, or maybe just the final application

in the Q and A of this lecture.

And so now to finish this section

we will quickly review what we learned

about useReducer and compare it with the useState Hook.

So see you there soon.

# Section Summary: useState vs. useReducer

To finish this section,

let's review what we learned

about useReducer by comparing it with useState

both in terms of how they work

and when we should use each of them.

So as we already know,

useState is ideal for single pieces

of state that are independent from each other.

So things like numbers, strings

and also arrays or simple objects.

On the other hand, we reach

for useReducer when we have

multiple pieces of state

that are related and dependent on each other

or when we have some really complex state on our hand.

Now, when we have a few states

with useState the logic

to update that state

is usually placed right into event handlers

or effects.

And these might be spread all

over the component

or even located in child components

if we're using lifted state.

And that's where one of the big advantages

of useReduce comes into play

because with useReduce

we centralize all state updating logic

in one place

which is the reducer function.

And with this

all that logic is nicely decoupled

from the components.

Then whenever we need

to update the state

we just dispatch an action to the reducer,

which knows exactly

how to perform state updates

for different actions.

So essentially reducers

map state transitions to actions

with well-defined names,

which makes them a lot more declarative.

And going back to the game example

from the first lecture

instead of setting three separate states

like these in order to start a game,

we can just dispatch the action

startGame and the reducer

will then take care of the rest.

And this really is an amazing pattern.

The only downside of this approach

is that it can be

a bit more difficult to understand

and to implement.

It can take a bit more time,

but that might be worth it.

Now just finishing our comparison here,

with useState of course

we do not dispatch any actions.

All we do is direct the updating state

by calling the setState function,

which leaves us

with state updates that feel a lot more imperative

when compared to dispatching an action.

But on the bright side,

this of course is a lot easier

to understand and to use

because we don't have to

write any reducer function.

And most of the time

this is completely fine.

And so then useState

is the way to go

and that this actually

brings us to our next and final slide

where I'm now gonna give you a simple framework

for deciding between useState and useReducer

whenever you need to add state to a component.

So the first and most obvious question to ask ourselves

is whether we only need one piece of state.

If that's the case,

then the answer is very simple.

We just use one useState hook and call it a day.

Now, if we do need more

than just one piece of state

the next question to ask

is do my states frequently need to be updated together?

So just like in that game example from earlier.

And if the answer is yes

then we might have a good use case

for a useReducer.

However, there's probably one more question

that we need to ask first.

Are we willing to actually write a slightly

more complex useReducer hook

with a reducer function?

And if we are not

then we just keep using

the useState hook.

But if we are okay with

taking the time to write a reducer

then this is definitely a good use case

for useReducer.

Nice. So let's keep going.

If our state does not update frequently together

then the next step is to figure out

whether we need more than three or four pieces

of related state

and whether that state even includes some objects.

So this is what we can call

complex state.

So in this case

and if we're willing to actually write a reducer

then useReducer is again the way to go.

Finally, our state might actually

not be that complex

but we still feel like we have

way too many event handlers

that make the component

and also its child components

too large and too confusing.

In that case

you might also consider going with useReducer.

Otherwise, if the question is no again,

then useState is once again the way to go.

So in general, even after learning about useReducer

useState should probably still remain your default choice

for managing React state.

But if useState gives you one of these problems

that we have been talking about

then it's time to consider a useReducer.

And that's actually it.

So at this point, you are probably

in the top 5% of React developers

when it comes to understanding the useReducer hook.

So you are making excellent progress, really.

And now to finish it's time to practice

the useReducer hook

on your own.

# CHALLENGE #1: Creating a Bank Account With useReducer

```tsx
import { useReducer } from "react";
import "./styles.css";

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

function reducer(state, action) {
  if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    case "openAccount":
      return {
        ...state,
        balance: 500,
        isActive: true,
      };
    case "deposit":
      return { ...state, balance: state.balance + action.payload };
    case "withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload,
        balance: state.balance + action.payload,
      };
    case "payLoan":
      return { ...state, loan: 0, balance: state.balance - state.loan };
    case "closeAccount":
      if (state.loan > 0 || state.balance !== 0) return state;
      return initialState;
    default:
      throw new Error("Unkown");
  }
}

export default function App() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => dispatch({ type: "openAccount" })}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "deposit", payload: 150 })}
          disabled={!isActive}
        >
          Deposit 150
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "withdraw", payload: 50 })}
          disabled={!isActive}
        >
          Withdraw 50
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "requestLoan", payload: 5000 })}
          disabled={!isActive}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "payLoan" })}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "closeAccount" })}
          disabled={!isActive}
        >
          Close account
        </button>
      </p>
    </div>
  );
}
```

Let's continue our tradition

of finishing a section with a challenge.

And in this one I want you to build a very

simplified bank account like this one.

So this is similar to the analogy

that I gave you when we first talked

about the use Reducer hook.

The difference is that here

we don't have any account numbers

to just keep it really, really simple.

So in the beginning here,

we can only take one action

which is to open an account.

And so then immediately we get $500

or euros here into our bank account.

And from there on we can then take these different actions.

For example, we can deposit some money.

And so you see that now our balance went up by 150,

but of course if you want you can later

also use an input field and then deposit something else

which is not just 50.

So we can withdraw money of course

and we can request a loan.

So then our account also goes up

and we see that our loan here also goes up.

So that's the $5,000.

But if we click here again,

then that doesn't work again.

So there can only be one active loan at a time.

Then we can also pay the loan back at some point.

So clicking here again

and finally we can also close the account

but for that to work there can be no loan

and the balance needs to be at zero.

So if I click now, that's not going to work,

but if we withdraw all our money,

then we can close the account.

And so then basically it goes back to the initial state.

So as always, I have all of this year

in a starter file for you.

So down here I already wrote all the JSX

and this time I also wrote you some instructions

or considerations that you can follow.

So basically the rules that this bank account

here should follow.

All right, we also already have the initial state

here which you should use.

And so you'll see we have the balance and the loan

which are these two and then we have also

the is active state.

So in the beginning you see it's faults.

And so then all of these buttons here will be disabled.

So right now all the disabled here are just set to fault

but you'll probably then later use this is active.

And then here of course you will also write your own event

and/or functions.

Now, okay, so hopefully this isn't too difficult.

Just make sure to read these instructions here

and if you have any problem or any doubt,

then you can just move on a bit in the video

until you reach that part.

Okay?

So take a few minutes now to take this challenge

to practice the very important use Reducer hook on your own.

Okay, so let's get to work here.

And this time I will actually fork this

so I don't override the starter file.

And so hopefully you did something similar

to what I am going to implement here now.

So here we will have a Reducer function

and the initial state of course.

And so this will then return the state

which I will immediately destructure

into balance loan and is active.

And we will also get the dis patch function like this.

All right.

Next we need to create a Reducer,

which takes in the current state

and the action that was dispatched.

Here we have some problem.

And now let's do our typical switch here.

So over action type and let's already create all our cases

here at once so we already know which ones they are.

So we have open account deposit and all those other ones.

So open account.

For now, let's just return something here.

Then deposit, withdraw.

And here thanks to prior,

we don't have to take any care

of formatting this in any way.

So request loan.

Next up we have pay loan, so that's not load but loan.

And finally we also want the ability to close the account

and that's also as always

at a default case where we just throw a new error

Like this.

Now, okay, now let's go back here

to our JSX so we can use the variables that we got.

So here we want to display the balance and here the loan.

And so immediately we get our user interface

they're updated.

And now here what we want to do,

or first let's actually use also the is active

instead of these falses.

And actually here of course,

we want the buttons to be disabled

when the account is not active

except this one here actually.

So otherwise we couldn't open an account in the first place.

Okay?

So here what we are going to do to open the account

is to dispatch an event with the type of open account

and we need to close this guy right here.

And so let's see what should happen in this case.

Well as always,

we will want to return our entire state object

and to end the balance needs to be set

to 500 because that is the initial amount

and then is active will be set to true.

And so then all of these buttons here can get active.

And so let's see, yeah

nice that's already working and so let's keep going.

So let's implement the next two as they are pretty similar.

So the state and then the balance will simply

be the current balance plus whatever comes in in the action.

So action dot payload.

So again, the action payload is to pass in some data.

And so here we are going to pass in 150

but of course we don't want

that 150 hard coded right here in in our Reducer function.

So we need to pass that in as the action.

So then withdraw.

It's just the same but with the minus.

And then here, yeah, let's try that.

So dispatch with the type of deposit

enter payload of 150.

And as I was saying earlier,

you could of course also created an input field here

and then deposited the value that came from the input field.

So you could have or still can go really crazy

with this example here and make it a lot more complex

and more complete if you want.

So if you do that, make sure to post that

into the Q&A because I would be really curious to see that.

But anyway, as we click here now on this button

we each time deposit 150 into our bank account.

And then here, let's just copy this whole line.

No, actually that's not really going to work.

So nevermind.

So the type here is with draw

And then 50 and that works indeed.

So these were the easier ones.

Now let's take care of the harder ones.

But actually before we do that, we should do something else.

So let's actually reload this whole thing here

so that our balance is back to 500

and that our account is no longer open.

And then here, or actually here

let's set it back to faults now, right?

And so now if I click here

then we can actually already deposit something

in our account even though it is not even active.

And so we of course need to prevent

that also inside our Reducer function

we cannot rely only on the UI to block this

kind of thing because otherwise at a later point

somewhere else in our application

we might dispatch an action like this

maybe not from a button but from some effect for example.

And so we need to account for that case here in our Reducer.

So really blocking that action right here.

So we can say if the account is not active

Then just return the current state.

So in this case this wouldn't work.

So this right here then wouldn't work anymore.

So you see it doesn't work

but what also doesn't work is to open the account then.

And so we also then need to say if or actually end.

So if the account is not active

and the action type is different from open account

then simply return the state.

And so that's the case right now.

That's the case right now.

So when I click here, now the account is not active

and the type is not open account and so then nothing works.

But here of course the account is still not active

but the action type is actually open account.

And so then this one here will not get executed

and we can move on.

And so then our account can actually get opened.

All right.

So these are some very important things that you

need to keep in mind and that's also the reason

why it is so important to do these challenges

because it is impossible to cover all these things just

in the projects themselves.

So there are always some other edge cases like

this which can best be handled in more different situations.

But anyway, let's now hear dispatch some some other action.

So this one is to request the loan.

So request loan

and here it is for 5,000,

whatever, euros, dollars

some other currency, whatever.

So let's see our instruction,

what it says about the loan.

So the customer can only request if there is no loan yet.

And if that condition is met then it will be added

in the loan state and into the balance.

All right.

So that's again at a guard clause here basically saying

that if there is a loan already

so state.loan is equal then zero,

then do nothing

which means to return the current state.

So remember that this Reducer function always

needs to return some state,

we cannot just return nothing.

Let's actually see what happens if we do that.

So we will experiment what that does next

but in the other case,

so if there is no loan yet,

then the loan should be equal to the action payload.

And of course we first need the state itself

and then also the balance will be updated

to state.balance plus our payload here.

Alright, so let's try that.

So request alone and so beautiful

it was added to both of them,

but now if I click again

then here we will get null as a return.

And so that breaks our entire application

because now here basically this object

so the state that was returned from youth Reducer is null.

And so that cannot be,

it always needs to be some state.

So let's try that again.

Yeah, so now it works.

This one is of course not necessary

and so let's actually implement the next one

here right away.

So if the loan is paid, then it will go back to zero

and the balance will also go down.

So it will go down to state.balance,

balance like this.

And then here, do you think

that we need to pass in some value?

So having like action not payload

well that's not going to be necessary actually

because we already know what the loan was.

So that's at state.loan.

And so then that loan will simply be removed

from the bank account.

So let's dispatch that right here.

So this is not like a loan in the real world

which we pay over a period of time.

So it has to be paid all at once.

So very simplified, as I said in the beginning.

So pay loan.

Now, here we have some problem

and yeah, there it is.

Now here we can click multiple times

and then we actually are not preventing this function here

or this action from being called over and over again

but that will not do anything because the second

time we click the loan will already be zero.

And so then here simply zero gets subtracted

from the current balance.

So this is not going to be a problem at all.

The only thing that you might think is a problem is that

if we have here less money in the account then are alone.

So then we have a negative balance

which in theory shouldn't be allowed

but well in our bank it is allowed.

The only thing that you can do when you have

a negative balance is to close your account.

So I think that's what I say somewhere here.

Yeah, so then the users

or the customer can't close their account.

Okay, and so speaking of closing

let's implement our list action here.

And so this one says that the account can only be closed

if there is no loan and if the balance is zero.

And so let's do that right here.

So actually we don't need this.

We first need to check our conditions

and as always we will do a guard clause.

So one that returns to state

in case our conditions are not met.

So if the loan is greater

than zero and if there is a balance right now

so if the balance is different from zero

then once again just return the state.

But otherwise then we want to close the account

and so then it is no longer active.

So basically what we have then is the initial state.

So no balance, no loan,

and the account is not active.

So just to finish,

we need to now dis pat that action here.

So type close account.

So let's see.

Well that's some problem right there

because we shouldn't be allowed to close our account

with the balance that we had before in negative.

So let's see what we did here wrong.

And here it should be an

or so not an end of course at the same time.

So if there is a loan or if there is some balance

then we just want to do nothing.

So that's just returning this date.

And so this means that if there is no loan

and if the balance is zero,

then we can return the initial state

and the account is closed.

So let's try that again.

Open the account and now I cannot close it.

Let's withdraw a bunch of money.

Ah, that was too much.

So now I can also not close,

but yeah, now that works.

Amazing, so that actually finishes it.

And now as I said before

you can just go a bit crazy here if you want

with this exercise and maybe add some operations here

or include some input fields

or really to anything that you want.

You can also use an account number

like we did in that analogy.

And if you do any of that,

then just make sure to show it to me

so I can see your progress in the Q&A.

And also if you want more use Reducer challenges like this

because maybe you still find it a little bit difficult

then also let me know in the Q&A section.

And with that being said,

let's now move on right to our next section

where we are going to use

for the first time an external library

and that is React Router,

so that we can build our very first

real single page application.
