enyo.kind({
	name: "App",
	kind: "FittableRows",
//	fit: true,
//    classes: "enyo-fit",
    results: [],
	components:[
		{kind: "onyx.Toolbar", id: "app", components: [
            {id: "title", content: "Subnet Calculator"},
//            {fit: true},
			{kind: "onyx.WebAppButton", id: "install-button"}
		]},
		{kind: "enyo.Scroller", touch:true, fit: true, components: [
            {kind: "onyx.Groupbox", classes:"box", components: [
                {kind: "onyx.GroupboxHeader", content: "IP / Subnet information"},
                {kind: "onyx.InputDecorator", classes:"entry", components: [
                    {name: "ipInput", kind: "onyx.Input", placeholder: "Enter IP adress", onchange:"inputChanged"}
                ]},
                {kind: "onyx.InputDecorator", classes:"entry", components: [
                    {name: "maskInput", kind: "onyx.Input", placeholder: "Enter subnet mask", onchange:"inputChanged"}
                ]},
                {kind:"onyx.Button", content: "Calculate", classes: "onyx-dark calc-button", ontap:"calcTapped"}
            ]},
            {kind: "onyx.Groupbox", name: "c_results", classes:"box", components: [
                {kind: "onyx.GroupboxHeader", content: "Results"},
                {kind: "FittableColumns", classes: "list-item", components: [
                    {name: "l_ip", classes: "list-label", content: "IP / CIDR Mask"},
                    {name: "r_ip", classes: "list-result", content: ""}
                ]},
                {kind: "FittableColumns", classes: "list-item", components: [
                    {name: "l_mask", classes: "list-label", content: "Mask"},
                    {name: "r_mask", classes: "list-result", content: ""}
                ]},
                {kind: "FittableColumns", classes: "list-item", components: [
                    {name: "l_subnet", classes: "list-label", content: "Subnet ID"},
                    {name: "r_subnet", classes: "list-result", content: ""}
                ]},
                {kind: "FittableColumns", classes: "list-item", components: [
                    {name: "l_broad", classes: "list-label", content: "Broadcast"},
                    {name: "r_broad", classes: "list-result", content: ""}
                ]},
                {kind: "FittableColumns", classes: "list-item", components: [
                    {name: "l_wild", classes: "list-label", content: "Wildcard Mask"},
                    {name: "r_wild", classes: "list-result", content: ""}
                ]},
                {kind: "FittableColumns", classes: "list-item", components: [
                    {name: "l_nb", classes: "list-label", content: "Number of hosts"},
                    {name: "r_nb", classes: "list-result", content: ""}
                ]},
                {kind: "FittableColumns", classes: "list-item", components: [
                    {name: "l_first", classes: "list-label", content: "First IP"},
                    {name: "r_first", classes: "list-result", content: ""}
                ]},
                {kind: "FittableColumns", classes: "list-item", components: [
                    {name: "l_last", fit: true, classes: "list-label", content: "Last IP"},
                    {name: "r_last", classes: "list-result", content: ""}
                ]}
            ]}
		]},
        {name: "popup", kind: "onyx.Popup", centered: true, floating: true, classes:"popup", content: ""},
	],
    create: function() {
		this.inherited(arguments);
    },
	installMeTap: function(inSender, inEvent) {
		
	},
    calcTapped: function(inSender, inEvent) {
//        this.controller.get('error_msg').update("");
        var ip = this.$.ipInput.getValue();
        var mask = this.$.maskInput.getValue();
        var result = checkFieldEntry(ip, mask);
        //console.log(result);

        if (result[0] != "S"){
            mask = result;
            nAddr = calculateIP(ip);
            nMask = calculateSubnet(mask);
            this.$.r_ip.setContent(ip + " / " + octet2cidr(nMask));
            this.$.r_mask.setContent(mask);
            this.$.r_subnet.setContent(subnetID(nAddr,nMask));
            this.$.r_broad.setContent(broadcast(nAddr,wildcardMask(nMask).split(".", 4)));
            this.$.r_wild.setContent(wildcardMask(nMask));
            this.$.r_nb.setContent(hostCount(nMask));
            this.$.r_first.setContent(startingIP(ip, mask));
            this.$.r_last.setContent(endingIP(ip, wildcardMask(nMask)));
        }
        else{
            this.$.popup.setContent(result);
            this.$.popup.show();
//            this.controller.get('error_msg').update(result);
        }
    }
});