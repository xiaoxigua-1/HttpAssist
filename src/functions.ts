export function sendJson(x:any):string{
    return JSON.stringify(x)
}

export function sendFile(path:string, data:any = null){
    if(data === null) return Deno.readFileSync(path)
    else{
        let file:string = Deno.readTextFileSync(path)
        for(let i of Object.keys(data)){
            file = file.replace((RegExp(`{(( )+)?${i}(()+)?}`)), data[i])
        }
    }
}

