({
    init: function () {
        this.$boardList = $('ul.board-body > li')
            .not('.title-line')
            .not('.notice-line')
            .not('.ad-line');

        this._addEvent();
    },
    _addEvent: function () {
        $(document).on('keydown', (function (e) {
            switch (e.which) {
                case 192 : // `
                    this.goToLatestDoc();
                    break;
                case 49 : // 1
                    this.goToPrevDoc();
                    break;
                case 50 : // 2
                    this.goToNextDoc();
                    break;
                case 51 : // 3
                    this.goToPrevPage();
                    break;
                case 52 : // 4
                    this.goToNextPage();
                    break;

            }
            console.log(e.key, e.which);
        }).bind(this));
    },
    goToLatestDoc: function () {
        $.get(
            $('#list_back').attr('onclick').replace(/location.href='(.+)'/, '$1')
            , function (r) {
                location.href = $(r.replace(/src=/gi, 'data-src='))
                    .find('ul.board-body > li')
                    .not('.title-line')
                    .not('.notice-line')
                    .not('.ad-line')
                    .eq(0)
                    .find('a.subject')
                    .attr('href');
            });
    },
    _getCurrentDocIndex: function () {
        for (var i = 0, end = this.$boardList.length; i < end; ++i)
            if (this.$boardList.eq(i).hasClass('list-current-doc'))
                return i;
    }
}).init();