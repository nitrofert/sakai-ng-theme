import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { AlmacenesService } from "src/app/demo/service/almacenes.service";
import { FunctionsService } from "src/app/demo/service/functions.service";
import { SolicitudTurnoService } from "src/app/demo/service/solicitudes-turno.service";
import { UsuarioService } from "src/app/demo/service/usuario.service";
import { EstadosDealleSolicitud } from "../../turnos/estados-turno.enum";

@Injectable()
export class PdfInspeccionCargue {

    estadosTurno:any = EstadosDealleSolicitud;

    header:any = (turno:any)=> {
        //////////console.log('header');
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
                            text:'INSPECCION DE DESPACHO '+turno,
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
                                    text:'FOR-GSC-032',
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
                                    text:'4.0',
                                    alignment:'left',
                                    //fontSize:8,
                                    bold:false,
                                    color:'black',
                                }
                                ],
                                [{
                                    text:'Vigencia:',
                                    alignment: 'left',
                                    //fontSize:8,
                                    bold: true,
                                    color:'black',
                                },
                                {
                                    text:'17-11-2023', 
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
    content:any =  (data:any)=>{
        ////////console.log('content', data);
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
                 text:'PRODUCTO (Nombre específico/Grados)',
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
                 text:'CANTIDAD (TONELADAS)',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             },
             col6:{
                 text:'TONELADAS METRICAS',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             },
             col7:{
                 text:'CUBICACION',
                 alignment:'center',
                 fontSize:8,
                 blod:true,
                 color:"antiquewhite",
                 fillColor:"green"
             },
             col8:{
                 text:'REMISION',
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
                     text:producto.itemname,
                     alignment:'center',
                     fontSize:8,
                     blod:false,
                 }
             );
         
             row.push(
                 
                 {
                     text:producto.lote_produccion,
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
                     text:producto.toneladas_metircas,
                     alignment:'center',
                     fontSize:8,
                     blod:false,
                 }
             );

             row.push(
                 
                {
                    text:producto.cubicacion,
                    alignment:'center',
                    fontSize:8,
                    blod:false,
                }
            );

            row.push(
                 
                {
                    text:producto.remision,
                    alignment:'center',
                    fontSize:8,
                    blod:false,
                }
            );
     
             bodyTableProductos.push(row);
         
         }
     
       }

       let histoarial_turno = data.historial;

       ////////console.log('histoarial_turno',histoarial_turno);

       let info_llegada:any[] = [];
       let info_inicio_cargue :any[] = [];
       let info_fin_cargue :any[] = [];

       info_llegada = histoarial_turno.filter((historial: { estado: any; })=>historial.estado === this.estadosTurno.ARRIBO);
       info_inicio_cargue = histoarial_turno.filter((historial: { estado: any; })=>historial.estado === this.estadosTurno.CARGANDO);
       info_fin_cargue = histoarial_turno.filter((historial: { estado: any; })=>historial.estado === this.estadosTurno.CARGADO);
     
       ////////console.log('info_llegada',info_llegada);
       ////////console.log('info_inicio_cargue',info_inicio_cargue);
       ////////console.log('info_fin_cargue',info_fin_cargue);
       
     
       
       return  [
             //Header fecha solicitud y destinatario
             {
                 id:'table-fecha',
                 table:{
                     widths: [ '35%','65%' ],
                     
                     body:[
                         [
                            //Tabla de fechas
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
                            },
                            //Tabla inspector despacho
                             {
                                 table:{
                                     widths: [ '100%' ],
                                     body:[
                                         [
                                             {
                                                table:{
                                                    widths: [ '50%','50%' ],
                                                    body:[
                                                        [
                                                            {
                                                                text:'INSPECTOR DE OPERACIONES:',
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                            },
                                                            {
                                                                text:data.infoUsuario.nombre,
                                                                alignment:'center',
                                                                fontSize:8,
                                                                blod:false,
                                                            }
                                                        ],
                                                        
                                                    ]
                                                },
                                                layout:'noBorders'
                                             }
                                         ],

                                         [
                                            {
                                               table:{
                                                   widths: [ '50%','15%', '5%', '20%', '5%', '5%' ],
                                                   body:[
                                                       [
                                                           {
                                                               text:'ESTADO DEL VEHICULO:',
                                                               alignment:'left',
                                                               fontSize:8,
                                                               blod:true,
                                                           },
                                                           {
                                                            text:'Conforme:',
                                                            alignment:'left',
                                                            fontSize:8,
                                                            blod:true,
                                                           },
                                                           {
                                                                table:{
                                                                    widths: [ '100%' ],
                                                                    body:[
                                                                        [
                                                                            {
                                                                               image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].estado_vehiculo?'check':'uncheck',
                                                                               alignment:'center',
                                                                               fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].estado_vehiculo?[8,8]:[25,25],
                                                                                //fontSize:8,
                                                                                //blod:true,
                                                                            },
                                                                        
                                                                        ],
                                                                        
                                                                    ]
                                                                },
                                                            },
                                                            {
                                                                text:'No conforme',
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                            },

                                                           {
                                                                table:{
                                                                    widths: [ '100%' ],
                                                                    body:[
                                                                        [
                                                                            {
                                                                               image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].estado_vehiculo?'check':'uncheck',
                                                                               alignment:'center',
                                                                               fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].estado_vehiculo?[8,8]:[25,25],
                                                                            },
                                                                        
                                                                        ],
                                                                        
                                                                    ]
                                                                }
                                                            },
                                                            {
                                                                text:' ',
                                                                alignment:'left',
                                                                fontSize:8,
                                                                blod:true,
                                                            },
                                                           
                                                       ],
                                                       
                                                   ]
                                               },
                                               layout:'noBorders'
                                            }
                                        ],
                                         
                                         
                                     ]
                                 },
                                 layout:'noBorders'
                             },
                             
                         ]
                     ]
                 },
                 layout:'noBorders',
                 margin:[0,5,0,5],
             
             },
             //Tabla Label info chequeo vehiculo
            {
                id:'table-label',
                table:{
                    widths: [ '100%' ],
                    
                    body:[
                            [
                                {
                                    
                                    text:'El objetivo de esta lista de chequeo es para garantizar las condiciones de la operación del despacho de un vehiculo con los procesos de calidad. Estos items son de obligatorio cumplimiento. En caso de presentar anomalía en el vehículo queda fuera de servicio inmediatamente y reportar al técnico de despacho encargado.',
                                    alignment:'justify',
                                    fontSize:8,
                                    blod:true,
                                        
                                },
                            ]
                        ]
                },
                layout:'noBorders',
                margin:[0,5,0,5],
            
            },
            //Tabla Check Vehiculo
            {
                id:'table-check-vehiculo',
                table:{
                    widths: [ '5%','30%','10%','15%','40%' ],
                    body:[
                        //Encabezado tabla
                        [
                            {
                                text:'CHEQUEO VEHICULO',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                colSpan:5,
                                color:"antiquewhite",
                                fillColor:"green"
                            },
                            {},
                            {},
                            {},
                            {}
                        ],
                        [
                            {
                                text:'ITEM',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:'CRITERIOS A EVALUAR',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:'CONFORME',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:'NO CONFORME',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:'OBSERVACIONES',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            }
                        ],
                        //Lineas de chequeo
                        [
                            {
                                text:'1',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'SIN OLORES',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].olores?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].olores?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].olores?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].olores?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_olores:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'2',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'ESTADO CARROCERIA',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].carroceria?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].carroceria?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].carroceria?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].carroceria?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_carroceria:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'3',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'CARPA SIN FILTRACIONES',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].carpa_filtraciones?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].carpa_filtraciones?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].carpa_filtraciones?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].carpa_filtraciones?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_carpa_filtraciones:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'4',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'AUSENCIA DE PLAGAS VIVAS O MUERTAS',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].plagas?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].plagas?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].plagas?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].plagas?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_plagas:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'5',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'AUSENCIA DE HUMEDAD O GRASA',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].humedad_grasa?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].humedad_grasa?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].humedad_grasa?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].humedad_grasa?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_humedad_grasa:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'6',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'LIMPIESA Y BUEN ESTADO DE LA PLANCHA',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].estado_plancha?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].estado_plancha?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].estado_plancha?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].estado_plancha?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_estado_plancha:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'7',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'PLASTICO O POLIPROPILENO',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].plastico_polipropileno?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].plastico_polipropileno?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].plastico_polipropileno?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].plastico_polipropileno?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_plastico_polipropileno:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ]
                    ]
                },
                //layout:'noBorders',
                margin:[0,5,0,5],
            
            },
            //Tabla label info chequeo producto
            {
                id:'table-label2',
                table:{
                    widths: [ '100%' ],
                    
                    body:[
                            [
                                {
                                    
                                    text:'El conductor debe estar presente al momento del cargue y verificar de igual manera el proceso de despacho validando conformidad y calidad.',
                                    alignment:'justify',
                                    fontSize:8,
                                    blod:true,
                                        
                                },
                            ]
                        ]
                },
                layout:'noBorders',
                margin:[0,5,0,5],
            
            },
            //Tabla check producto

            {
                id:'table-check-producto',
                table:{
                    widths: [ '5%','30%','10%','15%','40%' ],
                    body:[
                        //Encabezado
                        [
                            {
                                text:'CHEQUEO PRODUCTO',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                colSpan:5,
                                color:"antiquewhite",
                                fillColor:"green"
                            },
                            {},
                            {},
                            {},
                            {}
                        ],
                        [
                            {
                                text:'ITEM',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:'CRITERIOS A EVALUAR',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:'CONFORME',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:'NO CONFORME',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:'OBSERVACIONES',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            }
                        ],
                        //lineas de chequeo
                        [
                            {
                                text:'1',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'REGISTRO ICA',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].registro_ica?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].registro_ica?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].registro_ica?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].registro_ica?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_registro_ica:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'2',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'LOTE DE FABRICACIÓN',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].lote_fabricacion?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].lote_fabricacion?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].lote_fabricacion?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].lote_fabricacion?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_lote_fabricacion:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'3',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'PESO DE PRODUCTO',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].peso_producto?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].peso_producto?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].peso_producto?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].peso_producto?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_peso_producto:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'4',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'PRODUCTO LIMPIO',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].producto_limpio?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].producto_limpio?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].producto_limpio?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].producto_limpio?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_producto_limpio:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'5',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'EMPAQUES SIN ROTURAS',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].empaques_rotura?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].empaques_rotura?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].empaques_rotura?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].empaques_rotura?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_empaques_rotura:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ],
                        [
                            {
                                text:'6',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'PRODUCTO NO ESTA DURO/COMPACTADO',
                                alignment:'left',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                
                                image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].producto_compactado?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].producto_compactado?[8,8]:[25,25],
                               
                            },
                            {
                                image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].producto_compactado?'check':'uncheck',
                                alignment:'center',
                                fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].producto_compactado?[8,8]:[25,25],
                               
                            }
                            ,
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].obs_producto_compactado:'',
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            }
                        ]
                        
                    ]
                },
                //layout:'noBorders',
                margin:[0,5,0,5],
            
            },

            //Tabla aceptacion cargue mercancia
            {
                id:'table-check-producto',
                table:{
                    widths: [ '14%','17%','18%','17%','16%', '18%' ],
                    body:[
                        //Encabezado
                        [
                            {
                                text:'ACEPTACION CARGUE DE MERCANCIA',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                colSpan:6,
                                color:"antiquewhite",
                                fillColor:"green"
                            },
                            {},
                            {},
                            {},
                            {},
                            []
                        ],
                        //Informacion de fechas de cargue
                        [
                            {
                                text:'HORA LLEGADA',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:`${info_llegada[info_llegada.length-1].fecha_accion} ${info_llegada[info_llegada.length-1].hora_accion}` ,
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'HORA INICIO CARGUE',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:`${info_inicio_cargue[info_inicio_cargue.length-1].fecha_accion} ${info_inicio_cargue[info_inicio_cargue.length-1].hora_accion}` ,
                                alignment:'center',
                                fontSize:6,
                                blod:true
                               
                            },
                            {
                                text:'HORA FIN CARGUE',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {
                                text:`${info_fin_cargue[info_fin_cargue.length-1].fecha_accion} ${info_fin_cargue[info_fin_cargue.length-1].hora_accion}` ,
                                alignment:'center',
                                fontSize:6,
                                blod:true,
                                
                            }
                        ],
                        //information transportadora
                        [
                            {
                                text:'TRANSPORTADORA',
                                alignment:'center',
                                fontSize:8,
                                colSpan:2,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {},
                            {
                                text:`${data.trasnportadora.nombre} - ${data.trasnportadora.nit}`,
                                alignment:'center',
                                fontSize:8,
                                colSpan:4,
                                blod:true
                               
                            },
                            {},
                            {},
                            {},
                            
                        ],
                        //Informacion del vehiculo
                        [
                            {
                                text:'VEHICULO',
                                alignment:'center',
                                fontSize:8,
                                colSpan:2,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {},
                            {
                                text:`${data.vehiculo.placa}`,
                                alignment:'center',
                                fontSize:8,
                                colSpan:4,
                                blod:true
                               
                            },
                            {},
                            {},
                            {},
                            
                        ],
                        //Informacion del conductor
                        [
                            {
                                text:'CONDUCTOR',
                                alignment:'center',
                                fontSize:8,
                                colSpan:2,
                                blod:true,
                                color:"antiquewhite",
                                fillColor:"green"
                               
                            },
                            {},
                            {
                                text:`${data.conductor.nombre} - ${data.conductor.cedula}`,
                                alignment:'center',
                                fontSize:8,
                                colSpan:4,
                                blod:true
                               
                            },
                            {},
                            {},
                            {},
                            
                        ],
                       
                        
                    ]
                },
                //layout:'noBorders',
                margin:[0,5,0,5],
            
            },
            //Tabla label info aceptacion
            {
                id:'table-label3',
                table:{
                    widths: [ '100%' ],
                    
                    body:[
                            [
                                {
                                    
                                    //text:`Yo. <u><strong>${data.conductor.nombre }</strong></u> identificado con cédula de ciudadania No. <u><strong>${data.conductor.cedula }</strong></u> expedida en ___________ en mi condición de conductor del vehículo con placas <u><strong>${data.vehiculo.placa}</strong></u>, certifico que el contenido de la presente carga se ajusta a lo declarado en la remisión No. _______ en cuanto cantidad, calidad y peso. De igual forma, manifiesto que <u><strong>Nitrocaribe</strong></u> dispuso las condiciones necesarias para la verificación a conformidad del proceso de cargue y despacho de la mencionada carga.`,
                                    text:[
                                            'Yo. ',
                                            { text: `${data.conductor.nombre}`,blod:true,decoration: 'underline'},
                                            ' identificado con cédula de ciudadania No. ',
                                            { text: `${data.conductor.cedula}`,blod:true,decoration: 'underline'},
                                            ' expedida en ',
                                            { text: `lugar de expedición`,blod:true,decoration: 'underline'},
                                            ' en mi condición de conductor del vehículo con placas ',
                                            { text: `${data.vehiculo.placa}`,blod:true,decoration: 'underline'},
                                            ', certifico que el contenido de la presente carga se ajusta a lo declarado en la remisión No. ',
                                            { text: `numero de remisión o remisiones`,blod:true,decoration: 'underline'},
                                            ' en cuanto cantidad, calidad y peso. De igual forma, manifiesto que ',
                                            { text: `${data.locacion.locacion}`,blod:true,decoration: 'underline'},
                                            ' dispuso las condiciones necesarias para la verificación a conformidad del proceso de cargue y despacho de la mencionada carga.',


                                         ],
                                    alignment:'justify',
                                    fontSize:8,
                                    //blod:true,
                                        
                                },
                            ]
                        ]
                },
                layout:'noBorders',
                margin:[0,5,0,5],
            
            },
            //Tabla de información productos 
            {
                id:'table-info-productos',
                table:{
                    widths: [ '25%','10%','10%','10%','10%','15%','10%', '10%' ],
                    body:bodyTableProductos
                },
                margin:[0,5,0,5],
            },
             //Tabla aceptacion cantidades y calidad producto 
            {
                id:'table-check-producto',
                table:{
                    widths: [ '30%','10%','10%','5%','20%', '5%','20%' ],
                    body:[
                        //Aceptación cantidad
                        [
                            {
                                text:'CANTIDAD UNIDADES',
                                alignment:'left',
                                fontSize:8,
                                blod:true,
                                //color:"antiquewhite",
                                //fillColor:"green"
                            },
                            {
                                text:data.inspeccion_turno.length>0?data.inspeccion_turno[0].cantidad_unidades:0 ,
                                alignment:'center',
                                fontSize:8,
                                blod:true
                            },
                            { 
                                text:'CONFORME',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                            },
                            {
                                table:{
                                    widths: [ '100%' ],
                                    body:[
                                        [
                                            {
                                               image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].conforme_cantidades?'check':'uncheck',
                                               alignment:'center',
                                               fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].conforme_cantidades?[8,8]:[25,25],
                                                //fontSize:8,
                                                //blod:true,
                                            },
                                        
                                        ],
                                        
                                    ]
                                },
                            },
                            {
                                text:'NO CONFORME',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                            },
                            {
                                table:{
                                    widths: [ '100%' ],
                                    body:[
                                        [
                                            {
                                               image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].conforme_cantidades?'check':'uncheck',
                                               alignment:'center',
                                               fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].conforme_cantidades?[8,8]:[25,25],
                                                //fontSize:8,
                                                //blod:true,
                                            },
                                        
                                        ],
                                        
                                    ]
                                },
                            },
                            {}
                        ],
                        //Aceptacion Calidad
                        [
                            {
                                text:'CALIDAD',
                                alignment:'left',
                                fontSize:8,
                                blod:true,
                                colSpan:2,
                                //color:"antiquewhite",
                                //fillColor:"green"
                            },
                            {},
                            { 
                                text:'CONFORME',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                            },
                            {
                                table:{
                                    widths: [ '100%' ],
                                    body:[
                                        [
                                            {
                                               image:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].conforme_calidad?'check':'uncheck',
                                               alignment:'center',
                                               fit:data.inspeccion_turno.length>0 && data.inspeccion_turno[0].conforme_calidad?[8,8]:[25,25],
                                                //fontSize:8,
                                                //blod:true,
                                            },
                                        
                                        ],
                                        
                                    ]
                                },
                            },
                            {
                                text:'NO CONFORME',
                                alignment:'center',
                                fontSize:8,
                                blod:true,
                            },
                            {
                                table:{
                                    widths: [ '100%' ],
                                    body:[
                                        [
                                            {
                                               image:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].conforme_calidad?'check':'uncheck',
                                               alignment:'center',
                                               fit:data.inspeccion_turno.length>0 && !data.inspeccion_turno[0].conforme_calidad?[8,8]:[25,25],
                                                //fontSize:8,
                                                //blod:true,
                                            },
                                        
                                        ],
                                        
                                    ]
                                },
                            },
                            {}
                        ],
                       
                       
                        
                    ]
                },
                layout:'noBorders',
                margin:[0,5,0,5],
            
            },
            //Tabla label observaciones
            {
                id:'table-label3',
                table:{
                    widths: [ '100%' ],
                    
                    body:[
                            [
                                {
                                    
                                    //text:`Yo. <u><strong>${data.conductor.nombre }</strong></u> identificado con cédula de ciudadania No. <u><strong>${data.conductor.cedula }</strong></u> expedida en ___________ en mi condición de conductor del vehículo con placas <u><strong>${data.vehiculo.placa}</strong></u>, certifico que el contenido de la presente carga se ajusta a lo declarado en la remisión No. _______ en cuanto cantidad, calidad y peso. De igual forma, manifiesto que <u><strong>Nitrocaribe</strong></u> dispuso las condiciones necesarias para la verificación a conformidad del proceso de cargue y despacho de la mencionada carga.`,
                                    text:[
                                            
                                            { text: `Observaciones:\n\n`,blod:true,decoration: 'underline'},
                                           ,
                                            { text: `${data.inspeccion_turno.length>0?data.inspeccion_turno[0].observaciones:'' }`},
                                         ],
                                    alignment:'justify',
                                    fontSize:8,
                                    //blod:true,
                                        
                                },
                            ]
                        ]
                },
                layout:'noBorders',
                margin:[0,5,0,5],
            
            },

             
         ]
    }

    footer:any =(firmas:any)=> {
       ////////console.log('footer', firmas);
        return {
            
        margin: 8,
        columns: 
          [
            
            //Tabla del autorizador
            {
                table:{
                    widths: [ '50%','50%' ],
                    body:[
                        [
                           //Tabla de fechas
                           {
                               table:{
                                   widths: [ '100%' ],
                                   body:[
                                       
                                       
                                       [
                                           {
                                               /*text:'FIRMA CONDUCTOR',
                                               alignment:'center',
                                               fontSize:8,
                                               blod:true*/
                                               alignment:'center',
                                               image:firmas.conductor,
                                               fit:[100,100],
                                              
                                           }
                                       ],
                                       [
                                            {
                                                text:'Firma y cedula del conductor',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true                       
                                            
                                            }
                                        ]
                                   ]
                               }
                           },
                           //Tabla inspector despacho
                           {
                            table:{
                                widths: [ '100%' ],
                                body:[
                                    
                                    
                                    [
                                        {
                                            /*text:'FIRMA INSPECTO',
                                            alignment:'center',
                                            fontSize:8,
                                            blod:true*/
                                            alignment:'center',
                                            image:firmas.inspector,
                                            fit:[100,100],
                                           
                                        }
                                    ],
                                    [
                                         {
                                             text:'Firma inspector de operaciones',
                                             alignment:'center',
                                             fontSize:8,
                                             blod:true                       
                                         
                                         }
                                     ]
                                ]
                            }
                        },
                            
                        ]
                    ]
                },
                margin:[20,0,30,0],
                layout:'lightHorizontalLines',
                // Tabla separador del autorizador
                /*
                table:{
                    widths: [ '50%','50%' ],
                
                    body:[
                        
                        [
                            {
                                table:{
                                    widths: [ '100%' ],
                                    body:[
                                        
                                        [
                                            {
                                                /
                                                image:firmas.conductor,
                                                fit:[100,100],
                                                alignment:'center'
                                            },
                                            {
                                                text:'Firma y cedula del conductor',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [5, 5],
                                                
                                            },
                                            
                                            
                                        ],
                                        
                                    ]
                                }
                            },
                            {
                                table:{
                                    widths: [ '100%' ],
                                    body:[
                                        
                                        [
                                            {
                                               
                                                image:firmas.inspector,
                                                fit:[100,100],
                                                alignment:'center'
                                            },
                                            {
                                                text:'Firma inspector operaciones',
                                                alignment:'center',
                                                fontSize:8,
                                                blod:true,
                                                margin: [5, 5],
                                                
                                            },
                                            
                                            
                                        ],
                                        
                                    ]
                                }
                            }
                        ]
                    
                    ]
                },
                
                layout:'noBorders',
                */
                
            }
          ]
        }
    }

    images:any = {
        Logo: '',
        //FirmaAutorizador:'',
        check: 'data:image/png;base64,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',
        uncheck:'`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAABYCAIAAAB3ZqVmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAADfSURBVHhe7dMxAQAwEAOh+jedzn8awANvwGUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVsC1fUBYOJv6tIhuAAAAAElFTkSuQmCC`'
    }


    constructor(private solicitudTurnoService:SolicitudTurnoService,
                private functionsService:FunctionsService,
                private almacenesService: AlmacenesService,
                private usuarioService:UsuarioService){}
    
    async generarPDF(data:any):Promise<void>{
        
       ////////console.log('datakey',data.dataKey);
        let datakey = data.dataKey.split('-');
        // let infoTurno$ = this.solicitudTurnoService.getTurnosByID(datakey[1]);
        // let infoTurno = await lastValueFrom(infoTurno$);

        let infoTurno = data


        let locaciones$ = this.almacenesService.getLocaciones()
        let locaciones = await lastValueFrom(locaciones$);

        let locacion = locaciones.filter((localidad: { code: any; })=>localidad.code === infoTurno.locacion);

        ////////console.log('locaciones',locaciones);

        ////////console.log('infoTurno',infoTurno);

        let inspeccion_turno = infoTurno.detalle_solicitud_turnos_inspeccion;

          let historial$ = this.solicitudTurnoService.getHistorialTurnosByID(datakey[1]);
        let historial = await lastValueFrom(historial$);

        

        let inspector$ = this.usuarioService.getInfoUsuario();
        let inspector = await lastValueFrom(inspector$);

        let filesAtach$ = this.functionsService.filesToBase64({id_relacion:inspector.id,
                                                           proceso:'firma',
                                                           entidad:'usuario'});
        let filesAtachByInspector = await lastValueFrom(filesAtach$);

        ////////console.log('filesAtachByInspector',filesAtachByInspector)

        if(filesAtachByInspector.length === 0){
            filesAtachByInspector.push(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAABYCAIAAAB3ZqVmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAADfSURBVHhe7dMxAQAwEAOh+jedzn8awANvwGUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVsC1fUBYOJv6tIhuAAAAAElFTkSuQmCC`)
        }
        
        this.images.Logo = await this.functionsService.convertImagenLocalToBase64('assets/demo/images/logos/nitrofert.png');
       // this.images.FirmaAutorizador = filesAtachByEstadoHistorialTurno[0];
       ////////////console.log(filesAtachByEstadoHistorialTurno[0]);


        //////console.log('inspeccion_turno',inspeccion_turno)

        let fileInspeccion$ = this.functionsService.filesToBase64({id_relacion:inspeccion_turno[0].id,
                                                           proceso:'firma-conductor',
                                                           entidad:'inspeccion-turno'});

        let filesAtachByInspeccion = await lastValueFrom(fileInspeccion$);

       //////////console.log('filesAtachByInspeccion',filesAtachByInspeccion)

        if(filesAtachByInspeccion.length === 0){
            filesAtachByInspeccion.push(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAABYCAIAAAB3ZqVmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAADfSURBVHhe7dMxAQAwEAOh+jedzn8awANvwGUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVkBZAWUFlBVQVsC1fUBYOJv6tIhuAAAAAElFTkSuQmCC`)
        }

     

        let infoUsuario: any = {
            nombre: inspector.nombrecompleto,
            cedula: inspector.numeroid_responsable,
            cargo: inspector.cargo_responsable,
            celular: inspector.numerotelefonico,
            email: inspector.email,
            firma: filesAtachByInspector[0]
        }
        ////////console.log('infoUsuario',infoUsuario);

        let firmas:any = {
            conductor:filesAtachByInspeccion[0],
            inspector:filesAtachByInspector[0]
        }

       ////////console.log(firmas);



      

        let trasnportadora:any = {
            nombre: infoTurno.transportadora.nombre,
            nit: infoTurno.transportadora.nit
        }
        //////////console.log('trasnportadora',trasnportadora);
        let vehiculo:any = {
            placa: infoTurno.vehiculo.placa
        }
        //////////console.log('vehiculo',vehiculo);
        let conductor:any =  {
            nombre: infoTurno.conductor.nombre,
            cedula: infoTurno.conductor.cedula,
            telefono: infoTurno.conductor.numerocelular
        }
        //////////console.log('conductor',conductor);

        let productos:any =  infoTurno.detalle_solicitud_turnos_pedido.filter((pedido: {cantidad: number; CardCode: any; itemcode:string })=>pedido.CardCode === datakey[datakey.length-2] && pedido.cantidad>0 && !pedido.itemcode.startsWith('SF')).map((linea: { pedidonum: any; itemname: any; cantidad: any; municipioentrega: any; lugarentrega: any; CardName:any, lote_produccion:any, toneladas_metircas:any, cantidad_sacos:any, remision:any, cubicacion:any }) => {
            return {
              locacion: `${locaciones.filter((locacion: { code: any; })=>locacion.code === infoTurno.locacion )[0].locacion} -- Dirección: ${locaciones.filter((locacion: { code: any; })=>locacion.code === infoTurno.locacion )[0].direccion}`,
              cliente: `${linea.CardName}`,
              pedidonum: linea.pedidonum,
              itemname: linea.itemname,
              presentacion: '',
              cantidad: linea.cantidad,
              destino: `${linea.municipioentrega} ${linea.lugarentrega}`,
              lote_produccion: `${linea.lote_produccion}`,
              toneladas_metircas:`${linea.toneladas_metircas}`,
              cantidad_sacos:`${linea.cantidad_sacos}`,
              cubicacion:`${linea.cubicacion}`,
              remision:`${linea.remision}`

            }
        })
        //////////console.log('productos',productos);

        let observacionesArray:any = infoTurno.observacion!=""?infoTurno.observacion.split(";"):[];
        
        let observaciones:any = observacionesArray.map((data:any)=>{
            return { observacion:data.trim() };
        })

        //////////console.log('observaciones',observaciones);


        let dataPdf: any = {
            diaSolicitud: inspeccion_turno.length>0? new Date(inspeccion_turno[0].fecha_inspeccion).getDate():'',
            mesSolicitud: inspeccion_turno.length>0? new Date(inspeccion_turno[0].fecha_inspeccion).getMonth() + 1:'',
            anioSolicitud: inspeccion_turno.length>0? new Date(inspeccion_turno[0].fecha_inspeccion).getFullYear():'',
            inspeccion_turno,
            infoUsuario,
            trasnportadora,
            vehiculo,
            conductor,
            productos,
            observaciones,
            observacion:infoTurno.observacion,
            historial:historial.detalle_solicitud_turnos_historial,
            locacion: locacion[0]

        }

        

        let pdfDefinition = {
            pageSize: 'LEGAL',
            pageOrientation: 'portrait',
            pageMargins: [40, 80, 40, 100],
            permissions:this.permissions,
            header:this.header(datakey[1]),
            
            content: this.content(dataPdf),
            footer: this.footer(firmas),
            images:this.images
        }
        
        await this.functionsService.createPDF(pdfDefinition);

    }
     

}

