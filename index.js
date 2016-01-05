var self = require('sdk/self');
var tabs = require('sdk/tabs');
var workers = require('sdk/content/worker');

var {ActionButton} = require('sdk/ui/button/action');
var {openDialog} = require('sdk/window/utils');

var base64 = require('sdk/base64');

var toolbarButton = ActionButton({
    id: 'wallabag-toolbar-button',
    label: 'Bag it !',
    icon: {
        '16': self.data.url('icon-16.png'),
        '32': self.data.url('icon-32.png'),
        '64': self.data.url('icon-64.png')
    }
});

var wallabag = {
    buttonClick: function wallabagButtonClick(state) {
        var worker = tabs.activeTab.attach({
            contentScriptFile: self.data.url('js/wallabag-get-infos.js')
        });

        worker.port.emit('ping');
        worker.port.on('pong', wallabag.postLink);
    },

    postLink: function wallabagPostLink(linkInfo) {
        var wallabagUrl = require('sdk/simple-prefs').prefs.wallabagUrl;
        var height = require('sdk/simple-prefs').prefs.wallabagHeight;
        var width = require('sdk/simple-prefs').prefs.wallabagWidth;

        var url = linkInfo.wallaUrl;
        var title = linkInfo.wallaTitle;
        var description = linkInfo.wallaDescription;

        var GET = [
            'action=add',
            'autoclose=true',
            'url='+base64.encode(url),
        ];

        var features = [
            'height='+height,
            'width='+width,
            'centerscreen=yes',
            'toolbar=no',
            'menubar=no',
            'scrollbars=no',
            'status=no',
            'dialog'
        ];

        openDialog({
            url: wallabagUrl+"?"+GET.join('&'),
            features: features.join(',')
        });
    }
};

toolbarButton.on('click', wallabag.buttonClick);
