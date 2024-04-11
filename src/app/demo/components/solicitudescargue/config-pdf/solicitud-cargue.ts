import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { AlmacenesService } from "src/app/demo/service/almacenes.service";
import { FunctionsService } from "src/app/demo/service/functions.service";
import { SolicitudTurnoService } from "src/app/demo/service/solicitudes-turno.service";

export const  header = {
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
                        text:'ORDEN DE CARGUE',
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

export const permissions:any = {
    printing: 'highResolution', //'lowResolution'
    modifying: false,
    copying: false,
    annotating: true,
    fillingForms: true,
    contentAccessibility: true,
    documentAssembly: true
}

export const content:any = (data:any)=>{
 
   //Armar el detalle de los productos
  let detalleProductos:any[] = [];
  let bodyTableProductos:any[] = [];
  let headerTableProductos:any ={
    fila_0:{
        col1:{
            text:'LUGAR DE RETIRO DE MERCANCIA',
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
            text:'PRODUCTO (Nombre específico/Grados)',
            alignment:'center',
            fontSize:8,
            blod:true,
            color:"antiquewhite",
            fillColor:"green"
        },
        col4:{
            text:'PRESENTACIÓN / ESPECIFICACIONES',
            alignment:'center',
            fontSize:8,
            blod:true,
            color:"antiquewhite",
            fillColor:"green"
        },
        col5:{
            text:'CANTIDAD (TONELADAS)',
            alignment:'center',
            fontSize:8,
            blod:true,
            color:"antiquewhite",
            fillColor:"green"
        },
        col6:{
            text:'DESTINO DE MERCANCIA',
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
       
        bodyTableProductos.push(row);
    }
  }

  let rows =  data.productos;

  for (let key in rows){
    if (rows.hasOwnProperty(key)){
        let producto = rows[key];
        let row = new Array();

        row.push(
            {
                text:producto.locacion,
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
                text:producto.itemname,
                alignment:'center',
                fontSize:8,
                blod:false,
            }
        );
    
        row.push(
            
            {
                text:producto.presentacion,
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
                text:producto.destino,
                alignment:'center',
                fontSize:8,
                blod:false,
            }
        );

        bodyTableProductos.push(row);
    
    }

  }
 


  

  
  return  [
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
                                            text:'Oficina de despachos',
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
        //Tabla de información del cleinte
        {
            id:'table-info-cliente',
            table:{
                widths: [ '35%','10%','20%','15%','20%' ],
                body:[
                    [
                        {
                            text:'INFORMACION DEL CLIENTE',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            colSpan:2,
                            color:"antiquewhite",
                            fillColor:"green"
                        },
                        {},
                        {
                            text:'FUNCIONARIO DE CONTACTO',
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
                            text:'NOMBRE / RAZON SOCIAL',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"
                        },
                        {
                            text:'NIT',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"
                        },
                        {
                            text:'NOMBRE',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"
                        },
                        {
                            text:'TELEFONO / CELULAR',
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
                        }
                    ],
                    [
                        {
                            text:data.cliente.nombre,
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                        },
                        {
                            text:data.cliente.nit,
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                        },
                        {
                            text:data.cliente.contacto,
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                        },
                        {
                            text:data.cliente.contactotelefono,
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                        },
                        {
                            text:data.cliente.contactoemail,
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                        }
                    ]
                ]
            },
            margin:[0,5,0,5],
        },
        // Tabla de funcionario comercial
        {
            id:'table-info-comercial',
            table:{
                widths: [ '40%','60%' ],
               
                body:[
                    [
                        {
                            text:'NOMBRE DEL FUNCIONARIO COMERCIAL DE NITROFERT',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"
                        },
                        {
                            text:data.comercial.nombre,
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                        },
                    ],
                   
                ]
            },
            margin:[0,5,0,5],
        },
        // Tabla autorización
        {
            id:'table-label transportadora',
            table:{
                widths: [ '100%' ],
               
                body:[
                    [
                        {
                            text:'Autorizamos a entregar al:',
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
        //Tabla de información empresa transportadora, vehiculo y conductor
        {
            id:'table-info-transportadora',
            table:{
                widths: [ '25%','10%','10%','20%','15%','20%' ],
                body:[
                    [
                        {
                            text:'EMPRESA TRANSPORTADORA',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"
                        },
                        {
                            text:'NIT TRANSPORTADORA',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"

                        },
                        {
                            text:'PLACA VEHICULO',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"
                        },
                        {
                            text:'NOMBRE CONDUCTOR',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"

                        },
                        {
                            text:'CEDULA',
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

                        }
                    ],
                    [
                        {
                            text:data.trasnportadora.nombre,
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                        },
                        {
                            text:data.trasnportadora.nit,
                            alignment:'center',
                            fontSize:8,
                            blod:true,

                        },
                        {
                            text:data.vehiculo.placa,
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                        },
                        {
                            text:data.conductor.nombre,
                            alignment:'center',
                            fontSize:8,
                            blod:true,

                        },
                        {
                            text:data.conductor.cedula,
                            alignment:'center',
                            fontSize:8,
                            blod:true,

                        },
                        {
                            text:data.conductor.telefono,
                            alignment:'center',
                            fontSize:8,
                            blod:true,

                        }
                    ],
                ]
            },
            margin:[0,5,0,5],
        },
        // Tabla informacion productos
        {
            id:'table-label-productos',
            table:{
                widths: [ '100%' ],
               
                body:[
                    [
                        {
                            text:'Los siguientes productos:',
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
        //Tabla de información productos 2
        {
            id:'table-info-productos',
            table:{
                widths: [ '25%','10%','20%','10%','10%','25%' ],
                body:/*[
                    [
                        {
                            text:'LUGAR DE RETIRO DE MERCANCIA',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"
                        },
                        {
                            text:'PEDIDO DE VENTA',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"

                        },
                        {
                            text:'PRODUCTO (Nombre específico/Grados)',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"
                        },
                        {
                            text:'PRESENTACIÓN / ESPECIFICACIONES',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"

                        },
                        {
                            text:'CANTIDAD (TONELADAS)',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"

                        },
                        {
                            text:'DESTINO DE MERCANCIA',
                            alignment:'center',
                            fontSize:8,
                            blod:true,
                            color:"antiquewhite",
                            fillColor:"green"

                        }
                    ],
                    detalleProductos
                ]*/bodyTableProductos
            },
            margin:[0,5,0,5],
        },
    ]
}

export const footer:any =(infoUsuario:any)=> {
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
                                        },
                                        {
                                            text:infoUsuario.cedula,
                                            alignment:'center',
                                            fontSize:8,
                                            blod:true,
                                        },
                                        {
                                            text:infoUsuario.cargo,
                                            alignment:'center',
                                            fontSize:8,
                                            blod:true,
                                        },
                                        {
                                            text:infoUsuario.celular,
                                            alignment:'center',
                                            fontSize:8,
                                            blod:true,
                                        },
                                        {
                                            text:infoUsuario.email,
                                            alignment:'center',
                                            fontSize:8,
                                            blod:true,
                                        },
                                        {
                                            text:infoUsuario.firma,
                                            alignment:'center',
                                            fontSize:8,
                                            blod:true,
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


export const images:any = {
    Logo: ''
}

@Injectable()
export class PdfSolicitudCargue {

    header:any = {
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
                            text:'ORDEN DE CARGUE',
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
                 text:'LUGAR DE RETIRO DE MERCANCIA',
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
                 text:'PRODUCTO (Nombre específico/Grados)',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             },
             col4:{
                 text:'PRESENTACIÓN / ESPECIFICACIONES',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             },
             col5:{
                 text:'CANTIDAD (TONELADAS)',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             },
             col6:{
                 text:'DESTINO DE MERCANCIA',
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
                     text:producto.locacion,
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
                     text:producto.itemname,
                     alignment:'center',
                     fontSize:8,
                     blod:false,
                 }
             );
         
             row.push(
                 
                 {
                     text:producto.presentacion,
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
                     text:producto.destino,
                     alignment:'center',
                     fontSize:8,
                     blod:false,
                 }
             );
     
             bodyTableProductos.push(row);
         
         }
     
       }
      
     
     
       
     
       
       return  [
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
                                                 text:'Oficina de despachos',
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
             //Tabla de información del cleinte
             {
                 id:'table-info-cliente',
                 table:{
                     widths: [ '35%','10%','20%','15%','20%' ],
                     body:[
                         [
                             {
                                 text:'INFORMACION DEL CLIENTE',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 colSpan:2,
                                 color:"antiquewhite",
                                 fillColor:"green"
                             },
                             {},
                             {
                                 text:'FUNCIONARIO DE CONTACTO',
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
                                 text:'NOMBRE / RAZON SOCIAL',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
                             },
                             {
                                 text:'NIT',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
                             },
                             {
                                 text:'NOMBRE',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
                             },
                             {
                                 text:'TELEFONO / CELULAR',
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
                             }
                         ],
                         [
                             {
                                 text:data.cliente.nombre,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                             },
                             {
                                 text:data.cliente.nit,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                             },
                             {
                                 text:data.cliente.contacto,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                             },
                             {
                                 text:data.cliente.contactotelefono,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                             },
                             {
                                 text:data.cliente.contactoemail,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                             }
                         ]
                     ]
                 },
                 margin:[0,5,0,5],
             },
             // Tabla de funcionario comercial
             {
                 id:'table-info-comercial',
                 table:{
                     widths: [ '40%','60%' ],
                    
                     body:[
                         [
                             {
                                 text:'NOMBRE DEL FUNCIONARIO COMERCIAL DE NITROFERT',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
                             },
                             {
                                 text:data.comercial.nombre,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                             },
                         ],
                        
                     ]
                 },
                 margin:[0,5,0,5],
             },
             // Tabla autorización
             {
                 id:'table-label transportadora',
                 table:{
                     widths: [ '100%' ],
                    
                     body:[
                         [
                             {
                                 text:'Autorizamos a entregar al:',
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
             //Tabla de información empresa transportadora, vehiculo y conductor
             {
                 id:'table-info-transportadora',
                 table:{
                     widths: [ '25%','10%','10%','20%','15%','20%' ],
                     body:[
                         [
                             {
                                 text:'EMPRESA TRANSPORTADORA',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
                             },
                             {
                                 text:'NIT TRANSPORTADORA',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
     
                             },
                             {
                                 text:'PLACA VEHICULO',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
                             },
                             {
                                 text:'NOMBRE CONDUCTOR',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
     
                             },
                             {
                                 text:'CEDULA',
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
     
                             }
                         ],
                         [
                             {
                                 text:data.trasnportadora.nombre,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                             },
                             {
                                 text:data.trasnportadora.nit,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
     
                             },
                             {
                                 text:data.vehiculo.placa,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                             },
                             {
                                 text:data.conductor.nombre,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
     
                             },
                             {
                                 text:data.conductor.cedula,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
     
                             },
                             {
                                 text:data.conductor.telefono,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
     
                             }
                         ],
                     ]
                 },
                 margin:[0,5,0,5],
             },
             // Tabla informacion productos
             {
                 id:'table-label-productos',
                 table:{
                     widths: [ '100%' ],
                    
                     body:[
                         [
                             {
                                 text:'Los siguientes productos:',
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
             //Tabla de información productos 2
             {
                 id:'table-info-productos',
                 table:{
                     widths: [ '25%','10%','20%','10%','10%','25%' ],
                     body:bodyTableProductos
                 },
                 margin:[0,5,0,5],
             },
             {
                id:'table-label-productos',
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
                                            },
                                            {
                                                text:infoUsuario.cedula,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                            },
                                            {
                                                text:infoUsuario.cargo,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                            },
                                            {
                                                text:infoUsuario.celular,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                            },
                                            {
                                                text:infoUsuario.email,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                            },
                                            {
                                                text:infoUsuario.firma,
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
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
        Logo: ''
    }


    constructor(private solicitudTurnoService:SolicitudTurnoService,
                private functionsService:FunctionsService,
                private almacenesService: AlmacenesService,){}
    
    async generarPDF(data:any):Promise<void>{
        console.log('datakey',data.dataKey);
        let datakey = data.dataKey.split('-');
        let infoTurno$ = this.solicitudTurnoService.getTurnosByID(datakey[1]);
        let infoTurno = await lastValueFrom(infoTurno$);

        let locaciones$ = this.almacenesService.getLocaciones()
        let locaciones = await lastValueFrom(locaciones$);

        console.log('locaciones',locaciones);

        console.log('infoTurno',infoTurno);

        let infoUsuario: any = {
            nombre: infoTurno.solicitud.usuario.nombrecompleto,
            cedula: '',
            cargo: '',
            celular:  infoTurno.solicitud.usuario.numerotelefonico,
            email: infoTurno.solicitud.usuario.numerotelefonico,
            firma: ''
        }
        console.log('infoUsuario',infoUsuario);



        let cliente: any = {
            nombre: infoTurno.solicitud.clientes.filter((cliente: { CardCode: any; })=>cliente.CardCode === datakey[datakey.length-1])[0].CardName,
            nit: infoTurno.solicitud.clientes.filter((cliente: { CardCode: any; })=>cliente.CardCode === datakey[datakey.length-1])[0].FederalTaxID,
            contacto: '',
            contactotelefono: '',
            contatoemail: infoTurno.solicitud.clientes.filter((cliente: { CardCode: any; })=>cliente.CardCode === datakey[datakey.length-1])[0].EmailAddress
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

        let productos:any =  infoTurno.detalle_solicitud_turnos_pedido.filter((pedido: {cantidad: number; CardCode: any; })=>pedido.CardCode === datakey[datakey.length-1] && pedido.cantidad>0).map((linea: { pedidonum: any; itemname: any; cantidad: any; municipioentrega: any; lugarentrega: any; }) => {
            return {
              locacion: `${locaciones.filter((locacion: { code: any; })=>locacion.code === infoTurno.locacion )[0].locacion} -- Dirección: ${locaciones.filter((locacion: { code: any; })=>locacion.code === infoTurno.locacion )[0].direccion}`,
              pedidonum: linea.pedidonum,
              itemname: linea.itemname,
              presentacion: '',
              cantidad: linea.cantidad,
              destino: `${linea.municipioentrega} ${linea.lugarentrega}`
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

        images.Logo = await this.functionsService.convertImagenLocalToBase64('assets/demo/images/logos/nitrofert.png');

        let pdfDefinition = {
            pageSize: 'LEGAL',
            pageOrientation: 'landscape',
            pageMargins: [40, 80, 40, 100],
            permissions:this.permissions,
            header:this.header,
      
            content: this.content(dataPdf),
            footer: this.footer(infoUsuario),
            images
        }
        
        await this.functionsService.createPDF(pdfDefinition);

    }
     

}

