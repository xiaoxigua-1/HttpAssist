import * as ink from 'https://deno.land/x/ink/mod.ts'
export class Log{
    constructor(){

    }

    static error(text:string){
        ink.terminal.log('<b><red>[Error]</red></b>',`<red>${text}</red>`)
    }
    
    static log(text:string){
        ink.terminal.log(`<blue>${text}</blue>`)
    }
}