!(function () {
  const lang = navigator.language.substr(0, 2);
  document.getElementsByTagName("html")[0].setAttribute("lang", lang);

  const pause = document.getElementById("pause-game");
  const exit = document.getElementById("exit-game");
  const title = document.getElementById("label_title");
  const movments = document.getElementById("label_movements");
  const time = document.getElementById("label_time");
  const congat = document.getElementById('label_congra');

  switch(lang){
    case 'es': {
      pause.innerText = 'pausar';
      exit.innerText = 'volver';
      congat.innerHTML = 'Felicidades!';
      title.innerText = 'Juego';
      movments.innerText = 'Movimientos';
      time.innerText = 'Tiempo';
      for (let i = 2; i <= 8; i++)
      document.getElementById(`label_restart_${i}`).innerText = `Reiniciar (${i}x${i})`;
      break;
    }
    case 'en': {
      pause.innerText = 'pause';
      exit.innerText = 'Back';
      congat.innerHTML = 'Congratulations!';
      title.innerText = 'Game';
      movments.innerText = 'Momvemts';
      time.innerText = 'Time';
      for (let i = 2; i <= 8; i++)
        document.getElementById(`label_restart_${i}`).innerText = `Restart (${i}x${i})`;
      break;
    }
  }
  
})();
