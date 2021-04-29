# Description

ExpressTS (Express TypeScript) is decorator driven TypeScript framework on top of Express.js that allows you to use Express truly TypeScript way.

# Why

Let's say you have decided you want use Express with Typescript. Great, there are type definitions for Express, just install them and you are using Express with TypeScript. But soon you realize that there is basically zero benefits of using TypeScript with Express that way (it even gets much more complicated). So you come up with idea to encapsulate some stuff in classes, it gets a bit prettier and you have some structure in your project. But again you realize you have actually done nothing. What to do next?

This framework may be a solution. It takes advantage of TypeScript decorators and takes away all the ugly stuff behind the scenes and allows you to create structured object-oriented application just the way you wanted it at begging of the story.

# Features

There are a few frameworks like this one, but most of them are trying to be frameworks on their own, having bunch of extra features (which is good thing for more complex use-cases).

ExpressTS provides decorators to abstract logic only for Express.js API.

Only extra feature is simple dependency injection container because I think is necessary to have this feature out of the box if you really want to feel advantage of using this framework.

# How to use it

## Setup

First you need to init npm project with

`npm init`

Then install ExpressTS with

`npm i @msabo1/expressts`

Now create `tsconfig.json` file at root level and add following options inside of `compilerOptions` object

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Or you can just execute `tsc --init` in your prompt from project root and it will generate `tsconfig.json` with all options commented out, so you just uncomment those two options.

Optionally you can set `outDir` option (you probably want this) to `dist` or something of your choice to redirect compiled files to that directory.

It's recommended to create `src` directory and put there all of code you will additionally create but it isn't required. In this guide we will create such directory.

From now on, all namings (names of files, classes...) are matter of choice, if not said otherwise, so you don't have to follow names blindly.

There is one more thing to do and we can start our server.

In `src` directory create application root. We will call it `main.ts`.
Inside of that file create new class and decorate it with `App` decorator imported from `@msabo1/expressts`. `App` decorator takes one object as parameter which has one mandatory property `port` which is obviously port our server will listen on.

```typescript
import { App } from '@msabo1/expressts';

@App({ port: 3000 })
export class Application {}
```

## Controllers

Controllers combine routers, HTTP methods and route handlers in elegant way.

Let's create hello world controller which will handle `/hello-world` route.

Inside of `src` create `hello-world.controller.ts` file and inside of it create new class decorated with `Controller` decorator. It takes one argument `route` which is base route for our controller and it must start with `/`.

```typescript
import { Controller } from '@msabo1/expressts';

@Controller('/hello-world')
export class HelloWorldController {} //note that class name can be whatever you like
```

Now we need to register that controller. Let's move back to `src/main.ts`. Object `App` decorator takes as argument has optional property `controllers` which is array of controllers. All of controllers have to be listed there to make them work.

```typescript
import { App } from '@msabo1/expressts';
import { HelloWorldController } from './hello-world.controller';

@App({
  port: 3000,
  controllers: [HelloWorldController],
})
export class Application {}
```

Now move back to our controller and let's bind some routes. Inside of `HelloWorldController` create new method decorated with `Get` decorator. It takes one optional parameter `path` which is route extension, it also must start with `/`. It is equivalent to express path and it can take dynamic parameters. We will leave it empty.
This will bind `GET` method to `/hello-world` route. Obviously there is corresponding decorator for every HTTP method.

```typescript
import { Controller, Get } from '@msabo1/expressts';

@Controller('/hello-world')
export class HelloWorldController {
  @Get()
  get() /* note that method name can be whatever you like */ {
    return 'Hello world'; //whatever is return from method will be response
  }
}
```

### Route, query, body params

To access route, query and body params we use method argument decorators `RequestParams`, `RequestBody` and `RequestQuery`. It will inject corresponding params to desired argument.

ExpressTS uses json body parer by default.

```typescript
import { Controller, Get, RequestParams } from '@msabo1/expressts';

@Controller('/hello-world')
export class HelloWorldController {
  @Get('/:id')
  get(@RequestParams() params: any /* note that argument name can be whatever you like */) {
    return params;
  }
}
```

If we make GET request to `/hello-world/1`, response will be

```typescript
{
  id: '1';
}
```

We can make use of object destructuring here

```typescript
@Get('/:id')
get(@RequestParams() { id }: any /* note that now it has to be named id, because that is what we called out param */) {
    return id;
  }
```

This will return just the id.

### Request and response objects

Same as request params we can take more control and inject `req` and `res` objects to our methods using `Request` and `Response` decorators.

```typescript
@Get('/:id')
get(@RequestParams() { id }: any, @Response res: any) {
    res.set(...)
    return id;
  }
```

## Middlewares

ExpressTS is compatible with every Express.js middleware.

Just like in Express.js you can bind middlewares globally, router level (controller level) and route level.

### Global middlewares

To bind middlewares globally to all routes you need to register it in app root (in this case `src/main.ts`). `App` decorator properties object has optional property `useGlobalMiddlewares` which is array of middlewares and you just need to list them there.

```typescript
import { App } from '@msabo1/expressts';
import { HelloWorldController } from './hello-world.controller';
import express from 'express';

@App({
  port: 3000,
  controllers: [HelloWorldController],
  useGlobalMiddlewares: [express.urlencoded()],
})
export class Application {}
```

### Controller and route level middlewares

To bind middlewares to all routes of some controller, you need to decorate it with `UseMiddlewares` decorator which takes list of middlewares as parameters (note that it doesn't take array of middlewares, you just pass middlewares).

If you want to bind middlewares route level, just use the same decorator but applied to route handler.

```typescript
import { Controller, Get, UseMiddlewares } from '@msabo1/expressts';
import express from express;

@UseMiddlewares(express.urlencoded(), express.text()) // order of decorators doesn't matter in this case
@Controller('/hello-world')
export class HelloWorldController {
  @Get()
  @UseMiddlewares(express.static(...)) // order of decorators doesn't matter in this case either
  get() {
    return 'Hello world';
  }
}
```
