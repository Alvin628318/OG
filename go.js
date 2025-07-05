const language_switch = document.getElementById("language_switch");
language_switch.addEventListener("click", toggleLanguageList);
const language_list = document.getElementById("language_list");
language_list.style.visibility = "hidden";

window.addEventListener("resize", resizeText);
const sizescroll = document.getElementById("replay");
sizescroll.addEventListener("input", resize);
const grid = document.getElementById("grid");
const passButton = document.getElementById("pass");
const regretButton = document.getElementById("regret");
const scoreDiv = document.getElementById("score");
const viewButton = document.getElementById("view");
const uploadButton = document.getElementById("upload");
const downloadButton = document.getElementById("download");
const questionmark = document.getElementById("innerquestion");
const title = document.getElementById("nav_placeholder");
const info = document.getElementById("info");
const mainboard = document.getElementById("board");
const mainnn = document.querySelector("main");
viewButton.disabled = true;

let boardsize = 0;
let currentcolor = "black"; // "black" or "white"
let board = Array(19).fill().map(() => Array(19).fill(0));
let passCount = 0;
let inDeadRemoval = false;
let gameStarted = false;
let handicapCount = 0;
let handicapStonesPlaced = 0;
let gameEnded = false;
let skipSwitchTurn = false;
let regretted = false;

let boardHistory = []; //3D Array Board History containing every board position (Array of board 2D Arrays)
boardHistory[0] = structuredClone(board);
let move = 0;
let timesclicked = 0;

function addEventListenerForInnerQuestionsOneTwoAndThree() {
    if (device()) {
        document.getElementById("innerquestion3").addEventListener("click", () => {
            console.log("fuck");
            info.style.display = "block";
            info.addEventListener("click", () => {
                info.style.display = "none";
            }, { once: true });
        });
    }
    else {
        document.getElementById("innerquestion3").addEventListener("mouseenter", () => {
            info.style.display = "block";
        })
        document.getElementById("innerquestion3").addEventListener("mouseleave", () => {
            info.style.display = "none";
        })
    }

}

document.getElementById("innerquestion").addEventListener("click", () => {
    console.log("fuck");
    if (timesclicked % 2 == 0) {
        info.style.display = "block";
    }
    else {
        info.style.display = "none";
    }
    timesclicked++;
});
document.getElementById("innerquestion").addEventListener("mouseenter", () => {
    info.style.display = "block";
})
document.getElementById("innerquestion").addEventListener("mouseleave", () => {
    info.style.display = "none";
})

function questionColor() {
    if (!inDeadRemoval && !gameEnded) {
        title.innerHTML = '雙人線上圍棋-線上圍棋棋盤&nbsp;<img id="innerquestion" src="../question_mark.png" alt="question_mark">';
        document.documentElement.style.setProperty("--shadowColorR", "0");
        document.documentElement.style.setProperty("--shadowColorG", "136");
        document.documentElement.style.setProperty("--shadowColorB", "255");
        pretext.innerHTML = infoString1;
    }
    else if (inDeadRemoval && !gameEnded) {
        title.innerHTML = '雙人線上圍棋-線上圍棋棋盤&nbsp;<img id="innerquestion" src="../question_mark_1.png" alt="question_mark">';
        document.documentElement.style.setProperty("--shadowColorR", "0");
        document.documentElement.style.setProperty("--shadowColorG", "154");
        document.documentElement.style.setProperty("--shadowColorB", "34");
        pretext.innerHTML = infoString2;
    }
    else {
        title.innerHTML = '雙人線上圍棋-線上圍棋棋盤&nbsp;<img id="innerquestion" src="../question_mark_2.png" alt="question_mark">';
        document.documentElement.style.setProperty("--shadowColorR", "255");
        document.documentElement.style.setProperty("--shadowColorG", "14");
        document.documentElement.style.setProperty("--shadowColorB", "14");
        pretext.innerHTML = infoString3;
    }
    document.getElementById("innerquestion").addEventListener("click", () => {
        if (timesclicked % 2 == 0) {
            info.style.display = "block";
        }
        else {
            info.style.display = "none";
        }
        timesclicked++;
    });
    document.getElementById("innerquestion").addEventListener("mouseenter", () => {
        info.style.display = "block";
    })
    document.getElementById("innerquestion").addEventListener("mouseleave", () => {
        info.style.display = "none";
    })
}


uploadButton.addEventListener("click", () => {
    if (gameEnded) {
        window.open("replay.html?gameEnded=true&upload=true&download=false", "_blank");
    }
    else {
        window.open("replay.html?gameEnded=false&upload=true&download=false", "_blank");
    }
})
downloadButton.addEventListener("click", () => {
    if (gameEnded) {
        window.open("replay.html?gameEnded=true&upload=false&download=true", "_blank");
    }
    else {
        window.open("replay.html?gameEnded=false&upload=false&download=true", "_blank");
    }
})

viewButton.addEventListener("click", () => {
    // Send moveHistory data to replay.html

    let gameData = {
        boardHistory: boardHistory,
        id: `Time: ${Date()}`,
        moves: move,
        gameEnded: gameEnded,
        upload: false,
        download: false
    };
    let gameJSON = JSON.stringify(gameData);
    sessionStorage.setItem("SgameData", gameJSON);
    console.log(gameData);
    if (gameEnded) {
        window.open("replay.html?gameEnded=true&upload=false&download=false", "_blank");
    }
    else {
        window.open("replay.html?gameEnded=false&upload=false&download=false", "_blank");
    }
});
const handicapButton = document.getElementById("handicap");
const count = 0;
handicapButton.addEventListener("click", () => {
    if (!gameStarted) {
        tpmorp("請輸入黑棋讓子數: ");
    }
});
const alerttext = document.getElementById("alert");
function trela(text) {
    document.documentElement.style.setProperty("--adjust", 0.85);
    alerttext.innerHTML = text;
    alertbox.style.display = "flex";
    viewButton.disabled = true;
    uploadButton.disabled = true;
    downloadButton.disabled = true;
    regretButton.disabled = true;
    alertbox.addEventListener("click", stopdisplay);
}
function stopdisplay() {
    if (true) {
        alertbox.style.display = "none";
        alerttext.innerHTML = "";
        alertbox.removeEventListener("click", stopdisplay);
    }
    if (gameEnded) {
        viewButton.disabled = false;
        uploadButton.disabled = false;
        downloadButton.disabled = false;
    }
    regretButton.disabled = false;
}
function isInteger(a) {
    for (let i = 2; i <= 50; i++) {
        if (a == i) {
            return true;
        }
    }
    return false;
}
function tpmorp(text) {
    alertbox.style.display = "flex";
    document.documentElement.style.setProperty("--adjust", 1);
    viewButton.disabled = true;
    uploadButton.disabled = true;
    downloadButton.disabled = true;
    alerttext.innerHTML = `<div id="tpmorptext">${text}</div>` + `<input id="tpmorpinput" type="number" min="2" max="50" step="1"></input><input id="submithandicap" type="submit"></input>`;
    document.getElementById("tpmorpinput").focus();
    document.getElementById("submithandicap").addEventListener("click", () => {
        let count = parseInt(document.getElementById("tpmorpinput").value);
        if (isInteger(count)) {
            handicapCount = count;
        }
        else {
            return;
        }
        alertbox.style.display = "none";
        alerttext.innerHTML = "";
        colordisplay.textContent = `黑棋讓${handicapCount}子`;
        handicapButton.disabled = true;
        viewButton.disabled = false;
        uploadButton.disabled = false;
        downloadButton.disabled = false;
    });
}
function toggleLanguageList() {
    language_list.style.visibility = language_list.style.visibility === "hidden" ? "visible" : "hidden";
}
let pxratio = 0;
pxratio = Math.min(window.innerHeight, window.innerWidth) / 732;
pxratio = Math.round(pxratio * 10000) / 10000;
document.documentElement.style.setProperty(`--pxratio`, `${pxratio}px`);
function resizeText() {
    for (let i = 0; i < 20; i++) {
        pxratio = Math.min(window.innerHeight, window.innerWidth) / 732;
        pxratio = Math.round(pxratio * 10000) / 10000;
        document.documentElement.style.setProperty(`--pxratio`, `${pxratio}px`);
        resize();
    }
}

const style = document.createElement("style");
document.head.appendChild(style);
const style2 = document.createElement("style");
document.head.appendChild(style);

function resize() {
    boardsize = Math.min(window.innerHeight, window.innerWidth) * parseInt(sizescroll.value) / 33;
    document.documentElement.style.setProperty("-windowheight", `${window.innerHeight}px`);
    document.documentElement.style.setProperty("--boardsize", `${boardsize}px`);
    if (device()) {
        section1.style.height = `${(max(document.documentElement.scrollHeight, window.innerHeight, false) - mainboard.offsetHeight) / 2.1}px`;
        section1.style.marginBottom = "5vh";
        section1.style.width = `${max(grid.offsetWidth, window.innerWidth, true)}px`;
        section2.style.height = `${(max(document.documentElement.scrollHeight, window.innerHeight, false) - mainboard.offsetHeight) / 2.1}px`;
        section2.style.width = `${max(grid.offsetWidth, window.innerWidth, true)}px`;
        let mobile = section2.offsetHeight + window.innerHeight * 5 / 100;
        document.documentElement.style.setProperty("--mobile", `${mobile}px`);
        style.innerHTML = `
        #Blank_Go_board {
        aspect-ratio: 1/1;
        width: var(--boardsize);
        padding: 0;
        border: 0;
        margin: 0;
        position: absolute;
        top: calc(var(--boardsize) * -0.005);
        `;
    }
    else {
        section1.style.width = `${(document.documentElement.scrollWidth - mainboard.offsetWidth) / 2.1}px`;
        section1.style.height = `${max(grid.offsetHeight, window.innerHeight * 84 / 100, false)}px`;
        section1.style.bottom = `${(mainnn.offsetHeight - section2.offsetHeight) / 2}px`;
        section2.style.width = `${(document.documentElement.scrollWidth - mainboard.offsetWidth) / 2.1}px`;
        section2.style.height = `${max(grid.offsetHeight, window.innerHeight * 84 / 100,)}px`;
        section2.style.bottom = `${(mainnn.offsetHeight - section2.offsetHeight) / 2}px`;
        style.innerHTML = `
        #Blank_Go_board {
        aspect-ratio: 1/1;
        width: var(--boardsize);
        padding: 0;
        border: 0;
        margin: 0;
        position: absolute;
        top: calc(var(--boardsize) * -0.005);
        }
        `;
    }
    if (gameEnded) {
        const icon2 = document.getElementById("innerquestion2");
        icon2.style.width = `${0.06 * boardsize}px`;
        icon2.style.height = `${0.06 * boardsize}px`;
    }
}

function max(a, b, c) {
    if (a < b) {
        if (c) {
            return b;
        }
        else {
            return a;
        }
    }
    else {
        if (c) {
            return a;
        }
        else {
            return b;
        }
    }
}

function getNeighbors(row, col) {
    const neighbors = [];
    if (row > 0) neighbors.push([row - 1, col]);
    if (row < 18) neighbors.push([row + 1, col]);
    if (col > 0) neighbors.push([row, col - 1]);
    if (col < 18) neighbors.push([row, col + 1]);
    return neighbors;
}

function getGroupAndLiberties(row, col, color) {
    const stack = [[row, col]];
    const visited = new Set();
    const group = [];
    const liberties = new Set();
    const key = (r, c) => `${r},${c}`;

    while (stack.length) {
        const [r, c] = stack.pop();
        if (visited.has(key(r, c))) continue;
        visited.add(key(r, c));
        group.push([r, c]);

        for (const [nr, nc] of getNeighbors(r, c)) {
            if (board[nr][nc] === 0) {
                liberties.add(key(nr, nc));
            } else if (board[nr][nc] === color && !visited.has(key(nr, nc))) {
                stack.push([nr, nc]);
            }
        }
    }

    return { group, liberties };
}

function removeGroup(group) {
    for (const [r, c] of group) {
        board[r][c] = 0;
        const cell = document.getElementById(`${r},${c}`);
        cell.className = "empty";
    }
}

function setupgrid() {
    for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 19; x++) {
            const cell = document.createElement("div");
            cell.classList.add("empty");
            cell.id = `${y},${x}`;
            attachNormalClick(cell, y, x);
            grid.appendChild(cell);
        }
    }
}
function colortranslation(color) {
    if (color == "black") {
        return "白棋";
    }
    else {
        return "黑棋";
    }
}
const colordisplay = document.getElementById("currentcolor");
function attachNormalClick(cell, y, x) {
    cell.addEventListener("click", function () {
        if (gameEnded || inDeadRemoval) {
            return;
        }
        if (!gameStarted) {
            gameStarted = true;
            handicapButton.disabled = true;
        }
        if (board[y][x] !== 0) return;
        changeColor();
        const colorValue = currentcolor === "black" ? 1 : -1;
        const opponent = -colorValue;
        // Handicap placement phase
        if (handicapStonesPlaced < handicapCount - 1) {
            board[y][x] = 1;
            cell.classList.remove("empty");
            cell.classList.add("black");
            handicapStonesPlaced++;
            return;
        }
        else if (handicapStonesPlaced == handicapCount - 1) {
            currentcolor = "white"; // white to play after handicap stones
            move = 0;
            handicapStonesPlaced = 10000;
        }

        // Normal placement
        colordisplay.textContent = colortranslation(currentcolor);
        board[y][x] = colorValue;
        let capturedStones = [];
        for (const [nr, nc] of getNeighbors(y, x)) {
            if (board[nr][nc] === opponent) {
                const { group, liberties } = getGroupAndLiberties(nr, nc, opponent);
                if (liberties.size === 0) {
                    capturedStones.push(...group);
                    capturedgroup = group;
                    removeGroup(group);
                }
            }
        }
        const { liberties } = getGroupAndLiberties(y, x, colorValue);
        if (liberties.size === 0 && capturedStones.length === 0) {
            board[y][x] = 0;
            return;
        }

        // Only save if not placing handicap stones
        if (handicapStonesPlaced >= handicapCount) {
            regretButton.disabled = false;
            passButton.disabled = false;
        }
        if (!skipSwitchTurn) {
            changeColor();
        } else {
            skipSwitchTurn = false;
        }
        if (regretted) {
            regretted = false;
            changeColor();
        }
        if (passed) {
            passed = false;
            changeColor();
        }
        passCount = 0;
        move++;
        boardHistory[move] = structuredClone(board);
        if (move > 2) {
            if (areArraysEqual(boardHistory[move], boardHistory[move - 2])) {
                trela("熱子: 不可連續提相同位置的子，請再等一回合!");
                boardHistory.pop();
                move--;
                changeColor(true);
                board = structuredClone(boardHistory[move]);
                boardSync(board);
                findlastmove(boardHistory, move);
                return;
            }
        }
        boardSync(board);
        findlastmove(boardHistory, move);
        console.log(move);
    });
}
function areArraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (!Array.isArray(a[i]) || !Array.isArray(b[i])) return false;
        if (a[i].length !== b[i].length) return false;

        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j] !== b[i][j]) return false;
        }
    }

    return true;
}
passButton.addEventListener("click", () => {
    if (inDeadRemoval) {
        // Finish dead stone removal and calculate score
        endGameScoring();
        inDeadRemoval = false;
        passButton.textContent = "虛手/結束棋局";
        move++;
        console.log(move);
        boardHistory[move] = structuredClone(board);
    } else {
        passCount++;
        if (passCount >= 2) {
            inDeadRemoval = true;
            passButton.textContent = "結束移除死子模式";
            regretButton.textContent = "依原棋局繼續遊戲";
            colordisplay.textContent = "移除死子模式";
            trela(`<img id="innerquestion3" src="../question_mark_1.png" alt="question_mark">進入移除死子模式<br>請確實移除死子才可精確計算目數!`);
            addEventListenerForInnerQuestionsOneTwoAndThree();
            enableDeadStoneRemoval();
        } else {
            passed = true;
            move++;
            changeColor();
            boardHistory[move] = structuredClone(board);
            console.log(move);
            boardSync(board);
        }
    }
});
function gamecontinue() {
    gameEnded = false;
    boardHistory.pop();
    boardHistory.pop();
    move = move - 2;
    board = structuredClone(boardHistory[move]);
    boardSync(board);
    regretButton.textContent = "悔棋";
    document.getElementById("lefthalf").style.display = "none";
    document.getElementById("righthalf").style.display = "none";
    document.getElementById("score").style.display = "none";
    passButton.disabled = false;
    passCount = 0;
    changeColor();
}
function changeColor(reverse = false) {
    if (handicapStonesPlaced < handicapCount && handicapCount != 0) {
        if (handicapStonesPlaced == handicapCount) {
            return -2.1;
        }
        colordisplay.textContent = `黑棋再讓${handicapCount - handicapStonesPlaced - 1}子`;
        return -2;
    }
    if (move % 2 == 0) {
        currentcolor = "black";
        colordisplay.style.backgroundColor = "white";
        colordisplay.style.color = "black";
    }
    else {
        currentcolor = "white";
        colordisplay.style.backgroundColor = "black";
        colordisplay.style.color = "white";
    }
    if (regretted || passed) {
        let regretcolor = currentcolor;
        if (regretcolor == "black") {
            regretcolor = "white";
            colordisplay.style.backgroundColor = "black";
            colordisplay.style.color = "white";
        }
        else {
            regretcolor = "black";
            colordisplay.style.backgroundColor = "white";
            colordisplay.style.color = "black";
        }
        colordisplay.textContent = `換${colortranslation(regretcolor)}`;
        return -1;
    }
    if (reverse && currentcolor == "white") {
        currentcolor = "black";
        colordisplay.style.backgroundColor = "white";
        colordisplay.style.color = "black";
    }
    else if (reverse && currentcolor == "black") {
        currentcolor = "white";
        colordisplay.style.backgroundColor = "black";
        colordisplay.style.color = "white";
    }
    colordisplay.textContent = `換${colortranslation(currentcolor)}`;
}
regretButton.addEventListener("click", () => {
    if (gameEnded) {
        gamecontinue();
    }
    else if (inDeadRemoval) {
        board = structuredClone(boardHistory[move]);
        boardSync(board);
        move--;
        inDeadRemoval = false;
        passButton.textContent = "虛手/結束棋局";
        regretButton.textContent = "悔棋";
        passCount = 0;
        skipSwitchTurn = true;
        changeColor();
        disableDeadStoneRemoval();
    } else {
        // 🚨 Normal game move undo logic
        if (boardHistory.length < 1) return;
        if (move == 1) {
            regretButton.disabled = true;
            colordisplay.textContent = "換黑棋";
            colordisplay.style.backgroundColor = "black";
            colordisplay.style.color = "white";
        }
        regretted = true;
        board = structuredClone(boardHistory[move - 1]);
        boardHistory.pop();
        move--;
        boardSync(board);
        findlastmove(boardHistory, move);
        // Remove last move visually and from board
        // Let the same player move again
        changeColor();
        passCount = 0;

        // Disable regret if no more moves left
        skipSwitchTurn = true; // Prevent the next move from flipping turn again
    }
});
function boardSync(board) {
    for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 19; x++) {
            const changecell = document.getElementById(`${y},${x}`);
            changecell.classList.remove("black", "white", "empty");
            if (board[y][x] == 1) {
                changecell.classList.add("black");
            }
            else if (board[y][x] == 0) {
                changecell.classList.add("empty");
            }
            else {
                changecell.classList.add("white");
            }
        }
    }
}
function findlastmove(boardHistory, move) {
    while (areArraysEqual(boardHistory[move], boardHistory[move - 1])) {
        move--;
    }
    for (let row = 0; row < 19; row++) {
        for (let col = 0; col < 19; col++) {
            const changecell = document.getElementById(`${row},${col}`);
            changecell.classList.remove("shadowed");
        }
    }
    for (let row = 0; row < 19; row++) {
        for (let col = 0; col < 19; col++) {
            if (boardHistory[move - 1][row][col] == 0 && (boardHistory[move][row][col] == 1 || boardHistory[move][row][col] == -1)) {
                const changecell = document.getElementById(`${row},${col}`);
                changecell.classList.add("shadowed");
            }
        }
    }
}
let firsttime = Array(19).fill().map(() => Array(19).fill(true));
function enableDeadStoneRemoval() {
    for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 19; x++) {
            const oldCell = document.getElementById(`${y},${x}`);
            const newCell = oldCell.cloneNode(true);
            oldCell.replaceWith(newCell);
            firsttime[y][x] = true;
            newCell.addEventListener("click", removeStoneListener);
        }
    }
}

function disableDeadStoneRemoval() {
    for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 19; x++) {
            const oldCell = document.getElementById(`${y},${x}`);
            const newCell = oldCell.cloneNode(true);
            oldCell.replaceWith(newCell);
            attachNormalClick(newCell, y, x);
        }
    }
}
function removeStoneListener(event) {
    const cell = event.target;
    const [row, col] = cell.id.split(",").map(Number);
    if (board[row][col] === 1 && firsttime[row][col]) {
        board[row][col] = 0;
        cell.className = "empty";
    } else if (board[row][col] === -1) {
        board[row][col] = 0;
        cell.className = "empty";
    } else if (board[row][col] === 1 && !firsttime[row][col]) {
        board[row][col] = -1;
        cell.className = "white";
    } else if (board[row][col] === 0 && !firsttime[row][col]) {
        board[row][col] = 1;
        cell.className = "black";
    }
    firsttime[row][col] = false;
}

function getTerritoryOwner(row, col, visited) {
    const queue = [[row, col]];
    const territory = [];
    const ownerColors = new Set();
    const key = (r, c) => `${r},${c}`;

    while (queue.length) {
        const [r, c] = queue.pop();
        const k = key(r, c);
        if (visited.has(k)) continue;
        visited.add(k);
        territory.push([r, c]);

        for (const [nr, nc] of getNeighbors(r, c)) {
            if (board[nr][nc] === 0) {
                queue.push([nr, nc]);
            } else {
                ownerColors.add(board[nr][nc]);
            }
        }
    }

    if (ownerColors.size === 1) {
        return { owner: [...ownerColors][0], territory };
    }
    return { owner: 0, territory };
}

const info2 = document.getElementById("info2");

function endGameScoring() {
    let blackScore = 0;
    let whiteScore = 0;
    const visited = new Set();

    for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 19; x++) {
            if (board[y][x] === 1) blackScore++;
            else if (board[y][x] === -1) whiteScore++;
        }
    }

    for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 19; x++) {
            const k = `${y},${x}`;
            if (board[y][x] === 0 && !visited.has(k)) {
                const { owner, territory } = getTerritoryOwner(y, x, visited);
                if (owner === 1) blackScore += territory.length;
                else if (owner === -1) whiteScore += territory.length;
            }
        }
    }
    scoreDiv.innerHTML = `黑&nbsp;${blackScore} - ${whiteScore}&nbsp;白<span id="komi">&nbsp;(+6.5)&nbsp;</span><img id="innerquestion2" src="../question_mark_2.png" alt="question_mark" style="z-index: 11;" tabindex="0">`;
    const icon = document.getElementById('innerquestion2');
    const tooltip = document.getElementById('info2');

    icon.addEventListener('mouseenter', () => {
        document.documentElement.style.setProperty("--minus", 0.15 * boardsize + "px");
        tooltip.innerHTML = info2String;
        tooltip.style.bottom = 0.4 * boardsize + "px";
        tooltip.style.display = 'block';
    });
    icon.addEventListener('click', () => {
        if (timesclicked2 % 2 == 0) {
            document.documentElement.style.setProperty("--minus", 0.15 * boardsize + "px");
            tooltip.innerHTML = info2String;
            tooltip.style.bottom = 0.4 * boardsize + "px";
            tooltip.style.display = 'block';
        }
        else {
            document.documentElement.style.setProperty("--minus", 0 * boardsize + "px");
            tooltip.style.display = 'none';
        }
        timesclicked2++;
    });

    icon.addEventListener('mouseleave', () => {
        document.documentElement.style.setProperty("--minus", 0 * boardsize + "px");
        tooltip.style.display = 'none';
    });
    icon.style.width = `${0.06 * boardsize}px`;
    icon.style.height = `${0.06 * boardsize}px`;

    trela(`<img id="innerquestion3" src="../question_mark_2.png" alt="question_mark">遊戲已結束!<br>須確實完成收官與提死子才能正確地記算目數，<br>若尚未完成可以選擇繼續棋局!`);
    addEventListenerForInnerQuestionsOneTwoAndThree();
    gameEnded = true;
    regretButton.textContent = "繼續棋局";
    colordisplay.textContent = "棋局結束";
    disableDeadStoneRemoval();
    passButton.disabled = true;
    document.getElementById("lefthalf").style.display = "inline-block";
    document.getElementById("righthalf").style.display = "inline-block";
    document.getElementById("score").style.display = "flex";
}
let timesclicked2 = 0;
const restartButton = document.getElementById("restart");
restartButton.addEventListener("click", reset)
const alertbox = document.getElementById("alertbox");
function reset() {

    board = Array(19).fill().map(() => Array(19).fill(0));
    passCount = 0;
    currentcolor = "black";
    inDeadRemoval = false;
    gameStarted = false;
    handicapCount = 0;
    handicapStonesPlaced = 0;
    gameEnded = false;
    handicapButton.disabled = false;
    scoreDiv.textContent = "";
    regretButton.disabled = true;
    passButton.disabled = true;
    alertbox.style.display = "none";
    regretted = false;
    passed = false;
    boardHistory.length = 1;
    document.getElementById("lefthalf").style.display = "none";
    document.getElementById("righthalf").style.display = "none";
    document.getElementById("score").style.display = "none";
    regretButton.textContent = "悔棋";
    grid.innerHTML = "";
    setupgrid();
    boardHistory[0] = structuredClone(board);
    viewButton.disabled = false;
    colordisplay.textContent = "黑棋先";
    colordisplay.style.color = "white";
    colordisplay.style.backgroundColor = "black";
    move = 0;
    resizeText();
}

regretButton.disabled = true;
passButton.disabled = true;
const maininfo = document.getElementById("maininfo");
const section1 = document.getElementById("section1");
const section2 = document.getElementById("section2");
const main = document.querySelector("main");
function device() {
    if (window.innerWidth / window.innerHeight < 1) {
        console.log("Mobile view");
        main.style.flexDirection = "column";
        maininfo.style.flexDirection = "column";
        section1.style.display = "none";
        maininfo.style.overflow = "auto";
        return true;
    }
    else {
        console.log("Desktop view");
        main.style.flexDirection = "row";
        maininfo.style.flexDirection = "row";
        section1.style.display = "block";
        maininfo.style.overflow = "visible";
        return false;
    }
}

let original_width = window.innerWidth;
let original_height = window.innerHeight;
resize();
setupgrid();
function readSave() {
    let savedData = JSON.parse(localStorage.getItem("LgameData"));
    boardHistory = savedData.boardHistory;
    passCount = savedData.passCount;
    handicapCount = savedData.handicapCount;
    handicapStonesPlaced = savedData.handicapStonesPlaced;
    gameEnded = savedData.gameEnded;
    gameStarted = savedData.gameStarted;
    currentcolor = savedData.currentcolor;
    inDeadRemoval = savedData.inDeadRemoval;
    regretted = savedData.regretted;
    skipSwitchTurn = savedData.skipSwitchTurn;
    board = savedData.board;
    move = savedData.move;
    gameEnded = savedData.gameEnded;
    handicapButton.disabled = savedData.handicapD;
    regretButton.disabled = savedData.regretD;
    passButton.disabled = savedData.passD;
    boardsize = boardsize;
    boardSync(board);
}
function initializeSave() {
    let gameData = {
        boardHistory: boardHistory,
        passCount: passCount,
        handicapCount: handicapCount,
        handicapStonesPlaced: handicapStonesPlaced,
        gameEnded: gameEnded,
        gameStarted: gameStarted,
        currentcolor: currentcolor,
        inDeadRemoval: inDeadRemoval,
        regretted: regretted,
        skipSwitchTurn: skipSwitchTurn,
        board: board,
        move: move,
        gameEnded: gameEnded,
        handicapD: handicapButton.disabled,
        regretD: regretButton.disabled,
        passD: passButton.disabled,
        boardsize: boardsize
    };
    let gameJSON = JSON.stringify(gameData);
    localStorage.setItem("LgameData", gameJSON);
}
const start = performance.now();
reset();
const end = performance.now();
console.log(end - start);

let savedData = JSON.parse(localStorage.getItem("LgameData"));
if (savedData == null || true) {
    initializeSave();
}
else {
    readSave();
}
window.addEventListener("click", (e) => {
    let gameData = {
        boardHistory: boardHistory,
        passCount: passCount,
        handicapCount: handicapCount,
        handicapStonesPlaced: handicapStonesPlaced,
        gameEnded: gameEnded,
        gameStarted: gameStarted,
        currentcolor: currentcolor,
        inDeadRemoval: inDeadRemoval,
        regretted: regretted,
        skipSwitchTurn: skipSwitchTurn,
        board: board,
        move: move,
        gameEnded: gameEnded,
        handicapD: handicapButton.disabled,
        regretD: regretButton.disabled,
        passD: passButton.disabled,
        boardsize: boardsize
    };
    let gameJSON = JSON.stringify(gameData);
    localStorage.setItem("LgameData", gameJSON);
    questionColor();
});

const pretext = document.getElementById("pretext");

const infoString1 =
    `網站說明: 

現在處於 <span class="highlight backhigh blue"><b><<對弈階段>></b></span>:

依正常圍棋規則遊玩。

<b>虛手/結束棋局: </b>
虛手亦即放棄落子，而當雙方連續兩次虛手後，棋局結束，進入<span class="highlight green"><b>移除死子階段</b></span>。
注意: 若未確實完成收官，最終的目數計算很有可能不正確。
建議在收官完畢後再虛手。

<b>查看棋局回放: </b>
在棋局回放系統查看此棋局的回放。

<b>上傳棋局回放: </b>
在棋局回放系統上傳任意棋局的回放，並查看該棋局的回放。

<b>下載棋局回放: </b>
下載此棋局的回放，之後上傳此檔案就可以在棋局回放系統上查看此棋局的回放。

<span class="highlight big"><b>此網站有自動儲存功能，
可以安心關閉分頁後下次以相同瀏覽器再繼續棋局!</b></span>

`;

pretext.innerHTML = infoString1;

const infoString2 =
    `網站說明: 

現在處於 <span class="highlight backhigh green"><b><<移除死子階段>></b></span>:

點擊死子處移除死子。若不慎移除到錯誤的位置，可以透過重複點擊該位置修正。

<b>依原棋局繼續遊戲: </b>
取消所有在移除死子階段對棋盤的更動，繼續依原棋盤下棋，並回到<span class="highlight blue"><b>對弈階段</b></span>。

<b>結束移除死子階段: </b>
確認移除完所有死子以後，棋局正式結束，進入<span class="highlight red"><b>棋局結束階段</b></span>，並計算目數。
注意: 若未確實移除死子，最終的目數計算很有可能不正確。
建議移除死子完畢後再結束。

<b>查看棋局回放: </b>
在棋局回放系統查看此棋局的回放。

<b>上傳棋局回放: </b>
在棋局回放系統上傳任意棋局的回放，並查看該棋局的回放。

<b>下載棋局回放: </b>
下載此棋局的回放，之後上傳此檔案就可以在棋局回放系統上查看此棋局的回放。

<span class="highlight big"><b>此網站有自動儲存功能，
可以安心關閉分頁後下次以相同瀏覽器再繼續棋局!</b></span>

`;

const infoString3 =
    `網站說明: 

<span id="notkomirules1">現在處於 <span class="highlight backhigh red"><b><<棋局結束階段>></b></span>:</span>
<span id="komirules">
目數計算使用<b>數子法</b>，原始目數顯示於棋盤下方，可自行依規則不同貼目。
在常見的規則中，黑棋須貼給白棋<span class="numbers">6.5</span>目: 
則若黑棋原始目數贏白棋<span class="numbers">7</span>目以上，黑棋獲得勝利；反之，則白棋獲得勝利。
</span>
<span id="notkomirules2">
<b>繼續棋局: </b>
若未確實完成收官或移除死子，可以選擇繼續依原棋盤下棋，並回到<span class="highlight blue"><b>對弈階段</b></span>。

<b>查看棋局回放: </b>
在棋局回放系統查看此棋局的回放。

<b>上傳棋局回放: </b>
在棋局回放系統上傳任意棋局的回放，並查看該棋局的回放。

<b>下載棋局回放: </b>
下載此棋局的回放，之後上傳此檔案就可以在棋局回放系統上查看此棋局的回放。

<span class="highlight big"><b>此網站有自動儲存功能，
可以安心關閉分頁後下次以相同瀏覽器再繼續棋局!</b></span>
</span>`;

const info2String =
    `目數計算說明: 

目數計算使用<b>數子法</b>，原始目數顯示於棋盤下方，可自行依規則不同<b>貼目</b>。
<span class="highlight">在常見的規則中，黑棋須貼給白棋<span class="numbers green">6.5</span>目:</span> 
則若黑棋原始目數贏白棋<span class="numbers">7</span>目以上，黑棋獲得勝利；反之，則白棋獲得勝利。`

// continue to work on button tooltips (the question mark) to improve user experience.
// After fully explaining everything and setting up all my question marks,
// work on transmitting the ganeData
// and then work on the replay tab
// and then we are done

/* 6/29 notes
    1. Replace the alert() and prompt() with another <div id="alert"> that should show up at the middle of the board. 
    2. We should be done with all the layout on the main page once this is done as well. 
    We will work on the gameData and the autoSave system next. 
    3. Once that is done as well, we are done with everything on the main page. 
    Choose data to send over to the playback viewer (Session Storage). 
    4. Work on replayer. 
    5. Work on language localization. 
    6. You are done. 
*/