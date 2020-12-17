import { serve } from "https://deno.land/std@0.80.0/http/server.ts";
import * as path from "https://deno.land/std@0.80.0/path/mod.ts";
import getFiles from "https://deno.land/x/getfiles/mod.ts";
import { setting } from "./type/type.ts"
import { Log } from "./log.ts"
import { sendFile } from "./functions.ts"
export  { ServerRequest } from "https://deno.land/std@0.80.0/http/server.ts";

export default class HttpAssist {
    private urllist:Array<any>
    private onReadyFun:Function
    private status:number

    constructor(){
        this.urllist=[]
        this.onReadyFun=function(){}
        this.status = 200
    }

    route(url:string,dict:setting = { method:["GET"] }){
        return (
            target:any,
            propertyKey: string,
            descriptor: PropertyDescriptor)=>{
                let g:any = {}
                if( url.endsWith("/")) url = url.slice(0,url.length - 1)
                g[url]=descriptor.value
                let method:Array<string> = []
                for(let i of dict.method){
                    method.push(i.toUpperCase())
                }
                g["method"] = method
                this.urllist.push(g)
                this.sort()
            }
    }

    setStatus(status:number){
        this.status = status
    }

    onReady(){
        return (target:any,
                propertyKey: string,
                descriptor: PropertyDescriptor)=>{
                    this.onReadyFun=descriptor.value
        }
    }

    async run(hostname:string,port:number){
        if((hostname || port) !== undefined){
            const server = serve({ "hostname": hostname, "port": port });
            this.onReadyFun()
            
            for await (const request of server) {
                
                let p = request.url.split("?")[0]
                let l = 0
                let st:number = 200
                if(p.endsWith("/")) p = p.slice(0,p.length - 1)
                
                for(let i of this.urllist){
                    if(p === Object.keys(i)[0]){
                        l++
                        if(! i.method.includes(request.method)){
                            request.respond({status: 404, body: "<h1>404</h1>"})
                            break
                        }
                        let response
                        try{
                            response = await i[p](request)
                            if(response === undefined) throw Error("Not return value")
                            if(!["string","object"].includes(typeof(response))) throw Error("Return not string or object")
                            request.respond({status: this.status, body:response})
                            st = this.status
                            this.status = 200
                        }catch(error){
                            request.respond({status: 503, body: "<h1>503</h1>"})
                            Log.error(error)
                            st = 503
                        }
                        break
                    }
                }
                if(!l){
                    request.respond({status: 404, body:"<h1>404</h1>"})
                    st = 404
                }
                
                Log.log(`<b>[${request.method}] [IP] <u>${request.headers.get("host")?.split(":")[0]}</u></b>`+
                `<b> [Status]</b>${st} <b>[URL]</b>${request.url}`)
            }
        }
    }

    private sort(){
        for(let i = 0;i < this.urllist.length;i++){
            for(let j = 0;j < i ;j++){
                if(Object.keys(this.urllist[j])[0].split("/").length < Object.keys(this.urllist[j+1])[0].split("/").length){
                    let l = this.urllist[j]
                    this.urllist[j] = this.urllist[j+1]
                    this.urllist[j+1] = l
                }
            }
        }
    }

    add<T extends { new (...args: any[]): {} }>(
        constructor: T
        ) {
        new constructor()
        return class extends constructor {
        }
    }

    async load(path1:string){
        let x = `file:///${path.join(Deno.cwd().split("\\").join("/"),path1)}.ts`;
        (await import(x)).default(this)
    }

    addCog(cls:any){
        this.urllist = this.urllist.concat(cls.retroute())
        this.sort()
    }

    addFolder(path1:string){
        let p = (path1.split(/[\/\\]/g)).join("/")
        let files = getFiles(p)
        for(let i = 0;i < files.length;i++){
            let file = files[i].path.split(p)[1]
            if(! file.startsWith("/")) file = "/" + file
            let url:any = {}
            url[file] =async function(){
                return sendFile(files[i].path)
            }
        }
    }
}

