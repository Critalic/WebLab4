import animateCanvas from "./animateCanvas.js"
import animateDiv from "./animateDiv.js"

const output = document.querySelector(".controller")
const data = {
    begin: "Begin",
    start: "start",
    stop: "stop",
    reload: "reload",
    left: "left",
    right: "right",
    close: "close",
    end: "end",
    bottom:"bot",
    top:"top",
    speed: 100
}

const segment3 = document.querySelector(".middle-segment")

const work = new animateDiv(segment3, output,data)

document.querySelector(".Play").addEventListener("click", () => {
    if(segment3.querySelector(".work")!=null) {
        return
    } 
    if(output.querySelector("span")) {
        output.removeChild(output.querySelector("span"))
    }
    work.mount()
})

document.querySelector(".Save").addEventListener("click", () => {
    fetch('http://localhost:8080/api/edit', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    
    }).then(r => r.text()).then(r => console.log(r))
    console.log(JSON.stringify(data))
})