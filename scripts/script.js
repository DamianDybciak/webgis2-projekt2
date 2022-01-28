require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/Search",
    "esri/widgets/Measurement",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/renderers/SimpleRenderer"
], (Map, SceneView,FeatureLayer,MapGallery,Expand,Search,Measurement,Legend,LayerList,GraphicsLayer,Graphic,SimpleRenderer) =>{
    
    const layer = new FeatureLayer({
        url:"https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0",
        
    });
    

    let graphLayer = new GraphicsLayer();
    

    
    const map1 = new Map({
        basemap:"osm",
        layers :[ layer,graphLayer]
    });

    

    const view = new SceneView({
        map: map1,
        container: "mapD",
        zoom: 13,
        center :[-112.86,39.08] 
    });


    let query = layer.createQuery();
    query.where = "MAGNITUDE > 4";
    query.outFields = ['*'];
    query.returnGeometry = true;


    layer.queryFeatures(query)
    .then(response=>{
        console.log(response);
        getResults(response.features);

    });


    function getResults(features){
        const symbol ={
            type:'simple-marker',
            color : 'blue',
            size: 15
        };
        
        
        features.map(elem=>{
            elem.symbol = symbol
        });

        graphLayer.addMany(features);

    }


    let simpleRenderer = {
        type : "simple",
        symbol:{
            type:'point-3d',
            symbolLayers:[
                {
                    type: "object",
                    resource:{
                        primitive:"cone"
                    },
                    width :5000
                }
            ]


        },
        visualVariables:[
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [
                    {
                        value: 4.48,
                        color: "red"
                    },{
                        value:0.50,
                        color:"green"
                    }
                ]

            },
            {
                type: "size",
                field: "DEPTH",
                stops:[
                    {
                        value:-3.39,
                        size:20000
                    },
                    {
                        value: 30.57,
                        size:80000
                    }
                ]

            }
        ]
    }

    layer.renderer = simpleRenderer;








});
