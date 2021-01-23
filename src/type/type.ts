
import { ServerRequest } from "https://deno.land/std@0.80.0/http/server.ts";
export interface setting{
    method : Array<string>
}


export interface routefun extends PropertyDescriptor{
    value?:(request: ServerRequest) => any
}