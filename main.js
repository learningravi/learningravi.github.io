let c = document.getElementById("myCanvas")
let ctx = c.getContext("2d")
const width = c.width
const height = c.height
const numMoveFrames = {idle:8, kick:7, punch:7}

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
    let images = {idle:[], kick:[], punch:[]};
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

function animate(images, move, callback){
    setTimeout(callback, images[move].length * 100)
    images[move].forEach((image, index) => {
        setTimeout(() => {
            ctx.clearRect(0, 0, width, height)
            ctx.drawImage(image, 0, 0, 500, 500)
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

    document.addEventListener("keyup", ev => {
        if (ev.key === "ArrowUp"){
            moveQ.push("kick")
        }
        if (ev.key === "ArrowRight"){
            moveQ.push("punch")
        }

    })

})

