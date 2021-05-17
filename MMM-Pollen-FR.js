'use strict';

Module.register("MMM-Pollen-FR", {

    result: [],
    // Default module config.
    defaults: {
        updateInterval: 3 * 60 * 60 * 1000, // every 12 hours
        region_code: "75",
        fadeSpeed: 2000,
		minLevel: 0
    },

    start: function() {
		this.sendSocketNotification('SET_CONFIG', this.config);
        this.loaded = false;
        this.getData();
        this.scheduleUpdate();
    },

    getStyles: function() {
        return ["MMM-Pollen-FR.css"];
    },
	
	getHeader: function () {
		var header = this.data.header;
		if (this.config.region_code && typeof(this.config.region_code) !== 'undefined') {
			header += " - " + this.config.region_code
		}
		return header;
	},

    // Override dom generator.
    getDom: function() {
		
        console.log("MMM-Pollen-FR : starting generate DOM ...");
		var minlevel = 0

        if(this.config.minLevel != undefined){
            minlevel = this.config.minLevel;
        }
		
        var wrapper = document.createElement("pollen");

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("Chargement...");
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        
        wrapper.className = 'small bright';

        //header row
        var tbl = document.createElement("table");
		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		td1.innerHTML = " " 
		var td2 = document.createElement("td");
		td2.innerHTML = this.result.countyNumber + " - " +  this.result.countyName + " / Niveau " + this.result.riskLevel
		var level = this.result.riskLevel
		
		if(level >= 5) {
			td2.className = "pollen-high";
		} else if(level >= 4) {
			td2.className = "pollen-mediumhigh";
		} else if(level >= 3) {
			td2.className = "pollen-medium";
		} else if(level >= 2) {
			td2.className = "pollen-lowmedium";
		} else if(level >= 1) {
			td2.className = "pollen-low";
		}
		
		tr.appendChild(td1);
        tr.appendChild(td2);
        tbl.appendChild(tr);
		
        var tr = document.createElement("tr");
        // level description
        var td1 = document.createElement("td");
        td1.className = "pollen-padding";
        var icon1 = document.createElement("span");
        icon1.className = "fa fa-line-chart";

        // pollen
        var td2 = document.createElement("td");
        td2.className = "center";
        var icon2 = document.createElement("span");
        icon2.className = " fa fa-pagelines";

        // td1.appendChild(icon1);
        td1.appendChild(icon1);
        td2.appendChild(icon2);

        // tr.appendChild(td1);
        tr.appendChild(td1);
        tr.appendChild(td2);

        tbl.appendChild(tr);
        console.log("MMM-Pollen-FR : starting generate DOM ...");

        if (this.result && this.result.risks) {
           
            tr.appendChild(td1);
            tr.appendChild(td2);
            tbl.appendChild(tr);
            console.log("MMM-Pollen-FR : generate risks...");
            
            this.result.risks.forEach(function(p) {
                var pollenName = p.pollenName;
                var level = p.level;
                var allergens = [];

                if (level > minlevel) {
                    allergens.push(pollenName);
                
					var td1 = document.createElement("td");
					td1.innerHTML = level;
					var td2 = document.createElement("td");
					td2.innerHTML = allergens.join(", ");

					if(level >= 5) {
						td2.className = "pollen-high";
					} else if(level >= 4) {
						td2.className = "pollen-mediumhigh";
					} else if(level >= 3) {
						td2.className = "pollen-medium";
					} else if(level >= 2) {
						td2.className = "pollen-lowmedium";
					} else if(level >= 1) {
						td2.className = "pollen-low";
					}

					var tr = document.createElement("tr");
					tr.appendChild(td1);
					tr.appendChild(td2);
					
					tbl.appendChild(tr);
				}
            });
        }

        wrapper.appendChild(tbl);
        return wrapper;
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        setInterval(function() {
            self.getData();
        }, nextLoad);
    },

    getData: function () {
        var url = "https://www.pollens.fr/risks/thea/counties/" + this.config.region_code
        this.sendSocketNotification(url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "POLLEN_RESULT") {
            this.result = payload;
            this.loaded = true;
            this.updateDom(this.config.fadeSpeed);
        }
    },
});