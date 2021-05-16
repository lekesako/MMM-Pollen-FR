# MMM-Pollen
MagicMirror module to get the pollen.fr forecast for your region code
inspired by WWW-POLLEN https://github.com/vincep5/MMM-Pollen

## Preview
![screenshot1](screenshot1.JPG)

## Using the module
run git clone https://github.com/lekesako/MMM-Pollen-FR from inside your MagicMirror/modules folder

Add `MMM-Pollen-fr` module to the `modules` array in the `config/config.js` file:
````javascript
modules: [
  {
    module: "MMM-Pollen-FR",
    position: "top_left",
    header: "Météo Pollen France",
    config: {
        updateInterval: 3 * 60 * 60 * 1000, // every 3 hours
        region_code: "59",
        minLevel: 0
    }
  },
]
