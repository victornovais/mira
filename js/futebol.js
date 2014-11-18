// Criando regras a serem usadas por toda a aplicação
var rules = [
    // Regras para carregar landing
    {
        name: 'derrota',
        validate: '$data.ponto == 0'
    },
    {
        name: 'empate',
        validate: '$data.ponto == 1'
    },
    {
        name: 'vitoria',
        validate: '$data.ponto == 3'
    },

    // Regra para definir se é um time
    {
        name: 'isTime',
        validate: '_.has($data, "id")'
    },

    // Regra para definir campeonatos
    {
        name: 'isPlayingBrasileiro',
        validate: '_.has($data, "brasileiro")'
    },
    {
        name: 'isPlayingCopaDoBrasil',
        validate: '_.has($data, "copadobrasil")'
    },
    {
        name: 'isPlayingLibertadores',
        validate: '_.has($data, "libertadores")'
    },

    //Regra para definir mandante dos jogos
    {
        name: 'Mandante',
        validate: '$data.local == "casa"'
    },
    {
        name: 'Visitante',
        validate: '$data.local == "visitante"'
    },

    // Regra para definir dispotivo
    {
        name: 'isMobile',
        validate: '$env.device.mobile == true || $env.device.tablet == true '
    },

    // Regra para definir dispotivo
    {
        name: 'isDesktop',
        validate: '$env.device.desktop == true'
    },

    // Regra para saber se teve penalti
    {
        name: 'Penalti',
        validate: '$data.penaltis_favor != null && $data.penaltis_contra != null'
    }
];

// Definindo quais regras carregam quais interfaces
var selection = [
    {
        when: 'isTime',
        abstract: 'time',
        concrete: 'time'
    }
];

// Interface com hierarquias
var interface_abstracts = [
    // Interface de landing (listagem)
    {
        name: "landing",
        widgets: [{
            name: "container",
            children: [{
                name: "head",
                children: [{name: "title"}]
            },
                {
                    name: "content",
                    children: [{
                        name: "items",
                        datasource: "url:/api/futebol/",
                        children: [{
                            name: "item",
                            children: [{
                                name: "tipo",
                                children: [{
                                    name: "link",
                                    children: [{name: "nome"},
                                        {name: "estado"}]
                                }]
                            }]
                        }]
                    }]
                }]
        }]
    },

    // Interface de time
    {
        name: "time",
        widgets: [{
            name: "display",
            children: [{name: "nome"}]
        },
            {
                name: "content",
                children: [{
                    name: "jogos_box",
                    children: [
                        {
                            name: "jogos_title"
                        },
                        {
                            name: "jogos_lista",
                            children: [{
                                name: "item_box",
                                children: [{
                                    name: "placar",
                                    children: [
                                        {name: "adversario", when:'Visitante'},
                                        {name: "placar_texto"},
                                        {name: "adversario", when:'Mandante'},


                                    ]
                                },
                                {name: "penaltis"}
                                ]
                            }],
                            datasource: "$data.copadobrasil",
                            when: "isPlayingCopaDoBrasil"
                        },
                        {
                            name: "jogos_lista",
                            children: [{
                                name: "item_box",
                                children: [{
                                    name: "placar",
                                    children: [
                                        {name: "adversario", when:'Visitante'},
                                        {name: "placar_texto"},
                                        {name: "adversario", when:'Mandante'},
                                    ]
                                },
                                {name: "penaltis"}
                                ]
                            }],
                            datasource: "$data.brasileiro",
                            when: "isPlayingBrasileiro"
                        },
                        {
                            name: "jogos_lista",
                            children: [{
                                name: "item_box",
                                children: [{
                                    name: "placar",
                                    children: [
                                        {name: "adversario", when:'Visitante'},
                                        {name: "placar_texto"},
                                        {name: "adversario", when:'Mandante'},
                                    ]
                                },
                                    {name: "penaltis"}
                                ]
                            }],
                            datasource: "$data.libertadores",
                            when: "isPlayingLibertadores"
                        }
                    ]
                },
                    {
                        name: "mapa_box",
                        children: [
                            {
                                name: 'mapa'
                            }
                        ]
                    }
                ]
            }]
    }
];

// "HTML" de fato
var concrete_interface = [
    // Interface de landing (listagem)
    {
        name: "landing",
        head: [
            {name: 'main_css', widget:'Head', href:'css/bootstrap.css', tag: 'style'},
            {name: 'viewport', widget:'Meta', content:'width=device-width, initial-scale=1'},
            {name: 'title', widget:'Title', value: '"Futebol"'}
        ],
        maps: [
            { name: "container", class: 'container'},
            { name: "head" , class:'jumbotron'},
            { name: "title", tag:'h1', class: 'text-center', value:'Futebol'},
            { name: "content" , class:'row col-md-10 col-md-offset-1'},
            { name: "items" , class:''},
            { name: "item" , class:'col-md-6'},

            // Validando tipo de acordo com a regra
            { name: "tipo" , class:'panel-body alert-danger alert', when:'derrota'},
            { name: "tipo" , class:'panel-body alert-warning alert', when:'empate'},
            { name: "tipo" , class:'panel-body alert-success alert', when:'vitoria'},

            { name: "link", tag:'a', class:'', href:'navigate("/api/futebol/" + $data.id)'},
            { name: "nome", tag:'p', class:'lead text-center', value:'$data.nome'},
            { name: "estado", tag:'p', class:'text-center', value:'$data.estado'}
        ]
    },

    // Interface de time
    {
        name: "time",
        head: [
            {name: 'main_css', widget:'Head', href:'css/bootstrap.css', tag: 'style'},
            {name: 'viewport', widget:'Meta', content:'width=device-width, initial-scale=1'},
            {name: 'title', widget:'Title', value: '$data.nome'}
        ],
        maps: [
            { name: "display", class:'container jumbotron'},
            { name: "nome", class: 'text-center text-info', value: '$data.nome', tag:'h1' },
            { name: "content", class:'container' },
            { name: "jogos_box", class:'col-md-8' },

            // Interfaces decidindo entre campeonatos
            { name: "jogos_title", class:'text-center', value:'Brasileiro', when:'isPlayingBrasileiro', tag:'h3' },
            { name: "jogos_title", class:'text-center', value:'Copa do Brasil', when:'isPlayingCopaDoBrasil', tag:'h3' },
            { name: "jogos_title", class:'text-center', value:'Libertadores', when:'isPlayingLibertadores', tag:'h3' },

            { name: "jogos_lista", class:'row' },

            // Interfaces decidindo entre perdeu, empatou, ganhou
            { name: "item_box", class:'text-center alert-danger alert', when:'derrota'},
            { name: "item_box", class:'text-center alert-warning alert', when:'empate'},
            { name: "item_box", class:'text-center alert-success alert', when:'vitoria'},


            { name: "placar", value:'', tag:'h4'},

            // Interfaces decidindo como escrever placar de acordo com mandante/visitante
            { name: "placar_texto", value:'[$env.$data.nome, $data.gols_favor, "X", $data.gols_contra].join(" ")', tag:'span', when:'Mandante'},
            { name: "placar_texto", value:'[$data.gols_contra, "X", $data.gols_favor, $env.$data.nome].join(" ")', tag:'span', when:'Visitante'},

            { name: "adversario", value:'" " + $data.contra + " "', tag:'a', href:'navigate("/api/futebol/" + $data.contra_id)'},

            // Interfaces decidindo entre penaltis e ordem da renderização
            {name: "penaltis", when:'Penalti,Mandante', value:'[$data.penaltis_favor, "X", $data.penaltis_contra].join(" ")', tag:'p'},
            {name: "penaltis", when:'Penalti,Visitante', value:'[$data.penaltis_contra, "X", $data.penaltis_favor].join(" ")', tag:'p'},

            { name: "mapa_box", class:'col-md-4'},

            // Interface decidindo entre dispositivos
            { name: "mapa", when:'isDesktop', widget:'MapDynamic', address: '$data.sede', options: {zoom:13}},
            { name: "mapa", when:'isMobile', widget:'MapStatic', value:'$data.sede'}
        ]
    }
];



define([
    // Load our app module and pass it to our definition function
    "jquery",
    "bootstrap",
    'mira/init'
], function ($, $bootstrap, Mira) {

    return function Index() {
        var app = new Mira.Application(interface_abstracts, concrete_interface, rules, selection);
    };

});