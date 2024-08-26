import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { AlmacenesService } from "src/app/demo/service/almacenes.service";
import { FunctionsService } from "src/app/demo/service/functions.service";
import { SolicitudTurnoService } from "src/app/demo/service/solicitudes-turno.service";
import { UsuarioService } from "src/app/demo/service/usuario.service";
import { EstadosDealleSolicitud } from "../../turnos/estados-turno.enum";

@Injectable()
export class PdfOrdenCargue {

    header:any = (turno:any)=> {
        console.log('header');
        return {
            margin: 8,
        columns: [
            {
              margin:[20,0,30,0],
                table: {
                    widths: [ '35%','35%','30%'],
                   
                    body: [
                      [
                        {
                          //Columna Logo
                          //margin:[0,8,0,0],
                          image:'Logo',
                          fit:[150,150],
                          alignment:'center'
                        },
                        //Columna titulo doc
                        {
                            margin:[0,10,0,0],
                            text:'ORDEN DE CARGUE '+turno,
                            fontSize:16,
                            alignment:'center'
                        },
                        //Columna contrl de version doc
                        [
                          
                          {
                            table: {
                              widths: [ '30%','70%'],
                              body: [
                                [{
                                    text:'Código:',
                                    alignment:'left',
                                    //fontSize:8,
                                    blod:true,
                                    color:'black'
                                  },
                                  { 
                                    text:'FOR-COM-002',
                                    alignment:'left',
                                    //fontSize:8,
                                    bold:false,
                                    color:'black'
                                  }
                                ],
                                
                                [ {
                                    text:'Versión:',
                                    alignment: 'left',
                                    //fontSize:8,
                                    bold: true,
                                    color:'black',
                                },
                                {
                                    text:'1.0',
                                    alignment:'left',
                                    //fontSize:8,
                                    bold:false,
                                    color:'black',
                                }
                                ],
                                [{
                                    text:'Fecha aprobación:',
                                    alignment: 'left',
                                    //fontSize:8,
                                    bold: true,
                                    color:'black',
                                },
                                {
                                    text:'06-02-2023', 
                                    alignment:'left',
                                    //fontSize:8,
                                    bold:false,
                                    color:'black',
                                }]
                              ]
                            },
                            alignment:'center',
                            fontSize:8,
                            //layout: 'noBorders',
                            //margin: [0,8,0,0],
                            layout: 'noBorders'
                          }
                        ],
                      ],
                      
                    ]
                },
               
            }
    
        ]
        }
    }

    permissions:any = {
        printing: 'highResolution', //'lowResolution'
        modifying: false,
        copying: false,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: true
    }
    content:any = (data:any)=>{
        console.log('content');
        //Armar detalle observaciones
        let detalleObservaciones:any[] = [];
        let bodyTableObservaciones:any[] = [];

        let headerTableObservaciones:any ={
            fila_0:{
                col1:{
                    text:'Observaciones',
                    alignment:'left',
                    fontSize:8,
                    blod:true,
                    color:"antiquewhite",
                    //fillColor:"green"
                }
            }
        }

        for (let key in headerTableObservaciones){
            if (headerTableObservaciones.hasOwnProperty(key)){
                let header = headerTableObservaciones[key];
                let row = new Array();
                row.push( header.col1 );
                row.push( header.col2 );
                row.push( header.col3 );
                row.push( header.col4 );
                row.push( header.col5 );
                row.push( header.col6 );
               
                bodyTableObservaciones.push(row);
            }
        }
        
        let rows =  data.observaciones;
        
        for (let key in rows){
            if (rows.hasOwnProperty(key)){
                let observacion = rows[key];
                let row = new Array();
        
                row.push(
                    {
                        text:observacion.observacion,
                        alignment:'left',
                        fontSize:8,
                        blod:false,
                    }
                );
        
               
        
                bodyTableObservaciones.push(row);
            
            }
        
        }
         
   
 
        //Armar el detalle de los productos
       let detalleProductos:any[] = [];
       let bodyTableProductos:any[] = [];
       let headerTableProductos:any ={
         fila_0:{
             col1:{
                 text:'CLIENTE',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             },
             col2:{
                 text:'PEDIDO DE VENTA',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             },
             col3:{
                text:'CODIGO MATERIAL',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:"antiquewhite",
                fillColor:"green"
            },
             col4:{
                 text:'PRODUCTO (Nombre específico/Grados)',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             },
             col5:{
                text:'ALMACEN',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:"antiquewhite",
                fillColor:"green"
            },
             col6:{
                text:'CANTIDAD SOLICITADA (TON)',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:"antiquewhite",
                fillColor:"green"
             },
             col7:{
                
                text:'LOTE',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:"antiquewhite",
                fillColor:"green"
             },
             col8:{
                text:'CANTIDAD (SACOS/BULTOS)',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:"antiquewhite",
                fillColor:"green"
            },
             col9:{
                 text:'TONELADAS METRICAS',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             } 
         }
       }
     
       for (let key in headerTableProductos){
         if (headerTableProductos.hasOwnProperty(key)){
             let header = headerTableProductos[key];
             let row = new Array();
             row.push( header.col1 );
             row.push( header.col2 );
             row.push( header.col3 );
             row.push( header.col4 );
             row.push( header.col5 );
             row.push( header.col6 );
             row.push( header.col7 );
             row.push( header.col8 );
             row.push( header.col9 );
             bodyTableProductos.push(row);
         }
       }
     
       rows =  data.productos;
     
       for (let key in rows){
         if (rows.hasOwnProperty(key)){
             let producto = rows[key];
             let row = new Array();
     
             row.push(
                 {
                     text:producto.cliente,
                     alignment:'center',
                     fontSize:8,
                     blod:false,
                 }
             );
     
             row.push(
             
                 {
                     text:producto.pedidonum,
                     alignment:'center',
                     fontSize:8,
                     blod:false,
                 },
                 
             );

             row.push(
                 
                {
                    text:producto.itemcode,
                    alignment:'center',
                    fontSize:8,
                    blod:false,
                }
            );
         
             row.push(
                 
                 {
                     text:producto.itemname,
                     alignment:'center',
                     fontSize:8,
                     blod:false,
                 }
             );

             row.push(
                 
                {
                    text:producto.bodega,
                    alignment:'center',
                    fontSize:8,
                    blod:false,
                }
            );

             row.push(
                 
                {
                    text:producto.cantidad,
                    alignment:'center',
                    fontSize:8,
                    blod:false,
                }
            );

         
             row.push(
                 
                 {
                     text:producto.lote,
                     alignment:'center',
                     fontSize:8,
                     blod:false,
                 }
             );
         
            
            row.push(
                 
                {
                    text:producto.bultos,
                    alignment:'center',
                    fontSize:8,
                    blod:false,
                }
            );
         
             row.push(
                 
                 {
                     text:producto.toneladas_metircas,
                     alignment:'center',
                     fontSize:8,
                     blod:false,
                 }
             );
     
             bodyTableProductos.push(row);
         
         }
     
       }
      
     
     
       
     
       
       return  [

             //Locacion

             {
                id:'table-locacion',
                table:{
                    widths: [ '70%','30%' ],
                    
                    body:[
                        [
                            {
                                table:{
                                    widths: [ '100%' ],
                                    body:[
                                        [
                                            {
                                                text:'Señores.',
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                            }
                                        ],
                                        [
                                            {
                                                text:'NITROFERT S.A.S.',
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                            }
                                        ],
                                        [
                                            {
                                                text:'NIT ',
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                            }
                                        ],
                                        [
                                            {
                                                text:'direccion de locacion',
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                            }
                                        ]
                                    ]
                                },
                                layout:'noBorders'
                            },
                            {
                                table:{
                                    widths: [ '40%','60%' ],
                                    body:[
                                        [
                                            {
                                                text:'CONSECUTIVO CONTROL',
                                                alignment:'center',
                                                fontSize:7,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                                            },
                                            {
                                                text:'SMN01',
                                                alignment:'left',
                                                fontSize:7,
                                                blod:true,
                                            }
                                            
                                        ],
                                        [
                                            {
                                                text:'PUESTO DE EXPEDICION',
                                                alignment:'center',
                                                fontSize:7,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                                            },
                                            {
                                                text:'SMN01 - SANTA MARTA NITROCARIBE',
                                                alignment:'left',
                                                fontSize:7,
                                                blod:true,
                                            }
                                            
                                        ],
                                        [
                                            {
                                                text:'No DOCUMENTO',
                                                alignment:'center',
                                                fontSize:7,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                                            },
                                            {
                                                text:'SMN01 - CODIGO',
                                                alignment:'left',
                                                fontSize:7,
                                                blod:true,
                                            }
                                            
                                        ],
                                        [
                                            {
                                                text:'HORA INGRESO',
                                                alignment:'center',
                                                fontSize:7,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                                            },
                                            {
                                                text:'2:00 p.m.',
                                                alignment:'left',
                                                fontSize:7,
                                                blod:true,
                                            }
                                            
                                        ],
                                       
                                    ]
                                }
                            }
                        ]
                    ]
                },
                layout:'noBorders',
                margin:[0,5,0,5],
            
             },
             //Header fecha solicitud y destinatario
             {
                 id:'table-fecha',
                 table:{
                     widths: [ '70%','30%' ],
                     
                     body:[
                         [
                             {
                                 table:{
                                     widths: [ '100%' ],
                                     body:[
                                         [
                                             {
                                                 text:'',
                                                 alignment:'left',
                                                 fontSize:8,
                                                 blod:true,
                                             }
                                         ],
                                         [
                                             {
                                                 text:'DESTINO DE CARGA',
                                                 alignment:'left',
                                                 fontSize:8,
                                                 blod:true,
                                             }
                                         ],
                                         [
                                             {
                                                 text:'',
                                                 alignment:'left',
                                                 fontSize:8,
                                                 blod:true,
                                             }
                                         ]
                                     ]
                                 },
                                 layout:'noBorders'
                             },
                             {
                                 table:{
                                     widths: [ '33%','33%','34%' ],
                                     body:[
                                         [
                                             {
                                                 text:'FECHA DE EMISION DE SOLICITUD DE CARGUE',
                                                 alignment:'center',
                                                 fontSize:8,
                                                 blod:true,
                                                 colSpan:3,
                                                 color:"antiquewhite",
                                                 fillColor:"green"
                                             },
                                             {},
                                             {}
                                         ],
                                         [
                                             {
                                                 text:'DIA',
                                                 alignment:'center',
                                                 fontSize:8,
                                                 blod:true,
                                                 color:"antiquewhite",
                                                 fillColor:"green"
                                                
                                             },
                                             {
                                                 text:'MES',
                                                 alignment:'center',
                                                 fontSize:8,
                                                 blod:true,
                                                 color:"antiquewhite",
                                                 fillColor:"green"
                                                
                                             },
                                             {
                                                 text:'AÑO',
                                                 alignment:'center',
                                                 fontSize:8,
                                                 blod:true,
                                                 color:"antiquewhite",
                                                 fillColor:"green"
                                                
                                             }
                                         ],
                                         [
                                             {
                                                 text:data.diaSolicitud,
                                                 alignment:'center',
                                                 fontSize:8,
                                                 blod:true
                                                
                                             },
                                             {
                                                 text:data.mesSolicitud,
                                                 alignment:'center',
                                                 fontSize:8,
                                                 blod:true
                                                
                                             },
                                             {
                                                 text:data.anioSolicitud,
                                                 alignment:'center',
                                                 fontSize:8,
                                                 blod:true
                                                
                                             }
                                         ]
                                     ]
                                 }
                             }
                         ]
                     ]
                 },
                 layout:'noBorders',
                 margin:[0,5,0,5],
             
             },
            
            
           
             //Tabla de información productos 2
             {
                 id:'table-info-productos',
                 table:{
                     widths: [ '15%','10%','10%','15%','10%','10%','10%','10%','10%' ],
                     body:bodyTableProductos
                 },
                 margin:[0,5,0,5],
             },
             {
                id:'table-info-tiempos',
                table:{
                    widths: [ '15%','10%','10%','15%','10%','10%','10%','10%','10%' ],
                    body:[
                        [
                            {
                                text:'INICIO DE CARGUE',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                            },
                            {
                                text:'',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                colSpan:2,
                            },
                            {},
                            
                            
                            {
                                text:'HORA FIN DE CARGUE',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                            },
                            {
                                text:'',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                colSpan:2,
                            },
                            {},
                            {
                                text:'TIEMPO DE CARGUE',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                            },
                            {
                                text:'',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                colSpan:2,
                            },
                            {}
                        ]
                    ]
                },
                margin:[0,5,0,5],
            },
             {
                id:'table-label-observaciones',
                table:{
                    widths: [ '100%' ],
                   
                    body:[
                        [
                            {
                                text:'Observaciones:',
                                alignment:'left',
                                fontSize:8,
                                blod:true,
                            }
                        ],
                       
                    ]
                },
                margin:[0,5,0,5],
                layout:'noBorders'
            },
            {
                id:'table-label-productos',
                table:{
                    widths: [ '100%' ],
                   
                    body:[
                        [
                            {
                                text:data.observacion,
                                alignment:'left',
                                fontSize:8,
                                //blod:true,
                            }
                        ],
                       
                    ]
                },
                margin:[0,5,0,5],
                layout:'noBorders'
            },
         ]
    }

    footer:any =(infoUsuario:any)=> {
        console.log('footer');
        return {
            
        margin: 8,
        columns: 
          [
            
            //Tabla del autorizador
            {
                margin:[20,0,30,0],
                // Tabla separador del autorizador
                table:{
                    widths: [ '100%' ],
                
                    body:[
                        [
                            {
                                text:'Autorizado por:',
                                alignment:'left',
                                fontSize:8,
                                blod:true,
                            }
                        ],
                        [
                            {
                                table:{
                                    widths: [ '25%','10%','20%','10%','15%','20%' ],
                                    body:[
                                        [
                                            {
                                                text:'NOMBRE DEL AUTORIZADOR',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                                            },
                                            {
                                                text:'No. IDENTIFICACION',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                    
                                            },
                                            {
                                                text:'CARGO',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                                            },
                                            {
                                                text:'CELULAR',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                    
                                            },
                                            {
                                                text:'EMAIL',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                    
                                            },
                                            {
                                                text:'FIRMA',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                    
                                            }
                                        ],
                                        [
                                            {
                                                text:infoUsuario.nombre,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [5, 5]
                                            },
                                            {
                                                text:infoUsuario.cedula,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [5, 5]
                                            },
                                            {
                                                text:infoUsuario.cargo,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [5, 5]
                                            },
                                            {
                                                text:infoUsuario.celular,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [5, 5]
                                            },
                                            {
                                                text:infoUsuario.email,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [5, 5]
                                            },
                                            {
                                                /*text:infoUsuario.firma,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,*/
                                                //image:'FirmaAutorizador',
                                                image:infoUsuario.firma,
                                                fit:[100,100],
                                                alignment:'center'
                                            }
                                        ],
                                        [
                                            {
                                                text:'Nota: Este documento debe contener la firma digital de la persona autorizada y debe estar diligenciado en su totalidad',
                                                alignment:'center',
                                                fontSize:8,
                                                italics: true,
                                                blod:true,
                                                colSpan:6,
                                            },{},{},{},{},{}
                                        ]
                                    ]
                                }
                            }
                        ]
                    
                    ]
                },
                
                layout:'noBorders',
                
            }
          ]
        }
    }

    images:any = {
        Logo: '',
        //FirmaAutorizador:''
    }


    constructor(private solicitudTurnoService:SolicitudTurnoService,
                private functionsService:FunctionsService,
                private almacenesService: AlmacenesService,
                private usuarioService:UsuarioService){}
    
    async generarPDF(data:any):Promise<void>{
        console.log('datakey',data.dataKey);
        let datakey = data.dataKey.split('-');
        let infoTurno$ = this.solicitudTurnoService.getTurnosByID(datakey[1]);
        let infoTurno = await lastValueFrom(infoTurno$);

        let locaciones$ = this.almacenesService.getLocaciones()
        let locaciones = await lastValueFrom(locaciones$);

        this.images.Logo = await this.functionsService.convertImagenLocalToBase64('assets/demo/images/logos/nitrofert.png');

        console.log('locaciones',locaciones);

        console.log('infoTurno',infoTurno);

        let filesAtach$ = this.functionsService.filesToBase64({id_relacion:infoTurno.solicitud.usuario.id,
                                                           proceso:'firma',
                                                           entidad:'usuario'});
        let filesAtachByEstadoHistorialTurno = await lastValueFrom(filesAtach$);

        console.log('filesAtachByEstadoHistorialTurno',filesAtachByEstadoHistorialTurno)

        if(filesAtachByEstadoHistorialTurno.length === 0){
            filesAtachByEstadoHistorialTurno.push(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAABYCAIAAAB3ZqVmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAADfSURBVHhe7dMxAQAwEAOh+jedzn8awANvwGUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVsC1fUBYOJv6tIhuAAAAAElFTkSuQmCC`)
        }
        
        
       // this.images.FirmaAutorizador = filesAtachByEstadoHistorialTurno[0];
       //console.log(filesAtachByEstadoHistorialTurno[0]);

        let nombreUsuario:string = infoTurno.solicitud.usuario.roles.filter((role: { nombre: string; })=>role.nombre==='CLIENTE LOGISTICA').length>0?infoTurno.solicitud.usuario.nombre_responsable:infoTurno.solicitud.usuario.nombrecompleto;       

        let telefonoUsuario:string = infoTurno.solicitud.usuario.roles.filter((role: { nombre: string; })=>role.nombre==='CLIENTE LOGISTICA').length>0?infoTurno.solicitud.usuario.telefono_responsable:infoTurno.solicitud.usuario.numerotelefonico;       

        let emailUsuario:string = infoTurno.solicitud.usuario.roles.filter((role: { nombre: string; })=>role.nombre==='CLIENTE LOGISTICA').length>0?infoTurno.solicitud.usuario.email_responsable:infoTurno.solicitud.usuario.email;       


        let infoUsuario: any = {
            nombre: nombreUsuario,
            cedula: infoTurno.solicitud.usuario.numeroid_responsable,
            cargo: infoTurno.solicitud.usuario.cargo_responsable,
            celular: telefonoUsuario,
            email: emailUsuario,
            firma: filesAtachByEstadoHistorialTurno[0]
        }
        console.log('infoUsuario',infoUsuario);



        let cliente: any = {
            nombre: infoTurno.solicitud.clientes.filter((cliente: { CardCode: any; })=>cliente.CardCode === datakey[datakey.length-1])[0].CardName,
            nit: infoTurno.solicitud.clientes.filter((cliente: { CardCode: any; })=>cliente.CardCode === datakey[datakey.length-1])[0].FederalTaxID,
            contacto: infoTurno.solicitud.clientes.filter((cliente: { CardCode: any; })=>cliente.CardCode === datakey[datakey.length-1])[0].nombre_contacto,
            contactotelefono: infoTurno.solicitud.clientes.filter((cliente: { CardCode: any; })=>cliente.CardCode === datakey[datakey.length-1])[0].telefono_contacto,
            contatoemail: infoTurno.solicitud.clientes.filter((cliente: { CardCode: any; })=>cliente.CardCode === datakey[datakey.length-1])[0].email_contacto
        }
        console.log('cliente',cliente);

        let comercial:any =  {
            nombre: infoTurno.detalle_solicitud_turnos_pedido.filter((pedido: { CardCode: any; })=>pedido.CardCode === datakey[datakey.length-1])[0].vendedor
        }
        console.log('comercial',comercial);

        let trasnportadora:any = {
            nombre: infoTurno.transportadora.nombre,
            nit: infoTurno.transportadora.nit
        }
        console.log('trasnportadora',trasnportadora);
        let vehiculo:any = {
            placa: infoTurno.vehiculo.placa
        }
        console.log('vehiculo',vehiculo);
        let conductor:any =  {
            nombre: infoTurno.conductor.nombre,
            cedula: infoTurno.conductor.cedula,
            telefono: infoTurno.conductor.numerocelular
        }
        console.log('conductor',conductor);

        let productos:any =  infoTurno.detalle_solicitud_turnos_pedido.filter((pedido: {cantidad: number; CardCode: any; itemcode:string })=>pedido.CardCode === datakey[datakey.length-1] && pedido.cantidad>0 && !pedido.itemcode.startsWith('SF')).map((linea: { pedidonum: any; itemcode: any; itemname: any; cantidad: any; municipioentrega: any; lugarentrega: any; cantidad_sacos:any;  CardName:any; lote_produccion:any; toneladas_metircas:any; bodega:any}) => {

           

            return {
              cliente: linea.CardName,
              pedidonum: linea.pedidonum,
              itemcode: linea.itemcode,
              itemname: linea.itemname,
              lote: linea.lote_produccion,
              cantidad: linea.cantidad,
              bultos:linea.cantidad_sacos==0?'':linea.cantidad_sacos,
              //destino: `${linea.municipioentrega} ${linea.lugarentrega}`,
              toneladas_metircas:linea.toneladas_metircas,
              bodega:linea.bodega
            }
        })
        console.log('productos',productos);

        let observacionesArray:any = infoTurno.observacion!=""?infoTurno.observacion.split(";"):[];
        
        let observaciones:any = observacionesArray.map((data:any)=>{
            return { observacion:data.trim() };
        })

        console.log('observaciones',observaciones);


        let dataPdf: any = {
            diaSolicitud: new Date(infoTurno.solicitud.createdAt).getDate(),
            mesSolicitud: new Date(infoTurno.solicitud.createdAt).getMonth() + 1,
            anioSolicitud: new Date(infoTurno.solicitud.createdAt).getFullYear(),
            cliente,
            comercial,
            trasnportadora,
            vehiculo,
            conductor,
            productos,
            observaciones,
            observacion:infoTurno.observacion
        }

        

        let pdfDefinition = {
            pageSize: 'LEGAL',
            pageOrientation: 'landscape',
            pageMargins: [40, 80, 40, 100],
            permissions:this.permissions,
            header:this.header(datakey[1]),
      
            content: this.content(dataPdf),
            footer: this.footer(infoUsuario),
            images:this.images
        }
        
        await this.functionsService.createPDF(pdfDefinition);

    }
     

}

