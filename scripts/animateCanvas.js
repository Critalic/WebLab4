export default class Work{

    constructor(parent, output, data) {
        this.parent = parent
        this.output = output
        this.data = data
        this.iter = 0
    }

    _iniObject(){
        const controls = document.createElement("div")
        controls.className = "controls"
        const status = document.createElement("span")
        status.innerHTML = this.data.begin
        this.status = status
        const start = document.createElement("button")
        const close = document.createElement("button")
        const stop = document.createElement("button")
        const reload = document.createElement("button")
        this.close = close
        close.innerHTML = this.data.close
        start.innerHTML = this.data.start
        stop.innerHTML = this.data.stop
        reload.innerHTML = this.data.reload
        controls.append(status,start,stop,reload,close)        
        this.start = start
        this.stop = stop
        this.reload = reload
        const work =  document.createElement("div")
        work.addEventListener("click", (e) => e.stopPropagation())
        work.className = "work"
        const canvas = document.createElement("canvas")
        canvas.className = "canvas"
        this.canvas = canvas
        const circle1 = canvas.getContext("2d")
        const circle2 = canvas.getContext("2d")
        work.append(controls,canvas)
        this.circle1 = circle1
        this.circle2 = circle2
        return work
    }

    mount(){
        this.parent.appendChild(this._iniObject())
        this.canvas.width = this.canvas.scrollWidth
        this.canvas.height = this.canvas.scrollHeight
        this.x = [this.canvas.scrollWidth / 2, 0]
        this.deg = [Math.random()*5 + 5, Math.random()*5 + 5]
        this.y = [0,this.canvas.scrollHeight / 2]
        this.direction = [[],[]]
        this.direction[0].push(Math.random() > 0.5 ? 1 : -1)
        this.direction[0].push(1)
        this.direction[1].push(-1)
        this.direction[1].push(Math.random() > 0.5 ? 1 : -1)
        this.start.addEventListener("click", this._start)
        this.stop.addEventListener("click", this._stop)
        this.reload.addEventListener("click", this._reload)
        this.close.addEventListener("click", () => {
            this._unmount()
        })
        window.addEventListener("resize", () => {
            this.canvas.width = this.parent.width
        })
        localStorage.setItem("record","")
        this.start.style.display = "inline-block"
        
    }

    _setStatus(title) {
        this.status.innerHTML = title
        const date = new Date()
        let record = `${title}=>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n`
        localStorage.setItem("record", localStorage.getItem("record") + record)
    }

    _unmount() {
        clearInterval(this.anim)
        this.parent.removeChild(this.parent.querySelector(".work"))
        const span = document.createElement("span")
        span.className = "Record"
        span.innerHTML = localStorage.getItem("record")
        this.output.appendChild(span)
    }

    _start = (e) => {
        this._beginAnim()
        this.canvas.opacity = 1
        this.start.style.display = "none"
        this.stop.style.display = "inline-block"
        this._setStatus(this.data.start)
    }

    _beginAnim() {
        this.anim = setInterval(this._action, 1000/this.data.speed)
    }

    _action = () => {
        this.canvas.width = this.canvas.scrollWidth
        this.canvas.height = this.canvas.scrollHeight
        this.circle1.clearRect(0, 0 ,this.canvas.width + 10, this.canvas.height + 10)
        this.circle1.fillStyle = "yellow"
        this.circle1.beginPath()
        this.circle1.arc(this.x[0], this.y[0], 10, 0, 2*Math.PI)
        this.circle1.fill()
        this.circle2.fillStyle = "red"
        this.circle2.beginPath()
        this.circle2.arc(this.x[1], this.y[1], 25, 0, 2*Math.PI)
        this.circle1.fill()
        for(let i = 0; i <this.x.length; i++) {
            if(this.iter%2==1 && i == 1) {
                break
            }
            if(this.x[i] + 1 * this.deg[i] + 10 * (i+1.5) > this.canvas.width && this.direction[i][0] == 1) {
                this.y[i] += (this.canvas.width - this.x[i] - 10 * (i+1.5)) / this.deg[1] * this.direction[i][1] 
                this.x[i] = this.canvas.width-10*(i+1.5)
                this.direction[i][0] *= -1
                this._setStatus(this.data.right)
            } else if (this.x[i] - 1 * this.deg[i] + 10 * (i+1.5) < 0 && this.direction[i][0] == -1){
                this.y[i] += (this.x[i] - 10 * (i+1.5)) / this.deg[i] * this.direction[i][1] 
                this.x[i] = 10 * (i+1.5)
                this.direction[i][0] *= -1
                this._setStatus(this.data.left)
            } else if(this.y[i] + 10*(i+1.5) > this.canvas.height) {
                
                this.direction[i][1] = -1
                this.y[i] = this.canvas.height - 10 * (i+1.5)
                this._setStatus(this.data.bottom)
            } else if((this.y[i] - 10 * (i+1.5)) <= 0 && this.direction[i][1] == -1) {
                this.direction[i][1] = 1
                this.x[i] += this.deg[i] 
                this.y[i] = 10 * (i+1.5) + 1
                this._setStatus(this.data.top)
            }else {
                this.y[i]+=this.direction[i][1]
                this.x[i] += 1 * this.deg[i] * this.direction[i][0] 
            }
        }
        this.iter++ 
        
        if(10 + Math.pow((Math.pow((this.x[0] - this.x[1]), 2) + Math.pow((this.y[0] - this.y[1]), 2)), 0.5) <= 25) {
            clearInterval(this.anim)
            this.circle1.clearRect(0, 0 ,this.canvas.width + 10, this.canvas.height + 10)
            this.reload.style.display="inline-block"
            this.stop.style.display="none"
            this._setStatus(this.data.end)
        }
    }
    
    _stop = () => {
        this.start.style.display = "inline-block"
        this.stop.style.display = "none"
        this._setStatus(this.data.stop)
        clearInterval(this.anim)
    }

    _reload = () => {
        this.reload.style.display = "none"
        this.stop.style.display = "inline-block"
        this.x = [this.canvas.scrollWidth / 2, 0]
        this.deg = [Math.random()*5 + 5, Math.random()*5 + 5]
        this.y = [0,this.canvas.scrollHeight/2,0]
        this.direction = [[],[]]
        this.direction[0].push(Math.random() > 0.5 ? 1 : -1)
        this.direction[0].push(1)
        this.direction[1].push(-1)
        this.direction[1].push(Math.random() > 0.5 ? 1 : -1)
        this._setStatus(this.data.reload)
        this._beginAnim()
    }
}