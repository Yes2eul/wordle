// const answer = "APPLE"; // 정답

let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "GAME OVER";
    div.style =
      "display: flex; justify-content: center; align-items: center; position:absolute; top:40vh, left:45vw; width:200px; height:200px; background-color:white;";
    document.body.appendChild(div);
  };

  const nextLine = () => {
    if (attempts === 6) {
      return gameover();
    }
    attempts += 1;
    index = 0;
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEenterKey = async () => {
    let correct = 0; // 맞은 갯수

    // 서버에 응답을 받아오는 코드
    const respond = await fetch("/answer"); // 응답
    const answer = await respond.json(); // 정답

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const input = block.innerText; // 입력한 글자
      const letter = answer[i]; // 정답 글자
      if (input === letter) {
        correct += 1;
        block.style.background = "#6AAA64";
      } else if (answer.includes(input)) {
        block.style.background = "#C9B458";
      } else {
        block.style.background = "#787C7E";
      }
      block.style.color = "white";
    }
    if (correct === 5) {
      gameover();
    } else {
      nextLine();
    }
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) {
      index = -1;
    }
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") {
      handleBackspace();
    } else if (index === 5) {
      if (event.key === "Enter") {
        handleEenterKey();
      } else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };
  const startTimer = () => {
    const start_time = new Date();

    function setTime() {
      const current_time = new Date();
      const stamp_time = new Date(current_time - start_time);
      const min = stamp_time.getMinutes().toString().padStart(2, "0");
      const sec = stamp_time.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${min}:${sec}`;
    }

    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown);
}

appStart();
