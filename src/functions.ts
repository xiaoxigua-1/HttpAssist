export function sendJson(x:any):string{
    return JSON.stringify(x)
}

export function sendFile(path:string){
    return Deno.readFile(path)
}