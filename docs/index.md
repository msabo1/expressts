# Description

ExpressTS (Express TypeScript) is decorator driven TypeScript framework on top of Express.js that allows you to use Express truly TypeScript way.

# Why

Let's say you have decided you want use Express with Typescript. Great, there are type definitions for Express, just install them and you are using Express with TypeScript. But soon you realize that there is basically zero benefits of using TypeScript with Express that way (it even gets much more complicated). So you come up with idea to encapsulate some stuff in classes, it gets a bit prettier and you have some structure in your project. But again you realize you have actually done nothing. What to do next?

This framework may be a solution. It takes advantage of TypeScript decorators and takes away all the ugly stuff behind the scenes and allows you to create structured object-oriented application just the way you wanted it at begging of the story.

# Features

There are a few frameworks like this one, but most of them are trying to be frameworks on their own, having bunch of extra features (which is good thing for more complex use-cases).

ExpressTS provides decorators to abstract logic only for Express.js API.

Only extra feature is simple dependency injection container because I think is necessary to have this feature out of the box if you really want to feel advantage of using this framework.
