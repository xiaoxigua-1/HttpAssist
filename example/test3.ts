import * as ink from 'https://deno.land/x/ink/mod.ts'
class Log{
    constructor(){

    }

    static error(text:string){
        ink.terminal.log('<b><red>[Error]</red></b>',`<red>${text}</red>`)
    }
    
    static log(text:string){
        ink.terminal.log('<b><blue>[Error]</blue></b>',`<blue>${text}</blue>`)
    }
}
Log.log("")