// export const BASE_URL = "http://192.168.85.100:8003";
export const BASE_URL_TTS = "http://192.168.8.14:7000";
// export const BASE_URL = "http://192.168.85.128:7003";
export const BASE_URL = "http://localhost:7003";

export const AUTH = {
  LOGIN: `${BASE_URL}/api/authlog`,
  LOGINCHECK: `${BASE_URL}/api/authlogcheck`,
  FACEDETECTLOGIN: `${BASE_URL}/api/authenticate`,
  FACEDETECTLOGINMODEL: `${BASE_URL}/api/weights`,
  GETUSERINDIVIDUAL: `${BASE_URL}/api/userindividual`,
  GETUSERATTINV: `${BASE_URL}/api/userattindv`,
  GETUSER: `${BASE_URL}/api/auth`,
  GETAUTHROLE: `${BASE_URL}/api/authroles`,
  LOGOUT: `${BASE_URL}/api/authout`,
  PROJECTLIMIT: `${BASE_URL}/api/projectslimit`,
  TASKSLIMIT: `${BASE_URL}/api/allfiltertask`,
  ALLTASKS: `${BASE_URL}/api/alltasktime`,
  ALLUSERLIMIT: `${BASE_URL}/api/usersalllimit`,
  VERIFYTWOFA: `${BASE_URL}/api/verifytwofa`,
  VERIFYTWOFACHECK: `${BASE_URL}/api/verifytwofacheck`,
  VERIFYVIEWPASSWORD: `${BASE_URL}/api/verification/viewpassword`,
  GETDOCUMENTS: `${BASE_URL}/api/employeedocumentcommonid`,
};






// const approvedpenaltyclienterror = [
//   {
//     _id: ObjectId('67a7427ce4fc1c985db4016b'),
//     project: 'SDS_Quickclaim',
//     category: 'Declination Queue',
//     subcategory: 'PAI KFI Declination Forms (BEM)',
//     loginid: 'HFF021',
//     vendor: 'HFF',
//     company: 'TTS',
//     branch: 'TTS-TRICHY',
//     unit: 'UNIT4',
//     team: 'NITU4',
//     department: 'PROD_Quickclaim',
//     employeename: 'ANANDHI.MANIMARAN',
//     employeeid: 'TT200226691',
//     date: '2025-01-29',
//     documentnumber: '24366DF9253014',
//     documentlink: 'https://dep.smart-data-solutions.com/quickclaim/servlet/quickclaim/template/documentquery%2CdocHistory2.vm/d/3306490687/SDSTOKEN/m5hS1ln5Kdmlq79l',
//     fieldname: 'EMPLOYEE NAME FIRST NAME',
//     line: '1',
//     errorvalue: 'CEDERIC',
//     correctvalue: 'CEDRIC',
//     clienterror: '1',
//     addedby: [
//       {
//         name: 'SAJAHAN.BASHEERUDEEN',
//         date: 'Sat Feb 08 2025 17:09:34 GMT+0530 (India Standard Time)',
//         _id: ObjectId('67a7427ce4fc1c985db4016c')
//       }
//     ],
//     history: [
//       {
//         tablename: 'Client Error Waiver_Current Table',
//         date: '2025-02-14',
//         time: '20:00',
//         status: 'Sent',
//         reason: 'Sir, \n' +
//           'I have keyed wrongly one E extra in name field. this is my careless mistake sir. Here after i will work very careful and avoid this type of errors sir. Please kindly give waiver sir',
//         mode: '',
//         _id: ObjectId('67af538b7323006f02c9d1c5')
//       },
//       {
//         tablename: 'Client Error Forward_Forward',
//         date: '2025-02-14',
//         time: '20:02',
//         status: 'Forward',
//         reason: 'She made spelling mistake in Declination process. I given review to work carefully and avoid errors in this process sir. Please kindly give waiver sir',
//         mode: '',
//         _id: ObjectId('67af54002eed856ea9ed495e')
//       }
//     ],
//     updatedby: [],
//     __v: 0,
//     errorstatus: 'Approved'
//   },
//   {
//     _id: ObjectId('67a7429b9f558541532653cf'),
//     project: 'SDS_Quickclaim',
//     category: 'Declination Queue',
//     subcategory: 'PAI KFI Declination Forms (BEM)',
//     loginid: 'TTS0776',
//     vendor: 'TTS',
//     company: 'TTS',
//     branch: 'TTS-TRICHY',
//     unit: 'UNIT4',
//     team: 'ENRLU4',
//     department: 'PROD_Quickclaim',
//     employeename: 'SHOBANA.RAMALINGAM',
//     employeeid: 'TT180525235',
//     date: '2025-01-29',
//     documentnumber: '24362DF9268028',
//     documentlink: 'https://dep.smart-data-solutions.com/quickclaim/servlet/quickclaim/template/documentquery%2CdocHistory2.vm/d/3299181666/SDSTOKEN/m5hS1ln5Kdmlq79l',
//     fieldname: 'EMPLOYEE NAME FIRST NAME',
//     line: '1',
//     errorvalue: 'RASHAWN',
//     correctvalue: 'DASHAWN',
//     clienterror: '1',
//     addedby: [
//       {
//         name: 'SAJAHAN.BASHEERUDEEN',
//         date: 'Sat Feb 08 2025 17:10:04 GMT+0530 (India Standard Time)',
//         _id: ObjectId('67a7429b9f558541532653d0')
//       }
//     ],
//     history: [],
//     updatedby: [],
//     __v: 0,
//     errorstatus: 'Approved'
//   },
//   {
//     _id: ObjectId('67a743339f5585415327a2ea'),
//     project: 'SDS_Quickclaim',
//     category: 'Declination Queue',
//     subcategory: 'PAI KFI Declination Forms (BEM)',
//     loginid: 'TTS0776',
//     vendor: 'TTS',
//     company: 'TTS',
//     branch: 'TTS-TRICHY',
//     unit: 'UNIT4',
//     team: 'ENRLU4',
//     department: 'PROD_Quickclaim',
//     employeename: 'SHOBANA.RAMALINGAM',
//     employeeid: 'TT180525235',
//     date: '2025-01-29',
//     documentnumber: '24366DF9399001',
//     documentlink: 'https://dep.smart-data-solutions.com/quickclaim/servlet/quickclaim/template/documentquery%2CdocHistory2.vm/d/3306659792/SDSTOKEN/m5hS1ln5Kdmlq79l',
//     fieldname: 'Social Security Number',
//     line: '1',
//     errorvalue: '915879130',
//     correctvalue: '415979130',
//     clienterror: '1',
//     addedby: [
//       {
//         name: 'SAJAHAN.BASHEERUDEEN',
//         date: 'Sat Feb 08 2025 17:12:36 GMT+0530 (India Standard Time)',
//         _id: ObjectId('67a743339f5585415327a2eb')
//       }
//     ],
//     history: [
//       {
//         tablename: 'Client Error Waiver_Current Table',
//         date: '2025-02-25',
//         time: '17:53',
//         status: 'Approved',
//         reason: 'i have misindetify employee employee social security number in i was wrongly keyed in 9 instead 4 correct updated here after i will work more carefully sir',
//         mode: '',
//         _id: ObjectId('67bdb6686d7b83304ad5dd19')
//       }
//     ],
//     updatedby: [],
//     __v: 0,
//     errorstatus: 'Approved'
//   }
// ]