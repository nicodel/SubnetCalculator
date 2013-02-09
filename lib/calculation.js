var nAddr = new Array(10,0,0,0);
var nMask = new Array(255,0,0,0);

function calculateIP(ip){
	var a = ip.split('.');
	nAddr[0] = parseInt(a[0]);
	nAddr[1] = parseInt(a[1]);
	nAddr[2] = parseInt(a[2]);
	nAddr[3] = parseInt(a[3]);
//	console.log("nAddr : " + nAddr);
	return nAddr;
}
function calculateSubnet(mask) {
	var a = mask.split('.');
	for (var i=0; i<4; i++){
		nMask[i] = parseInt(a[i]);
	}
	return nMask;
}
function subnetID(aNet,aMask){
	var a = new Array(0,0,0,0);
	for(var i=0;i<4;i++){
		a[i] = aNet[i] & aMask[i];
	}
	return a.join(".");
}
function wildcardMask(aMask){
	var a = new Array(0,0,0,0);
	for(var i=0;i<4;i++){
		a[i] = 255 - aMask[i];
	}
	return a.join(".");
}
function broadcast(aNet,aWild){
	// work around int32
	var a = new Array(0,0,0,0);
	 for(var i=0;i<3;i++){
		a[i] = aNet[i] | aWild[i];
		// a[i] = aNet[i];
	}
	// aWild = aWild.split(".", 4)
	a[3] = aWild[3];
	return a.join(".");
}
function hostCount(aMask) {
	if (octet2cidr(aMask) == -1) {
		return 1;
	} else if (octet2cidr(aMask) == 31){
		/* here we manage the RFC3021 */
		return 3;
	}
	else {
		var bits = 32 - octet2cidr(aMask);
		// get # of addresses in network and subtract 2
		return Math.pow(2,bits) -2;
	}
}
function subnetCount(aMask) {
	if (hostCount(aMask) == 1) {
		return 16777216;
	}else if (hostCount(aMask) == 3) {
		return 16777216 / 2;
	}
	else {
		return 16777216 / (hostCount(aMask) + 2);
	}
}
function octet2cidr(aMask) {
	var mask = octet2dec(aMask);
	// get binary string
	mask = mask.toString(2);
	// return mask length
	return mask.indexOf(0);
}
function cidr2octet(bits){
	var bits = parseInt(bits);
	// make up our mask
	var ones = "11111111111111111111111111111111";
	var mask = parseInt(ones.substring(0, bits), 2);
	var shift = 32 - bits;
	// poor mans bit shift because javascript uses 32 bit integers
	mask = mask * Math.pow(2, shift);
	return dec2octet(mask);
}
function octet2dec(a){
	//alert("octet2dec1 "+a[0]+"\n"+dec2bin(a[0])+"\n"+dec2bin(a[0] * 16777216));
	// poor mans bit shifting (Int32 issue)
	var d = 0;
	d = d + parseInt(a[0]) * 16777216 ;  //Math.pow(2,24);
	d = d + a[1] * 65536;	  //Math.pow(2,16);
	d = d + a[2] * 256;	   //Math.pow(2,8);
	d = d + a[3];
	return d;
}
function dec2octet(d){
	//alert("d="+d+" "+d.toString(2)+"="+d.toString(2).substring(0,8)+"="+parseInt(d.toString(2).substring(0,8),2));
	var zeros = "00000000000000000000000000000000";
	var b = d.toString(2);
	var b = zeros.substring(0,32-b.length) + b;
	var a = new Array(
		parseInt(b.substring(0,8),2)	// 32 bit integer issue (d & 4278190080)/16777216
										//Math.pow(2,32) Math.pow(2,24);
		, (d & 16711680)/65536	  //Math.pow(2,24) - Math.pow(2,16);
		, (d & 65280)/256		 //Math.pow(2,16) - Math.pow(2,8);
		, (d & 255)
		);		  //Math.pow(2,8);
	return a;
}
function checkFieldEntry(ip, mask){
	/* we check if one or both fields are empty,
	 * and return the right message.
	 */
	if (ip == "" && mask == ""){
		return "Specify valid IP address and subnet mask (ex: 192.168.10.1)."
	}
	else if (ip == "" && mask != ""){
		return "Specify a valid IP address (ex: 192.168.10.1).";
	}
	else if (ip != "" && mask == ""){
		return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
	}
	/* we check if fields only contains numbers and dots,
	 * and return an explicit error if it is the case.
	 */
	else if (ip.match(/[^1234567890\.]/i)!=null && mask.match(/[^1234567890\.]/i)!=null){
		return "Specify valid IP address and subnet mask (ex: 192.168.10.1, 255.255.255.0 or 24).";
	}
	else if (ip.match(/[^1234567890\.]/i)!=null && mask.match(/[^1234567890\.]/i)==null){
		return "Specify a valid IP address (ex: 192.168.10.1).";
	}
	else if (ip.match(/[^1234567890\.]/i)==null && mask.match(/[^1234567890\.]/i)!=null){
		return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
	}
	/* we check that both fields are composed of 4 digits separated by dots,
	 * and return an explicit error if it is the case.
	 */
	var i = ip.split(".");
	var m = mask.split(".");
	if (i.length!=4){
		return "Specify a valid IP address (ex: 192.168.10.1).";
	}
	if (m.length!=4 && isNaN(mask) == false){
		var mask = parseInt(mask)
		if (mask<=0 | mask>=33){
			return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
		}
		else{
			mask = cidr2octet(m);
			return mask.join(".")
		}
	}
	for (var x=0; x<4; x++){
		var a = parseInt(i[x])
		var b = m[x]
		if (a<=0 | a>=255){
			return "Specify a valid IP address (ex: 255.255.255.0 or 24).";
		}
		else if (b.match(/0|128|192|224|240|248|252|255/i)==null){
			return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
		}
	}
	/* if nothing is wrong,
	 * return subnet mask
	 */
	return mask
}

function getAdresses(net, nb){
	var list = new Array();
	
	console.log('NET ======= ' + net);
	console.log('NB_HOSTS == ' + nb);
	var ip = 0;
	var ip_1 = parseInt(net[0]);
	var ip_2 = parseInt(net[1]);
	var ip_3 = parseInt(net[2]);
	var ip_4 = parseInt(net[3]);
	for (var i=1; i<=nb; i++){
		if (ip_4 > 254){
			ip_3 = ip_3 + 1;
			ip_4 = 0;
		}
		else if (ip_3 > 254){
			ip_2 = ip_2 + 1;
			ip_3 = 0;
			ip_4 = 0;
		}
		else if (ip_2 > 254){
			ip_1 = ip_1 + 1;
			ip_2 = 0;
			ip_3 = 0;
			ip_4 = 0;
		}
		ip_4 = ip_4 + 1;
		ip = ip + 1;
		var a = new Array(ip_1, ip_2, ip_3, ip_4);
		var new_a = a.join(".");
		list[i-1] = new Array();
		list[i-1]['address'] = new_a;
	}
	return list
}