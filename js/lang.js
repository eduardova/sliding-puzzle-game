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
      title.innerText = 'Juego de puzzle';
      movments.innerText = 'movimientos: ';
      time.innerText = 'tiempo: ';
      for (let i = 2; i <= 8; i++)
      document.getElementById(`label_restart_${i}`).innerText = `iniciar (${i}x${i})`;
      break;
    }
    case 'en': {
      pause.innerText = 'pause';
      exit.innerText = 'back';
      congat.innerHTML = 'Congratulations!';
      title.innerText = 'sliding puzzle game';
      movments.innerText = 'movements: ';
      time.innerText = 'time: ';
      for (let i = 2; i <= 8; i++)
        document.getElementById(`label_restart_${i}`).innerText = `start (${i}x${i})`;
      break;
    }
  }
  
})();
