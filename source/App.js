enyo.kind({
	name: "App",
	kind: "FittableRows",
//	fit: true,
//    classes: "enyo-fit",
    names: [
        "IP / CIDR Mask",
        "Mask",
        "Subnet ID",
        "Broadcast",
        "Wildcard Mask",
        "Number of hosts",
        "First IP",
        "Last IP"
    ],
    results: [],
	components:[
		{kind: "onyx.Toolbar", id: "app", components: [
            {content: "Subnet Calculator"},
            {fit: true},
			{kind: "onyx.Button", content: "Install me", ontap: "installMeTap"}
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
            {kind: "onyx.Groupbox", classes:"box", components: [
                {kind: "onyx.GroupboxHeader", content: "Results"},
                {name: "repeater", kind: "Repeater", count: 8, onSetupItem: "setupItem", components: [
                    {name: "item", classes: "list-item enyo-border-box", components: [
                        {name: "title", classes: "list-title"},
                        {name: "value", classes: "list-result"}
                    ]}
                ]}
            ]}
		]}
	],
    create: function() {
		this.inherited(arguments);
    },
	installMeTap: function(inSender, inEvent) {
		
	},
    setupItem: function(inSender, inEvent) {
        var index = inEvent.index;
        var item = inEvent.item;
        item.$.title.setContent(this.names[index]);
        item.$.value.setContent(this.results[index]);
        return true;
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
            this.results[0] = ip + " / " + octet2cidr(nMask);
            this.results[1] = mask;
            this.results[2] = subnetID(nAddr,nMask);
            this.results[3] = broadcast(nAddr,wildcardMask(nMask).split(".", 4));
            this.results[4] = wildcardMask(nMask);
            this.results[4] = hostCount(nMask);
//            this.results[6] = startingIP(ip, mask);
//            this.results[7] = endingIP(ip, wildcardMask(nMask));
            this.reflow();
        }
        else{
//            this.controller.get('error_msg').update(result);
        }
    }
});
