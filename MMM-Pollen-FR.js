'use strict';

Module.register("MMM-Pollen-FR", {

    result: [],
    // Default module config.
    defaults: {
        updateInterval: 12 * 60 * 60 * 1000, // every 12 hours
        region_code: 59,
        fadeSpeed: 2000,
    },

    start: function() {
        this.loaded = false;
        this.getData();
        this.scheduleUpdate();
    },

    getStyles: function() {
        return ["MMM-Pollen-FR.css"];
    },

    // Override dom generator.
    getDom: function() {
        console.log("MMM-Pollen-FR : starting generate DOM ...");
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
        
        // level description
        var td1 = document.createElement("td");
        td1.className = "pollen-padding";
        var icon1 = document.createElement("span");
        icon2.className = "fa fa-line-chart";

        // pollen
        var td2 = document.createElement("td");
        td2.className = "align-left";
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
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerHTML = this.result.riskLevel;
            var td2 = document.createElement("td");
            td2.innerHTML = this.countyName
            
            tr.appendChild(td1);
            tr.appendChild(td2);
            tbl.appendChild(tr);
            console.log("MMM-Pollen-FR : generate risks...");
            
            this.result.risks.forEach(function(p) {
                var pollenName = p.pollenName;
                var level = p.level;
                var allergens = [];

                if (level > 0) {
                    allergens.push(pollenName);
                }

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