import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
//Ficheros llaves, busqueda local.
import {Llaves} from '../config/llaves';
import {Persona} from '../models';
import {PersonaRepository} from '../repositories';
const jwt = require ("jsonwebtoken")
const generador = require("password-generator");
const cryptoJS = require("crypto-js");

@injectable({scope: BindingScope.TRANSIENT})
export class AutentacionService {
  constructor(
    @repository(PersonaRepository)
    public personaRespository: PersonaRepository
  ) {}

  /*
   * Add service methods here
   */
  GenerarClave(){
    let clave = generador(8,false);
    return clave;
  }

  cifrarClave(clave:String){
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  IdentificarPersona(usuario:string, clave:string){
    try{
      let p = this.personaRespository.findOne({where:{correo:usuario, clave:clave}});
      if(p){
        return p;
      }
      return false;
    }catch{
      return false;
    }
  }

  GenerarTokenJWT(Persona:Persona){
    let token = jwt.sing({
      data:{
        id: Persona.id,
        correo: Persona.correo,
        nombre: Persona.nombres + " " + Persona.apellidos
      }
    },
    Llaves.claveJWT);
    return token;
  }

  ValdidarTokenJWT(token:string){
    try{
      let datos = jwt.verify(token,Llaves.claveJWT);
      return datos;
    }catch{
      return false;
    }
  }
}
