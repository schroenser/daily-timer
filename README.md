# Daily timer

A simple timer for daily standup meetings.
Use this timer immediately
under https://schroenser.github.io/daily-timer?duration=PT1M&names=Frodo,Sauron,Gandalf,Aragorn,Gollum .

Both the duration for each participant as well as the list of participants are passed as parameters.

* `duration`: The duration for each participant is specified in
  the [ISO 8601 Duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) format.
  Yes, that allows for abstrusely long monologues as `Y` for "year" is certainly an option.
* `names`: Names is a comma separated list of names.
  You can use `%20` if you need given and surname separated by a space or something similar.
  The list of names in the app will be randomized on page (re)load, disregarding of the order in the parameter.

Note that there are also some (hot?)key combinations on the page itself.
The online help can be displayed by pressing `?`.

## Developer information

### Project setup

```shell
npm install
```

#### Compiles and hot-reloads for development

```shell
npm run dev
```

#### Compiles and minifies for production

```shell
npm run build
```
