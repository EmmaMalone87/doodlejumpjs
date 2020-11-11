// this means this document will only load once all the html content has loaded - using as I have put the script file at top of html
document.addEventListener('DOMContentLoaded',()=>{


    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div') //just creating the div
    let doodlerLeftSpace = 50
    let startPoint = 150 
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId 
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0
    

    function createDoodler(){
        grid.appendChild(doodler) //adding the doodler to the grid
        doodler.classList.add('doodler') //grabbing doodler css to display on grid
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace +'px' //variable to move doodler left
        doodler.style.bottom = doodlerBottomSpace+'px'
    }
    
    class Platform{
        constructor(newPlatBottom){
            this.bottom = newPlatBottom
            //using random number generator to pick a number bewtween 0-315 for where on screen platform will appear.
            this.left = Math.random() * 315
            this.visual = document.createElement('div')
            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left+'px'
            visual.style.bottom = this.bottom+'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms(){
        for(let i= 0; i<platformCount; i++){
            let platGap = 600/ platformCount
            //using the for loop to increment the gap space 
            let newPlatBottom = 100 + i * platGap 
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform);
            console.log(platforms);
        }
    }

    function movePlatforms(){
        if(doodlerBottomSpace> 200){
            platforms.forEach(platform => {
                platform.bottom -=4
                let visual = platform.visual
                visual.style.bottom = platform.bottom +'px'

                if(platform.bottom <10){
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                      
                }
            })
        }
    }

    function jump(){
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function(){
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace +'px'
            if(doodlerBottomSpace > startPoint +200 ){
                fall()
            }
        },20)
    }

    function fall(){
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function(){
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if(doodlerBottomSpace <=0){
                gameOver()
            }
            platforms.forEach(platform=>{
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom +15) &&
                    ((doodlerLeftSpace +60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left +85)) &&
                    !isJumping
                ){
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                }
                 
            })
        },20)
    }

    function gameOver(){
        console.log('game over')
        isGameOver = true
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e){
        if(e.key ==="ArrowLeft"){
            moveLeft()
        }else if (e.key ==="ArrowRight"){
            moveRight()
        }else if (e.key ==="ArrowUp"){
            moveStraight()
        }
    }

    function moveLeft(){
        clearInterval(leftTimerId)
        if(isGoingRight){
           clearInterval(rightTimerId) 
           isGoingRight = false
        }
        isGoingLeft = true
        leftTimingId = setInterval( function(){
            if(doodlerLeftSpace >=0){
                doodlerLeftSpace -=5
                doodler.style.left = doodlerLeftSpace +'px'
            }else moveRight()
            
        },30)
    }

    function moveRight(){
        clearInterval(rightTimerId)
        if(isGoingRight){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function (){
            if(doodlerLeftSpace <=340){
                doodlerLeftSpace +=5
                doodler.style.left = doodlerLeftSpace +'px'
            }else moveLeft()
        },30)
    }

    function moveStraight(){
        isGoingRight = false
        isGoingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }


    function start(){

        if(!isGameOver){
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup',control)
        }  
    }

    //attach to buttom 
            start()   

})