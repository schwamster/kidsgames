# kidsgames

This is a little side project for my 4 year old. Right now she enjoys writing names and add numbers. So I decided to create a little page to "gameify" the experience. 

You can check out a current demo [here](https://kidsgame.schwamster.xyz).

There is still a fair bit to do, but it is usable to a degree. Time will tell who looses interest first, me or my daughter :)

Typing Game: The game will show and read a word to you, that you have to type. If you typed the correct word the next word will appear.

Math Game: The game will show, read and visualize a simple math problem. If you type the correct answer the next problem will appear.

![alt text](word.gif "Example Typing")

![alt text](math.gif "Example Math")

This is a very simple project that has dependencies to [Bootstrap 4 beta](https://getbootstrap.com/), [d3](https://github.com/d3/d3) and [React](https://facebook.github.io/react/).
[Webpack](https://webpack.github.io/) is used to bundle the sources.


## Getting started

If you want to get this to run locally, clone the project and run

    yarn 

in the root of the project to install all dependencies. 

After that you build locally

    yarn build-local

Then you can start the project by running

    yarn start
    
This will start the app under http://localhost:5000

During development I would recommend starting the app with the following command:

    yarn dev

This will start the app under http://localhost:8080 and the page will automatically refresh whenever you make changes to the javascript sources.

## Deploying

I recently started testing now from Zeit to deploy my pet projects and it works nicly. This project is ready to be deployed with now (Not that there is a lot to do for it).

Install now like this:

    npm install -g now
    
Then deploy your app by running this:

    now
    
That is it. All you have to do is create an account first time you run. You will be guided through the simple process when running now.