# Angular Universal

## Rappels

Le principe d'Universal est de faire un rendu côté serveur avec (quasiment) le même code que le client.
Il y a essentiellement deux objectifs : 

 * envoyer le nécessaire (HTML/CSS) au navigateur afin qu'il puisse effectuer un rendu au plus tôt ; 
 * offrir aux robots des moteurs de recherche un contenu statique à analyser.

Si le principe semble assez simple, la mise en oeuvre offre quelques surprises. 

## Mise en place

On prend une application A2 standard : modules, composants, webpack, routage natif. 

    |-- src
        |-- client.ts
        |-- index.html
        |-- app
        |   |-- app-routing.module.ts
        |   |-- app.browser.module.ts
        |   |-- app.component.ts
        |   |-- about
        |   |   |-- about-routing.module.ts
        |   |   |-- about.component.ts
        |   |   |-- about.module.ts
        |   |-- home
        |   |   |-- home-routing.module.ts
        |   |   |-- home.component.ts
        |   |   |-- home.module.ts
        |   |-- layout
        |   |   |-- blabla.component.ts
        |   |   |-- content.component.ts
        |   |   |-- layout.module.ts
        |   |   |-- navbar.component.ts
        |   |-- shared
        |       |-- api.service.ts
        |       |-- shared.module.ts
        |-- assets
            |-- logo.png 

**Les fichiers à remarquer sont :** 

**./src/client.ts** : c'est le point d'entrée pour Webpack, utilisé pour le bootstrap de l'application dans le navigateur et le premier code exécuté. Il va faire le même travail que le main.ts d'une application non-Universal : boostrapper. La différence étant qu'il est prévu pour Universal. 

    import { platformUniversalDynamic } from 'angular2-universal';
    import { MainModule } from './app/app.browser.module';
    const platformRef = platformUniversalDynamic();
    document.addEventListener('DOMContentLoaded', () => {
        platformRef.bootstrapModule(MainModule);
    });

**./src/app/app.browser.module.ts** : le root module de l'application, toujours pour le navigateur. La seule différence avec la version non-Universal réside dans l'import de UniversalModule, isBrowser, isNode. UniversalModule intègre notamment les modules spécifiques au contexte (BrowserModule par exemple).

    import { UniversalModule, isBrowser, isNode } from 'angular2-universal/browser'; 
    @NgModule({
    bootstrap: [ AppComponent ],
    declarations: [ AppComponent ],
    imports: [
        UniversalModule, // BrowserModule, HttpModule, and JsonpModule are included
        // etc.
    ]
    // etc.
    })
    export class MainModule { }


## Ajout de la partie serveur

Comme nous voulons une application Universal, il faut que nous mettions en place un serveur capable de :

 * réceptionner les requêtes ; 
 * renvoyer un rendu construit avec le moteur d'A2 ; 
 * éventuellement faire office d'API.

C'est le travail du fichier **./src/server.ts**, le pendant de **client.ts**.

### Build avec Webpack
Le fichier server.ts sera donc le point d'entrée de Webpack pour la partie serveur.
Le fichier webpack.config.ts exporte donc un tableau avec deux configurations : client et server. Ce qui nous donnera deux fichiers : 

 * ./dist/client/index.ts
 * ./dist/server/index.ts

Il suffira d'exécuter ce dernier pour avoir un serveur fonctionnel.  

### Code server.ts

Le serveur repose sur Express. On enregistre donc un nouveau moteur de rendu avec createEngine. Ce moteur est celui d'Universal, côté serveur. Il est capable de retourner du HTML brut à Express de façon à ce que celui-ci le renvoie au client. 

    import { MainModule } from './app/app.node.module';

    app.engine('.html', createEngine({
        precompile: true,
        ngModule: MainModule, 
    }));
    
    function ngApp(req, res) {
        res.render('index', {
            req,
            res,
            preboot: false,
            baseUrl: '/',
            requestUrl: req.originalUrl,
            originUrl: 'http://localhost:3000'
        });
    }
    app.get('/', ngApp);
    app.get('/about', ngApp);
    
Comme on le voit, le root module donné au moteur de rendu A2 est celui importé depuis **./app.node.module.ts**  
Il s'agit du pendant de app.browser.module.ts. La différence se résume à l'import : 

    // Dans app.browser.module.ts
    import { UniversalModule, isBrowser, isNode } from 'angular2-universal/browser';
    // Dans app.module.ts
    import { UniversalModule, isBrowser, isNode } from 'angular2-universal/node'; 

A partir de là, on est en mesure d'obtenir le rendu de l'application côté serveur et de le renvoyer au client.

## Appels XHR/API

Ca n'est pas seulement un rendu qui est effectué par A2 côté serveur : c'est l'exécution de l'application. Le rendu n'en est que le résultat. Ainsi, si l'application effectue un appel XHR (via le service Http), Universal l'exécutera comme le ferait un navigateur.
Il faut en prévoir les conséquences positives comme négatives : 
 
 * le serveur A2 peut être le même que celui de l'API, ou dans le même sous-réseau. On peut alors profiter d'un gain de performances ; 
 * l'application est exécutée sur le serveur, **mais elle le sera aussi sur le client**. Si on ne gère pas cela, ce sont des doubles appels qui sont effectués !

Pour ce dernier cas, une solution possible consiste à insérer les données lors du rendu sur le serveur :

    <script>
        var myData = {
            users: [ { id: 1234, name: 'Antoine' }, { id: 5678, name: 'Anthony' } ],
            jobs: [ 'developper', 'ux designer']
        }
    </script>

Puis, lorsque les données sont nécessaire, le modèle va d'abord vérifier la présence de ces données, sinon les récupérer par son propre système : 

    getUsers() {
        if (myData && myData.users) {
            return Rx.Observable.from(myData.users);
        }
        return this.http.get('/users').map(res => res.json());
    }

## Savoir si l'on est côté serveur ou côté client

Universal fournit les booléens isBrowser et isNode pour savoir à tout instant si notre code est en train de s'exécuter sur le serveur ou sur le client. Il suffit de les injecter là où c'est nécessaire.  
Attention, ce sont des valeurs et on doit les injecter comme telles.  
Deux méthodes sont possibles : 

### Injection par une string    
    // app.browser.module et app.node.module
    import { UniversalModule, isBrowser, isNode } from 'angular2-universal/node';
    providers: [
        { provide: 'isBrowser' , useValue: isBrowser },
        { provide: 'isNode' , useValue: isNode }
    ]

Puis on injecte avec le décorateur @Inject : 

    export class AppComponent { 
    constructor(
        @Inject('isBrowser') private isBrowser, 
        @Inject('isNode') private isNode) { }
    }

### Injection par OpaqueToken

On définit d'abord les tokens : 

    import { OpaqueToken } from '@angular/core';
    export let IS_BROWSER_TOKEN = new OpaqueToken('isBrowserToken');
    export let IS_NODE_TOKEN = new OpaqueToken('isNodeToken');

On les déclare dans les modules : 

    // app.browser.module et app.node.module
    import { UniversalModule, isBrowser, isNode } from 'angular2-universal/node';
    providers: [
        { provide: IS_BROWSER_TOKEN , useValue: isBrowser },
        { provide: IS_NODE_TOKEN , useValue: isNode }
    ]
    
Et on les injecte : 

    export class AppComponent { 
    constructor(
        @Inject(IS_BROWSER_TOKEN) private isBrowser, 
        @Inject(IS_NODE_TOKEN) private isNode) { }
    }
     
