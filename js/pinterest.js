"use strict";

require.config({
    baseUrl: 'js',
    paths : {
        nools: 'libs/nools',
        backbone: 'libs/backbone',
        backbone_query: 'libs/backbone.queryparams',
        backbone_querystring_shim: 'libs/backbone.queryparams-1.1-shim',
        backbone_jsynth: 'libs/backbone.jsynth',
        underscore: 'libs/underscore',
        jquery: 'libs/jquery-2.1.0',
        "bootstrap": 'libs/bootstrap',
        text: 'libs/text',
        'string-format': 'libs/string-format',
        'backbone_cache': 'libs/backbone.fetch-cache'
    },
    shim: {
        "underscore": {
            deps: [],
            exports: "_"
        },
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "bootstrap": {
            deps: ["jquery"]
        }
    }
});

var rules = [{
    name: 'DescricaoPequena',
    validate: 'model.description.length < 10'
}];

var interface_abstracts = [
    {
        name:'landing',
        concrete: 'user',
        widgets : {
            name:"main_page", datasource: "url:https://ismaelc-pinterest.p.mashape.com/blogmodak/boards",
            parse: 'data.body',
            children: {"pin" : ['image', 'name']}
        }
    },
    {
        name: 'user' ,
        widgets : {
            name:"main_page", datasource: "url:https://ismaelc-pinterest.p.mashape.com/<%= request.params.id %>/boards",
            parse: 'data.body',
            children: {"pin" : ['image', 'name']}
        }
    }
];

var concrete_interface = [
    {
        name: 'user', maps: [
            { name: 'main_page', widget: 'SimpleHtml', tag:'div' },
            { name: 'pin', widget: 'BootstrapImageBox'},
            { name: 'name', widget: 'SimpleHtml', tag: 'a', class:'caption', value: 'model.name', href:'"http://pinterest.com" + model.href' },
            { name: 'image', widget: 'ImageHtml', value: 'model.src' }
        ]
    }
];


require([
    // Load our app module and pass it to our definition function
    "jquery",
    "bootstrap",
    'jsynth/init'
], function($, $bootstrap, JSynth){

    $.ajaxSetup({
        headers: { "X-Mashape-Authorization": "l3yD2xSglfY3UlsULLZ6FCajEXDQNnPe" }
    });

    var a = new JSynth.Application(interface_abstracts, concrete_interface, rules);
    Backbone.history.start();


});

