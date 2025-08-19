import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { AlmacenesService } from "src/app/demo/service/almacenes.service";
import { FunctionsService } from "src/app/demo/service/functions.service";
import { SolicitudTurnoService } from "src/app/demo/service/solicitudes-turno.service";
import { UsuarioService } from "src/app/demo/service/usuario.service";

/*
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
                body:bodyTableProductos
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
*/

@Injectable()
export class PdfRemision {

    header:any = (remision:any, almacen:string='')=> {
       //console.log('header');
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
                        [
                          
                            {
                              table: {
                                widths: [ '100%'],
                                body: [
                                  [{
                                      text:'NIT 901174177-1',
                                      alignment:'left',
                                      //fontSize:8,
                                      blod:true,
                                      color:'black'
                                    }
                                  ],
                                  
                                  [ {
                                      text:'CRA 53 80 198 OF 1904 ED TORRE EMPRESARIAL ATLANTICA',
                                      alignment: 'left',
                                      //fontSize:8,
                                      bold: true,
                                      color:'black',
                                  }
                                  ],
                                  [{
                                      text:'ATLANTICO - Colombia',
                                      alignment: 'left',
                                      //fontSize:8,
                                      bold: true,
                                      color:'black',
                                  }],
                                  [{
                                      text:'COP',
                                      alignment: 'left',
                                      //fontSize:8,
                                      bold: true,
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
                        //Columna contrl de version doc
                        [
                          
                          {
                            table: {
                              widths: [ '100%'],
                              body: [
                                [{
                                    text:'PUESTO DE EXPEDICION:',
                                    alignment:'left',
                                    //fontSize:8,
                                    blod:true,
                                    color:'black'
                                  }
                                ],
                                
                                [ {
                                    text:`${almacen.toUpperCase()}`,
                                    alignment: 'left',
                                    //fontSize:8,
                                    bold: true,
                                    color:'black',
                                },
                               
                                ],
                                [{
                                    text:'REMISION No. '+remision,
                                    alignment: 'left',
                                    //fontSize:8,
                                    bold: true,
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
                layout: 'noBorders'
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
       //console.log('content');
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
                    text:'ORDEN DE VENTA',
                    alignment:'center',
                    fontSize:8,
                    blod:true,
                    color:"antiquewhite",
                    fillColor:"green"
                },
                col2:{
                    text:'CODIGO MATERIAL',
                    alignment:'center',
                    fontSize:8,
                    blod:true,
                    color:"antiquewhite",
                    fillColor:"green"
                },
                col3:{
                    text:'DESCRIPCIONMATERIAL',
                    alignment:'center',
                    fontSize:8,
                    blod:true,
                    color:"antiquewhite",
                    fillColor:"green"
                },
                col4:{
                    text:'LOTE',
                    alignment:'center',
                    fontSize:8,
                    blod:true,
                    color:"antiquewhite",
                    fillColor:"green"
                },
                col5:{
                    text:'UNIDAD',
                    alignment:'center',
                    fontSize:8,
                    blod:true,
                    color:"antiquewhite",
                    fillColor:"green"
                },
                col6:{
                    text:'CANTIDAD (SACOS/BULTOS)',
                    alignment:'center',
                    fontSize:8,
                    blod:true,
                    color:"antiquewhite",
                    fillColor:"green"
                },
                col7:{
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
                        text:producto.pedidonum,
                        alignment:'center',
                        fontSize:8,
                        blod:false,
                    }
                );
        
                row.push(
                
                    {
                        text:producto.itemcode,
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
                        text:producto.lote,
                        alignment:'center',
                        fontSize:8,
                        blod:false,
                    }
                );
            
                row.push(
                    
                    {
                        text:producto.unidad,
                        alignment:'center',
                        fontSize:8,
                        blod:false,
                    }
                );

                row.push(
                    
                    {
                        text:producto.cantidad_sacos,
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
                                                 color:"antiquewhite",
                                                 fillColor:"green"
                                             }
                                         ],
                                         [
                                            {
                                                table:{
                                                    widths: [ '100%' ],
                                                    body:[
                                                      
                                                        [
                                                            {
                                                                text:`${data.cliente.nombre} - NIT ${data.cliente.nit}`,
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                            }
                                                        ],
                                                        [
                                                            {
                                                                text:`DESTINO: ${data.cliente.destino_pedido_item}`,
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout:'noBorders'
                                            },
                                         ]
                                        //  [
                                        //      {
                                        //          text:'NITROFERT S.A.S.',
                                        //          alignment:'left',
                                        //          fontSize:8,
                                        //          blod:true,
                                        //      }
                                        //  ],
                                        //  [
                                        //      {
                                        //          text:'Oficina de despachos',
                                        //          alignment:'left',
                                        //          fontSize:8,
                                        //          blod:true,
                                        //      }
                                        //  ]
                                     ]
                                 },
                                 //layout:'noBorders'
                             },
                             {
                                 table:{
                                     widths: [ '33%','33%','34%' ],
                                     body:[
                                         [
                                             {
                                                 text:'FECHA',
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
            //  {
            //      id:'table-info-cliente',
            //      table:{
            //          widths: [ '35%','10%','20%','15%','20%' ],
            //          body:[
            //              [
            //                  {
            //                      text:'INFORMACION DEL CLIENTE',
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                      colSpan:2,
            //                      color:"antiquewhite",
            //                      fillColor:"green"
            //                  },
            //                  {},
            //                  {
            //                      text:'FUNCIONARIO DE CONTACTO',
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                      colSpan:3,
            //                      color:"antiquewhite",
            //                      fillColor:"green"
            //                  },
            //                  {},
            //                  {}
            //              ],
            //              [
            //                  {
            //                      text:'NOMBRE / RAZON SOCIAL',
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                      color:"antiquewhite",
            //                      fillColor:"green"
            //                  },
            //                  {
            //                      text:'NIT',
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                      color:"antiquewhite",
            //                      fillColor:"green"
            //                  },
            //                  {
            //                      text:'NOMBRE',
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                      color:"antiquewhite",
            //                      fillColor:"green"
            //                  },
            //                  {
            //                      text:'TELEFONO / CELULAR',
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                      color:"antiquewhite",
            //                      fillColor:"green"
            //                  },
            //                  {
            //                      text:'EMAIL',
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                      color:"antiquewhite",
            //                      fillColor:"green"
            //                  }
            //              ],
            //              [
            //                  {
            //                      text:data.cliente.nombre,
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                  },
            //                  {
            //                      text:data.cliente.nit,
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                  },
            //                  {
            //                      text:data.cliente.contacto,
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                  },
            //                  {
            //                      text:data.cliente.contactotelefono,
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                  },
            //                  {
            //                      text:data.cliente.contactoemail,
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                  }
            //              ]
            //          ]
            //      },
            //      margin:[0,5,0,5],
            //  },
             // Tabla de funcionario comercial
            //  {
            //      id:'table-info-comercial',
            //      table:{
            //          widths: [ '40%','60%' ],
                    
            //          body:[
            //              [
            //                  {
            //                      text:'NOMBRE DEL FUNCIONARIO COMERCIAL DE NITROFERT',
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                      color:"antiquewhite",
            //                      fillColor:"green"
            //                  },
            //                  {
            //                      text:data.comercial.nombre,
            //                      alignment:'center',
            //                      fontSize:8,
            //                      blod:true,
            //                  },
            //              ],
                        
            //          ]
            //      },
            //      margin:[0,5,0,5],
            //  },
             // Tabla autorización
             
             //Tabla de información empresa transportadora, vehiculo y conductor
             {
                 id:'table-info-transportadora',
                 table:{
                     widths: [ '10%','10%','25%','10%','20%','25%' ],
                     body:[
                         [
                             {
                                 text:' No. AUTORIZACION DE CARGUE',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
                             },
                             {
                                 text:'No. PLANILLA DE TRANSPORTE',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
     
                             },
                             {
                                 text:'EMPRESA TRANSPORTADORA',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
                             },
                             {
                                 text:'PLACA',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
     
                             },
                             {
                                 text:'No. IDENTIFICACION DEL CONDUCTOR',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
     
                             },
                             {
                                 text:'NOMBRE Y FIRMA DEL CONDUCTOR',
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                                 color:"antiquewhite",
                                 fillColor:"green"
     
                             }
                         ],
                         [
                             {
                                 text:data.turno,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
                             },
                             {
                                 text:data.manifiesto,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
     
                             },
                             {
                                 text:data.trasnportadora.nombre,
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
                                 text:data.conductor.cedula,
                                 alignment:'center',
                                 fontSize:8,
                                 blod:true,
     
                             },
                             {
                                 text:data.conductor.nombre,
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
             
             //Tabla de información productos 2
             {
                 id:'table-info-productos',
                 table:{
                     widths: [ '10%','10%','25%','10%','10%','10%','25%' ],
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

    footer:any =(infoUsuario:any,data:any)=> {
       //console.log('footer');
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
                                table:{
                                    widths: [ '33%','33%','34%' ],
                                    body:[
                                        [
                                            {
                                                text:'UBICACION:',
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                                            },
                                            {
                                                text:'CANTIDAD DE BULTOS:',
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                    
                                            },
                                            {
                                                text:'INFORME DE BASCULA',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green"
                                            },
                                         
                                        ],
                                        [
                                            {
                                                text:'',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [5, 5]
                                            },
                                            {
                                                text:'',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [5, 5]
                                            },
                                            {
                                                table:{
                                                    widths: [ '50%','50%'],
                                                    body:[
                                                        [
                                                            {
                                                                text:'TARA (TM):',
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                                color:"antiquewhite",
                                                                fillColor:"green"
                                                            },
                                                            {
                                                                text:data.remision.tara,
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                                //margin: [5, 5]
                                                                //color:"antiquewhite",
                                                                //fillColor:"green"
                                    
                                                            },
                                                        ],
                                                        [
                                                            
                                                            {
                                                                text:'PESO DE CARGA (TM):',
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                                color:"antiquewhite",
                                                                fillColor:"green"
                                                            },
                                                            {
                                                                text:data.remision.peso_carga,
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                                //color:"antiquewhite",
                                                                //fillColor:"green"
                                    
                                                            },
                                                        ],
                                                        [
                                                            
                                                            {
                                                                text:'PESO BRUTO (TM):',
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                                color:"antiquewhite",
                                                                fillColor:"green"
                                                            },
                                                            {
                                                                text:data.remision.neto,
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                               // color:"antiquewhite",
                                                               // fillColor:"green"
                                    
                                                            },
                                                        ]
                                                    ]
                                                }
                                            },
                                         
                                        ],
                                        [
                                            {
                                                text:'AVISO LEGAL: SE DEJA EXPRESA CONSTANCIA DE QUE LA CANTIDAD TOTAL DE BULTOS Y DE TONELADAS METRICAS CARGADAS QUE SE RELACIONAN EN ESTA REMISIÓN SE ENCUENTRAN DENTRO DE LOS LÍMITES DE PESO LEGALMENTE PERMITIDOS POR LA NORMATIVIDAD VIGENTE, SIENDO ESTOS LOS EXPRESAMENTE INDICADOS; CUALQUIER EXCESO O DISCREPANCIA ENTRE EL PESO DE CARGA Y BRUTO EN TONELADAS METRICAS EXPRESAMENTE INDICADOS EN ESTA REMISIÓN Y EL PESO DEL VEHÍCULO SERÁ DE LA ENTERA RESPONSABILIDAD DE LA EMPRESA TRANSPORTADORA Y/O EL CONDUCTOR.',
                                                alignment:'center',
                                                fontSize:6,
                                                blod:true,
                                                colSpan:3,
                                            },
                                            {},
                                            {}
                                            // {
                                            //     text:'',
                                            //     alignment:'left',
                                            //     fontSize:8,
                                            //     blod:true,
                                                
                                            // }
                                        ],
                                        [
                                            {
                                                text:'OBSERVACIONES AL CARGUE:',
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green",
                                                colSpan:2,
                                            },
                                            {},
                                            {
                                                text:'FIRMA Y CEDULA DEL FUNCIONARIO DE BASCULA',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green",
                                                
                                            },
                                        ],
                                        [
                                            {
                                                text:'',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                colSpan:2,
                                                margin: [6, 6]
                                            },
                                            {},
                                            {
                                                text:'',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [6, 6]
                                            }
                                        ],
                                        [
                                            {
                                                text:'RECIBO A CONFORMIDAD LA CANTIDAD DE BULTOS DESPACHADOS Y DECLARO QUE ESTOS SE ENCUENTRAN EN CONDICIONES OPTIMAS (LIMPIOS, SECOS Y SIN DAÑOS VISIBLES).',
                                                alignment:'center',
                                                fontSize:6,
                                                blod:true,
                                                colSpan:2,
                                                margin: [6, 6]
                                            },
                                            {},
                                            {
                                                text:'FIRMA',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [6, 1]
                                            }
                                        ],
                                        [
                                            {
                                                text:'RECIBIDO:',
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                                color:"antiquewhite",
                                                fillColor:"green",
                                                colSpan:3,
                                                //margin: [6, 6]
                                            },
                                            {},
                                            {}
                                        ],
                                        [
                                            
                                            {
                                                text:'FIRMA Y SELLO DE RECIBIDO',
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                                colSpan:3,
                                                margin: [5, 5]
                                            },
                                            {},
                                            {}
                                            
                                        ]
                                       
                                    ]
                                }
                            }
                        ]
                    
                    ]
                },
                
                //layout:'noBorders',
                
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

    
    
    async generarPDF(turno:any,remision:any):Promise<void>{
       //console.log('datakey',data.dataKey);
        //let datakey = data.dataKey.split('-');
        // let infoTurno$ = this.solicitudTurnoService.getTurnosByID(turno);
        // let infoTurno = await lastValueFrom(infoTurno$);
        let infoTurno = turno;
        console.log('infoTurno',infoTurno);

        let locaciones$ = this.almacenesService.getLocaciones()
        let locaciones = await lastValueFrom(locaciones$);

        let almacenes$ =this.almacenesService.getAlmacenes();
        let almacenes:any[] = await this.functionsService.objectToArray((await lastValueFrom(almacenes$)));

        console.log('locaciones',locaciones);
        console.log('almacenes',almacenes);



        let remisiones_turno:any[] = [];

        console.log('infoTurno.detalle_solicitud_turnos_remisiones',infoTurno.detalle_solicitud_turnos_remisiones)

        let infoRemison:any = infoTurno.detalle_solicitud_turnos_remisiones.find((itemremision: { docnum: any; })=>itemremision.docnum === remision);
       
        let linea_remision:any = {
            numero:infoRemison.docnum,
            pedido:infoRemison.base_docnum,
            cliente: infoTurno.solicitud.clientes.filter((socio_negocio: { CardCode: any; })=>socio_negocio.CardCode === infoRemison.CardCode)[0],
            destino: `${infoRemison.municipioentrega} - ${infoRemison.lugarentrega}`,
            vehiculo:infoTurno.vehiculo,
            transportadora:infoTurno.transportadora,
            conductor:infoTurno.conductor,
            tara:infoTurno.peso_vacio,
            peso_carga:infoTurno.peso_neto - infoTurno.peso_vacio,
            neto:infoTurno.peso_neto,
            fecha:infoRemison.fecha,
            turno:infoTurno.id,
            manifiesto:infoRemison.manifiesto
        }

        let detalle_remision:any[] = [];
        //Buscar en detalle_pedidos_turno los items coincidentes con la remision.docnum

        let detalle_pedidos_turno = infoTurno.detalle_solicitud_turnos_pedido.filter((pedido:{remision:any})=>pedido.remision === infoRemison.docnum);

        for(let pedido of detalle_pedidos_turno){
            let linea_detalle_remision = {
                pedidonum:pedido.pedidonum,
                linea:pedido.linea,
                bodega:pedido.bodega,
                itemcode:pedido.itemcode,
                itemname:pedido.itemname,
                cantidad:pedido.cantidad,
                cantidad_sacos:pedido.cantidad_sacos,
                lote:'',
                unidad:'TONELADA'
            }
            //Si la linea del pedido no tiene lotes asignar linea_detalle_remision
            if(pedido.detalle_lotes_item_turno!=undefined && pedido.detalle_lotes_item_turno.length ===0){
                detalle_remision.push(linea_detalle_remision);
            }else{
                for(let lote of pedido.detalle_lotes_item_turno){
                    let new_linea_lote = JSON.parse(JSON.stringify(linea_detalle_remision));
                    new_linea_lote.cantidad = lote.cantidad_cargue_lote;
                    new_linea_lote.cantidad_sacos = lote.cantidad_sacos_lote;
                    new_linea_lote.lote = lote.lote;

                    detalle_remision.push(new_linea_lote);

                }
            }
        }

        linea_remision.detalle_remision = detalle_remision;
        remisiones_turno.push(linea_remision);

        console.log('remisiones_turno',remisiones_turno);

        let almacen:string = almacenes.filter(almacen=>almacen.WhsCode_Code === remisiones_turno[0].detalle_remision[0].bodega)[0].WhsName;

       //console.log('locaciones',locaciones);

       //console.log('infoTurno',infoTurno);

        let filesAtach$ = this.functionsService.filesToBase64({id_relacion:infoTurno.solicitud.usuario.id,
                                                           proceso:'firma',
                                                           entidad:'usuario'});
        let filesAtachByEstadoHistorialTurno = await lastValueFrom(filesAtach$);

       //console.log('filesAtachByEstadoHistorialTurno',filesAtachByEstadoHistorialTurno)

        if(filesAtachByEstadoHistorialTurno.length === 0){
            filesAtachByEstadoHistorialTurno.push(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAABYCAIAAAB3ZqVmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAADfSURBVHhe7dMxAQAwEAOh+jedzn8awANvwGUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVsC1fUBYOJv6tIhuAAAAAElFTkSuQmCC`)
        }
        
        this.images.Logo = await this.functionsService.convertImagenLocalToBase64('assets/demo/images/logos/nitrofert.png');
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
       //console.log('infoUsuario',infoUsuario);



   
    let cliente: any = {
        nombre: remisiones_turno[0].cliente.CardName.toUpperCase(),
        nit: remisiones_turno[0].cliente.FederalTaxID,
        contacto: remisiones_turno[0].cliente.nombre_contacto,
        contactotelefono: remisiones_turno[0].cliente.telefono_contacto,
        contatoemail: remisiones_turno[0].cliente.email_contacto,
        destino_pedido_item:remisiones_turno[0].destino
    }
   console.log('cliente',cliente);


        let comercial:any =  {
            //nombre: infoTurno.detalle_solicitud_turnos_pedido.filter((pedido: { CardCode: any; })=>pedido.CardCode === datakey[datakey.length-1])[0].vendedor
            nombre: ''
        }
       //console.log('comercial',comercial);

        let trasnportadora:any = {
            nombre: infoTurno.transportadora.nombre,
            nit: infoTurno.transportadora.nit
        }
       //console.log('trasnportadora',trasnportadora);
        let vehiculo:any = {
            placa: infoTurno.vehiculo.placa
        }
       //console.log('vehiculo',vehiculo);
        let conductor:any =  {
            nombre: infoTurno.conductor.nombre,
            cedula: infoTurno.conductor.cedula,
            telefono: infoTurno.conductor.numerocelular
        }
       //console.log('conductor',conductor);

        //let productos:any =  remisiones_turno[0].detalle_remision;

        let productos:any[] = [];

        for(let producto of remisiones_turno[0].detalle_remision){
            
            let linea:any = {
                pedidonum:producto.pedidonum,
                itemcode:producto.itemcode,
                itemname:producto.itemname,
                lote:producto.lote,
                unidad:producto.unidad,
                cantidad_sacos:producto.cantidad_sacos,
                cantidad:producto.cantidad
            }

            productos.push(linea);
        }

        let observacionesArray:any = infoTurno.observacion!=""?infoTurno.observacion.split(";"):[];
        
        let observaciones:any = observacionesArray.map((data:any)=>{
            return { observacion:data.trim() };
        })
       console.log('remisiones_turno[0].fecha',remisiones_turno[0].fecha); 
       console.log('new Date( remisiones_turno[0].fecha',new Date( `${remisiones_turno[0].fecha}T05:00:00.000Z`));


        let dataPdf: any = {
            diaSolicitud: new Date( `${remisiones_turno[0].fecha}T05:00:00.000Z`).getDate(),
            mesSolicitud: new Date( `${remisiones_turno[0].fecha}T05:00:00.000Z`).getMonth() + 1,
            anioSolicitud: new Date( `${remisiones_turno[0].fecha}T05:00:00.000Z`).getFullYear(),
            cliente,
            comercial,
            trasnportadora,
            vehiculo,
            conductor,
            productos,
            observaciones,
            observacion:`Remisión basado en pedido de cliente ${remisiones_turno[0].pedidonum}`,
            manifiesto:remisiones_turno[0].manifiesto,
            turno:infoTurno.id,
            remision:remisiones_turno[0]
        }

        

        let pdfDefinition = {
            pageSize: 'LEGAL',
            pageOrientation: 'landscape',
            pageMargins: [40, 80, 40, 200],
            permissions:this.permissions,
            header:this.header(remision,almacen),
      
            content: this.content(dataPdf),
            footer: this.footer(infoUsuario,dataPdf),
            images:this.images
        }
        
        await this.functionsService.createPDF(pdfDefinition);

    }
     

}

