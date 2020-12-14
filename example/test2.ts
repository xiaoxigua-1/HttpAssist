import {HttpAssist} from "../src/main.ts"

export default function(app:HttpAssist){
    @app.add
    class Test {
        @app.route("/e")
        async r(){
            return "Hello"
        }
    }
}