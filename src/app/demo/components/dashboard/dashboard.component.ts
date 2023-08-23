import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UsuarioService } from '../../service/usuario.service';
import { MessageService } from 'primeng/api';
import { SB1XEService } from '../../service/sb1xe.service';
import { FunctionsService } from '../../service/functions.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormFacturaComponent } from '../reportes/form-factura/form-factura.component';

@Component({
    templateUrl: './dashboard.component.html',
    providers:[MessageService]
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    aceptoPoliticaDatos:boolean = false;
    actualizoPassword:boolean = false;
    modalCambioPassYPolitica:boolean = false;
    tituloModalCambioPassYPolitica:string = "";

    password:string = "";
    password2:string = "";
    submit:boolean = false;
    loading:boolean = false;
    checkedPoliticaDatos:boolean = false;
    info_usuario!:any;

    dashboardCliente:boolean = false;
    clientes:any[] = [];
    clienteSeleccionado:any = []; 
    clientesFiltrados:any[] = [];
    cupoTotal:number = 0;
    cupoDisponible:number = 0;
    carteraVigente:number = 0;
    carteraVencida:number = 0;
    carteraCorriente:number = 0;
    pedidos_abiertos:number = 0;
    saldo_nitrocredit:number = 0;

    facturasPorPagarAgrupada:any[] = [];
    facturasPorPagar:any[] = [];


    constructor(private productService: ProductService, 
                private usuarioService: UsuarioService,
                private messageService: MessageService,
                public layoutService: LayoutService,
                private sb1XEService:SB1XEService,
                private functionsService:FunctionsService,
                public dialogService: DialogService) {
            
            this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
            
        });
    }

    async ngOnInit() {
        
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];


        //Obtener info usuario
        this.info_usuario = await this.usuarioService.infoUsuario();

        console.log(this.info_usuario);
        this.modalCambioPasswordPoliticaDatos();

        if(this.info_usuario.roles.length>0 && this.info_usuario.roles.filter((rol: { nombre: string; }) =>rol.nombre ==='CLIENTE').length>0){
            this.dashboardCliente = true;
            
            let clientes:any =[];
            for(let cliente of this.info_usuario.clientes){
                cliente.label = `${cliente.CardName} - ${cliente.FederalTaxID}`;
                clientes.push(cliente);
            }

            this.clientes = clientes;
            this.clienteSeleccionado = this.clientes[0];

            let saldosClienteSeleccionado = await this.sb1XEService.saldosCupoSocioNegocio(this.clienteSeleccionado.CardCode);
            this.setDashboardCliente(saldosClienteSeleccionado);

            

           
            
        }


    }

    async setDashboardCliente(saldosClienteSeleccionado:any){
        console.log('saldosClienteSeleccionado',saldosClienteSeleccionado);

        let cupo:number =parseFloat(saldosClienteSeleccionado[0].CUPO);

        //Setear Card Cupo total
        this.cupoTotal = cupo;

        //Pedidos abiertos
        this.pedidos_abiertos = parseFloat(saldosClienteSeleccionado[0].PEDIDOS_ABIERTOS);

        //Saldo nitrocredit
        this.saldo_nitrocredit = parseFloat(saldosClienteSeleccionado[0].SALDOLIQUITECH);

        //Cartera vencida
        this.carteraVencida = parseFloat(saldosClienteSeleccionado[0].CARTERAVENCIDA);

        //Cartera corriente
        this.carteraCorriente = parseFloat(saldosClienteSeleccionado[0].CARTERASINVENCER);
        

        //Setear Card Cupo disponible
        let saldoLQ:number = saldosClienteSeleccionado[0].SALDOLIQUITECH==null?0:parseFloat(saldosClienteSeleccionado[0].SALDOLIQUITECH);
        let partidasAbiertas:number = parseFloat(saldosClienteSeleccionado[0].PARTIDASABIERTAS);
        this.cupoDisponible = cupo-(this.pedidos_abiertos+ this.saldo_nitrocredit+  this.carteraVencida +  this.carteraCorriente);
        console.log(this.cupoDisponible);
        //Setear Card Cartera vigente
        this.carteraVigente = partidasAbiertas;
       
        //Setear data pie-chart 
        this.initChart();
        //Setear Tabla facturas
        
        let facturasPorPagar = await this.sb1XEService.facturasSocioNegocio({
            compania:'NITROFERT_PRD',
            cliente:this.clienteSeleccionado.CardCode,
            pagada:'NO'
        });

        facturasPorPagar =(await this.functionsService.objectToArray(facturasPorPagar));
        //console.log(facturasPorPagar);
        this.facturasPorPagar = facturasPorPagar;
        
        let facturasPorPagarAgrupada = await  this.functionsService.groupArray(facturasPorPagar,'DocNum');

        //console.log(facturasPorPagarAgrupada);

        //console.log(Math.ceil(await this.functionsService.dateDif(new Date(), new Date('2023-06-15'), 'days')));

        for(let linea of facturasPorPagarAgrupada){
            linea.diasvencimiento = Math.ceil(await this.functionsService.dateDif(new Date(), new Date(linea.DocDueDate), 'days'));
        }

        console.log(facturasPorPagarAgrupada);

       this.facturasPorPagarAgrupada = facturasPorPagarAgrupada;

       
    }

    verFactura(factura:any){
        let detalleFactura = this.facturasPorPagar.filter(facturaPorPagar => facturaPorPagar.DocNum === factura);
        
      
        const ref = this.dialogService.open(FormFacturaComponent, {
          data: {
              id: parseInt(factura),
              detalleFactura
          },
          header: `${detalleFactura[0].TIPOFAC} - ${detalleFactura[0].DocNum}` ,
          width: '70%',
          height:'auto',
          contentStyle: {"overflow": "auto"},
          maximizable:true, 
        });
      
        ref.onClose.subscribe(() => {
          //this.getVehiculos();
          //////console.log("Refresh calendar");
        });
    }

   async modalCambioPasswordPoliticaDatos(){
        
    
        this.aceptoPoliticaDatos = await this.usuarioService.aceptoPoliticaDatos(this.info_usuario);
        this.actualizoPassword = await this.usuarioService.actualizoPassword(this.info_usuario);

        
        if(!this.aceptoPoliticaDatos || !this.actualizoPassword){

            if(this.actualizoPassword==false && this.aceptoPoliticaDatos==false){
                this.tituloModalCambioPassYPolitica = "Cambio de contraseña y aceptación de politica de tratamientos de datos";
            }else if(this.actualizoPassword==true && this.aceptoPoliticaDatos==false){
                this.tituloModalCambioPassYPolitica = "Aceptación de politica de tratamientos de datos";
            }else if(this.actualizoPassword==false && this.aceptoPoliticaDatos==true){
                this.tituloModalCambioPassYPolitica = "Cambio de contraseña";
            }
            
            this.modalCambioPassYPolitica = true;
        }
    }


    async changePasswordPolitica(){
        this.loading = true;
        let data:any={};
        if(!this.actualizoPassword){
            if(this.password != this.password2){
                this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Las contraseñas ingresados no coinciden'});
                this.loading = false;
            }else{
                data.cambiopassword = 'Y';
                data.password = this.password;
            }
        }

        if(!this.aceptoPoliticaDatos && this.checkedPoliticaDatos){
            data.aceptopoliticadatos = 'Y';
        }

        this.usuarioService.update(data, this.info_usuario.id)
            .subscribe({
                next:(result)=>{
                    console.log(result);
                    this.loading = false;
                    this.modalCambioPassYPolitica = false;
                    this.messageService.add({severity:'success', summary: `Notificación:`, detail: `Se ha actualizado correctamente la información usuario ${result.nombrecompleto}.`});
                },
                error:(error)=>{
                    console.error(error);
                }
            });

    }

    filtrarCliente(event:any){
        let clientesAfiltrar:any = this.clientes;
        /*for(let cliente of this.clientes){
            cliente.label = `${cliente.CardName} - ${cliente.FederalTaxID}`;
            clientesAfiltrar.push(cliente);
        }*/
        this.clientesFiltrados = this.filter(event,clientesAfiltrar);
       
    }

    async seleccionarCliente(clienteSeleccionado:any){
        console.log(clienteSeleccionado);
        let saldosClienteSeleccionado = await this.sb1XEService.saldosCupoSocioNegocio(this.clienteSeleccionado.CardCode);
        this.setDashboardCliente(saldosClienteSeleccionado);
    }

    filter(event: any, arrayFiltrar:any[]) {

        ////////console.log(arrayFiltrar);
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < arrayFiltrar.length; i++) {
            const linea = arrayFiltrar[i];
            if (linea.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                filtered.push(linea);
            }
        }
        return filtered;
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['Cartera corriente', 'Cartera vencida'],

            datasets: [
                {
                    //label: 'First Dataset',
                    data: [this.carteraCorriente, this.carteraVencida],
                    //fill: false,
                    //backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    //borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    //tension: .4

                    backgroundColor: [
                        "#42A5F5",
                        "#FF0000",
                        
                    ],
                    hoverBackgroundColor: [
                        "#64B5F6",
                        "#FF0000",
                        
                    ]
                },
               /* {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }*/
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }



    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
