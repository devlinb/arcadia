# Arcadia Frontend

## Intro
Welcome to the Arcadia frontend project! This HTML app is written in Svelte, and shows off how generative AIs and LLMs can be used to create rich story telling experiences. 

At its heart, the front end takes in the names of some characters, establishes a web socket connection to the backend, sends over the character names and then does a fancy job displaying a generated story.

## Running

`npm install` 

`npm run dev`

should get you up and going. If you don't want to worry about the back end, you can select both checkboxes up top to use pregenerated characters and a pregenerated story. Change the array index on the line  `const events = parseOutEvents(pregenStories[2].story);` in [storyfetcher](./src/lib/StoryFetcherws.ts) to change what pregenerated story is returned.

## Navigating the code

`main.ts` and `index.html` are mostly boilerplate. Go to [App.svelte](./src/App.svelte) to actually get started.

### `App.svelte` 
Based on the current state (getting character names, waiting for the story, playing the story, story has ended) [`App.svelte`](./src/App.svelte) chooses which component to show.

### `StoryForm.svelte`

Simple HTML form that gathers inputs. Only tricky bit is that only only one character of each relationship type can exist at once, so there can only be one King, one Queen, one Bishop, etc. A `set` is used to track which relationships are already chosen.

The ability to have a variable number of characters was removed in an early alpha, although supporting code for that feature still exists.

### `Dialogue.svelte`

The Dialogue component animates lines of the story. It subscribes to the `currentStatement` and `currentEvent` stores (store subscription in Svelte is automatic whenever you access a member of the store and preface your access with `$`).

One very cool thing about Svelte is you can write code like

```
  <div class="story-line-container">
    {$currentStatement.statement}
  </div>
```

and that div's contents will get updated when the current statement changes, no extra re-renders.

### `StorySummary.svelte`

After the animation is over, shows the entire story in summary. Includes a button to start everything over again by simply refreshing the page.

### `CharacterCard.svelte`

Trivial UI component to render portraits and names.

### `StoryFetcherws.ts`

Establishes a websocket connection to the server and fetches a story, updating the `storyState` story as appropriate.

### stores - `story.svelte`

Has its own comments, tl;dr it is the primary datastore for the app, it has an array of statements in the story, and other components can subscribe to the current statement and current event. A statement can have multiple events (e.g. two people can stab each other in the same statement, each stabbing is one event).

# Contributing

Before opening a PR please run `npm run check`, that will run Svelte's built in linter.
