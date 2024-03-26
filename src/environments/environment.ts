// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  
  production: false,
  env:'dev',
  url_backend:'localhost:5001',
  url_ssl:false,
  companySAP:'NITROFERT_PRD',
  companyMySQL:'nitrosap',
  ID_google_analytis:'',
  ID_google_tag:''
  
  /*production: true,
  env:'calidad',
  url_backend:'backend-test-autogestion.nitrofert.com.co',
  url_ssl:false,
  companySAP:'NITROFERT_PRD',
  companyMySQL:'nitrosap'
  */
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
