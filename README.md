# Arcadia, The AI Medieval Drama Simulator

Welcome to Arcadia, the AI Medieval Drama Simulator. This project is an experiment in using generative AI technologies to create a narrative experience, while also hopefully serving as an example to the larger community of best practices around how to use various generative AI APIs.

# Features
Note the latest stable version is always hosted at https://www.generativestorytelling.ai

Arcadia highlights the use of LLMs to generate animated narratives, detailing the drama in a royal court of your choosing. List the names of your friends and family, and watch as they betray, poison, marry, and stab one another to take control of the Kingdom!
![Screenshot of generativestorytelling.ai showing an advisor warning a king that his wife plans to overthrow him](https://raw.githubusercontent.com/devlinb/arcadia/main/assets/screenshot.JPG)


## Tools used
Narration is provided by GPT 3.5

The 3d Background is from [Blockadelabs](https://skybox.blockadelabs.com/)

Character portraits are generated by Dalle

Upcoming features include text to speech narration, music, sound effects, and the ability to save,share, and replay stories.

# Code

## Overview

To ensure this can serve as an example for people, I have attempted to minimize third party dependencies in the code, and to also keep the build system as simple as possible. When there is a choice between doing things a fancy way (e.g. Sass, OpenAPI) or a simple way (shared directory of TypeScript files), the simple way has been chosen.

Ideally if you are familiar with TypeScript, Express, and HTML, you should be able to understand the code base.

[Svelte](https://svelte.dev/) is used on the front end, if you are not familiar with Svelte, it is a very minimal set of tooling for doing data binding in HTML, the basics can be picked up [in less than an hour](https://svelte.dev/tutorial/basics) with the full tutorial taking 2 or 3 hours at max. Even if you do not know Svelte, hopefully the front end code can still be easily understood.

## Code Layout
The code is split into three folder:
* backend
* frontend
* shared

The `shared` folder is symlinked into the `backend` and `frontend` folders, a nifty trick that allows for sharing TypeScript types and modules between projects without having to setup a full mono-repo. If you are using an old version of Windows (pre Windows 10), then you may have to manually enable symlinks for non-administrator accounts on your system.

### Backend
The backend is a minimal Express.js server that demonstrates how to prompt GPT so it gives structured responses, and then parsing those responses. Two examples of fetching from GPT are included, one hitting the REST endpoint for chat, and a second showing streaming responses for chat. In both cases results over sent from the server over a web socket to the front end web client.

To get the backend working you will need to create your own `.env` file with your `OPENAI_API_KEY` key in it. If you want to save stories you'll also need do add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. Note that sadly vultr is hard coded as the s3 provider, that needs to be extracted to the env file as well at some point.

### Frontend
The front end is a Svelte web app that gathers the name of the members of the royal court, sends it off to the backend, and when a story is fetched, animates it on the [`Dialogue.svelte`](/frontend/src/lib/Dialogue.svelte) component.

### Shared

Common types and utility functions are in `shared`. Primarily used for data types that are shared by the front end and the back end.

Due to build issues on some OSs, sadly backend now has a hard copy of shared types, need to figure out why symlinking isn't being picked up on MacOS.

# Building and Running
To run the project, do the following:

1. git pull into a local folder
2. (optional if you want to run the backend yourself) in the root folder of `backend` create a file `.env` and populate it with `OPENAI_API_KEY=` and fill in your key.  
3. In each of `shared`, `backend` and `frontend` do `npm install` and `npm build`
4. You can run just the front end and view the pregenerated stories, do to so go to `frontend` and enter `npm run dev` that will start up vite, and you can connect to `http://localhost:5173/`, select both checkboxes up top and then `make some drama`.
![Two checkboxes at top of the screen selected, one labeled "Pregenerated Character" the other labeled "Pregenerated Story"](https://github.com/devlinb/arcadia/blob/main/assets/checkboxes.JPG)


  a. To alter which pregenerated story is displayed, you can change the index on line 14 of [StoryFetcherws.ts](/frontend/src/lib/StoryFetcherws.ts) 

    `const events = parseOutEvents(pregenStories[2].story);`
5. To run the backend, go to `backend` and enter `npm run dev`. The frontend, when run locally, will automatically attempt to connect to the backend on localhost.
6. `npm run debug` is supported on the backend to run `node --inspect`


# Todo
Upcoming features:

1. Text to speech narration
2. ~~Streaming responses from ChatGPT to reduce response time from 30 seconds down to 5 seconds~~
  - Adding in TTS will probably make this go back up to 30 seconds! But we need this so the result isn't 30s+30s=1 minute wait in total.
3. ~~Music~~
4. ~~Sound effects triggers off of emojis~~
5. ~~The ability to save, replay, and share stories.~~
6. Fixes for the navigation button UX
   a. Buttons need styling
   b. Buttons need proper state handling
7. Needs a complete accessibility passthrough.
8. Extract s3 stuff in backend to all be in the env file.
