const PhpSchool = {
    init: function () {
        console.log('PhpSchool.js is injected');

        // 남은 게임 횟수
        this.game_count = Common.getWebVar('game_count').game_count;
        // 무승부를 제외한 진행 횟수
        this.result_count = 0;
        // 도전 포인트
        this.game_point = 50;
        // 결과 모음
        this.game_result = [];
        // 이벤트(Enter)
        let _this = this;
        jQuery(document).on('keypress', (function (e) {
            if (e.which !== 13 || !confirm('가위바위보 !')) {
                return;
            }
            console.log('게임시작 : ' + _this.game_count + '회');
            _this.action();
        }).bind(this));
    },

    action: function () {
        const url = '/community/rock_paper_scissors_ajax.php';
        const data = {
            user: 'R',
            val: this.game_point
        };
        jQuery.post(url, data, this.response.bind(this), 'json');
    },

    response: function (r) {
        if (r.mode === 'safe') {
            //console.log((this.result_count+1) + '/' + this.game_count, '무!');
        } else if (r.mode === 'win') {
            ++this.result_count;
            switch (r.bonus) {
                case '1' :
                    r.multiple = 1;
                    break;
                case '2' :
                    r.multiple = 3;
                    break;
                case '3' :
                    r.multiple = 2;
                    break;
                case '4' :
                    r.multiple = 4;
                    break;
                case '5' :
                    r.multiple = 1;
                    break;
                case '6' :
                    r.multiple = 3;
                    break;
                case '7' :
                    r.multiple = 2;
                    break;
                case '8' :
                    r.multiple = 4;
                    break;
            }
            console.log(this.result_count + '/' + this.game_count, '승! ' + r.multiple + '배!');
        } else if (r.mode === 'lose') {
            ++this.result_count;
            console.log(this.result_count + '/' + this.game_count, '패!');
        } else {
            console.log('error', r);
            return;
        }
        this.game_result.push(r);

        if (this.result_count < this.game_count)
            setTimeout(this.action.bind(this), 1000);
        else
            this.game_end();
    },

    game_end: function () {
        console.table(this.game_result);
        let report = {};
        report['포인트사용'] = 0;
        report['포인트획득'] = 0;
        report['포인트수익'] = 0;
        report['수익률'] = 0;
        report['게임횟수'] = 0;
        report['승'] = 0;
        report['패'] = 0;
        report['무'] = 0;
        for (let i = 0, end = this.game_result.length; i < end; ++i) {
            let row = this.game_result[i];
            if (row.mode === 'safe') {
                ++report['무'];
            } else if (row.mode === 'win') {
                ++report['승'];
                report['포인트사용'] += this.game_point;
                report['포인트획득'] += this.game_point * row.multiple;
            } else if (row.mode === 'lose') {
                ++report['패'];
                report['포인트사용'] += this.game_point;
            }
        }
        report['포인트수익'] = report['포인트획득'] - report['포인트사용'];
        report['수익률'] = Math.round(report['포인트수익'] / report['포인트사용'] * 1000) / 10;
        report['게임횟수'] = this.game_result.length - report['무'];
        report['승비율'] = Math.round(report['승'] / report['게임횟수'] * 1000) / 10;
        report['패비율'] = Math.round(report['패'] / report['게임횟수'] * 1000) / 10;

        let text = [];
        text.push('포인트사용 : ' + report['포인트사용']);
        text.push('포인트획득 : ' + report['포인트획득']);
        text.push('포인트수익 : ' + report['포인트수익']);
        text.push('수익률 : ' + report['수익률'] + '%');
        text.push('');
        text.push('시도 : ' + report['게임횟수']);
        text.push('승 : ' + report['승'] + '(' + report['승비율'] + '%)');
        text.push('패 : ' + report['패'] + '(' + report['패비율'] + '%)');
        console.log(text.join("\n"));
    }
};
PhpSchool.init();