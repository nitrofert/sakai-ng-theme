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
                            text:'ORDEN DE CARGUE ',
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
        console.log('content',data);
        //Armar detalle observaciones
        let detalleObservaciones:any[] = [];
        let bodyTableObservaciones:any[] = [];

        let colorPDF = data.locacion.locacion==='NITROCARIBE'?'#f4b221':'green';
        let colorTextPDF = data.locacion.locacion==='NITROCARIBE'?'#000000':'antiquewhite';

        let headerTableObservaciones:any ={
            fila_0:{
                col1:{
                    text:'Observaciones',
                    alignment:'left',
                    fontSize:8,
                    blod:true,
                    color:colorTextPDF,
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
                 color:colorTextPDF,
                 fillColor:colorPDF
             },
             col2:{
                 text:'PEDIDO DE VENTA',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:colorTextPDF,
                 fillColor:colorPDF
             },
             col3:{
                text:'CODIGO MATERIAL',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:colorTextPDF,
                fillColor:colorPDF
            },
             col4:{
                 text:'PRODUCTO (Nombre específico/Grados)',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:colorTextPDF,
                 fillColor:colorPDF
             },
             col5:{
                text:'ALMACEN',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:colorTextPDF,
                fillColor:colorPDF
            },
             col6:{
                text:'TONELADAS METRICAS',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:colorTextPDF,
                fillColor:colorPDF
             },
             col7:{
                
                text:'LOTE',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:colorTextPDF,
                fillColor:colorPDF
             },
             col8:{
                text:'CANTIDAD (SACOS/BULTOS)',
                alignment:'center',
                fontSize:8,
                blod:true,
                color:colorTextPDF,
                fillColor:colorPDF
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
                                                text:`${data.locacion.locacion} NIT: ${data.locacion.nit}`,
                                                alignment:'left',
                                                fontSize:8,
                                                blod:true,
                                            }
                                        ],
                                       
                                        [
                                            {
                                                text:data.locacion.direccion,
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
                                                color:colorTextPDF,
                                                fillColor:colorPDF
                                            },
                                            {
                                                text:data.turno,
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
                                                color:colorTextPDF,
                                                fillColor:colorPDF
                                            },
                                            {
                                                text:data.locacion.locacion,
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
                                                color:colorTextPDF,
                                                fillColor:colorPDF
                                            },
                                            {
                                                text:`${data.horaIngreso}`,
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
                                                 text:'',
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
                                                 color:colorTextPDF,
                                                 fillColor:colorPDF
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
                                                 color:colorTextPDF,
                                                 fillColor:colorPDF
                                                
                                             },
                                             {
                                                 text:'MES',
                                                 alignment:'center',
                                                 fontSize:8,
                                                 blod:true,
                                                 color:colorTextPDF,
                                                 fillColor:colorPDF
                                                
                                             },
                                             {
                                                 text:'AÑO',
                                                 alignment:'center',
                                                 fontSize:8,
                                                 blod:true,
                                                 color:colorTextPDF,
                                                 fillColor:colorPDF
                                                
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
                     widths: [ '20%','10%','10%','20%','10%','10%','10%','10%' ],
                     body:bodyTableProductos
                 },
                 margin:[0,5,0,5],
             },
             //Tabla de información tiempos logisticos
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
                                color:colorTextPDF,
                                fillColor:colorPDF
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
                                color:colorTextPDF,
                                fillColor:colorPDF
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
                                color:colorTextPDF,
                                fillColor:colorPDF
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
            //Tabla de label observaciones
             {
                id:'table-label-observaciones',
                table:{
                    widths: [ '100%' ],
                    heights:['*',50],
                    body:[
                        [
                            {
                                text:'Cubicación:',
                                alignment:'left',
                                fontSize:8,
                                blod:true,
                                
                                color:colorTextPDF,
                                fillColor:colorPDF
                            }
                        ],
                        [
                            {
                                text:'',
                                alignment:'left',
                                fontSize:8,
                                //blod:true,
                            }
                        ],
                       
                    ]
                },
                margin:[0,5,0,0],
                //layout:'noBorders'
            },
            //Tabla de observaciones
            {
                id:'table-observaciones',
                table:{
                    widths: [ '15%','15%','15%','15%','20%','20%' ],
                   
                    body:[
                        [
                            {
                                text:'No. AUTORIZACION DE CARGUE ',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                
                                color:colorTextPDF,
                                fillColor:colorPDF
                            },
                            {
                                text:'No. DE PLANILLA DE TRANSPORTE',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                
                                color:colorTextPDF,
                                fillColor:colorPDF
                            }
                            ,
                            {
                                text:'EMPRESA TRANSPORTADORA',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                
                                color:colorTextPDF,
                                fillColor:colorPDF
                            }
                            ,
                            {
                                text:'PLACA VEHICULO',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                
                                color:colorTextPDF,
                                fillColor:colorPDF
                            }
                            ,
                            {
                                text:'No. IDENTIFICACION DEL CONDUCTOR',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                
                                color:colorTextPDF,
                                fillColor:colorPDF
                            }
                            ,
                            {
                                text:'NOMBRE DEL CONDUCTOR ',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                
                                color:colorTextPDF,
                                fillColor:colorPDF
                            }
                        ],
                        [
                            {
                                text:'PORTAL/CORREO',
                                alignment:'center',
                                fontSize:8,
                            },
                            {
                                text:'',
                                alignment:'center',
                                fontSize:8,
                            },
                            {
                                text:data.cliente.nombre,
                                alignment:'center',
                                fontSize:8,
                            },
                            {
                                text:data.vehiculo.placa,
                                alignment:'center',
                                fontSize:8,
                            },
                            {
                                text:data.conductor.cedula,
                                alignment:'center',
                                fontSize:8,
                            },
                            {
                                text:data.conductor.nombre,
                                alignment:'center',
                                fontSize:8,
                            },

                            
                        ]
                       
                    ]
                },
                margin:[0,5,0,5],
                //layout:'noBorders'
            }

            
         ]
    }

    footer2:any =(infoUsuario:any)=> {
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

    footer:any =(data:any)=> {

        let colorPDF = data.locacion.locacion==='NITROCARIBE'?'#f4b221':'green';
        let colorTextPDF = data.locacion.locacion==='NITROCARIBE'?'#000000':'antiquewhite';

        return {
            
            margin: 8,
            columns: 
              [
                
                //Tabla del autorizador
                {
                    margin:[20,0,30,0],
                    // Tabla separador del autorizador
                    table:{
                        widths: [ '50%','50%' ],
                    
                        body:[
                            [
                                {
                                    text:'INFORME BASCULA ',
                                    alignment:'center',
                                    fontSize:8,
                                    blod:true,
                                    color:colorTextPDF,
                                    fillColor:colorPDF,
                                    colSpan:2,
                                },
                                {}
                            ],
                            [
                                {
                                    text:'TARA (TM) ',
                                    alignment:'left',
                                    fontSize:8,
                                    blod:true,
                                    color:colorTextPDF,
                                    fillColor:colorPDF
                                },
                                {
                                    text:data.vehiculo.tara,
                                    alignment:'left',
                                    fontSize:8,
                                    blod:true,
                                }
                            ],
                            [
                                {
                                    text:'PESO DE CARGA ( TM)',
                                    alignment:'left',
                                    fontSize:8,
                                    blod:true,
                                    color:colorTextPDF,
                                    fillColor:colorPDF
                                },
                                {
                                    text:'',
                                    alignment:'left',
                                    fontSize:8,
                                    blod:true,
                                }
                            ],
                            [
                                {
                                    text:'PESO TOTAL',
                                    alignment:'left',
                                    fontSize:8,
                                    blod:true,
                                    color:colorTextPDF,
                                    fillColor:colorPDF
                                },
                                {
                                    text:'',
                                    alignment:'left',
                                    fontSize:8,
                                    blod:true,
                                }
                            ],
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
                                                    margin: [5, 5]
                                                }
                                            ],
                                            [
                                                {
                                                    text:'FIRMA CONDUCTOR',
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
                                        widths: [ '100%' ],
                                    
                                        body:[
                                            [
                                                {
                                                    text:'',
                                                    alignment:'left',
                                                    fontSize:8,
                                                    blod:true,
                                                    margin: [5, 5]
                                                }
                                            ],
                                            [
                                                {
                                                    text:'FIRMA Y CEDULA DEL FUNCIONARIO DE BASCULA',
                                                    alignment:'left',
                                                    fontSize:8,
                                                    blod:true,
                                                   
                                                }
                                            ]
                                        ]
                                    },
                                    layout:'noBorders'
                                    
                                }
                            ],
                            
                            
                        
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
    
    async generarPDF(data:any):Promise<void>{
        console.log('datakey',data.dataKey);
        let datakey = data.dataKey.split('-');
        let infoTurno$ = this.solicitudTurnoService.getTurnosByID(datakey[1]);
        let infoTurno = await lastValueFrom(infoTurno$);
        console.log('infoTurno',infoTurno);
        let locaciones$ = this.almacenesService.getLocaciones()
        let locaciones = await lastValueFrom(locaciones$);
        console.log('locaciones',locaciones);
        let locacion = locaciones.filter((locacion: { code: any; })=>locacion.code === infoTurno.locacion)[0];
        console.log('locacion',locacion);

        locacion.nit = locacion.locacion==='NITROCARIBE'?'901594213-9':'901174177-1';
        this.images.Logo = await this.functionsService.convertImagenLocalToBase64(locacion.locacion==='NITROCARIBE'?'assets/demo/images/logos/NITROCARIBE.png':'assets/demo/images/logos/nitrofert.png');

        

        let horaIngreso ="";
        

        if (infoTurno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.ARRIBO).length > 0){
            let historialIngreso = infoTurno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.ARRIBO)[0];
            horaIngreso = `${historialIngreso.fecha_accion} ${historialIngreso.hora_accion}`

            console.log('horaIngreso',horaIngreso);
        }

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
            placa: infoTurno.vehiculo.placa,
            tara: infoTurno.peso_vacio
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
            turno:infoTurno.id,
            diaSolicitud: new Date().getDate(),
            mesSolicitud: new Date().getMonth() + 1,
            anioSolicitud: new Date().getFullYear(),
            locacion ,
            horaIngreso,
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
            //footer: this.footer(infoUsuario),
            footer: this.footer(dataPdf),
            images:this.images
        }
        
        await this.functionsService.createPDF(pdfDefinition);

    }
     

}

