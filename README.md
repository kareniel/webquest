<h1 align="center">
  <img src="https://i.imgur.com/hpFkkQ9.gif" alt="webquest logo, spells out webquest">
</h1>

<div align="center">
  interactive coding workshops in the browser
</div>

<div align="center">
  <img src="https://i.imgur.com/guaXdLG.png" alt="demonstration of the webquest interface" width=700>
</div>

webquest is a __framework__ for creating interactive workshops, called __Questlines__ that can be run completely in the browser. It borrows a lot from a [nodeschool workshopper](http://nodeschool.io/#workshopper-list), but is aimed at running in thw browser, therefore removing the requirement to be familiar with the command line. Additionally, the tools used to build nodeschool workshoppers are outdated, something that webquest aims to modernize.

## Installation

```sh
npm install webquest
```

If you're building a Questline, you're likely also going to want to install a library that helps with running your exercises:

```sh
npm install questmap
```

## Building a simple Questline

Create a file called `index.js`:

```js
const webquest = require('webquest')

const w = webquest({
  name: 'my-cool-questline',
  appDir: __dirname
})

w.addExercises([
  'example-exercise',
]).then(() => {
  w.execute(process.argv.slice(2))
})
```

This file is the entry point for your questline. We initialize a `webquest` instance with `name` and an `appDir` option. The `appDir` option is especially important since if it's not provided, webquest will not be able to find your exercises and translations. It should be set to `__dirname`.

We then add exercises in the order that we want them to be listed later on. This returns a Promise, so we use `.then` to wait until they're added and call the actual webquest process itself. This starts the server and shows the website and everything else.

### Translations

Before we go on here, we need to talk about translations. webquest defaults to using i18n, which means that you need to keep that in mind while writing your Questline: Anything that you display to your user has to be translatable into other languages. We're going to revisit how to do that later on.

### Writing problems

In our `index.js`, we added an exercise called `example-exercise`. Let's create a file at `exercises/example-exercise/problem.en.md` (notice the `.en.md`, which means that this is in English), and write some stuff in it:

```md
Haha! You have found my secret _TEST EXERCISE_! You will never escape alive!
```

As indicated by the file extension, exercise texts support Markdown.

### Checking solutions

Obviously, you want to make sure that your exercise gets passed by your Questline's users, right? For that let's create `exercises/example-exercise/exercise.js`:

```js
const qm = require('questmap')

const exercise = qm()

exercise.addProcessor(async function () {
  this.log('hello!')
  this.end()
})

module.exports = exercise
```

This code uses [questmap](https://github.com/questline/questmap), which helps you verify and run exercises. We won't go over how it all works here, for that, please read the `questmap` docs, but basically `this.log` prints out a message to the user and `this.end` ends the exercise. If `this.error` hasn't been called before, the exercise automatically passes, else, it fails.

Now, we're logging `hello!` here. Let's make sure that can be translated. For that, we'll create a `i18n/en.json` file in your Questline's folder:

```json
{
  "example-exercise": {
    "hello": "hello!"
  }
}
```

The value of the `example-exercise.hello` key is what should be displayed to the user, and we can do so by modifying the `exercise.js` file:

```js
const qm = require('questmap')

const exercise = qm()

exercise.addProcessor(async function () {
  this.log(this.__e('hello'))
  this.end()
})

module.exports = exercise
```

`this.__e` fetches a translatable string from the `i18n/{locale}.json` file and displays it. `__e` is syntactic sugar for `this.__('{exerciseName}.{argument}')`. Basically, it saves you from having to enter the exercise name every time you want to translate something (although you still can do that should you wish to). If you want to have global translatable strings that should be used across all exercises, just use `this.__` instead.

### Running it all

Just run `node index.js` and everything should work, a browser tab should pop up and your exercise should be there!

### Next steps

- Export your Questline as a binary in `package.json` and publish it! That way, people can run `npm install -g my-questline && my-questline` to get started
- Read the [`questmap` docs](https://github.com/questline/questmap#readme) to get a good grasp on writing exercises
- If there's any inconsistencies or errors in this Readme, [open an issue](https://github.com/questline/webquest/issues/new)!

## Maintainers

This project is a community-owned and maintained project, meaning everyone takes part in caring for its wellbeing. Its current contributors are:

- [@pup](https://github.com/pup) (Olivia Hugger)

## License

AGPL-3.0+ (see [LICENSE](./LICENSE))
