let boardGame = function () {
  const pause = () => {
    const lang = navigator.language.substring(0, 2);
    
    document.querySelector('#exit-game').disabled = !paused;
    paused = !paused;

    if (lang == 'es')
      document.getElementById('pause-game').innerText = paused ? 'continuar' : 'pausar';
    else if (lang == 'en')
      document.getElementById('pause-game').innerText = paused ? 'continue' : 'pause';
    game.style.pointerEvents = paused ? 'none' : 'auto';
    game.style.filter = paused ? 'blur(20px)' : 'none';
  }

  const showGame = (show) => {
    winnerElement.style.display = 'none';
    document.getElementById('game').style.height = show ? 'auto' : window.innerHeight - 100 + 'px';
    document.getElementById('show-back').style.display = show ? 'flex' : 'none';
    game.style.display = show ? 'grid' : 'none';
    controls.style.display = show ? 'none' : 'block';
  }

  let paused = false;
  let min = seg = hrs = 0;

  const game = document.getElementById("board");
  const timeElement = document.getElementById('label_real_time');
  const winnerElement = document.getElementById('winner');
  const movmentsElement = document.getElementById('label_real_movments');
  const resetButtons = document.querySelectorAll('#controls button.btn');
  const controls = document.getElementById('controls');
  winnerElement.style.display = 'none';

  showGame(false);

  let numRows;
  let start;

  function restartTime() {
    let hrs = min = seg = 0;
    return setInterval(() => {
      if (!paused) {
        seg++;
        if (seg > 59) {
          min++;
          if (min > 59) {
            hrs++;
            min = 0;
          }
          seg = 0;
        }
      }
      timeElement.innerText = `${hrs.toString().padStart(2, 0)}:${min.toString().padStart(2, 0)}:${seg.toString().padStart(2, 0)}`;
    }, 1000);
  }

  function markCompleted(board) {

    let inc = 1;

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        let cell = document.getElementById(`${i}-${j}`);
        if (cell.textContent == inc++)
          cell.style.color = '#8e4545';
        else
          cell.style.color = 'rgb(104, 93, 93)';
      }
    }
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function reorderBoard(board) {
    let i = 0;
    let last, num;
    let maxReorder = Math.pow(numRows + (numRows >= 8 ? 0 : 2), 3);
    return new Promise(async (res) => {
      while (i < maxReorder) {

        await delay(4);
        last = findEmpty(board);

        if (i++ % 2) {
          do num = getRandom(numRows);
          while (num == last.i);
          tryMove(board, num, last.j);
        } else {
          do num = getRandom(numRows);
          while (num == last.j);
          tryMove(board, last.i, num, false);
        }
      }
      res(true);
    })
  }

  function checkWinner(board) {
    let seq = 1;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (i == board.length - 1 && j == board.length - 1 && board[i][j] == -1)
          return true;
        if (board[i][j] != seq++) return false;
      }
    }
  }

  function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  function swap(board, rowIndex, columIndex, replaceRowIndex, replaceColumIndex) {
    temp = board[rowIndex][columIndex];
    board[rowIndex][columIndex] = board[replaceRowIndex][replaceColumIndex];
    board[replaceRowIndex][replaceColumIndex] = temp;
  };

  function createSimpleBoard() {
    let board = Array.from(Array(numRows), () => new Array(numRows));
    let n = 1;
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numRows; j++)
        board[i][j] = n++;
    }
    board[numRows - 1][numRows - 1] = -1;
    return board;
  };

  function drawAndSwapBoard(boardElement, board) {

    resizeBoard(board);
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        let span = document.createElement("span");
        let rems = 0;

        switch (numRows) {
          case 2: rems = 6.5; break;
          case 3: rems = 5.5; break;
          case 4: rems = 3.5; break;
          case 5: rems = 2.7; break;
          case 6: rems = 2.2; break;
          case 7: rems = 1.8; break;
          case 8: rems = 1.4; break;
        }

        if (window.innerWidth > 799) rems++;

        span.style.fontSize = `${rems}rem`;

        span.id = `${i}-${j}`;
        span.classList.add("cell");
        span.textContent = board[i][j] != -1 ? board[i][j] : '';
        span.addEventListener('click', () => tryMove(board, i, j, true))
        boardElement.appendChild(span);
      }
    }
  };

  function resizeBoard(numbers) {
    let percent = '';
    for (let idx = numbers.length; idx > 0; idx--)
      percent += `${100 / numbers.length}% `;
    game.style.gridTemplateColumns = percent;
  }

  function tryMove(board, i, j, canWin) {

    const moveTo = canMove(board, i, j);
    if (moveTo) {

      if (canWin && board[i][j] != -1)
        incrementMovments();

      if (moveTo.i === i) {

        if (moveTo.j > j) {
          while (moveTo.j > j) {
            swapInDOM(`${i}-${moveTo.j - 1}`, `${i}-${moveTo.j}`, board[i][moveTo.j - 1]);
            swap(board, moveTo.i, moveTo.j, moveTo.i, --moveTo.j);
          }
        }

        else if (moveTo.j < j) {
          while (moveTo.j < j) {
            swapInDOM(`${i}-${moveTo.j + 1}`, `${i}-${moveTo.j}`, board[i][moveTo.j + 1]);
            swap(board, moveTo.i, moveTo.j, moveTo.i, ++moveTo.j);
          }
        }
      }

      else {
        if (moveTo.i > i) {
          while (moveTo.i > i) {
            swapInDOM(`${moveTo.i - 1}-${j}`, `${moveTo.i}-${j}`, board[moveTo.i - 1][j]);
            swap(board, moveTo.i, moveTo.j, --moveTo.i, moveTo.j);
          }
        }

        else if (moveTo.i < i) {
          while (moveTo.i < i) {
            swapInDOM(`${moveTo.i + 1}-${j}`, `${moveTo.i}-${j}`, board[moveTo.i + 1][j]);
            swap(board, moveTo.i, moveTo.j, ++moveTo.i, moveTo.j);
          }
        }
      }
    }

    markCompleted(board);
    if (canWin && checkWinner(board)) {
      clearInterval(start);
      winnerElement.style.display = 'block';
      document.querySelectorAll('.cell').forEach(cell => cell.style.pointerEvents = 'none');
      winnerElement.style.display = 'flex';
    }
  }

  function incrementMovments() {
    movmentsElement.innerText = parseInt(movmentsElement.innerText) + 1;
  }

  function swapInDOM(id1, id2, newN2) {
    document.getElementById(id1).textContent = '';
    document.getElementById(id1).style.backgroundColor = 'white';
    document.getElementById(id2).textContent = newN2;
    document.getElementById(id2).style.backgroundColor = '#f9e7d7';
  }

  function canMove(board, row, column) {
    let element = findEmpty(board);
    if (row === element.i) return { i: element.i, j: element.j };
    if (column === element.j) return { i: element.i, j: element.j };;
  };

  function findEmpty(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] == -1)
          return { i, j };
      }
    }
  }

  const reset = async (rows) => {


    winnerElement.style.display = 'none';

    game.innerHTML = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
    resetButtons.forEach(btn => btn.setAttribute('disabled', true));
    timeElement.innerText = '00:00:00';
    movmentsElement.innerText = '0';

    if (start)
      clearInterval(start);

    numRows = rows;
    let board = createSimpleBoard();
    if (window.innerWidth > 799)
      game.style.height = (window.innerHeight - 25) + 'px';
    else {
      document.getElementById('label_congra').style.fontSize = '2rem';
      game.style.height = (window.innerHeight - 200) + 'px';
      resetButtons.forEach(btn => btn.style.fontSize = '2.1rem');
    }

    showGame(true);
    drawAndSwapBoard(game, board);
    await reorderBoard(board);

    markCompleted(board);
    start = restartTime();
    resetButtons.forEach(btn => btn.removeAttribute('disabled'));
  }

  return { restart: reset, back: showGame, pause };

}();
