# MeanConnectFour
This project was made for COMP 484 - Web Engineering.


## Authors

* **Matt Zera** - [GitHub](https://github.com/MattZera/) - [Website](https://mattzera.com)
* **Kory Dondzila** - [GitHub](https://github.com/korydondzila/) - [Website](http://korydondzila.com)


### Description

This project implements the game of Connect Four in three different modes.
1. Single Player - This mode allows the user to play against an AI.
2. Multiplayer - This mode allows two users to play against each other.
3. Democratic Play - This mode allows many users to play against a single AI. The users have 30 seconds to vote on the move to make and the move with the largest number of votes is taken, or if there is a tie then one of the tied moves is randomly taken.

When the user first acceses the site they are shown a menu screen with the three game modes, clicking one will take the user to that game.
In the case of Single Player, a new game is created an play begins, either the player or AI is chosen to go first. Leaving before the game finishes will end the game.

In the case of Multiplayer, if no one is currently waiting to play, then a new game is made and the player must wait for another to join. Otherwise the player will join a game that has a waiting player. When the game begins, one of the players is chosen to go first. Leaving beforet he game finishes will cause the other player to win.

In the case of Democratic Play, if no one is in the game, then a new game is created and the player must wait for at least one more player for the game to start. Other wise the player will join a game in progress. If the game is new, either the players or AI is chosen to go first. Leaving the game after placing a vote, but before the move is made, will cause that vote to be removed.

It is possible for a single user to play multiple games at the same time, against themselves, or as multiple players in the Democratic game. This is done by having more than one browser window open. So technically a player could achieve multiple votes in the Democratic game this way.


## Development Setup

This project uses multiple technologies. `Angular2`, `Node.js`, `Express`, and `Socket.io`.

Before starting to install this project it would be best to globally install `node`, `yarn`, and `concurrently`.
You should already have `npm` available, so run the commands `npm install --global yarn`, `npm install --global node`, and `npm install --global concurrently`.

Then run `yarn`, this will install all the required `node_modules` for the server and then do the same for the client.


### Dev server

You can start the client and API server by running `yarn dev`. This will concurrently run `yarn start` which starts up the dev server and `cd App && yarn build` which will build the app.
The client is then viewable at `localhost:3000`.
This will also allows any code changes to quickly update the server and client, but the browser will need to be manually reloaded.


# Deploying

If you choose to deploy to a server, follow the steps below.

