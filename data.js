// exports.get = () => {
//   return {
//     'PLACE-NAME': 'test',
//     'PLACE-ID': 1,
//     SSID: 'free wifi',
//     'VPN-PASSPHRASE': 'asdfasdf',
//     'VPN-USER': 'test',
//     'VPN-PASSWORD': 'test',
//     'PUBLIC-IP': '8.8.8.8',
//     'ISP-GATEWAY': '8.8.8.8',
//     'ISP1-GATEWAY': '8.8.8.8',
//     'ISP2-GATEWAY': '8.8.8.8',
//     'ISP1-ADDRESS': '8.8.8.8',
//     'ISP2-ADDRESS': '8.8.8.8',
//     'MAC-AP1': 'AA:AA:AA:AA:AA:AA',
//     'MAC-AP2': 'AA:AA:AA:AA:AA:AB',
//   };
// };

const AP_PREFIX = '10.5.49.';
const AP_NUM = 100;

exports.get = async () => {
  const values = {};
  await getName(values);
  await getID(values);
  await vpn(values);
  await getInternetConexion(values);
  await getAPs(values);
  console.log('--------------------');
  console.log(values);
  console.log('--------------------');
  return values;
};

const getName = async(values) => {
  const answer = await userInput('Nombre de la red:');
  values['PLACE-NAME'] = answer;
};

const getID = async(values) => {
  const answer = await userInput('Red ya esta registrada en www.accionet.net? ingrese y si esta cualquier otra tecla si esque no');
  let id;
  if (answer === 'y') {
    id = await userInput('Ingrese ID de la red en www.accionet.net');
  } else {
    id = await createPlace(values);
  }
  values['PLACE-ID'] = id;
};

const vpn = async (values) => {
  const answer = await userInput('Configurar VPN para esta red? ingrese y si esta cualquier otra tecla si esque no');
  if (answer !== 'y') return;
  values['VPN-PASSPHRASE'] = await userInput('  Ingrese passphrase:');
  values['VPN-USER'] = await userInput('  Ingrese nombre de usuario:');
  values['VPN-PASSWORD'] = await userInput('  Ingrese contrasena:');
};

const getInternetConexion = async (values) => {
  const answer = await userInput('La conexión a internet se dará por Enlace dedicado?  ingrese y si esta cualquier otra tecla si esque no');
  if (answer === 'y') return dedicatedInternet(values);
};

const dedicatedInternet = async (values) => {
  values['PUBLIC-IP'] = await userInput('  Ingrese IP pública:');
  values['ISP-GATEWAY'] = await userInput('  Ingrese Puerta de Enlace de la IP pública:');
};

const getAPs = async (values) => {
  const answer = await userInput('Desea usar el AP del mismo router?');
  if (answer === 'y') routerAP(values);
  const n = await userInput('Cuantos dispositivos de red desea conectar al router? (AP, switch, controladores, etc)');
  values.numOfAps = parseInt(n, 10);
  for (let i = 0; i < values.numOfAps; i++) {
    await getAP(i, values);
  }
};

const routerAP = async (values) => {
  values.SSID = await userInput('  Ingrese Nombre de la señal de wifi(SSID):');
  values.hasRouterAp = true;
};

const getAP = async (values, i) => {
  const macKey = `MAC-AP${i}`;
  const ipKey = `IP-AP${i}`;
  values[macKey] = await userInput(`  Ingrese dirección mac del dispotivo num ${i}:`);
  values[ipKey] = getAP_IP(i);
};

function getAP_IP(i) {
  return AP_PREFIX + (AP_NUM + i);
}


const createPlace = () => {
  return 1;
};

const responses = ['testing', 'n', '0', 'y', 'passphrase', 'vpnuser', 'vpnpassword', 'n', 'n', 2, 'AA:AA:AA:AA:AA:AA', 'AA:AA:AA:AA:AA:AB'];
let i = 0;
const userInput = async (question) => {
  console.log(question);
  const ans = responses[i];
  i++;
  console.log('user:', ans);
  return ans;
};
