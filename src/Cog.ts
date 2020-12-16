import { setting } from "./type/type.ts"
class Cog{
    coglist:any
    constructor(){
        this.coglist = {}
    }

    route(url:string,dict:setting = { method:["GET"] }){
        return (
            target:any,
            propertyKey: string,
            descriptor: PropertyDescriptor)=>{
                if(this.coglist[target.constructor.name] === undefined) this.coglist[target.constructor.name] = []
                let g:any = {}
                if( url.endsWith("/")) url = url.slice(0,url.length - 1)
                g[url]=descriptor.value
                let method:Array<string> = []
                for(let i of dict.method){
                    method.push(i.toUpperCase())
                }
                g["method"] = method
                this.coglist[target.constructor.name].push(g)
            }
    }
    add(){
        let x:Array<any>
        let y =this.coglist
        return function<T extends { new (...args: any[]): {} }>(cog: T) {

            if(y[cog.name] === undefined) x = []
            else x = y[cog.name]
            
            return class extends cog {
                route:Array<any>
                constructor(...args: any[]){
                    super(...args)
                    this.route = x
                }

                retroute(){
                    return this.route
                }
            }
        }
    }
}

export const cog = new Cog()