import { Type } from "@angular/compiler";
import { Names } from "./Names";
import { OID } from "./Oid";

export class Book{
    _id:Array<OID>;
    name:string;
    writer:Array<String>;
    style:Array<String>;
    publisher:string;
    year:number;
    language:string;
    picture:string;
    number:number;
}