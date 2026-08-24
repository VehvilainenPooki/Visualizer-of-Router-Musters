<img alt="VoRM logo" src="https://github.com/VehvilainenPooki/Visualizer-of-Router-Musters/blob/main/VoRM/public/vorm.svg" style="width:20%; height:auto;">

# [vorm.pooki.org](vorm.pooki.org)
# Visualizer of Router Musters

Visualizer of Router Musters or VoRM is a WIP project. Its goal is to visualize large musters (groups) of routers that communicate with multiple different routing protocols and possibly with different protocol options.

## User Instructions Docs
You can find the docs [here](https://github.com/VehvilainenPooki/Visualizer-of-Router-Musters/blob/submission/Docs/Instructions)

## Timelogs
Timelogs can be found [here](https://github.com/VehvilainenPooki/Visualizer-of-Router-Musters/blob/submission/Docs/Timelogs/timelogs.md)

## State At Full Stack Open Project Submission
The application implements a user management system with email verification, graph editor that has no network simulation yet and a browse view to look at public and your own illustrations. Unfortunately everything took longer than I expected and so I still have a lot to do with this project and I will be continuing development.

## Project Stack
### Shared
- `TypeScript`
### Client
- `React`
- `Vite`
- `Mantine` UI Library
- `D3` for graph
- `CodeMirror` for Graph code editor
- `Tanstack Router` for routing
- `lucide` for icons
### Server
- `Node`
- `Express` for routing
- `Sequelize` for model based database interaction
- `umzug` for migrations
- `nodemailer` for email
### Database
- `PostgreSQL`

## Glaring Shortcomings
- No password reset
- Browse public illustrations only shows the first 30 entries from the database ever -> search doesn't fetch more illustrations and no "next page" or infinite scroll
- Edit lacks features and is barely passable

## Current Goals
- Fix glaring shortcomings
- Network simulation that can be advanced in step and ran at different speeds
- Multiple routing protocols
- website where one can select number of routers and some options for protocols, connections and router failure rates
- Visualization where it is clear when a packet is dropped and what caused it

## Pipe dream Goals
- Multiple transport layer protocols
- Protocol options
- IPv4 and IPv6
- Tunneling

## Deployment
My project is deployed in a `Hetzner VPS`. It is automatically redeployed when a new commit arrives to main starting the `GitHub Action`. The action builds a docker container image of the latest changes, pushes it to GitHub Container Registry and calls a webhook which triggers the servers redeployment. On the server I run `Dokploy` configured to pull and deploy the latest image on a webhook call.

`Dokploy` is configured so I can remote into it with ssh. On it I have set up SSL certificates with Let's Encrypt and I have the ability to easily change, create or remove project with custom subdomains. Currently I only have the vorm.pooki.org project running but I intend to expand it with a portfolio page and many more to come. Dokploy serves the PostgreSQL database as a persistent container to the vorm project.

## Use of LLMs
I have used LLMs widely in the development of this project. There is plenty of generated code. Any time I have prompted for a large change directly to the project I have committed it as is without modification with a note in the commit message. This note has changed over the development from using the word "prompt" to most recently using a more structure commit message with [ai] indicating fully generated code. I have definitely forgot to follow this guideline a few times. Commits that aren't fully generated might still have used llms to generate parts of the code but in those cases it is something simpler that was faster to generate compared to writing it myself or I explored the concept with a LLM before writing my own implementation.

I used Mainly Claude Sonnet 4.6 and then 5 after its release. Beyond code generation I used it heavily to aid in learning topics when package documentation was convoluted or lacking in detail. I used it to explore ideas and understand generated code when neccessary. Often afterwards I would also read the relevant docs to verify the conclusion. I aimed to understand what I want before generating code so that I wasn't just mindlessly following the path that the llm happen to choose.

Using LLMs is a constant battle for me as sometimes I feel I lose the feel for my codebase when I work with them. This feeling is restored when I work through the code and sometimes I'll refactor a lot of code (Look at useIllustrationSave.ts commits). At the same time often it feels pointless doing things by hand as it just takes so much longer and the result in those situations can be the exact same (Commit [03ed21c](https://github.com/VehvilainenPooki/Visualizer-of-Router-Musters/commit/03ed21c511ecf7b1edfccb713ce0be4f96bde5a9) is a great example of this but at the same time I needed to go through the mud to get a hold of those systems). In the end LLM use is a delicate balance between understanding your codebase and leveraging their power. The one place where I mostly gave up trying to understand due to time constraints was the CodeMirror/lemur syntax handling code. On the surface I understand it but I'd have to work on it a lot to have any capacity to write it from scratch.

During development I have tried to commit LLM-generated code separately with commits that are something like prompt: "...". Then during the final days of the project I started tagging my commits with [ai] or [me] indicating if it is just generated code or mostly human written. With this we can do rough calculation of LLM-generated code coverage based on line commit blame. LLM-detected means commit included [ai] or "prompt":
| Directory | Lines | LLM% | Tagged Human % | Untagged Human % |
|---------|--------|--------|-------|------|
| client | 3832 | 60.1% | 6.8% | 33.2% |
| common | 58 | 43.1% | 10.3% | 46.6% |
| server | 965 | 20.1% | 0.6% | 79.3% |
| total | 4,668 | 49.7 | 5.8% | 44.5% |

| LLM-generated | files count |
|-------|-------|
| more than 70% | 25 |
| 30-70% | 17 |
|less than 30% | 43 |

56% of the LLM-attributed lines were in the 25 files that were mostly LLM-generated.

And now that I look at the files I see some patterns like file moved using llm that inflate the percentages but I won't refine the numbers more. I find the numbers fascinating and a bit horrifying. But in reality most of that llm code is something that I quite intentionally prompted and audited. The exception to that rule are the CodeMirror adjacent files which I'm not as familiar with.