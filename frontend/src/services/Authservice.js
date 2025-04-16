// export const BASE_URL = "http://192.168.85.133:7003";
// export const BASE_URL = "http://192.168.85.100:8003";
export const BASE_URL = "http://localhost:7003";
// export const BASE_URL = "http://hilife.ai";
// export const BASE_URL = "http://hihrms.hilifeai.in";
// export const BASE_URL = "http://anubhuthi.org";
// export const BASE_URL = "http://hilifeai.in";
// export const BASE_URL = "http://hrms.ttsbs.com";
// export const BASE_URL = "https://hrms.ttsbs.in";
// export const BASE_URL = "http://hihrms.ttsbusinessservices.com";
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



// const EbserviceMaster = [{

//   company: 'TTS',
//   branch: 'TTS-LALGUDI',
//   unit: 'UNIT3',
//   floor: 'Basement',
//   area: [
//     'EB Room'
//   ],
//   servicenumber: '002',
//   openkwh: '1700',
//   kvah: '1500',

//   servicelog: [
//     {
//       company: 'TTS',
//       branch: 'TTS-LALGUDI',
//       unit: 'UNIT3',
//       floor: 'Basement',
//       area: [
//         'EB Room'
//       ],
//       vendor: '',
//       servicenumber: '002',
//       servicedate: '2025-03-08',
//       startdate: '2025-03-08',
//       enddate: '2025-03-14',
//       kwrs: '',
//       openkwh: '400',
//       kvah: '500',
//     }]
// }]
