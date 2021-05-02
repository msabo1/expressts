# Description

ExpressTS (Express TypeScript) is decorator driven TypeScript framework on top of Express.js that allows you to use Express truly TypeScript way.

[Github](https://github.com/msabo1/expressts)
[Npm](https://www.npmjs.com/package/@msabo1/expressts)

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

### Change response status code

You can change response status code using `DefaultHttpStatus` decorator. It takes one mandatory parameter `status` of type `number` which represents HTTP status code. You can apply that decorator to controller (it will obviously change default status code for all route handlers) or you can apply it to method.

```typescript
import { Controller, Get, Post, DefaultStatusCode } from '@msabo1/expressts';

@Controller('/hello-world')
@DefaultHttpStatus(201)
export class HelloWorldController {
  @Get()
  @DefaultHttpStatus(500)
  get() {
    return 'Hello world';
  }

  @Post()
  create() {
    return 'Hello world created';
  }
}
```

In this example `POST` request will have response code `201` because that is controller's default code. `GET` request will have response code `500` because we overrode default one.

If you want to change status code dynamically, you will have to inject `res` object and use its `status` method inside of method's body. Doing it this way will override all defaults.

```typescript
import { Controller, Get, Response } from '@msabo1/expressts';

@Controller('/hello-world')
export class HelloWorldController {
  @Get()
  get(@Response() res: any) {
    res.status(500);
    return 'Hello world';
  }
}
```

### Set headers

You can set headers using `Headers` decorator. It takes one mandatory argument `headers` which is object whose keys are header keys and values are header values. Values must be of type `string`. You can apply that decorator to controller (it will obviously set headers for all route handlers) or you can apply it to method.
If same headers are set controller and method level, method's headers will override controller's.

```typescript
import { Controller, Get, Post, Headers } from '@msabo1/expressts';

@Controller('/hello-world')
@Headers({ hello: 'world' })
export class HelloWorldController {
  @Get()
  @Headers({
    'my-header': 'my-value',
    myHeader: 'myValue',
  })
  get() {
    return 'Hello world';
  }
}
```

If you want to set headers dynamically you will need to inject `res` object and use its `set` method. If header existed before (default or set with `Headers` decorator) this will override it.

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

## Services and dependency injection

As mentioned before, there is one extra feature and that is dependency injection container. It makes use of this framework much more elegant.

### Services

You should extract your business to services (and/or more layers) and use controllers only to directly handle requests and responses.

When you create your service, you will want to connect it with controller somehow. That is where dependency injection comes to play (well you can instantiate services inside of controller constructors, but NO).
As your logic grows you will want to connect services together and more. ExpressTS makes all of that really easy.

First you need to decorate you service class with `Injectable` decorator. It is required because of TypeScript limitations, and without it you can't inject dependencies to service.

By default all services are registered as singletons (there will exist only one instance of service in container and it will be shared everywhere). If you want it not to be singleton, `Injectable` takes object as optional argument which has optional `boolean` property `singleton`. Obviously if set to `false` service won't be singleton and will be reinstantiated whenever injected.

Let's create `src/hello-world.service.ts` and create class decorated with `Injectable` inside of it.

```typescript
import { Injectable } from '@msabo1/expressts';

Injectable();
export class HelloWorldService {
  findMessage(): string {
    return 'Hello world!';
  }
}
```

Now you just list it as controllers constructor parameter and ExpressTS will instantiate and inject it for you.
It is important that you add correct type annotation because that is actually how DI mechanism knows what to inject.

If you want to inject service inside of other service, steps are exactly the same.

```typescript
import { Controller, Get } from '@msabo1/expressts';
import { HelloWorldService } from './hello-world.service';

@Controller('/hello-world')
export class HelloWorldController {
  constructor(private readonly helloWorldService: HelloWorldService) {}

  @Get()
  get() {
    return this.helloWorldService.findMessage();
  }
}
```

### Custom providers

Except services, you can register custom providers that you can later inject. They can have `string` tokens, or you can redefine what is injected instead of class instance using obviously `class` token.

Custom providers are registered inside of `App` decorator at root of application. `App` decorator properties object has optional property `customProviders` which is array of providers.

For each provider you need to specify `token` which is of type `string` or some constructible type (class reference) and `instance` which is of type `any`.

```typescript
import { App } from '@msabo1/expressts';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldService } from './hello-world.service';

@App({
  port: 3000,
  controllers: [HelloWorldController],
  customProviders: [
    { token: 'helloWorldService', instance: new HelloWorldService() },
    { token: HelloWorldService, instance: { findMessage: () => 'Hello world 2!' } },
  ],
})
export class Application {}
```

In this example we created two custom providers. What is actually going on here is that we set `string` token provider to provide instance of `HelloWorldService` and we overrode `class` token provider `HelloWorldService` to provide some custom object. That is really strange thing to do, at least in this context but we did it just to make point.

What is left unclear is how to inject `string` token providers. To make that happen we use `Inject` decorator to decorate constructor arguments. `Inject` takes one mandatory argument which is `string` token we want to inject.

```typescript
import { Controller, Get, Inject } from '@msabo1/expressts';
import { HelloWorldService } from './hello-world.service';

@Controller('/hello-world')
export class HelloWorldController {
  constructor(
    @Inject('helloWorldService') private readonly helloWorldService: HelloWorldService,
    private readonly helloWorldService2: HelloWorldService,
  ) {}

  @Get()
  get() {
    return this.helloWorldService.findMessage();
  }

  @Get('/other')
  get2() {
    return this.helloWorldService2.findMessage();
  }
}
```

In this example, real `HelloWorldService` instance is `helloWorldService`, and custom object is `helloWorldService2`.

## Lifecycle hooks

You can hook and execute code before or after certain points in application bootstrap process. In order to do that you need to implement methods inside of you app root class (in our examples that is `Application` class inside of `src/main.ts`). Methods need to be decorated with proper decorator. Possible decorators (and obviously hooks) are (listed in order how they are actually executed):

`BeforeGlobalMiddlewaresBound`

`AfterGlobalMiddlewaresBound`

`BeforeRoutesBound`

`AfterRoutesBound`

`BeforeListenStarted`

`AfterListenStarted`

Some of hooks overlap and they are equivalent but you shouldn't assume that. You should use exact hook you need because order of execution can change at any version and it won't be considered breaking change (if no other side effects).

```typescript
import { App, BeforeRoutesBound } from '@msabo1/expressts';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldService } from './hello-world.service';

@App({
  port: 3000,
  controllers: [HelloWorldController],
})
export class Application {
  constructor(private readonly helloWorldService: HelloWorldService) {}

  @BeforeRoutesBound()
  private beforeRoutes() {
    console.log('I am executed just before routes are bound');
    console.log(this.helloWorldService.findMessage());
  }
}
```

As you can see in this example, you can inject services and custom providers inside of your application root. You can inject controllers as well.

## Express app instance

You can access express app instance used to build server by injecting it in constructors with `ExpressAppInstance` decorator.

```typescript
import {
  App,
  BeforeRoutesBound,
  AfterGlobalMiddlewaresBound,
  ExpressAppInstance,
} from '@msabo1/expressts';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldService } from './hello-world.service';
import express from 'express';

@App({
  port: 3000,
  controllers: [HelloWorldController],
})
export class Application {
  constructor(
    private readonly helloWorldService: HelloWorldService,
    @ExpressAppInstance() private readonly expressApp: any,
  ) {}

  @BeforeRoutesBound()
  private beforeRoutes() {
    console.log('I am executed just before routes are bound');
    console.log(this.helloWorldService.findMessage());
  }

  @AfterGlobalMiddlewaresBound()
  private afterMiddlewares() {
    this.expressApp.use(express.urlencoded());
  }
}
```

You can inject express app instance to controllers and services as well.
