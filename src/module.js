import './sass/grafana-dreamcorp.dark.scss';
import './sass/grafana-dreamcorp.light.scss';

import {DreamCorpAppConfigCtrl} from './components/config';
import {ImportNetCtrl} from './components/importNet';
import {Control} from './components/control';
import {loadPluginCss} from 'grafana/app/plugins/sdk';

loadPluginCss({
    dark: 'plugins/dreamcorp-app/css/grafana-zabbix.dark.css',
    light: 'plugins/dreamcorp-app/css/grafana-zabbix.light.css'
});

export {
    DreamCorpAppConfigCtrl as ConfigCtrl,
    ImportNetCtrl, Control
};
