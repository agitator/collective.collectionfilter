define([
    'jquery',
    'pat-base',
    'mockup-patterns-contentloader'
], function($, Base, contentloader) {

    'use strict';

    var CollectionFilter = Base.extend({
        name: 'collectionfilter',
        trigger: '.pat-collectionfilter',
        parser: 'mockup',
        contentloader: contentloader,
        defaults: {
            collectionUUID: '',
            collectionURL: '',
            reloadURL: ''
        },

        init: function() {
            this.$el.unbind('collectionfilter:reload');
            this.$el.on('collectionfilter:reload', function (e, data) {
                if (data.collectionUUID === this.options.collectionUUID) {
                    this.reload(data.targetFilterURL);
                }
            }.bind(this));

            // OPTION 1 - filter rendered as links
            $('a.filteritem', this.$el).on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var collectionURL = e.target.closest('a').href;  // strange, it's not the anchor element, but a span.

                $(this.trigger).trigger(
                    'collectionfilter:reload',
                    {
                        collectionUUID: this.options.collectionUUID,
                        targetFilterURL: collectionURL
                    }
                );

                this.reloadCollection(collectionURL + '&ajax_load=1');
            }.bind(this));

            // OPTION 2 - filter rendered as checkboxes
            $('input.filteritem', this.$el).on('change', function (e) {
                var collectionURL = $(e.target).data('url');

                $(this.trigger).trigger(
                    'collectionfilter:reload',
                    {
                        collectionUUID: this.options.collectionUUID,
                        targetFilterURL: collectionURL
                    }
                );

                this.reloadCollection(collectionURL + '&ajax_load=1');
            }.bind(this));

        },

        reload: function (filterURL) {

            var reloadURL = this.options.reloadURL;
            var urlParts = reloadURL.split('?');
            var query1 = urlParts[1] || [];
            var query2 = filterURL.split('?')[1] || [];
            var query = [].concat(query1, query2).join('&');
            reloadURL = [].concat(urlParts[0], query).join('?');

            var cl = new this.contentloader(this.$el, {
                url: reloadURL,
                target: this.$el,
                content: 'aside',
                trigger: 'immediate'
            });
        },

        reloadCollection: function (collectionURL) {
            var cl = new this.contentloader(this.$el, {
                url: collectionURL,
                target: '#content-core',
                content: '#content-core',
                trigger: 'immediate'
            });
        }

    });

    return CollectionFilter;
});
