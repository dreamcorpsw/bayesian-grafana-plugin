[![Build Status](https://travis-ci.org/dreamcorpsw/bayesian-grafana-plugin.svg?branch=master)](https://travis-ci.org/dreamcorpsw/bayesian-grafana-plugin)
[![Coverage Status](https://coveralls.io/repos/github/dreamcorpsw/bayesian-grafana-plugin/badge.svg)](https://coveralls.io/github/dreamcorpsw/bayesian-grafana-plugin)

# bayesian-grafana-plugin

Repository del gruppo DreamCorp per il progetto di Ingegneria del Software del corso di Informatica dell'Università di Padova A.A 2018/2019.

## Getting Started

Di seguito vengono riportare le istruzioni per la corretta installazione ed esecuzione del plugin.

### Prerequisiti

La prima cosa da fare è installare l'ambiente di Grafana, reperibile direttamente dal sito ufficiale a questo [link](https://grafana.com/get). Al momento la versione che Grafana propone per il download è la 6.0.0, però si consiglia l'utlizzo della versione precendete 5.4.3 in quanto lo sviluppo è stato basato su quest'ultima. Non sono garantite per ora tutte le funzionalità perchè deve essere ancora compiuto un lavoro di controllo della compatibilità.

### Installazione

Una volta scaricato Grafana in locale, per la corretta installazione e utilizzo del plugin seguire i successivi passi:

Scaricare il plugin presente in questo repository all'interno della cartella appropriata.
Le istruzioni su come trovare la cartella appropriata e la sua locazione possono variare in base al sistema operativo, si possono trovare le indicazioni [qui](http://docs.grafana.org/plugins/installation/#grafana-plugin-directory).

Far partire il server di grafana, dopo aver posizionato il plugin all'interno della cartella corretta. L'eseguibile su windows si può trovare nella cartella:

```
grafana/bin/grafana-server
```
Accedere tramite localhost con le credenziali "admin:admin" se è la prima volta, altrimenti con quelle personalizzate.

## Struttura della rete bayesiana

La struttura della rete bayesiana da importare all'interno del plugin deve avere una specifica codica in formato json.
Deve rispettare questa struttura.

```
{
  "id": "net_id",
  "nodi":[
    {
      "id":"node_id",
      "stati":["s1","s2","s3"],
      "soglie":[1,2,3],
      "parents":["parent_id"],
      "cpt": [0.2,0.4,0.4],
      "panel":null
    }
  ]
}
```
--------

## Built With

* [Grafana 5.4.3](https://grafana.com/)


## Authors

* **Davide Ghiotto** - *Progettazione Struttura Plugin* - [Davide Ghiotto](https://github.com/davide97g)
* **Marco Davanzo** - *Setup Test* 
* **Matteo Bordin** - *Revisione Documenti* - [Matteo Bordin](https://github.com/matbord)
* **Davide Liu** - *Implementazione jsbayes*
* **Michele Clerici** - *Gestione input file json* 
* **Pietro Casotto** - *Implementazione Comunicazione InfluxDB*
* **Gianluca Pegoraro** - *Revisione Documenti*
