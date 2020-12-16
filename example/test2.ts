import {HttpAssist} from "../src/main.ts"
import { cog } from "../src/Cog.ts"
@cog.add()
class E{
    @cog.route("/f/")
    w(){

    }
}

export default function(app:HttpAssist){
    app.addCog(new E())
}