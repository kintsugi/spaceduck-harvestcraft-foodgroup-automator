let fs = require('fs')
let log = require('winston')
let tsv = require('tsv')
let dirTree = require('directory-tree')
let jsonfile = require('jsonfile')
const config = require('./config')
const itemNameRegex = /^item\.(.*)\.name\=(.*)/gm
jsonfile.spaces = 4

class FoodGroupAutomator {
  constructor(options) {
    this.options = options
    this.itemIdData = {}
    this.itemNames = []
    this.itemDict = {}
    this.loadItemData()
    this.loadItemNames()
    this.loadFoodGroups()

  }

  loadItemData() {
    let jsonDir = dirTree(config.itemJsonDir, ['.json'])
    for(let jsonFile of jsonDir.children) {
      if(jsonFile.extension == '.json') {
        let itemDataRaw = JSON.parse(fs.readFileSync(jsonFile.path, 'utf8'))
        if(!itemDataRaw.textures) {
          continue
        }
        let itemDataArr = itemDataRaw.textures.layer0.split('/')
        if(itemDataArr.length == 2) {
          let itemIdData = {
            prefix: itemDataArr[0],
            id: itemDataArr[1],
          }
          this.itemIdData[itemIdData.id] = itemIdData
        } else {
          log.debug('ItemDataRaw.textures.layer0 did not split into 2 parts.', itemDataRaw)
        }
      }
    }

  }

  loadItemNames() {
    let langFile = fs.readFileSync(config.languageFilePath).toString().split("\n")
    for(let line of langFile) {
      let equalSplit = line.split('=')
      if(equalSplit.length == 2) {
        let periodSepString = equalSplit[0]
        let itemName = equalSplit[1].trim()
        let periodSplit = periodSepString.split('.')
        if(periodSplit.length == 3 && periodSplit[0] == 'item') {
          let itemId = periodSplit[1]
          let itemIdData = this.itemIdData[itemId]
          if(itemIdData) {
            let itemNameData = {
              predix: itemIdData.prefix,
              id: itemIdData.id,
              name: itemName,
            }
            this.itemDict[itemName] = itemNameData
          }
        }
      }
      /*if(matches) {*/
        //let itemId = matches[1]
        //let itemName = matches[2]
        //let itemIdData = this.itemIdData[itemId]
        //if(itemIdData) {
          //let itemNameData = {
            //predix: itemIdData.prefix,
            //id: itemIdData.id,
            //name: itemName,
          //}
          //this.itemDict[itemName] = itemNameData
        //} 
      /*}*/


    }
  }

  loadFoodGroups() {
    let foodGroupingFile = fs.readFileSync(config.foodGroupingFilePath).toString()
    let foodGroupingTable = tsv.parse(foodGroupingFile)
    foodGroupingTable = foodGroupingTable.slice(1, foodGroupingTable.length)

    let defaultColumnValue = 50
    let defaultRowValue = 10
    let columnKeyDict = {}
    let categoryValues = {}
    let headerRow = foodGroupingTable[0]
    let headerRowKeys = Object.keys(headerRow)

    let getNamesInRow = (row) => {
      let names = []
      for(let key in row) {
        let entry = row[key]
        if(entry != '') {
          let entryNames = entry.split(',')
          for(let name of entryNames) {
            if(name != '') {
              names.push(name.trim())
            }
          }
        }
      }
      console.log(names)
      return names.splice(0, names.length)
    } 

    let getNamesInColumn = (table, colKey) => {
      let colEntries = []
      let names = []
      for(let row of table) {
        if(row[colKey]) {
          colEntries.push(row[colKey])
        }
      }
      for(let entry of colEntries) {
        if(entry != '') {
          let entryNames = entry.split(',')
          for(let name of entryNames) {
            if(name != '') {
              names.push(name.trim())
            }
          }
        }
      }
      return names.splice(1, names.length - 1)
    }

    let getNamesInCategory = (category, table) => {
      if(columnKeyDict[category]) {
        return getNamesInColumn(table, columnKeyDict[category])
      } else {
        for(let row of table) {
          if(row[0].trim() == category) {
            return getNamesInRow(row)
          }
        }
      }
    }
    
    for(let key of headerRowKeys) {
      columnKeyDict[headerRow[key]] = key
      if(key.indexOf('%') != -1) {
        let value = parseInt(key.replace(/\%/g, ''))
        categoryValues[headerRow[key]] = value
      } else if(headerRow[key] != ''){
        categoryValues[headerRow[key]] = defaultColumnValue
      }
    }

    for(let row of foodGroupingTable) {
      if(row[0] != '') {
        categoryValues[row[0].trim()] = defaultRowValue
      }
    }

    let categories = Object.keys(categoryValues)
    let allNames = Object.keys(this.itemDict)
    for(let name of allNames) {
    }
    for(let category of categories) {
      let names = getNamesInCategory(category, foodGroupingTable)
      let categoryItemData = []
      for(let name of names) {
        let itemData = this.itemDict[name]
        if(itemData) {
          categoryItemData.push(itemData)
        }
      }
      if(categoryItemData.length) {
        this.generateJson(category, categoryValues[category], categoryItemData)
      }
    }

  }

  generateJson(category, value, itemDataArr) {
    let obj = {
      food: {
        oredict: [

        ],
        items: [

        ]
      },
      name: category,
      enabled: true,
      formula: `MAX(0,1-(count*${value/100}))`,
      color: 'white',
    }
    for(let itemData of itemDataArr) {
      obj.food.items.push('harvestcraft:' + itemData.id)
    }
    jsonfile.writeFileSync(config.outputDir + category.replace(/\//g, "_") + '.json', obj, {flags: 'w+'})
  }
}

module.exports = FoodGroupAutomator
