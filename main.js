let c = document.getElementById("myCanvas")
let ctx = c.getContext("2d")
c.width = 960;
c.height = 540; //some trial and error
const width = c.width
const height = c.height
const numMoveFrames = {idle:8, kick:7, punch:7, block:9, backward:6, forward:6}

function loadImage(imgsrc, callback){
    let newImage = document.createElement("img");
    newImage.onload = () => callback(newImage) 
    newImage.src = imgsrc
}

let imagePath = (move, n) =>{
    return 'images/' + move + '/' + n + '.png'
}

// load all images
function loadImages(loadedCallback){
    let loaded = 0;
    let images = {idle:[], kick:[], punch:[], block:[], forward:[], backward:[]};
    let totalFrames = 0;

    Object.keys(numMoveFrames).forEach(move => {
        //console.log(move)
        let numFrames = numMoveFrames[move]
        totalFrames += numFrames
        let nums = new Array(numFrames).fill(0).map((d, i) => d = i+1)  // cool way to populate an array - found on SO 
        
        console.log(nums)
        nums.forEach(frameNum => {
            imgsrc = imagePath(move, frameNum)
            loadImage(imgsrc, (img) =>{
                images[move][frameNum-1] = img
                loaded++;
                if(loaded === totalFrames){
                    loadedCallback(images)
                }
            })
        });
    })
}

/*
Using the first idle image to do a jump. I could possibly queue it up and handle it in animate() as well, separately. 
However, right now i just wanted to make sure it works.
*/
function jump(image){
    ctx.clearRect(0, 0, width, height)
    //ctx.drawImage(image, 100, 40, 300, 300)

    let nums = new Array(15).fill(0).map((d, i) => d = (20-i)*10)  // cool way to populate an array - found on SO 
    console.log(nums)

    nums.forEach((n, i) => {
        setTimeout(() =>{
            ctx.clearRect(0, 0, width, height)
            ctx.drawImage(image, 100, n, 300, 300)
        }, i*30)
    })
}

function animate(images, move, callback){
    setTimeout(callback, images[move].length * 100)
    images[move].forEach((image, index) => {
        setTimeout(() => {
            ctx.clearRect(0, 0, width, height)
            ctx.drawImage(image, 100, 240, 300, 300)
        }, index*100)
    });
}

loadImages((loadedImages) => {
    let moveQ = []

    let aux = () => {
        let selectedMove = "idle";

        if(moveQ.length > 0){
            selectedMove = moveQ.shift()
        }
        animate(loadedImages, selectedMove, aux)
    }
    aux();  
    document.getElementById("kick").onclick = () => {moveQ.push("kick")}
    document.getElementById("punch").onclick = () => {moveQ.push("punch")}
    document.getElementById("block").onclick = () => {moveQ.push("block")}
    document.getElementById("jump").onclick = () => {jump(loadedImages["idle"][0])}

    document.addEventListener("keyup", ev => {
        if (ev.key === "ArrowUp" || ev.key === "w"){
            moveQ.push("kick")
        }
        if (ev.key === "d" || ev.key === "ArrowRight"){
            moveQ.push("punch")
        }
        if (ev.key === " "){
            jump(loadedImages["idle"][0])
            console.log("jump")
        }
        if (ev.key === "ArrowDown" || ev.key === "s"){
            moveQ.push("block")
        }

    })
})

