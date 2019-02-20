import './sass/grafana-zabbix.dark.scss';
import './sass/grafana-zabbix.light.scss';

import {DreamCorpAppConfigCtrl} from './components/config';
import {loadPluginCss} from 'grafana/app/plugins/sdk';
import {addNetCtrl} from "./components/addNetCtrl";

loadPluginCss({
    dark: 'plugins/dreamcorp-app/css/grafana-zabbix.dark.css',
    light: 'plugins/dreamcorp-app/css/grafana-zabbix.light.css'
});

export {
    DreamCorpAppConfigCtrl as ConfigCtrl,
    addNetCtrl
};
