import { HttpAssist, ServerRequest, sendJson, sendFile } from "../src/main.ts"

const app = new HttpAssist()

@app.add
class C {
    @app.route("/api/w/a",{method:["GET"]})
    async p(request:ServerRequest){

    }
    @app.route("/")
    async helloWorld(request:ServerRequest){
        console.log("w")
        return "Hello World"
    }
    @app.route("/api/",{method:["GET"]})
    async w(request:ServerRequest){
        console.log("eee")
        return await sendFile("F:\\img\\不自由が丘幻想.jpg")
    }
    @app.route("/api/w/",{method:["get","post"]})
    async e(request:ServerRequest){
        return sendJson([1,2,3])
    }
    @app.onReady()
    onr(){
        console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);
    }
}

@app.add
class P{
    @app.route("/a")
    w(){

    }
}

app.addFolder("../")
await app.load("test2")
await app.run("0.0.0.0",8000)