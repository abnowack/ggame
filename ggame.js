/*
TODO
[ ] Spritesheet support
[ ] DisplayObject heirarchy
[ ] Animations
[ ] Tile based map generation
[ ] Collision testing
[ ] Physics
*/

export class Loader {
    constructor() {
        this.cache = new Map();
        this.promises = [];
    }

    image(name, url) {
        this.promises.push(new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve( this.cache.set(name, image) );
            image.onerror = () => reject(new Error("not loaded"));
    
            image.src = url;
        }));
    }

    json(name, url) {
        this.promises.push(new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", jsonname, true);
            xhr.responseType = "text";
            xhr.send();

            if (xhr.status === 200) {
                let file = JSON.parse(xhr.responseText);
                resolve( this.cache.set(url, name) );
            } else {
                reject(new Error('json failed'));
            }
        }));
    }

};

export class GGame {
    constructor(width = 256, height = 256, setup) {
        this.load = new Loader();
        this.cache = this.load.cache;
        this.canvas = this.make_canvas(width, height);

        // incorporate into a draw handler
        this.items = [];
    }

    make_canvas(width = 256, height = 256, border = "1px dashed black",
        background_color = "white") {
        
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.border = border;
        canvas.style.backgroundColor = background_color;
        document.body.appendChild(canvas);

        canvas.ctx = canvas.getContext("2d");

        return canvas;
    }

    init() {
        Promise.all(this.load.promises)
        .then((resolve) => this.setup())
        .catch((err) => console.error(err));

        this.input = {};
        this.input.keyUP = false;
        this.input.keyDOWN = false;
        this.input.keyLEFT = false;
        this.input.keyRIGHT = false;

        document.addEventListener("keydown", (e) => {
            if(e.keyCode == 39) {
                this.input.keyRIGHT = true;
            } 
            else if(e.keyCode == 37) {
                this.input.keyLEFT = true;
            } else if(e.keyCode == 40) {
                this.input.keyUP = true;
            } else if (e.keyCode == 38) {
                this.input.keyDOWN = true;
            }
        }, false); 

        document.addEventListener("keyup", (e) => {
            if(e.keyCode == 39) {
                this.input.keyRIGHT = false;
            } 
            else if(e.keyCode == 37) {
                this.input.keyLEFT = false;
            } else if (e.keyCode == 40) {
                this.input.keyUP = false;
            } else if (e.keyCode == 38) {
                this.input.keyDOWN = false;
            }
        }, false); 
    }

    play() {
        this.init();

        // game loop
        var gg = this;

        function loop() {
            requestAnimationFrame(loop);

            gg.draw();
            gg.update();
        }

        requestAnimationFrame(loop);
    }

};

export function ggame(width = 256, height = 256, setup) {
    return new GGame(width, height, setup);
}

export class Sprite {
    constructor(gg, x, y, name) {
        this.source = gg.cache.get(name);
        this.x = x;
        this.y = y;
        this.name = name;
    }

    render(ctx) {
        ctx.drawImage(this.source, this.x, this.y);
    }
}