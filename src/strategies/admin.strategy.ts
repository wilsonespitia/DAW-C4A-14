import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AutentacionService} from '../services';


export class EstrategiaAdministrador implements AuthenticationStrategy{
  name: string = 'admin';

  constructor(
    @service(AutentacionService)
    public servicioAutenticacion: AutentacionService
  ){

  }

  async authenticate(request: Request): Promise<UserProfile | undefined>{
    let token = parseBearerToken(request);
    if(token){
      let datos = this.servicioAutenticacion.ValdidarTokenJWT(token);
      if(datos){
        let perfil: UserProfile = Object.assign({
          nombre: datos.data.nombre
        })
      }else{
        throw new HttpErrors[401]("El token no es valido")
      }
    }else{
      throw new HttpErrors[401]("No se incluido tolen en solicitud")
    }
  }
}
