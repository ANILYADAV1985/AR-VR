/*{# Copyright (c) 2013 Turbulenz Limited #}*/

/*
* @title: Data shares
* @description:
* An example of how to do a turn based game using data share objects.
*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/datasharemanager.js") }}*/
/*{{ javascript("jslib/services/notificationsmanager.js") }}*/
/*{{ javascript("jslib/services/sessiontoken.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/fontmanager.js") }}*/
/*{{ javascript("jslib/assetcache.js") }}*/

/*{{ javascript("scripts/htmlcontrols.js") }}*/
/*{{ javascript("scripts/simplebuttons.js") }}*/


/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global DataShareManager: false */
/*global RequestHandler: false */
/*global Draw2D: false */
/*global FontManager: false */
/*global ShaderManager: false */

/// <reference path="../simplebuttons.ts" />

TurbulenzEngine.onload = function onloadFn()
{
    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var inputDevice = TurbulenzEngine.createInputDevice({});
    var requestHandler = RequestHandler.create({});

    var fontManager = FontManager.create(graphicsDevice, requestHandler);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler);

    var font, fontShader;
    var dataShareManager;
    var gameNotificationsManager;
    var userProfile;
    var gameSession;

    // Textures to load:
    var spriteTextureNames = ["textures/tictactoeboard.png",
                              "textures/nought.png",
                              "textures/cross.png"];

    // List to store Texture objects.
    var textures = {};
    var numTextures = spriteTextureNames.length;
    var loadedResources = 0;

    function getPieceTexture(piece: string)
    {
        if (piece === 'O')
        {
            return textures['textures/nought.png'];
        }
        else if (piece === 'X')
        {
            return textures['textures/cross.png'];
        }
        else
        {
            return null;
        }
    }

    function mappingTableReceived(mappingTable)
    {
        var urlMapping = mappingTable.urlMapping;
        var assetPrefix = mappingTable.assetPrefix;

        fontManager.setPathRemapping(urlMapping, assetPrefix);
        fontManager.load('fonts/hero.fnt', function (fontObject)
            {
                font = fontObject;
            });

        shaderManager.setPathRemapping(urlMapping, assetPrefix);
        shaderManager.load('shaders/font.cgfx', function (shaderObject)
            {
                fontShader = shaderObject;
            });

        function textureParams(src)
        {
            return {
                src : mappingTable.getURL(src),
                mipmaps : true,
                onload : function (texture)
                {
                    if (texture)
                    {
                        textures[src] = texture;
                        loadedResources += 1;
                    }
                }
            };
        }

        var i;
        for (i = 0; i < spriteTextureNames.length; i += 1)
        {
            graphicsDevice.createTexture(textureParams(spriteTextureNames[i]));
        }
    }

    var currentDataShare: DataShare;
    var joinedDataShares: DataShare[];
    var joinedGames: { [id: string]: TicTacToeGame; } = {};
    var foundDataShares: DataShare[];

    function sessionCreated()
    {
        TurbulenzServices.createMappingTable(
            requestHandler,
            gameSession,
            mappingTableReceived
        );

        dataShareManager = DataShareManager.create(requestHandler, gameSession);
        gameNotificationsManager = NotificationsManager.create(requestHandler, gameSession, function () {});

        function profileRecievedFn(currentUser: UserProfile)
        {
            userProfile = currentUser;
            findDataShares();
        }
        TurbulenzServices.createUserProfile(requestHandler, profileRecievedFn);
    }

    var invalidateButtons = false;

    gameSession = TurbulenzServices.createGameSession(requestHandler, sessionCreated);

    function findDataShares()
    {
        function joinedDataSharesCallback(dataShares: DataShare[])
        {
            joinedDataShares = dataShares;
            var dataSharesLength = dataShares.length;
            var dataSharesIndex;
            function getJoinedGameStateFn(dataShare: DataShare)
            {
                return function getJoinedGameState(gameStateStore: DataShareGetCBData)
                {
                    var ticTacToeGame = TicTacToeGame.create(userProfile.username, dataShare.owner);
                    joinedGames[dataShare.id] = ticTacToeGame;
                    var users = dataShare.users;
                    var usersLength = users.length;
                    var usersIndex;

                    for (usersIndex = 0; usersIndex < usersLength; usersIndex += 1)
                    {
                        ticTacToeGame.playerJoined(users[usersIndex]);
                    }

                    if (gameStateStore)
                    {
                        ticTacToeGame.update(gameStateStore.value);
                    }
                };
            }
            for (dataSharesIndex = 0; dataSharesIndex < dataSharesLength; dataSharesIndex += 1)
            {
                var dataShare = dataShares[dataSharesIndex];
                dataShare.get('game-state', getJoinedGameStateFn(dataShare));
            }
        }
        dataShareManager.findDataShares({
                user: userProfile.username, // find all games that the current user is joined to
                callback: joinedDataSharesCallback
            });

        function foundDataSharesCallback(dataShares: DataShare[])
        {
            foundDataShares = [];
            var dataSharesLength = dataShares.length;
            var dataSharesIndex;
            var currentUsername = userProfile.username;

            for (dataSharesIndex = 0; dataSharesIndex < dataSharesLength; dataSharesIndex += 1)
            {
                var dataShare = dataShares[dataSharesIndex];
                if (!dataShare.isJoined(currentUsername))
                {
                    foundDataShares.push(dataShare);
                }
            }
            invalidateButtons = true;
        }
        // find any joinable datashares
        dataShareManager.findDataShares({callback: foundDataSharesCallback});
    }

    var currentGame: TicTacToeGame;

    function createGame()
    {
        function dataShareCreated(createdDataShare: DataShare)
        {
            currentDataShare = createdDataShare;
            var username = userProfile.username;
            currentGame = TicTacToeGame.create(username, username);
            joinedGames[createdDataShare.id] = currentGame;

            invalidateButtons = true;
        }
        dataShareManager.createDataShare(dataShareCreated);
    }

    function leaveGame(callback?)
    {
        function dataShareLeft()
        {
            delete joinedGames[currentDataShare.id];
            currentGame = null;

            currentDataShare = null;
            invalidateButtons = true;
            if (callback)
            {
                callback();
            }
            findDataShares();
        }
        currentDataShare.leave(dataShareLeft);
    }

    function forfeitGame()
    {
        function gameStateSet(wasSet: bool, reason?: string)
        {
            if (wasSet)
            {
                invalidateButtons = true;
                currentGame.update();

                var otherUser = currentGame.getOtherUser();
                if (otherUser)
                {
                    gameNotificationsManager.sendInstantNotification({
                        key: 'forfeit',
                        msg: {
                            dataShareId: currentDataShare.id,
                            text: userProfile.username + ' forfeit the game'
                        },
                        recipient: otherUser
                    });
                }
            }
            else
            {
                if (reason === DataShare.notSetReason.changed)
                {
                    // other player has moved so read the change and then forfeit again
                    readMoves(forfeitGame);
                }
                else
                {
                    // something has gone wrong
                    leaveGame();
                }
            }
        }
        currentGame.forfeit();
        // do a compare and set in case the other player has taken the first move
        currentDataShare.compareAndSet({
                key: 'game-state',
                value: currentGame.serialize(),
                access: DataShare.publicReadAndWrite,
                callback: gameStateSet
            });
    }

    function getPlayGameFn(dataShare: DataShare)
    {
        return function playGame()
        {
            currentDataShare = dataShare;
            currentGame = joinedGames[dataShare.id];
            readMoves();
        }
    }

    function getJoinGameFn(dataShare: DataShare)
    {
        return function joinGame()
        {
            function joinedDataShare(success: bool)
            {
                if (success)
                {
                    currentDataShare = dataShare;
                    if (currentDataShare.users.length > 2)
                    {
                        // only 2 players should join a game
                        // this possible if 2 people click to join a game at the same time
                        leaveGame();
                    }
                    function setJoinableCallback()
                    {
                        currentGame = TicTacToeGame.create(userProfile.username, dataShare.owner);
                        joinedGames[dataShare.id] = currentGame;
                        readMoves();

                        var otherUser = currentGame.getOtherUser();
                        if (otherUser)
                        {
                            gameNotificationsManager.sendInstantNotification({
                                key: 'player-joined',
                                msg: {
                                    dataShareId: currentDataShare.id,
                                    text: userProfile.username + ' has joined your game'
                                },
                                recipient: otherUser
                            });
                        }
                    }
                    currentDataShare.setJoinable(false, setJoinableCallback);
                }
                else
                {
                    findDataShares();
                }
            }
            dataShare.join(joinedDataShare);
        }
    }

    function playerJoinedFn(notification)
    {
        if (currentGame && currentDataShare.id === notification.message.dataShareId)
        {
            currentGame.playerJoined(notification.sender);
        }
    }

    function readMoves(callback?)
    {
        function getMovesCallback(gameStateStore)
        {
            if (gameStateStore)
            {
                var serializedGameState = gameStateStore.value;
                currentGame.update(serializedGameState);
            }

            invalidateButtons = true;
            if (callback)
            {
                callback();
            }
        }
        currentDataShare.get('game-state', getMovesCallback);
    }

    function yourTurnFn(notification)
    {
        if (currentGame && currentDataShare.id === notification.message.dataShareId)
        {
            readMoves();
        }
    }

    function toLobby()
    {
        currentDataShare = null;
        currentGame = null;
        findDataShares();
    }

    function getOnClickFn(x: number, y: number)
    {
        return function onClick()
        {
            function gameStateSet(wasSet: bool, reason?: string)
            {
                if (wasSet)
                {
                    currentGame.update();
                    var otherUser = currentGame.getOtherUser();
                    if (otherUser)
                    {
                        gameNotificationsManager.sendInstantNotification({
                            key: 'your-turn',
                            msg: {
                                dataShareId: currentDataShare.id,
                                text: 'It\'s your turn'
                            },
                            recipient: otherUser
                        });
                    }
                    if (currentGame.roundEnd)
                    {
                        invalidateButtons = true;
                    }
                }
                else
                {
                    if (reason === DataShare.notSetReason.changed)
                    {
                        // other player has taken the first move or forfeit so get the moves again and ignore the click
                        readMoves();
                    }
                    else
                    {
                        // something has gone wrong
                        leaveGame();
                    }
                }
            }

            if (currentGame.currentPlayerTurn)
            {
                if (currentGame.canMove(x, y))
                {
                    currentGame.doMove(x, y);
                    // do a compare and set in case the other player has taken the first move
                    // or has forfeit (which they can do even when it's not their turn)
                    currentDataShare.compareAndSet({
                            key: 'game-state',
                            value: currentGame.serialize(),
                            access: DataShare.publicReadAndWrite,
                            callback: gameStateSet
                        });
                }
            }
            else
            {
                readMoves();
            }
        }
    }

    var draw2D;

    var status = [];
    function setStatus(msg: string)
    {
        status.push(msg);
    }

    function clearStatus(delay?: number)
    {
        TurbulenzEngine.setTimeout(function () {
                status.shift();
            }, delay || 500);
    }

    var clearColor = mathDevice.v4Build(1.0, 1.0, 1.0, 1.0);
    var fontColor = mathDevice.v4Build(0.5, 0.5, 0.5, 1.0);
    var fontBoldColor = mathDevice.v4Build(0.3, 0.3, 0.3, 1.0);

    var fontTechnique, fontTechniqueParameters;
    var scale = 0.6;

    SimpleButtonManager.init(inputDevice);

    var textScale = 1;
    var textSpacingY = 2;

    var boardOffsetX = 1;
    var boardOffsetY = 3;
    var boardSizeX = 10;
    var boardSizeY = 10;

    var setButtons = false;
    var oldWidth = 0;
    var oldHeight = 0;

    function mainLoop()
    {
        if (!graphicsDevice.beginFrame())
        {
            return;
        }

        setButtons = invalidateButtons ||
                     oldWidth !== graphicsDevice.width ||
                     oldHeight !== graphicsDevice.height;
        if (setButtons)
        {
            SimpleButtonManager.clearButtons();
            invalidateButtons = false;
        }
        oldWidth = graphicsDevice.width;
        oldHeight = graphicsDevice.height;

        graphicsDevice.clear(clearColor);

        // Draw fonts.
        graphicsDevice.setTechnique(fontTechnique);
        fontTechniqueParameters.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1,
                                                               fontTechniqueParameters.clipSpace);

        function segmentFont(x: number, y: number, text: string, clickCallback?)
        {
            var topLeft = draw2D.viewportUnmap(x, y);
            if (clickCallback)
            {
                fontTechniqueParameters.color = fontBoldColor;
            }
            else
            {
                fontTechniqueParameters.color = fontColor;
            }
            graphicsDevice.setTechniqueParameters(fontTechniqueParameters);
            font.drawTextRect(text, {
                rect : [topLeft[0], topLeft[1], 0, 0], // for left-align width and height are ignored
                scale : textScale,
                spacing : 0,
                alignment : 0
            });

            if (setButtons && clickCallback)
            {
                var textBlockSize = font.calculateTextDimensions(text, textScale, 0);
                SimpleButtonManager.addButton(
                    topLeft[0], topLeft[1],
                    topLeft[0] + textBlockSize.width, topLeft[1] + textBlockSize.height,
                    clickCallback);
            }
        }

        function renderLobby()
        {
            var offsetY = 0;
            if (joinedDataShares && joinedDataShares.length > 0)
            {
                segmentFont(0, 0, 'Playing:');
                offsetY += textSpacingY;

                var joinedDataSharesLength = 0;
                var joinedDataSharesIndex;
                if (joinedDataShares)
                {
                    joinedDataSharesLength = joinedDataShares.length;
                    for (joinedDataSharesIndex = 0; joinedDataSharesIndex < joinedDataSharesLength; joinedDataSharesIndex += 1)
                    {
                        var dataShare = joinedDataShares[joinedDataSharesIndex];
                        var game = joinedGames[dataShare.id];
                        if (game && game.roundEnd)
                        {
                            segmentFont(3, offsetY, 'Game finished (click to see result)', getPlayGameFn(dataShare));
                        }
                        else
                        {
                            var users = dataShare.users;
                            if (users.length === 1)
                            {
                                segmentFont(3, offsetY, 'Waiting for player', getPlayGameFn(dataShare));
                            }
                            else
                            {
                                segmentFont(3, offsetY, users[0] + ' vs ' + users[1], getPlayGameFn(dataShare));
                            }
                        }
                        offsetY += textSpacingY;
                    }
                }
            }

            var dataSharesLength = 0;
            var dataSharesIndex;
            if (foundDataShares)
            {
                dataSharesLength = foundDataShares.length;
                if (dataSharesLength > 0)
                {
                    segmentFont(0, offsetY, 'Games to join:');
                    offsetY += textSpacingY;
                    for (dataSharesIndex = 0; dataSharesIndex < dataSharesLength; dataSharesIndex += 1)
                    {
                        var dataShare = foundDataShares[dataSharesIndex];
                        segmentFont(3, offsetY, dataShare.owner, getJoinGameFn(dataShare));
                        offsetY += textSpacingY;
                    }
                }
                else
                {
                    segmentFont(0, offsetY, 'No new games to join');
                    offsetY += textSpacingY;
                }
            }

            segmentFont(0, offsetY, 'Refresh', findDataShares);
            segmentFont(20, offsetY, 'Create new game', createGame);
            offsetY += textSpacingY;
        }

        function renderGame()
        {
            var roundEnd = currentGame.roundEnd;
            if (roundEnd)
            {
                segmentFont(0, 0, 'Leave', leaveGame);
            }
            else
            {
                segmentFont(0, 0, 'Back to lobby', toLobby);
                segmentFont(20, 0, 'Forfeit', forfeitGame);
            }

            var users = currentGame.getUsers();
            var usersLength = users.length;
            var usersIndex;
            var offsetY = boardOffsetY + boardSizeY + textSpacingY * 2;
            for (usersIndex = 0; usersIndex < usersLength; usersIndex += 1)
            {
                segmentFont(3, offsetY, users[usersIndex]);
                offsetY += textSpacingY;
            }

            if (roundEnd)
            {
                if (roundEnd.draw)
                {
                    segmentFont(0, offsetY, 'Draw');
                }
                else if (roundEnd.forfeit)
                {
                    segmentFont(0, offsetY, roundEnd.forfeit + ' forfeit!');
                }
                else if (roundEnd.winner)
                {
                    segmentFont(0, offsetY, roundEnd.winner + ' wins!');
                }
            }
            else
            {
                if (currentGame.firstMove === null)
                {
                    segmentFont(0, offsetY, 'Either player can take the first move');
                }
                else if (currentGame.currentPlayerTurn)
                {
                    segmentFont(0, offsetY, 'It\'s your turn');
                }
                else
                {
                    segmentFont(0, offsetY, 'Waiting for other player\'s turn');
                }
            }
            offsetY += textSpacingY;

            if (draw2D.begin(draw2D.blend.alpha))
            {
                draw2D.draw({
                    texture : textures['textures/tictactoeboard.png'],
                    destinationRectangle : [boardOffsetX, boardOffsetY,
                                            boardOffsetX + boardSizeX, boardOffsetY + boardSizeY]
                });

                var x, y;
                for (x = 0; x < 3; x += 1)
                {
                    for (y = 0; y < 3; y += 1)
                    {
                        var destRectangle = [boardOffsetX + (boardSizeX / 3) * x,
                                             boardOffsetY + (boardSizeY / 3) * y,
                                             boardOffsetX + (boardSizeX / 3) * (x + 1),
                                             boardOffsetY + (boardSizeY / 3) * (y + 1)];
                        var pieceTexture = getPieceTexture(currentGame.boardState[x + y * 3]);
                        if (pieceTexture)
                        {
                            draw2D.draw({
                                texture : pieceTexture,
                                destinationRectangle : destRectangle
                            });
                        }
                        if (setButtons)
                        {
                            var topLeft = draw2D.viewportUnmap(destRectangle[0],
                                                               destRectangle[1]);
                            var bottomRight = draw2D.viewportUnmap(destRectangle[2],
                                                                   destRectangle[3]);
                            SimpleButtonManager.addButton(
                                topLeft[0], topLeft[1],
                                bottomRight[0], bottomRight[1],
                                getOnClickFn(x, y));
                        }
                    }
                }

                offsetY = boardOffsetY + boardSizeY + textSpacingY * 2;
                for (usersIndex = 0; usersIndex < usersLength; usersIndex += 1)
                {
                    destRectangle = [0,
                                     offsetY,
                                     textSpacingY,
                                     offsetY + textSpacingY];
                    offsetY += textSpacingY;
                    var pieceTexture = getPieceTexture(currentGame.getPlayerPiece(users[usersIndex]));
                    if (pieceTexture)
                    {
                        draw2D.draw({
                            texture : pieceTexture,
                            destinationRectangle : destRectangle
                        });
                    }
                }

                draw2D.end();
            }
        }

        if (currentGame)
        {
            renderGame();
        }
        else
        {
            renderLobby();
        }

        graphicsDevice.endFrame();
    }

    var intervalID = 0;
    var stageWidth = 40;
    var stageHeight = 30;

    function loadingLoop()
    {
        if (font && fontShader &&
            userProfile &&
            dataShareManager &&
            gameNotificationsManager && gameNotificationsManager.ready &&
            numTextures === loadedResources)
        {
            fontTechnique = fontShader.getTechnique('font');
            fontTechniqueParameters = graphicsDevice.createTechniqueParameters({
                clipSpace : mathDevice.v4BuildZero(),
                alphaRef : 0.01,
                color : mathDevice.v4BuildOne()
            });

            draw2D = Draw2D.create({
                graphicsDevice : graphicsDevice
            });

            draw2D.configure({
                viewportRectangle : [0, 0, stageWidth, stageHeight],
                scaleMode : 'scale'
            });

            gameNotificationsManager.addNotificationListener('player-joined', playerJoinedFn);
            gameNotificationsManager.addNotificationListener('your-turn', yourTurnFn);
            gameNotificationsManager.addNotificationListener('forfeit', yourTurnFn);

            TurbulenzEngine.clearInterval(intervalID);
            intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);
        }
    }
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 100);

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        if (intervalID)
        {
            TurbulenzEngine.clearInterval(intervalID);
        }

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }
    };
};

class TicTacToeGame
{
    nought = 'O';
    cross = 'X';

    currentUsername: string;
    host: string;

    moves: { [id: string]: any; };
    boardState: string[];
    otherPlayer: string;
    currentPlayerTurn: bool;
    firstMove: string;
    roundEnd: {
        forfeit?: string;
        winner?: string;
        draw?: bool;
    };

    update(serializedGameState?: string)
    {
        if (serializedGameState)
        {
            var gameStateUpdate = JSON.parse(serializedGameState);
            this.moves = gameStateUpdate.moves;
            this.firstMove = gameStateUpdate.firstMove;
        }

        this.boardState = [];

        var that = this;
        function addPlayerMoves(playerMoves, piece)
        {
            var playerMovesLength = playerMoves.length;
            var playerMovesIndex;
            for (playerMovesIndex = 0; playerMovesIndex < playerMovesLength; playerMovesIndex += 1)
            {
                var playerMove = playerMoves[playerMovesIndex];
                if (playerMove === 'forfeit')
                {
                    that.roundEnd = {
                        forfeit: username
                    };
                }
                that.boardState[playerMove[0] + playerMove[1] * 3] = piece;
            }
        }

        var currentUsername = this.currentUsername;
        var moves = this.moves;

        var otherMovesLength = 0;
        var myMovesLength = 0;
        var username;
        for (username in moves)
        {
            if (moves.hasOwnProperty(username))
            {
                var playerMoves = moves[username];
                var playerPiece = this.getPlayerPiece(username);
                addPlayerMoves(playerMoves, playerPiece);
                if (this.checkPieceWin(playerPiece))
                {
                    this.roundEnd = {
                        winner: username
                    };
                }
                if (username === currentUsername)
                {
                    myMovesLength += playerMoves.length;
                }
                else
                {
                    otherMovesLength += playerMoves.length;
                }
            }
        }

        if (currentUsername === this.firstMove)
        {
            this.currentPlayerTurn = (myMovesLength === otherMovesLength);
        }
        else
        {
            this.currentPlayerTurn = (myMovesLength < otherMovesLength);
        }

        if (!this.roundEnd && myMovesLength + otherMovesLength === 9)
        {
            this.roundEnd = {
                draw: true
            };
        }
    };

    serialize(): string
    {
        return JSON.stringify({
                moves: this.moves,
                firstMove: this.firstMove
            });
    };

    getPlayerPiece(username: string): string
    {
        if (username === this.host)
        {
            return this.nought;
        }
        else
        {
            return this.cross;
        }
    };

    forfeit()
    {
        var moves = this.moves;
        var currentUser = this.currentUsername;
        if (!moves[currentUser])
        {
            moves[currentUser] = [];
        }
        moves[currentUser].push('forfeit');
    };

    checkPieceWin(piece: string): bool
    {
        var boardState = this.boardState;
        var x, y;
        for (x = 0; x < 3; x += 1)
        {
            if (boardState[x + 0] === piece &&
                boardState[x + 3] === piece &&
                boardState[x + 6] === piece)
            {
                return true;
            }
        }
        for (y = 0; y < 3; y += 1)
        {
            if (boardState[0 + y * 3] === piece &&
                boardState[1 + y * 3] === piece &&
                boardState[2 + y * 3] === piece)
            {
                return true;
            }
        }
        if (boardState[0] === piece &&
            boardState[4] === piece &&
            boardState[8] === piece)
        {
            return true;
        }
        if (boardState[2] === piece &&
            boardState[4] === piece &&
            boardState[6] === piece)
        {
            return true;
        }
        return false;
    };

    canMove(x: number, y: number): bool
    {
        return (!this.roundEnd &&
                this.boardState[x + y * 3] === undefined)
    };

    doMove(x: number, y: number): void
    {
        var moves = this.moves;
        var currentUsername = this.currentUsername;
        if (!moves[currentUsername])
        {
            moves[currentUsername] = [];
        }
        moves[currentUsername].push([x, y]);
        if (this.firstMove === null)
        {
            this.firstMove = currentUsername;
        }
    };

    playerJoined(username: string): void
    {
        var moves = this.moves;
        if (!moves[username])
        {
            moves[username] = [];
        }
    };

    getUsers(): string[]
    {
        var users = [this.currentUsername];
        var otherUser = this.getOtherUser();
        if (otherUser)
        {
            users.push(otherUser);
        }
        if (users.length < 2 && this.host !== this.currentUsername)
        {
            users.push(this.host);
        }
        return users;
    };

    getOtherUser(): string
    {
        var moves = this.moves;
        var users = [];
        var username;
        for (username in moves)
        {
            if (moves.hasOwnProperty(username) && username !== this.currentUsername)
            {
                return username;
            }
        }
        return null;
    };

    static create(username: string, host: string): TicTacToeGame
    {
        var ticTacToeGame;
        ticTacToeGame = new TicTacToeGame();

        ticTacToeGame.currentUsername = username;
        ticTacToeGame.host = host;

        ticTacToeGame.nought = 'O';
        ticTacToeGame.cross = 'X';

        ticTacToeGame.moves = {};
        ticTacToeGame.moves[username] = [];
        if (host !== username)
        {
            ticTacToeGame.moves[host] = [];
        }
        ticTacToeGame.boardState = [];
        ticTacToeGame.otherPlayer = null;
        ticTacToeGame.currentPlayerTurn = true;
        ticTacToeGame.firstMove = null;
        ticTacToeGame.roundEnd = null;

        return ticTacToeGame;
    };
}