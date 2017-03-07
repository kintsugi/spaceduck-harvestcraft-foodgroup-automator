# Spaceduck Pam's HarvestCraft FoodGroup Automator

## Documentation and References

* [Link to food group spreadsheet](https://docs.google.com/spreadsheets/d/1Bp4hy2GWIlYOiTbDKCoyHx6OyAghHV_W5j5vJhdGEP0/edit#gid=0)

* Pam's HarvestCraft item json location:

  * [GitHub Link](https://github.com/MatrexsVigil/harvestcraft/tree/3dcae393e37e759be4eeb588f453d64793101a66/src/main/resources/assets/harvestcraft/models/item)
  * Directory location:

```
harvestcraft/src/main/resources/assets/harvestcraft/models/item/
```

* Pam's HarvestCraft language file containing item id -> item name relationship

  * [GitHub Link](https://github.com/MatrexsVigil/harvestcraft/blob/3dcae393e37e759be4eeb588f453d64793101a66/src/main/resources/assets/harvestcraft/lang/en_US.lang)
  * File location:

```
harvestcraft/src/main/resources/assets/harvestcraft/lang/en_US.lang
```

* Output file JSON examples:

```
// Mod Version: 1.3.7
{
  "food": {
    "oredict": [
            "listAllNut"
    ],
    "items": [
    ]
  },

  "name": "Nuts",

  "enabled": true

  "formula":=MAX(0, count/10)

  "color": "white"
}
```


```
// Mod Version: 1.3.7
{
  "food": {
    "oredict": [
    ],
    "items": [
        "harvestcraft:peanutItem"
    ]
  },

  "name": "Nuts",

  "enabled": true

  "formula":=MAX(0, count/10)

  "color": "white"
}
```

* Output file JSON examples:

```
// Mod Version: 1.3.7
{
  "food": {
    "oredict": [
            "listAllNut"
    ],
    "items": [
    ]
  },

  "name": "Nuts",

  "enabled": true

  "formula":=MAX(0, count/10)

  "color": "white"
}
```


```
// Mod Version: 1.3.7
{
  "food": {
    "oredict": [
    ],
    "items": [
        "harvestcraft:peanutItem"
    ]
  },

  "name": "Nuts",

  "enabled": true

  "formula":=MAX(0, count/10)

  "color": "white"
}
```
