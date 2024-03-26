
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
  let detallProductos:any[] = [];

  //Armar el detalle de los productos
  for(let producto of data.productos){

    detallProductos.push(
                    {
                        text:producto.locacion,
                        alignment:'center',
                        fontSize:8,
                        blod:true,
                    },
                    {
                        text:producto.pedidonum,
                        alignment:'center',
                        fontSize:8,
                        blod:true,
                    },
                    {
                        text:producto.itemname,
                        alignment:'center',
                        fontSize:8,
                        blod:true,
                    },
                    {
                        text:producto.presentacion,
                        alignment:'center',
                        fontSize:8,
                        blod:true,
                    },
                    {
                        text:producto.cantidad,
                        alignment:'center',
                        fontSize:8,
                        blod:true,
                    },
                    {
                        text:producto.destino,
                        alignment:'center',
                        fontSize:8,
                        blod:true,
                    }
    );

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
            table:{
                widths: [ '25%','10%','20%','10%','10%','25%' ],
                body:[
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
                    detallProductos
                ]
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

